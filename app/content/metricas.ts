// Cifras verificadas (salen del CV). Todas las páginas las leen de aquí: no las repitas a mano.
// Para cambiar una cifra, cámbiala primero en el CV.

export interface Metrica {
  id: string
  // Número para la animación; si la cifra no es un número limpio (ej. "72+"), usa prefijo/sufijo
  valor: number
  prefijo?: string
  sufijo?: string
  // Frase corta que acompaña la cifra
  texto: string
  // Caso de estudio o página que la respalda
  fuente?: string
}

export const metricas = {
  tivenTiempoAdministrativo: {
    id: 'tiven-tiempo',
    valor: 30,
    prefijo: '−',
    sufijo: '%',
    texto: 'de tiempo administrativo en los salones que usan Tiven, el SaaS donde soy backend developer',
    fuente: '/proyectos/tiven'
  },
  compufestAsistentes: {
    id: 'compufest-asistentes',
    valor: 450,
    texto: 'asistentes en 3 días con el registro y check-in que construí en 2 días para CompuFest 26',
    fuente: '/proyectos/compufest-26'
  },
  compufestEscaneos: { id: 'compufest-escaneos', valor: 699, texto: 'escaneos en 5 puntos de acceso durante CompuFest 26', fuente: '/proyectos/compufest-26' },
  compufestDiasConstruccion: { id: 'compufest-construccion', valor: 2, texto: 'días para construir el sistema de CompuFest 26', fuente: '/proyectos/compufest-26' },
  civitasEquipo: { id: 'civitas-equipo', valor: 23, texto: 'personas en el equipo ágil de Civitas', fuente: '/proyectos/civitas' },
  nexisMiembros: { id: 'nexis-miembros', valor: 72, sufijo: '+', texto: 'miembros en Nexis Oaxaca' },
  nexisEventos: { id: 'nexis-eventos', valor: 30, sufijo: '+', texto: 'eventos de Nexis Oaxaca' },
  charlas: { id: 'charlas', valor: 4, texto: 'charlas sobre IA y desarrollo de software', fuente: '/comunidad' },
  talleres: { id: 'talleres', valor: 2, texto: 'talleres sobre IA y desarrollo de software', fuente: '/comunidad' }
} satisfies Record<string, Metrica>

// "72+", "−30%": la cifra como texto, para donde no hay animación
export const cifra = (m: Metrica) => `${m.prefijo ?? ''}${m.valor}${m.sufijo ?? ''}`

// Las 2 pruebas del hero del Inicio
export const pruebasHero: Metrica[] = [metricas.tivenTiempoAdministrativo, metricas.compufestAsistentes]
