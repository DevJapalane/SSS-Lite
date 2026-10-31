import { CameraControls, CameraControlsImpl } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { getBodyById, type BodyId } from '../data/bodies'
import { useAppStore, type ViewMode } from '../store/useAppStore'
import { lineupFitDistance, sphereFitDistance } from '../utils/cameraFraming'
import { lineupBounds, systemLayout } from './systemLayout'

const { ACTION } = CameraControlsImpl

// The Sun sits at -X, so looking slightly from that side shows mostly the
// lit hemisphere with the day/night line near the edge.
const BODY_VIEW_DIRECTION = new Vector3(-0.45, 0.25, 1).normalize()
const SYSTEM_VIEW_DIRECTION = new Vector3(0, 0.35, 1).normalize()

interface Shot {
  target: Vector3
  direction: Vector3
  distance: number
  minDistance: number
  maxDistance: number
  /** Whether dragging with two fingers / right button slides the view. */
  allowPan: boolean
}

function planShot(viewMode: ViewMode, bodyId: BodyId, fov: number, aspect: number): Shot {
  if (viewMode === 'system') {
    const distance = lineupFitDistance(lineupBounds.width, lineupBounds.height, fov, aspect)
    return {
      target: new Vector3(lineupBounds.centerX, 0, 0),
      direction: SYSTEM_VIEW_DIRECTION,
      distance,
      minDistance: 2,
      maxDistance: distance * 2,
      // Panning lets you slide along the lineup, essential on a narrow phone.
      allowPan: true,
    }
  }

  // 'body' (and 'compare' until it exists): one body, centred.
  const body = getBodyById(bodyId)
  const { x, radius } = systemLayout[body.id]
  // Frame the rings too, otherwise Saturn's would be cut off.
  const distance = sphereFitDistance(radius * (body.rings?.outerRadiusRatio ?? 1), fov, aspect)
  return {
    target: new Vector3(x, 0, 0),
    direction: BODY_VIEW_DIRECTION,
    distance,
    // Limits relative to the body: never so close it fills the whole screen
    // (on a narrow phone that already happens well before touching the
    // surface), never so far it's a dot.
    minDistance: Math.max(radius * 1.3, distance * 0.4),
    maxDistance: distance * 4,
    // No panning: the body stays centred and rotating always circles it.
    allowPan: false,
  }
}

/**
 * Owns the camera: flies to the right spot whenever the view or the selected
 * body changes, then applies the zoom limits and gestures of that view.
 */
export function CameraRig() {
  const controls = useRef<CameraControlsImpl>(null)
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const viewMode = useAppStore((s) => s.viewMode)
  const selectedBodyId = useAppStore((s) => s.selectedBodyId)
  // Increments on every new flight so an old flight that finishes late
  // can't apply its limits on top of the current one.
  const flightId = useRef(0)

  useEffect(() => {
    const c = controls.current
    if (!c) return
    const id = ++flightId.current
    // Aspect is read here instead of subscribed to: rotating the phone
    // shouldn't yank the camera away from where the user left it.
    const shot = planShot(viewMode, selectedBodyId, camera.fov, camera.aspect)

    // Loose limits during the flight; tight ones would make the camera snap
    // to them instead of gliding.
    c.minDistance = 0
    c.maxDistance = Infinity
    c.mouseButtons.right = shot.allowPan ? ACTION.TRUCK : ACTION.NONE
    c.touches.two = shot.allowPan ? ACTION.TOUCH_DOLLY_TRUCK : ACTION.TOUCH_DOLLY
    c.touches.three = shot.allowPan ? ACTION.TOUCH_TRUCK : ACTION.NONE

    const position = shot.direction.clone().multiplyScalar(shot.distance).add(shot.target)
    // Resolves when the flight ends (or the user interrupts it by dragging).
    void c
      .setLookAt(position.x, position.y, position.z, shot.target.x, shot.target.y, shot.target.z, true)
      .then(() => {
        if (id !== flightId.current) return
        c.minDistance = shot.minDistance
        c.maxDistance = shot.maxDistance
      })
  }, [viewMode, selectedBodyId, camera])

  return (
    <CameraControls
      ref={controls}
      makeDefault
      // Longer smoothing for flights between bodies, short while dragging so
      // touch still feels direct.
      smoothTime={0.6}
      draggingSmoothTime={0.15}
    />
  )
}
