import { describe, expect, it } from 'vitest'
import { bodies, getBodyById } from '../data/bodies'
import { isRetrogradeSpin, spinPeriodScreenSeconds, spinSpeed } from './rotation'

describe('spinSpeed', () => {
  it('makes Earth turn once in ~24 seconds', () => {
    const secondsPerTurn = (2 * Math.PI) / spinSpeed(getBodyById('earth'))
    expect(secondsPerTurn).toBeGreaterThan(20)
    expect(secondsPerTurn).toBeLessThan(30)
  })

  it('is always positive, even for negative periods', () => {
    for (const body of bodies) expect(spinSpeed(body)).toBeGreaterThan(0)
  })

  it('makes every body visibly turn, the slowest (Venus) in under 3 minutes', () => {
    for (const body of bodies) expect(spinPeriodScreenSeconds(body)).toBeLessThan(180)
    expect(spinPeriodScreenSeconds(getBodyById('venus'))).toBeGreaterThan(120)
  })

  it('keeps the real order of the days', () => {
    const byRealDay = [...bodies].sort(
      (a, b) => Math.abs(a.rotationPeriodHours) - Math.abs(b.rotationPeriodHours),
    )
    const periods = byRealDay.map(spinPeriodScreenSeconds)
    expect(periods).toEqual([...periods].sort((a, b) => a - b))
  })
})

describe('isRetrogradeSpin', () => {
  it('matches the retrograde bodies from the fact sheet (negative period)', () => {
    for (const body of bodies) {
      expect(isRetrogradeSpin(body)).toBe(body.rotationPeriodHours < 0)
    }
  })
})
