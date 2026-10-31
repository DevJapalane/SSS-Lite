import { useAppStore } from '../store/useAppStore'
import styles from './ViewModeToggle.module.css'

/**
 * PROVISIONAL control to switch views while the definitive interface
 * doesn't exist yet. Replace it when the view controls item is built.
 */
export function ViewModeToggle() {
  const viewMode = useAppStore((s) => s.viewMode)
  const setViewMode = useAppStore((s) => s.setViewMode)
  const isSystem = viewMode === 'system'

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={() => setViewMode(isSystem ? 'body' : 'system')}
    >
      {isSystem ? 'Ver corpo' : 'Ver sistema'}
    </button>
  )
}
