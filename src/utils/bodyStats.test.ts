import { describe, expect, it } from 'vitest'
import { bodies, getBodyById } from '../data/bodies'
import { bodyTypeLabel, getBodyStats } from './bodyStats'

const earth = getBodyById('earth')
const valueOf = (rows: ReturnType<typeof getBodyStats>, id: string) =>
  rows.find((row) => row.id === id)?.value

describe('getBodyStats in km', () => {
  it('shows every quantity of a planet with pt-BR units', () => {
    const rows = getBodyStats(earth, 'km', earth)
    expect(rows.map((row) => row.value)).toEqual([
      '6.378 km',
      '12.756 km',
      '9,8 m/s²',
      '5,97 × 10²⁴ kg',
      '29,8 km/s',
    ])
  })

  it('keeps one decimal on gravity and velocity ("9,0", not "9")', () => {
    const rows = getBodyStats(getBodyById('saturn'), 'km', earth)
    expect(valueOf(rows, 'gravity')).toBe('9,0 m/s²')
  })
})

describe('getBodyStats in × Terra', () => {
  it('gives Earth exactly 1 for everything', () => {
    for (const row of getBodyStats(earth, 'earth', earth)) {
      expect(row.value).toBe('1 × Terra')
    }
  })

  it('converts Jupiter to ratios of Earth', () => {
    const rows = getBodyStats(getBodyById('jupiter'), 'earth', earth)
    expect(valueOf(rows, 'radius')).toBe('11,2 × Terra')
    expect(valueOf(rows, 'mass')).toBe('318 × Terra')
    expect(valueOf(rows, 'gravity')).toBe('2,36 × Terra')
  })

  it('keeps tiny ratios readable (Pluto mass)', () => {
    const rows = getBodyStats(getBodyById('pluto'), 'earth', earth)
    expect(valueOf(rows, 'mass')).toBe('0,0022 × Terra')
  })
})

describe('the Sun has no orbital velocity', () => {
  const sun = getBodyById('sun')

  it('omits the row in both units instead of showing 0 or a dash', () => {
    for (const unit of ['km', 'earth'] as const) {
      const rows = getBodyStats(sun, unit, earth)
      expect(rows.map((row) => row.id)).not.toContain('orbitalVelocity')
      expect(rows).toHaveLength(4)
    }
  })

  it('is the only body without it', () => {
    for (const body of bodies) {
      if (body.id === 'sun') continue
      expect(getBodyStats(body, 'km', earth)).toHaveLength(5)
    }
  })
})

describe('bodyTypeLabel', () => {
  it('names each type in Portuguese', () => {
    expect(bodyTypeLabel('star')).toBe('Estrela')
    expect(bodyTypeLabel('planet')).toBe('Planeta')
    expect(bodyTypeLabel('dwarf-planet')).toBe('Planeta anão')
  })
})
