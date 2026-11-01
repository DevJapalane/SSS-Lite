import { bodies, getBodyById, type BodyId, type CelestialBody } from '../data/bodies'
import type { CompareSlot, ViewMode } from '../store/useAppStore'
import { computeCompareLayout } from '../utils/scale'
import { layoutFor } from './systemLayout'

export interface PlacedBody {
  /** React key: in a comparison the same body may appear on both sides. */
  key: string
  body: CelestialBody
  radius: number
  /**
   * Where the body is: on its orbit (position read from the orbit clock
   * every frame) or at a fixed X (the comparison lineup).
   */
  position: { kind: 'orbit'; radius: number } | { kind: 'fixed'; x: number }
}

/** Which bodies the scene shows in each view, and where. */
export function placeBodies(
  viewMode: ViewMode,
  selectedBodyId: BodyId,
  compare: Record<CompareSlot, BodyId>,
  realScale: boolean,
): PlacedBody[] {
  if (viewMode === 'compare') {
    const a = getBodyById(compare.a)
    const b = getBodyById(compare.b)
    const layout = computeCompareLayout(a, b)
    return [
      { key: `a-${a.id}`, body: a, radius: layout.a.radius, position: { kind: 'fixed', x: layout.a.x } },
      { key: `b-${b.id}`, body: b, radius: layout.b.radius, position: { kind: 'fixed', x: layout.b.x } },
    ]
  }
  // Body view mounts only the selected body: the others are not hidden but
  // absent, so their textures are never even requested (lazy loading for free).
  // It stays on its orbit, where it was in the system view: focusing then
  // just removes the others and flies the camera there, without a jump.
  const layout = layoutFor(realScale)
  const visible = viewMode === 'system' ? bodies : [getBodyById(selectedBodyId)]
  return visible.map((body) => {
    const { x, radius } = layout[body.id as BodyId]
    return { key: body.id, body, radius, position: { kind: 'orbit', radius: x } }
  })
}
