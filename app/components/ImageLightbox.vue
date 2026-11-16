<script setup lang="ts">
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from 'lucide-vue-next'
import type { ProjectImage } from '~/content/projects'

// Visor de capturas a pantalla completa: navegación (flechas, swipe), zoom (rueda, doble clic,
// pellizco, botones) y arrastre para moverse por la imagen ampliada. v-model = índice abierto o null.
const props = defineProps<{ images: ProjectImage[] }>()
const index = defineModel<number | null>({ default: null })

const MIN = 1
const MAX = 5
const STEP = 1.5

const dialog = ref<HTMLDialogElement | null>(null)
const stage = ref<HTMLElement | null>(null)
const img = ref<HTMLImageElement | null>(null)

const scale = ref(1)
const tx = ref(0)
const ty = ref(0)
const dragging = ref(false)

const current = computed(() => (index.value === null ? null : props.images[index.value] ?? null))
const total = computed(() => props.images.length)
const zoomed = computed(() => scale.value > 1.01)

const reset = () => {
  scale.value = 1
  tx.value = 0
  ty.value = 0
}

// Evita que la imagen ampliada se salga por completo del visor
const clamp = () => {
  const el = img.value
  if (!el) return
  const maxX = Math.max(0, (el.offsetWidth * scale.value - el.offsetWidth) / 2)
  const maxY = Math.max(0, (el.offsetHeight * scale.value - el.offsetHeight) / 2)
  tx.value = Math.min(maxX, Math.max(-maxX, tx.value))
  ty.value = Math.min(maxY, Math.max(-maxY, ty.value))
}

// Zoom manteniendo fijo el punto (px, py), relativo al centro del visor
const zoomTo = (next: number, px = 0, py = 0) => {
  const s = Math.min(MAX, Math.max(MIN, next))
  if (s === MIN) return reset()
  tx.value = px - (s * (px - tx.value)) / scale.value
  ty.value = py - (s * (py - ty.value)) / scale.value
  scale.value = s
  clamp()
}

const fromCenter = (clientX: number, clientY: number) => {
  const r = stage.value!.getBoundingClientRect()
  return [clientX - (r.left + r.width / 2), clientY - (r.top + r.height / 2)] as const
}

const go = (delta: number) => {
  if (index.value === null || total.value < 2) return
  index.value = (index.value + delta + total.value) % total.value
}

const close = () => {
  index.value = null
}

// Abrir / cerrar el <dialog> nativo (Esc, foco atrapado y fondo inerte vienen gratis)
watch(index, (value, previous) => {
  reset()
  const el = dialog.value
  if (!el) return
  if (value !== null && previous === null) {
    el.showModal()
    document.documentElement.style.overflow = 'hidden'
  } else if (value === null && el.open) {
    el.close()
  }
})

const onDialogClose = () => {
  document.documentElement.style.overflow = ''
  index.value = null
}

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
})

const onKeydown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') go(1)
  else if (e.key === 'ArrowLeft') go(-1)
  else if (e.key === '+' || e.key === '=') zoomTo(scale.value * STEP)
  else if (e.key === '-') zoomTo(scale.value / STEP)
  else if (e.key === '0') reset()
  else return
  e.preventDefault()
}

const onWheel = (e: WheelEvent) => {
  const [px, py] = fromCenter(e.clientX, e.clientY)
  zoomTo(scale.value * Math.exp(-e.deltaY * 0.0015), px, py)
}

const onDoubleClick = (e: MouseEvent) => {
  if (zoomed.value) return reset()
  const [px, py] = fromCenter(e.clientX, e.clientY)
  zoomTo(2.5, px, py)
}

// Punteros: 1 dedo/mouse = mover (o swipe si no hay zoom); 2 dedos = pellizco
const pointers = new Map<number, { x: number; y: number }>()
let start = { x: 0, y: 0, tx: 0, ty: 0 }
let pinch = { dist: 0, scale: 1 }
let startedOnBackdrop = false

const distance = () => {
  const [a, b] = [...pointers.values()]
  return Math.hypot(a!.x - b!.x, a!.y - b!.y)
}

const onPointerDown = (e: PointerEvent) => {
  if ((e.target as HTMLElement).closest('button')) return
  stage.value?.setPointerCapture(e.pointerId)
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
  if (pointers.size === 1) {
    start = { x: e.clientX, y: e.clientY, tx: tx.value, ty: ty.value }
    startedOnBackdrop = e.target === stage.value
    dragging.value = true
  } else if (pointers.size === 2) {
    pinch = { dist: distance(), scale: scale.value }
  }
}

const onPointerMove = (e: PointerEvent) => {
  if (!pointers.has(e.pointerId)) return
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })

  if (pointers.size === 2) {
    const [a, b] = [...pointers.values()]
    const [px, py] = fromCenter((a!.x + b!.x) / 2, (a!.y + b!.y) / 2)
    zoomTo(pinch.scale * (distance() / pinch.dist), px, py)
  } else if (pointers.size === 1 && zoomed.value) {
    tx.value = start.tx + (e.clientX - start.x)
    ty.value = start.ty + (e.clientY - start.y)
    clamp()
  }
}

const onPointerUp = (e: PointerEvent) => {
  if (!pointers.has(e.pointerId)) return
  pointers.delete(e.pointerId)
  if (pointers.size === 1) {
    const [p] = [...pointers.values()]
    start = { x: p!.x, y: p!.y, tx: tx.value, ty: ty.value }
    return
  }
  if (pointers.size > 0) return
  dragging.value = false

  const dx = e.clientX - start.x
  const dy = e.clientY - start.y
  // Sin zoom: swipe horizontal cambia de captura; un toque en el fondo cierra
  if (!zoomed.value && e.type === 'pointerup') {
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1)
    else if (Math.abs(dx) < 6 && Math.abs(dy) < 6 && startedOnBackdrop) close()
  }
}
</script>

<template>
  <dialog
    ref="dialog"
    class="lightbox"
    aria-label="Visor de capturas"
    @close="onDialogClose"
    @keydown="onKeydown"
  >
    <template v-if="current">
      <div class="lightbox__bar">
        <p class="font-meta text-sm" aria-live="polite">{{ (index ?? 0) + 1 }} / {{ total }}</p>
        <div class="flex items-center gap-1">
          <button type="button" class="lightbox__btn" :disabled="scale <= MIN" aria-label="Alejar" @click="zoomTo(scale / STEP)">
            <Minus class="h-4 w-4" aria-hidden="true" />
          </button>
          <span class="font-meta w-12 text-center text-xs">{{ Math.round(scale * 100) }}%</span>
          <button type="button" class="lightbox__btn" :disabled="scale >= MAX" aria-label="Acercar" @click="zoomTo(scale * STEP)">
            <Plus class="h-4 w-4" aria-hidden="true" />
          </button>
          <button type="button" class="lightbox__btn" :disabled="!zoomed" aria-label="Restablecer zoom" @click="reset">
            <RotateCcw class="h-4 w-4" aria-hidden="true" />
          </button>
          <span class="mx-1 h-5 w-px bg-white/20" aria-hidden="true"></span>
          <button type="button" class="lightbox__btn" aria-label="Cerrar" autofocus @click="close">
            <X class="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div
        ref="stage"
        class="lightbox__stage"
        :class="{ 'is-zoomed': zoomed, 'is-dragging': dragging }"
        @wheel.prevent="onWheel"
        @dblclick="onDoubleClick"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
      >
        <img
          ref="img"
          :key="current.src"
          :src="current.src"
          :width="current.width"
          :height="current.height"
          :alt="current.alt"
          class="lightbox__img"
          :style="{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }"
          draggable="false"
        />

        <template v-if="total > 1">
          <button type="button" class="lightbox__btn lightbox__nav lightbox__nav--prev" aria-label="Captura anterior" @click="go(-1)">
            <ChevronLeft class="h-6 w-6" aria-hidden="true" />
          </button>
          <button type="button" class="lightbox__btn lightbox__nav lightbox__nav--next" aria-label="Captura siguiente" @click="go(1)">
            <ChevronRight class="h-6 w-6" aria-hidden="true" />
          </button>
        </template>
      </div>

      <p class="lightbox__caption">{{ current.alt }}</p>
    </template>
  </dialog>
</template>

<style scoped>
.lightbox {
  width: 100vw;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: rgba(5, 6, 8, 0.94);
  color: #fff;
}

.lightbox[open] {
  display: flex;
  flex-direction: column;
  animation: lightbox-in 220ms var(--ease-brand);
}

.lightbox::backdrop {
  background: transparent;
}

.lightbox__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.75rem 1rem;
}

.lightbox__stage {
  position: relative;
  display: grid;
  /* Fila y columna acotadas al visor: si no, la fila crece al alto real de la imagen
     (p. ej. capturas de celular de 1600 px) y el overflow la recorta */
  grid-template: minmax(0, 1fr) / minmax(0, 1fr);
  flex: 1;
  min-height: 0;
  place-items: center;
  overflow: hidden;
  padding: 0 1rem;
  touch-action: none;
  cursor: zoom-in;
  user-select: none;
}

.lightbox__stage.is-zoomed { cursor: grab; }
.lightbox__stage.is-zoomed.is-dragging { cursor: grabbing; }

.lightbox__img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: var(--radius-card-sm);
  transform-origin: center;
  transition: transform 180ms var(--ease-brand);
  will-change: transform;
}

.is-dragging .lightbox__img { transition: none; }

.lightbox__caption {
  padding: 0.75rem 1rem 1.25rem;
  text-align: center;
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.75);
}

.lightbox__btn {
  display: inline-grid;
  width: 2.5rem;
  height: 2.5rem;
  place-items: center;
  border-radius: 999px;
  color: #fff;
  transition: background-color 180ms var(--ease-brand), opacity 180ms var(--ease-brand);
}

.lightbox__btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.12); }
.lightbox__btn:disabled { opacity: 0.35; cursor: default; }
.lightbox__btn:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

.lightbox__nav {
  position: absolute;
  top: 50%;
  width: 3rem;
  height: 3rem;
  translate: 0 -50%;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(6px);
}

.lightbox__nav--prev { left: 1rem; }
.lightbox__nav--next { right: 1rem; }

.is-zoomed .lightbox__nav { opacity: 0.4; }

@media (max-width: 640px) {
  .lightbox__nav { display: none; }
}

@keyframes lightbox-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .lightbox[open] { animation: none; }
  .lightbox__img { transition: none; }
}
</style>
