import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Fire } from '../../lib/fire'
import { gsap } from '../../lib/motion'
import { sound } from '../../lib/sound'
import { BRAND } from '../../content/site'
import { useStore } from '../../state/store'

const KEY = 'scs3d-booted'

/**
 * The loader (DESIGN.md §8). First visit per session only, never under reduced motion.
 * A script counter runs 000→100 on blood red, then the red burns away from the bottom
 * to reveal the page. It never waits for input: a click just adds sound (a user
 * gesture is the only way a browser allows audio) and jumps to the burn. Esc skips.
 */
export function Boot() {
  const reduced = useStore((s) => s.reduced)
  const setBooted = useStore((s) => s.setBooted)
  const [show, setShow] = useState(() => {
    try {
      return !reduced && !sessionStorage.getItem(KEY)
    } catch {
      return !reduced
    }
  })
  const root = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const pct = useRef<HTMLSpanElement>(null)
  const skip = useRef<() => void>(() => {})

  useLayoutEffect(() => {
    if (!show) {
      setBooted()
      return
    }
    const fire = new Fire(canvas.current!)
    const st = { upper: -0.03, lower: 1.25 }
    const t0 = performance.now()
    let raf = 0
    const loop = (now: number) => {
      fire.draw(st.upper, st.lower, (now - t0) / 1000)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const done = () => {
      try {
        sessionStorage.setItem(KEY, '1')
      } catch {
        /* ignore */
      }
      setShow(false)
    }
    let burning = false
    const burn = () => {
      if (burning) return
      burning = true
      count.kill()
      if (pct.current) pct.current.textContent = '100'
      setBooted()
      root.current?.classList.add('is-burning')
      sound.whoosh()
      gsap.to(st, { lower: -0.28, duration: 1.1, ease: 'power2.inOut', onComplete: done })
    }
    const counter = { v: 0 }
    const count = gsap.timeline()
    count.to(counter, {
      v: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (pct.current) pct.current.textContent = String(Math.round(counter.v)).padStart(3, '0')
      },
    })
    count.add(burn, '+=0.25')
    skip.current = burn
    const onResize = () => fire.resize()
    window.addEventListener('resize', onResize)
    return () => {
      cancelAnimationFrame(raf)
      count.kill()
      gsap.killTweensOf(st)
      window.removeEventListener('resize', onResize)
    }
  }, [show, setBooted])

  useEffect(() => {
    if (!show) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip.current()
    }
    const onClick = () => {
      sound.start()
      skip.current()
    }
    const el = root.current
    window.addEventListener('keydown', onKey)
    el?.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('keydown', onKey)
      el?.removeEventListener('click', onClick)
    }
  }, [show])

  if (!show) return null
  return (
    <div className="boot" ref={root} role="status" aria-live="polite" aria-label="Loading">
      <canvas className="boot__fire" ref={canvas} aria-hidden="true" />
      <div className="boot__center" aria-hidden="true">
        <span className="boot__pct" ref={pct}>
          000
        </span>
      </div>
      <div className="boot__foot">
        <span className="t-label">{BRAND.name}</span>
        <button type="button" className="boot__skip t-label">
          Click anywhere for sound · Esc to skip
        </button>
      </div>
    </div>
  )
}
