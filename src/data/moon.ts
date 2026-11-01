import type { CelestialBody } from './bodies'

export interface Satellite extends CelestialBody {
  /** Mean distance from the body it orbits, in km. */
  distanceFromParentKm: number
}

/**
 * Earth's Moon. Kept out of `bodies` on purpose: it is drawn orbiting Earth,
 * but it isn't in the list or the info panel (the app's scope stays "Sun,
 * 8 planets and Pluto").
 *
 * Source: NASA Moon Fact Sheet. Same conventions as `bodies`: equatorial
 * radius; `orbitalPeriodDays` and `orbitalVelocityKmS` are around Earth.
 */
export const moon: Satellite = {
  id: 'moon',
  name: 'Lua',
  type: 'moon',
  radiusKm: 1738.1,
  massKg: 7.346e22,
  gravity: 1.62,
  orbitalVelocityKmS: 1.022,
  // Tidally locked: one turn per orbit, which is why we always see the same face.
  rotationPeriodHours: 655.7,
  axialTiltDeg: 6.7,
  distanceFromSunMkm: null,
  orbitalPeriodDays: 27.3,
  // 384.400 km ≈ 30 Earth diameters.
  distanceFromParentKm: 384400,
  fallbackColor: '#a7a39c',
  // 1K instead of 2K: the Moon is always small on screen (0,27 of Earth).
  texture: 'moon.webp',
}
