import { getBodyById } from '../data/bodies'
import { useAppStore, type TimeScale } from '../store/useAppStore'
import { inBody } from '../utils/grammar'
import styles from './SceneActions.module.css'
import { SegmentedControl } from './SegmentedControl'

const SPEED_OPTIONS = [
  { value: '1', label: '1×' },
  { value: '10', label: '10×' },
  { value: '100', label: '100×' },
] as const

/**
 * Buttons that act on the scene outside body view: Focar (PB10); pause,
 * speed and real scale of the orbits (system view).
 */
export function SceneActions() {
  const viewMode = useAppStore((s) => s.viewMode)
  const body = getBodyById(useAppStore((s) => s.selectedBodyId))
  const orbitsPaused = useAppStore((s) => s.orbitsPaused)
  const toggleOrbits = useAppStore((s) => s.toggleOrbits)
  const timeScale = useAppStore((s) => s.timeScale)
  const setTimeScale = useAppStore((s) => s.setTimeScale)
  const realScale = useAppStore((s) => s.realScale)
  const toggleRealScale = useAppStore((s) => s.toggleRealScale)
  const setViewMode = useAppStore((s) => s.setViewMode)

  if (viewMode === 'body') return null

  return (
    <div className={styles.actions}>
      {viewMode === 'system' && (
        <>
          {/* The label says what a tap will do; aria-pressed on top of a
              changing label would make screen readers announce it twice.
              On phones only the icon shows, the text stays for screen readers. */}
          <button type="button" className={styles.button} onClick={toggleOrbits}>
            {orbitsPaused ? <PlayIcon /> : <PauseIcon />}
            <span className={styles.text}>{orbitsPaused ? 'Retomar' : 'Pausar'}</span>
          </button>
          <SegmentedControl
            ariaLabel="Velocidade das órbitas"
            options={SPEED_OPTIONS}
            value={String(timeScale) as (typeof SPEED_OPTIONS)[number]['value']}
            onChange={(value) => setTimeScale(Number(value) as TimeScale)}
          />
          {/* Fixed label + aria-pressed: an on/off switch, unlike Pausar. */}
          <button
            type="button"
            className={styles.button}
            aria-pressed={realScale}
            onClick={toggleRealScale}
          >
            Escala real
          </button>
        </>
      )}
      {/* Names the body: in the comparison the selected body may be
          neither A nor B, and "Focar" alone would leave you guessing. */}
      <button
        type="button"
        className={`${styles.button} ${styles.primary}`}
        onClick={() => setViewMode('body')}
      >
        <FocusIcon />
        Focar {inBody(body)}
      </button>
    </div>
  )
}

// Inline SVG instead of ⏸/▶ characters: phones render those as colourful
// emoji, and an icon font would be a whole download for three glyphs.
function PauseIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <rect x="3.5" y="3" width="3" height="10" rx="1" />
      <rect x="9.5" y="3" width="3" height="10" rx="1" />
    </svg>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path d="M5 3.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L5.9 2.7a.6.6 0 0 0-.9.5Z" />
    </svg>
  )
}

function FocusIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="2.5" />
      <path
        d="M2 5.5V3a1 1 0 0 1 1-1h2.5M10.5 2H13a1 1 0 0 1 1 1v2.5M14 10.5V13a1 1 0 0 1-1 1h-2.5M5.5 14H3a1 1 0 0 1-1-1v-2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
