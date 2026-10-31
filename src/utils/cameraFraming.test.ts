import { describe, expect, it } from 'vitest'
import { lineupFitDistance, sphereFitDistance } from './cameraFraming'

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
