import styles from './placeholder.module.css'

/** Placeholder for the body list (implemented in a later backlog item). */
export function BodyListArea() {
  return (
    <div className={styles.area}>
      <h2 className={styles.heading}>Corpos celestes</h2>
      <p className={styles.empty}>Em breve</p>
    </div>
  )
}
