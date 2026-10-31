import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled locally (no CDN), only the weights actually used.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import './styles/theme.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
