import { BufferGeometry, Float32BufferAttribute } from 'three'
import { bodies, type BodyId } from '../data/bodies'
import { orbitLineMaterial } from './geometries'
import { layoutFor } from './systemLayout'

/**
 * Segments per circle. A polygon cuts inside the true circle between its
 * corners; at real scale Neptune's orbit is ~708.000 units wide, and with
 * 128 segments the line would pass ~200 units (50 Neptunes) away from the
 * planet. 2048 brings that under one unit, still a small buffer (~440 KB).
 */
const SEGMENTS = { compressed: 128, real: 2048 }

/**
 * Every orbit circle in ONE geometry, drawn as line segments: nine orbits
 * cost a single draw call instead of nine.
 */
function buildOrbitGeometry(realScale: boolean): BufferGeometry {
  const layout = layoutFor(realScale)
  const segments = realScale ? SEGMENTS.real : SEGMENTS.compressed
  const points: number[] = []
  for (const body of bodies) {
    const radius = layout[body.id as BodyId].x
    if (radius === 0) continue
    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2
      const a1 = ((i + 1) / segments) * Math.PI * 2
      points.push(radius * Math.cos(a0), 0, -radius * Math.sin(a0))
      points.push(radius * Math.cos(a1), 0, -radius * Math.sin(a1))
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  return geometry
}

// Both scales built once at import, since the radii never change.
const geometries = { compressed: buildOrbitGeometry(false), real: buildOrbitGeometry(true) }

/** Faint circles showing the path of each body (system view). */
export function OrbitLines({ realScale }: { realScale: boolean }) {
  return (
    <lineSegments
      geometry={realScale ? geometries.real : geometries.compressed}
      material={orbitLineMaterial}
    />
  )
}
