import { useEffect, useRef, useState } from 'react'
import { Page } from '../components/Page'
import { A, Rich } from '../components/ui/A'
import { Marquee, Stats, Testimonials } from '../components/ui/Blocks'
import { BookBtn, Bracket } from '../components/ui/Buttons'
import { Ring, ScriptBand, Sigil } from '../components/ui/Signature'
import { Chips, Dim, SectionLabel, Title } from '../components/ui/Type'
import { ABOUT_PAGE } from '../content/company'
import { HOME } from '../content/home'
import { EMAIL, SOCIALS } from '../content/site'
import { HOME_WORK } from '../content/work'
import { ScrollTrigger } from '../lib/motion'
import { useStore } from '../state/store'

/** Hero line 2: the phrase "recompiles" — deletes back, then types the next word. */
function CompileWords({ words }: { words: readonly string[] }) {
  const reduced = useStore((s) => s.reduced)
  const booted = useStore((s) => s.booted)
  const [text, setText] = useState(words[0])
  useEffect(() => {
    if (reduced || !booted) return
    let i = 0
    let timer = 0
    let cur = words[0]
    const step = (target: string, deleting: boolean) => {
      if (deleting) {
        cur = cur.slice(0, -1)
        setText(cur)
        timer = window.setTimeout(() => step(target, cur.length > 0), cur.length > 0 ? 28 : 220)
      } else if (cur.length < target.length) {
        cur = target.slice(0, cur.length + 1)
        setText(cur)
        timer = window.setTimeout(() => step(target, false), 48 + Math.random() * 40)
      } else {
        timer = window.setTimeout(next, 2600)
      }
    }
    const next = () => {
      i = (i + 1) % words.length
      step(words[i], true)
    }
    timer = window.setTimeout(next, 3200)
    return () => clearTimeout(timer)
  }, [reduced, booted, words])
  return (
    <span className="cw">
      <span className="sr-only">{words[0]}</span>
      <em aria-hidden="true">{text}</em>
      <span className="cw__caret" aria-hidden="true" />
    </span>
  )
}

/** Drives a page ↔ scene channel from a pinned section's scroll progress. */
function useStepChannel(key: string, steps: number) {
  const ref = useRef<HTMLElement>(null)
  const setCh = useStore((s) => s.setCh)
  const active = useStore((s) => s.ch[key] ?? 0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    setCh(key, 0)
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setCh(key, Math.min(steps - 1, Math.floor(self.progress * steps * 0.999))),
    })
    return () => st.kill()
  }, [key, steps, setCh])
  return { ref, active }
}

function Hero() {
  const h = HOME.hero
  const screen = useStore((s) => s.ch['home.screen'] ?? 0)
  const onScreen = HOME_WORK[screen] ?? HOME_WORK[0]
  return (
    <section className="sec hero" data-section="hero" data-label="Build">
      <div className="wrap g12 hero__grid">
        <div className="hero__copy col-span-12 md:col-span-7">
          <p className="eyebrow" data-reveal>
            <span className="pulse" aria-hidden="true" />
            {h.eyebrow}
          </p>
          <h1 className="t-d hero__h1 mt-7" data-split>
            <span className="line-mask">
              <span className="line-in">{h.titleLead}</span>
            </span>{' '}
            <span className="line-mask">
              <span className="line-in">
                <CompileWords words={h.words} />
              </span>
            </span>
          </h1>
          <p className="t-lead mt-8" data-reveal>
            {h.lead.map((part, i) => (typeof part === 'string' ? <span key={i}>{part}</span> : <strong key={i}>{part.strong}</strong>))}
          </p>
          <div className="actions mt-10" data-reveal>
            <BookBtn>{h.primary}</BookBtn>
            <Bracket href={h.secondary.href} size="lg">
              {h.secondary.label}
            </Bracket>
          </div>
          <p className="hero__trust t-label mt-9" data-reveal>
            <span className="t-bone" aria-hidden="true">
              ✓
            </span>{' '}
            {h.trust}
          </p>
        </div>
        <div className="col-span-12 md:col-span-5 hero__fig">
          <div className="anchor anchor--hero" data-anchor="hero" />
          <p className="fig t-label" data-reveal>
            <span>Fig. 01</span>
            <span className="fig__rule" aria-hidden="true" />
            <span>
              On screen:{' '}
              <a className="ink-link" href={`/work/${onScreen.id}/`}>
                {onScreen.title}
              </a>{' '}
              · real app
            </span>
          </p>
        </div>
      </div>
    </section>
  )
}

function Proof() {
  const p = HOME.proof
  return (
    <section className="sec" data-section="proof" data-label="Proof" data-grid>
      <div className="wrap g12">
        <div className="col-span-12 md:col-span-4 proof__fig">
          <div className="anchor anchor--proof" data-anchor="proof" />
        </div>
        <div className="col-span-12 md:col-span-8">
          <SectionLabel n="01">{p.eyebrow}</SectionLabel>
          <Title lines={p.title} />
          <div className="mt-14">
            <Stats cols={2} items={p.stats.map((s) => ({ value: `${s.count}${s.suffix}`, label: s.label }))} />
          </div>
        </div>
      </div>
    </section>
  )
}

function Layers() {
  const s = HOME.services
  const { ref, active } = useStepChannel('home.layer', s.items.length)
  return (
    <section className="sec pin has-sigil" ref={ref} data-section="services" data-label={s.eyebrow} style={{ ['--steps' as string]: s.items.length }}>
      <div className="pin__stage">
        <Sigil />
        <div className="wrap g12 pin__grid">
          <div className="col-span-12 md:col-span-6 lg:col-span-5">
            <SectionLabel n="02">{s.eyebrow}</SectionLabel>
            <Title lines={s.title} />
            <p className="t-lead mt-6" data-reveal>
              {s.lead}
            </p>
            <ol className="layers mt-10">
              {s.items.map((it, i) => (
                <li className={`layer ${active === i ? 'is-on' : ''}`} key={it.title} data-reveal>
                  <p className="layer__k t-label">
                    <span className="layer__n">{String(i + 1).padStart(2, '0')}</span> {it.layer}
                  </p>
                  <h3 className="t-h3">{it.title}</h3>
                  <p className="layer__b">
                    {it.body}{' '}
                    {it.link ? (
                      <a className="ink-link" href={it.link.href}>
                        {it.link.label}
                      </a>
                    ) : null}
                  </p>
                  <Chips items={it.chips} />
                  <div className="anchor anchor--item m-only" data-anchor="layers" data-layer={i} />
                </li>
              ))}
            </ol>
          </div>
          <div className="d-only md:col-span-6 lg:col-span-7 pin__fig">
            <div className="anchor anchor--fill" data-anchor="layers" />
            <ul className="callouts" aria-hidden="true">
              {s.items.map((it, i) => (
                <li key={it.layer} className={active === i ? 'is-on' : ''} style={{ ['--i' as string]: i }}>
                  <span className="t-label">{it.layer}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function Work() {
  const w = HOME.work
  const { ref, active } = useStepChannel('home.work', HOME_WORK.length)
  return (
    <section className="sec pin" ref={ref} data-section="work" data-label={w.eyebrow} style={{ ['--steps' as string]: HOME_WORK.length }}>
      <div className="pin__stage">
        <div className="wrap g12 pin__grid">
          <div className="col-span-12 md:col-span-6">
            <SectionLabel n="03">{w.eyebrow}</SectionLabel>
            <Title lines={w.title} />
            <ol className="reel mt-10">
              {HOME_WORK.map((it, i) => (
                <li className={`reel__item ${active === i ? 'is-on' : ''}`} key={it.id} data-reveal>
                  <a className="reel__link" href={`/work/${it.id}/`} data-cursor="view">
                    <span className="t-label reel__n">{String(i + 1).padStart(2, '0')}</span>
                    <span className="reel__t">{it.title}</span>
                    <span className="reel__l">{it.line}</span>
                    <img className="reel__thumb" src={it.src} alt={it.alt} width={120} height={260} loading="lazy" decoding="async" />
                  </a>
                  <div className="anchor anchor--item m-only" data-anchor="work" data-work={i} />
                </li>
              ))}
            </ol>
            <p className="mt-10" data-reveal>
              <a className="ink-link t-label" href={w.more.href}>
                {w.more.label}
              </a>
            </p>
          </div>
          <div className="d-only md:col-span-6 pin__fig">
            <div className="anchor anchor--fill" data-anchor="work" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Why() {
  const w = HOME.why
  return (
    <section className="sec" data-section="why" data-label={w.eyebrow} data-grid>
      <div className="wrap">
        <SectionLabel n="04">{w.eyebrow}</SectionLabel>
        <Title lines={w.title} />
        <div className="g12 mt-16 gap-y-12">
          {w.items.map((it) => (
            <div className="col-span-12 md:col-span-4" key={it.title} data-reveal>
              <Dim label={it.dim} />
              <h3 className="t-h3 mt-7">{it.title}</h3>
              <p className="t-body mt-3">{it.body}</p>
            </div>
          ))}
        </div>
        <div className="anchor anchor--flat" data-anchor="flat" />
      </div>
    </section>
  )
}

function Founder() {
  const f = HOME.founder
  const linkedin = SOCIALS[0].href
  return (
    <section className="sec" data-cover data-section="founder" data-label={f.eyebrow}>
      <div className="wrap g12 items-center">
        <div className="col-span-12 md:col-span-4" data-reveal>
          <svg className="mono" viewBox="0 0 200 200" role="img" aria-label={`${f.initials} monogram`}>
            <circle cx="100" cy="100" r="78" />
            <circle cx="100" cy="100" r="92" className="mono__o" />
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i / 36) * Math.PI * 2
              const r1 = i % 9 === 0 ? 84 : 88
              return <line key={i} x1={100 + Math.cos(a) * r1} y1={100 + Math.sin(a) * r1} x2={100 + Math.cos(a) * 92} y2={100 + Math.sin(a) * 92} />
            })}
            <text x="100" y="118" textAnchor="middle">
              {f.initials}
            </text>
          </svg>
        </div>
        <div className="col-span-12 md:col-span-7 md:col-start-6 mt-10 md:mt-0">
          <SectionLabel n="05">{f.eyebrow}</SectionLabel>
          <Title lines={f.title} className="t-h2" />
          {f.body.map((b) => (
            <p className="t-body mt-6" key={b.slice(0, 20)} data-reveal>
              <Rich text={b} />
            </p>
          ))}
          <p className="mt-8" data-reveal>
            <A className="bracket" href={linkedin}>
              {f.linkedin}
            </A>
          </p>
        </div>
      </div>
    </section>
  )
}

function Cta() {
  const c = HOME.cta
  return (
    <section className="sec home-cta has-sigil" data-section="cta" data-label="Book a call">
      <Sigil className="sigil--cta" />
      <div className="wrap g12 items-center">
        <div className="col-span-12 md:col-span-7">
          <Title lines={c.title} className="t-d" />
          <p className="t-lead mt-8" data-reveal>
            {c.lead}
          </p>
          <div className="actions mt-10" data-reveal>
            <BookBtn>{c.primary}</BookBtn>
            <Bracket href={c.secondary.href} size="lg">
              {c.secondary.label}
            </Bracket>
            <Ring />
          </div>
          <p className="t-label mt-10" data-reveal>
            {c.assurances}
          </p>
          <p className="t-body mt-4" data-reveal>
            {c.emailLine}{' '}
            <a className="ink-link" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
          </p>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="anchor anchor--cta" data-anchor="cta" />
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <Page title={HOME.meta.title} description={HOME.meta.description} path="/">
      <Hero />
      <Marquee />
      <Proof />
      <Layers />
      <Work />
      <Why />
      <ScriptBand text={ABOUT_PAGE.values.items[0].title} />
      <Founder />
      <Testimonials eyebrow={HOME.voices.eyebrow} title={HOME.voices.title} n="06" />
      <Cta />
    </Page>
  )
}
