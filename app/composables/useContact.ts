// Envío del formulario a la ruta del propio sitio (server/api/contacto.post.ts, Pages Function en Cloudflare).
// Recibe { motivo, campos, lock }. Los campos de cada motivo están en shared/contacto.ts.
import type { Motivo } from '#shared/contacto'

export const CONTACT_ENDPOINT = '/api/contacto'

export const useContact = () => {
  const isPending = ref(false)
  const isSuccess = ref(false)
  const error = ref<string | null>(null)

  const sendEmail = async (motivo: Motivo, campos: Record<string, string>, lock: string) => {
    isPending.value = true
    isSuccess.value = false
    error.value = null

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ motivo, campos, lock })
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)

      isSuccess.value = true
    } catch {
      // Error de red o de la API: mensaje propio, no el del navegador ("Failed to fetch")
      error.value = 'No pude enviar tu mensaje.'
    } finally {
      isPending.value = false
    }
  }

  const resetStatus = () => {
    isSuccess.value = false
    error.value = null
  }

  return {
    isPending,
    isSuccess,
    error,
    sendEmail,
    resetStatus
  }
}
