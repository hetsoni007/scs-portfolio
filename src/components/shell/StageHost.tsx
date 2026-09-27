import { lazy, Suspense, useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { sceneFor } from '../../routes'
import { useStore } from '../../state/store'
import { Poster } from '../../three/Poster'

const Stage = lazy(() => import('../../three/Stage'))

/**
 * Loads the WebGL stage after first paint, when the main thread is idle, so
 * three.js never competes with the page's own content for LCP. With no WebGL
 * ('off' tier) a static line-drawing poster stands in, so nothing is ever blank.
 */
export function StageHost() {
  const tier = useStore((s) => s.tier)
  const { pathname } = useLocation()
  const [go, setGo] = useState(false)

  useEffect(() => {
    if (tier === 'off') return
    const start = () => setGo(true)
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
    if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 1500 })
    else setTimeout(start, 400)
  }, [tier])

  if (tier === 'off') return <Poster scene={sceneFor(pathname)} />
  if (!go) return null
  return (
    <Suspense fallback={null}>
      <Stage />
    </Suspense>
  )
}
