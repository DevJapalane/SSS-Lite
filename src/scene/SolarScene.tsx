import { Stars } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useLayoutEffect, useMemo, useRef } from 'react'
import type { Material, Points } from 'three'
import { useAppStore } from '../store/useAppStore'
import { BodyLabel } from './BodyLabel'
import { CameraRig } from './CameraRig'
import { CelestialBodyMesh } from './CelestialBodyMesh'
import { MoonSystem } from './MoonSystem'
import { OrbitLines } from './OrbitLines'
import { orbitClock } from './orbits'
import { ORBIT_FRAME_PRIORITY, PlacedGroup } from './PlacedGroup'
import { placeBodies } from './placement'

/**
 * Longest real time the clock takes in one frame. Browsers stop drawing in
 * a background tab, and the first frame back reports the whole time away
 * as its delta; without a cap every planet would leap ahead at once.
 */
const MAX_STEP_SECONDS = 0.1

/** Advances the orbit time while the system view is on screen. */
function OrbitClock() {
  useFrame((_, delta) => {
    // getState() reads the flags without subscribing: pausing or changing
    // the speed doesn't re-render anything, the next frame just adds more
    // (or no) time.
    const { orbitsPaused, timeScale } = useAppStore.getState()
    if (!orbitsPaused) orbitClock.time += Math.min(delta, MAX_STEP_SECONDS) * timeScale
    // Even earlier than the bodies, so they move with this frame's time.
  }, ORBIT_FRAME_PRIORITY - 1)
  return null
}

/**
 * Background stars that travel with the camera: they behave like a sky at
 * infinite distance (no parallax), the same whether the camera is a few
 * units from Earth or millions of units out at real scale.
 */
function SkyStars() {
  const points = useRef<Points>(null)

  useLayoutEffect(() => {
    const stars = points.current
    if (!stars) return
    // Always drawn, wherever the camera points.
    stars.frustumCulled = false
    // Never hide anything: bodies drawn later still show in front.
    ;(stars.material as Material).depthWrite = false
    // Moved right before drawing, after the camera controls have updated
    // the camera for this frame; a useFrame could run before them and
    // leave the sky one frame behind during fast flights.
    stars.onBeforeRender = (_renderer, _scene, camera) => {
      stars.position.copy(camera.position)
      stars.updateMatrixWorld()
    }
  }, [])

  // One draw call for 1500 points; fade blurs the edges of each star.
  return <Stars ref={points} radius={400} depth={60} count={1500} factor={4} saturation={0} fade speed={0} />
}

/** Everything inside the 3D canvas. */
export function SolarScene() {
  const viewMode = useAppStore((s) => s.viewMode)
  const selectedBodyId = useAppStore((s) => s.selectedBodyId)
  const compare = useAppStore((s) => s.compare)
  const realScale = useAppStore((s) => s.realScale)
  const placed = useMemo(
    () => placeBodies(viewMode, selectedBodyId, compare, realScale),
    [viewMode, selectedBodyId, compare, realScale],
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

      <SkyStars />

      {/* Time only runs in the system view: in body view the focused body
          holds still where it was, so the camera can rest on it. */}
      {viewMode === 'system' && (
        <>
          <OrbitClock />
          <OrbitLines realScale={realScale} />
        </>
      )}

      {placed.map((item) => (
        <PlacedGroup key={item.key} placed={item}>
          <CelestialBodyMesh body={item.body} radius={item.radius} />
          {/* Inside the moving group, so the label follows its planet.
              System view names every body; the comparison only the ones
              too small to tap; body view none (the body fills the screen). */}
          {viewMode !== 'body' && (
            <BodyLabel body={item.body} radius={item.radius} always={viewMode === 'system'} />
          )}
          {/* Inside Earth's group: the Moon goes around the Sun with it.
              Not in the comparison, where bodies stand alone. */}
          {item.body.id === 'earth' && viewMode !== 'compare' && <MoonSystem realScale={realScale} />}
        </PlacedGroup>
      ))}

      <CameraRig />
    </>
  )
}
