import { describe, expect, it } from 'vitest'
import { getBodyById } from '../data/bodies'
import { capitalize, inBody, ofBody, withArticle } from './grammar'

const sun = getBodyById('sun')
const earth = getBodyById('earth')
const jupiter = getBodyById('jupiter')

describe('pt-BR articles', () => {
  it('puts an article only before Sol and Terra', () => {
    expect([sun, earth, jupiter].map(withArticle)).toEqual(['o Sol', 'a Terra', 'Júpiter'])
  })

  it('contracts "de" with the article', () => {
    expect([sun, earth, jupiter].map(ofBody)).toEqual(['do Sol', 'da Terra', 'de Júpiter'])
  })

  it('contracts "em" with the article', () => {
    expect([sun, earth, jupiter].map(inBody)).toEqual(['no Sol', 'na Terra', 'em Júpiter'])
  })

  it('capitalizes the first letter only', () => {
    expect(capitalize('o Sol')).toBe('O Sol')
  })
})
