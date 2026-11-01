import { describe, expect, it } from 'vitest'
import { layoutFor, moonLayoutFor } from './systemLayout'

describe('Moon layout', () => {
  it('sits ~30 Earth diameters from Earth at real scale', () => {
    const { orbitRadius } = moonLayoutFor(true)
    const earthDiameter = 2 * layoutFor(true).earth.radius
    expect(orbitRadius / earthDiameter).toBeCloseTo(30.1, 1)
  })

  it('keeps its real size next to Earth in both scales (0,27)', () => {
    for (const realScale of [false, true]) {
      const ratio = moonLayoutFor(realScale).radius / layoutFor(realScale).earth.radius
      expect(ratio).toBeCloseTo(0.2725, 3)
    }
  })

  it('never reaches the orbits of Venus or Mars in the compressed view', () => {
    const { venus, earth, mars } = layoutFor(false)
    const { orbitRadius, radius } = moonLayoutFor(false)
    const reach = orbitRadius + radius
    expect(earth.x - reach).toBeGreaterThan(venus.x + venus.radius)
    expect(earth.x + reach).toBeLessThan(mars.x - mars.radius)
  })
})
