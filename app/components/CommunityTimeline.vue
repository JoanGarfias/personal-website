<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import type { CommunityType, TimelineItem } from '~/content/community'
import { formatEventDate } from '~/composables/useCommunity'

const props = defineProps<{ items: TimelineItem[]; titleTag?: string }>()

const typeNames: Record<CommunityType | 'todo', string> = {
  todo: 'Todo',
  charla: 'Charlas',
  taller: 'Talleres',
  organizacion: 'Organización',
  asistente: 'Asistencia'
}
const itemLabels: Record<CommunityType, string> = {
  charla: 'Charla',
  taller: 'Taller',
  organizacion: 'Organización',
  asistente: 'Asistencia'
}

const count = (key: CommunityType | 'todo') =>
  key === 'todo' ? props.items.length : props.items.filter(e => e.type === key).length
// Solo los filtros que tienen entradas
const filters = (Object.keys(typeNames) as (CommunityType | 'todo')[]).filter(key => count(key) > 0)

const active = ref<CommunityType | 'todo'>('todo')
const visible = computed(() =>
  active.value === 'todo' ? props.items : props.items.filter(e => e.type === active.value)
)
</script>

<template>
  <div>
    <div class="mb-8 flex flex-wrap items-center justify-between gap-4">
      <component :is="props.titleTag ?? 'h3'" class="font-display text-2xl font-medium tracking-tight">Línea de tiempo</component>
      <div class="flex flex-wrap gap-2" role="group" aria-label="Filtrar por tipo">
        <button
          v-for="key in filters"
          :key="key"
          type="button"
          class="filter-chip"
          :aria-pressed="active === key"
          @click="active = key"
        >
          {{ typeNames[key] }} <span class="filter-chip__count">({{ count(key) }})</span>
        </button>
      </div>
    </div>

    <p class="sr-only" aria-live="polite">{{ visible.length }} {{ visible.length === 1 ? 'entrada' : 'entradas' }}</p>
    <TransitionGroup tag="ol" name="timeline" class="timeline">
      <li v-for="(entry, i) in visible" :key="entry.id" class="timeline-item">
        <p class="timeline-item__date">
          <time v-if="entry.date" :datetime="entry.date">{{ formatEventDate(entry.date) }}</time>
          <template v-else>{{ entry.role }}</template>
        </p>
        <span class="timeline-item__dot" :class="{ 'is-latest': i === 0 && active === 'todo' }" aria-hidden="true"></span>
        <component
          :is="entry.url ? 'a' : 'div'"
          :href="entry.url"
          :target="entry.url ? '_blank' : undefined"
          :rel="entry.url ? 'noopener noreferrer' : undefined"
          class="timeline-item__body"
          :class="{ 'is-link group': entry.url }"
        >
          <span class="timeline-item__thumb">
            <img v-if="entry.photo" :src="entry.photo" alt="" width="56" height="56" loading="lazy" class="h-full w-full object-cover" />
            <span v-else class="timeline-item__initial" aria-hidden="true">{{ entry.title.charAt(0) }}</span>
          </span>
          <span class="min-w-0">
            <span class="block text-xs font-medium uppercase tracking-[0.12em] text-accent-ink">
              {{ itemLabels[entry.type] }}<template v-if="entry.date"> · {{ entry.role }}</template>
            </span>
            <span class="mt-1 block font-display text-lg font-medium text-ink-strong">
              {{ entry.title }}<span v-if="entry.url" class="sr-only"> (abre en otra pestaña)</span>
              <ArrowUpRight v-if="entry.url" class="ml-1 inline h-4 w-4 text-ink-muted transition-colors group-hover:text-accent-ink" aria-hidden="true" />
            </span>
            <span class="mt-0.5 block text-sm text-ink-muted">{{ entry.subtitle }}</span>
          </span>
        </component>
      </li>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.filter-chip {
  min-height: 2.5rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card-sm);
  background: var(--surface-1);
  padding: 0.4rem 0.95rem;
  color: var(--text-strong);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 180ms var(--ease-brand), background-color 180ms var(--ease-brand), color 180ms var(--ease-brand);
}

.filter-chip:hover { border-color: var(--text-strong); }

.filter-chip__count { color: var(--text-muted); }

.filter-chip[aria-pressed="true"] {
  border-color: var(--text-strong);
  background: var(--text-strong);
  color: var(--surface-0);
}

.filter-chip[aria-pressed="true"] .filter-chip__count { color: inherit; opacity: 0.7; }

/* Fecha · punto sobre la línea · contenido */
.timeline {
  position: relative;
  display: grid;
}

.timeline::before {
  position: absolute;
  top: 0.75rem;
  bottom: 0.75rem;
  left: 0.3125rem;
  width: 1px;
  background: var(--border-strong);
  content: "";
}

.timeline-item {
  position: relative;
  display: grid;
  grid-template-columns: 0.625rem minmax(0, 1fr);
  column-gap: 1.25rem;
  padding-block: 1rem;
}

.timeline-item__date {
  grid-column: 2;
  color: var(--text-muted);
  font-size: 0.875rem;
}

.timeline-item__dot {
  grid-row: 1;
  grid-column: 1;
  position: relative;
  width: 0.625rem;
  height: 0.625rem;
  margin-top: 0.35rem;
  border-radius: 999px;
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--surface-0);
}

.timeline-item__dot.is-latest::after {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: var(--accent);
  animation: ripple-fade 1.8s ease-out infinite;
  content: "";
}

.timeline-item__body {
  grid-column: 2;
  display: grid;
  grid-template-columns: 3.5rem minmax(0, 1fr);
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
}

@media (min-width: 768px) {
  .timeline::before { left: calc(8rem + 1.25rem + 0.3125rem); }

  .timeline-item { grid-template-columns: 8rem 0.625rem minmax(0, 1fr); }
  .timeline-item__date { grid-row: 1; grid-column: 1; text-align: right; }
  .timeline-item__dot { grid-column: 2; }
  .timeline-item__body { grid-row: 1; grid-column: 3; margin-top: 0; }
}

.timeline-item__thumb {
  display: grid;
  aspect-ratio: 1;
  overflow: hidden;
  place-items: center;
  border-radius: var(--radius-card-sm);
  background: var(--surface-2);
}

.timeline-item__initial {
  color: var(--text-muted);
  font-family: var(--font-heading);
  font-size: 1.25rem;
}

.timeline-item__body.is-link:hover .text-ink-strong { color: var(--accent-ink); }

.timeline-enter-active,
.timeline-leave-active { transition: opacity 300ms var(--ease-brand), transform 300ms var(--ease-brand); }
.timeline-enter-from,
.timeline-leave-to { opacity: 0; transform: translateX(-12px); }
.timeline-leave-active { position: absolute; }
</style>
