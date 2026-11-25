<script setup lang="ts">
// Sitio de proyectos (SITE_TARGET=proyectos). Para dueños de negocio que no son técnicos.
// REGLA: cero tecnologías ni jerga técnica en todo lo que se ve. Lo revisa `pnpm check:sin-tecnologia`.
// Estructura: dolor → costo de no resolverlo → cómo se ve resuelto → prueba → paso siguiente fácil.
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronDown } from 'lucide-vue-next'
import { perfil } from '~/content/perfil'
import { businessProjects, getProject } from '~/content/projects'
import { servicios } from '~/content/servicios'

definePageMeta({ layout: 'proyectos' })

const { siteUrl, siteName, personalUrl } = useRuntimeConfig().public
const title = `${siteName} | Soluciones para tu negocio`
const description = 'Tu negocio no debería depender de libretas, mensajes perdidos y horas de trabajo manual. Te ayudo a resolverlo, desde Oaxaca y a distancia.'

useSeoMeta({ title, description, ogTitle: title, ogDescription: description })

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: siteName,
      description,
      url: `${siteUrl}/`,
      image: `${siteUrl}/joan.jpeg`,
      areaServed: { '@type': 'Country', name: 'México' },
      address: { '@type': 'PostalAddress', addressLocality: perfil.ubicacion.ciudad, addressRegion: perfil.ubicacion.estado, addressCountry: 'MX' },
      founder: { '@type': 'Person', name: perfil.nombre, url: personalUrl },
      knowsLanguage: 'es'
    })
  }]
})

// Casos reales en vista de negocio (visibleEn incluye "proyectos")
const casos = businessProjects.map(p => ({ ...p, negocio: p.negocio!, titulo: p.name.split(' · ')[0] }))
const casoDe = (slug: string | null) => (slug ? getProject(slug) : null)

const pasos = [
  { title: 'Platicamos', text: 'Me cuentas qué te pasa y cómo trabajas hoy. Yo escucho y pregunto.' },
  { title: 'Te propongo una solución y un precio claro', text: 'Por escrito: qué voy a hacer, cuánto cuesta y para cuándo estará listo.' },
  { title: 'Construyo y te muestro avances', text: 'Ves cómo va seguido y me dices qué ajustar antes de terminar.' },
  { title: 'Lo lanzamos', text: 'Lo ponemos a funcionar en tu negocio y te enseño a usarlo.' },
  { title: 'Te acompaño después', text: 'Sigo cerca para resolver dudas y hacer ajustes cuando lo necesites.' }
]

const preguntas = [
  {
    q: '¿Cuánto cuesta?',
    a: 'Depende de lo que necesites: no cuesta lo mismo una página para que te encuentren que un sistema de pedidos con pagos y avisos a tus clientes. Después de platicar te doy un precio por escrito, antes de empezar, para que sepas exactamente qué estás pagando.'
  },
  {
    q: '¿Cuánto tarda?',
    a: 'Depende del tamaño del problema. En la primera plática te doy una fecha estimada y, mientras trabajo, te muestro avances para que veas cómo va. Cuando hace falta puedo ir rápido: el registro de un foro de 450 personas estuvo listo en 2 días.'
  },
  {
    q: '¿Necesito saber de tecnología?',
    a: 'No. Tú sabes cómo funciona tu negocio y yo me encargo de lo demás. Te explico todo con palabras claras y te enseño a usar lo que construyamos.'
  },
  {
    q: '¿Qué pasa después de la entrega?',
    a: 'No desaparezco. Te enseño a usarlo, sigo disponible para resolver dudas y platicamos desde el inicio cómo será el acompañamiento después.'
  },
  {
    q: '¿Trabajas solo con negocios de Oaxaca?',
    a: 'No. Vivo en el Istmo de Tehuantepec, pero trabajo a distancia con negocios de cualquier parte de México: platicamos por videollamada o por WhatsApp.'
  }
]
</script>

<template>
  <div class="pb-8">
    <!-- 1. Hero: el dolor y la promesa -->
    <section class="pb-16 pt-10 md:pt-16">
      <h1 class="display-title max-w-[18ch]">
        Tu negocio no debería depender de <span class="marker">libretas, mensajes perdidos y horas de trabajo manual.</span>
      </h1>
      <p class="mt-8 max-w-2xl text-lg leading-8 text-ink-body md:text-xl">
        Te ayudo a que tus clientes pidan y reserven solos, a dejar de hacer cuentas a mano y a saber cómo va tu negocio sin abrir una libreta.
      </p>
      <div class="mt-10 flex flex-wrap gap-3">
        <a href="#contacto" class="button-primary group" data-evento="hero-contacto">
          Cuéntame qué te pasa <ArrowRight class="arrow-swap h-4 w-4" aria-hidden="true" />
        </a>
        <a href="#que-necesitas" class="button-secondary group">
          Ver qué puedo hacer <ArrowDown class="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>

    <!-- 2. ¿Qué necesitas? -->
    <section id="que-necesitas" class="section-space pt-0" aria-labelledby="necesitas-title">
      <SectionLabel index="01" label="¿Qué necesitas?" />
      <h2 id="necesitas-title" class="section-title mt-6 max-w-[20ch]">
        Elige lo que más <span class="text-soft">se parece a tu caso.</span>
      </h2>

      <ul class="services mt-10">
        <ScrollReveal v-for="(s, i) in servicios" :key="s.id" as="li" :delay="(i % 3) * 80">
          <article class="service">
            <h3 class="font-display text-2xl font-medium leading-tight tracking-tight">
              <span class="text-soft">Quiero</span> {{ s.titulo.replace('…', '') }}
            </h3>
            <p class="service__pain mt-4">“{{ s.dolor }}”</p>
            <p class="mt-4 flex gap-2 leading-relaxed text-ink-body">
              <Check class="mt-1 h-4 w-4 shrink-0 text-accent-ink" aria-hidden="true" />
              <span>{{ s.comoSeVeResuelto }}</span>
            </p>
            <p class="mt-3 text-sm text-ink-muted">Ideal para: {{ s.idealPara }}</p>
            <a v-if="casoDe(s.ejemplo)" :href="`#caso-${s.ejemplo}`" class="service__example mt-3">
              Mira un caso real: {{ casoDe(s.ejemplo)!.name.split(' · ')[0] }}
            </a>
            <NuxtLink
              :to="{ query: { servicio: s.id }, hash: '#contacto' }"
              class="service__cta"
              :data-evento="`servicio-${s.id}`"
            >
              {{ s.cta }} <ArrowRight class="arrow-swap h-4 w-4" aria-hidden="true" />
            </NuxtLink>
          </article>
        </ScrollReveal>
      </ul>
    </section>

    <!-- 3. Casos reales: antes → después → resultado -->
    <section v-if="casos.length" id="casos" class="section-space pt-0" aria-labelledby="casos-title">
      <SectionLabel index="02" label="Casos reales" />
      <h2 id="casos-title" class="section-title mt-6 max-w-[20ch]">
        Así se ve <span class="text-soft">cuando se resuelve.</span>
      </h2>

      <div class="mt-10 grid gap-10">
        <ScrollReveal v-for="caso in casos" :id="`caso-${caso.slug}`" :key="caso.slug" as="article" class="case">
          <div v-if="caso.cover" class="case__media">
            <ProjectImage :image="caso.cover" sizes="(min-width: 1024px) 560px, 100vw" class="h-full w-full object-cover object-top" />
          </div>
          <div class="p-6 sm:p-8">
            <p class="font-meta text-xs uppercase tracking-[0.12em] text-ink-muted">{{ caso.negocio.cliente }}</p>
            <h3 class="mt-2 font-display text-3xl font-medium tracking-tight">{{ caso.titulo }}</h3>
            <p class="mt-3 leading-relaxed text-ink-body">{{ caso.negocio.situacion }}</p>
            <dl class="mt-6 grid gap-5">
              <div>
                <dt class="dl-term">Antes</dt>
                <dd class="leading-relaxed text-ink-body">{{ caso.negocio.dolor }}</dd>
              </div>
              <div>
                <dt class="dl-term">Después</dt>
                <dd class="leading-relaxed text-ink-body">{{ caso.negocio.cambio }}</dd>
              </div>
              <div class="case__result">
                <dt class="dl-term">Resultado</dt>
                <dd class="font-medium leading-relaxed text-ink-strong">{{ caso.negocio.resultado }}</dd>
              </div>
            </dl>
          </div>
        </ScrollReveal>
      </div>
    </section>

    <!-- 4. Cómo trabajamos -->
    <section id="como-trabajamos" class="section-space pt-0" aria-labelledby="como-title">
      <SectionLabel index="03" label="Cómo trabajamos" />
      <h2 id="como-title" class="section-title mt-6 max-w-[20ch]">
        Cinco pasos, <span class="text-soft">sin sorpresas.</span>
      </h2>
      <ol class="steps mt-10">
        <ScrollReveal v-for="(paso, i) in pasos" :key="paso.title" as="li" :delay="i * 70" class="step">
          <span class="step__number" aria-hidden="true">{{ i + 1 }}</span>
          <h3 class="mt-4 font-display text-lg font-medium leading-snug tracking-tight">{{ paso.title }}</h3>
          <p class="mt-2 text-[0.9375rem] leading-relaxed text-ink-body">{{ paso.text }}</p>
        </ScrollReveal>
      </ol>
    </section>

    <!-- 5. Preguntas frecuentes -->
    <section id="preguntas" class="section-space pt-0" aria-labelledby="preguntas-title">
      <SectionLabel index="04" label="Preguntas frecuentes" />
      <h2 id="preguntas-title" class="section-title mt-6">Lo que suelen preguntarme.</h2>
      <div class="mt-10 border-t border-line">
        <details v-for="p in preguntas" :key="p.q" class="faq group">
          <summary class="faq__q">
            {{ p.q }}
            <ChevronDown class="h-5 w-5 shrink-0 text-ink-muted transition-transform group-open:rotate-180" aria-hidden="true" />
          </summary>
          <p class="faq__a">{{ p.a }}</p>
        </details>
      </div>
    </section>

    <!-- 6. Quién está detrás -->
    <section id="quien" class="section-space pt-0" aria-labelledby="quien-title">
      <SectionLabel index="05" label="Quién está detrás" />
      <div class="who mt-8">
        <img src="/_optimized/joan-480.webp" alt="Retrato de Joan Garfias" width="160" height="160" loading="lazy" class="who__photo" />
        <div>
          <h2 id="quien-title" class="font-display text-3xl font-medium tracking-tight">Hola, soy Joan.</h2>
          <p class="mt-4 max-w-2xl text-lg leading-relaxed text-ink-body">
            Vivo en Santo Domingo Tehuantepec, Oaxaca, y estudio Ingeniería en Computación en la Universidad del Istmo.
            Me gusta entender cómo funciona un negocio por dentro y quitarle lo que hoy le roba tiempo.
            También cofundé Nexis Oaxaca, una comunidad de tecnología en el Istmo.
          </p>
          <a :href="personalUrl" class="who__link mt-5" data-evento="quien-conoce-a-joan">
            Conoce más de mí <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>

    <!-- 7. Paso siguiente: formulario con motivo proyecto -->
    <ScrollReveal>
      <Contact motivo="proyecto" index="06" />
    </ScrollReveal>
  </div>
</template>

<style scoped>
.services {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .services { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (min-width: 1280px) {
  .services { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

.services > li { display: flex; }

.service {
  display: flex;
  width: 100%;
  flex-direction: column;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-feature);
  background: var(--surface-1);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
}

.service__pain {
  border-left: 2px solid var(--border-strong);
  padding-left: 0.85rem;
  color: var(--text-muted);
  font-style: italic;
  line-height: 1.6;
}

.service__example {
  color: var(--accent-ink);
  font-size: 0.875rem;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 3px;
}

.service__cta {
  display: inline-flex;
  min-height: 2.75rem;
  margin-top: auto;
  padding-top: 1.25rem;
  align-items: center;
  gap: 0.4rem;
  color: var(--text-strong);
  font-weight: 600;
}

.service__cta:hover { color: var(--accent-ink); }

.case {
  display: grid;
  overflow: hidden;
  scroll-margin-top: 5rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-feature);
  background: var(--surface-1);
  box-shadow: var(--shadow-card);
}

@media (min-width: 1024px) {
  .case { grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); }
}

.case__media {
  min-height: 14rem;
  max-height: 28rem;
  overflow: hidden;
  background: var(--surface-2);
}

.case__result {
  border-radius: var(--radius-card-sm);
  background: var(--accent-soft);
  padding: 1rem 1.1rem;
}

.steps {
  display: grid;
  gap: 1rem;
}

@media (min-width: 768px) {
  .steps { grid-template-columns: repeat(5, minmax(0, 1fr)); }
}

.step {
  border-top: 1px solid var(--border-strong);
  padding-top: 1.25rem;
}

.step__number {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border-radius: 999px;
  background: var(--accent);
  color: var(--on-accent);
  font-weight: 700;
}

.faq { border-bottom: 1px solid var(--border-subtle); }

.faq__q {
  display: flex;
  min-height: 3.5rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-block: 1rem;
  color: var(--text-strong);
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 500;
  list-style: none;
  cursor: pointer;
}

.faq__q::-webkit-details-marker { display: none; }

.faq__a {
  max-width: 48rem;
  padding-bottom: 1.25rem;
  color: var(--text-body);
  line-height: 1.75;
}

.who {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .who { grid-template-columns: 10rem minmax(0, 1fr); align-items: start; }
}

.who__photo {
  width: 10rem;
  height: 10rem;
  border-radius: var(--radius-feature);
  object-fit: cover;
}

.who__link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.35rem;
  color: var(--text-strong);
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: var(--accent);
  text-underline-offset: 4px;
}
</style>
