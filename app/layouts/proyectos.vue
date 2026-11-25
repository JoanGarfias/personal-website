<script setup lang="ts">
import { ArrowUpRight, Moon, Sun } from 'lucide-vue-next'

// Layout del sitio de proyectos: sin la navegación del sitio personal.
// Solo un enlace discreto en el footer hacia joangarfias.me.
const { theme, toggle } = useTheme()
const { personalUrl, siteName } = useRuntimeConfig().public
</script>

<template>
  <div class="biz-shell">
    <a href="#main-content" class="skip-link">Saltar al contenido</a>

    <header class="biz-header site-container">
      <NuxtLink to="/" class="biz-header__brand" :aria-label="`${siteName}, inicio`">
        <img src="/logo.svg" alt="" width="1340" height="1012" class="biz-header__logo h-6 w-auto" />
        <span class="font-display text-base font-medium tracking-tight text-ink-strong">Joan Garfias</span>
        <span class="biz-header__tag">Proyectos</span>
      </NuxtLink>

      <div class="flex items-center gap-2">
        <!-- En móvil el hero ya trae este botón; .button-primary pisa a max-sm:hidden, por eso el span -->
        <span class="max-sm:hidden">
          <a href="#contacto" class="button-primary group" data-evento="header-contacto">
            Cuéntame qué te pasa <ArrowUpRight class="arrow-swap h-4 w-4" aria-hidden="true" />
          </a>
        </span>
        <button
          type="button"
          class="biz-header__theme"
          :aria-label="theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'"
          @click="toggle"
        >
          <Sun v-if="theme === 'dark'" class="h-[18px] w-[18px]" aria-hidden="true" />
          <Moon v-else class="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>
    </header>

    <main id="main-content" class="site-container">
      <slot />
    </main>

    <footer class="site-container mt-10 border-t border-line py-8">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p class="text-sm text-ink-muted">© {{ new Date().getFullYear() }} Joan Garfias · Santo Domingo Tehuantepec, Oaxaca.</p>
        <a :href="personalUrl" class="biz-footer__link" data-evento="conoce-a-joan">
          Conoce a Joan <ArrowUpRight class="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.biz-shell {
  min-height: 100dvh;
  padding: 0 0.75rem 2rem;
}

@media (min-width: 768px) {
  .biz-shell { padding-inline: 1.5rem; }
}

.biz-header {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  min-height: 4rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: color-mix(in srgb, var(--surface-0) 88%, transparent);
  backdrop-filter: blur(12px);
}

.biz-header__brand {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.6rem;
}

/* El logo es blanco: en tema claro se invierte */
.biz-header__logo { filter: invert(1); }
:root[data-theme="dark"] .biz-header__logo { filter: none; }

.biz-header__tag {
  border-radius: 999px;
  background: var(--accent-soft);
  padding: 0.15rem 0.6rem;
  color: var(--accent-ink);
  font-size: 0.75rem;
  font-weight: 600;
}

.biz-header__theme {
  display: grid;
  width: 2.75rem;
  height: 2.75rem;
  place-items: center;
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  background: var(--surface-1);
  color: var(--text-strong);
  cursor: pointer;
}

.biz-footer__link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  gap: 0.35rem;
  color: var(--text-muted);
  font-size: 0.875rem;
  font-weight: 500;
}

.biz-footer__link:hover { color: var(--text-strong); }
</style>
