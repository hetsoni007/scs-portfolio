import { Page } from '../components/Page'
import { Cells, CtaBand, PageHero, ProcessSection } from '../components/ui/Blocks'
import { Faq } from '../components/ui/Faq'
import { LeadBox } from '../components/ui/LeadBox'
import { Chips, SectionLabel, Title } from '../components/ui/Type'
import { HIRE_PAGE as P } from '../content/secondary'
import { useStore } from '../state/store'

export default function Hire() {
  const model = useStore((s) => s.ch['hire.model'] ?? 1)
  const setCh = useStore((s) => s.setCh)
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/hire/">
      <PageHero
        crumb={P.hero.crumb}
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        lead={P.hero.lead}
        primary={{ label: P.hero.primary }}
        secondary={P.hero.secondary}
        aside={<div className="anchor anchor--side" data-anchor="pods" />}
      />
      <section className="sec" data-cover data-section="models" data-label={P.models.eyebrow}>
        <div className="wrap">
          <SectionLabel n="01">{P.models.eyebrow}</SectionLabel>
          <Title lines={P.models.title} />
          <div className="models mt-12">
            {P.models.items.map((m, i) => (
              <div
                className={`model ${model === i ? 'model--on' : ''}`}
                key={m.title}
                data-reveal
                onMouseEnter={() => setCh('hire.model', i)}
                onFocus={() => setCh('hire.model', i)}
                tabIndex={-1}
              >
                <div className="flex items-center justify-between gap-3">
                  <p className="t-label">{String(i + 1).padStart(2, '0')}</p>
                  {m.badge ? <span className="chip chip--sig">{m.badge}</span> : null}
                </div>
                <h3 className="t-h3 mt-4">{m.title}</h3>
                <p className="t-body mt-3">{m.body}</p>
                <ul className="ticks">
                  {m.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Chips items={m.chips} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec" data-cover data-section="skills" data-label={P.skills.eyebrow}>
        <div className="wrap">
          <SectionLabel n="02">{P.skills.eyebrow}</SectionLabel>
          <Title lines={P.skills.title} />
          <div className="mt-12">
            <Cells items={P.skills.items.map((s) => ({ title: s.title, body: s.body, k: s.chips.join(' · ') }))} />
          </div>
        </div>
      </section>
      <ProcessSection eyebrow={P.process.eyebrow} title={P.process.title} steps={P.process.steps} n="03" />
      <section className="sec sec--tight" data-cover data-section="ir35" data-label="IR35">
        <div className="wrap">
          <div className="callout" data-reveal>
            <p className="t-label t-sig">UK · IR35</p>
            <h2 className="t-h2 mt-4">{P.ir35.title}</h2>
            <p className="t-lead mt-5">{P.ir35.body}</p>
          </div>
        </div>
      </section>
      <CtaBand title={P.cta.title} lead={P.cta.lead} primary={P.cta.primary} secondary={P.cta.secondary} />
      <LeadBox variant="hire" />
      <Faq title={P.faq.title} items={P.faq.items} n="04" />
    </Page>
  )
}
