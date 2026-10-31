import { useTexture } from '@react-three/drei'
import { SRGBColorSpace, type Texture } from 'three'

/**
 * Loads a texture from /public/textures. Suspends while loading (so the
 * caller's <Suspense> shows the fallback color) and throws on failure (so
 * <FallbackBoundary> can keep the fallback color).
 */
export function useBodyTexture(fileName: string): Texture {
  return useTexture(`${import.meta.env.BASE_URL}textures/${fileName}`, (texture) => {
    // Photos are stored in sRGB; without this they render washed out.
    texture.colorSpace = SRGBColorSpace
  })
}
