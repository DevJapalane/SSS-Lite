import { describe, expect, it } from 'vitest'
import { bodies, getBodyById } from './bodies'

describe('bodies', () => {
  it('contains the Sun, 8 planets and Pluto', () => {
    expect(bodies).toHaveLength(10)
    expect(bodies.filter((b) => b.type === 'planet')).toHaveLength(8)
    expect(getBodyById('pluto').type).toBe('dwarf-planet')
  })

  it('has unique ids', () => {
    const ids = bodies.map((b) => b.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only the Sun lacks orbital data', () => {
    for (const body of bodies) {
      const isSun = body.id === 'sun'
      expect(body.orbitalVelocityKmS === null).toBe(isSun)
      expect(body.distanceFromSunMkm === null).toBe(isSun)
      expect(body.orbitalPeriodDays === null).toBe(isSun)
    }
  })

  it('marks Venus, Uranus and Pluto as retrograde rotators', () => {
    const retrograde = bodies.filter((b) => b.rotationPeriodHours < 0).map((b) => b.id)
    expect(retrograde).toEqual(['venus', 'uranus', 'pluto'])
  })
})
