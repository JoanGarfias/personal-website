// Formulario de contacto: envía el mensaje con Resend.
// En Cloudflare Pages esta ruta se compila a una Pages Function (_worker.js); el resto del sitio sigue prerenderizado.
// Campos y validación: shared/contacto.ts (los mismos que usa el formulario).
// Secretos (Cloudflare Pages → Settings → Variables and Secrets, o .env en local):
//   NUXT_RESEND_API_KEY  API key de Resend
//   NUXT_CONTACT_EMAIL   buzón que recibe los mensajes
// Turnstile (opcional; si falta el secreto, solo protege el honeypot):
//   NUXT_TURNSTILE_SECRET     secreto del widget
//   NUXT_TURNSTILE_HOSTNAMES  hostnames del frontend separados por coma (en producción sin localhost)
import { asuntoCorreo, DEFINICIONES, esMotivo, filasCorreo, validarContacto, type Motivo } from '#shared/contacto'

// Siteverify canónico: success, acción esperada y hostname aprobado. Ante cualquier error, rechaza.
const verifyTurnstile = async (token: unknown, secret: string, hostnames: string, remoteip?: string) => {
  const expected = new Set(hostnames.split(',').map(h => h.trim()).filter(Boolean))
  if (typeof token !== 'string' || !token || token.length > 2048 || !expected.size) return false
  try {
    const body = new URLSearchParams({ secret, response: token })
    if (remoteip) body.set('remoteip', remoteip)
    const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      signal: AbortSignal.timeout(10_000),
      body
    })
    if (!r.ok) return false
    const result = await r.json() as { success?: boolean; action?: string; hostname?: string }
    return result.success === true && result.action === 'contacto' && !!result.hostname && expected.has(result.hostname)
  } catch {
    return false
  }
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)

// Formato anterior { name, email, subject, message } (páginas abiertas antes del despliegue)
const legacy = (body: Record<string, unknown>) => ({
  motivo: body.subject,
  campos: { nombre: body.name, correo: body.email, mensaje: body.message }
})

export default defineEventHandler(async (event) => {
  const raw = await readBody(event).catch(() => null)
  if (!raw || typeof raw !== 'object') {
    throw createError({ statusCode: 400, statusMessage: 'Datos incompletos' })
  }

  // Honeypot: el campo oculto viaja vacío desde el formulario; si trae algo es un bot.
  // Se responde ok para no darle pistas.
  if (raw.lock) return { ok: true }

  const body = raw.motivo === undefined && raw.subject !== undefined ? legacy(raw) : raw
  const motivo: Motivo = esMotivo(body.motivo) ? body.motivo : 'otro'
  const campos = body.campos && typeof body.campos === 'object' ? body.campos as Record<string, unknown> : {}

  // En el formato anterior, "proyecto" no tenía los campos nuevos: se trata como mensaje libre
  const efectivo: Motivo = body === raw ? motivo : 'otro'
  const { errores, datos } = validarContacto(efectivo, campos)
  if (Object.keys(errores).length) {
    throw createError({ statusCode: 400, statusMessage: 'Datos incompletos', data: { errores } })
  }

  const { resendApiKey, contactEmail, turnstileSecret, turnstileHostnames } = useRuntimeConfig(event)
  if (turnstileSecret) {
    const ip = getRequestHeader(event, 'cf-connecting-ip') ?? undefined
    if (!await verifyTurnstile(raw.turnstile, turnstileSecret, turnstileHostnames, ip)) {
      throw createError({ statusCode: 403, statusMessage: 'Verificación fallida' })
    }
  }

  if (!resendApiKey || !contactEmail) {
    console.error('Faltan NUXT_RESEND_API_KEY o NUXT_CONTACT_EMAIL')
    throw createError({ statusCode: 500, statusMessage: 'Error interno' })
  }

  const subject = asuntoCorreo(efectivo, datos)
  const filas = [{ label: 'Motivo', value: DEFINICIONES[efectivo].label }, ...filasCorreo(efectivo, datos)]

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Portfolio <contacto@joangarfias.me>',
      to: [contactEmail],
      // Responder desde el buzón contesta directo a quien escribió (si dejó correo)
      ...(datos.correo ? { reply_to: datos.correo } : {}),
      subject,
      html: filas
        .map(f => `<p><strong>${escapeHtml(f.label)}:</strong><br><span style="white-space:pre-wrap">${escapeHtml(f.value)}</span></p>`)
        .join(''),
      text: filas.map(f => `${f.label}: ${f.value}`).join('\n\n')
    })
  })

  if (!response.ok) {
    console.error('Resend', response.status, await response.text())
    throw createError({ statusCode: 502, statusMessage: 'No se pudo enviar' })
  }

  return { ok: true }
})
