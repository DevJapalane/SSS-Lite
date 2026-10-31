import { useId, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import styles from './PanelCard.module.css'
import { MOBILE_QUERY, useMediaQuery } from './useMediaQuery'

/** Vertical finger travel (px) that counts as a swipe instead of a tap. */
const SWIPE_THRESHOLD = 24

interface Props {
  title: string
  /** Shown next to the title (e.g. the body's badge). */
  titleExtra?: ReactNode
  children: ReactNode
}

/**
 * Shell shared by the info and comparison panels. Desktop: always-open side
 * panel. Phone: card at the bottom that shows only the title until tapped
 * or swiped up, so the 3D view isn't covered by default.
 */
export function PanelCard({ title, titleExtra, children }: Props) {
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

  const isOpen = !isMobile || expanded

  const titleRow = (
    <span className={styles.titleRow}>
      <span className={styles.title}>{title}</span>
      {titleExtra}
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
            {titleRow}
            <span className={styles.chevron} aria-hidden="true" />
          </button>
        ) : (
          titleRow
        )}
      </h2>

      <div id={contentId} className={styles.content} hidden={!isOpen}>
        {children}
      </div>
    </section>
  )
}
