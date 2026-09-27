import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { startLive } from './lib/live'
import { startMotion } from './lib/motion'
import { detectTier } from './lib/quality'
import { autoTilt } from './lib/tilt'
import { useStore, type Theme } from './state/store'
import './styles/tokens.css'
import './styles/base.css'
import './styles/components.css'
import './styles/shell.css'
import './styles/pages.css'

// Environment is decided once, before the first render.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const mobile = matchMedia('(max-width: 899px), (pointer: coarse)').matches
const theme = (document.documentElement.getAttribute('data-theme') as Theme) ?? 'dark'
const tier = detectTier()
useStore.setState({ reduced, mobile, theme, tier })
document.documentElement.classList.toggle('no-stage', tier === 'off')

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
startLive()
startMotion(reduced)
autoTilt()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
