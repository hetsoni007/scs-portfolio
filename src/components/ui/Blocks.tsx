// Reusable page blocks. All copy is passed in from src/content (verbatim).
import type { ReactNode } from 'react'
import { CALENDLY, REGIONS, TECH_MARQUEE, TESTIMONIALS } from '../../content/site'
import { A, Rich } from './A'
import { BookBtn, Bracket, Btn } from './Buttons'
import { Sigil } from './Signature'
import { SectionLabel, Title, Plus } from './Type'

type Link = { label: string; href: string }

/* ── Page hero (inner pages) ─────────────────────────── */
export function PageHero({
  crumb,
  eyebrow,
  title,
  lead,
  primary,
  secondary,
  aside,
  size = 't-d',
  children,
}: {
  crumb?: string
  eyebrow: string
  title: string | readonly string[]
  lead?: string
  primary?: { label: string; href?: string }
  secondary?: Link
  aside?: ReactNode
  size?: string
  children?: ReactNode
}) {
  return (
    <section className="sec has-sigil relative flex min-h-[92svh] items-end" data-section="hero" data-label="Hero" style={{ paddingTop: 'calc(var(--nav-h) + 72px)' }}>
      <Sigil className="sigil--hero" />
      <div className="wrap g12 w-full">
        <div className="col-span-12 md:col-span-8 lg:col-span-7">
          {crumb ? (
            <nav className="crumb t-label" aria-label="Breadcrumb" data-reveal>
              <a href="/">Home</a>
              <span aria-hidden="true">›</span>
              <span aria-current="page" className="t-2">
                {crumb}
              </span>
            </nav>
          ) : null}
          <p className="eyebrow" data-reveal>
            <span className="pulse" aria-hidden="true" />
            {eyebrow}
          </p>
          <Title as="h1" lines={title} className={`${size} mt-7`} />
          {lead ? (
            <p className="t-lead mt-8" data-reveal>
              {lead}
            </p>
          ) : null}
          {primary || secondary ? (
            <div className="actions mt-10" data-reveal>
              {primary ? (
                <Btn href={primary.href ?? CALENDLY} size="lg">
                  {primary.label}
                </Btn>
              ) : null}
              {secondary ? (
                <Bracket href={secondary.href} size="lg">
                  {secondary.label}
                </Bracket>
              ) : null}
            </div>
          ) : null}
          {children}
        </div>
        {aside ? <div className="col-span-12 md:col-span-4 lg:col-span-5">{aside}</div> : null}
      </div>
    </section>
  )
}

/* ── CTA band ────────────────────────────────────────── */
export function CtaBand({
  title,
  lead,
  primary,
  secondary,
  children,
  id = 'cta',
}: {
  title: string | readonly string[]
  lead?: string
  primary: string
  secondary?: Link
  children?: ReactNode
  id?: string
}) {
  return (
    <section className="sec ctaband" data-section={id} data-label="Book a call">
      <div className="wrap">
        <Title lines={title} className="t-d ctaband__title" />
        <svg className="ctaband__rule" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true" data-draw>
          <line x1="0" y1="7" x2="100" y2="7" vectorEffect="non-scaling-stroke" />
          <line className="tick" x1="0" y1="0" x2="0" y2="14" vectorEffect="non-scaling-stroke" />
          <line className="tick" x1="100" y1="0" x2="100" y2="14" vectorEffect="non-scaling-stroke" />
        </svg>
        <div className="g12 items-end">
          <div className="col-span-12 md:col-span-6">{lead ? <p className="t-lead" data-reveal>{lead}</p> : null}</div>
          <div className="col-span-12 md:col-span-6 mt-8 md:mt-0 flex md:justify-end">
            <div className="actions" data-reveal>
              <BookBtn>{primary}</BookBtn>
              {secondary ? (
                <Bracket href={secondary.href} size="lg">
                  {secondary.label}
                </Bracket>
              ) : null}
            </div>
          </div>
        </div>
        {children}
      </div>
    </section>
  )
}

/* ── Stats ───────────────────────────────────────────── */
export function parseStat(v: string) {
  const m = v.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!m) return null
  return { pre: m[1], n: parseFloat(m[2]), post: m[3], dec: (m[2].split('.')[1] ?? '').length }
}

export function Stat({ value, label }: { value: string; label: string }) {
  const p = parseStat(value)
  return (
    <div className="stat" data-reveal>
      <div className="stat__v">
        {p ? (
          <>
            <span className="sr-only">{value}</span>
            {p.pre ? <span aria-hidden="true">{p.pre}</span> : null}
            <span data-count={p.n} data-dec={p.dec} aria-hidden="true">
              {value.replace(p.pre, '').replace(p.post, '')}
            </span>
            {p.post ? <small aria-hidden="true">{p.post}</small> : null}
          </>
        ) : (
          value
        )}
      </div>
      <svg className="stat__dim" viewBox="0 0 100 12" preserveAspectRatio="none" aria-hidden="true" data-draw>
        <line x1="0" y1="2" x2="0" y2="10" vectorEffect="non-scaling-stroke" />
        <line x1="0" y1="6" x2="100" y2="6" vectorEffect="non-scaling-stroke" />
      </svg>
      <p className="stat__l">{label}</p>
    </div>
  )
}

export function Stats({ items, cols = 4 }: { items: readonly { value: string; label: string }[]; cols?: number }) {
  return (
    <div className="stats" style={{ ['--cols' as string]: cols }}>
      {items.map((s) => (
        <Stat key={s.label} {...s} />
      ))}
    </div>
  )
}

/* ── Process stations ────────────────────────────────── */
export function Stations({ steps, active }: { steps: readonly { n: string; title: string; body: string }[]; active?: number }) {
  return (
    <ol className="stations" style={{ ['--n' as string]: steps.length }} data-reveal>
      {steps.map((s, i) => (
        <li className={`station ${active === i ? 'is-on' : ''}`} key={s.n}>
          <p className="station__n t-label">{s.n}</p>
          <h3 className="t-h3">{s.title}</h3>
          <p>
            <Rich text={s.body} />
          </p>
        </li>
      ))}
    </ol>
  )
}

export function ProcessSection({
  eyebrow,
  title,
  steps,
  n,
}: {
  eyebrow: string
  title: string | readonly string[]
  steps: readonly { n: string; title: string; body: string }[]
  n?: string
}) {
  return (
    <section className="sec" data-section="process" data-label={eyebrow} data-cover>
      <div className="wrap">
        <SectionLabel n={n}>{eyebrow}</SectionLabel>
        <Title lines={title} />
        <div className="mt-14">
          <Stations steps={steps} />
        </div>
      </div>
    </section>
  )
}

/* ── Proof links ─────────────────────────────────────── */
export function Proofs({ items, action }: { items: readonly { value: string; body: string; href: string }[]; action: string }) {
  return (
    <div className="proofs" style={{ ['--cols' as string]: Math.min(items.length, 4) }} data-reveal>
      {items.map((p) => (
        <a className="proof" href={p.href} key={p.value + p.body} data-cursor="view">
          <span className="proof__v">{p.value}</span>
          <span className="proof__b">{p.body}</span>
          <span className="proof__a t-label">{action}</span>
        </a>
      ))}
    </div>
  )
}

/* ── Free guides & tools (link out to the live blog) ─── */
export function Guides({ eyebrow, title, items, n }: { eyebrow: string; title: string; items: readonly { kicker: string; title: string; action: string; href: string }[]; n?: string }) {
  return (
    <section className="sec sec--tight" data-section="guides" data-label={eyebrow} data-cover>
      <div className="wrap">
        <SectionLabel n={n}>{eyebrow}</SectionLabel>
        <Title lines={title} className="t-h2" />
        <div className="guides mt-12" data-reveal>
          {items.map((g) => (
            <A className="guide" href={g.href} key={g.href + g.title}>
              <span className="t-label">{g.kicker}</span>
              <span className="guide__t">{g.title}</span>
              <span className="guide__a ext">{g.action}</span>
            </A>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Testimonials (real, verbatim; no rating schema) ─── */
export function Testimonials({ eyebrow, title, n }: { eyebrow: string; title: readonly string[]; n?: string }) {
  const g = TESTIMONIALS.goodfirms
  return (
    <section className="sec" data-section="voices" data-label={eyebrow} data-cover>
      <div className="wrap">
        <SectionLabel n={n}>{eyebrow}</SectionLabel>
        <Title lines={title} />
        <div className="voices mt-14">
          <figure className="cert m-0" data-reveal>
            <p className="cert__stars">{g.rating}</p>
            <p className="t-lead mt-5" style={{ color: 'var(--fg)' }}>
              {g.project}
            </p>
            <figcaption className="who mt-8">
              <span className="who__i" aria-hidden="true">
                {g.initials}
              </span>
              <span>
                <span className="who__n block">{g.name}</span>
                <span className="who__r block">
                  {g.role} · {g.source}
                </span>
              </span>
            </figcaption>
          </figure>
          <div>
            {TESTIMONIALS.quotes.map((q) => (
              <figure className="quote m-0" key={q.name} data-reveal>
                <blockquote>{q.quote}</blockquote>
                <figcaption className="who">
                  <span className="who__i" aria-hidden="true">
                    {q.initials}
                  </span>
                  <span>
                    <span className="who__n block">{q.name}</span>
                    <span className="who__r block">
                      {q.role} · {q.source}
                    </span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/* ── Regions ─────────────────────────────────────────── */
export function Regions({ eyebrow, title, n }: { eyebrow: string; title: string; n?: string }) {
  return (
    <section className="sec" data-section="regions" data-label={eyebrow} data-cover>
      <div className="wrap g12">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel n={n}>{eyebrow}</SectionLabel>
          <Title lines={title} />
        </div>
        <ul className="regions col-span-12 md:col-span-8 mt-10 md:mt-0" data-reveal>
          {REGIONS.map((r) => (
            <li className="region" key={r.name}>
              <span className="region__f" aria-hidden="true">
                {r.flag}
              </span>
              <span className="region__n">{r.name}</span>
              <span className="t-label">{r.sectors}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/* ── Tech marquee ────────────────────────────────────── */
export function Marquee({ items = TECH_MARQUEE }: { items?: readonly string[] }) {
  const row = (hidden: boolean) =>
    items.map((s, i) => (
      <span className="marquee__item" key={`${hidden}-${i}`} aria-hidden={hidden || undefined}>
        {s}
        <Plus className="marquee__plus" />
      </span>
    ))
  return (
    <div className="marquee" role="region" aria-label="Technology we ship with">
      <div className="marquee__track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}

/* ── Ruled rows (numbered list of titled items) ──────── */
export function Rows({ items, start = 1 }: { items: readonly { title: string; body: string; chips?: readonly string[]; bullets?: readonly string[] }[]; start?: number }) {
  return (
    <ol className="rows">
      {items.map((it, i) => (
        <li className="row" key={it.title} data-reveal>
          <div className="row__n">
            <span className="t-label">{String(i + start).padStart(2, '0')}</span>
          </div>
          <div>
            <h3 className="t-h3 row__title">{it.title}</h3>
            <p className="row__body">
              <Rich text={it.body} />
            </p>
            {it.bullets ? (
              <ul className="ticks">
                {it.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            ) : null}
            {it.chips ? (
              <div className="chips mt-4">
                {it.chips.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ── Cells (2–3 column ruled grid) ───────────────────── */
export function Cells({ items, cols = 3 }: { items: readonly { title: string; body: string; k?: string }[]; cols?: number }) {
  return (
    <div className="cells" style={{ ['--cols' as string]: cols }} data-cols-md="2">
      {items.map((it, i) => (
        <div className="cell" key={it.title} data-reveal>
          <div className="cell__k">
            <span className="t-label">{String(i + 1).padStart(2, '0')}</span>
            {it.k ? <span className="t-label t-sig">{it.k}</span> : null}
          </div>
          <h3 className="t-h3">{it.title}</h3>
          <p>
            <Rich text={it.body} />
          </p>
        </div>
      ))}
    </div>
  )
}

