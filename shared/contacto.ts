// Formulario de contacto compartido: lo usan el componente (app/components/Contact.vue)
// y la Pages Function (server/api/contacto.post.ts). Las mismas reglas validan en ambos lados.
//
// /contacto?motivo=empleo|evento|proyecto|otro preselecciona el motivo (?asunto= sigue funcionando).
// &servicio=<id> preselecciona el servicio en motivo=proyecto.

import { servicios } from '../app/content/servicios'

export type Motivo = 'empleo' | 'evento' | 'proyecto' | 'otro'
export const MOTIVOS: Motivo[] = ['empleo', 'evento', 'proyecto', 'otro']

export type TipoCampo = 'text' | 'email' | 'tel' | 'url' | 'date' | 'select' | 'textarea'

export interface Opcion { value: string; label: string }

export interface Campo {
  id: string
  label: string
  tipo: TipoCampo
  requerido?: boolean
  opciones?: Opcion[]
  placeholder?: string
  autocomplete?: string
  // Ocupa las dos columnas en escritorio
  completo?: boolean
  // Prioridad visual (el "¿qué problema quieres resolver?" del motivo proyecto)
  destacado?: boolean
  ayuda?: string
  max: number
}

export interface DefinicionMotivo {
  value: Motivo
  label: string
  // Prefijo del asunto del correo: [EMPLEO], [EVENTO]…
  etiqueta: string
  campos: Campo[]
}

// Servicios del sitio de proyectos (app/content/servicios.ts). Vacío → el campo "Servicio de interés" no se muestra.
export const SERVICIOS_FORMULARIO: Opcion[] = servicios.map(s => ({ value: s.id, label: s.etiqueta }))

// Rangos de presupuesto. null → el campo no se muestra. [DEFINIR RANGOS]
export const RANGOS_PRESUPUESTO: string[] | null = null

// Tiempo de respuesta que se promete en la confirmación. null → "pronto". [DEFINIR]
export const TIEMPO_RESPUESTA: string | null = null

const nombre: Campo = { id: 'nombre', label: 'Nombre', tipo: 'text', requerido: true, placeholder: 'Ej. Ana López', autocomplete: 'name', max: 100 }
const correo: Campo = { id: 'correo', label: 'Correo electrónico', tipo: 'email', requerido: true, placeholder: 'tu@email.com', autocomplete: 'email', max: 200 }
const mensaje = (placeholder: string, requerido = false): Campo =>
  ({ id: 'mensaje', label: requerido ? 'Mensaje' : 'Mensaje (opcional)', tipo: 'textarea', requerido, placeholder, completo: true, max: 5000 })

export const DEFINICIONES: Record<Motivo, DefinicionMotivo> = {
  empleo: {
    value: 'empleo',
    label: 'Empleo',
    etiqueta: 'EMPLEO',
    campos: [
      nombre,
      correo,
      { id: 'empresa', label: 'Empresa', tipo: 'text', requerido: true, placeholder: 'Ej. Acme', autocomplete: 'organization', max: 120 },
      { id: 'puesto', label: 'Puesto', tipo: 'text', requerido: true, placeholder: 'Ej. Backend Developer Jr', autocomplete: 'organization-title', max: 120 },
      {
        id: 'modalidad',
        label: 'Modalidad',
        tipo: 'select',
        opciones: [
          { value: 'remoto', label: 'Remoto' },
          { value: 'hibrido', label: 'Híbrido' },
          { value: 'presencial', label: 'Presencial' }
        ],
        max: 20
      },
      { id: 'vacante', label: 'Enlace a la vacante (opcional)', tipo: 'url', placeholder: 'https://…', max: 500 },
      mensaje('Cuéntame del puesto, el equipo y los siguientes pasos…')
    ]
  },
  evento: {
    value: 'evento',
    label: 'Invitación a evento',
    etiqueta: 'EVENTO',
    campos: [
      nombre,
      correo,
      { id: 'organizacion', label: 'Organización o comunidad', tipo: 'text', requerido: true, placeholder: 'Ej. GDG Oaxaca', autocomplete: 'organization', max: 120 },
      { id: 'evento', label: 'Nombre del evento', tipo: 'text', requerido: true, placeholder: 'Ej. DevFest 2027', max: 150 },
      { id: 'fecha', label: 'Fecha', tipo: 'date', max: 20 },
      { id: 'lugar', label: 'Lugar o modalidad', tipo: 'text', placeholder: 'Ej. Juchitán o en línea', max: 150 },
      {
        id: 'formato',
        label: 'Formato',
        tipo: 'select',
        opciones: [
          { value: 'charla', label: 'Charla' },
          { value: 'taller', label: 'Taller' },
          { value: 'panel', label: 'Panel' },
          { value: 'otro', label: 'Otro' }
        ],
        max: 20
      },
      { id: 'tema', label: 'Tema sugerido', tipo: 'text', placeholder: 'Ej. IA para estudiantes', max: 200 },
      mensaje('Audiencia, duración y cualquier detalle que deba saber…')
    ]
  },
  proyecto: {
    value: 'proyecto',
    label: 'Proyecto para mi negocio',
    etiqueta: 'PROYECTO',
    campos: [
      { id: 'problema', label: '¿Qué problema quieres resolver?', tipo: 'textarea', requerido: true, destacado: true, completo: true, placeholder: 'Ej. Los pedidos me llegan por WhatsApp y se me pierden…', ayuda: 'Cuéntalo con tus palabras, como se lo contarías a un amigo.', max: 5000 },
      nombre,
      { ...correo, requerido: false, label: 'Correo electrónico', ayuda: 'Correo, WhatsApp o los dos.' },
      { id: 'whatsapp', label: 'WhatsApp', tipo: 'tel', placeholder: 'Ej. 971 123 4567', autocomplete: 'tel', max: 30 },
      { id: 'negocio', label: 'Nombre del negocio', tipo: 'text', requerido: true, placeholder: 'Ej. Panadería La Espiga', autocomplete: 'organization', max: 120 },
      { id: 'giro', label: '¿A qué se dedica?', tipo: 'text', placeholder: 'Ej. Panadería, salón de belleza, consultorio', max: 120 },
      { id: 'servicio', label: 'Servicio de interés', tipo: 'select', opciones: SERVICIOS_FORMULARIO, max: 60 },
      {
        id: 'plazo',
        label: '¿Para cuándo lo necesitas?',
        tipo: 'select',
        opciones: [
          { value: 'pronto', label: 'Lo antes posible' },
          { value: '1-3-meses', label: 'En 1 a 3 meses' },
          { value: 'mas-3-meses', label: 'En más de 3 meses' },
          { value: 'no-se', label: 'Todavía no lo sé' }
        ],
        max: 20
      },
      {
        id: 'presupuesto',
        label: 'Presupuesto aproximado',
        tipo: 'select',
        opciones: RANGOS_PRESUPUESTO ? [...RANGOS_PRESUPUESTO.map(r => ({ value: r, label: r })), { value: 'no-se', label: 'No lo sé todavía' }] : [],
        max: 60
      }
    ]
  },
  otro: {
    value: 'otro',
    label: 'Otro',
    etiqueta: 'OTRO',
    campos: [nombre, correo, mensaje('Escribe tu mensaje…', true)]
  }
}

// Un select sin opciones (servicios o presupuesto aún sin definir) no se muestra ni se valida
export const camposVisibles = (motivo: Motivo) =>
  DEFINICIONES[motivo].campos.filter(c => c.tipo !== 'select' || (c.opciones?.length ?? 0) > 0)

export const esMotivo = (value: unknown): value is Motivo => MOTIVOS.includes(value as Motivo)

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_RE = /^https?:\/\/\S+$/i
const TEL_RE = /^[+\d][\d\s().-]{6,}$/

export interface ResultadoValidacion {
  errores: Record<string, string>
  datos: Record<string, string>
}

export const validarContacto = (motivo: Motivo, entrada: Record<string, unknown>): ResultadoValidacion => {
  const errores: Record<string, string> = {}
  const datos: Record<string, string> = {}

  for (const campo of camposVisibles(motivo)) {
    const raw = entrada[campo.id]
    const value = typeof raw === 'string' ? raw.trim().slice(0, campo.max) : ''
    if (value) datos[campo.id] = value

    if (!value) {
      if (campo.requerido) errores[campo.id] = campo.tipo === 'select' ? `Elige una opción en “${campo.label}”.` : `Completa “${campo.label}”.`
      continue
    }
    if (campo.tipo === 'email' && !EMAIL_RE.test(value)) errores[campo.id] = 'Revisa el formato del correo, ej. tu@email.com.'
    if (campo.tipo === 'url' && !URL_RE.test(value)) errores[campo.id] = 'Pega el enlace completo, empezando con https://'
    if (campo.tipo === 'tel' && !TEL_RE.test(value)) errores[campo.id] = 'Revisa el número, ej. 971 123 4567.'
    if (campo.tipo === 'select' && !campo.opciones?.some(o => o.value === value)) errores[campo.id] = `Elige una opción en “${campo.label}”.`
    if (campo.tipo === 'textarea' && campo.requerido && value.length < 10) errores[campo.id] = 'Cuéntame un poco más (mínimo 10 caracteres).'
  }

  // Proyecto: basta con correo o WhatsApp
  if (motivo === 'proyecto' && !datos.correo && !datos.whatsapp && !errores.correo && !errores.whatsapp) {
    errores.correo = 'Déjame un correo o un WhatsApp para responderte.'
  }

  return { errores, datos }
}

const etiquetaOpcion = (motivo: Motivo, campoId: string, value?: string) =>
  DEFINICIONES[motivo].campos.find(c => c.id === campoId)?.opciones?.find(o => o.value === value)?.label ?? value

// Asunto del correo que recibo, para filtrar: "[EMPLEO] Acme — Backend Developer Jr"
export const asuntoCorreo = (motivo: Motivo, d: Record<string, string>) => {
  const { etiqueta } = DEFINICIONES[motivo]
  const detalle = {
    empleo: `${d.empresa} — ${d.puesto}`,
    evento: `${d.organizacion} — ${d.evento}`,
    proyecto: `${d.negocio} — ${etiquetaOpcion('proyecto', 'servicio', d.servicio) ?? d.giro ?? 'Proyecto nuevo'}`,
    otro: `Mensaje de ${d.nombre}`
  }[motivo]
  return `[${etiqueta}] ${detalle}`.replace(/[\r\n]+/g, ' ').slice(0, 200)
}

// Filas "Etiqueta: valor" en el orden del formulario (con la etiqueta legible de cada opción)
export const filasCorreo = (motivo: Motivo, d: Record<string, string>) =>
  camposVisibles(motivo)
    .filter(c => d[c.id])
    .map(c => ({ label: c.label.replace(/ \(opcional\)$/, ''), value: c.tipo === 'select' ? etiquetaOpcion(motivo, c.id, d[c.id])! : d[c.id]! }))

export const CONFIRMACIONES: Record<Motivo, string> = {
  empleo: 'Gracias, recibí tu mensaje sobre la vacante.',
  evento: 'Gracias por la invitación. Reviso la fecha y los detalles.',
  proyecto: 'Gracias por contarme. Leo lo que me escribiste y te propongo los siguientes pasos.',
  otro: 'Listo, recibí tu mensaje.'
}

export const tiempoRespuesta = () => (TIEMPO_RESPUESTA ? `Te respondo ${TIEMPO_RESPUESTA}.` : 'Te respondo pronto.')
