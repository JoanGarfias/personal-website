import { communityEntries, eventsAttended, roleLabels, type CommunityEntry, type TimelineItem } from '~/content/community'

const dateFormat = new Intl.DateTimeFormat('es-MX', { month: 'short', year: 'numeric', timeZone: 'UTC' })

export const formatEventDate = (iso: string | null) => (iso ? dateFormat.format(new Date(iso)) : null)

// "~60 estudiantes" → 60
const audienceNumber = (audience?: string) => {
  const match = audience?.replace(/[.,]/g, '').match(/\d+/)
  return match ? Number(match[0]) : null
}

export const useCommunity = () => {
  const { showPending } = usePending()

  // Con los pendientes apagados, las entradas de ejemplo desaparecen
  const entries = computed(() =>
    communityEntries
      .filter(e => showPending.value || !e.placeholder)
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  )
  const real = computed(() => communityEntries.filter(e => !e.placeholder))

  const given = computed(() => entries.value.filter(e => e.type !== 'asistente'))
  const attended = computed(() => entries.value.filter(e => e.type === 'asistente'))
  const featured = computed(() => given.value.find(e => e.featured) ?? null)

  // Contadores solo con datos reales; null = aún no hay datos (se muestra PendingText)
  const counters = computed(() => {
    const items = real.value
    // Las actividades dentro de otro evento (partOf) no se suman dos veces
    const people = items.filter(e => e.type !== 'asistente' && !e.partOf).map(e => audienceNumber(e.audience))
    const knownPeople = people.filter((n): n is number => n !== null)
    const list = [
      { key: 'charlas', label: 'Charlas', value: items.filter(e => e.type === 'charla').length },
      { key: 'talleres', label: 'Talleres', value: items.filter(e => e.type === 'taller').length },
      // "~" solo si alguna audiencia viene aproximada (ej. "~60 estudiantes")
      { key: 'personas', label: 'Personas alcanzadas', value: knownPeople.reduce((sum, n) => sum + n, 0), approx: items.some(e => e.audience?.trim().startsWith('~')) },
      { key: 'organizados', label: 'Eventos organizados', value: items.filter(e => e.type === 'organizacion').length }
    ]
    return items.length ? list.filter(c => c.value > 0) : list.map(c => ({ ...c, value: null }))
  })

  // Línea de tiempo de /comunidad: lo que di u organicé + eventos a los que asistí (sin fecha, al final)
  const timeline = computed<TimelineItem[]>(() => [
    ...given.value.map(e => ({
      id: e.id,
      type: e.type,
      title: e.title,
      subtitle: `${e.event} · ${e.city}`,
      date: e.date,
      role: roleLabels[e.role],
      photo: e.photo,
      url: e.url
    })),
    ...eventsAttended
      .map((e, i) => ({
        id: `asistido-${i}`,
        type: 'asistente' as const,
        title: e.title,
        subtitle: e.city ?? '',
        // Solo el año ("2026") no es una fecha: se muestra el rol
        date: e.date && /^\d{4}-\d{2}/.test(e.date) ? e.date : null,
        role: e.role,
        photo: e.photo ?? null,
        url: e.url
      }))
      .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
  ])

  // Charlas y talleres (sin el destacado, que va aparte)
  const talks = computed(() => given.value.filter(e => (e.type === 'charla' || e.type === 'taller') && e.id !== featured.value?.id))

  return { entries, given, attended, featured, counters, real, timeline, talks }
}

// JSON-LD Event para cada charla/taller real con fecha, evento y ciudad
export const communityEventsJsonLd = (entries: CommunityEntry[], siteUrl = '') =>
  entries
    .filter(e => !e.placeholder && e.type !== 'asistente' && e.date && e.event && e.city)
    .map(e => ({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `${e.title} · ${e.event}`,
      startDate: e.date,
      ...(e.city === 'En línea'
        ? { eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode', location: { '@type': 'VirtualLocation', url: e.url ?? siteUrl } }
        : {
            eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
            location: { '@type': 'Place', name: e.event, address: { '@type': 'PostalAddress', addressLocality: e.city, addressCountry: 'MX' } }
          }),
      performer: { '@type': 'Person', name: 'Joan Garfias' },
      ...(e.url ? { url: e.url } : {}),
      ...(e.photo ? { image: `${siteUrl}${e.photo}` } : {})
    }))
