import { Suspense } from 'react'
import { DoubleSide } from 'three'
import type { Rings } from '../data/bodies'
import { FallbackBoundary } from './FallbackBoundary'
import { getRingGeometry } from './geometries'
import { useBodyTexture } from './useBodyTexture'

interface Props {
  rings: Rings
}

/** Rings in the planet's equatorial plane (the parent group carries the tilt). */
export function PlanetRings({ rings }: Props) {
  // No fallback: a plain colored disc would look wrong, so the rings simply
  // appear once their (tiny, ~5 KB) texture is loaded.
  return (
    <FallbackBoundary fallback={null}>
      <Suspense fallback={null}>
        <TexturedRings rings={rings} />
      </Suspense>
    </FallbackBoundary>
  )
}

function TexturedRings({ rings }: Props) {
  const map = useBodyTexture(rings.texture)
  return (
    <mesh
      geometry={getRingGeometry(rings.innerRadiusRatio, rings.outerRadiusRatio)}
      // RingGeometry is built in the XY plane; lay it flat on the equator.
      rotation-x={-Math.PI / 2}
    >
      <meshLambertMaterial
        map={map}
        transparent
        side={DoubleSide}
        // Transparent surfaces writing depth would hide parts of the planet
        // behind the ring gaps.
        depthWrite={false}
      />
    </mesh>
  )
}
