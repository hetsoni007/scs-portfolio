import { useEffect, useLayoutEffect, useRef, type ReactNode, type RefObject } from 'react'
import { LIVE } from '../content/site'
import { gsap } from '../lib/motion'
import { hideReveals, playReveals, revealOnFocus } from '../lib/reveal'
import { useStore } from '../state/store'

function setMeta(sel: string, attr: string, value: string) {
  let el = document.head.querySelector<HTMLElement>(sel)
  if (!el) {
    const [tag, rest] = sel.split('[')
    el = document.createElement(tag)
    const m = rest?.match(/([\w:-]+)="([^"]+)"/)
    if (m) el.setAttribute(m[1], m[2])
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

/** Per-page title / description / canonical (copy verbatim from the live site). */
export function useMeta(title: string, description: string, path: string) {
  useEffect(() => {
    document.title = title
    setMeta('meta[name="description"]', 'content', description)
    setMeta('link[rel="canonical"]', 'href', LIVE + path)
    setMeta('meta[property="og:title"]', 'content', title)
    setMeta('meta[property="og:description"]', 'content', description)
  }, [title, description, path])
}

/** Tracks which [data-section] crosses the viewport centre line, for the HUD. */
function useSections(root: RefObject<HTMLElement | null>) {
  const setSection = useStore((s) => s.setSection)
  useEffect(() => {
    const el = root.current
    if (!el) return
    const nodes = Array.from(el.querySelectorAll<HTMLElement>('[data-section]'))
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          const t = e.target as HTMLElement
          setSection({ id: t.dataset.section ?? '', label: t.dataset.label ?? t.dataset.section ?? '', index: nodes.indexOf(t) })
        }
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [root, setSection])
}

export function Page({
  title,
  description,
  path,
  children,
  className = '',
}: {
  title: string
  description: string
  path: string
  children: ReactNode
  className?: string
}) {
  useMeta(title, description, path)
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useStore((s) => s.reduced)
  useSections(ref)

  // One context per mount: hide before first paint, then play once the boot
  // loader has handed over (immediately on later navigations). Keeping hide and
  // play in a single effect makes StrictMode's double mount revert cleanly.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || reduced) return
    const ctx = gsap.context(() => {
      hideReveals(el)
      if (useStore.getState().booted) playReveals(el)
    }, el)
    const unsub = useStore.subscribe((s, prev) => {
      if (s.booted && !prev.booted) ctx.add(() => playReveals(el))
    })
    const offFocus = revealOnFocus(el)
    return () => {
      unsub()
      offFocus()
      ctx.revert()
    }
  }, [reduced])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
