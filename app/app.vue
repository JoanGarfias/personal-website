<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { experiencia } from '~/content/experiencia'
import { perfil } from '~/content/perfil'
import { certifications } from '~/content/stack'

const route = useRoute()
const { siteUrl, siteTarget } = useRuntimeConfig().public

// Canonical y og:url por ruta, siempre sobre el dominio de este sitio
const canonicalUrl = computed(() => `${siteUrl}${route.path === '/' ? '/' : route.path.replace(/\/$/, '')}`)

useHead({
  link: [{ rel: 'canonical', href: canonicalUrl }],
  meta: [
    { property: 'og:url', content: canonicalUrl },
    { name: 'twitter:url', content: canonicalUrl }
  ]
})

// Sitio personal: Person en todas las páginas. El de proyectos declara ProfessionalService en su página.
if (siteTarget === 'personal') {
  useHead({
    script: [{
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: perfil.nombre,
        alternateName: perfil.nombreCompleto,
        jobTitle: perfil.titular,
        url: `${siteUrl}/`,
        image: `${siteUrl}/joan.jpeg`,
        address: { '@type': 'PostalAddress', addressLocality: perfil.ubicacion.ciudad, addressRegion: perfil.ubicacion.estado, addressCountry: 'MX' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: perfil.formacion.escuela },
        worksFor: experiencia.filter(e => !e.fin).map(e => ({ '@type': 'Organization', name: e.organizacion })),
        hasCredential: certifications.map(c => ({ '@type': 'EducationalOccupationalCredential', name: c.issuer, url: c.url })),
        knowsLanguage: ['es', 'en'],
        sameAs: [perfil.enlaces.linkedin, perfil.enlaces.github, perfil.enlaces.youtube]
      })
    }]
  })
}
</script>
