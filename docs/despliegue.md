# Despliegue: dos sitios desde un mismo repositorio

| Sitio | Dominio | Objetivo de build | Páginas |
|---|---|---|---|
| Personal | `www.joangarfias.me` | `SITE_TARGET=personal` (por defecto) | `app/pages/` |
| Proyectos | `proyectos.joangarfias.me` | `SITE_TARGET=proyectos` | `app/pages-proyectos/` |

Los dos comparten componentes, estilos, contenido (`app/content/`) y el formulario (`/api/contacto`).
Cada uno genera su propio canonical, `sitemap.xml`, `robots.txt`, metadatos Open Graph y datos estructurados
(`Person` en el personal, `ProfessionalService` en el de proyectos). Nuxt Studio y el blog solo existen en el personal.

## Comandos

```bash
pnpm dev                     # sitio personal en local
pnpm dev:proyectos           # sitio de proyectos en local
pnpm build                   # build del personal
pnpm build:proyectos         # build de proyectos + check:sin-tecnologia (falla si hay jerga técnica)
pnpm check:sin-tecnologia    # vuelve a revisar dist/ (después de build:proyectos)
```

## 1. Proyecto personal (ya existe)

Cloudflare Pages → `personal-website`. No cambia nada: sigue con `pnpm run build` y sin `SITE_TARGET`.

## 2. Crear el proyecto de proyectos

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Elige el mismo repositorio (`JoanGarfias/personal-website`) y la rama `main`.
3. Configuración de build:
   - **Project name:** `proyectos-joangarfias` (o el que quieras)
   - **Framework preset:** None
   - **Build command:** `pnpm run build`
   - **Build output directory:** `dist`
4. **Variables de entorno** (Settings → Variables and Secrets), para Production y Preview:
   - `SITE_TARGET` = `proyectos`
   - `NUXT_RESEND_API_KEY` (Secret): la misma API key de Resend que el personal
   - `NUXT_CONTACT_EMAIL` (Secret): el mismo buzón que el personal
   - `NUXT_PUBLIC_SHOW_PENDING` = `false`
   - Copia también la versión de Node que use el proyecto personal (`NODE_VERSION`), si la tiene definida.
5. **Save and Deploy**. Si el build encuentra un término técnico, falla y el log muestra la palabra y dónde está.

## 3. Dominio y DNS

1. En el proyecto nuevo: **Custom domains → Set up a custom domain** → `proyectos.joangarfias.me`.
2. Si la zona `joangarfias.me` está en Cloudflare, el registro se crea solo:
   `CNAME proyectos → proyectos-joangarfias.pages.dev` (con proxy).
   Si el DNS está en otro proveedor, crea ese CNAME a mano allá.
3. Espera a que el certificado diga **Active**.

## 4. Conectar los dos sitios

Cuando `proyectos.joangarfias.me` ya cargue:

1. En `app/content/perfil.ts` cambia `sitioProyectos: null` por `'https://proyectos.joangarfias.me'`.
   La puerta "¿Tienes un negocio…?" del Inicio y el enlace del footer dejarán de ir al formulario y apuntarán al subdominio.
2. Haz commit en `main`: se redespliegan los dos sitios.

El sitio de proyectos ya enlaza al personal ("Conoce a Joan") desde el principio.

## Notas

- Cada push a `main` (incluidos los commits de Nuxt Studio) reconstruye los dos sitios. Si algún día quieres evitarlo,
  usa **Build watch paths** en cada proyecto de Cloudflare Pages.
- Si cambias el subdominio, define `PROYECTOS_URL` (ej. `https://negocios.joangarfias.me`) en el proyecto de Cloudflare
  y actualiza `perfil.sitioProyectos`.
- Los archivos de `public/` se publican en los dos sitios (incluido el CV); no enlazan entre sí.
