import type { BodyType } from '../data/bodies'
import { bodyTypeLabel } from '../utils/bodyStats'
import styles from './BodyBadge.module.css'

/**
 * Tag for the bodies that are not regular planets. Regular planets get no
 * tag: marking only the exceptions is what makes Pluto stand out.
 */
export function BodyBadge({ type }: { type: BodyType }) {
  if (type === 'planet') return null
  return <span className={styles.badge}>{bodyTypeLabel(type).toLowerCase()}</span>
}
