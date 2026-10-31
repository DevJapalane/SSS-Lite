import styles from './App.module.css'
import { SceneCanvas } from './scene/SceneCanvas'
import { BodyListArea } from './ui/BodyListArea'
import { InfoPanelArea } from './ui/InfoPanelArea'
import { ScaleNotice } from './ui/ScaleNotice'
import { ViewModeToggle } from './ui/ViewModeToggle'

export default function App() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          SSS <span className={styles.accent}>Lite</span>
        </h1>
      </header>
      <div className={styles.viewControls}>
        <ViewModeToggle />
      </div>
      <div className={styles.notice}>
        <ScaleNotice />
      </div>
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
