import { useEffect, useMemo, useState } from 'react'
import { Page } from '../components/Page'
import { A } from '../components/ui/A'
import { Cells, CtaBand, Guides, PageHero, ProcessSection, Rows } from '../components/ui/Blocks'
import { BookBtn } from '../components/ui/Buttons'
import { Faq } from '../components/ui/Faq'
import { LeadBox } from '../components/ui/LeadBox'
import { SectionLabel, Title } from '../components/ui/Type'
import { DEVOPS_PAGE as P } from '../content/devops'
import { useStore } from '../state/store'

/** Illustrative dashboard — sample data, labelled as such, exactly like the live page. */
function Dashboard() {
  const D = P.dashboard
  const reduced = useStore((s) => s.reduced)
  // Same sample-data shape as the live page's sparkline.
  const [bars, setBars] = useState(() => Array.from({ length: 14 }, (_, i) => 6 + Math.round(Math.abs(Math.sin(i * 1.3) * 9) + Math.random() * 4)))
  const [stage, setStage] = useState(2)
  const [deploys, setDeploys] = useState(Number(D.metrics[0].value))
  const [warn, setWarn] = useState(true)
  useEffect(() => {
    if (reduced) return
    const t = setInterval(() => {
      setStage((s) => {
        const n = (s + 1) % D.pipeline.length
        if (n === 0) {
          setDeploys(12 + Math.floor(Math.random() * 6))
          setBars((b) => [...b.slice(1), 6 + Math.floor(Math.random() * 12)])
        }
        return n
      })
    }, 2400)
    const w = setTimeout(() => setWarn(false), 6000)
    return () => {
      clearInterval(t)
      clearTimeout(w)
    }
  }, [reduced, D.pipeline.length])
  const metrics = useMemo(() => D.metrics.map((m, i) => (i === 0 ? { ...m, value: String(deploys) } : m)), [D.metrics, deploys])
  return (
    <section className="sec" id="obs" data-section="obs" data-label="Delivery health" data-cover>
      <div className="wrap">
        <div className="dash" data-reveal>
          <header className="dash__head">
            <div>
              <h2 className="t-h3">{D.title}</h2>
              <p className="t-label mt-2">{D.sub}</p>
            </div>
            <span className="chip chip--sig">{D.badge}</span>
          </header>
          <div className="dash__metrics">
            {metrics.map((m) => (
              <div className="dash__m" key={m.label}>
                <p className="t-label">{m.label}</p>
                <p className="dash__v">
                  {m.value}
                  <small>{m.unit}</small>
                </p>
                <p className="t-label t-bone">{m.delta}</p>
              </div>
            ))}
          </div>
          <div className="dash__row">
            <div className="dash__cell dash__cell--wide">
              <p className="t-label">{D.chartTitle}</p>
              <div className="spark" aria-hidden="true">
                {bars.map((v, i) => (
                  <span key={i} style={{ height: `${Math.min(100, v * 6)}%` }} title={`${v} deploys`} />
                ))}
              </div>
            </div>
            <div className="dash__cell">
              <p className="t-label">{D.uptimeTitle}</p>
              <p className="dash__v mt-3">
                {D.uptime} <span className="chip chip--live">{D.uptimeBadge}</span>
              </p>
              <p className="t-body mt-3">
                {D.uptimeNote[0]}
                <br />
                {D.uptimeNote[1]}
              </p>
            </div>
          </div>
          <div className="dash__row">
            <ol className="pipe dash__cell dash__cell--wide" aria-label="Pipeline (sample)">
              {D.pipeline.map((p, i) => (
                <li key={p} className={i < stage ? 'done' : i === stage ? 'run' : ''}>
                  {p}
                </li>
              ))}
            </ol>
            <ul className="svcs dash__cell">
              {D.services.map((s) => (
                <li key={s} className={s === 'payments' && warn ? 'warn' : ''}>
                  <span className="svcs__dot" aria-hidden="true" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <p className="t-label dash__note">{D.disclaimer}</p>
        </div>
      </div>
    </section>
  )
}

function Architecture() {
  const A_ = P.arch
  const layer = useStore((s) => s.ch['devops.layer'] ?? -1)
  const setCh = useStore((s) => s.setCh)
  useEffect(() => () => setCh('devops.layer', -1), [setCh])
  const node = layer >= 0 ? A_.nodes[layer] : null
  return (
    <section className="sec" data-section="arch" data-label={A_.eyebrow} data-grid>
      <div className="wrap g12">
        <div className="col-span-12 md:col-span-6 arch-fig">
          <div className="svc-fig__sticky">
            <div className="anchor anchor--arch" data-anchor="arch" />
          </div>
        </div>
        <div className="col-span-12 md:col-span-6">
          <SectionLabel n="06">{A_.eyebrow}</SectionLabel>
          <Title lines={A_.title} />
          <p className="t-lead mt-6" data-reveal>
            {A_.lead}
          </p>
          <ol className="arch mt-10" data-reveal>
            {A_.nodes.map((n, i) => (
              <li key={n.label}>
                <button
                  type="button"
                  className={`arch__node ${layer === i ? 'is-on' : ''}`}
                  aria-pressed={layer === i}
                  onClick={() => setCh('devops.layer', i)}
                  onMouseEnter={() => setCh('devops.layer', i)}
                  onFocus={() => setCh('devops.layer', i)}
                >
                  <span className="t-label">{String(i + 1).padStart(2, '0')}</span>
                  <span className="arch__l">{n.label}</span>
                  {n.sub ? <span className="t-label">{n.sub}</span> : null}
                </button>
              </li>
            ))}
          </ol>
          <div className="arch__detail mt-6" aria-live="polite">
            <p className="t-label t-sig">{node ? node.k : A_.idleKicker}</p>
            <h3 className="t-h3 mt-3">{node ? node.t : A_.idleTitle}</h3>
            <p className="t-body mt-3">{node ? node.d : A_.idleBody}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function DevOps() {
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/devops-cloud-engineering/">
      <PageHero
        crumb={P.hero.crumb}
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        lead={P.hero.lead}
        primary={{ label: P.hero.primary }}
        secondary={P.hero.secondary}
        aside={<div className="anchor anchor--side" data-anchor="infra" />}
      />
      <section className="cred" data-cover data-section="cred" data-label="Credentials">
        <div className="wrap cred__in" data-reveal>
          <span className="t-label t-sig">{P.credibility.lead}</span>
          {P.credibility.items.map((c) => (
            <span className="t-label" key={c}>
              {c}
            </span>
          ))}
        </div>
      </section>
      <Dashboard />
      <section className="sec sec--tight" data-cover data-section="tools" data-label="Free tools">
        <div className="wrap">
          <div className="cells" style={{ ['--cols' as string]: 2 }}>
            {P.tools.map((t) => (
              <A className="cell" href={t.href} key={t.title} data-reveal>
                <h2 className="t-h3">{t.title}</h2>
                <p className="mt-3">{t.body}</p>
                <p className="t-label mt-6 ext">{t.action}</p>
              </A>
            ))}
          </div>
        </div>
      </section>
      <section className="sec" data-cover data-section="for-you" data-label={P.forYou.eyebrow}>
        <div className="wrap">
          <SectionLabel n="04">{P.forYou.eyebrow}</SectionLabel>
          <Title lines={P.forYou.title} />
          <div className="mt-12">
            <Cells items={P.forYou.items} />
          </div>
        </div>
      </section>
      <section className="sec" data-cover data-section="what" data-label={P.what.eyebrow}>
        <div className="wrap g12">
          <div className="col-span-12 md:col-span-4">
            <SectionLabel n="05">{P.what.eyebrow}</SectionLabel>
            <Title lines={P.what.title} />
          </div>
          <div className="col-span-12 md:col-span-8 mt-10 md:mt-0">
            <Rows items={P.what.items} />
          </div>
        </div>
      </section>
      <Architecture />
      <section className="sec sec--tight" data-cover data-section="mid-cta" data-label="Book a call">
        <div className="wrap midcta" data-reveal>
          <div>
            <h2 className="t-h2">{P.midCta.title}</h2>
            <p className="t-lead mt-4">{P.midCta.body}</p>
          </div>
          <BookBtn>{P.midCta.primary}</BookBtn>
        </div>
      </section>
      <section className="sec" data-cover data-section="where" data-label={P.where.eyebrow}>
        <div className="wrap">
          <SectionLabel n="07">{P.where.eyebrow}</SectionLabel>
          <Title lines={P.where.title} />
          <p className="t-lead mt-6" data-reveal>
            {P.where.lead}
          </p>
          <div className="mt-12">
            <Cells items={P.where.items} />
          </div>
          <p className="t-label mt-6" data-reveal>
            {P.where.note}
          </p>
        </div>
      </section>
      <section className="sec" data-cover data-section="models" data-label={P.models.eyebrow}>
        <div className="wrap">
          <SectionLabel n="08">{P.models.eyebrow}</SectionLabel>
          <Title lines={P.models.title} />
          <div className="models mt-12">
            {P.models.items.map((m) => (
              <div className="model" key={m.name} data-reveal>
                <p className="t-label">{m.price}</p>
                <h3 className="t-h3 mt-3">{m.name}</h3>
                <p className="t-body mt-3">{m.body}</p>
                <ul className="ticks">
                  {m.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <p className="mt-8">
                  <A className="ink-link t-label" href={m.action.href}>
                    {m.action.label}
                  </A>
                </p>
              </div>
            ))}
          </div>
          <p className="t-label mt-6" data-reveal>
            {P.models.note}
          </p>
        </div>
      </section>
      <ProcessSection eyebrow={P.process.eyebrow} title={P.process.title} steps={P.process.steps} n="09" />
      <section className="sec sec--tight" data-cover data-section="stack" data-label={P.stack.eyebrow}>
        <div className="wrap">
          <SectionLabel n="10">{P.stack.eyebrow}</SectionLabel>
          <Title lines={P.stack.title} />
          <ul className="terms mt-10" data-reveal>
            {P.stack.items.map((t) => (
              <li className="chip" key={t}>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Guides eyebrow={P.guides.eyebrow} title={P.guides.title} items={P.guides.items} n="11" />
      <Faq eyebrow={P.faq.eyebrow} title={P.faq.title} items={P.faq.items} n="12" />
      <LeadBox variant="devops" />
      <CtaBand title={P.cta.title} lead={P.cta.lead} primary={P.cta.primary} secondary={P.cta.secondary} />
    </Page>
  )
}
