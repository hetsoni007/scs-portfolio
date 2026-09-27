import type { ReactNode } from 'react'

/** Heading split into masked lines for the rise-in reveal. The last line of a
 *  multi-line title is set in Ruthie script, which is the site's emphasis voice. */
export function Title({
  lines,
  as: Tag = 'h2',
  className = 't-h2',
  emLast = true,
  id,
}: {
  lines: string | readonly string[]
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'div'
  className?: string
  emLast?: boolean
  id?: string
}) {
  const arr = typeof lines === 'string' ? [lines] : lines
  return (
    <Tag className={className} data-split id={id}>
      {arr.map((l, i) => (
        <span className="line-mask" key={i}>
          <span className="line-in">{emLast && arr.length > 1 && i === arr.length - 1 ? <em>{l}</em> : l}</span>
          {i < arr.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  )
}

/** The plus mark: the site's separator, cursor-crosshair and corner glyph. */
export function Plus({ className = '' }: { className?: string }) {
  return (
    <svg className={`plus ${className}`} width="11" height="11" viewBox="0 0 11 11" aria-hidden="true" focusable="false">
      <path d="M5 0h1v5h5v1H6v5H5V6H0V5h5z" fill="currentColor" />
    </svg>
  )
}

/** + 03  HOW WE WORK ──────── (the rule draws itself on reveal) */
export function SectionLabel({ n, children }: { n?: string; children: ReactNode }) {
  return (
    <div className="slabel t-label" data-reveal>
      <Plus className="slabel__mark" />
      {n ? <span className="slabel__n">{n}</span> : null}
      <span>{children}</span>
      <svg className="slabel__rule" aria-hidden="true" preserveAspectRatio="none" viewBox="0 0 100 1" data-draw>
        <line x1="0" y1="0.5" x2="100" y2="0.5" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  )
}

export function Chips({ items, live, concept }: { items: readonly string[]; live?: string; concept?: string }) {
  return (
    <div className="chips">
      {items.map((c) => (
        <span className="chip" key={c}>
          {c}
        </span>
      ))}
      {live ? <span className="chip chip--live">{live}</span> : null}
      {concept ? <span className="chip chip--concept">{concept}</span> : null}
    </div>
  )
}

/** A dimension line: ├──── label ────┤ (drawn in SVG, draws itself on reveal). */
export function Dim({ label, className = '' }: { label?: string; className?: string }) {
  return (
    <div className={`dim ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" data-draw>
        <line x1="0" y1="1" x2="0" y2="9" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="5" x2="100" y2="5" vectorEffect="non-scaling-stroke" />
        <line x1="100" y1="1" x2="100" y2="9" vectorEffect="non-scaling-stroke" />
      </svg>
      {label ? <span className="t-label dim__l">{label}</span> : null}
    </div>
  )
}
