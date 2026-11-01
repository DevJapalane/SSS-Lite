import { bodies } from '../data/bodies'
import { computeSystemLayout } from '../utils/scale'

/**
 * Distances and radii are fixed for the whole session, so they are computed
 * once at import time instead of on every render.
 */
export const systemLayout = computeSystemLayout(bodies)

const entries = Object.values(systemLayout)

/** Radius of the disc swept by the outermost orbit, body included. */
export const systemRadius = Math.max(...entries.map((e) => e.x + e.radius))

/** Radius of the Sun: the tallest thing in the otherwise flat system. */
export const sunRadius = systemLayout.sun.radius
