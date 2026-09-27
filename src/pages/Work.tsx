import { useEffect, useRef } from 'react'
import { Page } from '../components/Page'
import { CtaBand, PageHero, Stats, Testimonials } from '../components/ui/Blocks'
import { BookBtn, Bracket } from '../components/ui/Buttons'
import { Faq } from '../components/ui/Faq'
import { LeadBox } from '../components/ui/LeadBox'
import { Chips, SectionLabel, Title } from '../components/ui/Type'
import { CASES, ENTERPRISE, WORK_CTA, WORK_FAQ, WORK_HERO, WORK_STATS } from '../content/work'
import { live } from '../lib/live'
import { ScrollTrigger } from '../lib/motion'
import { useStore } from '../state/store'

const META = {
  title: 'Case Studies: React Native Apps & Enterprise Platforms',
  description:
    'Real React Native and MERN products we shipped — HR, retail, ride-hailing, B2B and healthcare platforms, with the problem, approach and measured result.',
}

/** The depth corridor: scroll flies the camera through the case plates (WorkScene). */
function Corridor() {
  const ref = useRef<HTMLElement>(null)
  const i = useStore((s) => s.ch['work.i'] ?? 0)
  const setCh = useStore((s) => s.setCh)
  const c = CASES[i]
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        live.chan['work.p'] = self.progress
        setCh('work.i', Math.round(self.progress * (CASES.length - 1)))
      },
    })
    live.chan['work.p'] = 0
    setCh('work.i', 0)
    return () => st.kill()
  }, [setCh])

  return (
    <section className="corridor" ref={ref} data-section="cases" data-label="Case studies" style={{ ['--n' as string]: CASES.length }}>
      <div className="corridor__stage">
        <div className="anchor corridor__anchor" data-anchor="corridor" />
        <div className="wrap corridor__ui">
          <div className="corridor__card" key={c.id} aria-live="polite">
            <p className="t-label">
              <span className="t-sig">{String(i + 1).padStart(2, '0')}</span> / {String(CASES.length).padStart(2, '0')} · {c.eyebrow}
            </p>
            <h2 className="t-h2 mt-4">{c.title}</h2>
            <p className="t-body mt-4 corridor__sum">{c.summary}</p>
            <div className="mt-5">
              <Chips items={c.chips.slice(0, 4)} live={c.kind === 'shipped' ? c.status : undefined} concept={c.kind === 'concept' ? c.status : undefined} />
            </div>
            <a className="btn btn--primary mt-6" href={`/work/${c.id}/`}>
              <span>Open case study</span>
              <span className="btn__arrow" aria-hidden="true">
                →
              </span>
            </a>
          </div>
          <nav className="corridor__index" aria-label="Case studies">
            <ol>
              {CASES.map((k, n) => (
                <li key={k.id}>
                  <a
                    href={`/work/${k.id}/`}
                    className={n === i ? 'is-on' : ''}
                    onMouseEnter={() => setCh('work.hover', n)}
                    onMouseLeave={() => setCh('work.hover', -1)}
                    onFocus={() => setCh('work.hover', n)}
                    onBlur={() => setCh('work.hover', -1)}
                  >
                    <span className="t-label">{String(n + 1).padStart(2, '0')}</span>
                    <span>{k.label}</span>
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </section>
  )
}

function Enterprise() {
  const E = ENTERPRISE
  return (
    <section className="sec" data-cover data-section="enterprise" data-label={E.eyebrow}>
      <div className="wrap">
        <SectionLabel n="02">{E.eyebrow}</SectionLabel>
        <Title lines={E.title} className="t-d" />
        <p className="t-lead mt-8" data-reveal style={{ maxWidth: '72ch' }}>
          {E.lead}
        </p>
        <div className="ent mt-16">
          {E.groups.map((g) => (
            <div className="ent__group" key={g.title}>
              <div className="ent__head" data-reveal>
                <h3 className="t-h3">{g.title}</h3>
                <p className="t-body mt-2">{g.intro}</p>
              </div>
              <ul className="ent__items">
                {g.items.map((it) => (
                  <li className="ent__item" key={it.name} data-reveal>
                    <h4 className="ent__name">{it.name}</h4>
                    <p className="t-label mt-2 t-sig">{it.role}</p>
                    <p className="t-body mt-3">{it.desc}</p>
                    <div className="mt-4">
                      <Chips items={it.chips} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="ent__cta mt-16" data-reveal>
          <p className="t-label">{E.cta.eyebrow}</p>
          <h3 className="t-h2 mt-4">{E.cta.title}</h3>
          <p className="t-lead mt-4">{E.cta.lead}</p>
          <div className="actions mt-8">
            <BookBtn>Book a Free Call →</BookBtn>
            <Bracket href="/services/" size="lg">
              Our services
            </Bracket>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Work() {
  return (
    <Page title={META.title} description={META.description} path="/work/">
      <PageHero eyebrow={WORK_HERO.eyebrow} title={WORK_HERO.title} lead={WORK_HERO.lead} />
      <section className="sec sec--tight" data-section="stats" data-label="In numbers" data-cover>
        <div className="wrap">
          <SectionLabel n="01">In numbers</SectionLabel>
          <Stats items={WORK_STATS} />
        </div>
      </section>
      <Corridor />
      <Enterprise />
      <Testimonials eyebrow="What people say" title={['Trusted by clients', 'and collaborators.']} n="03" />
      <CtaBand title={WORK_CTA.title} lead={WORK_CTA.lead} primary="Book a Free Call →" secondary={{ label: 'Explore AI app ideas', href: '/ai-app-development/' }} />
      <LeadBox variant="work" />
      <Faq title={WORK_FAQ.title} items={WORK_FAQ.items} n="04" />
    </Page>
  )
}
