import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

/**
 * Generates the PNG icons from public/favicon.svg (`npm run icons`).
 * Run once when the logo changes; the PNGs are committed, so the build
 * doesn't depend on the image library being installable everywhere.
 */
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    // Maskable icons get cropped to a circle or squircle by Android: the
    // logo has to sit inside the central "safe zone", padded with the
    // app's background colour so the crop never shows a white edge.
    maskable: {
      ...minimal2023Preset.maskable,
      resizeOptions: { background: '#05070d' },
    },
    // iOS draws a white background behind transparent pixels.
    apple: {
      ...minimal2023Preset.apple,
      resizeOptions: { background: '#05070d' },
    },
  },
  images: ['public/favicon.svg'],
})
