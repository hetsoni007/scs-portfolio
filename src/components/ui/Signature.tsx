// Signature pieces of the red-and-black system (DESIGN.md §5): the sigil line art,
// the scroll-driven script band and the rotating ring link.
import { useEffect, useId, useRef } from 'react'
import { CALENDLY } from '../../content/site'
import { gsap } from '../../lib/motion'
import { useStore } from '../../state/store'
import { Plus } from './Type'

/** Sacred-geometry hairlines in blood red: corner diagonals, a crosshair, a square
 *  and a diamond. Decorative, drawn in on reveal, sized to cover its section. */
export function Sigil({ className = '' }: { className?: string }) {
  return (
    <svg className={`sigil ${className}`} viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false" data-draw>
      <line x1="0" y1="0" x2="1000" y2="1000" />
      <line x1="1000" y1="0" x2="0" y2="1000" />
      <line x1="0" y1="500" x2="1000" y2="500" />
      <line className="sigil__soft" x1="500" y1="0" x2="500" y2="1000" />
      <path d="M250 250H750V750H250Z" />
      <path d="M500 110L890 500L500 890L110 500Z" />
      <path className="sigil__soft" d="M250 250L500 890L750 250" />
      <path className="sigil__soft" d="M250 750L500 110L750 750" />
    </svg>
  )
}

/** A line of script that drifts sideways as the page scrolls. */
export function ScriptBand({ text, repeat = 4 }: { text: string; repeat?: number }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const reduced = useStore((s) => s.reduced)
  useEffect(() => {
    if (reduced || !root.current || !track.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        track.current,
        { xPercent: 0 },
        { xPercent: -30, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: 0.6 } },
      )
    }, root)
    return () => ctx.revert()
  }, [reduced])
  return (
    <div className="sband" ref={root}>
      <p className="sr-only">{text}</p>
      <div className="sband__track" ref={track} aria-hidden="true">
        {Array.from({ length: repeat }, (_, i) => (
          <span className={`sband__item ${i % 2 ? 'is-red' : ''}`} key={i}>
            {text}
            <Plus className="sband__plus" />
          </span>
        ))}
      </div>
    </div>
  )
}

/** A circular text ring that turns slowly: a second way into the booking link. */
export function Ring({ label = 'Book a call', href = CALENDLY }: { label?: string; href?: string }) {
  const text = `${label} + `.repeat(3)
  const id = `ring-${useId().replace(/:/g, '')}`
  return (
    <a className="ring" href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} (opens in a new tab)`} data-cursor="book">
      <svg viewBox="0 0 200 200" aria-hidden="true" focusable="false">
        <defs>
          <path id={id} d="M100 100m-78 0a78 78 0 1 1 156 0a78 78 0 1 1-156 0" />
        </defs>
        <circle className="ring__o" cx="100" cy="100" r="96" />
        <circle className="ring__i" cx="100" cy="100" r="58" />
        <text className="ring__text">
          <textPath href={`#${id}`} textLength="486" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <span className="ring__c" aria-hidden="true">
        <Plus />
      </span>
    </a>
  )
}
