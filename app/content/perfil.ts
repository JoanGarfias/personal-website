// Perfil: una sola fuente para nombre, titular, ubicación, formación, disponibilidad y enlaces.
// Fuente de verdad de fechas y cifras: el CV (public/cv.pdf). No escribas estos datos a mano en los componentes.
// El correo de contacto NO va aquí: nunca se muestra como texto (ver app/utils/correo.ts).

export const perfil = {
  nombre: 'Joan Garfias',
  nombreCompleto: 'Joan Pablo Alvarado Garfias',
  titular: 'Desarrollador de Software',
  // Bajo el nombre en el hero y en la tarjeta de perfil
  areas: 'backend · cloud',
  identidad:
    'Desarrollador de software junior (backend, full-stack y cloud) del Istmo de Tehuantepec, Oaxaca, y cofundador de Nexis Oaxaca.',

  ubicacion: {
    ciudad: 'Santo Domingo Tehuantepec',
    region: 'Istmo de Tehuantepec',
    estado: 'Oaxaca',
    pais: 'México'
  },

  formacion: {
    carrera: 'Ingeniería en Computación',
    escuela: 'Universidad del Istmo',
    siglas: 'UNISTMO',
    periodo: '2022 – 2027',
    egreso: 'junio de 2027'
  },

  disponibilidad: {
    // Etiqueta corta de la tarjeta de perfil (sustituye a "Disponible para colaborar")
    estado: 'Buscando empleo',
    puesto: 'Puestos de ingeniero de software, desarrollador backend o full-stack',
    modalidad: 'Remoto desde Oaxaca',
    egreso: 'Egreso en junio de 2027'
  },

  idiomas: [
    { idioma: 'Español', nivel: 'Nativo' },
    { idioma: 'Inglés', nivel: 'A2 · lectura de documentación técnica' }
  ],

  enlaces: {
    github: 'https://github.com/JoanGarfias',
    linkedin: 'https://linkedin.com/in/joangarfias',
    youtube: 'https://youtube.com/@joan_dev',
    cv: '/cv.pdf',
    cvNombre: 'CV_Joan_Garfias.pdf',
    nexis: 'https://nexisoaxaca.tech',
    // WhatsApp con mensaje prellenado; el número no se muestra como texto, solo "Envíame un mensaje"
    whatsapp: `https://wa.me/529717296179?text=${encodeURIComponent('¡Hola, Joan! Te escribo desde tu sitio web.')}`
  },

  // Enlace para agendar una llamada (Cal.com, Calendly…). null → "Agendar conversación" lleva al formulario.
  agenda: 'https://calendar.app.google/FumGgtKYeoss6Kro7',

  // Sitio de proyectos para negocios (subdominio, Fase 3). null → la puerta "negocio" lleva al formulario con motivo=proyecto.
  sitioProyectos: 'https://proyectos.joangarfias.me'
}

// Destino de la puerta "¿Tienes un negocio…?" mientras el subdominio no exista
export const enlaceNegocios = perfil.sitioProyectos ?? '/contacto?motivo=proyecto'
