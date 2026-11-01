import {
  BufferGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  RingGeometry,
  SphereGeometry,
  Vector3,
} from 'three'

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

/**
 * Unit circle in the XZ plane (the orbit plane), drawn as a closed line and
 * scaled to each orbit's radius. 128 points look round even when the
 * circle fills the screen.
 */
export const unitCircle = (() => {
  const segments = 128
  const points = new Float32Array(segments * 3)
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2
    points[i * 3] = Math.cos(angle)
    points[i * 3 + 2] = -Math.sin(angle)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(points, 3))
  return geometry
})()

/**
 * WebGL lines are always 1px wide: discreet by nature. Low opacity keeps
 * them a guide, not a feature competing with the planets. One shared
 * instance for every orbit line, the Moon's included.
 */
export const orbitLineMaterial = new LineBasicMaterial({
  color: '#ffffff',
  transparent: true,
  opacity: 0.14,
  depthWrite: false,
})
