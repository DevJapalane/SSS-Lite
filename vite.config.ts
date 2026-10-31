/// <reference types="vitest/config" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // The app is online-only: the service worker exists to make the app
      // installable and to cache the small app shell, not to work offline.
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg'],
      workbox: {
        // Textures are large and loaded on demand; precaching them would
        // force every visitor to download all of them up front.
        globIgnores: ['**/textures/**'],
      },
      manifest: {
        name: 'SSS Lite – Simulador do Sistema Solar',
        short_name: 'SSS Lite',
        description: 'Visualização 3D leve do Sistema Solar.',
        lang: 'pt-BR',
        start_url: '/',
        display: 'standalone',
        background_color: '#05070d',
        theme_color: '#05070d',
        icons: [
          { src: 'favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
  },
})
