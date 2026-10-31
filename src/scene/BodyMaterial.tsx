import { Suspense } from 'react'
import type { CelestialBody } from '../data/bodies'
import { FallbackBoundary } from './FallbackBoundary'
import { useBodyTexture } from './useBodyTexture'

interface Props {
  body: CelestialBody
}

/**
 * Material for a body's sphere: solid fallback color first, swapped for the
 * texture once it arrives. Lambert instead of Standard (PBR) material: rocky
 * and gaseous bodies don't need reflections, and Lambert is much cheaper
 * per pixel on mobile GPUs.
 */
export function BodyMaterial({ body }: Props) {
  const isStar = body.type === 'star'
  const fallback = isStar ? (
    <meshBasicMaterial color={body.fallbackColor} toneMapped={false} />
  ) : (
    <meshLambertMaterial color={body.fallbackColor} />
  )

  if (!body.texture) return fallback

  return (
    <FallbackBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <TexturedMaterial file={body.texture} isStar={isStar} />
      </Suspense>
    </FallbackBoundary>
  )
}

function TexturedMaterial({ file, isStar }: { file: string; isStar: boolean }) {
  const map = useBodyTexture(file)
  // The Sun is its own light source: an unlit (basic) material keeps it fully
  // bright on every side, which reads as emissive without any bloom pass.
  return isStar ? (
    <meshBasicMaterial map={map} toneMapped={false} />
  ) : (
    <meshLambertMaterial map={map} />
  )
}
