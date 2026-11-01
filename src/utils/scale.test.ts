import { describe, expect, it } from 'vitest'
import { bodies, getBodyById } from '../data/bodies'
import { computeCompareLayout, computeSystemLayout, displayRadius } from './scale'

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

describe('computeCompareLayout', () => {
  const sun = getBodyById('sun')
  const pluto = getBodyById('pluto')
  const saturn = getBodyById('saturn')

  it('gives the larger body radius 5 and keeps the real ratio (Sun × Pluto)', () => {
    const layout = computeCompareLayout(sun, pluto)
    expect(layout.a.radius).toBe(5)
    expect(layout.a.radius / layout.b.radius).toBeCloseTo(695700 / 1188, 6)
  })

  it('does not depend on which side the larger body is on', () => {
    const ab = computeCompareLayout(sun, pluto)
    const ba = computeCompareLayout(pluto, sun)
    expect(ba.b.radius).toBe(ab.a.radius)
    expect(ba.a.radius).toBeCloseTo(ab.b.radius)
  })

  it('never overlaps the pair, rings included, and centres it on the origin', () => {
    const layout = computeCompareLayout(saturn, getBodyById('earth'))
    const saturnRight = layout.a.x + layout.a.radius * saturn.rings!.outerRadiusRatio
    expect(layout.b.x - layout.b.radius).toBeGreaterThan(saturnRight)
    const left = layout.a.x - layout.a.radius * saturn.rings!.outerRadiusRatio
    const right = layout.b.x + layout.b.radius
    expect(left + right).toBeCloseTo(0)
  })
})
