import type { CelestialBody } from '../data/bodies'

export type Named = Pick<CelestialBody, 'id' | 'name'>

// In pt-BR, "Sol" and "Terra" take an article ("o Sol", "a Terra"), while
// planet names are used bare ("Júpiter", "Plutão").
const ARTICLES: Partial<Record<string, 'o' | 'a'>> = { sun: 'o', earth: 'a' }

/** "o Sol", "a Terra", "Júpiter". */
export function withArticle(body: Named): string {
  const article = ARTICLES[body.id]
  return article ? `${article} ${body.name}` : body.name
}

/** "do Sol", "da Terra", "de Júpiter" (de + o = do, de + a = da). */
export function ofBody(body: Named): string {
  const article = ARTICLES[body.id]
  return article ? `d${article} ${body.name}` : `de ${body.name}`
}

/** "no Sol", "na Terra", "em Júpiter" (em + o = no, em + a = na). */
export function inBody(body: Named): string {
  const article = ARTICLES[body.id]
  return article ? `n${article} ${body.name}` : `em ${body.name}`
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}
