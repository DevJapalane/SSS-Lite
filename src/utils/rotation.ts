import type { CelestialBody } from '../data/bodies'

/** Screen seconds for one turn of Earth: slow enough to read the continents. */
export const EARTH_SPIN_SCREEN_SECONDS = 24

const EARTH_DAY_HOURS = 23.9

/**
 * Screen seconds for one turn of the body on its own axis.
 *
 * Real days span ~590× (Jupiter 9,9 h to Venus 5.832 h). At a single
 * proportional rate, the one that keeps Earth readable, Venus would take
 * 97 min per turn and the Sun 10 min: they would look frozen. A cube root
 * of the ratio to Earth (as in the sizes) shrinks that span to ~8× while
 * keeping the order: Jupiter ~18 s, Earth 24 s, Venus ~2,5 min.
 */
export function spinPeriodScreenSeconds(body: Pick<CelestialBody, 'rotationPeriodHours'>): number {
  return EARTH_SPIN_SCREEN_SECONDS * Math.cbrt(Math.abs(body.rotationPeriodHours) / EARTH_DAY_HOURS)
}

/** Spin speed in radians per real second (always positive). */
export function spinSpeed(body: Pick<CelestialBody, 'rotationPeriodHours'>): number {
  return (2 * Math.PI) / spinPeriodScreenSeconds(body)
}

/**
 * Tilt in radians, applied around the Z axis.
 *
 * Direction comes from the tilt alone: spinning counter-clockwise around an
 * axis tipped past 90° looks clockwise from "above" the orbit, i.e.
 * retrograde. Also applying the negative period from the fact sheet would
 * flip it twice and make Venus look prograde again.
 */
export function axialTiltRad(body: Pick<CelestialBody, 'axialTiltDeg'>): number {
  return (body.axialTiltDeg * Math.PI) / 180
}

/**
 * True when the body's spin looks clockwise seen from the orbit's north.
 * Not used by the UI: the tests use it to check that the tilts in the data
 * agree with the retrograde (negative) periods of the fact sheet.
 */
export function isRetrogradeSpin(body: Pick<CelestialBody, 'axialTiltDeg'>): boolean {
  // The spin axis' vertical component is cos(tilt); below zero it points "down".
  return Math.cos(axialTiltRad(body)) < 0
}
