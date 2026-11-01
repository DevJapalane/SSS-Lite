/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// Visual direction tokens (src/styles/theme.css): the splash screen and the
// status bar of the installed app use the same dark space colour.
const SPACE_COLOR = '#05070d'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Our own tiny worker (src/sw.ts) instead of a generated Workbox one:
      // the app is online-only, so there is nothing to precache.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      // No injection point = no precache manifest is written into the worker.
      injectManifest: { injectionPoint: undefined },
      registerType: 'autoUpdate',
      manifest: {
        name: 'SSS Lite – Simulador do Sistema Solar',
        short_name: 'SSS Lite',
        description: 'Visualização 3D leve do Sistema Solar: o Sol, os 8 planetas e Plutão.',
        lang: 'pt-BR',
        dir: 'ltr',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        background_color: SPACE_COLOR,
        theme_color: SPACE_COLOR,
        categories: ['education', 'science'],
        // Generated from public/favicon.svg by `npm run icons`.
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  build: {
    // three.js alone is ~600 KB minified, so Vite's generic 500 KB warning
    // would fire on every build. The project's own budget is 400 KB gzip
    // (checked in the final stage); this limit only keeps the build log
    // meaningful.
    chunkSizeWarningLimit: 1400,
  },
  test: {
    environment: 'node',
  },
})
