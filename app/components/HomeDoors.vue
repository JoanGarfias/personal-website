<script setup lang="ts">
import { ArrowUpRight, Briefcase, Store, Users } from 'lucide-vue-next'
import { enlaceNegocios } from '~/content/perfil'

// Tres puertas del Inicio: cada visitante elige la suya. data-evento alimenta la analítica (Fase 5).
const doors = [
  {
    id: 'empleo',
    icon: Briefcase,
    question: '¿Buscas talento para tu equipo?',
    text: 'Busco un puesto junior de backend, full-stack o cloud. Aquí están mi experiencia, mis proyectos y mi CV.',
    cta: 'Ver mi perfil profesional',
    to: '/contratame'
  },
  {
    id: 'negocio',
    icon: Store,
    question: '¿Tienes un negocio con un problema por resolver?',
    text: 'Pedidos que se pierden, citas en libretas, horas de trabajo a mano: cuéntame qué te pasa.',
    cta: 'Cuéntame qué te pasa',
    to: enlaceNegocios
  },
  {
    id: 'evento',
    icon: Users,
    question: '¿Organizas un evento o una comunidad?',
    text: 'Doy charlas y talleres sobre IA y desarrollo de software, y organizo eventos en el Istmo.',
    cta: 'Ver charlas y talleres',
    to: '/comunidad'
  }
]
</script>

<template>
  <section id="puertas" class="pb-8" aria-labelledby="puertas-title">
    <SectionLabel index="01" label="¿Qué te trae por aquí?" />
    <h2 id="puertas-title" class="sr-only">Elige por dónde empezar</h2>

    <ul class="doors mt-8">
      <ScrollReveal v-for="(door, i) in doors" :key="door.id" as="li" :delay="i * 90">
        <NuxtLink :to="door.to" class="door group" :data-evento="`puerta-${door.id}`">
          <span class="door__icon" aria-hidden="true"><component :is="door.icon" class="h-5 w-5" /></span>
          <span class="mt-6 block font-display text-2xl font-medium leading-tight tracking-tight text-ink-strong">{{ door.question }}</span>
          <span class="mt-3 block leading-relaxed text-ink-body">{{ door.text }}</span>
          <span class="door__cta">
            {{ door.cta }} <ArrowUpRight class="arrow-swap h-4 w-4" aria-hidden="true" />
          </span>
        </NuxtLink>
      </ScrollReveal>
    </ul>
  </section>
</template>

<style scoped>
.doors {
  display: grid;
  gap: 1rem;
}

@media (min-width: 900px) {
  .doors { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.doors > li { display: flex; }

.door {
  display: flex;
  width: 100%;
  flex-direction: column;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-feature);
  background: var(--surface-1);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
  transition: border-color 250ms var(--ease-brand), transform 250ms var(--ease-brand);
}

.door:hover {
  border-color: var(--accent);
  transform: translateY(-3px);
}

.door__icon {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border-radius: var(--radius-card-sm);
  background: var(--accent-soft);
  color: var(--accent-ink);
}

.door__cta {
  display: inline-flex;
  margin-top: auto;
  padding-top: 1.5rem;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-strong);
  font-size: 0.9375rem;
  font-weight: 600;
}

.door:hover .door__cta { color: var(--accent-ink); }
</style>
