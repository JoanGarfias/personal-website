<script setup lang="ts">
import { ArrowUpRight, CalendarDays, ExternalLink, FileDown } from 'lucide-vue-next'
import { experiencia } from '~/content/experiencia'
import { cifra, metricas } from '~/content/metricas'
import { perfil } from '~/content/perfil'
import { certifications } from '~/content/stack'

const { siteUrl } = useRuntimeConfig().public
const description = `${perfil.titular}. ${perfil.disponibilidad.puesto}, ${perfil.disponibilidad.modalidad.toLowerCase()}. ${perfil.disponibilidad.egreso}. Experiencia, proyectos, stack y CV.`

useSeoMeta({
  title: `Contrátame | ${perfil.nombre} · Ingeniero de Software Jr`,
  description,
  ogTitle: `Contrátame | ${perfil.nombre}`,
  ogDescription: description,
  ogUrl: `${siteUrl}/contratame`
})

// Datos estructurados: Person con su puesto actual, formación y credenciales
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: perfil.nombre,
      alternateName: perfil.nombreCompleto,
      jobTitle: perfil.titular,
      url: siteUrl,
      address: { '@type': 'PostalAddress', addressLocality: perfil.ubicacion.ciudad, addressRegion: perfil.ubicacion.estado, addressCountry: 'MX' },
      alumniOf: { '@type': 'CollegeOrUniversity', name: perfil.formacion.escuela },
      worksFor: experiencia.filter(e => !e.fin).map(e => ({ '@type': 'Organization', name: e.organizacion })),
      hasCredential: certifications.map(c => ({ '@type': 'EducationalOccupationalCredential', name: c.issuer, url: c.url })),
      knowsLanguage: ['es', 'en'],
      sameAs: [perfil.enlaces.github, perfil.enlaces.linkedin, perfil.enlaces.youtube]
    })
  }]
})

// "Agendar conversación": enlace de agenda si existe; si no, el formulario de esta página
const agenda = perfil.agenda ?? '#contacto-empleo'

const availability = [
  { label: 'Busco', value: perfil.disponibilidad.puesto },
  { label: 'Modalidad', value: perfil.disponibilidad.modalidad },
  { label: 'Disponibilidad', value: perfil.disponibilidad.egreso }
]

// Qué aporto a un equipo: cada bloque con su evidencia
const strengths = [
  {
    title: 'Llevo software a producción',
    text: `En Tiven desarrollo módulos de negocio de un SaaS en producción; la plataforma redujo ${metricas.tivenTiempoAdministrativo.valor}% el tiempo administrativo de los salones.`,
    proof: { label: 'Caso Tiven', to: '/proyectos/tiven' }
  },
  {
    title: 'Construyo rápido cuando hace falta',
    text: `Para CompuFest 26 construí, como único desarrollador y en ${metricas.compufestDiasConstruccion.valor} días, el registro y check-in que atendió a ${metricas.compufestAsistentes.valor} asistentes durante 3 días.`,
    proof: { label: 'Caso CompuFest 26', to: '/proyectos/compufest-26' }
  },
  {
    title: 'Trabajo en equipos grandes',
    text: `En Civitas trabajé en un equipo ágil de ${metricas.civitasEquipo.valor} personas: diseño de base de datos y arquitectura (C4), entornos de prueba con Docker e integración continua.`,
    proof: { label: 'Caso Civitas', to: '/proyectos/civitas' }
  },
  {
    title: 'Hablo con usuarios y con negocio',
    text: 'Desarrollé APIs para clientes de 4 sectores en BlueServices, rediseñé la navegación del sitio de la UNISTMO con Card Sorting y Design Thinking, y explico tecnología en charlas y talleres.',
    proof: { label: 'Charlas y talleres', to: '/comunidad' }
  }
]

// Habilidades blandas, cada una con su prueba
const softSkills = [
  {
    title: 'Liderazgo comunitario',
    text: `Cofundé Nexis Oaxaca, una comunidad de tecnología en el Istmo con ${cifra(metricas.nexisMiembros)} miembros y ${cifra(metricas.nexisEventos)} eventos.`,
    proof: { label: 'nexisoaxaca.tech', href: perfil.enlaces.nexis }
  },
  {
    title: 'Hablar en público',
    text: `${metricas.charlas.valor} charlas y ${metricas.talleres.valor} talleres sobre IA y desarrollo de software, entre ellos «Desarrolla software con Google Antigravity» en CompuFest 26.`,
    proof: { label: 'Ver charlas', to: '/comunidad' }
  },
  {
    title: 'Organización de eventos',
    text: 'Organicé CompuFest 26, el segundo foro regional de Computación, y construí su sistema de registro y acceso.',
    proof: { label: 'Ver comunidad', to: '/comunidad' }
  },
  {
    title: 'Liderar un equipo',
    text: 'Lideré a un equipo de 10 personas en Hecho en Casa, coordinado con Kanban y GitFlow.',
    proof: { label: 'Caso Hecho en Casa', to: '/proyectos/hecho-en-casa' }
  },
  {
    title: 'Comunicación con aliados',
    text: 'En Nexis establezco esquemas de colaboración con instituciones, empresas y otras comunidades de tecnología.',
    proof: { label: 'Ver comunidad', to: '/comunidad' }
  }
]

const education = [
  {
    title: perfil.formacion.carrera,
    org: perfil.formacion.escuela,
    meta: `${perfil.formacion.periodo} · egreso esperado en ${perfil.formacion.egreso}`
  },
  ...certifications.map(c => ({ title: c.issuer, org: 'Amazon Web Services', meta: `${c.code.replace('AWS ', '')} · 2026`, href: c.url })),
  { title: 'Google Student Ambassador', org: 'Google', meta: 'Primera generación · 2026' },
  { title: 'INROADER', org: 'INROADS México', meta: 'Programa de mentorías', to: '/blog/mentoria-inroads' }
]
</script>

<template>
  <div class="pb-8 pt-6 lg:pt-10">
    <!-- Encabezado -->
    <header>
      <p class="eyebrow">Contrátame</p>
      <h1 class="display-title mt-6 max-w-[16ch]">
        Ingeniero de Software Jr<span class="text-accent-word">.</span>
      </h1>
      <p class="mt-6 font-meta text-sm text-ink-muted md:text-base">Backend · Full-Stack · Cloud</p>

      <dl class="availability mt-10">
        <div v-for="item in availability" :key="item.label" class="availability__item">
          <dt class="text-sm text-ink-muted">{{ item.label }}</dt>
          <dd class="mt-1 font-medium text-ink-strong">{{ item.value }}</dd>
        </div>
      </dl>

      <div class="mt-10 flex flex-wrap gap-3">
        <a :href="perfil.enlaces.cv" :download="perfil.enlaces.cvNombre" class="button-primary group" data-evento="cv">
          <FileDown class="h-4 w-4" aria-hidden="true" /> Descargar CV
        </a>
        <a
          :href="agenda"
          class="button-secondary group"
          data-evento="agendar"
          v-bind="perfil.agenda ? { target: '_blank', rel: 'noopener noreferrer' } : {}"
        >
          <CalendarDays class="h-4 w-4" aria-hidden="true" /> Agendar conversación
        </a>
      </div>
    </header>

    <!-- Qué aporto -->
    <section id="que-aporto" class="section-space" aria-labelledby="aporto-title">
      <SectionLabel index="01" label="Qué aporto" />
      <h2 id="aporto-title" class="section-title mt-6 max-w-[22ch]">
        Lo que llevo a un equipo, <span class="text-soft">con evidencia.</span>
      </h2>
      <ul class="strengths mt-10">
        <ScrollReveal v-for="(s, i) in strengths" :key="s.title" as="li" :delay="i * 80" class="card flex flex-col p-6">
          <h3 class="font-display text-xl font-medium tracking-tight">{{ s.title }}</h3>
          <p class="mt-3 leading-relaxed text-ink-body">{{ s.text }}</p>
          <NuxtLink :to="s.proof.to" class="proof-link mt-auto pt-5">
            {{ s.proof.label }} <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </NuxtLink>
        </ScrollReveal>
      </ul>
    </section>

    <!-- Experiencia -->
    <section id="experiencia" class="section-space pt-0" aria-labelledby="experiencia-title">
      <SectionLabel index="02" label="Experiencia" />
      <h2 id="experiencia-title" class="section-title mb-10 mt-6">Dónde he trabajado.</h2>
      <ExperienceTimeline />
    </section>

    <!-- Proyectos (vista técnica) y stack conectado a los proyectos -->
    <ProjectGrid index="03" stack-index="04" />

    <!-- Habilidades blandas -->
    <section id="habilidades" class="section-space" aria-labelledby="habilidades-title">
      <SectionLabel index="05" label="Habilidades blandas" />
      <h2 id="habilidades-title" class="section-title mt-6 max-w-[22ch]">
        Más allá del código, <span class="text-soft">también con pruebas.</span>
      </h2>
      <ul class="mt-10 border-t border-line">
        <ScrollReveal v-for="skill in softSkills" :key="skill.title" as="li" class="skill-row">
          <h3 class="font-display text-xl font-medium tracking-tight">{{ skill.title }}</h3>
          <p class="leading-relaxed text-ink-body">{{ skill.text }}</p>
          <a v-if="skill.proof.href" :href="skill.proof.href" target="_blank" rel="noopener noreferrer" class="proof-link">
            {{ skill.proof.label }} <ExternalLink class="h-4 w-4" aria-hidden="true" /><span class="sr-only">(abre en otra pestaña)</span>
          </a>
          <NuxtLink v-else :to="skill.proof.to!" class="proof-link">
            {{ skill.proof.label }} <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </NuxtLink>
        </ScrollReveal>
      </ul>
    </section>

    <!-- Formación, certificaciones e idiomas -->
    <section id="formacion" class="section-space pt-0" aria-labelledby="formacion-title">
      <SectionLabel index="06" label="Formación" />
      <h2 id="formacion-title" class="section-title mt-6">Formación y certificaciones.</h2>
      <div class="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <ul class="grid gap-4 sm:grid-cols-2">
          <li v-for="item in education" :key="item.title" class="card flex flex-col p-6">
            <p class="font-meta text-xs uppercase tracking-[0.12em] text-ink-muted">{{ item.org }}</p>
            <h3 class="mt-2 font-display text-lg font-medium leading-snug tracking-tight">{{ item.title }}</h3>
            <p class="mt-2 text-sm text-ink-body">{{ item.meta }}</p>
            <a v-if="item.href" :href="item.href" target="_blank" rel="noopener noreferrer" class="proof-link mt-auto pt-4">
              Ver credencial <ExternalLink class="h-4 w-4" aria-hidden="true" /><span class="sr-only">(abre en otra pestaña)</span>
            </a>
            <NuxtLink v-else-if="item.to" :to="item.to" class="proof-link mt-auto pt-4">
              Lo que me llevo <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>

        <div>
          <h3 class="font-display text-xl font-medium tracking-tight">Idiomas</h3>
          <dl class="mt-4 border-t border-line">
            <div v-for="l in perfil.idiomas" :key="l.idioma" class="border-b border-line py-4">
              <dt class="font-medium text-ink-strong">{{ l.idioma }}</dt>
              <dd class="mt-1 text-sm text-ink-body">{{ l.nivel }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- CTA final: formulario con motivo empleo -->
    <ScrollReveal>
      <Contact motivo="empleo" section-id="contacto-empleo" index="07" />
    </ScrollReveal>
  </div>
</template>

<style scoped>
.availability {
  display: grid;
  gap: 1rem;
  border-block: 1px solid var(--border-subtle);
  padding-block: 1.25rem;
}

@media (min-width: 768px) {
  .availability { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .availability__item + .availability__item {
    border-left: 1px solid var(--border-subtle);
    padding-left: 1.25rem;
  }
}

.strengths {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .strengths { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

.skill-row {
  display: grid;
  gap: 0.5rem 2rem;
  border-bottom: 1px solid var(--border-subtle);
  padding-block: 1.5rem;
}

@media (min-width: 900px) {
  .skill-row {
    grid-template-columns: 14rem minmax(0, 1fr) 12rem;
    align-items: baseline;
  }
}

.proof-link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.35rem;
  color: var(--text-strong);
  font-size: 0.9375rem;
  font-weight: 600;
}

.proof-link:hover { color: var(--accent-ink); }
</style>
