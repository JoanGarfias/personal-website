<script setup>
import { FileDown, Github, Linkedin, Youtube } from 'lucide-vue-next'
import { enlaceNegocios, perfil } from '~/content/perfil'

const links = [
  { label: 'GitHub', href: perfil.enlaces.github, icon: Github },
  { label: 'LinkedIn', href: perfil.enlaces.linkedin, icon: Linkedin },
  { label: 'YouTube', href: perfil.enlaces.youtube, icon: Youtube }
]
</script>

<template>
  <footer class="site-container mt-10 border-t border-line py-8">
    <div class="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-2">
        <p class="text-sm text-ink-muted">
          © {{ new Date().getFullYear() }} {{ perfil.nombre }} · Construyo software con propósito desde Oaxaca, México.
        </p>
        <!-- Puerta secundaria al sitio de proyectos para negocios -->
        <NuxtLink :to="enlaceNegocios" class="footer-text-link" data-evento="footer-negocio">
          ¿Tienes un negocio? Te ayudo a resolver lo que hoy haces a mano →
        </NuxtLink>
      </div>
      <ul class="flex flex-wrap gap-2">
        <li v-for="link in links" :key="link.label">
          <a
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
            class="footer-link"
            :aria-label="`${link.label} (abre en otra pestaña)`"
          >
            <component :is="link.icon" class="h-[18px] w-[18px]" aria-hidden="true" />
          </a>
        </li>
        <li>
          <a :href="perfil.enlaces.cv" :download="perfil.enlaces.cvNombre" class="footer-link footer-link--cv" aria-label="Descargar CV (PDF)" data-evento="cv">
            <FileDown class="h-[18px] w-[18px]" aria-hidden="true" />
            <span class="text-sm font-medium" aria-hidden="true">CV</span>
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  display: inline-flex;
  min-width: 2.75rem;
  height: 2.75rem;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  border: 1px solid var(--border-subtle);
  border-radius: 999px;
  background: var(--surface-1);
  color: var(--text-strong);
  transition: background-color 200ms var(--ease-brand), color 200ms var(--ease-brand), transform 200ms var(--ease-brand);
}

.footer-link--cv { padding-inline: 0.9rem; }

.footer-link:hover {
  background: var(--accent);
  color: var(--on-accent);
  transform: translateY(-2px);
}

.footer-text-link {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  color: var(--text-strong);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: underline;
  text-decoration-color: var(--border-strong);
  text-underline-offset: 3px;
}

.footer-text-link:hover { text-decoration-color: var(--accent); }
</style>
