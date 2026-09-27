// The one DOM motion engine: GSAP + ScrollTrigger, with Lenis inertia scroll
// ticked from gsap.ticker so scroll, triggers and the HUD share a single clock.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { sampleScroll } from './live'

gsap.registerPlugin(ScrollTrigger)
gsap.defaults({ ease: 'expo.out', duration: 0.8 })

let lenis: Lenis | null = null

export function startMotion(reduced: boolean) {
  gsap.ticker.add(sampleScroll)
  if (reduced) return
  lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.95, touchMultiplier: 1.4, autoRaf: false })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate, force: true })
  else window.scrollTo({ top: 0, behavior: immediate ? 'auto' : 'smooth' })
}

export function scrollToTarget(target: string | HTMLElement, offset = -80) {
  const el = typeof target === 'string' ? document.querySelector<HTMLElement>(target) : target
  if (!el) return
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.4 })
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: 'smooth' })
  // Move focus for keyboard and screen-reader users without a second jump.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1')
  el.focus({ preventScroll: true })
}

export function lockScroll(locked: boolean) {
  if (lenis) (locked ? lenis.stop() : lenis.start())
  document.documentElement.style.overflow = locked ? 'hidden' : ''
}

export { gsap, ScrollTrigger }

// Dev-only handle for debugging timelines/triggers from the console.
if (import.meta.env.DEV) Object.assign(window, { __gsap: gsap, __ST: ScrollTrigger })
