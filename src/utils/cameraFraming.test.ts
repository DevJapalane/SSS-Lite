import { describe, expect, it } from 'vitest'
import { lineupFitDistance, projectedRadiusPx, sphereFitDistance } from './cameraFraming'

describe('sphereFitDistance', () => {
  it('moves further away on a portrait screen', () => {
    const landscape = sphereFitDistance(1, 45, 16 / 9)
    const portrait = sphereFitDistance(1, 45, 9 / 19.5)
    expect(portrait).toBeGreaterThan(landscape)
  })

  it('scales linearly with the radius', () => {
    expect(sphereFitDistance(3, 45, 1)).toBeCloseTo(3 * sphereFitDistance(1, 45, 1))
  })
})

describe('lineupFitDistance', () => {
  it('is limited by the width on a narrow screen', () => {
    const narrow = lineupFitDistance(60, 10, 45, 0.5)
    const wide = lineupFitDistance(60, 10, 45, 2)
    expect(narrow).toBeGreaterThan(wide)
  })
})

describe('projectedRadiusPx', () => {
  it('halves when the distance doubles (far away)', () => {
    const near = projectedRadiusPx(1, 100, 45, 800)
    const far = projectedRadiusPx(1, 200, 45, 800)
    expect(near / far).toBeCloseTo(2, 2)
  })

  it('fills half the screen height when the sphere spans the half-FOV', () => {
    // A sphere whose silhouette reaches exactly the top edge: tan(angle) = tan(fov/2).
    const halfFov = (45 / 2) * (Math.PI / 180)
    const distance = 1 / Math.sin(halfFov)
    expect(projectedRadiusPx(1, distance, 45, 800)).toBeCloseTo(400)
  })

  it('is infinite with the camera inside the sphere', () => {
    expect(projectedRadiusPx(2, 1, 45, 800)).toBe(Infinity)
  })
})
