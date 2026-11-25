// Genera las imágenes Open Graph (1200×630) de los dos sitios: public/og-personal.png y public/og-proyectos.png.
// Se corre a mano cuando cambie el titular o la marca (no forma parte del build):
//   node scripts/og-images.mjs
// Lee el nombre y el titular de app/content/perfil.ts (Node ≥ 22.18 importa .ts sin configuración).
import sharp from 'sharp'
import { perfil } from '../app/content/perfil.ts'

const W = 1200
const H = 630
const BG = '#0b0d10'
const ACCENT = '#22d3ee'
const FONT = "'Ubuntu Sans', 'Inter', 'DejaVu Sans', sans-serif"

const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c])

// Parte un texto en líneas de como máximo `max` caracteres (sin cortar palabras)
const lines = (text, max) => text.split(' ').reduce((acc, word) => {
  const last = acc[acc.length - 1]
  if (last && (last + ' ' + word).length <= max) acc[acc.length - 1] = last + ' ' + word
  else acc.push(word)
  return acc
}, [])

const tspans = (items, x, y, size, lh) =>
  items.map((t, i) => `<tspan x="${x}" y="${y + i * size * lh}">${esc(t)}</tspan>`).join('')

const portrait = await sharp('public/joan.jpeg')
  .resize(470, 630, { fit: 'cover', position: 'attention' })
  .toBuffer()

const fade = Buffer.from(`<svg width="470" height="630"><defs><linearGradient id="g" x1="0" x2="1">
  <stop offset="0" stop-color="${BG}" stop-opacity="1"/><stop offset="0.45" stop-color="${BG}" stop-opacity="0"/></linearGradient></defs>
  <rect width="470" height="630" fill="url(#g)"/></svg>`)

const render = async (file, svg) => {
  await sharp({ create: { width: W, height: H, channels: 3, background: BG } })
    .composite([
      { input: portrait, left: W - 470, top: 0 },
      { input: fade, left: W - 470, top: 0 },
      { input: Buffer.from(svg), left: 0, top: 0 }
    ])
    .png({ compressionLevel: 9 })
    .toFile(file)
  console.log(`✓ ${file}`)
}

const titular = lines(perfil.titular, 26)
await render('public/og-personal.png', `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="72" y="92" fill="${ACCENT}" font-family="${FONT}" font-size="26" font-weight="600" letter-spacing="1">joangarfias.me</text>
  <text font-family="${FONT}" font-size="88" font-weight="600" fill="#fff" letter-spacing="-2">${tspans([perfil.nombre], 72, 250, 88, 1.1)}</text>
  <text font-family="${FONT}" font-size="42" font-weight="500" fill="#e5e7eb">${tspans(titular, 72, 330, 42, 1.25)}</text>
  <text font-family="${FONT}" font-size="28" fill="#9ca3af">${tspans([perfil.areas, `${perfil.ubicacion.region}, ${perfil.ubicacion.estado}`], 72, 330 + titular.length * 52 + 40, 28, 1.5)}</text>
  <rect x="72" y="540" width="96" height="6" rx="3" fill="${ACCENT}"/>
</svg>`)

const frase = lines('Tu negocio no debería depender de libretas, mensajes perdidos y horas de trabajo manual.', 28)
await render('public/og-proyectos.png', `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <text x="72" y="92" fill="${ACCENT}" font-family="${FONT}" font-size="26" font-weight="600" letter-spacing="1">${esc(perfil.nombre)} — Proyectos</text>
  <text font-family="${FONT}" font-size="54" font-weight="600" fill="#fff" letter-spacing="-1">${tspans(frase, 72, 190, 54, 1.2)}</text>
  <text font-family="${FONT}" font-size="30" fill="#9ca3af">${tspans(['Te ayudo a resolverlo, desde Oaxaca y a distancia.'], 72, 190 + frase.length * 65 + 40, 30, 1.4)}</text>
  <rect x="72" y="540" width="96" height="6" rx="3" fill="${ACCENT}"/>
</svg>`)
