// Cursor, film grain, bottom bar (sound + triad), tilt permission chip.
import { Fragment, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { live } from '../../lib/live'
import { gsap } from '../../lib/motion'
import { sound } from '../../lib/sound'
import { requestTilt, tiltNeedsPermission } from '../../lib/tilt'
import { labelFor } from '../../routes'
import { useStore } from '../../state/store'
import { Plus } from '../ui/Type'

/* ── Cursor: a red point with a lagging ember glow that labels itself ── */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null)
  const x = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')
  const reduced = useStore((s) => s.reduced)
  const [on] = useState(() => typeof window !== 'undefined' && matchMedia('(hover: hover) and (pointer: fine)').matches)

  useEffect(() => {
    if (!on) return
    document.documentElement.classList.add('has-cursor')
    const el = root.current!
    const rx = gsap.quickTo(ring.current, 'x', { duration: reduced ? 0.01 : 0.38, ease: 'power3.out' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: reduced ? 0.01 : 0.38, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      gsap.set(x.current, { x: e.clientX, y: e.clientY })
      rx(e.clientX)
      ry(e.clientY)
      const t = e.target as Element | null
      const text = t?.closest('input, textarea, select, [contenteditable]')
      // DOM elements label the cursor with data-cursor; 3D objects set it on <html>.
      const lab = t?.closest<HTMLElement>('[data-cursor]')?.dataset.cursor || document.documentElement.dataset.cursor || ''
      const hot = t?.closest('a, button, label, summary, [role="button"]')
      el.classList.toggle('is-hidden', !!text)
      el.classList.toggle('is-label', !!lab)
      el.classList.toggle('is-hover', !!hot && !lab)
      setLabel(lab)
    }
    const down = () => el.classList.add('is-down')
    const up = () => el.classList.remove('is-down')
    const leave = () => el.classList.add('is-hidden')
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointerup', up)
    document.addEventListener('pointerleave', leave)
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointerup', up)
      document.removeEventListener('pointerleave', leave)
    }
  }, [on, reduced])

  if (!on) return null
  return (
    <div className="cursor is-hidden" ref={root} aria-hidden="true">
      <div className="cursor__ring" ref={ring}>
        <span>
          <b>{label.toUpperCase()}</b>
        </span>
      </div>
      <div className="cursor__x" ref={x} />
    </div>
  )
}

/* ── Film grain: a noise tile generated once at runtime ── */
export function Grain() {
  const [src, setSrc] = useState<string | null>(null)
  useEffect(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 160
    const ctx = c.getContext('2d')
    if (!ctx) return
    const img = ctx.createImageData(160, 160)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = Math.random() * 255
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    ctx.putImageData(img, 0, 0)
    setSrc(c.toDataURL('image/png'))
  }, [])
  if (!src) return null
  return <div className="grain" aria-hidden="true" style={{ backgroundImage: `url(${src})` }} />
}

/* ── Sound: a waveform that is also the switch ──────────── */
export function SoundToggle() {
  const [on, setOn] = useState(sound.on)
  const bars = useRef<HTMLSpanElement>(null)
  const reduced = useStore((s) => s.reduced)
  useEffect(() => sound.subscribe(setOn), [])
  useEffect(() => {
    const els = Array.from(bars.current?.children ?? []) as HTMLElement[]
    const data = new Uint8Array(32)
    const tick = () => {
      const an = sound.analyser
      const live = sound.on && an
      if (live) an.getByteFrequencyData(data)
      const t = performance.now() / 1000
      els.forEach((el, i) => {
        const v = live ? 0.14 + (data[(i * 3) % 24] / 255) * 0.86 : reduced ? 0.22 : 0.16 + 0.12 * Math.abs(Math.sin(t * 1.4 + i * 0.55))
        el.style.transform = `scaleY(${v.toFixed(3)})`
      })
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [reduced])
  return (
    <button
      type="button"
      className={`wave ${on ? 'is-on' : ''}`}
      aria-pressed={on}
      aria-label="Ambient sound"
      data-cursor={on ? 'mute' : 'sound'}
      onClick={() => sound.toggle()}
    >
      <span className="wave__bars" ref={bars} aria-hidden="true">
        {Array.from({ length: 18 }, (_, i) => (
          <i key={i} />
        ))}
      </span>
    </button>
  )
}

/* ── Bottom bar: sound · + DESIGN + BUILD + SHIP + · route/section/% ── */
const TRIAD = ['Design', 'Build', 'Ship'] as const

export function Hud() {
  const { pathname } = useLocation()
  const section = useStore((s) => s.section)
  const pct = useRef<HTMLSpanElement>(null)
  const words = useRef<(HTMLSpanElement | null)[]>([])
  useEffect(() => {
    let last = -1
    let lastW = -1
    const tick = () => {
      const p = Math.round(live.scroll.p * 100)
      if (p === last) return
      last = p
      if (pct.current) pct.current.textContent = `${p}%`
      const w = Math.min(TRIAD.length - 1, Math.floor(live.scroll.p * TRIAD.length))
      if (w !== lastW) {
        words.current.forEach((el, i) => el?.classList.toggle('is-on', i === w))
        lastW = w
      }
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [])
  return (
    <div className="hud">
      <SoundToggle />
      <p className="hud__triad" aria-hidden="true">
        <Plus />
        {TRIAD.map((t, i) => (
          <Fragment key={t}>
            <span
              ref={(el) => {
                words.current[i] = el
              }}
            >
              {t}
            </span>
            <Plus />
          </Fragment>
        ))}
      </p>
      <p className="hud__where" aria-hidden="true">
        <span className="hud__route">{labelFor(pathname)}</span>
        <span>
          {String(section.index + 1).padStart(2, '0')} {section.label}
        </span>
        <span className="hud__pct" ref={pct}>
          0%
        </span>
      </p>
    </div>
  )
}

/* ── iOS motion permission (tilt is the mobile interaction) ── */
export function TiltChip() {
  const tiltOn = useStore((s) => s.tiltOn)
  const tier = useStore((s) => s.tier)
  const reduced = useStore((s) => s.reduced)
  const [ask] = useState(() => typeof window !== 'undefined' && matchMedia('(pointer: coarse)').matches && tiltNeedsPermission())
  const [dismissed, setDismissed] = useState(false)
  if (!ask || tiltOn || dismissed || tier === 'off' || reduced) return null
  return (
    <button
      type="button"
      className="tilt-chip"
      onClick={async () => {
        const ok = await requestTilt()
        if (!ok) setDismissed(true)
      }}
    >
      <Plus className="t-sig" />
      Tilt to explore
    </button>
  )
}
