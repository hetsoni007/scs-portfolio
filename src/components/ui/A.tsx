import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Fragment } from 'react'

/** Anchor that opens off-site links in a new tab. Internal links are plain
 *  <a href> on purpose: the app intercepts them for the rebuild transition. */
export function A({ href, children, className, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; children: ReactNode }) {
  const external = /^https?:\/\//.test(href)
  return (
    <a
      href={href}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...rest}
    >
      {children}
    </a>
  )
}

/** Renders copy with inline `[label](href)` links, exactly as transcribed in content/. */
export function Rich({ text, linkClass = 'ink-link' }: { text: string; linkClass?: string }) {
  const parts: ReactNode[] = []
  const re = /\[([^\]]+)\]\(([^)]+)\)/g
  let last = 0
  let m: RegExpExecArray | null
  let i = 0
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(<Fragment key={i++}>{text.slice(last, m.index)}</Fragment>)
    parts.push(
      <A key={i++} href={m[2]} className={linkClass}>
        {m[1]}
      </A>,
    )
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(<Fragment key={i++}>{text.slice(last)}</Fragment>)
  return <>{parts}</>
}
