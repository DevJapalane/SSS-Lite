import { RingGeometry, SphereGeometry, Vector3 } from 'three'

/**
 * One unit sphere shared by every body; each mesh scales it to its radius.
 * Ten bodies, one GPU buffer. 48×32 segments look round at full screen
 * without paying for detail nobody sees.
 */
export const unitSphere = new SphereGeometry(1, 48, 32)

const ringCache = new Map<string, RingGeometry>()

/**
 * Flat ring for a unit-radius planet. Three's default ring UVs map the
 * texture as a square across the disc; ring textures are a radial strip, so
 * U is remapped to "distance from the inner edge" (0 inner → 1 outer).
 */
export function getRingGeometry(inner: number, outer: number): RingGeometry {
  const key = `${inner}:${outer}`
  let geometry = ringCache.get(key)
  if (!geometry) {
    geometry = new RingGeometry(inner, outer, 128, 1)
    const position = geometry.attributes.position
    const uv = geometry.attributes.uv
    const vertex = new Vector3()
    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i)
      uv.setXY(i, (vertex.length() - inner) / (outer - inner), 0.5)
    }
    ringCache.set(key, geometry)
  }
  return geometry
}
