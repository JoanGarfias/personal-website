<script setup lang="ts">
import { ArrowDown, ArrowUpRight, ExternalLink } from 'lucide-vue-next'
import { communityEntries, communityIntro, communityRoles, communityWhy, nexis, talkTopics } from '~/content/community'
import { communityEventsJsonLd } from '~/composables/useCommunity'

const { siteUrl } = useRuntimeConfig().public
const description = 'Charlas, talleres y eventos de tecnología en el Istmo de Tehuantepec. Cofundador de Nexis Oaxaca y Google Student Ambassador. Invítame a tu evento.'

useSeoMeta({
  title: 'Comunidad | Joan Garfias',
  description,
  ogTitle: 'Comunidad | Joan Garfias',
  ogDescription: description,
  ogUrl: `${siteUrl}/comunidad`
})

const { featured, talks, counters, real, timeline } = useCommunity()

// Solo las charlas/talleres reales generan datos estructurados de evento
const events = communityEventsJsonLd(real.value, siteUrl)
if (events.length) {
  useHead({ script: events.map(e => ({ type: 'application/ld+json', innerHTML: JSON.stringify(e) })) })
}

// Cada tema enlaza al encuentro donde ya lo di
const entryById = (id: string) => communityEntries.find(e => e.id === id)
const topics = talkTopics.map(t => ({ ...t, given: t.basedOn.map(entryById).filter(e => !!e) }))
</script>

<template>
  <div class="pb-8 pt-6 lg:pt-10">
    <!-- Intro -->
    <header>
      <p class="eyebrow">Comunidad</p>
      <h1 class="display-title mt-6 max-w-[14ch]">
        Aprender. Construir. <span class="text-accent-word">Compartir.</span>
      </h1>
      <div class="mt-8 max-w-2xl space-y-4 text-lg leading-8 text-ink-body">
        <p>{{ communityWhy }}</p>
        <p v-if="communityIntro" class="text-ink-muted">{{ communityIntro }}</p>
      </div>
      <div class="mt-10 flex flex-wrap gap-3">
        <a href="#invitame" class="button-primary group" data-evento="invitame-hero">
          Invítame a tu evento <ArrowDown class="h-4 w-4" aria-hidden="true" />
        </a>
        <a href="#charlas" class="button-secondary group">Ver charlas y talleres</a>
      </div>

      <dl v-if="counters.some(c => c.value !== null)" class="counters mt-14">
        <div v-for="c in counters" :key="c.key" class="counter">
          <dt class="text-sm font-semibold text-ink-muted">{{ c.label }}</dt>
          <dd class="mt-2 font-display text-5xl font-medium tracking-tight text-ink-strong">
            {{ c.approx ? '~' : '' }}<CountUp :value="c.value ?? 0" />
          </dd>
        </div>
      </dl>
      <p class="mt-3 text-sm text-ink-muted">Solo cuentan los eventos donde fui ponente, tallerista, moderador u organizador.</p>
    </header>

    <!-- Roles -->
    <section id="roles" class="section-space" aria-labelledby="roles-title">
      <SectionLabel index="01" label="Roles" />
      <h2 id="roles-title" class="section-title mt-6">Dónde me encuentras.</h2>
      <ul class="roles mt-10">
        <ScrollReveal v-for="(role, i) in communityRoles" :key="role.id" as="li" :delay="i * 80">
          <component :is="role.href ? 'a' : 'div'" :href="role.href" class="role card" :class="{ 'is-link group': role.href }">
            <span v-if="role.logo" class="role__logo" :class="{ 'role__logo--nexis': role.id === 'nexis' }">
              <img :src="role.logo" alt="" width="28" height="28" class="h-7 w-7 object-contain" />
            </span>
            <span class="mt-5 block font-meta text-xs uppercase tracking-[0.12em] text-ink-muted">{{ role.org }}</span>
            <span class="mt-1 block font-display text-xl font-medium tracking-tight text-ink-strong">{{ role.title }}</span>
            <span class="mt-2 block text-[0.9375rem] leading-relaxed text-ink-body">{{ role.text }}</span>
          </component>
        </ScrollReveal>
      </ul>
    </section>

    <!-- Charlas y talleres -->
    <section id="charlas" class="section-space pt-0" aria-labelledby="charlas-title">
      <SectionLabel index="02" label="Charlas y talleres" />
      <h2 id="charlas-title" class="section-title mt-6 max-w-[22ch]">
        Lo que he compartido <span class="text-soft">con la comunidad.</span>
      </h2>

      <ScrollReveal v-if="featured" class="mt-10">
        <CommunityFeatured :entry="featured" />
      </ScrollReveal>

      <ul class="talks mt-6">
        <ScrollReveal v-for="(entry, i) in talks" :key="entry.id" as="li" :delay="i * 60">
          <CommunityTalkCard :entry="entry" />
        </ScrollReveal>
      </ul>
    </section>

    <!-- Línea de tiempo filtrable -->
    <section id="trayectoria" class="section-space pt-0" aria-labelledby="trayectoria-title">
      <SectionLabel index="03" label="Trayectoria" />
      <h2 id="trayectoria-title" class="sr-only">Trayectoria en comunidad</h2>
      <div class="mt-8">
        <CommunityTimeline :items="timeline" title-tag="h3" />
      </div>
    </section>

    <!-- Nexis Oaxaca -->
    <section id="nexis" class="section-space pt-0" aria-labelledby="nexis-title">
      <SectionLabel index="04" label="Nexis Oaxaca" />
      <ScrollReveal class="mt-8">
        <article class="nexis">
          <div class="nexis__media">
            <img v-if="nexis.photo" :src="nexis.photo" alt="Foto grupal de un evento de Nexis Oaxaca" loading="lazy" class="h-full w-full object-cover" />
          </div>
          <div class="flex flex-col gap-5 p-6 sm:p-8">
            <img src="/nexis-green.svg" alt="" width="56" height="56" class="nexis__logo" />
            <div>
              <p class="eyebrow">{{ nexis.role }}</p>
              <h2 id="nexis-title" class="mt-3 font-display text-3xl font-medium tracking-tight">{{ nexis.name }}</h2>
            </div>
            <p class="text-lg leading-relaxed text-ink-body">{{ nexis.description }}</p>
            <p v-if="nexis.participation" class="leading-relaxed text-ink-body">{{ nexis.participation }}</p>
            <dl class="grid grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-ink-muted">Miembros</dt>
                <dd class="font-display text-3xl font-medium text-ink-strong">{{ nexis.members }}</dd>
              </div>
              <div>
                <dt class="text-sm text-ink-muted">Eventos</dt>
                <dd class="font-display text-3xl font-medium text-ink-strong">{{ nexis.events }}</dd>
              </div>
            </dl>
            <div v-if="nexis.url">
              <a :href="nexis.url" target="_blank" rel="noopener noreferrer" class="button-dark group" data-evento="nexis">
                Conoce Nexis Oaxaca <ExternalLink class="h-4 w-4" aria-hidden="true" /><span class="sr-only">(abre en otra pestaña)</span>
              </a>
              <p class="mt-3 text-sm text-ink-muted">¿Quieres hacer una alianza con Nexis? Se gestiona desde su sitio.</p>
            </div>
          </div>
        </article>
      </ScrollReveal>
    </section>

    <!-- Temas que puedo dar -->
    <section id="temas" class="section-space pt-0" aria-labelledby="temas-title">
      <SectionLabel index="05" label="Temas" />
      <h2 id="temas-title" class="section-title mt-6 max-w-[22ch]">
        Temas que puedo dar <span class="text-soft">en tu evento.</span>
      </h2>
      <p class="mt-4 max-w-xl text-ink-body">Todos ya los he impartido. Los adapto a la audiencia y a la duración que necesites.</p>
      <ul class="mt-10 border-t border-line">
        <li v-for="topic in topics" :key="topic.title" class="topic">
          <h3 class="font-display text-xl font-medium tracking-tight">{{ topic.title }}</h3>
          <div>
            <p class="leading-relaxed text-ink-body">{{ topic.text }}</p>
            <p v-if="topic.given.length" class="mt-2 text-sm text-ink-muted">
              Lo di en:
              <template v-for="(e, i) in topic.given" :key="e.id">
                <a v-if="e.url" :href="e.url" target="_blank" rel="noopener noreferrer" class="topic__link">{{ e.event }}<span class="sr-only"> (abre en otra pestaña)</span></a>
                <template v-else>{{ e.event }}</template><template v-if="i < topic.given.length - 1">; </template>
              </template>
            </p>
          </div>
          <ul class="flex flex-wrap gap-2 md:justify-end" aria-label="Formatos">
            <li v-for="f in topic.formats" :key="f" class="chip">{{ f }}</li>
          </ul>
        </li>
      </ul>
    </section>

    <!-- CTA: invitación con motivo evento -->
    <ScrollReveal>
      <Contact motivo="evento" section-id="invitame" index="06" />
    </ScrollReveal>

    <p class="mt-4 text-sm text-ink-muted">
      ¿Buscas talento para tu equipo?
      <NuxtLink to="/contratame" class="topic__link">Conoce mi perfil profesional <ArrowUpRight class="inline h-3.5 w-3.5" aria-hidden="true" /></NuxtLink>
    </p>
  </div>
</template>

<style scoped>
.counters {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 1024px) {
  .counters { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

.counter {
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card);
  background: var(--surface-1);
  box-shadow: var(--shadow-card);
  padding: 1.25rem 1.5rem;
}

.roles {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .roles { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1280px) {
  .roles { grid-template-columns: repeat(4, minmax(0, 1fr)); }
}

.roles > li { display: flex; }

.role {
  display: flex;
  width: 100%;
  flex-direction: column;
  padding: 1.5rem;
  transition: border-color 250ms var(--ease-brand), transform 250ms var(--ease-brand);
}

.role.is-link:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
}

/* Logos sobre blanco en ambos temas para conservar sus colores */
.role__logo {
  display: grid;
  width: 3rem;
  height: 3rem;
  place-items: center;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card-sm);
  background: #fff;
}

.talks {
  display: grid;
  gap: 1rem;
}

@media (min-width: 640px) {
  .talks { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1280px) {
  .talks { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.nexis {
  display: grid;
  overflow: hidden;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-feature);
  background: var(--surface-1);
  box-shadow: var(--shadow-card);
}

@media (min-width: 1024px) {
  .nexis { grid-template-columns: minmax(0, 6fr) minmax(0, 6fr); align-items: center; }
}

.nexis__media {
  height: 100%;
  min-height: 14rem;
  background: var(--surface-2);
}

/* Logo en el verde de Nexis; en tema oscuro, el mismo verde más claro */
.nexis__logo {
  width: 3.5rem;
  height: 3.5rem;
}

:root[data-theme="dark"] .nexis__logo { filter: brightness(1.7); }

.topic {
  display: grid;
  gap: 0.5rem 2rem;
  border-bottom: 1px solid var(--border-subtle);
  padding-block: 1.5rem;
}

@media (min-width: 900px) {
  .topic {
    grid-template-columns: 16rem minmax(0, 1fr) 10rem;
    align-items: baseline;
  }
}

.topic__link {
  color: var(--text-strong);
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: var(--border-strong);
  text-underline-offset: 3px;
}

.topic__link:hover { text-decoration-color: var(--accent); }
</style>
