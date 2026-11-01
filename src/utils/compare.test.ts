import { describe, expect, it } from 'vitest'
import { getBodyById, type BodyId } from '../data/bodies'
import { massBarFraction, massComparisonText, sizeComparisonText } from './compare'

const size = (a: BodyId, b: BodyId) => sizeComparisonText(getBodyById(a), getBodyById(b))
const mass = (a: BodyId, b: BodyId) => massComparisonText(getBodyById(a), getBodyById(b))

describe('sizeComparisonText', () => {
  it('compares diameters with the right articles', () => {
    expect(size('sun', 'earth')).toBe('O Sol é 109 vezes maior que a Terra em diâmetro.')
    expect(size('sun', 'pluto')).toBe('O Sol é 586 vezes maior que Plutão em diâmetro.')
    expect(size('jupiter', 'earth')).toBe('Júpiter é 11,2 vezes maior que a Terra em diâmetro.')
  })

  it('always names the larger body first, whatever the order', () => {
    expect(size('pluto', 'sun')).toBe(size('sun', 'pluto'))
  })

  it('uses the singular "vez" below 2', () => {
    expect(size('earth', 'venus')).toBe('A Terra é 1,05 vez maior que Vênus em diâmetro.')
    expect(size('earth', 'mars')).toBe('A Terra é 1,88 vez maior que Marte em diâmetro.')
    expect(size('saturn', 'uranus')).toBe('Saturno é 2,36 vezes maior que Urano em diâmetro.')
  })

  it('handles the same body on both sides', () => {
    expect(size('earth', 'earth')).toBe('É a Terra dos dois lados: mesmo diâmetro.')
  })
})

describe('massComparisonText', () => {
  it('compares masses with "do/da/de"', () => {
    expect(mass('sun', 'earth')).toBe('O Sol tem 333.000 vezes a massa da Terra.')
    expect(mass('jupiter', 'earth')).toBe('Júpiter tem 318 vezes a massa da Terra.')
    expect(mass('earth', 'mars')).toBe('A Terra tem 9,3 vezes a massa de Marte.')
  })

  it('writes huge ratios in words (Sun × Pluto)', () => {
    expect(mass('pluto', 'sun')).toBe('O Sol tem 153 milhões vezes a massa de Plutão.')
  })

  it('uses the singular "vez" below 2', () => {
    expect(mass('venus', 'earth')).toBe('A Terra tem 1,23 vez a massa de Vênus.')
  })

  it('handles the same body on both sides', () => {
    expect(mass('sun', 'sun')).toBe('É o Sol dos dois lados: mesma massa.')
  })
})

describe('massBarFraction', () => {
  it('places each decade at the same distance on the log axis', () => {
    expect(massBarFraction(1e21)).toBe(0)
    expect(massBarFraction(1e26)).toBeCloseTo(0.5)
    expect(massBarFraction(1e31)).toBe(1)
  })

  it('keeps the order of the real masses', () => {
    const ids: BodyId[] = ['pluto', 'earth', 'jupiter', 'sun']
    const fractions = ids.map((id) => massBarFraction(getBodyById(id).massKg))
    expect(fractions).toEqual([...fractions].sort((a, b) => a - b))
  })

  it('clamps values outside the axis', () => {
    expect(massBarFraction(1e18)).toBe(0)
    expect(massBarFraction(1e35)).toBe(1)
  })
})
