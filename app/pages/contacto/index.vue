<script setup lang="ts">
const title = 'Contacto | Joan Garfias'
const description = 'Escríbeme sobre una vacante, una invitación a tu evento o un proyecto para tu negocio.'

useSeoMeta({ title, description, ogTitle: title, ogDescription: description, twitterTitle: title, twitterDescription: description })
</script>

<template>
  <Contact title-tag="h1" />
</template>
