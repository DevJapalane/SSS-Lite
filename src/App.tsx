import styles from './App.module.css'
import { SceneCanvas } from './scene/SceneCanvas'
import { BodyList } from './ui/BodyList'
import { CreditsDialog } from './ui/CreditsDialog'
import { InfoPanel } from './ui/InfoPanel'
import { ScaleNotice } from './ui/ScaleNotice'
import { ViewModeSwitch } from './ui/ViewModeSwitch'

export default function App() {
  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          SSS <span className={styles.accent}>Lite</span>
        </h1>
        <CreditsDialog />
      </header>
      <div className={styles.viewControls}>
        <ViewModeSwitch />
      </div>
      <div className={styles.notice}>
        <ScaleNotice />
      </div>
      {/* data-occludes: read by the camera to centre the scene in the space
          the side panels leave free (see scene/CameraRig.tsx). */}
      <aside className={styles.list} data-occludes="left">
        <BodyList />
      </aside>
      <main className={styles.scene}>
        <SceneCanvas />
      </main>
      <div className={styles.panel} data-occludes="right">
        <InfoPanel />
      </div>
    </div>
  )
}
