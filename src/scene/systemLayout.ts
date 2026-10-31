import { bodies } from '../data/bodies'
import { computeSystemLayout } from '../utils/scale'

/**
 * Positions are fixed for the whole session, so they are computed once at
 * import time instead of on every render.
 */
export const systemLayout = computeSystemLayout(bodies)

const entries = Object.values(systemLayout)
const left = Math.min(...entries.map((e) => e.x - e.radius))
const right = Math.max(...entries.map((e) => e.x + e.radius))

/** Bounding box of the whole lineup (along X, centred on Y = 0). */
export const lineupBounds = {
  centerX: (left + right) / 2,
  width: right - left,
  height: 2 * Math.max(...entries.map((e) => e.radius)),
}
