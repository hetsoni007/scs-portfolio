import { Page } from '../components/Page'
import { A } from '../components/ui/A'
import { Cells, CtaBand, Guides, PageHero, ProcessSection, Proofs } from '../components/ui/Blocks'
import { Faq } from '../components/ui/Faq'
import { LeadBox } from '../components/ui/LeadBox'
import { SectionLabel, Title } from '../components/ui/Type'
import { RN_PAGE as P } from '../content/secondary'
import { PROCESS_4 } from '../content/site'

export default function ReactNative() {
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/react-native-app-development/">
      <PageHero
        crumb={P.hero.crumb}
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        lead={P.hero.lead}
        primary={{ label: P.hero.primary }}
        secondary={P.hero.secondary}
        aside={<div className="anchor anchor--side" data-anchor="twin" />}
      />
      <section className="sec" data-cover data-section="build" data-label={P.build.eyebrow}>
        <div className="wrap">
          <SectionLabel n="01">{P.build.eyebrow}</SectionLabel>
          <Title lines={P.build.title} />
          <div className="mt-12">
            <Cells items={P.build.items} />
          </div>
        </div>
      </section>
      <section className="sec" data-cover data-section="proof" data-label={P.proof.eyebrow}>
        <div className="wrap">
          <SectionLabel n="02">{P.proof.eyebrow}</SectionLabel>
          <Title lines={P.proof.title} />
          <p className="t-lead mt-6" data-reveal>
            {P.proof.lead}
          </p>
          <div className="mt-10">
            <Proofs items={P.proof.items} action={P.proof.action} />
          </div>
        </div>
      </section>
      <ProcessSection eyebrow="Process" title={['Idea to app store,', 'without the drama.']} steps={PROCESS_4} n="03" />
      <section className="sec sec--tight" data-cover data-section="regions" data-label={P.regions.eyebrow}>
        <div className="wrap">
          <SectionLabel n="04">{P.regions.eyebrow}</SectionLabel>
          <Title lines={P.regions.title} />
          <ul className="geo mt-10" data-reveal>
            {P.regions.items.map((r) => (
              <li key={r.href}>
                <A href={r.href} className="geo__a ext">
                  {r.label}
                </A>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Guides eyebrow={P.guides.eyebrow} title={P.guides.title} items={P.guides.items} n="05" />
      <Faq eyebrow={P.faq.eyebrow} title={P.faq.title} items={P.faq.items} n="06" />
      <LeadBox variant="react-native" />
      <CtaBand title={P.cta.title} lead={P.cta.lead} primary={P.cta.primary} secondary={P.cta.secondary} />
    </Page>
  )
}
