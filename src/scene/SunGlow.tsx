import { useMemo } from 'react'
import { AdditiveBlending, CanvasTexture, SRGBColorSpace } from 'three'

/**
 * Soft halo around the Sun: a camera-facing sprite with a radial gradient,
 * drawn once into a small canvas. Gives the "glowing" look that a bloom
 * post-processing pass would, at the cost of a single quad.
 */
export function SunGlow({ radius }: { radius: number }) {
  const texture = useMemo(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    gradient.addColorStop(0, 'rgba(255, 210, 120, 0.9)')
    gradient.addColorStop(0.35, 'rgba(255, 170, 60, 0.35)')
    gradient.addColorStop(1, 'rgba(255, 140, 40, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, size, size)
    const result = new CanvasTexture(canvas)
    result.colorSpace = SRGBColorSpace
    return result
  }, [])

  return (
    <sprite scale={radius * 3.2}>
      <spriteMaterial
        map={texture}
        blending={AdditiveBlending}
        depthWrite={false}
        toneMapped={false}
      />
    </sprite>
  )
}
