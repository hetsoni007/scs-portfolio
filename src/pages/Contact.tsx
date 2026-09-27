import { useId, useRef, useState, type FormEvent } from 'react'
import { Page } from '../components/Page'
import { A } from '../components/ui/A'
import { PageHero, Regions } from '../components/ui/Blocks'
import { Btn } from '../components/ui/Buttons'
import { Faq } from '../components/ui/Faq'
import { SectionLabel } from '../components/ui/Type'
import { CONTACT_PAGE as P } from '../content/company'
import { CONTACT_FORM as F, LEAD_FIELDS } from '../content/forms'
import { CALENDLY, EMAIL, PHONE_DISPLAY, SOCIALS, WHATSAPP } from '../content/site'
import { EMAIL_RE, postLead } from '../lib/leads'

function Brief() {
  const id = useId()
  const form = useRef<HTMLFormElement>(null)
  const [bad, setBad] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok'>('idle')

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const v = (k: string) => String(fd.get(k) ?? '').trim()
    // Same rules as the live form: first name + a valid email.
    if (!v('first')) {
      setBad('first')
      form.current?.querySelector<HTMLElement>('[name="first"]')?.focus()
      return
    }
    if (!EMAIL_RE.test(v('email'))) {
      setBad('email')
      form.current?.querySelector<HTMLElement>('[name="email"]')?.focus()
      return
    }
    setBad(null)
    setStatus('sending')
    // The live form shows success regardless of the network result; so do we.
    await postLead({
      kind: 'contact',
      name: `${v('first')} ${v('last')}`.trim(),
      email: v('email'),
      company: v('company'),
      service: v('service'),
      message: v('message'),
    }).catch(() => null)
    setStatus('ok')
  }

  const f = F.fields
  return (
    <div className="intake" id="brief">
      <h2 className="t-h2">{F.title}</h2>
      <p className="t-body mt-3">{F.sub}</p>
      {status === 'ok' ? (
        <div className="form-ok mt-8" role="status">
          <p>
            {F.success.split('book a call')[0]}
            <a className="ink-link" href={CALENDLY} target="_blank" rel="noopener noreferrer">
              book a call
            </a>
            {F.success.split('book a call')[1]}
          </p>
        </div>
      ) : (
        <form ref={form} className="fields mt-8" onSubmit={onSubmit} noValidate>
          <div className={`field ${bad === 'first' ? 'is-err' : ''}`}>
            <label htmlFor={`${id}-fn`}>{f.first.label}</label>
            <input id={`${id}-fn`} name="first" autoComplete="given-name" placeholder={f.first.placeholder} aria-invalid={bad === 'first'} aria-describedby={bad === 'first' ? `${id}-err` : undefined} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-ln`}>{f.last.label}</label>
            <input id={`${id}-ln`} name="last" autoComplete="family-name" placeholder={f.last.placeholder} />
          </div>
          <div className={`field ${bad === 'email' ? 'is-err' : ''}`}>
            <label htmlFor={`${id}-em`}>{f.email.label}</label>
            <input id={`${id}-em`} name="email" type="email" autoComplete="email" placeholder={f.email.placeholder} aria-invalid={bad === 'email'} aria-describedby={bad === 'email' ? `${id}-err` : undefined} />
          </div>
          <div className="field">
            <label htmlFor={`${id}-co`}>{f.company.label}</label>
            <input id={`${id}-co`} name="company" autoComplete="organization" placeholder={f.company.placeholder} />
          </div>
          <div className="field field--full">
            <label htmlFor={`${id}-svc`}>{f.service.label}</label>
            <select id={`${id}-svc`} name="service" defaultValue="">
              <option value="">{f.service.placeholder}</option>
              {f.service.options.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="field field--full">
            <label htmlFor={`${id}-msg`}>{f.message.label}</label>
            <textarea id={`${id}-msg`} name="message" placeholder={f.message.placeholder} />
          </div>
          {bad ? (
            <p className="form-err" id={`${id}-err`} role="alert">
              {bad === 'first' ? LEAD_FIELDS.errors.name : LEAD_FIELDS.errors.email}
            </p>
          ) : null}
          <div className="field--full flex flex-wrap items-center gap-x-6 gap-y-3">
            <Btn type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Sending…' : F.submit}
            </Btn>
            <span className="t-label">{F.note}</span>
          </div>
        </form>
      )}
    </div>
  )
}

export default function Contact() {
  const C = P.channels
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/contact/">
      <PageHero
        crumb={P.hero.crumb}
        eyebrow={P.hero.eyebrow}
        title={P.hero.title}
        lead={P.hero.lead}
        aside={
          <div className="keys-fig" data-cursor="drag">
            <div className="anchor anchor--side" data-anchor="keys" />
            <p className="t-label t-3">Drag, throw, or click a key</p>
          </div>
        }
      />
      <section className="sec" data-cover data-section="channels" data-label="Get in touch">
        <div className="wrap g12">
          <div className="col-span-12 lg:col-span-5">
            <SectionLabel n="01">{P.hero.eyebrow}</SectionLabel>
            <ul className="channels">
              <li>
                <A href={CALENDLY} className="channel channel--hot">
                  <span className="t-label">{C.call.kicker}</span>
                  <span className="channel__t">{C.call.title}</span>
                  <span className="channel__b">{C.call.body}</span>
                </A>
              </li>
              <li>
                <a href={`mailto:${EMAIL}`} className="channel">
                  <span className="t-label">{C.email.kicker}</span>
                  <span className="channel__t">{EMAIL}</span>
                  <span className="channel__b">{C.email.body}</span>
                </a>
              </li>
              <li>
                <A href={SOCIALS[0].href} className="channel">
                  <span className="t-label">{C.linkedin.kicker}</span>
                  <span className="channel__t">{C.linkedin.title}</span>
                  <span className="channel__b">{C.linkedin.body}</span>
                </A>
              </li>
              <li>
                <A href={WHATSAPP} className="channel">
                  <span className="t-label">WhatsApp</span>
                  <span className="channel__t">{PHONE_DISPLAY}</span>
                </A>
              </li>
            </ul>
            <div className="resp mt-10" data-reveal>
              <p className="t-label">{P.response.title}</p>
              <dl>
                {P.response.rows.map((r) => (
                  <div key={r.k}>
                    <dt>{r.k}</dt>
                    <dd>{r.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <div className="col-span-12 lg:col-span-7 mt-12 lg:mt-0" data-reveal>
            <Brief />
          </div>
        </div>
      </section>
      <Regions eyebrow={P.regions.eyebrow} title={P.regions.title} n="02" />
      <Faq title={P.faq.title} items={P.faq.items} n="03" />
    </Page>
  )
}
