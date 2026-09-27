import { useId, useRef, useState, type FormEvent } from 'react'
import { LEAD_FIELDS as F, LEAD_VARIANTS } from '../../content/forms'
import { live as liveUrl } from '../../content/site'
import { EMAIL_RE, postLead } from '../../lib/leads'
import { Btn } from './Buttons'
import { Title } from './Type'

type Status = 'idle' | 'sending' | 'ok'

/**
 * The "Start here" short lead form, one per commercial page. Same fields,
 * validation copy and payload shape as the live site's shared handler.
 */
export function LeadBox({ variant }: { variant: keyof typeof LEAD_VARIANTS }) {
  const v = LEAD_VARIANTS[variant]
  const id = useId()
  const form = useRef<HTMLFormElement>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [err, setErr] = useState<{ field: string | null; msg: string } | null>(null)

  const fail = (field: string | null, msg: string) => {
    setErr({ field, msg })
    if (field) form.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus()
  }

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const val = (k: string) => String(fd.get(k) ?? '').trim()
    setErr(null)
    if (!val('name')) return fail('name', F.errors.name)
    if (!EMAIL_RE.test(val('email'))) return fail('email', F.errors.email)
    if (!val('want')) return fail('want', F.errors.want)
    if (!fd.get('consent')) return fail('consent', F.errors.consent)
    setStatus('sending')
    try {
      const res = await postLead({
        kind: v.kind,
        name: val('name'),
        email: val('email'),
        want: val('want'),
        budget_band: val('budget'),
        timeline: val('timeline'),
        project_type: v.projectType ?? '',
        consent: true,
        website: val('website'), // honeypot, must stay empty
      })
      if (res.ok === false) {
        setStatus('idle')
        return fail(null, res.errors?.[0] ?? F.errors.generic)
      }
      setStatus('ok')
    } catch {
      setStatus('idle')
      fail(null, F.errors.network)
    }
  }

  const bad = (f: string) => (err?.field === f ? 'is-err' : '')

  return (
    <section className="sec" data-cover id="start" data-section="start" data-label={F.kicker}>
      <div className="wrap g12">
        <div className="col-span-12 lg:col-span-4">
          <p className="t-label t-sig" data-reveal>
            {F.kicker}
          </p>
          <Title lines={v.title} className="t-h2 mt-5" />
          <p className="t-body mt-6" data-reveal>
            {v.sub}
          </p>
        </div>
        <div className="col-span-12 lg:col-span-8 mt-10 lg:mt-0" data-reveal>
          <div className="intake">
            {status === 'ok' ? (
              <div className="form-ok" role="status">
                <p>{F.success}</p>
              </div>
            ) : (
              <form ref={form} onSubmit={onSubmit} noValidate aria-describedby={err ? `${id}-err` : undefined}>
                <div className="fields">
                  <div className={`field ${bad('name')}`}>
                    <label htmlFor={`${id}-name`}>{F.name.label}</label>
                    <input id={`${id}-name`} name="name" type="text" autoComplete="name" placeholder={F.name.placeholder} aria-invalid={err?.field === 'name'} />
                  </div>
                  <div className={`field ${bad('email')}`}>
                    <label htmlFor={`${id}-email`}>{F.email.label}</label>
                    <input id={`${id}-email`} name="email" type="email" autoComplete="email" placeholder={F.email.placeholder} aria-invalid={err?.field === 'email'} />
                  </div>
                  <div className={`field field--full ${bad('want')}`}>
                    <label htmlFor={`${id}-want`}>{F.want.label}</label>
                    <input id={`${id}-want`} name="want" type="text" placeholder={F.want.placeholder} aria-invalid={err?.field === 'want'} />
                  </div>
                  <div className="field">
                    <label htmlFor={`${id}-budget`}>{F.budget.label}</label>
                    <select id={`${id}-budget`} name="budget" defaultValue="">
                      <option value="" disabled>
                        {F.budget.placeholder}
                      </option>
                      {F.budget.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <div className="field">
                    <label htmlFor={`${id}-time`}>{F.timeline.label}</label>
                    <select id={`${id}-time`} name="timeline" defaultValue="">
                      <option value="" disabled>
                        {F.timeline.placeholder}
                      </option>
                      {F.timeline.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </div>
                  <label className="consent">
                    <input type="checkbox" name="consent" aria-invalid={err?.field === 'consent'} />
                    <span>
                      {F.consent}{' '}
                      <a className="ink-link" href={liveUrl('/privacy/')} target="_blank" rel="noopener noreferrer">
                        Privacy
                      </a>
                      .
                    </span>
                  </label>
                  {err ? (
                    <p className="form-err" id={`${id}-err`} role="alert">
                      {err.msg}
                    </p>
                  ) : null}
                  <div className="field--full flex flex-wrap items-center gap-x-6 gap-y-3">
                    <Btn type="submit" disabled={status === 'sending'}>
                      {status === 'sending' ? 'Sending…' : F.submit}
                    </Btn>
                    <span className="t-label">{F.note}</span>
                  </div>
                </div>
                <div className="hp" aria-hidden="true">
                  <label>
                    {F.honeypot}
                    <input type="text" name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
