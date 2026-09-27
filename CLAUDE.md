# CLAUDE.md — scs-portfolio

Project context for **https://portfolio.soniconsultancyservices.com**, the interactive 3D
site for Soni Consultancy Services (founder Het Soni). Split out of `hetsoni007/SCS`
(`site-3d/`) on 2026-09-27. The main site, soniconsultancyservices.com, is static HTML in
that repo; its content is the source of truth for everything said here (`CONTENT.md`).

- Run / build / deploy: `README.md`. Visual system: `DESIGN.md` ("Ignite": blood red on
  black, Ruthie script + Stack Sans, procedural fire, sigil line art).
- Deploy = push to `main` (GitHub Actions → S3 + CloudFront invalidation). Needs the repo
  secrets/variables listed in README → Deploy.

## Hard rules (inherited from the main site — never break)
- NEVER invent metrics, store links, tech stacks, testimonials, social URLs or pricing.
  If information is missing, stop and ask.
- Portfolio case studies never show the real client/product name (NDA). Generic
  industry labels only (e.g. "HR & Payroll Platform"), no App Store / Play Store links;
  "Live on the App Store & Google Play" is a plain, non-linking badge. Screens must be
  checked for baked-in real names/logos before use; asset filenames use the generic slug.
- Concepts (Web3 Creator, Fan Investment) stay labelled "Product & UI/UX design concept".
  Healthcare Staffing figures are research, not results.
- Copy is verbatim from the main site. The only added lines are SCS's own words
  (e.g. "Ship over slideware" from the About values).
- The design borrows meermohsin.me's *language* only. Never copy its images, GIFs,
  audio, copy or code. Fire (`src/lib/fire.ts`) and sound (`src/lib/sound.ts`) are
  generated in code.

## Gotchas
- CSP on the distribution is `font-src 'self'`: every font must be self-hosted in
  `public/fonts/` (no Google Fonts CDN).
- Blood red `#990000` is a surface colour only (2.3:1 on black). Red text uses
  `--signal` (small) or `--script` (large). Re-run axe after colour changes.
- Heading `<em>` renders as Ruthie script; `.line-mask:has(em)` gives swashes room
  inside the reveal clip. Keep emphasis to the last line / a few words.
- Sound must stay off by default and start only from a user gesture.
- GA4 loads only on `*.soniconsultancyservices.com` (see `index.html`).
- Secret-scan before every commit: `git grep -nE 'AKIA[0-9A-Z]{16}'`.
