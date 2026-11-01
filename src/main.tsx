import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled locally (no CDN), only the weights actually used.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import './styles/theme.css'
import App from './App.tsx'
import { useAppStore } from './store/useAppStore'

// Dev-only handle to drive the app from the browser console, e.g.
// `sss.getState().goToBody('saturn')`. Stripped from production builds.
if (import.meta.env.DEV) {
  Object.assign(window, { sss: useAppStore })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
