import styles from './App.module.css'
import { SceneCanvas } from './scene/SceneCanvas'
import { useAppStore } from './store/useAppStore'
import { BodyList } from './ui/BodyList'
import { ConnectionNotice } from './ui/ConnectionNotice'
import { ComparePanel } from './ui/ComparePanel'
import { CreditsDialog } from './ui/CreditsDialog'
import { InfoPanel } from './ui/InfoPanel'
import { IosInstallTip } from './ui/IosInstallTip'
import { ScaleNotice } from './ui/ScaleNotice'
import { SceneActions } from './ui/SceneActions'
import { ViewModeSwitch } from './ui/ViewModeSwitch'

export default function App() {
  const isComparing = useAppStore((s) => s.viewMode === 'compare')
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
      {/* One block for the scene controls and the scale note: when the
          controls wrap to a second row, the note moves with them instead of
          being covered. */}
      <div className={styles.sceneHud}>
        <SceneActions />
        <ScaleNotice />
      </div>
      {/* data-occludes: read by the camera to centre the scene in the space
          the side panels leave free (see scene/CameraRig.tsx). */}
      <aside className={styles.list} data-occludes="left">
        <BodyList />
      </aside>
      <main className={styles.scene} aria-label="Visualização 3D">
        <SceneCanvas />
      </main>
      <div className={styles.panel} data-occludes="right">
        {isComparing ? <ComparePanel /> : <InfoPanel />}
      </div>
      {/* Last in the markup and above everything else: transient messages. */}
      <div className={styles.alerts}>
        <ConnectionNotice />
        <IosInstallTip />
      </div>
    </div>
  )
}
