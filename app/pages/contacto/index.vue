<script setup lang="ts">
const title = 'Contacto | Joan Garfias'
const description = 'Escríbeme para platicar de lo que quieras: una idea, una invitación a tu evento, un proyecto o una vacante.'

useSeoMeta({ title, description, ogTitle: title, ogDescription: description, twitterTitle: title, twitterDescription: description })
</script>

<template>
  <Contact title-tag="h1" />
</template>
