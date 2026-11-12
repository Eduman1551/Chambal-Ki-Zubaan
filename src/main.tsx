import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Fonts are bundled (not fetched from a CDN) so the site works offline in class.
import '@fontsource/baloo-2/latin-600.css'
import '@fontsource/baloo-2/latin-800.css'
import '@fontsource/nunito/latin-500.css'
import '@fontsource/nunito/latin-700.css'
import '@fontsource/baloo-2/devanagari-600.css'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
