import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Mark PWA standalone mode so the CSS can drop the simulated status bar and
// notch (real devices provide their own). Safari iOS uses navigator.standalone.
const isStandalone =
  window.matchMedia?.('(display-mode: standalone)').matches ||
  // @ts-expect-error - iOS Safari
  window.navigator.standalone === true
if (isStandalone) {
  document.body.classList.add('pwa-standalone')
}

// Register the PWA service worker (cache-first for the app shell, network for /api).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('Service worker registration failed:', err)
    })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
