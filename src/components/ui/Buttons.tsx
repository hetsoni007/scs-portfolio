import { useEffect, useRef, type ReactNode } from 'react'
import { CALENDLY } from '../../content/site'
import { gsap } from '../../lib/motion'
import { useStore } from '../../state/store'

/** Pull an element toward the pointer when it comes near (fine pointers only). */
function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null)
  const reduced = useStore((s) => s.reduced)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced || !matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      const reach = Math.max(r.width, r.height) * 0.5 + 60
      if (Math.hypot(dx, dy) < reach) {
        xTo(dx * strength)
        yTo(dy * strength)
      } else {
        xTo(0)
        yTo(0)
      }
    }
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      gsap.set(el, { x: 0, y: 0 })
    }
  }, [reduced, strength])
  return ref
}

type BtnProps = {
  href?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  arrow?: boolean
  type?: 'button' | 'submit'
  disabled?: boolean
  onClick?: () => void
  className?: string
  cursor?: string
}

export function Btn({ href, children, size = 'md', arrow = true, type = 'button', disabled, onClick, className = '', cursor }: BtnProps) {
  const ref = useMagnetic<HTMLAnchorElement & HTMLButtonElement>()
  const cls = `btn btn--primary ${size === 'lg' ? 'btn--lg' : size === 'sm' ? 'btn--sm' : ''} ${className}`
  // Content labels already end in "→" on the live site; we render that arrow as a
  // separate animated glyph instead of doubling it.
  const label = typeof children === 'string' ? children.replace(/\s*→\s*$/, '') : children
  const inner = (
    <>
      <span>{label}</span>
      {arrow ? (
        <span className="btn__arrow" aria-hidden="true">
          →
        </span>
      ) : null}
    </>
  )
  if (href) {
    const external = /^https?:\/\//.test(href)
    return (
      <a ref={ref} href={href} className={cls} data-cursor={cursor} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref} type={type} className={cls} disabled={disabled} onClick={onClick} data-cursor={cursor}>
      {inner}
    </button>
  )
}

/** Calendly booking CTA (the site's single most important action). */
export function BookBtn({ children, size = 'lg' }: { children: ReactNode; size?: 'sm' | 'md' | 'lg' }) {
  return (
    <Btn href={CALENDLY} size={size}>
      {children}
    </Btn>
  )
}

export function Bracket({ href, children, size = 'md', onClick }: { href?: string; children: ReactNode; size?: 'md' | 'lg'; onClick?: () => void }) {
  const cls = `bracket ${size === 'lg' ? 'bracket--lg' : ''}`
  if (!href)
    return (
      <button type="button" className={cls} onClick={onClick} style={{ background: 'none', border: 0 }}>
        {children}
      </button>
    )
  const external = /^https?:\/\//.test(href)
  return (
    <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
      {children}
    </a>
  )
}
