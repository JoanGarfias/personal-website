<template>
  <section :id="props.sectionId" class="section-space relative">
    <div class="grid grid-cols-1 gap-12 xl:grid-cols-12 xl:gap-14">
      <div class="xl:col-span-5">
        <SectionLabel :index="props.index" label="Contacto" />
        <component :is="titleTag" class="section-title mb-6 mt-6">
          {{ texto.titulo[0] }} <span class="text-accent-word">{{ texto.titulo[1] }}</span>
        </component>
        <p class="text-lg leading-relaxed text-ink-body">{{ texto.intro }}</p>

        <ul class="mt-10 border-t border-line">
          <li class="border-b border-line">
            <a :href="perfil.enlaces.linkedin" target="_blank" rel="noopener noreferrer" class="channel group">
              <span class="flex items-center gap-4">
                <LucideLinkedin class="h-5 w-5 text-ink-muted transition-colors group-hover:text-accent-ink" aria-hidden="true" />
                <span class="text-sm text-ink-muted">LinkedIn</span>
              </span>
              <span class="text-sm font-medium text-ink-strong transition-transform group-hover:translate-x-1">
                joangarfias<span class="sr-only"> (abre en otra pestaña)</span>
              </span>
            </a>
          </li>
          <li class="border-b border-line">
            <button type="button" class="channel group w-full cursor-pointer text-left" data-evento="correo" @click="abrirCorreo">
              <span class="flex items-center gap-4">
                <LucideMail class="h-5 w-5 text-ink-muted transition-colors group-hover:text-accent-ink" aria-hidden="true" />
                <span class="text-sm text-ink-muted">Email</span>
              </span>
              <span class="text-sm font-medium text-ink-strong transition-transform group-hover:translate-x-1">Envíame un correo</span>
            </button>
          </li>
        </ul>

        <!-- El CV no aplica a quien busca un proyecto para su negocio -->
        <a v-if="props.motivo !== 'proyecto'" :href="perfil.enlaces.cv" :download="perfil.enlaces.cvNombre" class="button-secondary mt-8" data-evento="cv">
          <LucideDownload class="h-4 w-4" aria-hidden="true" />
          Descargar CV (PDF)
        </a>
      </div>

      <div class="w-full max-w-full xl:col-span-7">
        <form novalidate class="card relative w-full space-y-6 rounded-feature p-5 md:p-8" :data-motivo="motivo" @submit.prevent="handleSubmit">
          <!-- Motivo: se oculta cuando la página ya lo fija (Contrátame, sitio de proyectos) -->
          <fieldset v-if="!fijo" class="space-y-3">
            <legend class="field-label mb-3">¿Sobre qué quieres hablar?</legend>
            <div class="flex flex-wrap gap-2">
              <label v-for="m in MOTIVOS" :key="m" class="motivo">
                <input v-model="motivo" type="radio" name="motivo" :value="m" class="sr-only" :disabled="isPending" @change="onMotivoChange" />
                <span>{{ DEFINICIONES[m].label }}</span>
              </label>
            </div>
          </fieldset>

          <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div
              v-for="campo in campos"
              :key="`${motivo}-${campo.id}`"
              class="space-y-2"
              :class="{ 'md:col-span-2': campo.completo, 'is-destacado': campo.destacado }"
            >
              <label :for="fid(campo.id)" class="field-label">
                {{ campo.label }}<span v-if="campo.requerido" class="text-accent-ink" aria-hidden="true"> *</span>
              </label>
              <p v-if="campo.ayuda" :id="`${fid(campo.id)}-ayuda`" class="field-help">{{ campo.ayuda }}</p>

              <textarea
                v-if="campo.tipo === 'textarea'"
                :id="fid(campo.id)"
                v-model="valores[campo.id]"
                :name="campo.id"
                :rows="campo.destacado ? 5 : 4"
                :maxlength="campo.max"
                :placeholder="campo.placeholder"
                :required="campo.requerido"
                class="field resize-y"
                :aria-invalid="!!errores[campo.id]"
                :aria-describedby="describedBy(campo)"
                :disabled="isPending"
                @blur="touched && revalidar()"
              ></textarea>

              <select
                v-else-if="campo.tipo === 'select'"
                :id="fid(campo.id)"
                v-model="valores[campo.id]"
                :name="campo.id"
                :required="campo.requerido"
                class="field field-select"
                :aria-invalid="!!errores[campo.id]"
                :aria-describedby="describedBy(campo)"
                :disabled="isPending"
              >
                <option value="">Elige una opción</option>
                <option v-for="o in campo.opciones" :key="o.value" :value="o.value">{{ o.label }}</option>
              </select>

              <input
                v-else
                :id="fid(campo.id)"
                v-model.trim="valores[campo.id]"
                :type="campo.tipo"
                :name="campo.id"
                :maxlength="campo.max"
                :autocomplete="campo.autocomplete ?? 'off'"
                :inputmode="campo.tipo === 'tel' ? 'tel' : undefined"
                :placeholder="campo.placeholder"
                :required="campo.requerido"
                class="field"
                :aria-invalid="!!errores[campo.id]"
                :aria-describedby="describedBy(campo)"
                :disabled="isPending"
                @blur="touched && revalidar()"
              />

              <p v-if="errores[campo.id]" :id="`${fid(campo.id)}-error`" class="field-error">{{ errores[campo.id] }}</p>
            </div>
          </div>

          <p class="text-sm text-ink-muted"><span class="text-accent-ink" aria-hidden="true">*</span> Obligatorio</p>

          <!-- Turnstile (solo si hay NUXT_PUBLIC_TURNSTILE_SITE_KEY): verificación anti-bots de Cloudflare -->
          <div v-if="turnstileSiteKey" class="space-y-2">
            <div ref="turnstileEl"></div>
            <p v-if="errores.turnstile" class="field-error">{{ errores.turnstile }}</p>
          </div>

          <!-- Honeypot: debe llegar vacío; si un bot lo llena, la API descarta el mensaje -->
          <input v-model="lock" type="text" name="lock" class="hidden" tabindex="-1" autocomplete="off" aria-hidden="true" />

          <button
            type="submit"
            :disabled="isPending"
            class="button-primary group w-full py-4 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <template v-if="isPending">
              Enviando…
              <LucideLoader2 class="h-4 w-4 animate-spin" aria-hidden="true" />
            </template>
            <template v-else>
              {{ texto.boton }}
              <LucideSend class="arrow-swap h-4 w-4" aria-hidden="true" />
            </template>
          </button>

          <!-- Estados: éxito y error en línea, anunciados a lectores de pantalla -->
          <div role="status" aria-live="polite">
            <p v-if="isSuccess && enviado" class="status status--success">
              <LucideCheckCircle class="h-5 w-5 shrink-0" aria-hidden="true" />
              {{ CONFIRMACIONES[enviado] }} {{ tiempoRespuesta() }}
            </p>
          </div>
          <div role="alert">
            <p v-if="error" class="status status--error">
              <LucideAlertCircle class="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>
                {{ error }} Intenta de nuevo o
                <button type="button" class="cursor-pointer font-bold underline underline-offset-2" @click="abrirCorreo">envíame un correo</button>.
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Download as LucideDownload, Linkedin as LucideLinkedin, Mail as LucideMail, Send as LucideSend, LucideCheckCircle, LucideAlertCircle, LucideLoader2 } from 'lucide-vue-next'
import { camposVisibles, CONFIRMACIONES, DEFINICIONES, esMotivo, MOTIVOS, tiempoRespuesta, validarContacto, type Campo, type Motivo } from '#shared/contacto'
import { perfil } from '~/content/perfil'

const props = withDefaults(defineProps<{
  // En su página propia este título es el H1; en otras páginas es H2
  titleTag?: string
  // Motivo fijo: oculta el selector (ej. "empleo" en Contrátame, "proyecto" en el sitio de proyectos)
  motivo?: Motivo | null
  sectionId?: string
  index?: string
}>(), { titleTag: 'h2', motivo: null, sectionId: 'contacto', index: '01' })

const { isPending, isSuccess, error, sendEmail, resetStatus } = useContact()
const router = useRouter()

const fijo = computed(() => esMotivo(props.motivo))
// Sin motivo en la URL se abre en "empleo": es la prioridad del sitio personal
const motivo = ref<Motivo>(props.motivo ?? 'empleo')
const valores = reactive<Record<string, string>>({})
const errores = ref<Record<string, string>>({})
const touched = ref(false)
const lock = ref('')
const enviado = ref<Motivo | null>(null)

const campos = computed(() => camposVisibles(motivo.value))
// Los selects arrancan en "" para que se vea "Elige una opción" (con undefined quedan en blanco)
watch(campos, (list) => {
  for (const c of list) if (c.tipo === 'select' && valores[c.id] === undefined) valores[c.id] = ''
}, { immediate: true })
const fid = (id: string) => `${props.sectionId}-${id}`
const describedBy = (campo: Campo) =>
  [campo.ayuda && `${fid(campo.id)}-ayuda`, errores.value[campo.id] && `${fid(campo.id)}-error`].filter(Boolean).join(' ') || undefined

const textos: Record<Motivo, { titulo: [string, string]; intro: string; boton: string }> = {
  empleo: {
    titulo: ['Hablemos de', 'tu vacante.'],
    intro: `Busco ${perfil.disponibilidad.puesto.toLowerCase()}, ${perfil.disponibilidad.modalidad.toLowerCase()}. Cuéntame del puesto y del equipo.`,
    boton: 'Enviar'
  },
  evento: {
    titulo: ['Invítame a', 'tu evento.'],
    intro: 'Doy charlas y talleres sobre IA y desarrollo de software. Cuéntame la fecha, el formato y a quién va dirigido.',
    boton: 'Enviar invitación'
  },
  proyecto: {
    titulo: ['Cuéntame', 'qué te pasa.'],
    intro: 'No necesitas saber de tecnología. Explícame el problema con tus palabras y te digo cómo te puedo ayudar.',
    boton: 'Enviar'
  },
  otro: {
    titulo: ['Vamos a', 'platicar.'],
    intro: '¿Tienes algo que no encaja en lo anterior? Escríbeme.',
    boton: 'Enviar mensaje'
  }
}
const texto = computed(() => textos[motivo.value])

// ?motivo=evento (o el antiguo ?asunto=) preselecciona el motivo; &servicio=<id> el servicio.
// Al hidratar una página prerenderizada la query llega después del montaje, así que se observa.
onMounted(() => {
  watch(() => router.currentRoute.value.query, (query) => {
    const pedido = query.motivo ?? query.asunto
    if (!fijo.value && esMotivo(pedido)) motivo.value = pedido
    const servicio = typeof query.servicio === 'string' ? query.servicio : null
    if (servicio && DEFINICIONES.proyecto.campos.find(c => c.id === 'servicio')?.opciones?.some(o => o.value === servicio)) {
      valores.servicio = servicio
    }
  }, { immediate: true })
})

const revalidar = () => {
  errores.value = validarContacto(motivo.value, valores).errores
  return errores.value
}

const onMotivoChange = () => {
  errores.value = {}
  touched.value = false
  resetStatus()
}

// Turnstile: widget explícito para poder reiniciarlo después de cada envío (cada token sirve una sola vez)
const { turnstileSiteKey, siteTarget } = useRuntimeConfig().public
const turnstileEl = ref<HTMLElement | null>(null)
const turnstileToken = ref('')
let turnstileId: string | undefined

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id?: string) => void
}

onMounted(() => {
  if (!turnstileSiteKey) return
  const render = () => {
    const api = (window as unknown as { turnstile?: TurnstileApi }).turnstile
    if (!api || !turnstileEl.value || turnstileId) return
    turnstileId = api.render(turnstileEl.value, {
      sitekey: turnstileSiteKey,
      action: 'contacto',
      language: 'es',
      callback: (token: string) => { turnstileToken.value = token; delete errores.value.turnstile },
      'expired-callback': () => { turnstileToken.value = '' },
      'error-callback': () => { turnstileToken.value = '' }
    })
  }
  if ((window as unknown as { turnstile?: TurnstileApi }).turnstile) return render()
  const script = document.createElement('script')
  script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
  script.async = true
  script.onload = render
  document.head.appendChild(script)
})

const resetTurnstile = () => {
  turnstileToken.value = ''
  if (turnstileId) (window as unknown as { turnstile?: TurnstileApi }).turnstile?.reset(turnstileId)
}

const handleSubmit = async () => {
  touched.value = true
  resetStatus()
  const found = revalidar()
  const first = campos.value.find(c => found[c.id])
  if (first) {
    document.getElementById(fid(first.id))?.focus()
    return
  }
  if (turnstileSiteKey && !turnstileToken.value) {
    errores.value = { ...errores.value, turnstile: 'Completa la verificación de seguridad antes de enviar.' }
    return
  }

  const { datos } = validarContacto(motivo.value, valores)
  const actual = motivo.value
  await sendEmail(actual, datos, lock.value, turnstileToken.value)
  resetTurnstile()

  if (isSuccess.value) {
    enviado.value = actual
    track(`formulario-${actual}`, { sitio: String(siteTarget) })
    for (const key of Object.keys(valores)) valores[key] = ''
    touched.value = false
  }
}
</script>

<style scoped>
.channel {
  display: flex;
  min-height: 3.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1rem;
}

.field-label {
  display: block;
  margin-left: 0.25rem;
  color: var(--text-strong);
  font-size: 0.8125rem;
  font-weight: 600;
}

.field-help {
  margin-left: 0.25rem;
  color: var(--text-muted);
  font-size: 0.8125rem;
}

/* "¿Qué problema quieres resolver?": la pregunta principal del motivo proyecto */
.is-destacado .field-label {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 500;
  letter-spacing: -0.02em;
}
.is-destacado .field { border-color: var(--border-strong); }

.motivo { position: relative; }

.motivo span {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  border: 1px solid var(--border-strong);
  border-radius: 999px;
  padding: 0.5rem 1rem;
  color: var(--text-strong);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 180ms var(--ease-brand), border-color 180ms var(--ease-brand), color 180ms var(--ease-brand);
}

.motivo span:hover { background: var(--surface-2); }
.motivo input:checked + span {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--on-accent);
}
.motivo input:focus-visible + span {
  outline: 2px solid var(--text-strong);
  outline-offset: 2px;
}

.field {
  width: 100%;
  border: 1px solid transparent;
  border-radius: var(--radius-card-sm);
  background: var(--surface-2);
  padding: 0.85rem 1rem;
  color: var(--text-strong);
  font-size: 1rem;
  transition: border-color 180ms var(--ease-brand), background-color 180ms var(--ease-brand), box-shadow 180ms var(--ease-brand);
}

.field::placeholder { color: var(--text-muted); }
.field:hover { border-color: var(--border-strong); }
.field:focus {
  border-color: var(--text-strong);
  background: var(--surface-1);
  box-shadow: 0 0 0 4px var(--accent-soft);
}
.field:disabled { opacity: 0.6; }
.field[aria-invalid="true"] { border-color: var(--danger); }

.field-select {
  appearance: none;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-strong) 50%), linear-gradient(135deg, var(--text-strong) 50%, transparent 50%);
  background-position: calc(100% - 20px) 50%, calc(100% - 14px) 50%;
  background-repeat: no-repeat;
  background-size: 6px 6px;
  cursor: pointer;
}

.field-select option { background: var(--surface-1); color: var(--text-strong); }

.field-error {
  margin-left: 0.25rem;
  color: var(--danger);
  font-size: 0.875rem;
  font-weight: 500;
}

.status {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  border-radius: var(--radius-card-sm);
  padding: 1rem;
  font-size: 0.9375rem;
  font-weight: 600;
  line-height: 1.5;
}

.status--success {
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  background: var(--accent-soft);
  color: var(--accent-ink);
}

.status--error {
  border: 1px solid color-mix(in srgb, var(--danger) 40%, transparent);
  background: var(--danger-soft);
  color: var(--danger);
}
</style>
