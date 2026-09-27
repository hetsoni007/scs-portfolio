import { BRAND, FOOTER, SOCIALS } from '../../content/site'
import { A } from '../ui/A'
import { Plus } from '../ui/Type'

export function Footer() {
  return (
    <footer className="foot" data-section="footer" data-label="Footer">
      <div className="wrap">
        <p className="t-label foot__k">
          <Plus className="t-sig" /> {BRAND.name}
        </p>
        <p className="foot__big">{BRAND.tagline}</p>
        <div className="foot__cols">
          {FOOTER.map((col) => (
            <nav className="foot__col" key={col.title} aria-label={col.title}>
              <h2 className="t-label">{col.title}</h2>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <A href={l.href} className={/^https?:/.test(l.href) ? 'ext' : undefined}>
                      {l.label}
                    </A>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="foot__base">
          <div className="socials">
            {SOCIALS.map((s) => (
              <A key={s.label} href={s.href} aria-label={`${s.label} (opens in a new tab)`}>
                {s.label}
              </A>
            ))}
          </div>
          <p className="t-label">
            {BRAND.copyright} <span className="t-sig">·</span> {BRAND.strap}
          </p>
        </div>
      </div>
      <p className="foot__sig" aria-hidden="true" />
    </footer>
  )
}
