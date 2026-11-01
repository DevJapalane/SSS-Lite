import { describe, expect, it } from 'vitest'
import { formatDecimal, formatRatio, formatScientific, toSuperscript } from './format'

describe('formatDecimal', () => {
  it('uses dot for thousands and comma for decimals (pt-BR)', () => {
    expect(formatDecimal(6378)).toBe('6.378')
    expect(formatDecimal(2439.5)).toBe('2.439,5')
    expect(formatDecimal(695700)).toBe('695.700')
  })

  it('rounds to the maximum and keeps the minimum fraction digits', () => {
    expect(formatDecimal(9.81)).toBe('9,8')
    expect(formatDecimal(9, 1, 1)).toBe('9,0')
    expect(formatDecimal(11, 1, 1)).toBe('11,0')
  })
})

describe('toSuperscript', () => {
  it('turns digits and the minus sign into superscripts', () => {
    expect(toSuperscript(24)).toBe('²⁴')
    expect(toSuperscript(-3)).toBe('⁻³')
    expect(toSuperscript(30)).toBe('³⁰')
  })
})

describe('formatScientific', () => {
  it('writes mantissa × 10^exponent with a comma', () => {
    expect(formatScientific(5.97e24)).toBe('5,97 × 10²⁴')
    expect(formatScientific(1.9884e30)).toBe('1,99 × 10³⁰')
  })

  it('keeps trailing zeros so every body shows the same precision', () => {
    expect(formatScientific(1.898e27)).toBe('1,90 × 10²⁷')
    expect(formatScientific(1.3e22)).toBe('1,30 × 10²²')
  })

  it('renormalises when rounding reaches 10', () => {
    expect(formatScientific(9.996e23)).toBe('1,00 × 10²⁴')
  })

  it('handles zero and negative exponents', () => {
    expect(formatScientific(0)).toBe('0')
    expect(formatScientific(0.00123)).toBe('1,23 × 10⁻³')
  })
})

describe('formatRatio', () => {
  it('adapts precision to the size of the ratio', () => {
    expect(formatRatio(333060)).toBe('333.000')
    expect(formatRatio(317.83)).toBe('318')
    expect(formatRatio(11.21)).toBe('11,2')
    expect(formatRatio(1.0545)).toBe('1,05')
    expect(formatRatio(1)).toBe('1')
  })

  it('keeps significant digits for tiny ratios instead of showing 0', () => {
    expect(formatRatio(0.00218)).toBe('0,0022')
    expect(formatRatio(0.0553)).toBe('0,055')
  })

  it('writes millions and billions in words', () => {
    expect(formatRatio(153e6)).toBe('153 milhões')
    expect(formatRatio(1.5e9)).toBe('1,5 bilhão')
  })
})
