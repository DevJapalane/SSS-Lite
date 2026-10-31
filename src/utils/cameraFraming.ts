/**
 * Camera distances that make an object fill a given share of the screen.
 * Pure math (no three.js) so it can be unit tested.
 */

const toRad = (deg: number) => (deg * Math.PI) / 180

/** Half of the narrowest field of view (vertical or horizontal), in radians. */
function narrowestHalfFov(verticalFovDeg: number, aspect: number): number {
  const vHalf = toRad(verticalFovDeg) / 2
  const hHalf = Math.atan(Math.tan(vHalf) * aspect)
  return Math.min(vHalf, hHalf)
}

/**
 * Distance at which a sphere of `radius` spans `fill` (0–1) of the narrowest
 * screen side. Using the narrowest side keeps it fully visible on a
 * portrait phone as well as on a wide monitor.
 */
export function sphereFitDistance(
  radius: number,
  verticalFovDeg: number,
  aspect: number,
  fill = 0.6,
): number {
  return radius / Math.sin(narrowestHalfFov(verticalFovDeg, aspect) * fill)
}

/** Distance at which a horizontal segment `width` wide and `height` tall fits the screen. */
export function lineupFitDistance(
  width: number,
  height: number,
  verticalFovDeg: number,
  aspect: number,
  padding = 1.1,
): number {
  const vHalf = toRad(verticalFovDeg) / 2
  const hHalf = Math.atan(Math.tan(vHalf) * aspect)
  const byWidth = width / 2 / Math.tan(hHalf)
  const byHeight = height / 2 / Math.tan(vHalf)
  return Math.max(byWidth, byHeight) * padding
}

/**
 * Radius, in CSS pixels, of a sphere as drawn on screen.
 *
 * The sphere's silhouette spans an angle asin(r / d); its tangent divided by
 * tan(fov / 2) is the share of half the screen height it covers.
 */
export function projectedRadiusPx(
  radius: number,
  distance: number,
  verticalFovDeg: number,
  viewportHeightPx: number,
): number {
  // Camera inside or touching the sphere: it covers the whole screen.
  if (distance <= radius) return Infinity
  const tanAngle = radius / Math.sqrt(distance * distance - radius * radius)
  return (tanAngle / Math.tan(toRad(verticalFovDeg) / 2)) * (viewportHeightPx / 2)
}
