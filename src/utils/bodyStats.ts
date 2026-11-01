import type { BodyType, CelestialBody } from '../data/bodies'
import type { Unit } from '../store/useAppStore'
import { formatDecimal, formatRatio, formatScientific } from './format'

export type StatId = 'radius' | 'diameter' | 'gravity' | 'mass' | 'orbitalVelocity'

export interface StatRow {
  id: StatId
  label: string
  value: string
}

type StatSource = Pick<CelestialBody, 'radiusKm' | 'massKg' | 'gravity' | 'orbitalVelocityKmS'>

interface StatDefinition {
  id: StatId
  label: string
  /** `null` = the quantity doesn't exist for this body (the row is omitted). */
  read: (body: StatSource) => number | null
  formatAbsolute: (value: number) => string
}

const STATS: StatDefinition[] = [
  {
    id: 'radius',
    label: 'Raio',
    read: (b) => b.radiusKm,
    formatAbsolute: (v) => `${formatDecimal(v)} km`,
  },
  {
    id: 'diameter',
    label: 'Diâmetro',
    read: (b) => b.radiusKm * 2,
    formatAbsolute: (v) => `${formatDecimal(v)} km`,
  },
  {
    id: 'gravity',
    label: 'Gravidade na superfície',
    read: (b) => b.gravity,
    // Source data has one decimal; keep it visible ("9,0", "11,0").
    formatAbsolute: (v) => `${formatDecimal(v, 1, 1)} m/s²`,
  },
  {
    id: 'mass',
    label: 'Massa',
    read: (b) => b.massKg,
    formatAbsolute: (v) => `${formatScientific(v)} kg`,
  },
  {
    id: 'orbitalVelocity',
    label: 'Velocidade orbital média',
    read: (b) => b.orbitalVelocityKmS,
    formatAbsolute: (v) => `${formatDecimal(v, 1, 1)} km/s`,
  },
]

/**
 * Rows for the info panel. In 'earth' mode every value becomes a ratio to
 * the same quantity on Earth; a quantity the body doesn't have (the Sun's
 * orbital velocity) is left out in both modes instead of shown as 0 or "—".
 */
export function getBodyStats(body: StatSource, unit: Unit, earth: StatSource): StatRow[] {
  const rows: StatRow[] = []
  for (const stat of STATS) {
    const value = stat.read(body)
    if (value === null) continue
    if (unit === 'km') {
      rows.push({ id: stat.id, label: stat.label, value: stat.formatAbsolute(value) })
      continue
    }
    const earthValue = stat.read(earth)
    // Earth always has every quantity; the guard keeps the types honest.
    if (earthValue === null) continue
    rows.push({ id: stat.id, label: stat.label, value: `${formatRatio(value / earthValue)} × Terra` })
  }
  return rows
}

const TYPE_LABELS: Record<BodyType, string> = {
  star: 'Estrela',
  planet: 'Planeta',
  'dwarf-planet': 'Planeta anão',
  moon: 'Satélite natural',
}

export function bodyTypeLabel(type: BodyType): string {
  return TYPE_LABELS[type]
}
