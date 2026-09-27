// Route "rebuild" controller (DESIGN.md §1). Internal link clicks are intercepted;
// the current page and scene decompile, the next route's chunks preload in
// parallel, then we navigate and the new page compiles in.
import type { NavigateFunction } from 'react-router-dom'
import { useStore } from '../state/store'
import { preloadRoute, sceneFor } from '../routes'
import { preloadScene } from '../three/registry'
import { scrollToTarget, scrollToTop } from './motion'

type Hooks = { out?: (to: string) => Promise<void>; in?: (from: string | null) => Promise<void> }
const domHooks: Hooks = {}
const stageHooks: Hooks = {}
let navigate: NavigateFunction | null = null
let lastPath: string | null = null

export const bindNavigate = (fn: NavigateFunction) => (navigate = fn)
export const registerDomTransition = (h: Hooks) => Object.assign(domHooks, h)
export const registerStageTransition = (h: Hooks) => Object.assign(stageHooks, h)

export function isInternal(href: string) {
  if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return false
  try {
    const u = new URL(href, location.href)
    return u.origin === location.origin
  } catch {
    return false
  }
}

export async function go(href: string) {
  const s = useStore.getState()
  const url = new URL(href, location.href)
  const samePage = url.pathname.replace(/\/?$/, '/') === location.pathname.replace(/\/?$/, '/')
  if (samePage) {
    if (url.hash) scrollToTarget(url.hash)
    else scrollToTop(false)
    return
  }
  if (s.phase !== 'idle' || !navigate) return
  s.setMenu(false)
  s.setPhase('out')
  const warm = Promise.all([preloadRoute(url.pathname), preloadScene(sceneFor(url.pathname))]).catch(() => {})
  await Promise.all([
    s.reduced ? Promise.resolve() : domHooks.out?.(url.pathname),
    s.reduced ? Promise.resolve() : stageHooks.out?.(url.pathname),
    warm,
  ])
  lastPath = location.pathname
  navigate(url.pathname + url.search + url.hash)
}

/** Called by the app after every location change (links, back/forward, first load). */
export async function arrived(hash: string) {
  const s = useStore.getState()
  if (hash) requestAnimationFrame(() => scrollToTarget(hash))
  else scrollToTop(true)
  s.setPhase('in')
  await Promise.all([domHooks.in?.(lastPath), stageHooks.in?.(lastPath)])
  useStore.getState().setPhase('idle')
}
