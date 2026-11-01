import type { CelestialBody } from '../data/bodies'

export const EARTH_RADIUS_KM = 6378

/**
 * Radius in scene units (Earth = 1), compressed with a cube root.
 *
 * Real radii span ~585× (Pluto to Sun). A cube root shrinks that to ~8×
 * while keeping the order, so the Sun stays clearly the largest and Pluto is
 * still visible on a phone when the whole lineup is on screen. A square
 * root would leave the Sun 10× Earth and Pluto a dot; a log goes negative
 * for bodies smaller than Earth.
 */
export function displayRadius(body: Pick<CelestialBody, 'radiusKm'>): number {
  return Math.cbrt(body.radiusKm / EARTH_RADIUS_KM)
}

/** Scene units per decade (×10) of real distance from the Sun. */
const UNITS_PER_DISTANCE_DECADE = 20
/** Minimum empty space between neighbouring bodies, in scene units. */
const MIN_GAP = 0.8

export interface LayoutEntry {
  x: number
  radius: number
}

/** Radius, in scene units, of the larger body of a comparison. */
const COMPARE_LARGER_RADIUS = 5

type CompareSource = Pick<CelestialBody, 'radiusKm' | 'rings'>

export interface CompareLayout {
  a: LayoutEntry
  b: LayoutEntry
  /** Total extent along X and Y, for the camera to frame both. */
  width: number
  height: number
}

/**
 * Two bodies side by side at REAL scale relative to each other.
 *
 * The larger one always gets the same radius (5 units) and the smaller one
 * is scaled by the real ratio computed here in 64-bit JavaScript numbers.
 * The scene therefore only ever holds values between ~0,008 (Pluto next to
 * the Sun) and 5, whatever the pair: the camera distance, near/far planes
 * and depth-buffer precision stay the same as in the other views. Feeding
 * kilometres to the GPU (32-bit floats, Sun = 695.700) would instead need a
 * huge far plane and make surfaces flicker.
 */
export function computeCompareLayout(a: CompareSource, b: CompareSource): CompareLayout {
  const scale = COMPARE_LARGER_RADIUS / Math.max(a.radiusKm, b.radiusKm)
  const radiusA = a.radiusKm * scale
  const radiusB = b.radiusKm * scale
  // Space taken on the line: Saturn's rings reach well past the planet.
  const extentA = radiusA * (a.rings?.outerRadiusRatio ?? 1)
  const extentB = radiusB * (b.rings?.outerRadiusRatio ?? 1)
  // A gap proportional to the larger body keeps the pair readable as two
  // separate objects; its length means nothing (not a real distance).
  const gap = 0.5 * Math.max(extentA, extentB)
  const width = 2 * extentA + gap + 2 * extentB
  return {
    // Centred on the origin, A on the left and B on the right, matching the
    // order of the selectors.
    a: { x: -width / 2 + extentA, radius: radiusA },
    b: { x: width / 2 - extentB, radius: radiusB },
    width,
    height: 2 * Math.max(extentA, extentB),
  }
}

/**
 * Distance of each body from the Sun in scene units (`x`, the radius of its
 * orbit in the system view), Sun at the origin.
 *
 * Distances follow the logarithm of the real distance, so each ×10 in
 * distance adds the same space: the inner planets don't collapse into the
 * Sun and Pluto doesn't end up kilometres away. When two neighbours would
 * overlap (log spacing is tight next to big bodies), the second is pushed
 * out to keep MIN_GAP.
 *
 * `extraExtent` reserves more room than the body itself takes (Earth needs
 * space for the Moon's orbit around it, or the Moon would cross the orbits
 * of Venus and Mars).
 */
export function computeSystemLayout(
  bodies: readonly CelestialBody[],
  extraExtent: Partial<Record<string, number>> = {},
): Record<string, LayoutEntry> {
  const layout: Record<string, LayoutEntry> = {}
  const firstDistance = Math.min(
    ...bodies.map((b) => b.distanceFromSunMkm ?? Infinity),
  )

  // x and the room the previous body takes on each side of it.
  let previous: { x: number; extent: number } | null = null
  // Where the closest planet sits; every other distance is measured from it.
  let start: number | null = null
  for (const body of bodies) {
    const radius = displayRadius(body)
    const extent = Math.max(radius, extraExtent[body.id] ?? 0)
    let x = 0
    if (previous) {
      const minX = previous.x + previous.extent + MIN_GAP + extent
      start ??= minX
      const logX =
        body.distanceFromSunMkm === null
          ? minX
          : start + UNITS_PER_DISTANCE_DECADE * Math.log10(body.distanceFromSunMkm / firstDistance)
      x = Math.max(minX, logX)
    }
    layout[body.id] = { x, radius }
    previous = { x, extent }
  }
  return layout
}

/**
 * Real scale: every size and distance divided by the same number, Earth's
 * radius. 1 unit = 6.378 km, so Earth has radius 1, the Sun 109, and
 * Neptune orbits ~708.000 units away. Computed in 64-bit JS numbers; the
 * GPU only ever sees positions relative to the camera (three.js builds the
 * model-view matrix on the CPU), so the large values don't cause jitter.
 */
export function computeRealLayout(bodies: readonly CelestialBody[]): Record<string, LayoutEntry> {
  return Object.fromEntries(
    bodies.map((body) => [
      body.id,
      {
        x: ((body.distanceFromSunMkm ?? 0) * 1e6) / EARTH_RADIUS_KM,
        radius: body.radiusKm / EARTH_RADIUS_KM,
      },
    ]),
  )
}
