import { useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { bodies, type CelestialBody } from '../data/bodies'
import { useAppStore } from '../store/useAppStore'
import { BodyBadge } from './BodyBadge'
import styles from './BodyList.module.css'

/**
 * Tiny texture copies made by `npm run thumbs` (1–3 KB each), not the full
 * textures: those would download ~1 MB as soon as the list appears.
 */
function swatchStyle(body: CelestialBody): CSSProperties {
  const thumb = body.texture
    ? `url(${import.meta.env.BASE_URL}textures/thumbs/${body.texture})`
    : undefined
  return { '--swatch': body.fallbackColor, '--thumb': thumb } as CSSProperties
}

/**
 * Buttons for every body: the side list on desktop, the bottom bar on
 * phones (same markup, CSS changes the direction).
 */
export function BodyList() {
  const selectedBodyId = useAppStore((s) => s.selectedBodyId)
  const goToBody = useAppStore((s) => s.goToBody)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  // Arrow keys move between items so a keyboard user doesn't have to Tab
  // through all ten; both axes work because the list is vertical on desktop
  // and horizontal on phones.
  function handleKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const current = buttons.current.indexOf(document.activeElement as HTMLButtonElement)
    if (current === -1) return
    const last = bodies.length - 1
    const next = {
      ArrowDown: current + 1,
      ArrowRight: current + 1,
      ArrowUp: current - 1,
      ArrowLeft: current - 1,
      Home: 0,
      End: last,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    buttons.current[Math.max(0, Math.min(last, next))]?.focus()
  }

  return (
    <nav className={styles.nav} aria-label="Corpos celestes">
      <h2 className={styles.heading}>Corpos celestes</h2>
      <ul className={styles.list} onKeyDown={handleKeyDown}>
        {bodies.map((body, index) => (
          <li key={body.id}>
            <button
              ref={(el) => {
                buttons.current[index] = el
              }}
              type="button"
              className={styles.item}
              aria-pressed={body.id === selectedBodyId}
              onClick={() => goToBody(body.id)}
            >
              <span
                className={styles.swatch}
                // CSS custom properties: one stylesheet rule draws every
                // swatch, only the colour and thumbnail come from the data.
                style={swatchStyle(body)}
                aria-hidden="true"
              />
              <span className={styles.name}>{body.name}</span>
              <BodyBadge type={body.type} />
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
