import { BufferGeometry, Float32BufferAttribute } from 'three'
import { bodies } from '../data/bodies'
import { systemLayout } from './systemLayout'

const SEGMENTS = 128

/**
 * Every orbit circle in ONE geometry, drawn as line segments: nine orbits
 * cost a single draw call instead of nine. Built once at import, since
 * the radii never change.
 */
const orbitGeometry = (() => {
  const points: number[] = []
  for (const body of bodies) {
    const radius = systemLayout[body.id].x
    if (radius === 0) continue
    for (let i = 0; i < SEGMENTS; i++) {
      const a0 = (i / SEGMENTS) * Math.PI * 2
      const a1 = ((i + 1) / SEGMENTS) * Math.PI * 2
      points.push(radius * Math.cos(a0), 0, -radius * Math.sin(a0))
      points.push(radius * Math.cos(a1), 0, -radius * Math.sin(a1))
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  return geometry
})()

/** Faint circles showing the path of each body (system view). */
export function OrbitLines() {
  return (
    <lineSegments geometry={orbitGeometry}>
      {/* WebGL lines are always 1px wide: discreet by nature. Low opacity
          keeps them a guide, not a feature competing with the planets. */}
      <lineBasicMaterial color="#ffffff" transparent opacity={0.14} depthWrite={false} />
    </lineSegments>
  )
}
