import { CameraControls, CameraControlsImpl } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import { PerspectiveCamera, Vector3 } from 'three'
import { getBodyById, type BodyId } from '../data/bodies'
import { useAppStore, type CompareSlot, type ViewMode } from '../store/useAppStore'
import { MOBILE_QUERY, useMediaQuery } from '../ui/useMediaQuery'
import { lineupFitDistance, sphereFitDistance } from '../utils/cameraFraming'
import { computeCompareLayout } from '../utils/scale'
import { orbitAngle, writeOrbitPosition } from './orbits'
import { sunRadius, systemLayout, systemRadius } from './systemLayout'

const { ACTION } = CameraControlsImpl
const UP = new Vector3(0, 1, 0)

// For a body at angle 0 (on +X, Sun at -X): looking slightly from the Sun's
// side shows mostly the lit hemisphere with the day/night line near the edge.
// Rotated by the body's orbit angle, it gives the same picture anywhere.
const BODY_VIEW_DIRECTION = new Vector3(-0.45, 0.25, 1).normalize()
// ~29° above the orbit plane: high enough to read the orbits as circles,
// low enough to still feel like looking at planets rather than a map.
const SYSTEM_VIEW_DIRECTION = new Vector3(0, 0.55, 1).normalize()
// Nearly head-on: seen from the side, perspective would make the nearer
// body look bigger and distort the real-scale comparison.
const COMPARE_VIEW_DIRECTION = new Vector3(0, 0.12, 1).normalize()

interface Shot {
  target: Vector3
  direction: Vector3
  distance: number
  minDistance: number
  maxDistance: number
  /** Whether dragging with two fingers / right button slides the view. */
  allowPan: boolean
}

function planShot(
  viewMode: ViewMode,
  bodyId: BodyId,
  compare: Record<CompareSlot, BodyId>,
  fov: number,
  aspect: number,
): Shot {
  if (viewMode === 'compare') {
    const layout = computeCompareLayout(getBodyById(compare.a), getBodyById(compare.b))
    const distance = lineupFitDistance(layout.width, layout.height, fov, aspect, 1.25)
    return {
      // The layout is centred on the origin.
      target: new Vector3(0, 0, 0),
      direction: COMPARE_VIEW_DIRECTION,
      distance,
      minDistance: distance * 0.25,
      maxDistance: distance * 3,
      allowPan: true,
    }
  }

  if (viewMode === 'system') {
    // The orbit disc seen from above at an angle: as wide as its diameter,
    // as tall as its foreshortened depth (plus the Sun sticking out of it).
    const elevation = Math.asin(SYSTEM_VIEW_DIRECTION.y)
    const width = 2 * systemRadius
    const height = width * Math.sin(elevation) + 2 * sunRadius
    const distance = lineupFitDistance(width, height, fov, aspect)
    return {
      target: new Vector3(0, 0, 0),
      direction: SYSTEM_VIEW_DIRECTION,
      distance,
      minDistance: 2,
      maxDistance: distance * 1.6,
      // Panning lets you slide to a corner of the system, essential on a
      // narrow phone.
      allowPan: true,
    }
  }

  // 'body': one body, centred, wherever its orbit left it.
  const body = getBodyById(bodyId)
  const { radius } = systemLayout[body.id]
  // Frame the rings too, otherwise Saturn's would be cut off.
  const distance = sphereFitDistance(radius * (body.rings?.outerRadiusRatio ?? 1), fov, aspect)
  return {
    target: writeOrbitPosition(bodyId, new Vector3()),
    direction: BODY_VIEW_DIRECTION.clone().applyAxisAngle(UP, orbitAngle(bodyId)),
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

interface SideInsets {
  left: number
  right: number
}

/** Pixels covered by the side panels, measured from the DOM. */
function measureSideInsets(viewportWidth: number): SideInsets {
  const left = document.querySelector('[data-occludes="left"]')?.getBoundingClientRect()
  const right = document.querySelector('[data-occludes="right"]')?.getBoundingClientRect()
  return {
    left: left ? left.right : 0,
    right: right ? viewportWidth - right.left : 0,
  }
}

/**
 * Owns the camera: flies to the right spot whenever the view or the selected
 * body changes, then applies the zoom limits and gestures of that view.
 */
export function CameraRig() {
  const controls = useRef<CameraControlsImpl>(null)
  const camera = useThree((s) => s.camera) as PerspectiveCamera
  const size = useThree((s) => s.size)
  // Reads the current R3F state without subscribing to it.
  const getState = useThree((s) => s.get)
  const viewMode = useAppStore((s) => s.viewMode)
  const selectedBodyId = useAppStore((s) => s.selectedBodyId)
  const compare = useAppStore((s) => s.compare)
  // On phones the panels sit at the bottom, so nothing covers the sides.
  const isMobile = useMediaQuery(MOBILE_QUERY)
  // Increments on every new flight so an old flight that finishes late
  // can't apply its limits on top of the current one.
  const flightId = useRef(0)
  const insets = useRef<SideInsets>({ left: 0, right: 0 })

  // Shift the rendered image so the scene is centred in the free space
  // between the side panels. setViewOffset moves the picture, not the
  // camera, so orbiting still circles the body instead of an empty point.
  useEffect(() => {
    insets.current = isMobile ? { left: 0, right: 0 } : measureSideInsets(size.width)
    const shift = (insets.current.left - insets.current.right) / 2
    if (shift === 0) camera.clearViewOffset()
    else camera.setViewOffset(size.width, size.height, -shift, 0, size.width, size.height)
  }, [camera, size.width, size.height, isMobile])

  useEffect(() => {
    const c = controls.current
    if (!c) return
    const id = ++flightId.current
    // Frame for the visible width only. Size is read with getState() instead
    // of being a dependency: rotating the phone shouldn't yank the camera
    // away from where the user left it.
    const { width, height } = getState().size
    const freeWidth = Math.max(width - insets.current.left - insets.current.right, width * 0.4)
    const shot = planShot(viewMode, selectedBodyId, compare, camera.fov, freeWidth / height)

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
  }, [viewMode, selectedBodyId, compare, camera, getState])

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
