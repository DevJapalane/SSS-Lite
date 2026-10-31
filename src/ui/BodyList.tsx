import { useRef, type CSSProperties, type KeyboardEvent } from 'react'
import { bodies, type BodyId } from '../data/bodies'
import { useAppStore } from '../store/useAppStore'
import { BodyBadge } from './BodyBadge'
import styles from './BodyList.module.css'

/**
 * Buttons for every body: the side list on desktop, the bottom bar on
 * phones (same markup, CSS changes the direction).
 */
export function BodyList() {
  const selectedBodyId = useAppStore((s) => s.selectedBodyId)
  const selectBody = useAppStore((s) => s.selectBody)
  const setViewMode = useAppStore((s) => s.setViewMode)
  const buttons = useRef<(HTMLButtonElement | null)[]>([])

  function choose(id: BodyId) {
    selectBody(id)
    // Picking a body always takes you to it: in system view a selection with
    // no visible effect would feel broken.
    setViewMode('body')
  }

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
              onClick={() => choose(body.id)}
            >
              <span
                className={styles.swatch}
                // CSS custom property: one stylesheet rule draws every swatch,
                // only the color comes from the data.
                style={{ '--swatch': body.fallbackColor } as CSSProperties}
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
