// Utilidades del blog (listado, post y RSS)

const dateFormat = new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

// Las fechas del frontmatter llegan como ISO (medianoche UTC): se formatean en UTC para no restar un día
export const formatPostDate = (date: string | Date) => dateFormat.format(new Date(date))

export const isoDate = (date: string | Date) => new Date(date).toISOString().slice(0, 10)

export const absoluteUrl = (siteUrl: string, path: string) =>
  /^https?:\/\//.test(path) ? path : `${siteUrl}${path.startsWith('/') ? '' : '/'}${path}`

// Portada por defecto para OG y RSS cuando el post no tiene una (1200×630)
export const DEFAULT_BLOG_OG = '/images/blog/og-default.png'

// Categorías del blog (content.config.ts). El orden es el de los filtros del listado.
export const BLOG_CATEGORIAS = {
  tecnico: 'Técnico',
  comunidad: 'Comunidad',
  reflexiones: 'Reflexiones'
} as const
export type BlogCategoria = keyof typeof BLOG_CATEGORIAS
export const esCategoria = (value: unknown): value is BlogCategoria =>
  typeof value === 'string' && value in BLOG_CATEGORIAS

// "Blog" solo aparece en la navegación con al menos estas publicaciones (sin borradores).
// La ruta /blog existe siempre. Hoy en 1: se muestra aunque haya pocos posts.
export const BLOG_MIN_POSTS_NAV = 1

// Posts relacionados: misma categoría y etiquetas en común (las etiquetas pesan más)
export const relatedPosts = <T extends { path: string; categoria: string; tags: string[]; date: string | Date }>(
  current: { path: string; categoria: string; tags: string[] },
  posts: T[],
  limit = 3
) =>
  posts
    .filter(p => p.path !== current.path)
    .map(p => ({
      post: p,
      score: p.tags.filter(t => current.tags.includes(t)).length * 2 + (p.categoria === current.categoria ? 1 : 0)
    }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score || +new Date(b.post.date) - +new Date(a.post.date))
    .slice(0, limit)
    .map(r => r.post)
