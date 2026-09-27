import { Page } from '../components/Page'
import { A } from '../components/ui/A'
import { CtaBand, Regions, Stats } from '../components/ui/Blocks'
import { Faq } from '../components/ui/Faq'
import { LeadBox } from '../components/ui/LeadBox'
import { SectionLabel, Title } from '../components/ui/Type'
import { ABOUT_PAGE as P } from '../content/company'
import { SOCIALS } from '../content/site'

/** About is deliberately quiet: editorial type, generous space, and a single
 *  soft depth-of-field field behind it whose focus follows your reading. */
export default function About() {
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/about/" className="about">
      <section className="sec about__hero" data-section="hero" data-label="Who we are">
        <div className="wrap">
          <nav className="crumb t-label" aria-label="Breadcrumb" data-reveal>
            <a href="/">Home</a>
            <span aria-hidden="true">›</span>
            <span aria-current="page" className="t-2">
              {P.hero.crumb}
            </span>
          </nav>
          <p className="eyebrow" data-reveal>
            <span className="pulse" aria-hidden="true" />
            {P.hero.eyebrow}
          </p>
          <Title as="h1" lines={P.hero.title} className="t-xl mt-8 about__h1" />
          <div className="g12 mt-12">
            <p className="t-lead col-span-12 md:col-span-6 md:col-start-7" data-reveal>
              {P.hero.lead}
            </p>
          </div>
        </div>
      </section>

      <section className="sec" data-section="story" data-label="Story">
        <div className="wrap g12 items-start">
          <aside className="col-span-12 md:col-span-3 about__who" data-reveal>
            <svg className="mono mono--sm" viewBox="0 0 200 200" role="img" aria-label={`${P.story.initials} monogram`}>
              <circle cx="100" cy="100" r="78" />
              <circle cx="100" cy="100" r="92" className="mono__o" />
              <text x="100" y="118" textAnchor="middle">
                {P.story.initials}
              </text>
            </svg>
            <p className="about__name mt-6">{P.story.name}</p>
            <p className="t-label mt-2">{P.story.role}</p>
            <p className="mt-4">
              <A className="chip" href={SOCIALS[0].href}>
                {P.story.linkedin}
              </A>
            </p>
          </aside>
          <div className="col-span-12 md:col-span-8 md:col-start-5 mt-12 md:mt-0">
            <SectionLabel n="01">Story</SectionLabel>
            <Title lines={P.story.title} className="t-h2" />
            {P.story.body.map((b, i) => (
              <p className={`about__p ${i === 0 ? 'about__p--drop' : ''}`} key={i} data-reveal>
                {b}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="sec sec--tight" data-section="numbers" data-label="In numbers">
        <div className="wrap">
          <Stats items={P.stats} />
        </div>
      </section>

      <section className="sec" data-section="values" data-label={P.values.eyebrow}>
        <div className="wrap">
          <SectionLabel n="02">{P.values.eyebrow}</SectionLabel>
          <Title lines={P.values.title} />
          <ol className="values mt-14">
            {P.values.items.map((v, i) => (
              <li className="value" key={v.title} data-reveal>
                <span className="value__n">{['i', 'ii', 'iii'][i]}</span>
                <h3 className="value__t">{v.title}</h3>
                <p className="value__b">{v.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Regions eyebrow={P.regions.eyebrow} title={P.regions.title} n="03" />
      <CtaBand title={P.cta.title} primary={P.cta.primary} secondary={P.cta.secondary} />
      <LeadBox variant="about" />
      <Faq title={P.faq.title} items={P.faq.items} n="04" />
    </Page>
  )
}
