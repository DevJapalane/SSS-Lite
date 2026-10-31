import styles from './App.module.css'
import { SceneCanvas } from './scene/SceneCanvas'
import { BodyListArea } from './ui/BodyListArea'
import { InfoPanelArea } from './ui/InfoPanelArea'

export default function App() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          SSS <span className={styles.accent}>Lite</span>
        </h1>
      </header>
      <aside className={styles.list}>
        <BodyListArea />
      </aside>
      <main className={styles.scene}>
        <SceneCanvas />
      </main>
      <section className={styles.panel}>
        <InfoPanelArea />
      </section>
    </div>
  )
}
