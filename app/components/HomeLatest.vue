<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next'
import { typeLabels } from '~/content/community'
import { recentProject } from '~/content/projects'

// Lo más reciente, generado desde los datos: la última charla o taller, el último post y el proyecto reciente
const { given } = useCommunity()
const lastTalk = computed(() => given.value.find(e => e.type === 'charla' || e.type === 'taller') ?? null)

const { data: lastPost } = await useAsyncData('home-last-post', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date')
    .first()
)

const items = computed(() => [
  lastTalk.value && {
    id: 'charla',
    kind: `${typeLabels[lastTalk.value.type]} · ${formatEventDate(lastTalk.value.date) ?? lastTalk.value.event}`,
    title: lastTalk.value.title,
    text: lastTalk.value.event,
    to: '/comunidad',
    cta: 'Ver comunidad'
  },
  lastPost.value && {
    id: 'post',
    kind: `Blog · ${formatPostDate(lastPost.value.date)}`,
    title: lastPost.value.title,
    text: lastPost.value.description,
    to: lastPost.value.path,
    cta: 'Leer'
  },
  recentProject && {
    id: 'proyecto',
    kind: `Proyecto · ${recentProject.year}`,
    title: recentProject.name,
    text: recentProject.summary,
    to: recentProject.links.caseStudy,
    cta: 'Ver caso de estudio'
  }
].filter(Boolean) as { id: string; kind: string; title: string; text: string; to: string; cta: string }[])
</script>

<template>
  <section v-if="items.length" id="reciente" class="section-space" aria-labelledby="reciente-title">
    <SectionLabel index="03" label="Lo más reciente" />
    <h2 id="reciente-title" class="section-title mt-6 max-w-[22ch]">
      En qué ando <span class="text-soft">últimamente.</span>
    </h2>

    <ul class="latest mt-10">
      <ScrollReveal v-for="(item, i) in items" :key="item.id" as="li" :delay="i * 90">
        <NuxtLink :to="item.to" class="latest__card group" :data-evento="`reciente-${item.id}`">
          <span class="font-meta text-xs uppercase tracking-[0.12em] text-ink-muted">{{ item.kind }}</span>
          <span class="mt-3 block font-display text-xl font-medium leading-snug tracking-tight text-ink-strong">{{ item.title }}</span>
          <span class="latest__text mt-2 text-[0.9375rem] leading-relaxed text-ink-body">{{ item.text }}</span>
          <span class="latest__cta">{{ item.cta }} <ArrowUpRight class="arrow-swap h-4 w-4" aria-hidden="true" /></span>
        </NuxtLink>
      </ScrollReveal>
    </ul>
  </section>
</template>

<style scoped>
.latest {
  display: grid;
  gap: 1rem;
}

@media (min-width: 900px) {
  .latest { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.latest > li { display: flex; }

.latest__card {
  display: flex;
  width: 100%;
  flex-direction: column;
  border-top: 1px solid var(--border-strong);
  padding: 1.25rem 0.25rem 0.5rem;
  transition: border-color 250ms var(--ease-brand);
}

.latest__card:hover { border-color: var(--accent); }

.latest__text {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}

.latest__cta {
  display: inline-flex;
  margin-top: auto;
  padding-top: 1rem;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-strong);
  font-size: 0.875rem;
  font-weight: 600;
}

.latest__card:hover .latest__cta { color: var(--accent-ink); }
</style>
