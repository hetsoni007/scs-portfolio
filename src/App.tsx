import { Suspense, useEffect, useRef } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Boot } from './components/shell/Boot'
import { Footer } from './components/shell/Footer'
import { Nav } from './components/shell/Nav'
import { Cursor, Grain, Hud, TiltChip } from './components/shell/Overlays'
import { StageHost } from './components/shell/StageHost'
import { TransitionLayer } from './components/shell/Transition'
import { scrollToTarget } from './lib/motion'
import { arrived, bindNavigate, go, isInternal } from './lib/transition'
import { NotFound, ROUTES } from './routes'

/** Intercept same-origin <a href> clicks so every internal link gets the rebuild transition. */
function useLinkInterception() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest('a')
      if (!a) return
      const href = a.getAttribute('href')
      if (!href || a.target === '_blank' || a.hasAttribute('download')) return
      if (href.startsWith('#')) {
        e.preventDefault()
        scrollToTarget(href)
        return
      }
      if (!isInternal(href)) return
      e.preventDefault()
      go(href)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])
}

export default function App() {
  const location = useLocation()
  const navigate = useNavigate()
  const shown = useRef(location.pathname)
  bindNavigate(navigate)
  useLinkInterception()

  // First load: honour a deep-link hash. Later: run the arrival half of the rebuild.
  // Comparing against the last shown path keeps this correct under StrictMode's
  // double-invoked effects.
  useEffect(() => {
    if (location.pathname === shown.current) {
      if (location.hash) requestAnimationFrame(() => scrollToTarget(location.hash))
      return
    }
    shown.current = location.pathname
    arrived(location.hash)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <StageHost />
      <div className="app">
        <Nav />
        <main id="main" tabIndex={-1}>
          <Suspense fallback={<div style={{ minHeight: '100svh' }} />}>
            <Routes location={location}>
              {ROUTES.map(({ path, Page }) => (
                <Route key={path} path={path} element={<Page />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
      <Hud />
      <TiltChip />
      <TransitionLayer />
      <Cursor />
      <Grain />
      <Boot />
    </>
  )
}
