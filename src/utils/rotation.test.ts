import { describe, expect, it } from 'vitest'
import { bodies, getBodyById } from '../data/bodies'
import { isRetrogradeSpin, spinSpeed } from './rotation'

describe('spinSpeed', () => {
  it('makes Earth turn once in ~24 seconds', () => {
    const secondsPerTurn = (2 * Math.PI) / spinSpeed(getBodyById('earth'))
    expect(secondsPerTurn).toBeGreaterThan(20)
    expect(secondsPerTurn).toBeLessThan(30)
  })

  it('is always positive, even for negative periods', () => {
    for (const body of bodies) expect(spinSpeed(body)).toBeGreaterThan(0)
  })
})

describe('isRetrogradeSpin', () => {
  it('matches the retrograde bodies from the fact sheet (negative period)', () => {
    for (const body of bodies) {
      expect(isRetrogradeSpin(body)).toBe(body.rotationPeriodHours < 0)
    }
  })
})
