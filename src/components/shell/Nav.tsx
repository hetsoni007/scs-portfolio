import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { BRAND, CALENDLY, EMAIL, NAV, NAV_CTA, PHONE_DISPLAY, WHATSAPP } from '../../content/site'
import { lockScroll } from '../../lib/motion'
import { useStore } from '../../state/store'
import { Btn } from '../ui/Buttons'
import { Plus } from '../ui/Type'

function Wordmark() {
  return (
    <a href="/" className="wm" aria-label={`${BRAND.name} — home`}>
      <span className="wm__name" aria-hidden="true">
        Soni
      </span>
      <span className="wm__sub" aria-hidden="true">
        Consultancy
        <br />
        Services
      </span>
    </a>
  )
}

function ThemeToggle() {
  const theme = useStore((s) => s.theme)
  const setTheme = useStore((s) => s.setTheme)
  const next = theme === 'dark' ? 'light' : 'dark'
  return (
    <button type="button" className="icon-btn" onClick={() => setTheme(next)} aria-label={`Switch to ${next} theme`}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" />
        <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
      </svg>
    </button>
  )
}

const isCurrent = (path: string, href: string) => (href === '/' ? path === '/' : path.startsWith(href))

export function Nav() {
  const { pathname } = useLocation()
  const open = useStore((s) => s.menuOpen)
  const setMenu = useStore((s) => s.setMenu)
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const burger = useRef<HTMLButtonElement>(null)
  const menu = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setScrolled(y > 24)
      setHidden(y > 480 && y > lastY + 4)
      if (y < lastY - 4) setHidden(false)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Modal menu: lock scroll, trap focus, Esc closes, focus returns to the burger.
  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const root = menu.current
    const focusables = () => Array.from(root?.querySelectorAll<HTMLElement>('a, button') ?? [])
    focusables()[0]?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(false)
        burger.current?.focus()
      }
      if (e.key !== 'Tab') return
      const f = focusables()
      const first = f[0]
      const last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, setMenu])

  useEffect(() => setMenu(false), [pathname, setMenu])

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !open ? 'is-hidden' : ''}`}>
        <div className="wrap nav__in">
          <Wordmark />
          <nav aria-label="Primary">
            <ul className="nav__links">
              {NAV.map((n, i) => (
                <li key={n.href}>
                  {i > 0 ? <Plus className="nav__plus" /> : null}
                  <a href={n.href} aria-current={isCurrent(pathname, n.href) ? 'page' : undefined}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="nav__r">
            <ThemeToggle />
            <span className="nav__cta">
              <Btn href={NAV_CTA.href} size="sm">
                {NAV_CTA.label}
              </Btn>
            </span>
            <button
              ref={burger}
              type="button"
              className="icon-btn burger"
              aria-expanded={open}
              aria-controls="mmenu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setMenu(!open)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>
      {open ? (
        <div className="mmenu" id="mmenu" ref={menu} role="dialog" aria-modal="true" aria-label="Menu">
          <ul className="mmenu__list">
            {NAV.map((n, i) => (
              <li key={n.href}>
                <a href={n.href} aria-current={isCurrent(pathname, n.href) ? 'page' : undefined}>
                  <span className="t-label">{String(i + 1).padStart(2, '0')}</span>
                  <span className="mmenu__t">{n.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="mmenu__foot">
            <Btn href={CALENDLY} size="lg">
              {NAV_CTA.mobileLabel}
            </Btn>
            <p className="t-label">
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              <br />
              <a href={WHATSAPP} target="_blank" rel="noopener noreferrer">
                WhatsApp {PHONE_DISPLAY}
              </a>
            </p>
          </div>
        </div>
      ) : null}
    </>
  )
}
