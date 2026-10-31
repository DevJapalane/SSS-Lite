import { bodies, getBodyById, type BodyId, type CelestialBody } from '../data/bodies'
import type { CompareSlot, ViewMode } from '../store/useAppStore'
import { computeCompareLayout } from '../utils/scale'
import { systemLayout } from './systemLayout'

export interface PlacedBody {
  /** React key: in a comparison the same body may appear on both sides. */
  key: string
  body: CelestialBody
  x: number
  radius: number
}

/** Which bodies the scene shows in each view, and where. */
export function placeBodies(
  viewMode: ViewMode,
  selectedBodyId: BodyId,
  compare: Record<CompareSlot, BodyId>,
): PlacedBody[] {
  if (viewMode === 'compare') {
    const a = getBodyById(compare.a)
    const b = getBodyById(compare.b)
    const layout = computeCompareLayout(a, b)
    return [
      { key: `a-${a.id}`, body: a, ...layout.a },
      { key: `b-${b.id}`, body: b, ...layout.b },
    ]
  }
  // Body view mounts only the selected body: the others are not hidden but
  // absent, so their textures are never even requested (lazy loading for free).
  const visible = viewMode === 'system' ? bodies : [getBodyById(selectedBodyId)]
  return visible.map((body) => ({ key: body.id, body, ...systemLayout[body.id] }))
}
