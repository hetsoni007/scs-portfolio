import { useMemo, useState } from 'react'
import { Page } from '../components/Page'
import { A } from '../components/ui/A'
import { CtaBand, PageHero } from '../components/ui/Blocks'
import { BookBtn } from '../components/ui/Buttons'
import { LeadBox } from '../components/ui/LeadBox'
import { BLOG_PAGE as P, POSTS } from '../content/blog'
import { live } from '../content/site'
import { useStore } from '../state/store'

/** Blog index. Articles themselves live on the live site, so cards link out. */
export default function Blog() {
  const [filter, setFilter] = useState('all')
  const setCh = useStore((s) => s.setCh)
  const list = useMemo(() => POSTS.filter((p) => filter === 'all' || (p.cats as string[]).includes(filter)), [filter])
  const cut = list.findIndex((p) => p.slug === P.inline.after)
  const F = P.featured
  return (
    <Page title={P.meta.title} description={P.meta.description} path="/blog/">
      <PageHero crumb={P.hero.crumb} eyebrow={P.hero.eyebrow} title={P.hero.title} lead={P.hero.lead} size="t-xl" />
      <section className="sec sec--tight" data-cover data-section="featured" data-label="Featured">
        <div className="wrap">
          <A href={live(`/blog/${F.slug}`)} className="feat" data-reveal data-cursor="read">
            <span className="chip chip--sig">{F.kicker}</span>
            <span className="feat__t">{F.title}</span>
            <span className="feat__b">{F.excerpt}</span>
            <span className="t-label">
              {F.tags} · {F.read}
            </span>
          </A>
        </div>
      </section>
      <section className="sec" data-cover data-section="posts" data-label="Articles">
        <div className="wrap">
          <div className="filters" role="group" aria-label="Filter articles" data-reveal>
            {P.filters.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`tab ${filter === f.key ? 'is-on' : ''}`}
                aria-pressed={filter === f.key}
                onClick={() => {
                  setFilter(f.key)
                  setCh('blog.filter', P.filters.findIndex((x) => x.key === f.key))
                }}
              >
                {f.label}
              </button>
            ))}
            <span className="t-label ml-auto">{list.length} articles</span>
          </div>
          <ol className="posts mt-8">
            {list.map((p, i) => (
              <li key={p.slug}>
                <A href={live(`/blog/${p.slug}`)} className="post">
                  <span className="t-label post__n">{String(i + 1).padStart(2, '0')}</span>
                  <span className="post__main">
                    <span className="t-label">{p.tags}</span>
                    <span className="post__t">{p.title}</span>
                    <span className="post__b">{p.excerpt}</span>
                  </span>
                  <span className="post__more t-label ext">{P.readMore}</span>
                </A>
                {i === cut ? (
                  <div className="inline-cta">
                    <p className="t-label t-sig">{P.inline.kicker}</p>
                    <p className="t-h3 mt-2">{P.inline.title}</p>
                    <p className="t-body mt-2">{P.inline.body}</p>
                    <div className="mt-5">
                      <BookBtn size="md">{P.inline.primary}</BookBtn>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </section>
      <LeadBox variant="blog" />
      <CtaBand title={P.cta.title} lead={P.cta.lead} primary={P.cta.primary} secondary={P.cta.secondary} />
    </Page>
  )
}
