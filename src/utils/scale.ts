import type { CelestialBody } from '../data/bodies'

const EARTH_RADIUS_KM = 6378

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

/**
 * Places bodies on a line along +X, Sun at the origin.
 *
 * Positions follow the logarithm of the real distance, so each ×10 in
 * distance adds the same space: the inner planets don't collapse into the
 * Sun and Pluto doesn't end up kilometres away. When two neighbours would
 * overlap (log spacing is tight next to big bodies), the second is pushed
 * out to keep MIN_GAP.
 */
export function computeSystemLayout(
  bodies: readonly CelestialBody[],
): Record<string, LayoutEntry> {
  const layout: Record<string, LayoutEntry> = {}
  const firstDistance = Math.min(
    ...bodies.map((b) => b.distanceFromSunMkm ?? Infinity),
  )

  let previous: LayoutEntry | null = null
  // Where the closest planet sits; every other distance is measured from it.
  let start: number | null = null
  for (const body of bodies) {
    const radius = displayRadius(body)
    let x = 0
    if (previous) {
      const minX = previous.x + previous.radius + MIN_GAP + radius
      start ??= minX
      const logX =
        body.distanceFromSunMkm === null
          ? minX
          : start + UNITS_PER_DISTANCE_DECADE * Math.log10(body.distanceFromSunMkm / firstDistance)
      x = Math.max(minX, logX)
    }
    const entry = { x, radius }
    layout[body.id] = entry
    previous = entry
  }
  return layout
}
