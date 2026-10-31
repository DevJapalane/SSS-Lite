import { useAppStore, type ViewMode } from '../store/useAppStore'
import styles from './ScaleNotice.module.css'

const MESSAGES: Partial<Record<ViewMode, string>> = {
  system: 'Tamanhos e distâncias fora de escala',
  // The only view with true proportions; saying so is what makes it useful.
  compare: 'Tamanhos em escala real',
}

/** Discreet note on how faithful the sizes on screen are. */
export function ScaleNotice() {
  const message = MESSAGES[useAppStore((s) => s.viewMode)]
  if (!message) return null
  // role="note": screen readers announce it as side information, not an alert.
  return (
    <p className={styles.notice} role="note">
      {message}
    </p>
  )
}
