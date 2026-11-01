/**
 * Fixed physical data for every body shown in the app.
 *
 * Source: NASA Planetary Fact Sheet (planets, Pluto) and NASA Sun Fact Sheet.
 * Data is hardcoded on purpose: the values change rarely and shipping them in
 * the bundle avoids a network request and keeps the app light.
 */

export type BodyType = 'star' | 'planet' | 'dwarf-planet' | 'moon'

export interface CelestialBody {
  id: string
  /** Display name in pt-BR. */
  name: string
  type: BodyType
  /**
   * Radius in km. Planets use the equatorial radius (half the fact sheet
   * diameter); the Sun uses its volumetric mean radius, the only one NASA lists.
   */
  radiusKm: number
  massKg: number
  /** Surface gravity in m/s². */
  gravity: number
  /** Mean orbital velocity in km/s. `null` for the Sun: it is the reference frame. */
  orbitalVelocityKmS: number | null
  /**
   * Sidereal rotation period in hours. Negative means retrograde rotation
   * (shown in the UI); the 3D spin derives direction from `axialTiltDeg`.
   */
  rotationPeriodHours: number
  /**
   * Axial tilt (obliquity) in degrees. Above 90° the spin axis is flipped,
   * which is what makes a body rotate retrograde.
   */
  axialTiltDeg: number
  /** Mean distance from the Sun in millions of km. `null` for the Sun itself. */
  distanceFromSunMkm: number | null
  /** Orbital period in Earth days. `null` for the Sun. */
  orbitalPeriodDays: number | null
  /** Solid color used while the texture loads or when it is missing. */
  fallbackColor: string
  /** WebP file name inside /public/textures (see its README). */
  texture?: string
  rings?: Rings
}

export interface Rings {
  /** Inner and outer edge as multiples of the body radius. */
  innerRadiusRatio: number
  outerRadiusRatio: number
  /** Strip texture with alpha: left edge = inner ring, right edge = outer ring. */
  texture: string
}

// `as const satisfies` keeps each `id` as a literal type (so BodyId below is
// 'sun' | 'mercury' | ...) while still checking every entry against the interface.
export const bodies = [
  {
    id: 'sun',
    name: 'Sol',
    type: 'star',
    radiusKm: 695700,
    massKg: 1.9884e30,
    gravity: 274,
    orbitalVelocityKmS: null,
    rotationPeriodHours: 609.12,
    axialTiltDeg: 7.25,
    distanceFromSunMkm: null,
    orbitalPeriodDays: null,
    fallbackColor: '#f5b942',
    texture: 'sun.webp',
  },
  {
    id: 'mercury',
    name: 'Mercúrio',
    type: 'planet',
    radiusKm: 2439.5,
    massKg: 3.3e23,
    gravity: 3.7,
    orbitalVelocityKmS: 47.4,
    rotationPeriodHours: 1407.6,
    axialTiltDeg: 0.034,
    distanceFromSunMkm: 57.9,
    orbitalPeriodDays: 88.0,
    fallbackColor: '#9a9590',
    texture: 'mercury.webp',
  },
  {
    id: 'venus',
    name: 'Vênus',
    type: 'planet',
    radiusKm: 6052,
    massKg: 4.87e24,
    gravity: 8.9,
    orbitalVelocityKmS: 35.0,
    rotationPeriodHours: -5832.5,
    axialTiltDeg: 177.4,
    distanceFromSunMkm: 108.2,
    orbitalPeriodDays: 224.7,
    fallbackColor: '#e3c38a',
    texture: 'venus_atmosphere.webp',
  },
  {
    id: 'earth',
    name: 'Terra',
    type: 'planet',
    radiusKm: 6378,
    massKg: 5.97e24,
    gravity: 9.8,
    orbitalVelocityKmS: 29.8,
    rotationPeriodHours: 23.9,
    axialTiltDeg: 23.4,
    distanceFromSunMkm: 149.6,
    orbitalPeriodDays: 365.2,
    fallbackColor: '#3a78c2',
    texture: 'earth_daymap.webp',
  },
  {
    id: 'mars',
    name: 'Marte',
    type: 'planet',
    radiusKm: 3396,
    massKg: 6.42e23,
    gravity: 3.7,
    orbitalVelocityKmS: 24.1,
    rotationPeriodHours: 24.6,
    axialTiltDeg: 25.2,
    distanceFromSunMkm: 228.0,
    orbitalPeriodDays: 687.0,
    fallbackColor: '#c1532f',
    texture: 'mars.webp',
  },
  {
    id: 'jupiter',
    name: 'Júpiter',
    type: 'planet',
    radiusKm: 71492,
    massKg: 1.898e27,
    gravity: 23.1,
    orbitalVelocityKmS: 13.1,
    rotationPeriodHours: 9.9,
    axialTiltDeg: 3.1,
    distanceFromSunMkm: 778.5,
    orbitalPeriodDays: 4331,
    fallbackColor: '#c9a27c',
    texture: 'jupiter.webp',
  },
  {
    id: 'saturn',
    name: 'Saturno',
    type: 'planet',
    radiusKm: 60268,
    massKg: 5.68e26,
    gravity: 9.0,
    orbitalVelocityKmS: 9.7,
    rotationPeriodHours: 10.7,
    axialTiltDeg: 26.7,
    distanceFromSunMkm: 1432.0,
    orbitalPeriodDays: 10747,
    fallbackColor: '#e0c98f',
    texture: 'saturn.webp',
    // C ring inner edge (~74 500 km) to A ring outer edge (~136 800 km).
    rings: { innerRadiusRatio: 1.24, outerRadiusRatio: 2.27, texture: 'saturn_ring_alpha.webp' },
  },
  {
    id: 'uranus',
    name: 'Urano',
    type: 'planet',
    radiusKm: 25559,
    massKg: 8.68e25,
    gravity: 8.7,
    orbitalVelocityKmS: 6.8,
    rotationPeriodHours: -17.2,
    axialTiltDeg: 97.8,
    distanceFromSunMkm: 2867.0,
    orbitalPeriodDays: 30589,
    fallbackColor: '#9fd8e0',
    texture: 'uranus.webp',
  },
  {
    id: 'neptune',
    name: 'Netuno',
    type: 'planet',
    radiusKm: 24764,
    massKg: 1.02e26,
    gravity: 11.0,
    orbitalVelocityKmS: 5.4,
    rotationPeriodHours: 16.1,
    axialTiltDeg: 28.3,
    distanceFromSunMkm: 4515.0,
    orbitalPeriodDays: 59800,
    fallbackColor: '#3f5fd1',
    texture: 'neptune.webp',
  },
  {
    id: 'pluto',
    name: 'Plutão',
    type: 'dwarf-planet',
    radiusKm: 1188,
    massKg: 1.3e22,
    gravity: 0.7,
    orbitalVelocityKmS: 4.7,
    rotationPeriodHours: -153.3,
    axialTiltDeg: 119.5,
    distanceFromSunMkm: 5906.4,
    orbitalPeriodDays: 90560,
    fallbackColor: '#c8b39a',
    // No texture: Solar System Scope does not provide one for Pluto.
  },
] as const satisfies readonly CelestialBody[]

export type BodyId = (typeof bodies)[number]['id']

export function getBodyById(id: BodyId): CelestialBody {
  // Safe non-null assertion: BodyId only admits ids that exist in `bodies`.
  return bodies.find((body) => body.id === id)!
}
