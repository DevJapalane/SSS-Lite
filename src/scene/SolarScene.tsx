import { Stars } from '@react-three/drei'
import { bodies } from '../data/bodies'
import { useAppStore } from '../store/useAppStore'
import { CameraRig } from './CameraRig'
import { CelestialBodyMesh } from './CelestialBodyMesh'
import { systemLayout } from './systemLayout'

/**
 * Everything inside the 3D canvas.
 *
 * Body view mounts only the selected body: the others are not hidden but
 * absent, so their textures are never even requested (lazy loading for free).
 */
export function SolarScene() {
  const viewMode = useAppStore((s) => s.viewMode)
  const selectedBodyId = useAppStore((s) => s.selectedBodyId)
  const visible = viewMode === 'system' ? bodies : bodies.filter((b) => b.id === selectedBodyId)

  return (
    <>
      {/*
        Two lights for the whole scene. The point light lives where the Sun
        is, even when the Sun itself isn't shown, so planets always have a
        day side facing it. decay={0}: no fading with distance, otherwise
        Neptune would be black in a compressed layout.
      */}
      <pointLight position={[0, 0, 0]} intensity={3} decay={0} />
      {/* Faint fill so night sides are dark but not a black hole. */}
      <ambientLight intensity={0.12} />

      {/* One draw call for 1500 points; fade blurs the edges of each star. */}
      <Stars radius={250} depth={60} count={1500} factor={4} saturation={0} fade speed={0} />

      {visible.map((body) => {
        const { x, radius } = systemLayout[body.id]
        return <CelestialBodyMesh key={body.id} body={body} x={x} radius={radius} />
      })}

      <CameraRig />
    </>
  )
}
