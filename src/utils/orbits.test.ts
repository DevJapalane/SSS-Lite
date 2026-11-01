import { describe, expect, it } from 'vitest'
import { bodies, getBodyById } from '../data/bodies'
import { EARTH_YEAR_SCREEN_SECONDS, orbitalAngularSpeed } from './orbits'

const lap = (id: Parameters<typeof getBodyById>[0]) =>
  (2 * Math.PI) / orbitalAngularSpeed(getBodyById(id))

describe('orbitalAngularSpeed', () => {
  it('makes Earth go around once per screen "year"', () => {
    expect(lap('earth')).toBeCloseTo(EARTH_YEAR_SCREEN_SECONDS, 1)
  })

  it('keeps the real proportion between periods', () => {
    expect(lap('neptune') / lap('mercury')).toBeCloseTo(59800 / 88, 6)
  })

  it('leaves the Sun still and moves every other body', () => {
    for (const body of bodies) {
      if (body.id === 'sun') expect(orbitalAngularSpeed(body)).toBe(0)
      else expect(orbitalAngularSpeed(body)).toBeGreaterThan(0)
    }
  })
})
