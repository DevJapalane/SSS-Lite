import { useId, useRef, useState, type PointerEvent } from 'react'
import { getBodyById } from '../data/bodies'
import { useAppStore, type Unit } from '../store/useAppStore'
import { getBodyStats } from '../utils/bodyStats'
import { BodyBadge } from './BodyBadge'
import styles from './InfoPanel.module.css'
import { SegmentedControl } from './SegmentedControl'
import { MOBILE_QUERY, useMediaQuery } from './useMediaQuery'

const UNIT_OPTIONS = [
  { value: 'km', label: 'km' },
  { value: 'earth', label: '× Terra' },
] as const satisfies readonly { value: Unit; label: string }[]

/** Vertical finger travel (px) that counts as a swipe instead of a tap. */
const SWIPE_THRESHOLD = 24

/**
 * Data of the selected body. Desktop: always-open side panel. Phone: card
 * at the bottom that shows only the name until tapped or swiped up, so the
 * 3D view isn't covered by default.
 */
export function InfoPanel() {
  const body = getBodyById(useAppStore((s) => s.selectedBodyId))
  const unit = useAppStore((s) => s.unit)
  const setUnit = useAppStore((s) => s.setUnit)
  const isMobile = useMediaQuery(MOBILE_QUERY)
  const [expanded, setExpanded] = useState(false)
  const titleId = useId()
  const contentId = useId()

  const swipeStartY = useRef<number | null>(null)
  // A swipe also ends with a click event; this flag stops that click from
  // toggling the card right back.
  const ignoreNextClick = useRef(false)

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    swipeStartY.current = event.clientY
    // A new gesture: forget a click left pending by an earlier swipe that
    // never received one, or it would swallow this tap.
    ignoreNextClick.current = false
    // Keep receiving pointerup even if the finger/mouse ends outside the
    // handle. Touch does this implicitly; mouse and pen need it explicit.
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerUp(event: PointerEvent) {
    if (swipeStartY.current === null) return
    const deltaY = event.clientY - swipeStartY.current
    swipeStartY.current = null
    if (Math.abs(deltaY) < SWIPE_THRESHOLD) return
    setExpanded(deltaY < 0) // up opens, down closes
    ignoreNextClick.current = true
  }

  function handleClick() {
    if (ignoreNextClick.current) {
      ignoreNextClick.current = false
      return
    }
    setExpanded((value) => !value)
  }

  const stats = getBodyStats(body, unit, getBodyById('earth'))
  const isOpen = !isMobile || expanded

  const title = (
    <span className={styles.titleRow}>
      <span className={styles.title}>{body.name}</span>
      <BodyBadge type={body.type} />
    </span>
  )

  return (
    <section className={styles.panel} data-expanded={isOpen} aria-labelledby={titleId}>
      <h2 id={titleId} className={styles.heading}>
        {isMobile ? (
          // On phones the heading holds the card's handle (accordion
          // pattern): a real button, so it works with keyboard and screen
          // readers, not only with swipes. aria-expanded announces the state.
          <button
            type="button"
            className={styles.handle}
            aria-expanded={expanded}
            aria-controls={contentId}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={() => (swipeStartY.current = null)}
            onClick={handleClick}
          >
            <span className={styles.grip} aria-hidden="true" />
            {title}
            <span className={styles.chevron} aria-hidden="true" />
          </button>
        ) : (
          title
        )}
      </h2>

      <div id={contentId} className={styles.content} hidden={!isOpen}>
        <SegmentedControl ariaLabel="Unidade" options={UNIT_OPTIONS} value={unit} onChange={setUnit} />
        <dl className={styles.stats}>
          {stats.map((row) => (
            <div key={row.id} className={styles.row}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
        {body.orbitalVelocityKmS === null && (
          <p className={styles.note}>
            O Sol não tem velocidade orbital aqui: ele é a referência em torno da qual os
            planetas orbitam.
          </p>
        )}
      </div>
    </section>
  )
}
