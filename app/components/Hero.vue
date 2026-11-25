<script setup>
import { googleAmbassador, nexis } from '~/content/community'
import { pruebasHero } from '~/content/metricas'
import { perfil } from '~/content/perfil'

// Titular palabra por palabra; las marcadas van bajo el resaltado de marcador
const lead = ['El', 'software', 'no', 'termina']
const marked = ['en', 'el', 'código.']

// Roles en comunidad, con su logo
const roles = [
  { label: `${nexis.role} · ${nexis.name}`, logo: '/nexis-green.svg', brand: 'nexis' },
  { label: googleAmbassador.name, logo: googleAmbassador.logo }
]
</script>

<template>
  <section id="inicio" class="pb-12 pt-6 lg:pt-10">
    <div class="flex items-center gap-3">
      <img src="/_optimized/joan-480.webp" alt="Retrato de Joan Garfias" width="48" height="48" class="h-12 w-12 rounded-xl border-2 border-surface-1 object-cover shadow-md" />
      <div>
        <p class="font-medium leading-tight text-ink-strong">{{ perfil.nombre }}</p>
        <p class="font-meta text-[0.8125rem] text-ink-muted">{{ perfil.areas }}</p>
      </div>
    </div>

    <ul class="mt-5 flex flex-wrap gap-2" aria-label="Roles en comunidad">
      <li v-for="role in roles" :key="role.label" class="role-chip">
        <img :src="role.logo" alt="" width="18" height="18" class="h-[18px] w-[18px] object-contain" :class="{ 'role-chip__nexis': role.brand === 'nexis' }" />
        {{ role.label }}
      </li>
    </ul>

    <h1 class="display-title word-reveal mt-10 max-w-[13ch] md:mt-14">
      <span class="sr-only">{{ perfil.nombre }}: </span>
      <template v-for="(word, i) in lead" :key="word">
        <span class="word" :style="{ '--i': i }">{{ word }}</span>{{ ' ' }}
      </template>
      <span class="marker">
        <template v-for="(word, i) in marked" :key="word">
          <span class="word" :style="{ '--i': lead.length + i }">{{ word }}</span>{{ i < marked.length - 1 ? ' ' : '' }}
        </template>
      </span>
    </h1>

    <ScrollReveal :delay="500">
      <p class="mt-8 max-w-2xl text-lg leading-8 text-ink-body">
        Soy {{ perfil.nombre }}, {{ perfil.identidad.charAt(0).toLowerCase() + perfil.identidad.slice(1) }}
      </p>
    </ScrollReveal>

    <div class="mt-12 grid items-end gap-10 md:mt-14 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <ScrollReveal :delay="650" as="dl" class="proofs">
        <div v-for="m in pruebasHero" :key="m.id" class="proofs__item">
          <dt class="order-2 mt-3 text-[0.9375rem] leading-relaxed text-ink-body">
            <NuxtLink v-if="m.fuente" :to="m.fuente" class="proofs__link">{{ m.texto }}</NuxtLink>
            <template v-else>{{ m.texto }}</template>
          </dt>
          <dd class="order-1 font-display text-5xl font-medium leading-none tracking-tight text-ink-strong md:text-6xl">
            {{ m.prefijo }}<CountUp :value="m.valor" />{{ m.sufijo }}
          </dd>
        </div>
      </ScrollReveal>

      <ScrollReveal :delay="800">
        <TerminalCard />
      </ScrollReveal>
    </div>
  </section>
</template>

<style scoped>
.role-chip {
  display: inline-flex;
  min-height: 2.25rem;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card-sm);
  background: var(--surface-1);
  padding: 0.35rem 0.75rem;
  color: var(--text-strong);
  font-size: 0.8125rem;
  font-weight: 500;
}

/* Verde de Nexis más claro en tema oscuro para que el ícono pequeño se lea */
:root[data-theme="dark"] .role-chip__nexis { filter: brightness(1.7); }

/* Dos pruebas separadas por una línea vertical */
.proofs {
  display: grid;
  gap: 2rem;
}

@media (min-width: 640px) {
  .proofs { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.proofs__item {
  display: flex;
  flex-direction: column;
  border-left: 1px solid var(--border-strong);
  padding: 0.25rem 1rem 0.25rem 1.1rem;
}

.proofs__link {
  text-decoration: underline;
  text-decoration-color: var(--border-strong);
  text-underline-offset: 3px;
  transition: text-decoration-color 200ms var(--ease-brand);
}

.proofs__link:hover { text-decoration-color: var(--accent); }
</style>
