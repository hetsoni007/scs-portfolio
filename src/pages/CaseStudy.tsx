import { useEffect, useId, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Page } from '../components/Page'
import { CtaBand, Stats } from '../components/ui/Blocks'
import { Chips, SectionLabel, Title } from '../components/ui/Type'
import { CASES, caseById, WORK_CTA, type CaseStudy as Case } from '../content/work'
import { ScrollTrigger } from '../lib/motion'
import { useStore } from '../state/store'
import NotFound from './NotFound'

/** Pinned chapter: the phone steps through this product's real screens. */
function Screens({ c }: { c: Case }) {
  const ref = useRef<HTMLElement>(null)
  const i = useStore((s) => s.ch['case.screen'] ?? 0)
  const setCh = useStore((s) => s.setCh)
  const n = c.screens.length
  useEffect(() => {
    setCh('case.screen', 0)
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => setCh('case.screen', Math.min(n - 1, Math.floor(self.progress * n * 0.999))),
    })
    return () => st.kill()
  }, [n, setCh])
  return (
    <section className="sec pin" ref={ref} data-section="screens" data-label="Screens" style={{ ['--steps' as string]: n }}>
      <div className="pin__stage">
        <div className="wrap g12 pin__grid">
          <div className="col-span-12 md:col-span-5">
            <SectionLabel n="03">Screens</SectionLabel>
            <ol className="caps">
              {c.screens.map((s, k) => (
                <li key={s.src} className={k === i ? 'is-on' : ''}>
                  <span className="t-label">{String(k + 1).padStart(2, '0')}</span>
                  <span>{s.alt}</span>
                  <div className="anchor anchor--item m-only" data-anchor="case-screens" data-screen={k} />
                  <img className="caps__img" src={s.src} alt="" aria-hidden="true" loading="lazy" decoding="async" />
                </li>
              ))}
            </ol>
          </div>
          <div className="d-only md:col-span-6 md:col-start-7 pin__fig">
            <div className="anchor anchor--fill" data-anchor="case-screens" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Flow({ flow }: { flow: NonNullable<Case['flow']> }) {
  const [tab, setTab] = useState(0)
  const base = useId()
  return (
    <section className="sec" data-cover data-section="flow" data-label="How it works">
      <div className="wrap">
        <SectionLabel n="03">{flow.title}</SectionLabel>
        <div role="tablist" aria-label={flow.title} className="tabs mt-6" data-reveal>
          {flow.tabs.map((t, k) => (
            <button
              key={t.label}
              role="tab"
              id={`${base}-t${k}`}
              aria-selected={tab === k}
              aria-controls={`${base}-p${k}`}
              tabIndex={tab === k ? 0 : -1}
              className={`tab ${tab === k ? 'is-on' : ''}`}
              onClick={() => setTab(k)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  const nx = (k + (e.key === 'ArrowRight' ? 1 : flow.tabs.length - 1)) % flow.tabs.length
                  setTab(nx)
                  document.getElementById(`${base}-t${nx}`)?.focus()
                }
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        {flow.tabs.map((t, k) => (
          <ol key={t.label} role="tabpanel" id={`${base}-p${k}`} aria-labelledby={`${base}-t${k}`} hidden={tab !== k} className="flow mt-10">
            {t.steps.map((s, j) => (
              <li key={s}>
                <span className="t-label t-sig">{j + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        ))}
      </div>
    </section>
  )
}

export default function CaseStudy() {
  const { id = '' } = useParams()
  const c = caseById(id)
  if (!c) return <NotFound />
  const idx = CASES.indexOf(c)
  const next = CASES[(idx + 1) % CASES.length]
  const prev = CASES[(idx - 1 + CASES.length) % CASES.length]
  const spec = c.pillars ?? [
    { title: 'Problem', body: c.problem ?? '' },
    { title: 'Solution', body: c.solution ?? '' },
    { title: 'Result', body: c.result ?? '' },
  ]
  return (
    <Page title={`${c.title} — Case Study | Soni Consultancy Services`} description={c.summary} path={`/work/${c.id}/`}>
      <section className="sec relative flex min-h-[92svh] items-end" data-section="hero" data-label={c.label} style={{ paddingTop: 'calc(var(--nav-h) + 72px)', ['--tint' as string]: `color-mix(in srgb, ${c.tint} 40%, var(--blood))` }}>
        <div className="wrap g12 w-full items-end">
          <div className="col-span-12 md:col-span-7">
            <nav className="crumb t-label" aria-label="Breadcrumb" data-reveal>
              <a href="/">Home</a>
              <span aria-hidden="true">›</span>
              <a href="/work/">Work</a>
              <span aria-hidden="true">›</span>
              <span aria-current="page" className="t-2">
                {c.label}
              </span>
            </nav>
            <p className="eyebrow" data-reveal>
              <span className="pulse" aria-hidden="true" />
              {c.eyebrow}
            </p>
            <Title as="h1" lines={c.title} className="t-d mt-7" />
            <p className="t-lead mt-8" data-reveal>
              {c.summary}
            </p>
            <div className="mt-8" data-reveal>
              <Chips items={c.chips} live={c.kind === 'shipped' ? c.status : undefined} concept={c.kind === 'concept' ? c.status : undefined} />
            </div>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="anchor anchor--side" data-anchor="case" />
          </div>
        </div>
      </section>

      <section className="sec" data-cover data-section="spec" data-label={c.pillars ? 'The concept' : 'Problem · Solution · Result'}>
        <div className="wrap">
          <SectionLabel n="01">{c.pillars ? 'The concept' : 'Problem · Solution · Result'}</SectionLabel>
          <div className="spec" style={{ ['--cols' as string]: spec.length }}>
            {spec.map((s) => (
              <div className="spec__cell" key={s.title} data-reveal>
                <p className="spec__k">{s.title}</p>
                <p className="spec__v">{s.body}</p>
              </div>
            ))}
          </div>
          {c.research ? (
            <p className="t-body mt-10" data-reveal>
              {c.research}
            </p>
          ) : null}
        </div>
      </section>

      {c.metrics.length ? (
        <section className="sec sec--tight" data-cover data-section="metrics" data-label={c.kind === 'shipped' ? 'Measured' : 'From the research'}>
          <div className="wrap">
            {/* Healthcare Staffing's figures are research findings, not shipped results. */}
            <SectionLabel n="02">{c.kind === 'shipped' ? 'Measured' : 'From the research'}</SectionLabel>
            <Stats items={c.metrics} cols={c.metrics.length} />
          </div>
        </section>
      ) : null}

      {c.screens.length > 1 ? <Screens c={c} /> : null}
      {c.flow ? <Flow flow={c.flow} /> : null}

      {c.gallery ? (
        <section className="sec" data-cover data-section="gallery" data-label="More screens">
          <div className="wrap">
            <SectionLabel n="04">{c.gallery.title}</SectionLabel>
            <div className="gallery">
              {c.gallery.items.map((g) => (
                <figure key={g.src} className="m-0" data-reveal>
                  <div className="device">
                    <img src={g.src} alt={g.alt} loading="lazy" decoding="async" width={360} height={760} />
                  </div>
                  <figcaption className="t-label mt-4">{g.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <nav className="sec sec--tight casenav" data-cover aria-label="More case studies">
        <div className="wrap casenav__in">
          <a href={`/work/${prev.id}/`} className="casenav__a">
            <span className="t-label">← Previous</span>
            <span className="casenav__t">{prev.title}</span>
          </a>
          <a href="/work/" className="bracket">
            All work
          </a>
          <a href={`/work/${next.id}/`} className="casenav__a casenav__a--next">
            <span className="t-label">Next →</span>
            <span className="casenav__t">{next.title}</span>
          </a>
        </div>
      </nav>

      <CtaBand title={WORK_CTA.title} lead={WORK_CTA.lead} primary="Book a Free Call →" secondary={{ label: 'Explore AI app ideas', href: '/ai-app-development/' }} />
    </Page>
  )
}
