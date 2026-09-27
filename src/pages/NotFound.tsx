import { Page } from '../components/Page'
import { Bracket, Btn } from '../components/ui/Buttons'
import { Title } from '../components/ui/Type'
import { NAV } from '../content/site'

/** 404 — a failed build. The copy is UI, not business claims. */
export default function NotFound() {
  return (
    <Page title="Page not found | Soni Consultancy Services" description="This page doesn't exist." path="/404">
      <section className="sec relative flex min-h-[100svh] items-center" data-section="lost" data-label="Build failed" style={{ paddingTop: 'calc(var(--nav-h) + 40px)' }}>
        <div className="wrap g12 w-full">
          <div className="col-span-12 md:col-span-7">
            <p className="eyebrow t-sig" data-reveal>
              ✕ build failed · 404
            </p>
            <Title as="h1" lines={['This route', "didn't compile."]} className="t-xl mt-7" />
            <p className="t-lead mt-8" data-reveal>
              The page you asked for doesn’t exist. Pick a destination instead.
            </p>
            <div className="actions mt-10" data-reveal>
              <Btn href="/" size="lg">
                Back to home
              </Btn>
              <Bracket href="/contact/" size="lg">
                Contact
              </Bracket>
            </div>
            <ul className="lost mt-12" data-reveal>
              {NAV.map((n) => (
                <li key={n.href}>
                  <a className="ink-link" href={n.href}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-12 md:col-span-5">
            <div className="anchor anchor--side" data-anchor="lost" />
          </div>
        </div>
      </section>
    </Page>
  )
}
