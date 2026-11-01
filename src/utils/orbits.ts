import type { CelestialBody } from '../data/bodies'

const SECONDS_PER_DAY = 86400

/** Screen seconds one Earth year lasts in the system view. */
export const EARTH_YEAR_SCREEN_SECONDS = 20

/**
 * Simulated seconds per real second for orbits: ~1,58 million.
 *
 * With one year in 20 s, Mercury laps in ~4,8 s (fast but still easy to
 * follow), Earth's motion is obvious, and Jupiter (~4 min) or Pluto (~83 min)
 * visibly crawl, which is exactly the real contrast. Faster would turn
 * Mercury into a blur; slower would leave everything past Mars looking still.
 *
 * Kept separate from the spin rate (Earth turns in 24 s): at this factor
 * Earth would spin ~18 times per second, which reads as flicker, not rotation.
 */
export const ORBIT_TIME_SCALE = (365.25 * SECONDS_PER_DAY) / EARTH_YEAR_SCREEN_SECONDS

/** Angular speed around the Sun, in radians per screen second (0 for the Sun). */
export function orbitalAngularSpeed(body: Pick<CelestialBody, 'orbitalPeriodDays'>): number {
  if (body.orbitalPeriodDays === null) return 0
  const periodScreenSeconds = (body.orbitalPeriodDays * SECONDS_PER_DAY) / ORBIT_TIME_SCALE
  return (2 * Math.PI) / periodScreenSeconds
}

// 137,5°: consecutive multiples never line up, the trick sunflowers use to
// spread their seeds.
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

/**
 * Starting angle of the body at `index` in the data.
 *
 * Not the real positions (no ephemeris: the backlog asks for no precision).
 * Spreading them by the golden angle avoids a first frame with every planet
 * in a row, where their labels would pile up.
 */
export function initialOrbitAngle(index: number): number {
  return index * GOLDEN_ANGLE
}
