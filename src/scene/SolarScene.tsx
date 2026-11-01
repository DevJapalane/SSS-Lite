import { Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import { useAppStore } from '../store/useAppStore'
import { BodyLabel } from './BodyLabel'
import { CameraRig } from './CameraRig'
import { CelestialBodyMesh } from './CelestialBodyMesh'
import { OrbitLines } from './OrbitLines'
import { orbitClock } from './orbits'
import { ORBIT_FRAME_PRIORITY, PlacedGroup } from './PlacedGroup'
import { placeBodies } from './placement'

/**
 * Longest step the clock takes in one frame. Browsers stop drawing in a
 * background tab, and the first frame back reports the whole time away as
 * its delta; without a cap every planet would leap ahead at once.
 */
const MAX_STEP_SECONDS = 0.1

/** Advances the orbit time while the system view is on screen. */
function OrbitClock() {
  useFrame((_, delta) => {
    // getState() reads the flag without subscribing: pausing doesn't
    // re-render anything, the next frame simply stops adding time.
    if (!useAppStore.getState().orbitsPaused) {
      orbitClock.time += Math.min(delta, MAX_STEP_SECONDS)
    }
    // Even earlier than the bodies, so they move with this frame's time.
  }, ORBIT_FRAME_PRIORITY - 1)
  return null
}

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

      {/* One draw call for 1500 points; fade blurs the edges of each star.
          Radius past the farthest camera of the system view, so the camera
          always stays inside the star shell. */}
      <Stars radius={400} depth={60} count={1500} factor={4} saturation={0} fade speed={0} />

      {/* Time only runs in the system view: in body view the focused body
          holds still where it was, so the camera can rest on it. */}
      {viewMode === 'system' && (
        <>
          <OrbitClock />
          <OrbitLines />
        </>
      )}

      {placed.map((item) => (
        <PlacedGroup key={item.key} placed={item}>
          <CelestialBodyMesh body={item.body} radius={item.radius} />
          {/* Inside the moving group, so the label follows its planet.
              In body view the one body fills the screen: no label needed. */}
          {viewMode !== 'body' && <BodyLabel body={item.body} radius={item.radius} />}
        </PlacedGroup>
      ))}

      <CameraRig />
    </>
  )
}
