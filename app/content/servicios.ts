// Catálogo del sitio de proyectos, organizado por el problema del cliente (no por tipo de producto).
// REGLA: cero tecnologías ni jerga técnica. `pnpm check:sin-tecnologia` revisa el sitio generado.
// id: va en la URL (?servicio=<id>) y preselecciona el servicio en el formulario.
// ejemplo: slug de un proyecto con vista `negocio` (app/content/projects.ts), si existe.

export interface Servicio {
  id: string
  // En primera persona del cliente, completa la frase "Quiero…"
  titulo: string
  // Etiqueta corta para el formulario
  etiqueta: string
  dolor: string
  comoSeVeResuelto: string
  idealPara: string
  ejemplo: string | null
  cta: string
}

export const servicios: Servicio[] = [
  {
    id: 'presencia',
    titulo: '…que me encuentren en internet',
    etiqueta: 'Que me encuentren en internet',
    dolor: 'Solo existo en redes sociales o por recomendación, y no me ven como un negocio serio.',
    comoSeVeResuelto: 'Una página propia y profesional que explica qué ofreces y convierte visitas en mensajes o clientes.',
    idealPara: 'Negocios que hoy dependen de una página de Facebook o del boca a boca.',
    ejemplo: null,
    cta: 'Quiero que me encuentren'
  },
  {
    id: 'pedidos',
    titulo: '…recibir pedidos o reservas sin perderlos',
    etiqueta: 'Recibir pedidos o reservas sin perderlos',
    dolor: 'Los pedidos llegan por WhatsApp, se pierden entre mensajes o se confunden.',
    comoSeVeResuelto: 'Tus clientes piden o reservan solos, y tú ves todo ordenado en un solo lugar.',
    idealPara: 'Pastelerías, restaurantes, salones, consultorios y cualquier negocio que trabaje con citas o encargos.',
    ejemplo: 'hecho-en-casa',
    cta: 'Quiero ordenar mis pedidos'
  },
  {
    id: 'tareas',
    titulo: '…dejar de perder tiempo en tareas a mano',
    etiqueta: 'Dejar de perder tiempo en tareas a mano',
    dolor: 'Paso horas haciendo cuentas, copiando datos de un lado a otro o persiguiendo información.',
    comoSeVeResuelto: 'Las tareas repetitivas se hacen solas y recuperas horas cada semana para atender tu negocio.',
    idealPara: 'Negocios donde alguien pasa buena parte del día en cuentas, listas o reportes repetitivos.',
    ejemplo: null,
    cta: 'Quiero recuperar mi tiempo'
  },
  {
    id: 'numeros',
    titulo: '…saber cómo va mi negocio',
    etiqueta: 'Saber cómo va mi negocio',
    dolor: 'No sé cuánto vendo, qué productos se mueven ni qué clientes regresan.',
    comoSeVeResuelto: 'Ves tus números clave de un vistazo, sin hojas sueltas ni libretas.',
    idealPara: 'Dueños que quieren tomar decisiones con datos y no solo con la intuición.',
    ejemplo: null,
    cta: 'Quiero ver mis números'
  },
  {
    id: 'eventos',
    titulo: '…organizar un evento sin caos',
    etiqueta: 'Organizar un evento sin caos',
    dolor: 'El registro, los accesos y las listas se hacen a mano, y el día del evento todo es filas y confusión.',
    comoSeVeResuelto: 'Registro en línea, entrada rápida con un gafete que se escanea y control en tiempo real de quién llegó.',
    idealPara: 'Congresos, foros, ferias y eventos con cientos de asistentes.',
    ejemplo: 'compufest-26',
    cta: 'Quiero organizar mi evento'
  },
  {
    id: 'a-la-medida',
    titulo: '…resolver algo que no encaja en lo anterior',
    etiqueta: 'Otra cosa',
    dolor: 'Tengo un problema específico que me cuesta tiempo o dinero y no sé cómo resolverlo.',
    comoSeVeResuelto: 'Lo platicamos con calma y diseñamos juntos una solución a la medida de tu negocio.',
    idealPara: 'Cualquier negocio con un problema que se repite todos los días.',
    ejemplo: null,
    cta: 'Cuéntame tu caso'
  }
]

export const getServicio = (id: string) => servicios.find(s => s.id === id) ?? null
