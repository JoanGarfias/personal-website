<script setup lang="ts">
import { ExternalLink, Presentation, Youtube } from 'lucide-vue-next'
import { roleLabels, typeLabels, type CommunityEntry } from '~/content/community'
import { formatEventDate } from '~/composables/useCommunity'

const props = defineProps<{ entry: CommunityEntry; titleTag?: string }>()

// Solo los enlaces que existen
const links = computed(() => [
  { key: 'slides', label: 'Slides', icon: Presentation, url: props.entry.resources?.slides },
  { key: 'video', label: 'Video', icon: Youtube, url: props.entry.resources?.video },
  { key: 'event', label: 'Ver encuentro', icon: ExternalLink, url: props.entry.url }
].filter(l => l.url))
</script>

<template>
  <article class="talk">
    <div class="talk__media">
      <img
        v-if="entry.photo"
        :src="entry.photo"
        :alt="`${entry.title}, en ${entry.event}`"
        loading="lazy"
        class="h-full w-full object-cover"
      />
    </div>
    <div class="flex flex-1 flex-col p-5">
      <p class="font-meta text-xs uppercase tracking-[0.12em] text-accent-ink">
        {{ typeLabels[entry.type] }} · {{ roleLabels[entry.role] }}
      </p>
      <component :is="props.titleTag ?? 'h3'" class="mt-2 font-display text-lg font-medium leading-snug tracking-tight">
        {{ entry.title }}
      </component>
      <p class="mt-2 text-sm text-ink-muted">
        {{ entry.event }}<template v-if="entry.date"> · <time :datetime="entry.date">{{ formatEventDate(entry.date) }}</time></template>
      </p>
      <p v-if="entry.audience" class="mt-1 text-sm text-ink-muted">{{ entry.audience }}</p>
      <ul v-if="links.length" class="mt-auto flex flex-wrap gap-x-5 pt-4">
        <li v-for="l in links" :key="l.key">
          <a :href="l.url" target="_blank" rel="noopener noreferrer" class="talk__link">
            <component :is="l.icon" class="h-4 w-4" aria-hidden="true" />
            {{ l.label }}<span class="sr-only"> de {{ entry.title }} (abre en otra pestaña)</span>
          </a>
        </li>
      </ul>
    </div>
  </article>
</template>

<style scoped>
.talk {
  display: flex;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  background: var(--surface-1);
  box-shadow: var(--shadow-card);
}

.talk__media {
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--surface-2);
}

.talk__link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-strong);
  font-size: 0.875rem;
  font-weight: 600;
}

.talk__link:hover { color: var(--accent-ink); }
</style>
