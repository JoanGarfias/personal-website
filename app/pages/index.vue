<script setup>
import { perfil } from '~/content/perfil'

// Título y descripción globales (nuxt.config.ts); aquí solo se fijan para la home
useSeoMeta({
  title: `${perfil.nombre} | ${perfil.titular}`
})

// Las secciones que antes vivían en la home tienen ahora su página. Los enlaces viejos con ancla
// (/#contacto, /#proyectos…) no llegan al servidor, así que se redirigen aquí antes del primer pintado.
const legacyHashes = {
  '#contacto': '/contacto',
  '#proyectos': '/contratame#proyectos',
  '#stack': '/contratame#stack',
  '#comunidad': '/comunidad'
}
useHead({
  script: [{
    tagPosition: 'head',
    innerHTML: `(function(m,h){if(m[h])location.replace(m[h])})(${JSON.stringify(legacyHashes)},location.hash)`
  }]
})
</script>

<template>
  <div>
    <Hero />
    <HomeDoors />
    <ScrollReveal><AboutMe /></ScrollReveal>
    <HomeLatest />
  </div>
</template>
