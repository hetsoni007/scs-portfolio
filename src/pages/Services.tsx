import { useEffect, useRef } from 'react'
import { Page } from '../components/Page'
import { Rich } from '../components/ui/A'
import { CtaBand, Guides, PageHero, Stations } from '../components/ui/Blocks'
import { Faq } from '../components/ui/Faq'
import { LeadBox } from '../components/ui/LeadBox'
import { Chips, SectionLabel, Title } from '../components/ui/Type'
import { SERVICES, SERVICES_PAGE as P } from '../content/services'
import { live } from '../lib/live'
import { scrollToTarget, ScrollTrigger } from '../lib/motion'
import { useStore } from '../state/store'

/** Catalogue: the orbit (3D) stays pinned while the ruled list scrolls; the row
 *  crossing the centre line is the active module, and the point cloud morphs to it.
 *  Clicking a module in the orbit scrolls here (see ServicesScene). */
function Catalogue() {
  const active = useStore((s) => s.ch['services.active'] ?? 0)
  const setCh = useStore((s) => s.setCh)
  const list = useRef<HTMLOListElement>(null)

  useEffect(() => {
    const rows = Array.from(list.current?.querySelectorAll<HTMLElement>('[data-svc]') ?? [])
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setCh('services.active', Number((e.target as HTMLElement).dataset.svc))),
      { rootMargin: '-48% 0px -48% 0px' },
    )
    rows.forEach((r) => io.observe(r))
    return () => io.disconnect()
  }, [setCh])

  // The orbit asks for a module by setting services.jump; we scroll its row into view.
  useEffect(
    () =>
      useStore.subscribe((s, prev) => {
        const j = s.ch['services.jump']
        if (j !== undefined && j !== prev.ch['services.jump']) scrollToTarget(`#svc-${Math.floor(j) % SERVICES.length}`, -window.innerHeight * 0.3)
      }),
    [],
  )

  return (
    <section className="sec" data-section="catalogue" data-label="Services" data-grid>
      <div className="wrap g12">
        <div className="col-span-12 md:col-span-5 svc-fig d-only" data-cursor="drag">
          <div className="svc-fig__sticky">
            <div className="anchor anchor--orbit" data-anchor="orbit" />
            <p className="fig t-label">
              <span>Fig. 02</span>
              <span className="fig__rule" aria-hidden="true" />
              <span>
                Module {SERVICES[active].n} · {SERVICES[active].short}
              </span>
            </p>
            <p className="t-label t-3 mt-3">Drag to spin · click a module</p>
          </div>
        </div>
        <ol className="col-span-12 md:col-span-7 rows" ref={list}>
          {SERVICES.map((s, i) => (
            <li className={`row svc ${active === i ? 'is-on' : ''}`} id={`svc-${i}`} data-svc={i} key={s.n} data-reveal>
              <div className="row__n">
                <span className="t-label">{s.n}</span>
              </div>
              <div>
                <h2 className="t-h3 row__title">{s.title}</h2>
                <p className="row__body">
                  <Rich text={s.body} />
                </p>
                <ul className="ticks">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
                <div className="mt-5">
                  <Chips items={s.chips} />
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** "Five steps. No surprises." — a 3D assembly line compiles one module per station. */
function AssemblyLine() {
  const ref = useRef<HTMLElement>(null)
  const step = useStore((s) => s.ch['services.step'] ?? 0)
  const setCh = useStore((s) => s.setCh)
  const n = P.process.steps.length
  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top 70%',
      end: 'bottom 60%',
      onUpdate: (self) => {
        live.chan['services.line'] = self.progress
        setCh('services.step', Math.min(n - 1, Math.floor(self.progress * n * 0.999)))
      },
    })
    return () => st.kill()
  }, [n, setCh])
  return (
    <section className="sec" ref={ref} data-section="process" data-label={P.process.eyebrow}>
      <div className="wrap">
        <SectionLabel n="02">{P.process.eyebrow}</SectionLabel>
        <Title lines={P.process.title} />
        <div className="anchor anchor--line" data-anchor="line" />
        <Stations steps={P.process.steps} active={step} />
      </div>
    </section>
  )
}

export default function Services() {
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/services/">
      <PageHero
        crumb={P.hero.crumb}
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        lead={P.hero.lead}
        aside={<div className="anchor anchor--side" data-anchor="orbit" />}
      />
      <Catalogue />
      <AssemblyLine />
      <CtaBand title={P.cta.title} lead={P.cta.lead} primary={P.cta.primary} secondary={P.cta.secondary} />
      <Guides eyebrow={P.guides.eyebrow} title={P.guides.title} items={P.guides.items} n="03" />
      <LeadBox variant="services" />
      <Faq title={P.faq.title} items={P.faq.items} n="04" />
    </Page>
  )
}
