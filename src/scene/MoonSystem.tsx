import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Vector3, type Group } from 'three'
import { moon } from '../data/moon'
import labelStyles from './BodyLabel.module.css'
import { BodyMaterial } from './BodyMaterial'
import { orbitLineMaterial, unitCircle, unitSphere } from './geometries'
import { moonAngle, writeCirclePoint } from './orbits'
import { ORBIT_FRAME_PRIORITY } from './PlacedGroup'
import { StableHtml } from './StableHtml'
import { moonLayoutFor } from './systemLayout'

/**
 * The tag appears only once the Moon is this far from Earth on screen
 * (px), and hides again below the second value (the gap avoids flicker).
 * Closer than that the "Lua" tag would sit on top of the "Terra" one.
 */
const SHOW_APART_PX = 48
const HIDE_APART_PX = 36

/**
 * Earth's Moon with its orbit line. Mounted inside Earth's group, so it
 * follows Earth around the Sun with no extra work: its own position is
 * relative to Earth.
 */
export function MoonSystem({ realScale }: { realScale: boolean }) {
  const { orbitRadius, radius } = moonLayoutFor(realScale)
  const origin = useRef<Group>(null)
  const body = useRef<Group>(null)
  const tag = useRef<HTMLSpanElement>(null)
  const shown = useRef(false)
  // Allocated once, refilled every frame (no garbage in the loop).
  const earthOnScreen = useMemo(() => new Vector3(), [])
  const moonOnScreen = useMemo(() => new Vector3(), [])

  useFrame(() => {
    if (!body.current) return
    const angle = moonAngle()
    writeCirclePoint(angle, orbitRadius, body.current.position)
    // Tidal locking: turning exactly once per orbit keeps the same face
    // toward Earth, as the real Moon does. +π because a sphere's texture is
    // centred on +X and the near side has to face -X (toward Earth).
    body.current.rotation.y = angle + Math.PI
  }, ORBIT_FRAME_PRIORITY)

  useFrame(({ camera, size }) => {
    if (!origin.current || !body.current || !tag.current) return
    // Both centres projected to the screen (-1…1), then converted to pixels.
    origin.current.getWorldPosition(earthOnScreen).project(camera)
    body.current.getWorldPosition(moonOnScreen).project(camera)
    const apart = Math.hypot(
      ((moonOnScreen.x - earthOnScreen.x) * size.width) / 2,
      ((moonOnScreen.y - earthOnScreen.y) * size.height) / 2,
    )
    const next = shown.current ? apart > HIDE_APART_PX : apart > SHOW_APART_PX
    if (next === shown.current) return
    shown.current = next
    tag.current.hidden = !next
  })

  return (
    <group ref={origin}>
      <lineLoop geometry={unitCircle} material={orbitLineMaterial} scale={orbitRadius} />
      <group ref={body}>
        <mesh geometry={unitSphere} scale={radius}>
          <BodyMaterial body={moon} />
        </mesh>
        <StableHtml position={[0, radius, 0]} zIndexRange={[2, 0]}>
          {/* A tag, not a button: the Moon isn't one of the selectable
              bodies (it stays out of the list and the panel). */}
          <span ref={tag} className={`${labelStyles.label} ${labelStyles.tag}`} hidden>
            {moon.name}
          </span>
        </StableHtml>
      </group>
    </group>
  )
}
