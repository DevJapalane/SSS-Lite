import { useAppStore } from '../store/useAppStore'
import styles from './ScaleNotice.module.css'

/** Discreet warning, shown only where sizes and distances are compressed. */
export function ScaleNotice() {
  const viewMode = useAppStore((s) => s.viewMode)
  if (viewMode !== 'system') return null
  // role="note": screen readers announce it as side information, not an alert.
  return (
    <p className={styles.notice} role="note">
      Tamanhos e distâncias fora de escala
    </p>
  )
}
