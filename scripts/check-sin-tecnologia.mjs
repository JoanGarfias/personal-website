// Regla de oro del sitio de proyectos: cero tecnologías ni jerga técnica en lo que ve un dueño de negocio.
// Revisa el HTML GENERADO (dist/) del build con SITE_TARGET=proyectos: el texto visible, los alt/title/aria-label/
// placeholder, el <title>, las meta descripciones/Open Graph y los datos estructurados (JSON-LD).
// No revisa scripts ni estilos: el visitante no los lee.
//
// Uso:
//   pnpm check:sin-tecnologia            revisa dist/ (corre `SITE_TARGET=proyectos pnpm build` antes)
//   node scripts/check-sin-tecnologia.mjs <carpeta>
// En `pnpm build` corre solo cuando SITE_TARGET=proyectos (--si-proyectos), y si encuentra algo el build falla.
import { readdir, readFile } from 'node:fs/promises'
import { join, relative } from 'node:path'

// Lista no exhaustiva: agrega aquí cualquier término nuevo. Coincidencia sin distinguir mayúsculas,
// por palabra completa (así "astro" no salta dentro de "nuestro", ni "api" dentro de "rápida").
export const PROHIBIDOS = [
  'Laravel', 'PHP', 'Vue', 'Vue.js', 'Nuxt', 'NuxtJS', 'Next', 'Next.js', 'React', 'Astro', 'NestJS', 'Node', 'Node.js',
  'TypeScript', 'JavaScript', 'Python', 'SQL', 'PostgreSQL', 'MySQL', 'Supabase', 'Strapi', 'Stripe', 'Tailwind',
  'AWS', 'Cloudflare', 'Docker', 'Nginx', 'GitHub', 'Git', 'Heroku', 'Resend', 'HTML', 'CSS',
  'API', 'APIs', 'backend', 'back-end', 'frontend', 'front-end', 'full-stack', 'fullstack', 'SaaS', 'CI/CD',
  'deploy', 'despliegue', 'framework', 'base de datos', 'bases de datos', 'servidor', 'servidores',
  'cloud', 'la nube', 'stack', 'hosting', 'código fuente', 'programación', 'programar', 'desarrollador'
]

const escape = s => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
// Límites de palabra con letras acentuadas (\b de JS solo entiende ASCII)
const patron = new RegExp(`(?<![\\p{L}\\p{N}])(${PROHIBIDOS.map(escape).join('|')})(?![\\p{L}\\p{N}])`, 'giu')

const decode = s => s
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))

// Texto que una persona (o un buscador) puede leer en la página
export const textoVisible = (html) => {
  const partes = []
  // JSON-LD: lo leen los buscadores y aparece en los resultados
  for (const [, json] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    partes.push({ donde: 'JSON-LD', texto: json })
  }
  // Metadatos de título y descripción (pestaña, buscadores, vista previa al compartir)
  for (const [, attrs] of html.matchAll(/<meta\s([^>]+)>/gi)) {
    if (/(name|property)="(description|og:title|og:description|twitter:title|twitter:description|og:image:alt|og:site_name)"/i.test(attrs)) {
      const content = attrs.match(/content="([^"]*)"/i)?.[1]
      if (content) partes.push({ donde: 'meta', texto: decode(content) })
    }
  }
  for (const [, t] of html.matchAll(/<title>([\s\S]*?)<\/title>/gi)) partes.push({ donde: 'title', texto: decode(t) })

  const cuerpo = html
    .replace(/<head[\s\S]*?<\/head>/i, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<template[\s\S]*?<\/template>/gi, '')
  // Atributos que se leen o se escuchan con lector de pantalla
  for (const [, attr, valor] of cuerpo.matchAll(/\s(alt|title|aria-label|placeholder)="([^"]*)"/gi)) {
    partes.push({ donde: attr, texto: decode(valor) })
  }
  partes.push({ donde: 'texto', texto: decode(cuerpo.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ') })
  return partes
}

const htmlFiles = async (dir) => {
  const out = []
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('_')) out.push(...await htmlFiles(path))
    } else if (entry.name.endsWith('.html')) out.push(path)
  }
  return out
}

const main = async () => {
  const args = process.argv.slice(2)
  // --si-proyectos: en `pnpm build` solo actúa cuando el objetivo es el sitio de proyectos
  if (args.includes('--si-proyectos') && process.env.SITE_TARGET !== 'proyectos') return
  const dir = args.find(a => !a.startsWith('--')) ?? 'dist'
  const archivos = await htmlFiles(dir).catch(() => [])
  if (!archivos.length) {
    console.error(`[check:sin-tecnologia] No hay HTML en ${dir}/. Corre antes: SITE_TARGET=proyectos pnpm build`)
    process.exit(1)
  }

  const hallazgos = []
  for (const archivo of archivos) {
    const html = await readFile(archivo, 'utf8')
    for (const { donde, texto } of textoVisible(html)) {
      for (const m of texto.matchAll(patron)) {
        const inicio = Math.max(0, m.index - 40)
        hallazgos.push({
          archivo: relative(process.cwd(), archivo),
          donde,
          termino: m[0],
          contexto: texto.slice(inicio, m.index + m[0].length + 40).trim()
        })
      }
    }
  }

  if (hallazgos.length) {
    console.error(`\n✗ [check:sin-tecnologia] ${hallazgos.length} término(s) técnico(s) en el sitio de proyectos:\n`)
    for (const h of hallazgos) console.error(`  ${h.archivo} (${h.donde}): «${h.termino}» → …${h.contexto}…`)
    console.error('\nReescríbelo en lenguaje de resultado ("tus clientes reservan solos", "dejas de perder pedidos").\n')
    process.exit(1)
  }
  console.log(`✓ [check:sin-tecnologia] ${archivos.length} página(s) revisadas, sin términos técnicos.`)
}

// Solo al ejecutarse directo (no al importarlo desde otra herramienta)
if (import.meta.url === `file://${process.argv[1]}`) await main()
