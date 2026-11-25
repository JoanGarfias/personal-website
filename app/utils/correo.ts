// El correo de contacto nunca aparece como texto en la página ni en el HTML prerenderizado:
// se arma en el navegador al hacer clic. Úsalo en un <button>, no en un href.
const partes = ['fpfragapnaoj', 'moc.liamg']

const correoContacto = () => partes.map(p => [...p].reverse().join('')).join('@')

export const abrirCorreo = () => {
  window.location.href = `mailto:${correoContacto()}`
}
