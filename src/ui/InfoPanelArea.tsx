import styles from './placeholder.module.css'

/** Placeholder for the info panel (implemented in a later backlog item). */
export function InfoPanelArea() {
  return (
    <div className={styles.area}>
      <h2 className={styles.heading}>Informações</h2>
      <p className={styles.empty}>Em breve</p>
    </div>
  )
}
