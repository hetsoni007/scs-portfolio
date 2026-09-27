// Transient values read every frame by the 3D stage and HUD. Deliberately NOT in
// React state: they change 60+ times a second and nothing should re-render on them.

export const live = {
  pointer: { x: 0, y: 0, nx: 0, ny: 0, moved: false },
  scroll: { y: 0, v: 0, p: 0, max: 1 },
  /** Device tilt, normalised to -1..1 (gamma → x, beta → y). */
  tilt: { x: 0, y: 0, active: false },
  vw: 1280,
  vh: 800,
  /** Continuous page → scene values (scroll progress through a section, etc.). */
  chan: {} as Record<string, number>,
}

let started = false

export function startLive() {
  if (started || typeof window === 'undefined') return
  started = true
  const size = () => {
    live.vw = window.innerWidth
    live.vh = window.innerHeight
  }
  size()
  window.addEventListener('resize', size, { passive: true })
  window.addEventListener(
    'pointermove',
    (e) => {
      live.pointer.x = e.clientX
      live.pointer.y = e.clientY
      live.pointer.nx = (e.clientX / live.vw) * 2 - 1
      live.pointer.ny = -((e.clientY / live.vh) * 2 - 1)
      live.pointer.moved = true
    },
    { passive: true },
  )
}

/** Called from the GSAP ticker (see motion.ts) so it stays in step with Lenis. */
export function sampleScroll() {
  const y = window.scrollY
  const max = Math.max(1, document.documentElement.scrollHeight - live.vh)
  live.scroll.v = y - live.scroll.y
  live.scroll.y = y
  live.scroll.max = max
  live.scroll.p = Math.min(1, Math.max(0, y / max))
}

/**
 * Where a DOM section sits relative to the viewport, for scroll-driven scenes.
 * 0 = section top at the viewport centre line, 1 = section bottom at the centre line.
 */
export function sectionProgress(el: Element | null): number {
  if (!el) return 0
  const r = el.getBoundingClientRect()
  const mid = live.vh * 0.5
  return (mid - r.top) / Math.max(1, r.height)
}

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
