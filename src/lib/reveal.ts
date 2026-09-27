// Scroll reveals (DESIGN.md §6). Declarative data attributes, one GSAP context
// per page, fully reverted on unmount so route changes never leak triggers.
//   [data-split]   heading lines rise out of their masks
//   [data-reveal]  fade + lift
//   [data-draw]    SVG hairlines draw left → right
//   [data-count]   numerals count up (tabular, decimals from data-dec)
import { gsap, ScrollTrigger } from './motion'

const START = 'top 88%'

/** Hide everything that will animate. Runs before paint (layout effect). */
export function hideReveals(root: HTMLElement) {
  // Both y and yPercent are always set explicitly: after a StrictMode revert GSAP
  // would otherwise re-parse the computed matrix as a stray pixel `y` offset.
  root.querySelectorAll<HTMLElement>('[data-split] .line-in').forEach((el) => gsap.set(el, { y: 0, yPercent: 108 }))
  // opacity (not autoAlpha): hidden-but-focusable, so keyboard users can still tab ahead
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => gsap.set(el, { opacity: 0, y: 26 }))
  root.querySelectorAll<SVGElement>('[data-draw]').forEach((svg) => {
    svg.querySelectorAll<SVGGeometryElement>('line, path, polyline').forEach((p) => {
      const len = typeof p.getTotalLength === 'function' ? p.getTotalLength() || 100 : 100
      gsap.set(p, { strokeDasharray: len, strokeDashoffset: len })
    })
  })
}

/** Attach the triggers. Anything already in view plays immediately. */
export function playReveals(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    gsap.fromTo(el.querySelectorAll('.line-in'), { y: 0, yPercent: 108 }, {
      y: 0,
      yPercent: 0,
      duration: 0.95,
      stagger: 0.07,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: START, once: true },
    })
  })
  root.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.fromTo(el, { opacity: 0, y: 26 }, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      delay: Number(el.dataset.revealDelay ?? 0),
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: START, once: true },
    })
  })
  root.querySelectorAll<SVGElement>('[data-draw]').forEach((svg) => {
    gsap.to(svg.querySelectorAll('line, path, polyline'), {
      strokeDashoffset: 0,
      duration: 1.4,
      stagger: 0.06,
      ease: 'power3.inOut',
      scrollTrigger: { trigger: svg as unknown as Element, start: START, once: true },
    })
  })
  root.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
    const to = Number(el.dataset.count)
    const dec = Number(el.dataset.dec ?? 0)
    const o = { v: 0 }
    el.textContent = (0).toFixed(dec)
    gsap.to(o, {
      v: to,
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => (el.textContent = o.v.toFixed(dec)),
      scrollTrigger: { trigger: el, start: START, once: true },
    })
  })
  ScrollTrigger.refresh()
}

/** If focus lands inside content that hasn't been revealed yet, show it at once. */
export function revealOnFocus(root: HTMLElement) {
  const onFocus = (e: FocusEvent) => {
    const t = e.target as Element | null
    const block = t?.closest<HTMLElement>('[data-reveal]')
    if (block && Number(getComputedStyle(block).opacity) < 1) gsap.to(block, { opacity: 1, y: 0, duration: 0.2, overwrite: true })
    const split = t?.closest<HTMLElement>('[data-split]')
    if (split) gsap.to(split.querySelectorAll('.line-in'), { yPercent: 0, y: 0, duration: 0.2, overwrite: true })
  }
  root.addEventListener('focusin', onFocus)
  return () => root.removeEventListener('focusin', onFocus)
}
