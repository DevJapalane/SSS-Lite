import { useAppStore } from '../store/useAppStore'
import styles from './ScaleNotice.module.css'

/** Discreet note on how faithful the sizes on screen are. */
export function ScaleNotice() {
  const message = useAppStore((s) => {
    if (s.viewMode === 'system') {
      return s.realScale
        ? 'Tamanhos e distâncias em escala real'
        : 'Tamanhos e distâncias fora de escala'
    }
    // The only view with true proportions; saying so is what makes it useful.
    if (s.viewMode === 'compare') return 'Tamanhos em escala real'
    return null
  })
  if (!message) return null
  // role="note": screen readers announce it as side information, not an alert.
  return (
    <p className={styles.notice} role="note">
      {message}
    </p>
  )
}
