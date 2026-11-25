// Carga Umami (si hay NUXT_PUBLIC_UMAMI_ID) y registra los clics en elementos con data-evento.
// Eventos que existen hoy: puerta-empleo / puerta-negocio / puerta-evento (Inicio), cv, agendar,
// invitame, servicio-<id>, reciente-*, caso-empleo, conoce-a-joan… y formulario-<motivo> al enviar.
// Cada evento lleva el sitio (personal | proyectos) y la ruta, para saber qué puerta usa la gente.
export default defineNuxtPlugin(() => {
  const { umamiId, umamiHost, siteTarget } = useRuntimeConfig().public
  if (!umamiId) return

  useHead({
    script: [{ src: `${String(umamiHost).replace(/\/$/, '')}/script.js`, defer: true, 'data-website-id': umamiId }]
  })

  const route = useRoute()
  document.addEventListener('click', (event) => {
    const el = (event.target as HTMLElement | null)?.closest<HTMLElement>('[data-evento]')
    const name = el?.dataset.evento
    if (name) track(name, { sitio: String(siteTarget), ruta: route.path })
  }, { capture: true, passive: true })
})
