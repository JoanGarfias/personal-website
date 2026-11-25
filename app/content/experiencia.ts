// Experiencia laboral (fuente: CV). Del más reciente al más antiguo.
// caso: ruta del caso de estudio relacionado, si existe.

export interface Puesto {
  id: string
  puesto: string
  organizacion: string
  descripcion?: string
  periodo: string
  // ISO "AAAA-MM" para ordenar y para datos estructurados; fin null = actual
  inicio: string
  fin: string | null
  logros: string[]
  url?: string
  caso?: string
}

export const experiencia: Puesto[] = [
  {
    id: 'tiven',
    puesto: 'Backend Developer',
    organizacion: 'Tiven',
    descripcion: 'SaaS para salones de belleza',
    periodo: 'Dic 2025 – actualidad',
    inicio: '2025-12',
    fin: null,
    logros: [
      'Desarrollo módulos de negocio y colaboro en el modelado de datos y el despliegue (Docker, AWS) de un SaaS en producción.',
      'Diseñé la API que protege la integridad de ventas, inventario y puntos; la plataforma redujo 30% el tiempo administrativo de los salones.',
      'Implementé colas de trabajo y caché para mantener la disponibilidad, e integré servicios externos.'
    ],
    url: 'https://tiven.app',
    caso: '/proyectos/tiven'
  },
  {
    id: 'unistmo',
    puesto: 'Desarrollador Web Full-Stack',
    organizacion: 'Universidad del Istmo',
    descripcion: 'Sitio institucional',
    periodo: 'Feb 2026 – Jun 2026',
    inicio: '2026-02',
    fin: '2026-06',
    logros: [
      'Diseñé una arquitectura desacoplada (Astro SSG + Strapi Headless CMS + PostgreSQL) para que el personal edite el sitio sin depender del equipo técnico.',
      'Implementé el pipeline CI/CD con GitHub Actions, Docker y Nginx; rediseñé la navegación con Card Sorting y Design Thinking.'
    ],
    url: 'https://www2.unistmo.edu.mx',
    caso: '/proyectos/unistmo-web'
  },
  {
    id: 'blueservices',
    puesto: 'Desarrollador Web',
    organizacion: 'BlueServices SC',
    periodo: 'Jul 2025 – Sep 2025',
    inicio: '2025-07',
    fin: '2025-09',
    logros: [
      'Desarrollé APIs REST en PHP 8 para clientes de 4 sectores: hotelería, automotriz, transporte y salud.',
      'Refactoricé código existente y mejoré las prácticas de desarrollo del equipo.'
    ]
  }
]
