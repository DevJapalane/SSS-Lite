/**
 * Tiny copies of the body textures for the body list (`npm run thumbs`).
 *
 * The list shows each body as a ~22px sphere. Using the full textures there
 * would download ~1 MB as soon as the app opens; these thumbnails are
 * 1–3 KB each. 96×48 keeps the 2:1 texture shape and stays sharp on 2x and
 * 3x phone screens. Run again whenever a texture in public/textures changes.
 */
import { mkdir, readdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const source = fileURLToPath(new URL('../public/textures/', import.meta.url))
const target = fileURLToPath(new URL('../public/textures/thumbs/', import.meta.url))

await mkdir(target, { recursive: true })
const files = (await readdir(source)).filter(
  // Ring strips aren't bodies: nothing to show in the list.
  (name) => name.endsWith('.webp') && !name.includes('ring'),
)

for (const name of files) {
  const info = await sharp(source + name)
    .resize(96, 48)
    .webp({ quality: 70 })
    .toFile(target + name)
  console.log(`${name}: ${info.size} bytes`)
}
