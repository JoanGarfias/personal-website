// nuxt-studio lleva un parche (patches/nuxt-studio@1.8.0.patch): al publicar ignora borrados de archivos que no
// existen en la rama, que si no hacen fallar el commit con 422 GitRPC::BadObjectState.
// Studio sirve su app en /_studio-app/<versión>/ con caché "immutable" de un año, así que el navegador seguiría
// usando la copia sin parche. Este módulo la sirve en otra URL; súbele el sufijo cada vez que cambie el parche.
import { addVitePlugin, defineNuxtModule } from '@nuxt/kit'

const STUDIO_VERSION = '1.8.0'
const PATCH_SUFFIX = 'p1'

const ORIGINAL = `/_studio-app/${STUDIO_VERSION}`
const PATCHED = `${ORIGINAL}-${PATCH_SUFFIX}`

export default defineNuxtModule({
  meta: { name: 'studio-app-url' },
  setup(_options, nuxt) {
    // Archivos de la app de Studio
    nuxt.hook('nitro:init', (nitro) => {
      for (const asset of nitro.options.publicAssets) {
        if (asset.baseURL === ORIGINAL) asset.baseURL = PATCHED
      }
    })
    // El import('/_studio-app/<versión>/main.js') del plugin de Studio
    addVitePlugin({
      name: 'studio-app-url',
      renderChunk(code) {
        return code.includes(`${ORIGINAL}/`) ? code.replaceAll(`${ORIGINAL}/`, `${PATCHED}/`) : null
      }
    }, { server: false })
  }
})
