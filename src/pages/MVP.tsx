import { Page } from '../components/Page'
import { Rich } from '../components/ui/A'
import { Cells, CtaBand, Guides, PageHero, ProcessSection, Proofs } from '../components/ui/Blocks'
import { Bracket, Btn } from '../components/ui/Buttons'
import { Faq } from '../components/ui/Faq'
import { LeadBox } from '../components/ui/LeadBox'
import { SectionLabel, Title } from '../components/ui/Type'
import { MVP_PAGE as P } from '../content/secondary'
import { useStore } from '../state/store'

const AXIS = 44 // weeks shown on the timeline axis (drawing only)

function Timeline() {
  const T = P.timeline
  return (
    <section className="sec" data-cover data-section="timeline" data-label={T.eyebrow}>
      <div className="wrap">
        <SectionLabel n="04">{T.eyebrow}</SectionLabel>
        <Title lines={T.title} />
        <p className="t-lead mt-6" data-reveal>
          {T.lead}
        </p>
        <div className="bands mt-14" data-reveal>
          <svg className="bands__axis" viewBox={`0 0 ${AXIS} 6`} preserveAspectRatio="none" aria-hidden="true" data-draw>
            <line x1="0" y1="3" x2={AXIS} y2="3" vectorEffect="non-scaling-stroke" />
            {Array.from({ length: AXIS / 4 + 1 }, (_, i) => (
              <line key={i} x1={i * 4} x2={i * 4} y1="1" y2="5" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
          <div className="bands__ticks t-label" aria-hidden="true">
            {Array.from({ length: AXIS / 8 + 1 }, (_, i) => (
              <span key={i} style={{ left: `${((i * 8) / AXIS) * 100}%` }}>
                {i * 8}
              </span>
            ))}
            <span style={{ left: '100%' }}>wk</span>
          </div>
          <ol className="bands__list">
            {T.bands.map((b) => (
              <li key={b.range} className="band">
                <div className="band__bar" style={{ marginLeft: `${(b.from / AXIS) * 100}%`, width: `${((b.open ? AXIS - b.from : b.to - b.from) / AXIS) * 100}%` }} data-open={b.open ? '' : undefined}>
                  <span className="t-label">{b.range}</span>
                </div>
                <p className="band__t">
                  <strong>{b.name}</strong> {b.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
        <p className="t-body mt-8" data-reveal>
          <Rich text={T.more} />
        </p>
      </div>
    </section>
  )
}

export default function MVP() {
  const bucket = useStore((s) => s.ch['mvp.bucket'] ?? 0)
  const setCh = useStore((s) => s.setCh)
  const B = P.buckets
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/mvp-development/">
      <PageHero
        crumb={P.hero.crumb}
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        lead={P.hero.lead}
        primary={{ label: P.hero.primary }}
        secondary={P.hero.secondary}
        aside={<div className="anchor anchor--side" data-anchor="buckets" />}
      />
      <section className="sec" data-section="buckets" data-label={B.eyebrow}>
        <div className="wrap">
          <SectionLabel n="01">{B.eyebrow}</SectionLabel>
          <Title lines={B.title} />
          <p className="t-lead mt-6" data-reveal>
            {B.lead}
          </p>
          <div className="cells mt-12" style={{ ['--cols' as string]: 3 }}>
            {B.items.map((it, i) => (
              <div
                className={`cell bucket ${bucket === i ? 'is-on' : ''}`}
                key={it.tag}
                data-reveal
                onMouseEnter={() => setCh('mvp.bucket', i)}
                onFocus={() => setCh('mvp.bucket', i)}
                tabIndex={-1}
              >
                <div className="cell__k">
                  <span className="chip chip--sig">{it.tag}</span>
                </div>
                <h3 className="t-h3">{it.title}</h3>
                <p>{it.body}</p>
              </div>
            ))}
          </div>
          <blockquote className="pull mt-12" data-reveal>
            {B.test}
          </blockquote>
        </div>
      </section>
      <section className="sec" data-cover data-section="get" data-label={P.get.eyebrow}>
        <div className="wrap">
          <SectionLabel n="02">{P.get.eyebrow}</SectionLabel>
          <Title lines={P.get.title} />
          <div className="mt-12">
            <Cells items={P.get.items} />
          </div>
        </div>
      </section>
      <Timeline />
      <section className="sec" data-cover data-section="budget" data-label={P.budget.eyebrow}>
        <div className="wrap g12">
          <div className="col-span-12 md:col-span-5">
            <SectionLabel n="05">{P.budget.eyebrow}</SectionLabel>
            <Title lines={P.budget.title} />
          </div>
          <div className="col-span-12 md:col-span-7 mt-8 md:mt-0">
            <p className="t-lead" data-reveal>
              {P.budget.lead}
            </p>
            <p className="t-body mt-6" data-reveal>
              {P.budget.body}
            </p>
            <div className="actions mt-8" data-reveal>
              <Btn href={P.budget.primary.href}>{P.budget.primary.label}</Btn>
              <Bracket href={P.budget.secondary.href}>{P.budget.secondary.label}</Bracket>
            </div>
          </div>
        </div>
      </section>
      <ProcessSection eyebrow={P.process.eyebrow} title={P.process.title} steps={P.process.steps} n="06" />
      <section className="sec" data-cover data-section="proof" data-label={P.proof.eyebrow}>
        <div className="wrap">
          <SectionLabel n="07">{P.proof.eyebrow}</SectionLabel>
          <Title lines={P.proof.title} />
          <p className="t-lead mt-6" data-reveal>
            {P.proof.lead}
          </p>
          <div className="mt-10">
            <Proofs items={P.proof.items} action={P.proof.action} />
          </div>
        </div>
      </section>
      <section className="sec" data-cover data-section="reading" data-label={P.reading.eyebrow}>
        <div className="wrap">
          <SectionLabel n="08">{P.reading.eyebrow}</SectionLabel>
          <Title lines={P.reading.title} />
          <div className="mt-12">
            <Cells items={P.reading.items} />
          </div>
        </div>
      </section>
      <Guides eyebrow={P.guides.eyebrow} title={P.guides.title} items={P.guides.items} n="09" />
      <Faq eyebrow={P.faq.eyebrow} title={P.faq.title} items={P.faq.items} n="10" />
      <LeadBox variant="mvp" />
      <CtaBand title={P.cta.title} lead={P.cta.lead} primary={P.cta.primary} secondary={P.cta.secondary} />
    </Page>
  )
}
