/**
 * Number formatting for the UI (pt-BR). Pure functions: number in, string
 * out, no React, no global state — so they can be unit tested in isolation.
 */

const LOCALE = 'pt-BR'

// Intl.NumberFormat is expensive to build, so one instance per precision is
// cached instead of creating a new one on every render.
const decimalFormatters = new Map<string, Intl.NumberFormat>()

/**
 * "6.378", "2.439,5", "9,8": dot for thousands, comma for decimals.
 * `minFractionDigits` keeps meaningful trailing zeros ("9,0", not "9"),
 * so a value doesn't look less precise than the source data.
 */
export function formatDecimal(value: number, maxFractionDigits = 1, minFractionDigits = 0): string {
  const key = `${minFractionDigits}:${maxFractionDigits}`
  let formatter = decimalFormatters.get(key)
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE, {
      minimumFractionDigits: minFractionDigits,
      maximumFractionDigits: maxFractionDigits,
    })
    decimalFormatters.set(key, formatter)
  }
  return formatter.format(value)
}

const SUPERSCRIPT_DIGITS: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻',
}

/** 24 → "²⁴", -3 → "⁻³". */
export function toSuperscript(value: number): string {
  return String(value)
    .split('')
    .map((char) => SUPERSCRIPT_DIGITS[char] ?? char)
    .join('')
}

/**
 * Scientific notation readable by anyone: 5.97e24 → "5,97 × 10²⁴".
 * Uses Unicode superscripts instead of <sup> so it also works in plain
 * strings (aria-labels, tests, copy-paste).
 */
export function formatScientific(value: number, significantDigits = 3): string {
  if (value === 0) return '0'
  let exponent = Math.floor(Math.log10(Math.abs(value)))
  let mantissa = Number((value / 10 ** exponent).toPrecision(significantDigits))
  // Rounding can push 9.996 up to 10.0; renormalise to 1.00 × 10^(e+1).
  if (Math.abs(mantissa) >= 10) {
    mantissa /= 10
    exponent += 1
  }
  const fractionDigits = significantDigits - 1
  // Fixed digits: "1,90 × 10²⁷", not "1,9" — same precision for every body.
  return `${formatDecimal(mantissa, fractionDigits, fractionDigits)} × 10${toSuperscript(exponent)}`
}

const significantFormatters = new Map<number, Intl.NumberFormat>()

function formatSignificant(value: number, digits: number): string {
  let formatter = significantFormatters.get(digits)
  if (!formatter) {
    formatter = new Intl.NumberFormat(LOCALE, { maximumSignificantDigits: digits })
    significantFormatters.set(digits, formatter)
  }
  return formatter.format(value)
}

/**
 * Ratio to Earth with precision that adapts to the size: big ratios are
 * rounded (Sun mass "333.000", not a falsely precise "333.065"), tiny ones
 * keep significant digits (Pluto mass "0,0022") or they would all read "0".
 */
export function formatRatio(ratio: number): string {
  const abs = Math.abs(ratio)
  if (abs >= 1000) return formatSignificant(ratio, 3)
  if (abs >= 100) return formatDecimal(ratio, 0)
  if (abs >= 10) return formatDecimal(ratio, 1)
  if (abs >= 1) return formatDecimal(ratio, 2)
  return formatSignificant(ratio, 2)
}
