import { useId, useState } from 'react'
import { Rich } from './A'
import { SectionLabel, Title } from './Type'

type Item = { q: string; a: string }

/** Ruled accordion. Question text is verbatim with the live site's FAQPage copy. */
export function Faq({ items, title, eyebrow = 'Common questions', n }: { items: readonly Item[]; title: string; eyebrow?: string; n?: string }) {
  const [open, setOpen] = useState<number | null>(null)
  const base = useId()
  return (
    <section className="sec" data-cover data-section="faq" data-label={eyebrow}>
      <div className="wrap g12">
        <div className="col-span-12 md:col-span-4">
          <SectionLabel n={n}>{eyebrow}</SectionLabel>
          <Title lines={title} className="t-h2" />
        </div>
        <div className="col-span-12 md:col-span-8 md:col-start-5 mt-10 md:mt-0">
          <div className="faq" data-reveal>
            {items.map((it, i) => {
              const isOpen = open === i
              return (
                <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={it.q}>
                  <h3>
                    <button
                      className="faq__q"
                      aria-expanded={isOpen}
                      aria-controls={`${base}-a${i}`}
                      id={`${base}-q${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                    >
                      <span>{it.q}</span>
                      <span className="faq__icon" aria-hidden="true" />
                    </button>
                  </h3>
                  <div className="faq__a" id={`${base}-a${i}`} role="region" aria-labelledby={`${base}-q${i}`} inert={!isOpen}>
                    <div>
                      <p>
                        <Rich text={it.a} />
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
