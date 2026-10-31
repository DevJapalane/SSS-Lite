import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Mesh } from 'three'
import type { CelestialBody } from '../data/bodies'
import { axialTiltRad, spinSpeed } from '../utils/rotation'
import { BodyMaterial } from './BodyMaterial'
import { unitSphere } from './geometries'
import { PlanetRings } from './PlanetRings'
import { SunGlow } from './SunGlow'

interface Props {
  body: CelestialBody
  x: number
  radius: number
}

/**
 * Any body of the system, driven only by its data entry.
 *
 * Nesting: position group → tilt group → spinning sphere. Splitting tilt and
 * spin into separate objects means the spin always happens around the tilted
 * axis; rotating one object on two axes would wobble instead.
 */
export function CelestialBodyMesh({ body, x, radius }: Props) {
  const sphere = useRef<Mesh>(null)
  const speed = spinSpeed(body)

  useFrame((_, delta) => {
    // `delta` = seconds since the last frame, so the speed is the same at
    // 30 fps on a phone and 120 fps on a desktop.
    if (sphere.current) sphere.current.rotation.y += speed * delta
  })

  return (
    <group position-x={x}>
      {/*
        Tipping the north pole toward -X (the Sun's side) opens Saturn's rings
        toward the body-view camera; tipping the other way leaves them almost
        edge-on. Spin direction doesn't depend on this choice.
      */}
      <group rotation-z={axialTiltRad(body)}>
        <mesh ref={sphere} geometry={unitSphere} scale={radius}>
          <BodyMaterial body={body} />
        </mesh>
        {body.rings && (
          <group scale={radius}>
            <PlanetRings rings={body.rings} />
          </group>
        )}
      </group>
      {body.type === 'star' && <SunGlow radius={radius} />}
    </group>
  )
}
