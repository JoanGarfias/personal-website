// Analítica de eventos (Umami). Sin NUXT_PUBLIC_UMAMI_ID no se carga nada y track() no hace nada.
// Las vistas de página las cuenta Umami solo; los clics se registran con data-evento="nombre"
// en el elemento (ver plugins/analytics.client.ts) y los envíos del formulario con track().

declare global {
  interface Window {
    umami?: { track: (event: string, data?: Record<string, string | number>) => void }
  }
}

export const track = (event: string, data: Record<string, string | number> = {}) => {
  if (typeof window === 'undefined') return
  try {
    window.umami?.track(event, data)
  } catch {
    // La analítica nunca debe romper la página
  }
}
