import type { Vector3 } from 'three'
import { bodies, type BodyId } from '../data/bodies'
import { initialOrbitAngle, orbitalAngularSpeed } from '../utils/orbits'
import { systemLayout } from './systemLayout'

/**
 * Shared simulated time of the orbits, in screen seconds.
 *
 * A plain mutable object, not React or Zustand state: it changes every
 * frame and nothing needs to re-render because of it. Every position is
 * derived from this single number, so the bodies, their labels and the
 * camera always agree on where a planet is.
 */
export const orbitClock = { time: 0 }

interface Orbit {
  radius: number
  start: number
  speed: number
}

// Fixed for the session: computed once instead of inside the frame loop.
const orbits = Object.fromEntries(
  bodies.map((body, index) => [
    body.id,
    {
      // The compressed (log) distance of the old lineup becomes the orbit
      // radius. Circles are concentric, so the gaps that kept neighbours
      // apart on the line still keep them apart at any angle.
      radius: systemLayout[body.id].x,
      start: initialOrbitAngle(index),
      speed: orbitalAngularSpeed(body),
    },
  ]),
) as Record<BodyId, Orbit>

/** Current angle of the body around the Sun, counter-clockwise seen from above. */
export function orbitAngle(id: BodyId): number {
  const { start, speed } = orbits[id]
  return start + speed * orbitClock.time
}

/**
 * Writes the body's current position into `target` and returns it.
 * Takes the vector instead of returning a new one so the frame loop never
 * allocates (no garbage-collector pauses on phones).
 */
export function writeOrbitPosition(id: BodyId, target: Vector3): Vector3 {
  const angle = orbitAngle(id)
  const { radius } = orbits[id]
  // -sin on Z: three.js' Z points toward the viewer, so this turns
  // counter-clockwise seen from +Y, the direction planets really go.
  return target.set(radius * Math.cos(angle), 0, -radius * Math.sin(angle))
}
