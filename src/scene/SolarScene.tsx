import { Stars } from '@react-three/drei'
import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { BodyLabel } from './BodyLabel'
import { CameraRig } from './CameraRig'
import { CelestialBodyMesh } from './CelestialBodyMesh'
import { placeBodies } from './placement'

/** Everything inside the 3D canvas. */
export function SolarScene() {
  const viewMode = useAppStore((s) => s.viewMode)
  const selectedBodyId = useAppStore((s) => s.selectedBodyId)
  const compare = useAppStore((s) => s.compare)
  const placed = useMemo(
    () => placeBodies(viewMode, selectedBodyId, compare),
    [viewMode, selectedBodyId, compare],
  )

  return (
    <>
      {viewMode === 'compare' ? (
        // The pair sits around the origin, where the Sun's light would be
        // between them and light only their inner halves. A light from the
        // front-left lights both the same way.
        <directionalLight position={[-4, 2, 6]} intensity={3} />
      ) : (
        /*
          The point light lives where the Sun is, even when the Sun itself
          isn't shown, so planets always have a day side facing it.
          decay={0}: no fading with distance, otherwise Neptune would be
          black in a compressed layout.
        */
        <pointLight position={[0, 0, 0]} intensity={3} decay={0} />
      )}
      {/* Faint fill so night sides are dark but not a black hole. */}
      <ambientLight intensity={0.12} />

      {/* One draw call for 1500 points; fade blurs the edges of each star. */}
      <Stars radius={250} depth={60} count={1500} factor={4} saturation={0} fade speed={0} />

      {placed.map(({ key, body, x, radius }) => (
        <CelestialBodyMesh key={key} body={body} x={x} radius={radius} />
      ))}

      {/* In body view the one body fills the screen: no label needed. */}
      {viewMode !== 'body' &&
        placed.map(({ key, body, x, radius }) => (
          <BodyLabel key={key} body={body} x={x} radius={radius} />
        ))}

      <CameraRig />
    </>
  )
}
