import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Vector3, type Group, type PerspectiveCamera } from 'three'
import type { BodyId, CelestialBody } from '../data/bodies'
import { useAppStore } from '../store/useAppStore'
import { projectedRadiusPx } from '../utils/cameraFraming'
import styles from './BodyLabel.module.css'
import { StableHtml } from './StableHtml'

/**
 * On-screen radius (px) below which a body counts as "too small": at ~12 px
 * across, a sphere reads as a dot, its texture is unrecognisable and it is
 * far below the 44 px a finger needs.
 */
const SHOW_BELOW_PX = 6
/**
 * The label hides again only above this, not as soon as it crosses 6 px.
 * Without the gap, a body hovering right at the limit (slow zoom, the
 * camera easing in) would make the label flicker on and off every frame.
 */
const HIDE_ABOVE_PX = 9

interface Props {
  body: CelestialBody
  radius: number
  /**
   * Show the label whatever the body's size (system view: every body gets
   * its name). Otherwise only when the body is too small to tap (PB07).
   */
  always?: boolean
}

/**
 * Floating button above a body (PB07). Lives inside the body's group, so
 * it moves with the body (orbits included).
 *
 * The size check runs every frame, but it never touches React state: the
 * result is written straight to the button's `hidden` attribute through a
 * ref, and only when it changes. React therefore doesn't re-render anything
 * while the camera or the planets move; drei's <Html> also moves the label
 * by writing a CSS transform directly, outside React.
 */
export function BodyLabel({ body, radius, always = false }: Props) {
  const goToBody = useAppStore((s) => s.goToBody)
  const anchor = useRef<Group>(null)
  const button = useRef<HTMLButtonElement>(null)
  const shown = useRef(false)
  // Allocated once and refilled every frame: creating a Vector3 per frame
  // would feed the garbage collector, whose pauses show up as stutters on
  // phones.
  const center = useMemo(() => new Vector3(), [])

  useFrame(({ camera, size }) => {
    const element = button.current
    if (!anchor.current || !element) return
    let next = true
    if (!always) {
      // World position, because the parent group may be orbiting. It was
      // already moved this frame (see ORBIT_FRAME_PRIORITY).
      anchor.current.getWorldPosition(center)
      const px = projectedRadiusPx(
        radius,
        camera.position.distanceTo(center),
        (camera as PerspectiveCamera).fov,
        size.height,
      )
      next = shown.current ? px < HIDE_ABOVE_PX : px < SHOW_BELOW_PX
    }
    if (next === shown.current) return
    shown.current = next
    // `hidden` also removes it from Tab order and screen readers, so
    // invisible labels can't be focused.
    element.hidden = !next
  })

  return (
    <group ref={anchor}>
      {/* Anchored at the top of the body; CSS lifts the button above that point. */}
      <StableHtml position={[0, radius, 0]} zIndexRange={[2, 0]}>
        {/*
          Starts hidden; from then on only useFrame changes it. React won't
          overwrite it on re-render because the `hidden` prop never changes.
        */}
        <button
          ref={button}
          type="button"
          className={styles.label}
          hidden
          onClick={() => goToBody(body.id as BodyId)}
        >
          {body.name}
        </button>
      </StableHtml>
    </group>
  )
}
