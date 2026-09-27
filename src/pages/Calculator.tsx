import { useEffect, useId, useMemo, useState, type FormEvent, type ReactNode } from 'react'
import { Page } from '../components/Page'
import { Rich } from '../components/ui/A'
import { CtaBand, PageHero } from '../components/ui/Blocks'
import { Btn } from '../components/ui/Buttons'
import { LEAD_FIELDS } from '../content/forms'
import { CALC_PAGE as P } from '../content/secondary'
import { EMAIL_RE, postLead } from '../lib/leads'
import { live } from '../lib/live'
import { useStore } from '../state/store'

const M = P.model
const L = P.labels
const k = (n: number) => '$' + Math.round(n / 1000) + 'k'

/** Verbatim port of the live calculator's compute(). */
function compute(s: { platform: number; stage: number; design: number; backend: number; features: boolean[] }) {
  const base = M.stage[s.stage].base
  const pMult = M.platform[s.platform].mult
  const dMult = M.design[s.design].mult
  const bAdd = M.backend[s.backend].add
  const chosen = M.features.filter((_, i) => s.features[i])
  const feat = chosen.reduce((a, f) => a + f.weeks, 0)
  let weeks = Math.round((base + feat + bAdd) * pMult * dMult)
  if (weeks < 3) weeks = 3
  const lo = Math.round((weeks * M.RATE_LO) / 1000) * 1000
  const hi = Math.round((weeks * M.RATE_HI) / 1000) * 1000
  return { weeks, lo, hi, chosen: chosen.map((f) => f.label), base, bAdd, feat, mult: pMult * dMult }
}

function Group({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="opt">
      <legend className="t-label">{legend}</legend>
      <div className="opt__pills">{children}</div>
    </fieldset>
  )
}

export default function Calculator() {
  const id = useId()
  const [s, setS] = useState({ platform: 0, stage: 0, design: 0, backend: 0, features: M.features.map((f) => !!f.on) })
  const r = useMemo(() => compute(s), [s])
  const setCh = useStore((st) => st.setCh)
  const [form, setForm] = useState<'idle' | 'sending' | 'ok'>('idle')
  const [bad, setBad] = useState<string | null>(null)

  // Feed the weeks tower (CalcScene): blocks are base, each feature, backend.
  useEffect(() => {
    live.chan['calc.weeks'] = r.weeks
    setCh('calc.mask', s.features.reduce((m, on, i) => (on ? m | (1 << i) : m), 0))
    setCh('calc.stage', s.stage)
    setCh('calc.backend', s.backend)
    setCh('calc.mult', Math.round(r.mult * 100))
  }, [r, s, setCh])

  const tags = [M.platform[s.platform].label, M.stage[s.stage].label, ...r.chosen].slice(0, 8)

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = String(fd.get('name') ?? '').trim()
    const email = String(fd.get('email') ?? '').trim()
    if (!name) return setBad('name')
    if (!EMAIL_RE.test(email)) return setBad('email')
    setBad(null)
    setForm('sending')
    await postLead({
      kind: 'calculator',
      name,
      email,
      message: `App cost estimate — ${M.platform[s.platform].label}, ${M.stage[s.stage].label}, ~${r.weeks} weeks, $${r.lo}–$${r.hi}. Features: ${r.chosen.join(', ') || 'core only'}. Design: ${M.design[s.design].value}, backend: ${M.backend[s.backend].value}.`,
    }).catch(() => null)
    setForm('ok')
  }

  const radio = (group: 'platform' | 'stage' | 'design' | 'backend', items: readonly { label: string; hint?: string }[]) =>
    items.map((it, i) => (
      <label key={it.label} className={`pill ${s[group] === i ? 'is-on' : ''}`}>
        <input type="radio" name={group} checked={s[group] === i} onChange={() => setS((o) => ({ ...o, [group]: i }))} />
        {it.label}
        {it.hint ? <span className="pill__w">{it.hint}</span> : null}
      </label>
    ))

  return (
    <Page title={P.meta.title} description={P.meta.description} path="/app-cost-calculator/">
      <PageHero crumb={P.hero.crumb} eyebrow={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} aside={<div className="anchor anchor--side" data-anchor="tower" />} />
      <section className="sec" data-section="calculator" data-label="Estimator">
        <div className="wrap g12 items-start">
          <div className="col-span-12 lg:col-span-7 calc">
            <Group legend={L.groups.platform}>{radio('platform', M.platform)}</Group>
            <Group legend={L.groups.stage}>{radio('stage', M.stage)}</Group>
            <Group legend={L.groups.features}>
              {M.features.map((f, i) => (
                <label key={f.label} className={`pill ${s.features[i] ? 'is-on' : ''}`}>
                  <input
                    type="checkbox"
                    checked={s.features[i]}
                    onChange={() => setS((o) => ({ ...o, features: o.features.map((v, j) => (j === i ? !v : v)) }))}
                  />
                  {f.label}
                  <span className="pill__w">{f.weeks}</span>
                </label>
              ))}
            </Group>
            <Group legend={L.groups.design}>{radio('design', M.design)}</Group>
            <Group legend={L.groups.backend}>{radio('backend', M.backend)}</Group>
          </div>
          <aside className="col-span-12 lg:col-span-5 calc__side">
            <div className="calc__sticky">
              <div className="anchor anchor--tower" data-anchor="tower" />
              <div className="result" aria-live="polite">
                <p className="t-label">{L.result}</p>
                <p className="result__v">
                  {k(r.lo)} – {k(r.hi)}
                </p>
                <p className="t-label mt-2">{L.range}</p>
                <dl className="result__rows">
                  <div>
                    <dt>{L.timeline}</dt>
                    <dd>~{r.weeks} weeks</dd>
                  </div>
                  <div>
                    <dt>{L.team}</dt>
                    <dd>{L.teamValue}</dd>
                  </div>
                  <div>
                    <dt>{L.pricing}</dt>
                    <dd>{L.pricingValue}</dd>
                  </div>
                </dl>
                <div className="chips mt-4">
                  {tags.map((t) => (
                    <span className="chip" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
                {form === 'ok' ? (
                  <div className="form-ok mt-6" role="status">
                    <p>
                      <Rich text={L.success} />
                    </p>
                  </div>
                ) : (
                  <form className="fields mt-6" onSubmit={submit} noValidate>
                    <div className={`field ${bad === 'name' ? 'is-err' : ''}`}>
                      <label htmlFor={`${id}-n`}>{L.name.label}</label>
                      <input id={`${id}-n`} name="name" autoComplete="name" placeholder={L.name.placeholder} aria-invalid={bad === 'name'} />
                    </div>
                    <div className={`field ${bad === 'email' ? 'is-err' : ''}`}>
                      <label htmlFor={`${id}-e`}>{L.email.label}</label>
                      <input id={`${id}-e`} name="email" type="email" autoComplete="email" placeholder={L.email.placeholder} aria-invalid={bad === 'email'} />
                    </div>
                    {bad ? (
                      <p className="form-err" role="alert">
                        {bad === 'name' ? LEAD_FIELDS.errors.name : LEAD_FIELDS.errors.email}
                      </p>
                    ) : null}
                    <div className="field--full">
                      <Btn type="submit" size="lg" disabled={form === 'sending'}>
                        {form === 'sending' ? 'Sending…' : L.submit}
                      </Btn>
                      <p className="t-body mt-3" style={{ fontSize: '0.88rem' }}>
                        {L.note}
                      </p>
                    </div>
                  </form>
                )}
                <p className="t-label mt-6">{L.disclaimer}</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
      <CtaBand title={P.cta.title} lead={P.cta.lead} primary={P.cta.primary} secondary={P.cta.secondary} />
    </Page>
  )
}
