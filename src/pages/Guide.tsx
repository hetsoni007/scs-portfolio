import { useId, useState, type FormEvent } from 'react'
import { Page } from '../components/Page'
import { A } from '../components/ui/A'
import { Bracket, BookBtn, Btn } from '../components/ui/Buttons'
import { Faq } from '../components/ui/Faq'
import { SectionLabel, Title } from '../components/ui/Type'
import { GUIDE_PAGE as P } from '../content/secondary'
import { CALENDLY, live as liveUrl } from '../content/site'
import { postLead } from '../lib/leads'

function GuideForm() {
  const F = P.form
  const id = useId()
  const [done, setDone] = useState(false)
  const [err, setErr] = useState('')
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const v = (k: string) => String(fd.get(k) ?? '').trim()
    if (!v('name') || !v('email')) return setErr(F.required)
    setErr('')
    // As on the live page: the download is revealed whether or not the POST succeeds.
    postLead({ kind: 'app_scoping_guide', name: v('name'), email: v('email'), company: v('company'), stage: v('stage'), message: 'Downloaded free app scoping guide' }).catch(() => null)
    setDone(true)
  }
  return (
    <div className="intake" id="form">
      <h2 className="t-h3">{F.title}</h2>
      <p className="t-body mt-2">{F.sub}</p>
      {done ? (
        <div className="form-ok mt-6" role="status">
          <div>
            <p className="t-h3">{F.successTitle}</p>
            <p className="mt-2">{F.successBody}</p>
            <p className="mt-5">
              <A className="btn btn--primary" href={F.download.href}>
                <span>{F.download.label}</span>
                <span className="btn__arrow" aria-hidden="true">
                  ↓
                </span>
              </A>
            </p>
            <p className="mt-5">
              <A className="ink-link" href={CALENDLY}>
                {F.talk}
              </A>
            </p>
          </div>
        </div>
      ) : (
        <form className="fields mt-6" onSubmit={onSubmit} noValidate style={{ gridTemplateColumns: '1fr' }}>
          <div className="field">
            <label htmlFor={`${id}-n`}>{F.fields.name.label}</label>
            <input id={`${id}-n`} name="name" autoComplete="given-name" placeholder={F.fields.name.placeholder} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-e`}>{F.fields.email.label}</label>
            <input id={`${id}-e`} name="email" type="email" autoComplete="email" placeholder={F.fields.email.placeholder} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-c`}>{F.fields.company.label}</label>
            <input id={`${id}-c`} name="company" autoComplete="organization" placeholder={F.fields.company.placeholder} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-s`}>{F.fields.stage.label}</label>
            <select id={`${id}-s`} name="stage" defaultValue="">
              <option value="">{F.fields.stage.placeholder}</option>
              {F.fields.stage.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          {err ? (
            <p className="form-err" role="alert">
              {err}
            </p>
          ) : null}
          <div>
            <Btn type="submit" size="lg">
              {F.submit}
            </Btn>
            <p className="t-label mt-4">
              {F.legal.replace(' privacy policy.', ' ')}
              <a className="ink-link" href={liveUrl('/privacy/')} target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>
              .
            </p>
          </div>
        </form>
      )}
    </div>
  )
}

export default function Guide() {
  const H = P.hero
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/app-scoping-guide/">
      <section className="sec guide-hero" data-section="hero" data-label="Free guide">
        <div className="wrap g12 items-start">
          <div className="col-span-12 lg:col-span-7">
            <p className="eyebrow" data-reveal>
              <span className="pulse" aria-hidden="true" />
              {H.eyebrow}
            </p>
            <Title as="h1" lines={H.title} className="t-d mt-7" />
            <p className="t-lead mt-8" data-reveal>
              {H.lead}
            </p>
            <ul className="includes mt-10" data-reveal>
              {H.includes.map((i) => (
                <li key={i.title}>
                  <h2 className="includes__t">
                    <span className="t-bone" aria-hidden="true">
                      ✓
                    </span>{' '}
                    {i.title}
                  </h2>
                  <p>{i.body}</p>
                </li>
              ))}
            </ul>
            <p className="t-body mt-8" data-reveal>
              {H.note}
            </p>
            <div className="actions mt-8" data-reveal>
              <Btn href={H.primary.href} size="lg" arrow={false}>
                {H.primary.label}
              </Btn>
              <Bracket href={CALENDLY} size="lg">
                {H.secondary}
              </Bracket>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 mt-12 lg:mt-0 guide-side">
            <div className="anchor anchor--booklet" data-anchor="booklet" />
            <GuideForm />
          </div>
        </div>
      </section>
      <section className="sec" data-cover data-section="why" data-label={P.why.eyebrow}>
        <div className="wrap">
          <SectionLabel n="01">{P.why.eyebrow}</SectionLabel>
          <Title lines={P.why.title} className="t-h2" />
          <ol className="rows mt-12">
            {P.why.items.map((w, i) => (
              <li className="row" key={w.title} data-reveal>
                <div className="row__n">
                  <span className="t-label t-sig">✕ {String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="row__body">
                  <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{w.title}</strong> — {w.body}
                </p>
              </li>
            ))}
          </ol>
          <p className="t-lead mt-10" data-reveal>
            {P.why.close}
          </p>
        </div>
      </section>
      <section className="sec" data-cover data-section="who" data-label={P.who.eyebrow}>
        <div className="wrap g12">
          <div className="col-span-12 md:col-span-5">
            <SectionLabel n="02">{P.who.eyebrow}</SectionLabel>
            <Title lines={P.who.title} className="t-h2" />
          </div>
          <div className="col-span-12 md:col-span-7 mt-8 md:mt-0">
            {P.who.body.map((b) => (
              <p className="t-body mt-5" key={b.slice(0, 16)} data-reveal>
                {b}
              </p>
            ))}
          </div>
        </div>
      </section>
      <Faq eyebrow={P.faq.eyebrow} title={P.faq.title} items={P.faq.items} n="03" />
      <section className="sec ctaband" data-section="cta" data-label="Book a call">
        <div className="wrap">
          <Title lines={P.cta.title} className="t-d" />
          <p className="t-lead mt-6" data-reveal>
            {P.cta.lead}
          </p>
          <div className="actions mt-10" data-reveal>
            <Btn href={P.cta.primary.href} size="lg" arrow={false}>
              {P.cta.primary.label}
            </Btn>
            <BookBtn>{P.cta.secondary}</BookBtn>
          </div>
        </div>
      </section>
    </Page>
  )
}
