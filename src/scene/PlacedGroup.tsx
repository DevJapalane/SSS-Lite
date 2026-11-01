import { useFrame } from '@react-three/fiber'
import { useRef, type ReactNode } from 'react'
import type { Group } from 'three'
import type { BodyId } from '../data/bodies'
import { writeOrbitPosition } from './orbits'
import type { PlacedBody } from './placement'

/**
 * Priority -1: runs before the default (0) frame callbacks, so the body
 * has already moved when its label (drei <Html> and the size check) reads
 * the position. With the default order the label would trail one frame
 * behind the planet and jitter.
 */
export const ORBIT_FRAME_PRIORITY = -1

interface Props {
  placed: PlacedBody
  children: ReactNode
}

/** Positions a body and everything attached to it (mesh, label, Moon). */
export function PlacedGroup({ placed, children }: Props) {
  const group = useRef<Group>(null)
  const { position } = placed

  useFrame(() => {
    // Mutates the existing Vector3: no object is created per frame.
    if (position.kind === 'orbit' && group.current) {
      writeOrbitPosition(placed.body.id as BodyId, position.radius, group.current.position)
    }
  }, ORBIT_FRAME_PRIORITY)

  return (
    <group ref={group} position-x={position.kind === 'fixed' ? position.x : 0}>
      {children}
    </group>
  )
}
