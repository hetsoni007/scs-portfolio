import { useEffect, useRef, useState } from 'react'
import { Page } from '../components/Page'
import { CtaBand, Guides, PageHero, ProcessSection, Stats } from '../components/ui/Blocks'
import { Faq } from '../components/ui/Faq'
import { LeadBox } from '../components/ui/LeadBox'
import { SectionLabel, Title } from '../components/ui/Type'
import { AI_PAGE as P } from '../content/ai'
import { live } from '../lib/live'
import { useStore } from '../state/store'

function Ideas() {
  const active = useStore((s) => s.ch['ai.node'] ?? 0)
  const hover3d = useStore((s) => s.ch['ai.hover'] ?? -1)
  const setCh = useStore((s) => s.setCh)
  const list = useRef<HTMLOListElement>(null)
  useEffect(() => {
    const rows = Array.from(list.current?.querySelectorAll<HTMLElement>('[data-idea]') ?? [])
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setCh('ai.node', Number((e.target as HTMLElement).dataset.idea))), {
      rootMargin: '-46% 0px -46% 0px',
    })
    rows.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [setCh])
  const shown = hover3d >= 0 ? hover3d : active
  return (
    <section className="sec" id="ideas" data-section="ideas" data-label={P.ideas.eyebrow} data-grid>
      <div className="wrap g12">
        <div className="col-span-12 md:col-span-5 d-only">
          <div className="svc-fig__sticky">
            <div className="anchor anchor--orbit" data-anchor="net" />
            <p className="fig t-label">
              <span>Fig. 03</span>
              <span className="fig__rule" aria-hidden="true" />
              <span>{P.ideas.items[shown].title}</span>
            </p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-7">
          <SectionLabel n="02">{P.ideas.eyebrow}</SectionLabel>
          <Title lines={P.ideas.title} />
          <p className="t-lead mt-6" data-reveal>
            {P.ideas.lead}
          </p>
          <ol className="rows mt-12" ref={list}>
            {P.ideas.items.map((it, i) => (
              <li
                key={it.title}
                id={`idea-${i}`}
                data-idea={i}
                className={`row ${shown === i ? 'is-on' : ''}`}
                onMouseEnter={() => setCh('ai.node', i)}
                data-reveal
              >
                <div className="row__n">
                  <span className="t-label">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div>
                  <h3 className="t-h3 row__title">{it.title}</h3>
                  <p className="row__body">{it.body}</p>
                  <p className="t-label mt-3 t-bone">{it.tag}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

/** A scripted chat: the "answers" are the published FAQ, verbatim. Not a live model. */
function AskDemo() {
  const reduced = useStore((s) => s.reduced)
  const items = P.faq.items
  const [log, setLog] = useState<{ q: string; a: string; done: boolean }[]>([])
  const [busy, setBusy] = useState(false)
  const box = useRef<HTMLDivElement>(null)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: reduced ? 'auto' : 'smooth' })
  }, [log, reduced])

  const ask = (i: number) => {
    if (busy) return
    const { q, a } = items[i]
    live.chan['ai.pulse'] = 1
    useStore.getState().setCh('ai.node', (i * 5) % P.ideas.items.length)
    if (reduced) {
      setLog((l) => [...l, { q, a, done: true }])
      return
    }
    setBusy(true)
    setLog((l) => [...l, { q, a: '', done: false }])
    let n = 0
    const step = () => {
      n = Math.min(a.length, n + 3)
      setLog((l) => l.map((m, k) => (k === l.length - 1 ? { ...m, a: a.slice(0, n), done: n >= a.length } : m)))
      if (n < a.length) timer.current = window.setTimeout(step, 16)
      else setBusy(false)
    }
    timer.current = window.setTimeout(step, 420)
  }

  return (
    <section className="sec" data-cover data-section="ask" data-label="Ask the studio">
      <div className="wrap g12">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel n="03">Scripted demo</SectionLabel>
          <Title lines={['Ask the', 'studio.']} />
          <p className="t-body mt-6" data-reveal>
            A scripted demo. Each answer is our published FAQ, word for word. It is not a live model.
          </p>
        </div>
        <div className="col-span-12 md:col-span-8 mt-10 md:mt-0" data-reveal>
          <div className="ask">
            <div className="ask__bar t-label">
              <span className="pulse" aria-hidden="true" /> ask.soni — scripted demo
            </div>
            <div className="ask__log" ref={box} aria-live="polite" data-lenis-prevent>
              {log.length === 0 ? <p className="t-3">Pick a question below.</p> : null}
              {log.map((m, k) => (
                <div key={k} className="ask__turn">
                  <p className="ask__q">
                    <span className="t-label">you</span>
                    {m.q}
                  </p>
                  <p className="ask__a">
                    <span className="t-label t-sig">studio</span>
                    {m.a}
                    {!m.done ? <span className="cw__caret" aria-hidden="true" /> : null}
                  </p>
                </div>
              ))}
            </div>
            <div className="ask__chips">
              {items.map((it, i) => (
                <button key={it.q} type="button" className="chip ask__chip" onClick={() => ask(i)} disabled={busy}>
                  {it.q}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function AI() {
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/ai-app-development/">
      <PageHero
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        lead={P.hero.lead}
        size="t-xl"
        primary={{ label: P.hero.primary }}
        secondary={P.hero.secondary}
        aside={<div className="anchor anchor--side" data-anchor="net" />}
      />
      <section className="sec sec--tight" data-cover data-section="why" data-label="Why now">
        <div className="wrap">
          <SectionLabel n="01">Why now</SectionLabel>
          <Stats items={P.why} cols={3} />
        </div>
      </section>
      <Ideas />
      <AskDemo />
      <ProcessSection eyebrow={P.how.eyebrow} title={P.how.title} steps={P.how.steps} n="04" />
      <section className="sec" data-section="market" data-label={P.market.eyebrow}>
        <div className="wrap">
          <SectionLabel n="05">{P.market.eyebrow}</SectionLabel>
          <Title lines={P.market.title} />
          <p className="t-lead mt-6" data-reveal>
            {P.market.lead}
          </p>
          <ul className="terms mt-12" data-reveal>
            {P.market.terms.map((t) => (
              <li key={t} className="chip">
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand title={P.cta.title} lead={P.cta.lead} primary={P.cta.primary} secondary={P.cta.secondary} />
      <Guides eyebrow={P.guides.eyebrow} title={P.guides.title} items={P.guides.items} n="06" />
      <LeadBox variant="ai" />
      <Faq title={P.faq.title} items={P.faq.items} n="07" />
    </Page>
  )
}
