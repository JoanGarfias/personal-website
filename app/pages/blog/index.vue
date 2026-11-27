<script setup lang="ts">
import { Rss, X } from 'lucide-vue-next'

const { siteUrl } = useRuntimeConfig().public
const route = useRoute()
const router = useRouter()

// draft: true → fuera del listado (y como nadie los enlaza, tampoco se prerenderizan)
const { data: posts } = await useAsyncData('blog-index', () =>
  queryCollection('blog')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .select('path', 'title', 'description', 'date', 'cover', 'coverAlt', 'tags', 'categoria', 'readingTime')
    .all()
)

const title = 'Blog | Joan Garfias'
const description = 'Historias, reflexiones y lo que voy aprendiendo en el camino, entre software, IA y lo que me deja cada experiencia.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogImage: absoluteUrl(siteUrl, DEFAULT_BLOG_OG),
  ogImageAlt: 'Blog de Joan Garfias',
  twitterTitle: title,
  twitterDescription: description,
  twitterImage: absoluteUrl(siteUrl, DEFAULT_BLOG_OG)
})

useHead({
  link: [{ rel: 'alternate', type: 'application/rss+xml', title: 'Blog de Joan Garfias', href: `${siteUrl}/blog/rss.xml` }]
})

// Filtros en la URL para poder compartirlos: /blog?categoria=tecnico&tag=nuxt
// La página es estática (sin query): el filtro se aplica al montar, así el HTML prerenderizado
// y la hidratación coinciden y luego la lista se ajusta a la URL.
const mounted = ref(false)
onMounted(() => { mounted.value = true })

const categoria = computed<BlogCategoria | null>(() => {
  const value = mounted.value ? route.query.categoria : null
  return esCategoria(value) ? value : null
})
const tag = computed<string | null>(() => {
  const value = mounted.value ? route.query.tag : null
  return typeof value === 'string' && value ? value : null
})

const all = computed(() => posts.value ?? [])
const categorias = computed(() =>
  (Object.keys(BLOG_CATEGORIAS) as BlogCategoria[])
    .map(key => ({ key, label: BLOG_CATEGORIAS[key], count: all.value.filter(p => p.categoria === key).length }))
    .filter(c => c.count > 0)
)
// Etiquetas de los posts de la categoría elegida, de la más usada a la menos
const tags = computed(() => {
  const counts = new Map<string, number>()
  for (const post of all.value) {
    if (categoria.value && post.categoria !== categoria.value) continue
    for (const t of post.tags) counts.set(t, (counts.get(t) ?? 0) + 1)
  }
  return [...counts].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([name, count]) => ({ name, count }))
})

const visible = computed(() =>
  all.value.filter(p => (!categoria.value || p.categoria === categoria.value) && (!tag.value || p.tags.includes(tag.value)))
)
const filtering = computed(() => !!(categoria.value || tag.value))

const setFilter = (next: { categoria?: string | null; tag?: string | null }) => {
  const query = { ...route.query, ...next }
  for (const key of Object.keys(query)) if (!query[key]) delete query[key]
  router.replace({ query })
}
const toggleCategoria = (key: BlogCategoria) =>
  // Cambiar de categoría limpia la etiqueta si ya no aplica
  setFilter({ categoria: categoria.value === key ? null : key, tag: null })
const toggleTag = (name: string) => setFilter({ tag: tag.value === name ? null : name })
const clear = () => setFilter({ categoria: null, tag: null })
</script>

<template>
  <div class="pb-16 pt-6 lg:pt-10">
    <header class="max-w-3xl space-y-7">
      <div class="flex items-center gap-4">
        <SectionLabel index="//" label="Blog" />
        <span class="hidden h-px flex-1 bg-line sm:block"></span>
        <a href="/blog/rss.xml" class="inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted hover:text-accent-ink">
          <Rss class="h-4 w-4" aria-hidden="true" /> RSS
        </a>
      </div>
      <h1 class="display-title">Blog<span class="text-accent-word">.</span></h1>
      <p class="text-xl leading-8 text-ink-body">{{ description }}</p>
    </header>

    <!-- Filtros -->
    <div v-if="all.length > 1" class="filters mt-12">
      <div class="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por categoría">
        <span class="filters__label">Categoría</span>
        <button type="button" class="filter-chip" :aria-pressed="!categoria" @click="setFilter({ categoria: null, tag: null })">
          Todo <span class="filter-chip__count">({{ all.length }})</span>
        </button>
        <button
          v-for="c in categorias"
          :key="c.key"
          type="button"
          class="filter-chip"
          :aria-pressed="categoria === c.key"
          @click="toggleCategoria(c.key)"
        >
          {{ c.label }} <span class="filter-chip__count">({{ c.count }})</span>
        </button>
      </div>
      <div v-if="tags.length" class="mt-3 flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar por etiqueta">
        <span class="filters__label">Etiquetas</span>
        <button
          v-for="t in tags"
          :key="t.name"
          type="button"
          class="tag-chip"
          :aria-pressed="tag === t.name"
          @click="toggleTag(t.name)"
        >
          #{{ t.name }}
        </button>
      </div>
      <p class="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink-muted" aria-live="polite">
        <span>{{ visible.length }} {{ visible.length === 1 ? 'publicación' : 'publicaciones' }}</span>
        <button v-if="filtering" type="button" class="inline-flex min-h-11 items-center gap-1 font-medium text-ink-strong hover:text-accent-ink" @click="clear">
          <X class="h-4 w-4" aria-hidden="true" /> Quitar filtros
        </button>
      </p>
    </div>

    <ul v-if="visible.length" class="mt-8 grid gap-6" role="list">
      <li v-for="(post, i) in visible" :key="post.path">
        <article class="post-card card group">
          <NuxtPicture
            v-if="post.cover"
            :src="post.cover"
            :alt="post.coverAlt ?? ''"
            width="1600"
            height="900"
            sizes="xs:100vw sm:100vw md:280px"
            format="avif,webp"
            :loading="i === 0 ? 'eager' : 'lazy'"
            class="contents"
            :img-attrs="{ class: 'post-card__cover', fetchpriority: i === 0 ? 'high' : undefined }"
          />
          <div class="post-card__body">
            <p class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-muted">
              <span class="font-medium text-accent-ink">{{ BLOG_CATEGORIAS[post.categoria] }}</span>
              <span aria-hidden="true">·</span>
              <time :datetime="isoDate(post.date)">{{ formatPostDate(post.date) }}</time>
              <template v-if="post.readingTime">
                <span aria-hidden="true">·</span>
                <span>{{ post.readingTime }} min de lectura</span>
              </template>
            </p>
            <h2 class="post-card__title">
              <!-- El enlace cubre toda la tarjeta (::after) -->
              <NuxtLink :to="post.path" class="post-card__link">{{ post.title }}</NuxtLink>
            </h2>
            <p class="leading-7 text-ink-body">{{ post.description }}</p>
            <ul v-if="post.tags?.length" class="flex flex-wrap gap-2" aria-label="Etiquetas">
              <li v-for="t in post.tags" :key="t">
                <NuxtLink :to="{ path: '/blog', query: { tag: t } }" class="chip chip--link">#{{ t }}</NuxtLink>
              </li>
            </ul>
          </div>
        </article>
      </li>
    </ul>

    <p v-else-if="filtering" class="mt-10 rounded-card border border-dashed border-line p-6 text-ink-muted">
      No hay publicaciones con ese filtro.
      <button type="button" class="font-medium text-ink-strong underline underline-offset-2" @click="clear">Ver todas</button>
    </p>
    <p v-else class="mt-14 text-ink-muted">Pronto habrá publicaciones aquí.</p>
  </div>
</template>

<style scoped>
.filters__label {
  min-width: 5.5rem;
  color: var(--text-muted);
  font-family: var(--font-meta);
  font-size: 0.75rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.filter-chip,
.tag-chip {
  min-height: 2.5rem;
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-card-sm);
  background: var(--surface-1);
  padding: 0.4rem 0.95rem;
  color: var(--text-strong);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: border-color 180ms var(--ease-brand), background-color 180ms var(--ease-brand), color 180ms var(--ease-brand);
}

.tag-chip {
  min-height: 2.25rem;
  border-radius: 999px;
  padding-inline: 0.8rem;
  font-family: var(--font-meta);
  font-size: 0.8125rem;
}

.filter-chip:hover,
.tag-chip:hover { border-color: var(--text-strong); }

.filter-chip__count { color: var(--text-muted); }

.filter-chip[aria-pressed="true"],
.tag-chip[aria-pressed="true"] {
  border-color: var(--text-strong);
  background: var(--text-strong);
  color: var(--surface-0);
}

.filter-chip[aria-pressed="true"] .filter-chip__count { color: inherit; opacity: 0.7; }

/* Las etiquetas de cada tarjeta filtran el listado */
.chip--link {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  font-family: var(--font-meta);
}
.chip--link:hover { border-color: var(--text-strong); color: var(--text-strong); }

.post-card {
  position: relative;
  display: grid;
  overflow: hidden;
  transition: border-color 200ms var(--ease-brand), transform 200ms var(--ease-brand);
}

.post-card:hover { border-color: var(--border-strong); }
.post-card:has(.post-card__link:focus-visible) { outline: 2px solid var(--accent-ink); outline-offset: 3px; }

.post-card :deep(.post-card__cover) {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  background: var(--surface-2);
}

.post-card__body {
  display: grid;
  align-content: start;
  gap: 0.85rem;
  padding: 1.5rem;
}

.post-card__title {
  font-family: var(--font-heading);
  font-size: clamp(1.375rem, 2.6vw, 1.75rem);
  font-weight: 500;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--text-strong);
}

.post-card__link { outline: none; }
.post-card__link::after { content: ''; position: absolute; inset: 0; }
.group:hover .post-card__link { color: var(--accent-ink); }

/* Las etiquetas quedan sobre el enlace para no romper la lectura con lector de pantalla */
.post-card__body > ul { position: relative; }

@media (min-width: 768px) {
  .post-card { grid-template-columns: 17.5rem minmax(0, 1fr); }
  .post-card :deep(.post-card__cover) { height: 100%; aspect-ratio: auto; min-height: 12rem; }
  .post-card__body { padding: 1.75rem 2rem; }
}
</style>
