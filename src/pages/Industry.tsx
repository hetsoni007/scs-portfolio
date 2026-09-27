import { useLocation } from 'react-router-dom'
import { Page } from '../components/Page'
import { Cells, CtaBand, Guides, PageHero, ProcessSection, Proofs } from '../components/ui/Blocks'
import { Faq } from '../components/ui/Faq'
import { LeadBox } from '../components/ui/LeadBox'
import { SectionLabel, Title } from '../components/ui/Type'
import { INDUSTRIES, INDUSTRY_COMMON as C, industryByPath } from '../content/industries'
import { caseById } from '../content/work'
import { PROCESS_4 } from '../content/site'
import NotFound from './NotFound'
import type { LEAD_VARIANTS } from '../content/forms'

/** One template, four industries. Each gets its own 3D artefact (IndustryScene). */
export default function Industry() {
  const { pathname } = useLocation()
  const ind = industryByPath(pathname.endsWith('/') ? pathname : pathname + '/')
  if (!ind) return <NotFound />
  const cs = caseById(ind.caseId)
  const n = (k: number) => String(k).padStart(2, '0')
  const others = INDUSTRIES.filter((i) => i.slug !== ind.slug)
  return (
    <Page title={ind.meta.title} description={ind.meta.description} path={ind.path} key={ind.slug}>
      <PageHero
        crumb={ind.hero.crumb}
        eyebrow={ind.hero.eyebrow}
        title={ind.hero.title}
        lead={ind.hero.lead}
        primary={{ label: C.primary }}
        secondary={C.secondary}
        aside={<div className="anchor anchor--side" data-anchor="artefact" />}
      />
      <section className="sec" data-cover data-section="build" data-label={C.buildEyebrow}>
        <div className="wrap">
          <SectionLabel n={n(1)}>{C.buildEyebrow}</SectionLabel>
          <Title lines={C.buildTitle} />
          <div className="mt-12">
            <Cells items={ind.build} />
          </div>
        </div>
      </section>
      <section className="sec" data-section="proof" data-label={C.proofEyebrow}>
        <div className="wrap g12 items-center">
          <div className="col-span-12 md:col-span-7">
            <SectionLabel n={n(2)}>{C.proofEyebrow}</SectionLabel>
            <Title lines={ind.proof.title} />
            <p className="t-lead mt-6" data-reveal>
              {ind.proof.lead}
            </p>
            <div className="mt-10">
              <Proofs items={ind.proof.items} action={C.proofAction} />
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 md:col-start-9 mt-10 md:mt-0">
            <div className="anchor anchor--proof" data-anchor="phone" />
            {cs ? (
              <p className="fig t-label">
                <span>On screen</span>
                <span className="fig__rule" aria-hidden="true" />
                <a className="ink-link" href={`/work/${cs.id}/`}>
                  {cs.title}
                </a>
                {cs.kind === 'concept' ? <span className="t-sig">· {cs.status}</span> : null}
              </p>
            ) : null}
          </div>
        </div>
      </section>
      <ProcessSection eyebrow={C.processEyebrow} title={C.processTitle} steps={PROCESS_4} n={n(3)} />
      {ind.guides ? <Guides eyebrow={ind.guides.eyebrow} title={ind.guides.title} items={ind.guides.items} n={n(4)} /> : null}
      <Faq eyebrow={C.faqEyebrow} title={C.faqTitle} items={ind.faq} n={n(ind.guides ? 5 : 4)} />
      <LeadBox variant={ind.leadKind as keyof typeof LEAD_VARIANTS} />
      <CtaBand title={C.cta.title} lead={C.cta.lead} primary={C.cta.primary} secondary={C.cta.secondary}>
        <nav className="mt-16 others" aria-label="Other industries">
          <p className="t-label">Other industries</p>
          <ul>
            {others.map((o) => (
              <li key={o.slug}>
                <a href={o.path} className="ink-link">
                  {o.hero.crumb}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </CtaBand>
    </Page>
  )
}
