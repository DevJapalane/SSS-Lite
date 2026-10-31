import type { CelestialBody } from '../data/bodies'
import { formatRatio } from './format'

type Named = Pick<CelestialBody, 'id' | 'name'>

// In pt-BR, "Sol" and "Terra" take an article ("o Sol", "a Terra"), while
// planet names are used bare ("Júpiter", "Plutão").
const ARTICLES: Partial<Record<string, 'o' | 'a'>> = { sun: 'o', earth: 'a' }

/** "o Sol", "a Terra", "Júpiter". */
function withArticle(body: Named): string {
  const article = ARTICLES[body.id]
  return article ? `${article} ${body.name}` : body.name
}

/** "do Sol", "da Terra", "de Júpiter" (de + o = do, de + a = da). */
function ofBody(body: Named): string {
  const article = ARTICLES[body.id]
  return article ? `d${article} ${body.name}` : `de ${body.name}`
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/**
 * "109 vezes", but "1,88 vez": in Portuguese the noun stays singular below 2.
 * Decided on the rounded value, so "1,996" (shown as "2") reads "2 vezes".
 */
function times(ratio: number): string {
  const shown = formatRatio(ratio)
  return `${shown} ${Number(ratio.toFixed(2)) >= 2 ? 'vezes' : 'vez'}`
}

/**
 * Larger and smaller of two bodies by some quantity, with the ratio.
 * Always "big ÷ small" so sentences say "X vezes maior" instead of the
 * ambiguous "X vezes menor".
 */
function rank<T extends Named>(a: T, b: T, read: (body: T) => number) {
  const [larger, smaller] = read(a) >= read(b) ? [a, b] : [b, a]
  return { larger, smaller, ratio: read(larger) / read(smaller) }
}

type SizeSource = Named & Pick<CelestialBody, 'radiusKm'>
type MassSource = Named & Pick<CelestialBody, 'massKg'>

/** "O Sol é 586 vezes maior que Plutão em diâmetro." */
export function sizeComparisonText(a: SizeSource, b: SizeSource): string {
  if (a.id === b.id) return `É ${withArticle(a)} dos dois lados: mesmo diâmetro.`
  // Ratio of the km values from the data, in 64-bit floats: never derived
  // from scene coordinates, which are rounded to 32 bits on the GPU.
  const { larger, smaller, ratio } = rank(a, b, (body) => body.radiusKm)
  return `${capitalize(withArticle(larger))} é ${times(ratio)} maior que ${withArticle(smaller)} em diâmetro.`
}

/** "Júpiter tem 318 vezes a massa da Terra." */
export function massComparisonText(a: MassSource, b: MassSource): string {
  if (a.id === b.id) return `É ${withArticle(a)} dos dois lados: mesma massa.`
  const { larger, smaller, ratio } = rank(a, b, (body) => body.massKg)
  return `${capitalize(withArticle(larger))} tem ${times(ratio)} a massa ${ofBody(smaller)}.`
}

/**
 * Fixed axis of the mass bars, in powers of ten (kg). Pluto (1,3 × 10²²)
 * and the Sun (2 × 10³⁰) both fit with a margin, and being fixed means a
 * bar has the same length in every pair, so bars can be compared across pairs.
 */
export const MASS_AXIS = { minExponent: 21, maxExponent: 31 } as const

/**
 * Share (0–1) of the bar filled by a mass on the logarithmic axis.
 *
 * Linear bars can't show Sun × Earth (~333.000×): with the Sun at full
 * width, Earth would be 0,0003% of it, invisible. On a log axis each ×10
 * adds the same length, so both bars are readable and their gap shows the
 * number of "zeros" between them.
 */
export function massBarFraction(massKg: number): number {
  const { minExponent, maxExponent } = MASS_AXIS
  const fraction = (Math.log10(massKg) - minExponent) / (maxExponent - minExponent)
  return Math.min(1, Math.max(0, fraction))
}
