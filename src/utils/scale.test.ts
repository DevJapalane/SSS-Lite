import { describe, expect, it } from 'vitest'
import { bodies } from '../data/bodies'
import { computeSystemLayout, displayRadius } from './scale'

describe('displayRadius', () => {
  it('keeps Earth at 1 and preserves the size order', () => {
    expect(displayRadius({ radiusKm: 6378 })).toBeCloseTo(1)
    const sorted = [...bodies].sort((a, b) => a.radiusKm - b.radiusKm)
    const radii = sorted.map(displayRadius)
    expect(radii).toEqual([...radii].sort((a, b) => a - b))
  })

  it('compresses the Sun-to-Pluto ratio below 10x', () => {
    const sun = displayRadius(bodies[0])
    const pluto = displayRadius(bodies[bodies.length - 1])
    expect(sun / pluto).toBeLessThan(10)
  })
})

describe('computeSystemLayout', () => {
  const layout = computeSystemLayout(bodies)
  const entries = bodies.map((b) => layout[b.id])

  it('puts the Sun at the origin and keeps the distance order', () => {
    expect(layout.sun.x).toBe(0)
    for (let i = 1; i < entries.length; i++) {
      expect(entries[i].x).toBeGreaterThan(entries[i - 1].x)
    }
  })

  it('never overlaps neighbouring bodies', () => {
    for (let i = 1; i < entries.length; i++) {
      const gap = entries[i].x - entries[i].radius - (entries[i - 1].x + entries[i - 1].radius)
      expect(gap).toBeGreaterThan(0.5)
    }
  })

  it('shows the Mars–Jupiter gap wider than Earth–Mars', () => {
    const earthMars = layout.mars.x - layout.earth.x
    const marsJupiter = layout.jupiter.x - layout.mars.x
    expect(marsJupiter).toBeGreaterThan(earthMars)
  })
})
