import { useEffect, useRef } from 'react'
import { Fire } from '../../lib/fire'
import { gsap } from '../../lib/motion'
import { sound } from '../../lib/sound'
import { registerDomTransition } from '../../lib/transition'
import { labelFor } from '../../routes'

/**
 * DOM half of a route change: flames rise and cover the page in blood red while the
 * destination's name is written in script, then the red burns away from the bottom
 * to reveal the next page. The WebGL half runs in the stage (three/Stage.tsx).
 */
export function TransitionLayer() {
  const canvas = useRef<HTMLCanvasElement>(null)
  const label = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fire = new Fire(canvas.current!)
    const st = { upper: 1.25, lower: 1.25 }
    let raf = 0
    let running = false
    const t0 = performance.now()
    const loop = (now: number) => {
      fire.draw(st.upper, st.lower, (now - t0) / 1000)
      if (running) raf = requestAnimationFrame(loop)
    }
    const start = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(loop)
    }
    const stop = () => {
      running = false
      cancelAnimationFrame(raf)
      fire.clear()
    }
    const main = () => document.getElementById('main')

    registerDomTransition({
      out: (to) =>
        new Promise<void>((resolve) => {
          if (label.current) label.current.textContent = labelFor(to)
          st.upper = 1.25
          st.lower = 1.25
          start()
          sound.whoosh()
          gsap
            .timeline({ onComplete: resolve })
            .to(st, { upper: -0.04, duration: 0.85, ease: 'power2.in' }, 0)
            .to(main(), { autoAlpha: 0, duration: 0.45, ease: 'power1.in' }, 0.3)
            .fromTo(label.current, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.5)
        }),
      in: () =>
        new Promise<void>((resolve) => {
          const m = main()
          if (!running) {
            // Back/forward navigations skip the burn-out; just bring the page in.
            gsap.fromTo(m, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5, onComplete: resolve })
            return
          }
          gsap
            .timeline({
              onComplete: () => {
                stop()
                resolve()
              },
            })
            .set(m, { autoAlpha: 1 }, 0)
            .fromTo(m, { y: 36 }, { y: 0, duration: 1.2, ease: 'expo.out', clearProps: 'transform' }, 0.1)
            .to(label.current, { autoAlpha: 0, y: -28, duration: 0.4, ease: 'power2.in' }, 0)
            .to(st, { lower: -0.28, duration: 1.05, ease: 'power2.inOut' }, 0.08)
        }),
    })
    const onResize = () => fire.resize()
    window.addEventListener('resize', onResize)
    return () => {
      stop()
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <div className="xfer" aria-hidden="true">
      <canvas className="xfer__fire" ref={canvas} />
      <div className="xfer__label" ref={label} />
    </div>
  )
}
