import { bodies, getBodyById, type BodyId } from '../data/bodies'
import { moon } from '../data/moon'
import { computeRealLayout, computeSystemLayout, EARTH_RADIUS_KM, type LayoutEntry } from '../utils/scale'

/**
 * Radius of the Moon's orbit in the compressed view, in Earth radii. Out of
 * scale like everything there (the real value, 60, would push Mars and the
 * outer planets far apart): just enough to read as "the Moon goes around
 * Earth", clear of Earth itself.
 */
const MOON_COMPRESSED_ORBIT = 2.4

/** Moon radius relative to Earth: real in both views (0,27). */
const moonRadius = moon.radiusKm / getBodyById('earth').radiusKm

export interface MoonLayout {
  /** Distance from Earth's centre, in scene units. */
  orbitRadius: number
  radius: number
}

/**
 * Distances and radii are fixed for the whole session, so both versions
 * are computed once at import time instead of on every render.
 * Compressed: readable, everything visible. Real: true proportions.
 */
const layouts = {
  compressed: computeSystemLayout(bodies, { earth: MOON_COMPRESSED_ORBIT + moonRadius }),
  real: computeRealLayout(bodies),
}

const moonLayouts: Record<'compressed' | 'real', MoonLayout> = {
  // Earth's display radius is 1 in the compressed view too, so the Moon's
  // size next to Earth stays true even there.
  compressed: { orbitRadius: MOON_COMPRESSED_ORBIT, radius: moonRadius },
  real: { orbitRadius: moon.distanceFromParentKm / EARTH_RADIUS_KM, radius: moonRadius },
}

const pick = <T>(realScale: boolean, values: Record<'compressed' | 'real', T>) =>
  realScale ? values.real : values.compressed

/** Orbit radius (`x`) and body radius of every body, in the chosen scale. */
export function layoutFor(realScale: boolean): Record<BodyId, LayoutEntry> {
  return pick(realScale, layouts) as Record<BodyId, LayoutEntry>
}

export function moonLayoutFor(realScale: boolean): MoonLayout {
  return pick(realScale, moonLayouts)
}

const radiusOfSystem = (layout: Record<string, LayoutEntry>) =>
  Math.max(...Object.values(layout).map((e) => e.x + e.radius))

const systemRadii = { compressed: radiusOfSystem(layouts.compressed), real: radiusOfSystem(layouts.real) }

/** Radius of the disc swept by the outermost orbit, body included. */
export function systemRadiusFor(realScale: boolean): number {
  return pick(realScale, systemRadii)
}
