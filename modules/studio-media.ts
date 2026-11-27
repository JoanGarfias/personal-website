// Studio lista como "media" todo lo que hay en public/ al momento del build, incluso lo que el build genera
// y que no está en GitHub (public/_optimized/, en .gitignore). Si una publicación toca uno de esos archivos
// (borrar, mover o renombrar), Studio pide a GitHub borrar una ruta que no existe y el commit falla con
// 422 GitRPC::BadObjectState. Este módulo los quita de la lista de media de Studio.
import { defineNuxtModule } from '@nuxt/kit'

// Carpetas de public/ que genera el build (mantener en sincronía con .gitignore)
const GENERATED_DIRS = ['_optimized']

const STUDIO_ASSETS_TEMPLATE = 'studio-assets.mjs'
// nuxt-studio escribe una línea por archivo: storage.setItem('public-assets/<ruta>', {...})
const GENERATED_LINE = new RegExp(`^storage\\.setItem\\('public-assets/(${GENERATED_DIRS.join('|')})/`)

export default defineNuxtModule({
  meta: { name: 'studio-media' },
  setup(_options, nuxt) {
    nuxt.hook('app:templates', (app) => {
      const template = app.templates.find(t => t.filename === STUDIO_ASSETS_TEMPLATE)
      if (!template?.getContents) return
      const getContents = template.getContents
      template.getContents = async (data) => {
        const contents = await getContents(data)
        return contents.split('\n').filter(line => !GENERATED_LINE.test(line)).join('\n')
      }
    })
  }
})
