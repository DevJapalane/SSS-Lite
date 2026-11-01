import type { Vector3 } from 'three'
import { bodies, type BodyId } from '../data/bodies'
import { moon } from '../data/moon'
import { initialOrbitAngle, orbitalAngularSpeed } from '../utils/orbits'

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
  start: number
  speed: number
}

// Fixed for the session: computed once instead of inside the frame loop.
// The angle doesn't depend on the scale, so switching between compressed
// and real scale keeps every planet at the same point of its orbit.
const orbits = Object.fromEntries(
  bodies.map((body, index) => [
    body.id,
    { start: initialOrbitAngle(index), speed: orbitalAngularSpeed(body) },
  ]),
) as Record<BodyId, Orbit>

/** Current angle of the body around the Sun, counter-clockwise seen from above. */
export function orbitAngle(id: BodyId): number {
  const { start, speed } = orbits[id]
  return start + speed * orbitClock.time
}

const moonSpeed = orbitalAngularSpeed(moon)

/** Current angle of the Moon around Earth (same clock, its own period). */
export function moonAngle(): number {
  return moonSpeed * orbitClock.time
}

/**
 * Writes the point at `angle` on a circle of `radius` into `target` and
 * returns it. Takes the vector instead of returning a new one so the frame
 * loop never allocates (no garbage-collector pauses on phones).
 */
export function writeCirclePoint(angle: number, radius: number, target: Vector3): Vector3 {
  // -sin on Z: three.js' Z points toward the viewer, so this turns
  // counter-clockwise seen from +Y, the direction planets really go.
  return target.set(radius * Math.cos(angle), 0, -radius * Math.sin(angle))
}

/** Current position of a body on an orbit of `radius` (see writeCirclePoint). */
export function writeOrbitPosition(id: BodyId, radius: number, target: Vector3): Vector3 {
  return writeCirclePoint(orbitAngle(id), radius, target)
}
