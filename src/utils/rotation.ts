import type { CelestialBody } from '../data/bodies'

/**
 * Simulated seconds per real second: 1 hour of the body's day = 1 second on
 * screen. Earth (23.9 h) turns once every ~24 s — slow enough to read the
 * continents, fast enough to notice it spinning. Jupiter takes ~10 s, the
 * Sun ~10 min and Venus ~97 min (it really is that slow).
 */
export const TIME_SCALE = 3600

/** Spin speed in radians per real second (always positive). */
export function spinSpeed(body: Pick<CelestialBody, 'rotationPeriodHours'>): number {
  const periodSeconds = (Math.abs(body.rotationPeriodHours) * 3600) / TIME_SCALE
  return (2 * Math.PI) / periodSeconds
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
