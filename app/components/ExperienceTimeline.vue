<script setup lang="ts">
import { ArrowUpRight, ExternalLink } from 'lucide-vue-next'
import { experiencia } from '~/content/experiencia'

const props = withDefaults(defineProps<{ level?: number }>(), { level: 3 })
const host = (url: string) => new URL(url).host
</script>

<template>
  <ol class="timeline">
    <ScrollReveal v-for="(job, i) in experiencia" :key="job.id" as="li" :delay="i * 80" class="timeline__item">
      <span class="timeline__dot" :class="{ 'is-current': !job.fin }" aria-hidden="true"></span>
      <p class="font-meta text-xs uppercase tracking-[0.12em] text-ink-muted">
        <time :datetime="job.inicio">{{ job.periodo }}</time>
      </p>
      <component :is="`h${props.level}`" class="mt-2 font-display text-2xl font-medium tracking-tight">
        {{ job.puesto }} <span class="text-soft">· {{ job.organizacion }}</span>
      </component>
      <p v-if="job.descripcion" class="mt-1 text-sm text-ink-muted">{{ job.descripcion }}</p>
      <ul class="mt-4 max-w-3xl list-disc space-y-2 pl-5 leading-relaxed text-ink-body marker:text-accent-ink">
        <li v-for="logro in job.logros" :key="logro">{{ logro }}</li>
      </ul>
      <div v-if="job.caso || job.url" class="mt-4 flex flex-wrap gap-x-6 gap-y-2">
        <NuxtLink v-if="job.caso" :to="job.caso" class="timeline__link">
          Ver caso de estudio<span class="sr-only"> de {{ job.organizacion }}</span> <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
        </NuxtLink>
        <a v-if="job.url" :href="job.url" target="_blank" rel="noopener noreferrer" class="timeline__link">
          {{ host(job.url) }} <ExternalLink class="h-4 w-4" aria-hidden="true" /><span class="sr-only">(abre en otra pestaña)</span>
        </a>
      </div>
    </ScrollReveal>
  </ol>
</template>

<style scoped>
.timeline {
  position: relative;
  display: grid;
  gap: 2.5rem;
  border-left: 1px solid var(--border-strong);
  margin-left: 0.4rem;
}

.timeline__item {
  position: relative;
  padding-left: 1.75rem;
}

.timeline__dot {
  position: absolute;
  top: 0.2rem;
  left: -0.4rem;
  width: 0.8rem;
  height: 0.8rem;
  border: 2px solid var(--border-strong);
  border-radius: 999px;
  background: var(--surface-0, var(--surface-1));
}

.timeline__dot.is-current {
  border-color: var(--accent);
  background: var(--accent);
  box-shadow: 0 0 0 4px var(--accent-soft);
}

.timeline__link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.35rem;
  color: var(--text-strong);
  font-size: 0.9375rem;
  font-weight: 600;
}

.timeline__link:hover { color: var(--accent-ink); }
</style>
