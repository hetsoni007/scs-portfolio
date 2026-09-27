# scs-portfolio: "Ignite"

**Live: https://portfolio.soniconsultancyservices.com**

An interactive, WebGL-forward rebuild of soniconsultancyservices.com for Soni
Consultancy Services. It has the same content as the main site (verbatim, see
`CONTENT.md`) and its own visual system (`DESIGN.md`): blood red on black, Ruthie
script against thin Stack Sans, procedural fire and sacred-geometry line art, after
the reference meermohsin.me.

This repo was split out of `hetsoni007/SCS` (where it lived as `site-3d/`). The main
site, soniconsultancyservices.com, is static HTML and still deploys from that repo.

## Run it

```bash
npm ci
npm run dev        # http://localhost:5178
npm run build      # typecheck + production build → dist/
npm run preview    # serve dist/ on http://localhost:4178
```

On a network where the IPv6 route to npm is slow, prefix installs with
`NODE_OPTIONS=--dns-result-order=ipv4first`.

Useful URL flags:
- `?tier=high|medium|low|off` forces a 3D quality tier. `off` shows the no-WebGL
  line-drawing posters.
- The loader runs once per browser session. Clear `sessionStorage` to see it again.

## Deploy

Every push to `main` builds the site and uploads `dist/` to the S3 bucket behind
`portfolio.soniconsultancyservices.com`, then invalidates its CloudFront
distribution (`.github/workflows/deploy.yml`). It can also be run by hand from the
Actions tab (**Deploy → Run workflow**).

One-time setup, in the repo's **Settings → Secrets and variables → Actions**:

| kind | name | value |
|---|---|---|
| Secret | `AWS_ACCESS_KEY_ID` | an IAM key allowed to write the bucket and invalidate the distribution |
| Secret | `AWS_SECRET_ACCESS_KEY` | its secret |
| Variable | `S3_BUCKET` | the portfolio bucket name |
| Variable | `CLOUDFRONT_DISTRIBUTION_ID` | the portfolio distribution ID |

Until those exist the workflow stops at its first step and says which are missing.
The bucket and distribution IDs are in the owner's local `.deploy/RESOURCES.md` in the
SCS repo; they are deliberately not committed here.

Upload order and caching:
1. `assets/*` (content-hashed bundles): `max-age=1 year, immutable`. Old bundles are
   kept, so a tab that loaded the previous version keeps working.
2. Everything else except `index.html`, with `--delete` so removed files go away:
   `max-age=1 day`.
3. `index.html` last, with `no-cache`, so it only ever points at bundles that are
   already uploaded.

The distribution already serves `index.html` for deep links such as `/work/hr-payroll/`
(the app is a client-routed SPA), and its response-headers policy sets the CSP. Neither
is managed from this repo. The CSP allows fonts from `'self'` only, which is why every
font is self-hosted.

## The concept

The site ignites. Every 3D object has a **source** state (blood-red line art) and a
**built** state (lit material), and an ember-red burn edge turns one into the other.
The first visit opens on a script counter that burns away; every route change is a
procedural flame wipe with the destination written in script. An optional ambient
soundtrack is synthesized in WebAudio (off by default). The full rationale is in
`DESIGN.md`.

## Stack

| | |
|---|---|
| App | Vite 8 · React 19 · TypeScript · React Router 7 |
| 3D | three.js 0.186 · @react-three/fiber 9 · `postprocessing` (bloom, high tier only) · cannon-es (contact keycaps) |
| Motion | GSAP + ScrollTrigger (the only DOM motion engine) · Lenis inertia scroll |
| State | Zustand (theme, tier, page ↔ scene channels) plus a plain mutable `live` object for per-frame values |
| Styling | Tailwind 3 for layout utilities only. Everything visual is bespoke CSS on design tokens |
| Fonts | Stack Sans Headline + Stack Sans Text (variable), Ruthie, Bebas Neue: all OFL, self-hosted woff2 |

`@react-three/drei` is not used. The few helpers that would have come from it
(rounded box, lightformer environment, frame-time monitor, anchor tracking) are small
and written in-house (`src/three/`). This keeps the dependency tree lean. drei pulls
in hls.js, MediaPipe and ~20 other packages.

## How it fits together

```
src/
  content/          verbatim copy, typed (transcribed from CONTENT.md)
  pages/            one component per route; semantic HTML, all content lives here
  components/       shell (nav, footer, loader, cursor, grain, bottom bar, flame transition) + UI blocks + signature pieces (sigil, script band, ring)
  lib/              motion (GSAP/Lenis), reveals, route transition, fire (flame wipe), sound (WebAudio), GPU tier, tilt, lead POST
  three/
    Stage.tsx       the ONE persistent <Canvas>: env lighting, bloom, perf monitor, pause-when-covered
    registry.ts     lazy import() per scene; nothing three.js is in the main bundle
    compile.ts      the signature shader (patches MeshStandardMaterial) + wireframe material
    rig.ts          anchors: DOM placeholders ([data-anchor]) mapped into world space
    scenes/         one scene per route (Home, Services, Work, Case, AI, DevOps, …)
    parts/          phone rig, morphing point cloud, backdrop, screen textures, plates
```

**Anchors.** Pages place empty, sized `<div data-anchor="pose">` placeholders in their
layout. Scenes project those rects into world space every frame and fly objects to
them. This is why the 3D sits correctly at every breakpoint, and why scrolling reads
as choreography. Mobile layouts simply use different anchors.

**Page ↔ scene.** Discrete state (active service, highlighted layer, calculator scope)
goes through Zustand channels (`useStore().ch`). Continuous values (scroll progress
through a pinned section) go through `live.chan`, so nothing re-renders at 60fps.

## Content rules

These are the main site's hard rules; they apply here too (see `CLAUDE.md`):
- Portfolio products stay NDA-pseudonymised. There are no store links, and
  "Live on…" is a plain badge.
- Concepts (Web3 Creator, Fan Investment) stay labelled "Product & UI/UX design concept".
- Healthcare Staffing figures are shown as research ("From the research"), not results.
- Products without screens get an abstract plate, never an invented UI.
- The DevOps dashboard keeps its "Illustrative demo · sample data" label.
- The AI page chat is a scripted demo. It is labelled as such and answers only
  with the published FAQ.

## Forms and leads

The forms post to the same API Gateway → Lambda → SES pipeline as the main site, with
the same payload shapes. On `localhost` (dev or preview) they are a **dry run**: the
payload is logged to the console, nothing is sent, and the UI still shows success. Set
`VITE_LEADS_LIVE=true` to force real sends. The live API only accepts the production
origin anyway.

## Links out

Pages that exist on the main site but aren't rebuilt here open it in a new tab:
individual blog posts, privacy, WordPress, the geo landing pages, the cloud-cost and
DevOps-maturity tools, and the scoping-guide PDF.

## Analytics

GA4 property `G-CL9VPKLE6S`, loaded from `index.html` only when the hostname ends in
`soniconsultancyservices.com`, so local runs and previews never send hits. Meta Pixel,
LinkedIn Insight and Tawk.to are not included.

This is a client-rendered SPA. The main site is static HTML, which crawlers read
without JavaScript; the canonical URLs point there.

## Measured

Before the 2026-09-27 redesign (production build, headless Chrome on Apple M1):

| | FCP | LCP | TBT | CLS | axe (WCAG 2.1 AA) |
|---|---|---|---|---|---|
| Desktop, unthrottled (/, /services/, /work/, /contact/) | 0.1–0.9 s | 0.1–1.2 s | 0–35 ms | ≤ 0.04 | 0 violations |
| Mobile, Slow 4G + 4× CPU (/, /services/, /work/, /contact/) | ~2.0 s | ~2.65 s | 160–245 ms | 0.001 | 0 violations |

After the redesign (2026-09-27): `npm run build` clean; 0 console errors on all 17
routes; 0 horizontal overflow at 1440 and 375 px; axe-core wcag2a/aa 0 violations on 7
key routes in both themes. Fonts went from ~395 KB to ~144 KB. Web Vitals were not
re-measured.

Initial JS is about 150 KB gzip. The three.js chunk (~242 KB gzip) loads only after
first paint, when the main thread is idle.

Dev builds expose `window.__gsap`, `window.__ST` and `window.__r3f` for debugging and
automated checks. They are stripped from production builds.
