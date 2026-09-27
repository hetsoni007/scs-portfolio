# CONTENT.md — verbatim content plan

Source: every in-scope page of https://soniconsultancyservices.com, captured 2026-09-24.
The live HTML was fetched with curl and compared byte-for-byte with this repo's
static source (`../<page>/index.html`): all 17 pages were identical, so the extraction
below was run on the repo files. Copy here is verbatim. **The UI must not paraphrase
numbers, claims, quotes or tech chips.** The typed modules in `src/content/` are
transcribed from this file. If they ever disagree, this file wins.

Standing rules carried over from the main site (see `../CLAUDE.md`, "Hard rules"):
- Portfolio products are **NDA-pseudonymised**. Never show a real client/product name.
  Never add App Store or Play Store links. "Live on the App Store & Google Play" is a
  plain badge and must not be a link.
- Web3 Creator Platform and Fan Investment Platform are **"Product & UI/UX design
  concept"** and must stay labelled that way, with no results claimed.
- The Healthcare Staffing Platform is a delivered platform, **not** live on a store.
- The DevOps dashboard is an **"Illustrative demo · sample data"**. Keep that label.
- Never invent metrics, testimonials, pricing, store links or social URLs.

---

## Global

**Brand:** Soni Consultancy Services (SCS). Founder: Het Soni, Founder & Lead Engineer.
**Tagline (footer):** React Native & MERN-stack mobile app development with AI built in. Live on the App Store & Google Play.
**Footer strap:** React Native · MERN · AI
**Copyright:** © 2026 Soni Consultancy Services. All rights reserved.

### Contact (the only real channels)
- Book a call (Calendly): https://calendly.com/het-soni-soniconsultancyservices/introductory
- Email: het.soni@soniconsultancyservices.com
- WhatsApp / phone: +91 8160682185 → https://wa.me/918160682185
- LinkedIn: https://www.linkedin.com/in/hetsoni/
- Instagram: https://www.instagram.com/soni.consultancyservices/
- Facebook: https://www.facebook.com/soniconsultancyservices
- Medium: https://medium.com/@hetsoni9398

### Primary nav
Services (/services/) · Work (/work/) · Blog (/blog/) · AI Apps (/ai-app-development/) · DevOps & Cloud (/devops-cloud-engineering/) · About (/about/) · Contact (/contact/) · CTA "Book a Call" (Calendly). Mobile menu CTA: "Book a Free Call →".

### Footer columns
- **Explore:** Services, React Native, MVP Development, Work, Blog, AI Apps, DevOps & Cloud, About, WordPress Websites
- **Industries:** FinTech, Retail, Ride-Hailing, HR & Payroll
- **Company:** LinkedIn, Contact, Privacy
- **Start:** Book a Call, App cost estimate, Email us

External-only targets (not rebuilt in the 3D site, so they link to the live site):
/privacy/, /wordpress-website-development-india/, /blog/<slug>, /cloud-cost-calculator/,
/devops-maturity-assessment/, /react-native-app-development-{uk,dubai,usa}/, /assets/app-scoping-guide.pdf

### Home typewriter words (hero H1 second line, cycles)
`8 weeks.` | `one codebase.` | `with senior engineers.` | `with AI built in.`

### Home tech marquee
React Native · MERN Stack · Next.js · Node.js · MongoDB · AWS · Claude AI · GPT · Expo · TypeScript · PostgreSQL · App Store · Google Play

### Short lead form ("Start here" box). Shared by 13 pages, heading and sub differ per page.
Fields: Your name (placeholder "Jane Doe") · Work email ("jane@company.com") ·
What are you building? ("One line is plenty — e.g. a patient booking app for 3 clinics") ·
Budget [Not sure yet, <$10k, $10-25k, $25-60k, $60k+] · Timeline [ASAP, 1-3 months, 3-6 months, Just exploring] ·
Consent: "I agree to Soni Consultancy Services storing these details to reply to my enquiry. No newsletter, no sharing with anyone else. Privacy." ·
Button "Send →" · Note "Replies within one business day · no upfront fee to talk" · honeypot "Leave this empty".
Validation messages: "Please add your name." / "Please check your email address." / "A one-line description is enough." / "Please tick the consent box so we can reply." / network: "Network error — please email het.soni@soniconsultancyservices.com directly."
Success: "✓ Thanks — that's with Het. You'll get a reply within one business day, usually with either a straight answer or the two or three questions needed to scope it properly."
POST https://9cjt6qwy71.execute-api.ap-south-1.amazonaws.com with
`{kind, name, email, want, budget_band, timeline, project_type, consent, source_page, referrer, website(honeypot)}`.

| page | kind | project_type |
|---|---|---|
| /services/ | services | – |
| /work/ | work | – |
| /about/ | about | – |
| /ai-app-development/ | ai | AI integration |
| /devops-cloud-engineering/ | devops | DevOps & cloud |
| /hire/ | hire | Hire a developer |
| /mvp-development/ | mvp | MVP |
| /react-native-app-development/ | react-native | React Native app |
| /blog/ | blog | – |
| /fintech-app-development/ | fintech | FinTech app |
| /retail-app-development/ | retail | Retail app |
| /ride-hailing-app-development/ | ride-hailing | Ride-hailing app |
| /hr-payroll-app-development/ | hr-payroll | HR & Payroll app |

Contact "Send a brief" form → `{kind:'contact', name, email, company, service, message}`.
Calculator → `{kind:'calculator', name, email, message:'App cost estimate — …'}`.
Scoping guide → `{kind:'app_scoping_guide', name, email, company, stage, message:'Downloaded free app scoping guide'}`, and the download is revealed whether or not the POST succeeds.

### App cost calculator model (verbatim from the live JS)
- RATE_LO = 1800, RATE_HI = 3200 (indicative blended $/week)
- Platforms: Cross-platform ×1 (default) · iOS only ×0.9 · Android only ×0.9
- Build stage (base weeks): MVP 4 (default) · Market-ready 8 · Scale / enterprise 14
- Features (+weeks): User accounts & profiles 1.5 (default on) · Payments / subscriptions 2.5 · Chat / messaging 2.5 · Maps & geolocation 2 · Push notifications 1 · Admin dashboard 3 · AI integration 3 · Offline mode / sync 2 · Analytics dashboards 1.5 · Social feed 2
- Design: Standard ×1 (default) · Custom UI/UX ×1.2 · Premium / animated ×1.4
- Backend (+weeks): Managed / BaaS +0 (default) · Custom MERN API +3 · Realtime + scale +5
- weeks = round((base + Σfeatures + backendAdd) × platformMult × designMult), min 3
- lo = round(weeks×1800/1000)×1000, hi = round(weeks×3200/1000)×1000, shown as "$Xk – $Yk"
- Result labels: "Indicative estimate" · "Typical range for this scope · USD" · Timeline "~N weeks" · Team "Het + dedicated engineers" · Pricing model "Fixed-price"

### DevOps reference architecture nodes (data-k / data-t / data-d)
1. Users · Web · Mobile. **Clients / Users & devices.** Web, mobile (React Native) and API clients hit your platform from anywhere. Everything downstream is designed to keep their experience fast and available.
2. CDN · WAF (CloudFront / Front Door). **Edge / Edge, CDN & WAF.** A CDN (CloudFront / Azure Front Door) caches content close to users and a Web Application Firewall blocks malicious traffic before it ever reaches your servers. Faster pages, smaller attack surface.
3. Load balancer · API gateway. **Routing / Load balancing & API gateway.** Traffic is spread across healthy instances and routed by an API gateway. Unhealthy nodes are removed automatically, so a single failure never takes the system down.
4. Kubernetes pods (EKS / AKS · autoscaling). **Compute / Kubernetes app tier.** Your services run as containers on Kubernetes (EKS/AKS). Pods autoscale with demand, roll out with zero downtime, and self-heal when a container dies. You pay for what you actually use.
5. Managed DB. **Data / Managed database.** Managed databases (RDS / Azure SQL / MongoDB Atlas) with automated backups, failover replicas and point-in-time recovery — durability without the babysitting.
6. Cache · Queue. **Data / Cache & queue.** A cache (Redis) absorbs read load and a message queue (Kafka / SQS) decouples services so spikes are smoothed out instead of cascading into outages.
7. CI/CD · Terraform IaC. **Delivery / CI/CD & IaC.** Every commit flows through an automated pipeline (build → test → scan → deploy) and all infrastructure is defined as code in Terraform — so environments are reproducible and releases are boring, in the best way.
8. Observability · SRE. **Ops / Observability.** Metrics, logs and traces feed dashboards and alerts (Prometheus / Grafana / CloudWatch). SLOs and error budgets tell you when to ship and when to slow down.

### Blog categories (data-cat on the live index)
Filters: All · AI · Mobile · Web · Strategy. Each card's categories are recorded in `src/content/blog.ts`.

---

## Pages (verbatim extraction)

Legend: `#`/`##`/`###` headings · `P:` paragraph · `-:` list item · `T:` loose text ·
`[EYEBROW]`, `[CHIP]`, `[NUM]`/`[LBL]` (stat value/label), `[TAG]`, `[BADGE]` ·
`⟨/path⟩` link target · `QUOTE:`/`CAPTION:` testimonial · `BUTTON {.faq-q}:` FAQ question, followed by its answer.
The repeated "Start here" lead form is collapsed to `[LEAD FORM: kind]`. The fields are listed above.




### FILE index.html
TITLE: React Native & AI App Development Company | Soni Consultancy
DESC: React Native, MERN & AI app development for founders. Senior engineers, fixed-price proposals in 48 hours, apps live on both stores. Book a free scoping call.
<!-- HERO -->

=== SECTION ===
T: [EYEBROW] React Native · MERN · AI Integration
# Build iOS & Android apps in / 8 weeks.
P {.lead}: We design and build cross-platform iOS & Android apps in React Native & MERN — with AI built in. Real products, live on both stores, shipped by senior engineers.
T: Get Free App Scoping (15 min) ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Free Guide → ⟨/app-scoping-guide/⟩
T: Live on the App Store & Google Play · 4+ products shipped · No upfront fee to talk
<!-- TECH MARQUEE -->
<!-- PROOF / METRICS -->

=== SECTION ===
T: [EYEBROW] Proof, not promises
## Real apps. Real results. / Live on the stores today.
T: [NUM] 4+
T: [LBL] Apps live on App Store & Play Store
T: [NUM] 35%
T: [LBL] More downloads (creator marketplace)
T: [NUM] 40%
T: [LBL] Less payroll admin (HR platform)
T: [NUM] 30+
T: [LBL] Countries served
<!-- SERVICES -->

=== SECTION ===
T: [EYEBROW] What we do
## One team, from idea / to App Store.
P {.lead}: Mobile-first, AI-ready, senior-only. We own design, build and launch so you ship faster with fewer moving parts.
### React Native App Development
P {.muted}: iOS & Android from one codebase — native performance, push, maps, payments, offline. Submitted, approved, live.
T: [CHIP] React Native
T: [CHIP] Expo
T: [CHIP] iOS + Android
### MERN-Stack Backends
P {.muted}: MongoDB, Express, React, Node — the API, auth, dashboards and real-time infrastructure your app runs on, built to scale.
T: [CHIP] Node.js
T: [CHIP] MongoDB
T: [CHIP] Next.js
T: [CHIP] AWS
### AI Integration
P {.muted}: Claude & GPT features that earn their place — AI fare prediction, smart matching, assistants, RAG. See AI app ideas → ⟨/ai-app-development/⟩
T: [CHIP] Claude API
T: [CHIP] GPT
T: [CHIP] RAG
<!-- PORTFOLIO TEASER -->

=== SECTION ===
T: [EYEBROW] Selected work
## Apps we've shipped.
IMG: src=/assets/portfolio/hr-payroll-teaser.webp alt='HR and attendance app screen'
### HR & Payroll
P {.dim}: Attendance & payroll · MERN + RN
T: ⟨/work/#hr-payroll⟩
IMG: src=/assets/portfolio/creator-marketplace-1.webp alt='Creator marketplace app screen'
### Creator Marketplace
P {.dim}: Influencer × venues · +35% installs
T: ⟨/work/#creator-marketplace⟩
IMG: src=/assets/portfolio/retail-ops-1.webp alt='Retail operations app screen'
### Retail Operations
P {.dim}: Retail chain ops · LMS + analytics
T: ⟨/work/#retail-ops⟩
IMG: src=/assets/portfolio/ride-hailing-teaser.webp alt='Ride-hailing cab booking app screen'
### Ride-Hailing
P {.dim}: Ride-hailing · AI fare prediction
T: ⟨/work/#ride-hailing⟩
T: Explore the full portfolio → ⟨/work/⟩
<!-- WHY US (sales psychology: risk reversal, speed, senior) -->

=== SECTION ===
T: [EYEBROW] Why founders pick us
## Less risk. Faster ship. / Senior hands only.
### Ship in weeks, not quarters
P {.muted}: A focused MVP on both stores in 6–10 weeks. You see working software every week — no black box.
### Senior engineers, no juniors
P {.muted}: The people on your call are the people writing the code. 5+ years commercial, store-proven.
### Fixed scope, fixed price
P {.muted}: A clear proposal within 48 hours of our call. You know the number before you commit a penny.
<!-- FOUNDER -->

=== SECTION ===
T: HS
T: [EYEBROW] Who you'll work with
## Het Soni — Founder & Lead Engineer
P {.muted}: 5+ years building and shipping commercial apps — React Native, MERN and AI — live on the App Store and Google Play. The senior engineer who scopes, builds and ships your product is the person you talk to, not a sales rep who hands it to juniors.
P {.muted}: Working across UK, US, UAE and India time zones for real-time collaboration, with transparent fixed pricing agreed before a line of code is written. More about how we work → ⟨/about/⟩
T: Connect on LinkedIn → ⟨https://www.linkedin.com/in/hetsoni/⟩
<!-- TESTIMONIALS -->

=== SECTION ===
T: [EYEBROW] What people say
## Trusted by clients / and collaborators.
T: ★★★★★ 5.0
P {.tproj}: A 5.0-rated engagement for the Sales Automation project — Mobile App Development, on a fixed-price build.
CAPTION: SR Satyam RathaurVerified client reviewGoodFirms
QUOTE: “I've had the pleasure of collaborating with Het. Having strong technical knowledge, particularly in DevOps and Power BI, and always approaching challenges with a solution-oriented mindset.”
CAPTION: SB Shalin BhattBusiness Consultant for Startups & SMBsLinkedIn
QUOTE: “Het is a friendly, positive, responsible person and it was amazing meeting him on my networking sessions about digital marketing.”
CAPTION: JB Jiri BorcNetworking & community buildingLinkedIn
<!-- FINAL CTA -->

=== SECTION ===
## Have an app idea? / Let's pressure-test it — free.
P {.lead}: 30 minutes with a senior engineer. We'll tell you what it takes to build, what it costs, and whether we're the right team. No pitch, no obligation.
T: Book Your Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Send a brief ⟨/contact/⟩
P {.dim}: You own all code & IP · NDA on request · Free intro call, no upfront fee · Fixed scope & price up front
P {.dim}: Or email het.soni@soniconsultancyservices.com




### FILE services/index.html
TITLE: App Development Services | Soni Consultancy Services
DESC: React Native, MERN, AI integration, DevOps and developer hiring — mobile-first app development services from idea to App Store.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › Services
T: [EYEBROW] What we do
# From idea to App Store — / one senior team.
P {.lead}: Mobile-first, AI-ready, full-stack. We design, build and launch React Native & MERN products — and stay to scale them.

=== SECTION ===
T: [NUM] 01
### React Native App Development
P: Cross-platform iOS & Android apps from a single codebase — native performance, submitted, approved and live on both stores.
-: iOS + Android from one codebase
-: Push, maps, payments, biometrics, offline
-: App Store & Play Store submission
T: [CHIP] React Native
T: [CHIP] Expo
T: [CHIP] TypeScript
T: [NUM] 02
### MVP Development
P: A focused first product that proves the idea with real users — scoped hard, shipped in roughly 10–16 weeks on a fixed price. See MVP development → ⟨/mvp-development/⟩
-: Scope cut to Core / Supporting / Later
-: Fixed-price proposal within 48 hours
-: Analytics instrumented from day one
T: [CHIP] React Native
T: [CHIP] MERN
T: [CHIP] 10–16 weeks
T: [NUM] 03
### MERN-Stack & Web Development
P: The backend, API, dashboards and SSR web app your product runs on — MongoDB, Express, React, Node and Next.js, built to scale.
-: REST/GraphQL APIs, auth, real-time
-: Admin dashboards & SSR web apps
-: Stripe, webhooks, multi-tenancy
T: [CHIP] Node.js
T: [CHIP] MongoDB
T: [CHIP] Next.js
T: [CHIP] PostgreSQL
T: [NUM] 04
### AI Integration
P: Claude & GPT features that earn their place — assistants, matching, prediction, RAG. See AI app ideas → ⟨/ai-app-development/⟩
-: Claude / GPT pipelines & agents
-: RAG, embeddings, vector search
-: Evaluation, guardrails, cost control
T: [CHIP] Claude API
T: [CHIP] GPT
T: [CHIP] RAG
T: [NUM] 05
### DevOps & Cloud
P: CI/CD pipelines, containerised deploys and auto-scaling AWS infrastructure — we own the ops layer so launches are boring. Explore DevOps & Cloud → ⟨/devops-cloud-engineering/⟩
-: AWS architecture & auto-scaling
-: CI/CD, Docker, monitoring
-: 99.9% uptime infrastructure
T: [CHIP] AWS
T: [CHIP] Docker
T: [CHIP] CI/CD
T: [NUM] 06
### Hire a Developer
P: Embed our senior React Native, MERN or AI engineers into your team — staff augmentation, dedicated pods or contract. See engagement models → ⟨/hire/⟩
-: Senior-only, 5+ years commercial
-: Kick-off within 48 hours
-: IR35-aware for UK clients
T: [CHIP] Staff aug
T: [CHIP] Dedicated team
T: [CHIP] Contract
T: [NUM] 07
### WordPress Website Development
P: Custom WordPress & WooCommerce websites for Indian businesses, built by the same senior engineers. See WordPress services → ⟨/wordpress-website-development-india/⟩
-: Custom theming, not just templates
-: WooCommerce & Indian payment gateways
-: Migration, speed & SEO setup
T: [CHIP] WordPress
T: [CHIP] WooCommerce
T: [CHIP] India

=== SECTION ===
T: [EYEBROW] How we work
## Five steps. No surprises.
T: 01
### Discover
P: Goals, scope, the metric to move. Fixed proposal in 48h.
T: 02
### Design
P: Clickable UX before a line of code.
T: 03
### Build
P: Weekly working software, in your tools.
T: 04
### Launch
P: App Store & Play Store submission, done for you.
T: 05
### Scale
P: Iterate on real usage; own the ops.

=== SECTION ===
## Know what you want to build?
P {.lead}: Get a fixed-price proposal within 48 hours of a free call.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See our work ⟨/work/⟩

=== SECTION ===
T: [EYEBROW] Free guides & tools
## Not ready to talk? Try these first.
T: Stack picker
T: Which stack fits your MVP
T: Get a recommendation →
T: ⟨/blog/mvp-tech-stack-2026⟩
T: Decision tool
T: Native, React Native or Flutter?
T: Get a recommendation →
T: ⟨/blog/native-vs-cross-platform-2026⟩
T: Self-audit
T: Score your app’s security
T: Run the audit →
T: ⟨/blog/mobile-app-security-checklist⟩
T: Revenue explorer
T: How will your app make money?
T: Explore models →
T: ⟨/blog/app-monetization-models⟩

=== SECTION ===
T: Start here
## Tell us what you’re building.
P {.lb-sub}: One short form. You get a straight answer on scope and a fixed price within 48 hours — or an honest no if it isn’t a fit.
[LEAD FORM — fields as in Global]

=== SECTION ===
T: [EYEBROW] Common questions
## Before you get in touch.
BUTTON {.faq-q}: What services does Soni Consultancy Services offer?
T: Five core services: React Native app development, MERN-stack & web development, AI integration (Claude & GPT), DevOps & cloud engineering, and hiring a developer through staff augmentation or a dedicated pod.
BUTTON {.faq-q}: What's your development process?
T: Five steps: Discover (goals, scope, a fixed proposal within 48 hours), Design (clickable UX before code), Build (weekly working software), Launch (App Store & Play Store submission handled for you), and Scale (iterate on real usage while we own the ops).
BUTTON {.faq-q}: Do you build the backend as well as the app?
T: Yes — one team covers the React Native front end and the MERN backend (APIs, auth, dashboards, real-time), so you're not coordinating separate vendors.
BUTTON {.faq-q}: Can I hire a single developer instead of a full project team?
T: Yes — staff augmentation, dedicated pods or contract placements are available. See our hiring page ⟨/hire/⟩ for engagement models.
BUTTON {.faq-q}: Do you handle App Store and Google Play submission?
T: Yes — submission and approval on both stores is part of our Launch step, done for you.



### FILE work/index.html
TITLE: Case Studies: React Native Apps & Enterprise Platforms
DESC: Real React Native and MERN products we shipped — HR, retail, ride-hailing, B2B and healthcare platforms, with the problem, approach and measured result.
<!-- HERO -->

=== SECTION ===
T: [EYEBROW] Selected work
# Apps we've shipped, / live on the stores.
P {.lead}: Four cross-platform products in React Native & MERN — from HR and retail to ride-hailing and creator platforms. Each one is live, in users' hands, with results to show for it. Product names are withheld under client NDAs; every metric below is real.
<!-- STATS BAND -->

=== SECTION ===
T: [NUM] 4
T: [LBL] Apps shipped
T: [NUM] 8
T: [LBL] Store listings (iOS+Android)
T: [NUM] 97wk
T: [LBL] Combined build time
T: [NUM] 100%
T: [LBL] React Native + MERN
<!-- CASES -->

=== SECTION ===
<!-- HR & PAYROLL PLATFORM (name withheld — client NDA) -->
IMG: src=/assets/portfolio/hr-payroll-sim-register.webp alt='HR platform business registration screen'
IMG: src=/assets/portfolio/hr-payroll-sim-punch.webp alt='HR platform punch in and out with live hour tracker'
IMG: src=/assets/portfolio/hr-payroll-sim-ledger.webp alt='HR platform salary ledger with income breakdown'
IMG: src=/assets/portfolio/hr-payroll-sim-profile.webp alt='HR platform staff profile update screen'
T: [EYEBROW] HR & Payroll · 16 weeks · Name withheld (NDA)
## HR & Payroll Platform
P {.muted}: Attendance & salary ledger system — real-time attendance, automated payroll and centralised records across Company, Branch and Staff roles.
T: Problem
T: Manual spreadsheets caused 15–20% payroll errors, delayed slips and zero branch-level visibility.
T: Solution
T: Biometric & GPS attendance, customizable payroll rules per branch, real-time irregularity alerts, detailed salary breakdowns.
T: Result
T: 40% less payroll processing time and accurate, transparent pay every cycle.
T: [NUM] 40%
T: [LBL] Faster payroll
T: [NUM] 3
T: [LBL] User roles
T: [NUM] 2
T: [LBL] Stores live
T: [CHIP] React Native
T: [CHIP] React
T: [CHIP] Node.js
T: [CHIP] MongoDB
T: [CHIP] Live on the App Store & Google Play
<!-- CREATOR–VENUE MARKETPLACE (name withheld — client NDA) -->
IMG: src=/assets/portfolio/creator-marketplace-3.webp alt='Creator marketplace venue discovery'
IMG: src=/assets/portfolio/creator-marketplace-1.webp alt='Creator marketplace app home'
T: [EYEBROW] Creator Marketplace · 24 weeks · Name withheld (NDA)
## Creator–Venue Marketplace
P {.muted}: An influencer-to-venue collaboration platform — slot booking, in-app content sharing, chat and a points & rewards engine that keeps both sides engaged.
T: Problem
T: Influencer–venue deals were fragmented: no clean way to book slots, communicate, or reward engagement.
T: Solution
T: Dynamic real-time slot booking, content upload with status sharing, automated chat templates and a loyalty points system.
T: Result
T: A 35% lift in downloads and a 20% rise in venue bookings driven by authentic creator content.
T: [NUM] +35%
T: [LBL] Downloads
T: [NUM] +20%
T: [LBL] Bookings
T: [NUM] 4.x
T: [LBL] App Store
T: [CHIP] React Native
T: [CHIP] Chat
T: [CHIP] Rewards
T: [CHIP] Maps
T: [CHIP] Live on the App Store
<!-- CREATOR–VENUE MARKETPLACE — more screens gallery -->
T: Creator–Venue Marketplace · more screens
IMG: src=/assets/portfolio/creator-marketplace-g1.webp alt='Creator marketplace venue detail and service selection'
CAPTION: Service & combos
IMG: src=/assets/portfolio/creator-marketplace-g2.webp alt='Creator marketplace deals and content brief'
CAPTION: Deals & content briefs
IMG: src=/assets/portfolio/creator-marketplace-g3.webp alt='Creator marketplace date and slot picker'
CAPTION: Slot booking
IMG: src=/assets/portfolio/creator-marketplace-g4.webp alt='Creator marketplace bookings and content schedule'
CAPTION: Bookings & content
<!-- RETAIL OPERATIONS PLATFORM (name withheld — client NDA) -->
IMG: src=/assets/portfolio/retail-ops-sim-menu.webp alt='Retail platform store menu with checklists, trainings, logs and reports'
IMG: src=/assets/portfolio/retail-ops-sim-checklist.webp alt='Retail platform checklist module'
IMG: src=/assets/portfolio/retail-ops-sim-training.webp alt='Retail platform LMS training module'
IMG: src=/assets/portfolio/retail-ops-sim-submission.webp alt='Retail platform checklist submission report'
T: [EYEBROW] Retail SaaS · 32 weeks · Name withheld (NDA)
## Retail Operations Platform
P {.muted}: A retail chain management platform unifying operational checklists, a gamified LMS, issue logs and customer logs — standardising operations across every store.
T: Problem
T: Inconsistent store operations, unrecorded issues and outdated, inaccessible staff training.
T: Solution
T: Customizable checklists, gamified bite-sized LMS, structured issue logging and an analytics dashboard for head office.
T: Result
T: Standardised multi-store operations with real-time visibility and measurably faster staff onboarding.
T: [NUM] 4
T: [LBL] Modules unified
T: [NUM] 2
T: [LBL] Stores live
T: [NUM] LMS
T: [LBL] Gamified
T: [CHIP] React Native
T: [CHIP] React
T: [CHIP] Node.js
T: [CHIP] MongoDB
T: [CHIP] Live on the App Store & Google Play
<!-- RIDE-HAILING PLATFORM (name withheld — client NDA) -->
IMG: src=/assets/portfolio/ride-hailing-sim-bookings.webp alt='Ride-hailing driver app bookings list'
IMG: src=/assets/portfolio/ride-hailing-sim-driver.webp alt='Ride-hailing driver profile details form'
IMG: src=/assets/portfolio/ride-hailing-sim-map.webp alt='Ride-hailing live ride tracking with fare'
IMG: src=/assets/portfolio/ride-hailing-sim-nav.webp alt='Ride-hailing turn by turn navigation screen'
T: [EYEBROW] Ride-Hailing · AI · 25 weeks · Name withheld (NDA)
## Ride-Hailing Platform
P {.muted}: A cab-booking platform built around rider trust — transparent pricing, real-time tracking, safety features and AI-based fare prediction.
T: Problem
T: Driver cancellations, opaque surge pricing and clunky interfaces eroded rider trust.
T: Solution
T: AI fare prediction for transparent pricing, driver-rating assurance, ride scheduling, an SOS feature and an eco-friendly vehicle option.
T: Result
T: Average booking time down to ~3 minutes with safety-first UX riders actually trust.
T: [NUM] 3min
T: [LBL] Avg. booking
T: [NUM] AI
T: [LBL] Fare prediction
T: [NUM] SOS
T: [LBL] Safety built-in
T: [CHIP] React Native
T: [CHIP] Next.js
T: [CHIP] PostgreSQL
T: [CHIP] AWS
T: [CHIP] Live on the App Store & Google Play
<!-- B2B WHOLESALE PLATFORM (name withheld — client NDA) -->
T: B2B Wholesale
T: Wholesale ordering & loyalty rewards for retailers
T: [EYEBROW] B2B Retail · Loyalty Platform · Name withheld (NDA)
## B2B Wholesale Platform
P {.muted}: A B2B wholesale ordering platform for retailers, with a points-based loyalty engine, tiered pricing catalogue and real-time inventory tracking.
T: Problem
T: Retailers had no streamlined way to bulk-order, track inventory or earn loyalty rewards — existing systems were outdated and manual.
T: Solution
T: Dynamic points tied to purchasing volume, tiered wholesale pricing, predictive inventory analytics and ERP-synced ordering.
T: Result
T: Order placement time cut by 30% and customer retention up 20% post-launch.
T: [NUM] -30%
T: [LBL] Order time
T: [NUM] +20%
T: [LBL] Retention
T: [NUM] 60%
T: [LBL] Redeemed in mo. 1
T: [CHIP] React.js
T: [CHIP] Node.js
T: [CHIP] ERP Integration
T: [CHIP] Live on the App Store & Google Play
T: Healthcare Staffing
T: Shift-based hiring platform connecting hospitals with nurses
T: [EYEBROW] HealthTech · Platform · 26 weeks · Name withheld (NDA)
## Healthcare Staffing Platform
P {.muted}: A digital hiring platform connecting hospitals with nurses for shift-based work — a mobile app for nurses and a web dashboard for hospital staffing teams.
T: Problem
T: Hospitals fill shifts by phone calls and spreadsheets; nurses struggle to find flexible, transparent-pay shifts that fit their schedule.
T: Solution
T: Real-time shift posting, AI-based nurse matching, a credential vault with auto-verification, and geo-filtered shift search.
T: Result
T: Designed to cut average shift-fill time from 4–8 hours to under 30 minutes, based on research across 18 hospitals.
T: [NUM] 78%
T: [LBL] Want short-term shifts
T: [NUM] 65%
T: [LBL] Still use manual calls
T: [NUM] <30min
T: [LBL] Target fill time
T: [CHIP] React Native
T: [CHIP] Next.js
T: [CHIP] Express.js
T: [CHIP] PostgreSQL
T: Healthcare Staffing Platform · how it works
BUTTON {.flow-tab active}: Nurse mobile app
BUTTON {.flow-tab}: Hospital web dashboard
T: 1Login & verification
T: 2View recommended shifts
T: 3Search & filter by distance, pay, facility
T: 4Review shift details
T: 5Apply → in-progress → confirmation
T: 6Credential vault
T: 7Payments & earnings
T: 8Profile & reliability score
T: 1Login
T: 2Post a shift
T: 3View applicants
T: 4Review credentials
T: 5Confirm nurse
T: 6Track live shift status
T: 7Rate nurse
T: 8Analytics dashboard
<!-- WEB3 CREATOR PLATFORM (design concept) -->
T: Web3 Creator
T: Social network + multi-chain wallet + NFT marketplace
T: [EYEBROW] Web3 · Social + Wallet + NFT · Name withheld (NDA)
## Web3 Creator Platform
P {.muted}: A Web3 creator-economy concept — a social network, a multi-chain crypto wallet and an NFT marketplace in one premium dark experience, so creators can publish, mint and get paid inside a single app.
T: Wallet
T: A built-in multi-chain wallet with a native token, deposit/withdraw and balances across BTC, ETH, XRP and more.
T: Market
T: An NFT & SNFT marketplace with floor price, volume and offers — collect, buy and sell digital art.
T: Social
T: Creator profiles, a fan-following model and a "Social Art" feed where posts can be minted and earned from.
T: [CHIP] UI/UX Design
T: [CHIP] Web3
T: [CHIP] Crypto Wallet
T: [CHIP] NFT Marketplace
T: [CHIP] Mobile-first
T: [CHIP] ✦ Product & UI/UX design concept
<!-- FAN INVESTMENT PLATFORM (design concept) -->
IMG: src=/assets/portfolio/fan-investing-3.webp alt='Fan investment platform wallet and portfolio performance screen'
IMG: src=/assets/portfolio/fan-investing-1.webp alt='Fan investment platform home feed of new artists'
T: [EYEBROW] Music FinTech · Social investing · Name withheld (NDA)
## Fan Investment Platform
P {.muted}: A concept for a fan-investing app — discover emerging music artists, back them with fractional "shares" tied to their career milestones, and watch a personal portfolio grow inside a social feed of the artists you follow.
T: Discover
T: A home feed of hot new artists and people to follow, each with a live offering open to back.
T: Growth Score
T: A dynamic metric blending social reach, engagement and revenue — so backers can evaluate an artist before investing.
T: Portfolio
T: A wallet that tracks performance over time — total invested, milestone-based returns and each artist's share of the portfolio.
T: Artist
T: Rich artist profiles with bio, genre, monthly streams and the percentage offering available.
P {.muted}: Concept research (82 respondents): 74% wanted a low-barrier way to invest in creative talent; 71% said they'd trust the platform more with verifiable growth metrics — which shaped the Growth Score above.
T: [CHIP] UI/UX Design
T: [CHIP] FinTech
T: [CHIP] Social Investing
T: [CHIP] Mobile-first
T: [CHIP] Dark UI
T: [CHIP] ✦ Product & UI/UX design concept
<!-- FAN INVESTMENT PLATFORM — more screens gallery -->
T: Fan Investment Platform · more screens
IMG: src=/assets/portfolio/fan-investing-2.webp alt='Fan investment platform artist profile with offering'
CAPTION: Artist profile & offering
IMG: src=/assets/portfolio/fan-investing-4.webp alt='Fan investment platform list of artists held in portfolio'
CAPTION: Your artist holdings
<!-- ENTERPRISE & PLATFORM ENGINEERING -->

=== SECTION class=ent-sec ===
T: [EYEBROW] Enterprise & platform engineering
## Beyond apps — platforms built to scale.
P {.lead}: Soni Consultancy Services doesn't only ship mobile apps. We architect and deliver enterprise-grade platforms — BSA/AML and fraud-detection systems, sanctions-screening engines, loyalty and rewards platforms, large-scale AWS cloud migrations and HL7 healthcare integrations — built with microservices, event-driven architecture and DevOps for high availability, resilience and scale.
### FinTech, Risk & Compliance
P: Regulatory-grade software for financial institutions — engineered for accuracy, auditability and scale.
#### BAM+ — AML & Fraud Case Management
T: Solution Architect & Delivery Lead
P {.desc}: A web-based BSA/AML and enterprise-fraud case management platform that lets financial institutions run every risk workflow from one console, driven by a configurable scenario library for a blended-analytics approach to risk. Coverage spans ACH origination & incoming fraud, check fraud, debit-card fraud, new-account fraud and wire fraud — on a C#/.NET microservices architecture with Apache Kafka event streaming.
T: [CHIP] C#
T: [CHIP] ASP.NET Core
T: [CHIP] Microservices
T: [CHIP] Apache Kafka
T: [CHIP] MongoDB
T: [CHIP] Kubernetes
T: [CHIP] Azure
T: [CHIP] AWS
T: [CHIP] GraphQL
T: [CHIP] Terraform
#### IQ AutoScan — Sanctions & Watchlist Screening
T: Solution Architect & Delivery Lead
P {.desc}: A real-time sanctions and watchlist screening solution that screens customers, vendors and counterparties against OFAC, EU/UN/UK and FinCEN lists and other watchlists — helping institutions meet complex AML and KYC compliance obligations. Delivered as event-driven microservices on a containerised, cloud-native stack.
T: [CHIP] C#
T: [CHIP] ASP.NET Core
T: [CHIP] Microservices
T: [CHIP] Apache Kafka
T: [CHIP] MongoDB
T: [CHIP] Angular
T: [CHIP] TypeScript
T: [CHIP] Kubernetes
T: [CHIP] Azure
T: [CHIP] AWS
### Loyalty & Rewards Platforms
P: Configurable loyalty engines and financial analytics that power rewards programmes end to end.
#### Loyalty Rule Engine
T: Architecture & Implementation
P {.desc}: A high-throughput loyalty rule engine letting administrators configure an effectively unlimited set of rules across tiers, actions, rewards, events, benefits and channels — the configurable core of a modern rewards platform. Built with ASP.NET Core microservices, MongoDB and Apache Kafka on Azure.
T: [CHIP] ASP.NET Core
T: [CHIP] Microservices
T: [CHIP] MongoDB
T: [CHIP] Apache Kafka
T: [CHIP] Azure
T: [CHIP] Kubernetes
T: [CHIP] Docker
#### Loyalty P&L Reporting & Analytics
T: Architecture & Implementation
P {.desc}: A financial analytics and P&L reporting platform giving stakeholders self-serve access to margins, mark-ups, subscription fees, accruals and redemptions. A serverless data pipeline on AWS — Lambda, SQS, DynamoDB, Redshift and QuickSight — turns raw loyalty events into board-ready reporting.
T: [CHIP] Python
T: [CHIP] .NET Core
T: [CHIP] AWS Lambda
T: [CHIP] DynamoDB
T: [CHIP] Redshift
T: [CHIP] QuickSight
T: [CHIP] ETL
T: [CHIP] Microservices
### Cloud Migration & DevOps
P: On-premises to cloud — lifted, shifted and re-architected on AWS for resilience and elastic scale.
#### Loyalty Platform — Cloud Migration & Re-Architecture
T: Solutions Architecture & Migration
P {.desc}: End-to-end AWS cloud migration of a loyalty platform's on-premises integration services and APIs, followed by re-architecture of critical components using cloud-native AWS PaaS and proven patterns — delivering a highly available, resilient and horizontally scalable system.
T: [CHIP] AWS
T: [CHIP] ASP.NET Core
T: [CHIP] Apache Kafka
T: [CHIP] React Native
T: [CHIP] Kubernetes
T: [CHIP] Docker
T: [CHIP] Microservices
#### AWS Lift & Shift and Re-Architecture
T: Solutions Architecture & Migration
P {.desc}: Migration of on-premises integration services and APIs to AWS using IaaS, then re-architecture of critical components with AWS PaaS and Well-Architected patterns for high availability and elastic scale — infrastructure as code with HashiCorp Terraform across Route 53, CloudFront, WAF/Shield, VPC, EC2, RDS and S3.
T: [CHIP] AWS
T: [CHIP] HashiCorp Terraform
T: [CHIP] IaC
T: [CHIP] CloudFront
T: [CHIP] WAF
T: [CHIP] VPC
T: [CHIP] EC2
T: [CHIP] RDS
### Enterprise Integration & Identity
P: EAI, API platforms and single sign-on that connect systems, partners and identities securely.
#### Marketplace Integration Platform
T: Solution Architect & Delivery Lead
P {.desc}: An enterprise integration platform that synchronises supplier catalogues into a marketplace and integrates order placement back to suppliers in real time. Event-driven microservices spanning AWS (ECS, Lambda, SQS, EventBridge, API Gateway) and Azure (AKS, API Management, Azure SQL), with GraphQL APIs.
T: [CHIP] C#
T: [CHIP] ASP.NET Core
T: [CHIP] React
T: [CHIP] Microservices
T: [CHIP] AWS
T: [CHIP] Azure
T: [CHIP] GraphQL
T: [CHIP] Kubernetes
#### Custom Integration Platform & Integrations
T: Architecture Lead
P {.desc}: A custom enterprise application integration (EAI) platform and a broad suite of integrations connecting on-premises and SaaS systems through APIs, messaging and event-driven flows — fronted by a Kong API gateway and built on reusable enterprise-integration patterns across a multi-year .NET estate.
T: [CHIP] ASP.NET Core
T: [CHIP] .NET
T: [CHIP] Microservices
T: [CHIP] RabbitMQ
T: [CHIP] Kong API Gateway
T: [CHIP] Azure
T: [CHIP] AWS
T: [CHIP] Kubernetes
#### Azure AD OneClick SSO
T: Architecture & Implementation
P {.desc}: A one-click single sign-on (SSO) integration delivering uni-directional federation from Microsoft Azure Active Directory to Cornerstone — configurable in minutes and eliminating separate portal credentials.
T: [CHIP] Azure Active Directory
T: [CHIP] SSO
T: [CHIP] .NET Core
T: [CHIP] ASP.NET Core
T: [CHIP] MS SQL
### Healthcare & HealthTech
P: Clinical systems with HL7 integration across labs, providers and patient portals.
#### NHSP Hearing Screening System
T: Architecture & Technical Guidance
P {.desc}: A healthcare platform to manage patients, record newborn hearing-screening tests, generate clinical reports and run analytics — with HL7 integration to connected health systems.
T: [CHIP] ASP.NET MVC
T: [CHIP] ASP.NET Web API
T: [CHIP] WCF
T: [CHIP] MS SQL Server
T: [CHIP] HL7
#### CareEvolve — Lab Management & Health Data Integration
T: Architecture & Technical Guidance
P {.desc}: A laboratory management and health-data integration system enabling physicians to order lab tests, trigger alerts, generate reports and run analytics — with HL7 integration to multiple laboratories and a patient portal for results.
T: [CHIP] ASP.NET MVC
T: [CHIP] Web Services
T: [CHIP] MS SQL Server
T: [CHIP] HL7
T: [CHIP] .NET Framework
T: [EYEBROW] Enterprise engagements
## Have a platform to architect or migrate?
P {.lead}: From compliance systems to cloud migrations — let's scope the architecture together.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Our services ⟨/services/⟩
<!-- TESTIMONIALS -->

=== SECTION ===
T: [EYEBROW] What people say
## Trusted by clients and collaborators.
T: ★★★★★ 5.0
P {.tproj}: A 5.0-rated engagement for the Sales Automation project — Mobile App Development, on a fixed-price build.
CAPTION: SR Satyam RathaurVerified client reviewGoodFirms
QUOTE: “I've had the pleasure of collaborating with Het. Having strong technical knowledge, particularly in DevOps and Power BI, and always approaching challenges with a solution-oriented mindset.”
CAPTION: SB Shalin BhattBusiness Consultant for Startups & SMBsLinkedIn
QUOTE: “Het is a friendly, positive, responsible person and it was amazing meeting him on my networking sessions about digital marketing.”
CAPTION: JB Jiri BorcNetworking & community buildingLinkedIn
<!-- CTA -->

=== SECTION ===
## Your project could be next / on this list.
P {.lead}: Apps, AI or enterprise platforms — tell us what you're building and we'll show you how we'd ship it.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Explore AI app ideas ⟨/ai-app-development/⟩

=== SECTION ===
T: Start here
## Want something like this built?
P {.lb-sub}: Tell us what you have in mind. We’ll tell you what it takes, and what it doesn’t need.
[LEAD FORM — fields as in Global]

=== SECTION ===
T: [EYEBROW] Common questions
## About the work above.
BUTTON {.faq-q}: What real results have you delivered for clients?
T: Measured outcomes, not vanity metrics: 40% less payroll processing time for our HR & Payroll platform, a 35% lift in downloads and 20% rise in venue bookings for our Creator–Venue Marketplace, standardised multi-store operations for our Retail Operations platform, and average booking time down to ~3 minutes for our Ride-Hailing platform. Product names are withheld under client NDAs — every metric is real.
BUTTON {.faq-q}: Are the Web3 Creator and Fan Investment platforms real, shipped products?
T: No — they're clearly labelled as product & UI/UX design concepts on this page. We don't claim results or live status for work that hasn't shipped.
BUTTON {.faq-q}: What industries have you shipped apps in?
T: HR & payroll, influencer marketing, retail operations, and ride-hailing, among others — see the case studies above for the problem, approach and result on each.
BUTTON {.faq-q}: Can I see case studies for a specific industry, like FinTech or retail?
T: Yes — check our industry pages for FinTech ⟨/fintech-app-development/⟩, Retail ⟨/retail-app-development/⟩, Ride-Hailing ⟨/ride-hailing-app-development/⟩ and HR & Payroll ⟨/hr-payroll-app-development/⟩ app development.
BUTTON {.faq-q}: Is the Healthcare Staffing Platform live on the App Store or Google Play?
T: Not yet publicly — it's presented as a delivered platform (mobile app + web dashboard), the same way we present our enterprise engagements, without store links or live-status claims.
BUTTON {.faq-q}: Why don't you name these products?
T: Client confidentiality agreements. The problems, solutions, metrics, tech stacks and screens shown are all real and unaltered — only the product names are withheld.



### FILE about/index.html
TITLE: About | Soni Consultancy Services
DESC: A senior-only React Native, MERN & AI app studio founded by Het Soni, shipping apps live on the App Store & Google Play across six countries.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › About
T: [EYEBROW] Who we are
# A senior-only studio / that actually ships.
P {.lead}: Soni Consultancy Services builds React Native & MERN apps with AI inside — for founders and teams who care more about shipping than slideware.

=== SECTION ===
T: HS
T: Het Soni
T: Founder & Lead Engineer
T: [CHIP] LinkedIn ↗ ⟨https://www.linkedin.com/in/hetsoni/⟩
## Built by engineers, run like a product team.
P {.muted}: We're a boutique studio, not an agency body-shop. The senior engineers on your first call are the ones who write your code and submit your app. We've shipped attendance & payroll, retail ops, creator marketplaces and ride-hailing — real products, live on the App Store and Google Play, across six countries.
P {.muted}: Our edge is range: deep React Native and MERN, plus AI integration that earns its place. We move fast because we keep the team small and the standards high.

=== SECTION ===
T: [NUM] 4+
T: [LBL] Apps shipped
T: [NUM] 30+
T: [LBL] Countries served
T: [NUM] 8
T: [LBL] Store listings
T: [NUM] 5+
T: [LBL] Yrs senior experience

=== SECTION ===
T: [EYEBROW] What we value
## How we work.
### Ship over slideware
P {.muted}: Working software every week beats a perfect plan. You see progress, not promises.
### Senior, not staffed-up
P {.muted}: No juniors learning on your budget. Every line is written by someone who's shipped before.
### Honest, even when it costs us
P {.muted}: If you shouldn't build it, we'll tell you. Trust beats one more invoice.

=== SECTION ===
T: [EYEBROW] Where we work
## Six countries. One standard.
T: 🇬🇧
T: United Kingdom
T: SaaS · FinTech · Healthcare
T: 🇺🇸
T: United States
T: SaaS · AI · E-commerce
T: 🇦🇪
T: UAE
T: Real Estate · Retail
T: 🇮🇳
T: India
T: EdTech · FinTech · SaaS
T: 🇨🇦
T: Canada
T: Healthcare · B2B
T: 🇦🇺
T: Australia
T: PropTech · Marketplace

=== SECTION ===
## Let's build something / worth shipping.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See our work ⟨/work/⟩

=== SECTION ===
T: Start here
## Start a conversation.
P {.lb-sub}: No pitch deck, no discovery-call funnel. It goes straight to Het, who reads every brief personally.
[LEAD FORM — fields as in Global]

=== SECTION ===
T: [EYEBROW] Common questions
## About the studio.
BUTTON {.faq-q}: Who founded Soni Consultancy Services?
T: Het Soni, Founder & Lead Engineer, with 5+ years of senior commercial experience in React Native, MERN and AI.
BUTTON {.faq-q}: What makes Soni Consultancy Services different from a typical agency?
T: We're a boutique studio, not an agency body-shop — the senior engineers on your first call are the ones who write your code and submit your app. No juniors, no account-manager layer.
BUTTON {.faq-q}: Which countries do you work with clients in?
T: The UK, US, UAE, India, Canada and Australia — six countries, one standard of senior-only engineering.
BUTTON {.faq-q}: How many apps has Soni Consultancy Services shipped?
T: 4+ apps live across 8 store listings, serving users in 30+ countries.



### FILE contact/index.html
TITLE: Contact | Soni Consultancy Services
DESC: Book a free 30-minute call to scope your React Native, MERN or AI app, or send a brief — we reply within one business day.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › Contact
T: [EYEBROW] Get in touch
# Let's scope your app / this week.
P {.lead}: 30 minutes, no pitch deck — just an honest conversation about what you're building and whether we're the right team.

=== SECTION ===
T: Fastest · Recommended
T: Book a Free 30-Min Call
T: Calendly with Het directly — UK, US & UAE times available.
T: ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Email
T: het.soni@soniconsultancyservices.com
T: Replies within one business day.
T: ⟨mailto:het.soni@soniconsultancyservices.com⟩
T: LinkedIn
T: Connect with Het Soni
T: Good for a quick intro before reaching out.
T: ⟨https://www.linkedin.com/in/hetsoni/⟩
T: Response times
T: Discovery callSame day
T: Email1 business day
T: Project kick-offWithin 48 hours
## Send a brief
P {.muted}: Tell us about your app and we'll come to the call prepared.
FORM id=contactForm
LABEL: First name
INPUT: type=None name=None placeholder='James' id=fn value=None min=None max=None step=None
LABEL: Last name
INPUT: type=None name=None placeholder='Morrison' id=ln value=None min=None max=None step=None
LABEL: Work email
INPUT: type=email name=None placeholder='james@company.com' id=em2 value=None min=None max=None step=None
LABEL: Company
INPUT: type=None name=None placeholder='Acme Inc.' id=co value=None min=None max=None step=None
LABEL: I'm interested in…
SELECT name=None id=svc
OPT: Select a service
OPT: React Native App Development
OPT: MERN / Web Development
OPT: AI Integration
OPT: DevOps & Cloud
OPT: Hire a Developer
OPT: Something else
LABEL: Tell us about your project
BUTTON {.submit}: Send brief →
P: No spam, ever. We reply within one business day.
T: ✓ Brief received. We'll be in touch within one business day — or book a call to speak sooner.

=== SECTION ===
T: [EYEBROW] Where we work
## Six countries. One standard.
T: 🇬🇧
T: United Kingdom
T: SaaS · FinTech · Healthcare
T: 🇺🇸
T: United States
T: SaaS · AI · E-commerce
T: 🇦🇪
T: UAE
T: Real Estate · Retail
T: 🇮🇳
T: India
T: EdTech · FinTech · SaaS
T: 🇨🇦
T: Canada
T: Healthcare · B2B
T: 🇦🇺
T: Australia
T: PropTech · Marketplace

=== SECTION ===
T: [EYEBROW] Common questions
## Before you reach out.
BUTTON {.faq-q}: How quickly can you start?
T: Fast — average kick-off from signed contract is 48 hours, and discovery calls are bookable same-day. Flag anything urgent in the form and we'll prioritise.
BUTTON {.faq-q}: Do you work with early-stage founders?
T: Yes — from solo founders on a first MVP to teams at Series B. What matters is a clear problem and the seriousness to ship.
BUTTON {.faq-q}: What does a typical app cost?
T: A focused MVP starts in the low five figures; full products with mobile + AI scale from there. You get a fixed-price proposal within 48 hours of the call — no vague "it depends."
BUTTON {.faq-q}: Do you sign NDAs?
T: Always, before any substantive discussion of your product. Your ideas and data stay confidential throughout and after.
BUTTON {.faq-q}: Will I work directly with Het?
T: Yes — directly with Het from first call to delivery. No account managers, and direct access to the engineers building your app.




### FILE ai-app-development/index.html
TITLE: AI App Development | Soni Consultancy Services
DESC: Build AI-powered mobile apps — Claude & GPT integration, assistants, RAG and prediction in React Native. 12 AI app ideas and how we ship them.
<!-- HERO -->

=== SECTION ===
T: [EYEBROW] AI App Development
# Build an app that / thinks.
P {.lead}: AI is no longer a feature you bolt on — it's the reason users pick one app over another. We build React Native apps with Claude & GPT inside, from smart assistants to prediction engines. Here are the ideas, and how we ship them.
T: Discuss Your AI App ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See 12 AI app ideas ↓ ⟨#ideas⟩
<!-- WHY NOW -->

=== SECTION ===
T: [NUM] 3×
T: [LBL] Higher engagement when AI removes a manual step users hate
T: [NUM] 6wk
T: [LBL] From idea to a working AI feature in users' hands
T: [NUM] ∞
T: [LBL] Models improve over time — your app gets smarter without a rebuild
<!-- AI APP IDEAS -->

=== SECTION id=ideas ===
T: [EYEBROW] Ideas worth building
## 12 AI app ideas / that actually convert.
P {.lead}: Not "AI for AI's sake" — each of these solves a real, billable problem. Pick one, or bring your own and we'll scope it.
### AI Support Assistant
P: A 24/7 in-app assistant that answers from your own docs (RAG), deflects tickets and hands off to a human when it matters.
T: [TAG] Claude · RAG · Chat
### Predictive Pricing
P: AI fare / price prediction based on demand, time and traffic — like we've built for ride-hailing clients. Transparent pricing users trust.
T: [TAG] ML · Forecasting
### Smart Matching Engine
P: Pair people, jobs, venues or products by intent — not keywords. Embeddings + ranking that gets better as data grows.
T: [TAG] Embeddings · Vector DB
### Document & Receipt Scanner
P: Snap a photo → AI extracts, classifies and files it. Invoices, IDs, receipts, forms — OCR plus an LLM that understands context.
T: [TAG] Vision · OCR · LLM
### AI Voice Assistant
P: Hands-free, natural-language control of your app. Speech-to-text, intent, and an LLM that actually does the task.
T: [TAG] Voice · STT · Agents
### AI Health & Fitness Coach
P: Personalised plans, form feedback and check-ins that adapt to the user — coaching that feels one-to-one at scale.
T: [TAG] Personalisation
### AI Content Generator
P: Captions, listings, replies, summaries — on-brand content generated in-app so users ship faster and stay longer.
T: [TAG] GPT · Claude
### AI Analytics & Insights
P: Turn raw data into plain-English insights and next actions — a "talk to your data" layer on dashboards.
T: [TAG] RAG · Analytics
### AI Sales Co-pilot
P: Lead scoring, follow-up drafting and call summaries inside your CRM app — reps sell, AI handles the admin.
T: [TAG] Agents · Automation
### AI Tutor / LMS
P: Adaptive lessons, instant Q&A and auto-graded practice — like the gamified LMS we built for a retail platform, with an AI that meets each learner.
T: [TAG] Education · RAG
### AI Shopping Concierge
P: Natural-language product discovery and recommendations that lift basket size and cut returns.
T: [TAG] Recommendations
### AI Moderation & Safety
P: Real-time content moderation, fraud signals and SOS triage — keep your community and platform safe at scale.
T: [TAG] Classification · Trust
<!-- HOW WE BUILD -->

=== SECTION ===
T: [EYEBROW] How we ship AI
## From idea to a smart / app in four moves.
T: 01
### Define the win & the eval
P: We start from the outcome — the manual step to kill or the metric to move — and write the test cases that prove the AI works before we build it.
T: 02
### Pick the right model & pattern
P: Claude or GPT, RAG vs fine-tune, on-device vs cloud, single call vs agent. We choose for accuracy, latency and cost — not hype.
T: 03
### Build into React Native + MERN
P: The AI ships inside a real product — clean UX, a MERN backend, vector store, caching and guardrails for when the model is wrong.
T: 04
### Measure, ship, improve
P: Instrumented from day one — cost, latency and quality visible. We launch behind a human-in-the-loop, then expand as the data earns trust.
<!-- TRENDING KEYWORDS / DEMAND -->

=== SECTION ===
T: [EYEBROW] Where the market is moving
## What everyone's / searching for in 2026.
P {.lead}: High-intent demand around React Native & AI — the conversations we're having with founders every week.
T: AI app development React Native AI integration ChatGPT app development Claude API integration build an AI app AI chatbot for business LLM app development AI agent development on-device AI mobile cross-platform app development hire React Native developers AI SaaS development RAG application development AI MVP development React Native vs Flutter
<!-- CTA -->

=== SECTION ===
## Got an AI idea? / Let's see if it's worth building.
P {.lead}: 30 minutes with a senior engineer who ships AI for a living. We'll tell you honestly whether AI is the right call — and what it takes.
T: Book Your Free AI Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See AI we've shipped ⟨/work/⟩

=== SECTION ===
T: [EYEBROW] Free guides & tools
## Scope it before you build it.
T: Scope tool
T: Can AI build your app?
T: Find out →
T: ⟨/blog/can-ai-build-my-app⟩
T: Stack picker
T: Which stack fits your MVP
T: Get a recommendation →
T: ⟨/blog/mvp-tech-stack-2026⟩
T: Self-audit
T: Is your app DPDP-ready?
T: Score your readiness →
T: ⟨/blog/dpdp-act-app-compliance-india⟩

=== SECTION ===
T: Start here
## Scope your AI feature.
P {.lb-sub}: Describe the feature in one line. We’ll tell you honestly whether AI is the right tool for it — including when it isn’t.
[LEAD FORM — fields as in Global]

=== SECTION ===
T: [EYEBROW] Common questions
## About building AI in.
BUTTON {.faq-q}: What kind of AI features do you build into apps?
T: Practical, revenue-relevant features — AI support assistants (RAG), predictive pricing, smart matching engines, document/receipt scanning, voice assistants, content generation, analytics copilots, sales copilots, AI tutors, shopping concierges, and moderation/safety. See the 12 ideas above.
BUTTON {.faq-q}: Do you use Claude or GPT?
T: Both — we choose the model and pattern (RAG vs fine-tune, on-device vs cloud, single call vs agent) based on accuracy, latency and cost for your use case, not hype.
BUTTON {.faq-q}: How long does it take to ship an AI feature?
T: Typically around 6 weeks from idea to a working AI feature in users' hands.
BUTTON {.faq-q}: Is the AI feature built into my React Native app, or is it a separate product?
T: It ships inside your real product — React Native front end, MERN backend, vector store, caching and guardrails for when the model gets it wrong.
BUTTON {.faq-q}: How do you make sure the AI actually works before launch?
T: We define the outcome and write eval/test cases before building, then launch behind a human-in-the-loop and expand automation as the data earns trust.



### FILE devops-cloud-engineering/index.html
TITLE: DevOps & Cloud Engineering | Soni Consultancy Services
DESC: Managed DevOps & cloud engineering — CI/CD, Kubernetes, Terraform IaC, AWS & Azure migration, observability and SRE.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › DevOps & Cloud
T: [EYEBROW] DevOps & Cloud · AWS · Azure
# Ship faster. / Spend less on cloud.
P {.lead}: CI/CD pipelines, Kubernetes, Terraform infrastructure-as-code, AWS & Azure migration, and observability — engineered so your team deploys on demand, recovers in minutes, and stops overpaying for idle infrastructure.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See the live dashboard ↓ ⟨#obs⟩
<!-- CREDIBILITY BAR -->

=== SECTION ===
T: [LBL] Architected by senior engineers AWS Certified Azure Solutions Architect Expert TOGAF 9 15+ yrs · fintech · healthcare · enterprise
<!-- INTERACTIVE OBSERVABILITY DASHBOARD -->

=== SECTION id=obs ===
T: Operations & delivery health
T: DORA metrics · pipeline · uptime — the signals we engineer toward
T: Illustrative demo · sample data
T: Deploy frequency
T: 14 / day
T: ▲ on-demand
T: Lead time
T: 42 min
T: ▼ from 6 days
T: Change-fail rate
T: 3.1 %
T: ▼ elite band
T: MTTR
T: 11 min
T: ▼ auto-rollback
T: Deployments — last 14 days
T: Uptime · 30 days
T: 99.98%SLA met
T: Error budget healthy. / 2 alerts auto-resolved this week.
T: Build›
T: Test›
T: Scan›
T: Deploy
T: api-gateway
T: auth-service
T: payments
T: worker-queue
P {.dim}: Illustrative dashboard with sample data — not live telemetry. It shows the kind of delivery and reliability signals we instrument and optimise for your team.
<!-- FREE TOOLS -->

=== SECTION ===
### DevOps maturity assessment
P: Answer a few quick questions and get your maturity score — Foundational to Elite — with tailored next steps. About two minutes.
T: Start the assessment → ⟨/devops-maturity-assessment/⟩
### Cloud cost calculator
P: Estimate how much you could save on AWS/Azure from your current monthly spend. Instant, indicative range — no strings.
T: Estimate your savings → ⟨/cloud-cost-calculator/⟩
<!-- IS THIS FOR YOU -->

=== SECTION ===
T: [EYEBROW] Is this for you?
## You're in the / right place if…
#### Releases are scary
P: Deploys are manual, infrequent and stressful — and a bad one means downtime or a late night.
#### The cloud bill keeps climbing
P: Your AWS or Azure spend grows faster than usage, and nobody's quite sure where the money goes.
#### You're outgrowing click-ops
P: Scaling, on-call and environments are held together by hand and tribal knowledge — and it's starting to crack.
<!-- WHAT WE DO -->

=== SECTION ===
T: [EYEBROW] What we do
## From commit to / production — automated.
### CI/CD pipelines
P: Automated test, security-scan, build and deploy on every commit — with safe rollbacks. Push-button, low-risk releases so you ship daily, not monthly.
### Cloud migration · AWS & Azure
P: Lift-and-shift and re-architecture to AWS or Azure — made highly available, resilient and scalable, with a clear, low-downtime cutover plan.
### Kubernetes & containers
P: Docker and Kubernetes (EKS/AKS) done right — autoscaling, zero-downtime rollouts, health checks and sane resource limits. No 2am pages.
### Infrastructure as Code
P: Your whole stack codified in Terraform (or Bicep/CloudFormation) — versioned, reviewable and reproducible. Spin up identical environments in minutes.
### Observability & SRE
P: Metrics, logs, traces and alerting with Prometheus, Grafana, CloudWatch or Datadog — plus SLOs and error budgets so you catch issues before users do.
### Mobile CI/CD
P: Automated React Native release pipelines — Fastlane & EAS, signed builds, App Store and Play Store submission, and over-the-air updates. Ties into our React Native development ⟨/react-native-app-development/⟩.
<!-- INTERACTIVE ARCHITECTURE DIAGRAM -->

=== SECTION ===
T: [EYEBROW] Reference architecture
## Tap any layer to / see how it fits.
P {.lead}: A production-grade cloud architecture we build toward. Explore each layer — what it does and why it matters.
BUTTON {.arch-node}: Users · Web · Mobile
BUTTON {.arch-node}: CDN · WAFCloudFront / Front Door
BUTTON {.arch-node}: Load balancer · API gateway
BUTTON {.arch-node}: Kubernetes podsEKS / AKS · autoscaling
BUTTON {.arch-node}: Managed DB
BUTTON {.arch-node}: Cache · Queue
BUTTON {.arch-node}: CI/CD · Terraform IaC
BUTTON {.arch-node}: Observability · SRE
T: Reference architecture
#### Tap any layer above
P: Each box is a layer of a resilient, scalable cloud platform. Select one to see what it does and why it earns its place — from the edge all the way down to your data and the pipelines that keep it shipping.
<!-- MID CTA -->

=== SECTION ===
### See where your biggest win is.
P: A free 30-minute call — we'll find the one change that moves the needle most for your stack.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
<!-- WHERE WE'VE DONE THIS (anonymized) -->

=== SECTION ===
T: [EYEBROW] Where this comes from
## Enterprise-grade, / not theory.
P {.lead}: The same patterns we’d bring to your platform — proven on regulated, high-scale systems. A few anonymised examples (client and product names withheld):
### FinTech case-management platform
P: Microservices architecture with Kafka event streaming and Kubernetes for a financial-crime / AML platform — built for high throughput and auditability.
### On-prem → AWS migration
P: Lift-and-shift and re-architecture of a legacy loyalty platform to AWS, making critical components highly available, resilient and scalable.
### Multi-cloud integration layer
P: A custom integration platform spanning AWS and Azure managed services, containerised with Docker/Kubernetes and provisioned via Terraform.
P {.dim}: Anonymised summaries of representative work — client and product names withheld. No confidential details or metrics are shown.
<!-- ENGAGEMENT MODELS -->

=== SECTION ===
T: [EYEBROW] Engagement models
## Start small. / Scale when it pays off.
T: Cloud Cost Audit
T: Custom · one-off audit
T: A fast, fixed-scope review of your AWS/Azure bill and architecture.
-: Spend & waste analysis
-: Right-sizing & savings-plan recommendations
-: Prioritised action plan with $ impact
T: Estimate your savings → ⟨/cloud-cost-calculator/⟩
T: DevOps Foundations
T: Custom · project
T: Get the core automation in place: pipelines, IaC and observability.
-: CI/CD pipeline setup
-: Terraform infrastructure-as-code
-: Monitoring, logging & alerting
-: Runbooks & handover
T: Scope a project → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Managed SRE / Platform
T: Custom · monthly
T: We run and continuously improve your platform as an extension of your team.
-: On-going reliability & on-call support
-: Cost optimisation & capacity planning
-: Security patching & upgrades
-: Quarterly architecture reviews
T: Talk to us → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
P {.dim}: Every engagement is scoped to your stack and goals — we confirm a fixed price after a short discovery call. No obligation.
<!-- PROCESS -->

=== SECTION ===
T: [EYEBROW] How we work
## Assess. Architect. / Automate. Operate.
T: 01
### Assess
P: We map your current stack, pipelines, cloud spend and pain points — and agree the highest-leverage fixes first.
T: 02
### Architect
P: A target architecture and migration/automation plan with clear trade-offs, timelines and a fixed price.
T: 03
### Automate
P: We build the pipelines, codify infrastructure in Terraform and ship in safe, reviewable increments.
T: 04
### Operate
P: Observability, SLOs and optional managed support keep it fast, reliable and cost-efficient as you grow.
<!-- TECH STACK -->

=== SECTION ===
T: [EYEBROW] Tooling
## The stack we work in.
T: AWSMicrosoft AzureDockerKubernetesTerraformAzure BicepCloudFormationGitHub ActionsGitLab CIJenkinsArgo CDHelmPrometheusGrafanaCloudWatchDatadogNew RelicApache KafkaRabbitMQRedisPostgreSQLMongoDBFastlaneEAS
<!-- FAQ -->

=== SECTION ===
T: [EYEBROW] Free guides & tools
## Guides for your infrastructure.
T: Migration check
T: Is your app on borrowed time?
T: Check urgency →
T: ⟨/blog/react-native-new-architecture-2026⟩
T: Guide
T: AWS cloud migration, done right
T: Read the guide →
T: ⟨/blog/aws-cloud-migration-guide⟩
T: Guide
T: CI/CD for React Native apps
T: Read the guide →
T: ⟨/blog/ci-cd-react-native⟩

=== SECTION ===
T: [EYEBROW] FAQ
## Common questions.
BUTTON {.faq-q}: What does a DevOps & cloud engagement include?
T: It depends on where you are. Common scope: setting up CI/CD pipelines, containerising apps and moving them to Kubernetes, codifying infrastructure with Terraform, migrating to or optimising AWS/Azure, and adding observability so you catch issues before users do. We scope it on a short call and propose a fixed plan.
BUTTON {.faq-q}: Do you work with both AWS and Azure?
T: Yes. We design and operate on both AWS and Azure (and the surrounding ecosystem — Docker, Kubernetes, Terraform, GitHub Actions, Prometheus, Grafana). We pick the stack that fits your team and workloads, not the one we want to sell.
BUTTON {.faq-q}: Can you reduce our cloud bill?
T: Usually, yes. Most teams over-provision compute, leave idle resources running and miss savings plans. A cloud cost audit identifies the waste; right-sizing, autoscaling and IaC guardrails keep it from coming back. Try our cloud cost calculator ⟨/cloud-cost-calculator/⟩ for an indicative estimate.
BUTTON {.faq-q}: How do you set up CI/CD pipelines?
T: We build automated pipelines (GitHub Actions, GitLab CI, Jenkins or Azure DevOps) that test, security-scan, build and deploy on every commit — with safe rollbacks. The goal is push-button, low-risk releases so your team ships daily instead of monthly.
BUTTON {.faq-q}: Do you support mobile CI/CD for React Native apps?
T: Yes — automated React Native release pipelines with Fastlane and EAS, signed builds, App Store and Play Store submission, and over-the-air updates. It ties directly into our React Native app development ⟨/react-native-app-development/⟩ practice.
BUTTON {.faq-q}: How quickly can you start?
T: Most engagements begin within a week of a scoping call. A focused cloud cost audit or CI/CD setup can show results in the first couple of weeks.
<!-- FINAL CTA -->

=== SECTION ===
T: Start here
## Tell us about your infrastructure.
P {.lb-sub}: Migration, CI/CD or a cloud bill that keeps climbing — tell us the problem and we’ll tell you the fix.
[LEAD FORM — fields as in Global]

=== SECTION ===
## Deploy with confidence.
P {.lead}: A 30-minute call to find your highest-leverage win — then a fixed-price plan within 48 hours. NDA on request.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Estimate cloud savings ⟨/cloud-cost-calculator/⟩



### FILE hire/index.html
TITLE: Hire React Native Developers | Soni Consultancy Services
DESC: Hire senior React Native, MERN, Flutter, AI and DevOps engineers — staff augmentation, dedicated teams or contract. IR35-aware, kick-off within 48 hours.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › Hire a Developer
T: [EYEBROW] Hire a developer
# Senior engineers. / Ready this month.
P {.lead}: Staff augmentation, dedicated pods or contract. Senior React Native, MERN, Flutter, AI and DevOps engineers — IR35-aware, UK-based and remote-global.
T: Discuss a Placement → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Send a brief ⟨/contact/⟩

=== SECTION ===
T: [EYEBROW] How we work
## Three ways to work / with our engineers.
### Staff Augmentation
P: Embed our senior engineers into your team — your tools, your sprints, your culture.
-: Senior-only, no juniors
-: Works in your sprint cadence
-: Scales up or down monthly
-: IR35-compliant contracts
T: [CHIP] From 1 month
T: [CHIP] Remote/hybrid
T: [BADGE] Most popular
### Dedicated Team
P: A dedicated pod — engineers plus design & DevOps — focused entirely on your roadmap, managed by us.
-: Dedicated bandwidth
-: Weekly demos & updates
-: Design + Dev + DevOps
-: Kick-off within 48 hours
T: [CHIP] From 3 months
T: [CHIP] Full-stack pod
### Project Contract
P: A scoped, fixed-price engagement with a defined deliverable — ideal for a discrete feature or MVP.
-: Fixed scope, price, timeline
-: Senior engineer every sprint
-: Full handover & docs
-: No retainer after delivery
T: [CHIP] From 4 weeks
T: [CHIP] Fixed price

=== SECTION ===
T: [EYEBROW] Available skills
## The engineers we place.
### React Native Engineer
P: iOS & Android from one codebase — push, maps, biometrics, store submissions.
T: [CHIP] React Native
T: [CHIP] Expo
### MERN / Full-Stack Engineer
P: React, Node, MongoDB end-to-end — APIs, dashboards, real-time, Stripe.
T: [CHIP] Node.js
T: [CHIP] MongoDB
T: [CHIP] Next.js
### AI / Claude Engineer
P: Claude & GPT integration, RAG pipelines, agents, evaluation & cost control.
T: [CHIP] Claude API
T: [CHIP] RAG
T: [CHIP] Python
### Flutter Engineer
P: Cross-platform mobile with native performance, complex animations, platform channels.
T: [CHIP] Flutter
T: [CHIP] Dart
### DevOps / Cloud Engineer
P: AWS, Docker, CI/CD, Terraform, monitoring and 99.9% uptime infrastructure.
T: [CHIP] AWS
T: [CHIP] Docker
T: [CHIP] CI/CD
### Product Designer
P: UX & UI for mobile-first products — research, prototypes, design systems.
T: [CHIP] Figma
T: [CHIP] UX/UI

=== SECTION ===
T: [EYEBROW] The process
## From brief to first commit / in 48 hours.
T: 01
### Share your brief
P: Role, skills, timeline, working style. 10 minutes, no long forms.
T: 02
### Candidate match
P: We match from our vetted pool within 24 hours — see what we actually screen for ⟨/blog/hire-react-native-developers⟩.
T: 03
### Intro call
P: 30 minutes with the engineer — technical & culture fit.
T: 04
### Kick-off
P: Contracts, onboarding, first standup — within 48 hours.

=== SECTION ===
### IR35-aware placements for UK clients
P {.muted}: We understand the UK contractor landscape and structure engagements with IR35 compliance in mind — inside-IR35 via umbrella or outside-IR35 limited company. We'll discuss the right structure on the first call.

=== SECTION ===
## Need a developer / this month?
P {.lead}: Tell us what you need — we'll match the right engineer within 24 hours.
T: Discuss a Placement → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Send a brief ⟨/contact/⟩

=== SECTION ===
T: Start here
## Tell us the role you need.
P {.lb-sub}: Senior engineers only. We’ll come back within 24 hours with who’s available and what it costs.
[LEAD FORM — fields as in Global]

=== SECTION ===
T: [EYEBROW] Common questions
## Before you hire.
BUTTON {.faq-q}: What engagement models do you offer for hiring developers?
T: Three models: staff augmentation (embed our engineers into your team), a dedicated team/pod managed by us, or a fixed-price project contract.
BUTTON {.faq-q}: How fast can you place a developer?
T: We match a candidate within 24 hours of your brief and can kick off within 48 hours.
BUTTON {.faq-q}: Which roles can I hire?
T: React Native, MERN/full-stack, AI/Claude, Flutter, and DevOps/Cloud engineers, plus product designers.
BUTTON {.faq-q}: Are your contracts IR35-compliant for UK clients?
T: Yes — we structure engagements with IR35 compliance in mind, inside via umbrella or outside via limited company, and discuss the right structure on the first call.
BUTTON {.faq-q}: Do you provide junior developers?
T: No — senior-only, with 5+ years commercial experience each. No juniors learning on your budget.



### FILE mvp-development/index.html
TITLE: MVP Development Company | Build Your MVP in 10–16 Weeks
DESC: MVP development for founders — scope it properly, ship in 10–16 weeks, learn from real users. Fixed-price proposal within 48 hours of a free call.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › MVP Development
T: [EYEBROW] MVP · Founders · 10–16 weeks
# Build the version / that proves it works.
P {.lead}: Most failed builds are not engineering failures — they are scoping failures. We help founders cut to a version one that a real user can actually use, then ship it in roughly 10–16 weeks of senior engineering effort, on a fixed price agreed before any code is written.
T: Book a free scoping call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Estimate your MVP cost ⟨/app-cost-calculator/⟩

=== SECTION ===
T: [EYEBROW] The hard part
## Deciding what not / to build.
P {.lead}: An MVP is not a cheap version of your product. It is the smallest thing that produces a real answer. Sort every feature into three buckets and be strict about the first one.
T: [TAG] Core
### Without it, there is no product
P: If you can describe a usable product without the feature, it is not core. Most scopes have far fewer core features than the founder first thinks.
T: [TAG] Supporting
### The core genuinely depends on it
P: Sign-in, basic settings, the plumbing the core cannot run without. Keep this list short and treat every addition with suspicion.
T: [TAG] Later
### Scheduled, not cancelled
P: Everything else. Writing it down as later matters — a feature with a date stops being argued about every week.
T: A practical test: for each feature, ask what actually happens if it ships three months after launch. “Some users would find it inconvenient” means it is not core. “The product makes no sense” means it is.

=== SECTION ===
T: [EYEBROW] What you get
## A real product, / not a demo.
### Cross-platform from one codebase
P: iOS and Android from a single React Native ⟨/react-native-app-development/⟩ codebase, so you are not funding two teams before you have proof anyone wants it.
### A backend that survives launch
P: MERN or PostgreSQL, real auth, and an architecture that will not need a rewrite the week after you get traction.
### AI only where it earns its place
P: Claude or GPT features when they solve a real problem — see AI app development ⟨/ai-app-development/⟩. We will talk you out of it when they do not.
### Store submission handled
P: Review-ready builds, listings and the back-and-forth with Apple and Google, included rather than quoted separately.
### Analytics from day one
P: An MVP that ships without instrumentation cannot answer the question you built it to answer. Events and funnels are part of the build.
### Code and accounts you own
P: Your repository, your infrastructure, your IP. Nothing to extract if you take it in-house or to another team later.

=== SECTION ===
T: [EYEBROW] Timeline
## Where an MVP sits.
P {.lead}: These bands are engineering effort — the working time of a senior team — not calendar time with more people thrown at it. Adding people to a late project reliably makes it later.
T: ~10–16 weeks
T: MVP / focused first product. One core loop, a handful of screens, standard auth, a straightforward backend, one or two integrations. This is what you build to test demand. An attendance and payroll platform we built shipped in around 16 weeks, at the fuller end of this band.
T: ~24–32 weeks
T: Standard / market-ready. Several connected modules, custom interface work, real-time features, payments and a proper admin side. Most funded products land here — it is a step beyond an MVP, not an MVP.
T: 32+ weeks
T: Complex / scale. Multi-sided platforms, heavy integrations, strict compliance or high concurrency. If your idea only works at this size, an MVP may not be the right first move — and we will say so.
P {.muted}: More detail on how these are estimated: how long it takes to build a mobile app ⟨/blog/how-long-to-build-an-app⟩.

=== SECTION ===
T: [EYEBROW] Budget
## What it costs, / honestly.
P {.lead}: A focused MVP typically starts in the low five figures (USD), and scales from there with feature depth. Anyone quoting a single number for “an app” without asking about your backend is guessing.
P {.muted}: The thing that moves the number most is not screen count — it is what has to be true underneath. Real-time updates, payments, offline behaviour, role-based access and third-party integrations drive far more cost than another screen does. That is the question we spend most of the scoping call on.
T: Estimate your scope → ⟨/app-cost-calculator/⟩
T: Read the full cost breakdown ⟨/blog/react-native-app-development-cost⟩

=== SECTION ===
T: [EYEBROW] Process
## Idea to launch, / without the drama.
T: 01
### Scope call
P: 30 minutes on your goals, users and constraints — with an honest read on feasibility. If the idea has a serious problem, you hear it here, not in month three.
T: 02
### Fixed-price proposal
P: Scope, timeline and a fixed price within 48 hours. Version one separated from later phases explicitly, with the assumptions written down.
T: 03
### Build
P: Weekly demo builds you can hold in your hand from the first sprint — working software, not a status report describing it.
T: 04
### Launch & learn
P: Store submission handled, then monitoring and iteration once real usage starts telling you what you actually built.

=== SECTION ===
T: [EYEBROW] Proof
## Products we shipped.
P {.lead}: Real builds, live in users' hands. Product names are withheld under client NDAs — every metric and timeline below is real.
T: 16 weeks
T: HR & payroll platform — the closest of our builds to MVP scale, live on both stores
T: See the case study →
T: ⟨/work/#hr-payroll⟩ +35%
T: Downloads after launch for a creator–venue marketplace
T: See the case study →
T: ⟨/work/#creator-marketplace⟩ ~3 min
T: Average booking time on a ride-hailing platform with AI fare prediction
T: See the case study →
T: ⟨/work/#ride-hailing⟩

=== SECTION ===
T: [EYEBROW] Before you commit
## Worth reading first.
### Validate before you build
P: The cheapest MVP is the one you did not need. How to validate an app idea ⟨/blog/validate-app-idea-before-building⟩ before spending on engineering.
### Choosing the stack
P: Framework choice is mostly a hiring decision, not a benchmark one. How to choose your MVP tech stack ⟨/blog/mvp-tech-stack-2026⟩.
### Can AI just build it?
P: A straight answer rather than a sales one: what AI genuinely accelerates ⟨/blog/can-ai-build-my-app⟩, and what it still cannot own.
### After launch
P: What changes once real users arrive: from MVP to product-market fit ⟨/blog/mvp-to-product-market-fit⟩.
### Scope it yourself
P: The five questions we ask on every scoping call, as a free 8-page guide: the app scoping guide ⟨/app-scoping-guide/⟩.
### Need a team, not a project?
P: If you have ongoing capacity needs rather than a fixed scope, you can hire a dedicated team ⟨/hire/⟩ instead.

=== SECTION ===
T: [EYEBROW] Free guides & tools
## Do your homework first.
T: Stack picker
T: Which stack fits your MVP
T: Get a recommendation →
T: ⟨/blog/mvp-tech-stack-2026⟩
T: Scope tool
T: Can AI build your app?
T: Find out →
T: ⟨/blog/can-ai-build-my-app⟩
T: Decision tool
T: Native, React Native or Flutter?
T: Get a recommendation →
T: ⟨/blog/native-vs-cross-platform-2026⟩

=== SECTION ===
T: [EYEBROW] FAQ
## Common questions.
BUTTON {.faq-q}: What exactly is an MVP, and how is it different from a prototype?
T: A prototype answers “could this work?” and is usually throwaway. An MVP answers “will people actually use this?” and has to survive real users, real data and real edge cases. That difference is most of the cost. If you only need to test a concept with a few people, a prototype is cheaper and faster — and we will say so on the call.
BUTTON {.faq-q}: How long does MVP development take?
T: Most focused MVPs land in roughly 10–16 weeks of senior engineering effort. That is effort, not calendar time with more people added — adding people to a late project reliably makes it later. For reference, an attendance and payroll platform we built shipped in around 16 weeks, at the fuller end of that band.
BUTTON {.faq-q}: How much does an MVP cost?
T: A focused MVP typically starts in the low five figures (USD), and scales from there with feature depth — particularly the back-end surface: real-time data, payments, offline behaviour, role-based access and third-party integrations move the number far more than screen count does. Use the app cost calculator for a range against your own scope, then a free call gets you a fixed-price proposal within 48 hours.
BUTTON {.faq-q}: What should I cut from version one?
T: Sort every feature into Core, Supporting and Later. Core means the product does not do its one job without it. Supporting means the core genuinely depends on it. Everything else is Later — scheduled, not cancelled. A practical test: ask what actually happens if a feature ships three months after launch. If the answer is “some users would find it inconvenient”, it is not core.
BUTTON {.faq-q}: Do I own the code?
T: Yes. You own the repository, the infrastructure accounts and the intellectual property. We build in your accounts where possible so there is nothing to extract if you take the product in-house or to another team later.
BUTTON {.faq-q}: What happens after the MVP launches?
T: Launch is the start of the cost, not the end of it. App stores need ongoing releases, OS versions change, and real usage produces work no plan anticipated. We stay for monitoring and iteration sprints, or hand over cleanly if you are building an in-house team — both are normal.

=== SECTION ===
T: Start here
## Get a fixed-price MVP estimate.
P {.lb-sub}: Tell us what version one has to prove. You’ll get a scoped, fixed price within 48 hours.
[LEAD FORM — fields as in Global]

=== SECTION ===
## Get a fixed price / for your MVP.
P {.lead}: A 30-minute scoping call, then a fixed-price proposal within 48 hours. If an MVP is not the right first move, we will tell you on the call. NDA on request.
T: Book a free scoping call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See our work ⟨/work/⟩




### FILE react-native-app-development/index.html
TITLE: Hire React Native Developers | Development Company
DESC: Hire senior React Native developers for iOS & Android. Fixed pricing, no setup fees, apps live on both stores.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › React Native Development
T: [EYEBROW] React Native · Cross-platform
# Hire expert React Native developers. / Ship to both app stores.
P {.lead}: Hire senior React Native developers (5+ years) to build your iOS and Android app. Fixed pricing, no upfront fees, 8-week timeline. We've shipped 4 production apps to both stores. Direct access to Het and the team—no middlemen.
T: Get Free App Scoping (15 min) → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Download Free Guide ⟨/app-scoping-guide/⟩

=== SECTION ===
T: [EYEBROW] What we build
## Built for how it's / actually used.
### Cross-platform by default
P: One React Native codebase compiles to native iOS and Android, so you ship to both stores without paying for two teams.
### Native performance
P: We build on React Native's New Architecture ⟨/blog/react-native-new-architecture-2026⟩, 60fps animation and native modules where it matters. Users can't tell it isn't Swift or Kotlin — and don't care.
### MERN backends
P: Node.js APIs, MongoDB, real-time data and AWS infrastructure, built by the same team that builds your app.
### AI where it earns its place
P: Claude and GPT integration, retrieval and agents — see our AI app development services ⟨/ai-app-development/⟩.
### Store submission handled
P: Review-ready builds, listings, screenshots and the back-and-forth with Apple and Google — included.
### Support after launch
P: Monitoring, updates and iteration sprints, with direct access to the engineers who built your app. Need ongoing capacity instead of a fixed project? You can hire a dedicated React Native team ⟨/hire/⟩.

=== SECTION ===
T: [EYEBROW] Proof
## Four React Native apps, live on the stores
P {.lead}: Every case study below is a real product you can download today.
T: HR & Payroll
T: HR & payroll — 40% faster payroll processing
T: See the case study →
T: ⟨/work/#hr-payroll⟩ Creator Marketplace
T: Creator marketplace — +35% downloads
T: See the case study →
T: ⟨/work/#creator-marketplace⟩ Retail Ops
T: Retail SaaS — multi-store operations standardised
T: See the case study →
T: ⟨/work/#retail-ops⟩ Ride-Hailing
T: Ride-hailing — ~3 minute average booking
T: See the case study →
T: ⟨/work/#ride-hailing⟩

=== SECTION ===
T: [EYEBROW] Process
## Idea to app store, / without the drama.
T: 01
### Scope call
P: 30 minutes on your goals, users and constraints — with an honest read on feasibility.
T: 02
### Fixed-price proposal
P: Scope, timeline and a fixed price within 48 hours. No vague day-rates.
T: 03
### Build
P: Weekly demo builds you can hold in your hand from the first sprint.
T: 04
### Launch & support
P: Store submission handled, then monitoring and iteration after launch.

=== SECTION ===
T: [EYEBROW] Where we work
## Founders we build for, by region.
T: React Native development — UK ⟨/react-native-app-development-uk/⟩
T: React Native development — Dubai ⟨/react-native-app-development-dubai/⟩
T: React Native development — USA ⟨/react-native-app-development-usa/⟩

=== SECTION ===
T: [EYEBROW] Free guides & tools
## Free tools for your decision.
T: Decision tool
T: Native, React Native or Flutter?
T: Get a recommendation →
T: ⟨/blog/native-vs-cross-platform-2026⟩
T: Decision tool
T: Kotlin Multiplatform or React Native?
T: Get a recommendation →
T: ⟨/blog/kotlin-multiplatform-vs-react-native⟩
T: Migration check
T: Is your app on borrowed time?
T: Check urgency →
T: ⟨/blog/react-native-new-architecture-2026⟩
T: Self-audit
T: Score your app’s security
T: Run the audit →
T: ⟨/blog/mobile-app-security-checklist⟩

=== SECTION ===
T: [EYEBROW] FAQ
## Common questions.
BUTTON {.faq-q}: How much does a React Native app cost?
T: A focused MVP typically starts in the low five figures (USD); full products scale with feature depth. Get an instant range with our app cost calculator ⟨/app-cost-calculator/⟩, then a fixed-price proposal within 48 hours of a call.
BUTTON {.faq-q}: How long does a React Native app take to build?
T: Most MVPs land in 6–12 weeks. The four products in our portfolio took 16–32 weeks each to reach full market release on both stores.
BUTTON {.faq-q}: Is React Native better than Flutter or going fully native?
T: For most products, yes — one codebase, native performance, the largest ecosystem and over-the-air updates. We compare the options honestly in our React Native vs Flutter guide ⟨/blog/react-native-vs-flutter-2026⟩.
BUTTON {.faq-q}: Who actually builds my app?
T: Het Soni and senior engineers — no handoffs to juniors and no account managers between you and the people writing the code.

=== SECTION ===
T: Start here
## Get a fixed-price estimate.
P {.lb-sub}: One short form. A scoped, fixed price within 48 hours — no hourly guesswork, no upfront fee to talk.
[LEAD FORM — fields as in Global]

=== SECTION ===
## Get a fixed price for your React Native app.
P {.lead}: 30-minute scoping call with Het → fixed-price proposal within 48 hours → senior developers start in 2 days. No setup fees. NDA on request.
T: Get Free App Scoping (15 min) → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Download Free Guide ⟨/app-scoping-guide/⟩



### FILE app-cost-calculator/index.html
TITLE: App Development Cost Calculator | Soni Consultancy Services
DESC: Estimate your React Native or MERN app's timeline and cost in 60 seconds. Pick platforms and features, get an indicative range, then a fixed-price quote.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › App Cost Calculator
T: [EYEBROW] Free tool
# What will your app / cost to build?
P {.lead}: Pick your platforms and features. You'll get an indicative timeline and cost range instantly — then a precise, fixed-price quote after a 30-minute call.

=== SECTION ===
<!-- INPUTS -->
### Platforms
INPUT: type=radio name=platform placeholder=None id=None value='cross' min=None max=None step=None
LABEL: Cross-platform
INPUT: type=radio name=platform placeholder=None id=None value='ios' min=None max=None step=None
LABEL: iOS only
INPUT: type=radio name=platform placeholder=None id=None value='android' min=None max=None step=None
LABEL: Android only
### Build stage
INPUT: type=radio name=stage placeholder=None id=None value='mvp' min=None max=None step=None
LABEL: MVP~4 wk base
INPUT: type=radio name=stage placeholder=None id=None value='ready' min=None max=None step=None
LABEL: Market-ready~8 wk base
INPUT: type=radio name=stage placeholder=None id=None value='scale' min=None max=None step=None
LABEL: Scale / enterprise~14 wk base
### Features
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: User accounts & profiles1.5
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: Payments / subscriptions2.5
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: Chat / messaging2.5
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: Maps & geolocation2
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: Push notifications1
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: Admin dashboard3
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: AI integration3
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: Offline mode / sync2
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: Analytics dashboards1.5
INPUT: type=checkbox name=None placeholder=None id=None value=None min=None max=None step=None
LABEL: Social feed2
### Design
INPUT: type=radio name=design placeholder=None id=None value='standard' min=None max=None step=None
LABEL: Standard
INPUT: type=radio name=design placeholder=None id=None value='custom' min=None max=None step=None
LABEL: Custom UI/UX
INPUT: type=radio name=design placeholder=None id=None value='premium' min=None max=None step=None
LABEL: Premium / animated
### Backend
INPUT: type=radio name=backend placeholder=None id=None value='baas' min=None max=None step=None
LABEL: Managed / BaaS
INPUT: type=radio name=backend placeholder=None id=None value='mern' min=None max=None step=None
LABEL: Custom MERN API+3
INPUT: type=radio name=backend placeholder=None id=None value='realtime' min=None max=None step=None
LABEL: Realtime + scale+5
<!-- RESULT -->
T: Indicative estimate
T: $14k – $26k
T: Typical range for this scope · USD
T: Timeline~8 weeks
T: TeamHet + dedicated engineers
T: Pricing modelFixed-price
FORM id=calcLeadForm
LABEL: Your name
INPUT: type=None name=None placeholder='James Morrison' id=cName value=None min=None max=None step=None
LABEL: Work email
INPUT: type=email name=None placeholder='james@company.com' id=cEmail value=None min=None max=None step=None
BUTTON {.btn btn-primary btn-lg}: Email me the breakdown →
P: We'll send a detailed scope breakdown and reply within one business day. No spam.
T: ✓ Got it. We'll review your scope and reply with a detailed breakdown within one business day — or book a call ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩ to lock the fixed price now.
P {.dim}: Estimates are indicative, based on typical project scope — not a quote. Your exact fixed price is confirmed after a short discovery call once requirements are clear.

=== SECTION ===
## Want the exact number?
P {.lead}: Book a free 30-minute call — we'll turn this estimate into a fixed-price proposal within 48 hours.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See our work ⟨/work/⟩



### FILE app-scoping-guide/index.html
TITLE: Free App Scoping Guide for Founders | Soni Consultancy
DESC: Free guide: How to scope React Native and MERN apps — timeline, cost estimates, and the 5 questions that unlock your project brief. Download now.

=== SECTION ===
T: [EYEBROW] FREE GUIDE
# Scope Your App Like a Founder, Not a Salesperson
P: The five questions every founder should ask before building. Plus timelines, cost ranges, and the exact methodology we use to give fixed prices in 48 hours.
#### ✓ The 5 Discovery Questions
P: Ask these of any team and you'll get real answers about feasibility and cost.
#### ✓ Timeline Estimates
P: MVP vs full product. React Native vs Flutter vs native. Realistic ranges.
#### ✓ Cost Ranges
P: What you should expect to pay for different project sizes and complexity levels.
#### ✓ Scoping Methodology
P: The exact process we use to turn your idea into a fixed-price proposal.
P: This is not a sales pitch. Whether you build with us or another team, this guide will help you ask smarter questions and avoid costly mistakes.
T: Get the Guide (Free) → ⟨#form⟩
T: Or book a call ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
<!-- FORM -->
### Download the Guide
P {.subtitle}: Instant download — no waiting on an email. 8 pages, free.
FORM id=scopingGuideForm
LABEL: First name
INPUT: type=text name=name placeholder='James' id=sgName value=None min=None max=None step=None
LABEL: Work email
INPUT: type=email name=email placeholder='james@company.com' id=sgEmail value=None min=None max=None step=None
LABEL: Company
INPUT: type=text name=company placeholder='Acme Inc.' id=sgCompany value=None min=None max=None step=None
LABEL: Stage
SELECT name=stage id=sgStage
OPT: Select your stage
OPT: Just an idea
OPT: Prototype / MVP started
OPT: MVP ready, raising funds
OPT: Post-launch, scaling
BUTTON {.submit}: Get the guide →
P {.legal}: No spam. By downloading you agree to our privacy policy ⟨/privacy/⟩.
T: ✓ Your guide is ready.
P: Click below to download it — it opens straight away, nothing to wait for.
T: Download the PDF (8 pages) ⟨/assets/app-scoping-guide.pdf⟩
P: Prefer to talk it through? Book a free 30-min scoping call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
<!-- WHY SECTION -->

=== SECTION ===
T: [EYEBROW] Why scoping matters
## Most founders get their app wrong because they didn't scope it right.
T: ❌
P: Scope creep — You add features mid-build because you didn't think through what's actually MVP and what's Phase 2. Timeline doubles, costs triple.
T: ❌
P: Wrong tech choice — You pick a stack based on what your friend used, not what your app needs. Six months in, you realise you chose the wrong framework.
T: ❌
P: Bad vendor choice — You hire the cheapest team because you didn't know what questions to ask. They build you something that can't scale, and you're stuck rewriting.
P: This guide teaches you the exact questions and framework we use so you don't make these mistakes — and you know exactly what to expect from any team you work with.
<!-- WHO -->

=== SECTION ===
T: [EYEBROW] Who this is for
## Founders. Technical co-founders. Product leads.
P: If you're building a mobile or web app and want to understand how to scope it properly before you talk to any team, this guide is for you.
P: It's agnostic — you might end up working with us, or you might build in-house, or you might hire someone else. Either way, this guide will save you time and money.
P: The only people this won't help: if you've already built your app and it works perfectly, you probably don't need it.

=== SECTION ===
T: [EYEBROW] FAQ
## Common questions.
BUTTON {.faq-q}: What's included in the App Scoping Guide?
T: The guide covers how to define your MVP, the five discovery questions every founder should ask, realistic timeline estimates for React Native and MERN projects, cost ranges for different project sizes, and the exact process we use to scope projects within 48 hours.
BUTTON {.faq-q}: How do I get the guide after filling in the form?
T: The download link appears immediately on the page once you submit — there's no waiting on an email. The PDF is 8 pages and free to keep or share.
BUTTON {.faq-q}: Will you use my email to spam me?
T: No. We may follow up once about your project or occasionally share new work — nothing more, and you can opt out any time.
BUTTON {.faq-q}: Is this guide specific to Soni Consultancy?
T: No — the scoping methodology is universal. Whether you work with us or another team, this guide will help you scope your app accurately and ask smarter vendor questions.
<!-- CTA SECTION -->

=== SECTION ===
## Ready to scope your app?
P {.lead}: Download the guide, or skip straight to a 30-minute discovery call with Het.
T: Get the Guide (Free) ⟨#form⟩
T: Book a Call ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩



### FILE fintech-app-development/index.html
TITLE: FinTech App Development | Soni Consultancy Services
DESC: FinTech app development — payments, wallets, KYC-ready onboarding and investing UX in React Native, engineered with security-first practices.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › FinTech
T: [EYEBROW] FinTech · Payments · Investing
# FinTech apps users / trust with money.
P {.lead}: Payments, subscriptions, wallets and investing flows — built in React Native with security-first engineering and the polish financial users expect.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Estimate your app cost ⟨/app-cost-calculator/⟩

=== SECTION ===
T: [EYEBROW] What we build
## Built for how it's / actually used.
### Payments & subscriptions
P: Card payments, recurring billing and in-app purchase flows, integrated with Stripe-class gateways and store billing rules.
### Wallets & portfolio UX
P: Balance views, transaction histories and performance charts that make complex money data feel obvious.
### KYC-ready onboarding
P: Identity capture and verification flows designed for completion rates, not drop-off.
### Security first
P: Encrypted storage and transport, secure auth, role-based access and audit trails as defaults, not add-ons.
### Real-time data
P: Live prices, instant updates and offline-tolerant sync built on MERN and websockets.
### Compliance-aware builds
P: Architecture that respects data residency and access-control requirements from day one.

=== SECTION ===
T: [EYEBROW] Proof
## Our product work in FinTech
P {.lead}: Investing and wallet product design, plus production transactional systems.
T: Fan Investing
T: Social-investing concept — discover artists, back offerings, track a portfolio
T: See the case study →
T: ⟨/work/#fan-investing⟩ Web3 Creator
T: Multi-chain wallet & NFT marketplace concept
T: See the case study →
T: ⟨/work/#web3-creator⟩ Creator Marketplace
T: Production points & rewards engine, live on the App Store
T: See the case study →
T: ⟨/work/#creator-marketplace⟩

=== SECTION ===
T: [EYEBROW] Process
## Idea to app store, / without the drama.
T: 01
### Scope call
P: 30 minutes on your goals, users and constraints — with an honest read on feasibility.
T: 02
### Fixed-price proposal
P: Scope, timeline and a fixed price within 48 hours. No vague day-rates.
T: 03
### Build
P: Weekly demo builds you can hold in your hand from the first sprint.
T: 04
### Launch & support
P: Store submission handled, then monitoring and iteration after launch.

=== SECTION ===
T: [EYEBROW] Free guides & tools
## Compliance, checked before it's a problem.
T: Self-audit
T: Is your app RBI-compliant?
T: Score your readiness →
T: ⟨/blog/rbi-fintech-app-compliance-india⟩
T: Self-audit
T: Is your app DPDP-ready?
T: Score your readiness →
T: ⟨/blog/dpdp-act-app-compliance-india⟩
T: Self-audit
T: Score your app’s security
T: Run the audit →
T: ⟨/blog/mobile-app-security-checklist⟩

=== SECTION ===
T: [EYEBROW] FAQ
## Common questions.
BUTTON {.faq-q}: Can you integrate payment gateways?
T: Yes — Stripe-class gateways, subscriptions and store billing, including the Apple and Google policy rules around digital goods that trip up many FinTech launches.
BUTTON {.faq-q}: How do you secure financial data?
T: Encryption at rest and in transit, secure key storage, role-based access and audit logging by default — with a security review before anything ships. For apps in India, that also means building to RBI's requirements — see our RBI compliance readiness check ⟨/blog/rbi-fintech-app-compliance-india⟩.
BUTTON {.faq-q}: Do you build investing or trading apps?
T: We've designed investing product concepts and ship production transactional systems. For regulated trading we build against your licensed backend or broker APIs.

=== SECTION ===
T: Start here
## Building a fintech product?
P {.lb-sub}: Payments, KYC, compliance and audit trails are the hard part. Tell us the shape of it and we’ll scope it properly.
[LEAD FORM — fields as in Global]

=== SECTION ===
## Get a fixed price / for your app.
P {.lead}: A 30-minute call, then a fixed-price proposal within 48 hours. NDA on request.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See our work ⟨/work/⟩



### FILE retail-app-development/index.html
TITLE: Retail App Development | Soni Consultancy Services
DESC: Retail app development — store operations checklists, gamified staff training and head-office analytics. Our retail operations platform is live on both stores.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › Retail
T: [EYEBROW] Retail · Operations · LMS
# Every store, run / to one standard.
P {.lead}: We build retail operations apps — checklists, training, issue tracking and analytics — that make every branch run like your best branch. Our retail chain platform is live on the App Store and Google Play.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Estimate your app cost ⟨/app-cost-calculator/⟩

=== SECTION ===
T: [EYEBROW] What we build
## Built for how it's / actually used.
### Operational checklists
P: Customisable open, close and audit checklists with photo proof and timestamps per store.
### Gamified staff training
P: Bite-sized LMS modules staff actually finish, with scores head office can see.
### Issue & customer logs
P: Structured logging that turns floor problems into trackable, assignable items.
### Head-office analytics
P: One dashboard for compliance, training and issues across every location.
### Multi-store rollouts
P: Role-based access for HQ, area managers and store staff.
### Works on the shop floor
P: Fast on mid-range Android devices and tolerant of patchy store Wi-Fi.

=== SECTION ===
T: [EYEBROW] Proof
## Case study: Retail Operations Platform
P {.lead}: A retail chain management platform unifying four modules — operational checklists, a gamified LMS, issue logs and customer logs — live on the App Store and Google Play.
T: 4 modules
T: Checklists, LMS, issue logs and customer logs in one platform
T: See the case study →
T: ⟨/work/#retail-ops⟩ Multi-store
T: Standardised operations with real-time head-office visibility
T: See the case study →
T: ⟨/work/#retail-ops⟩ Faster onboarding
T: Gamified bite-sized training measurably sped up staff onboarding
T: See the case study →
T: ⟨/work/#retail-ops⟩

=== SECTION ===
T: [EYEBROW] Process
## Idea to app store, / without the drama.
T: 01
### Scope call
P: 30 minutes on your goals, users and constraints — with an honest read on feasibility.
T: 02
### Fixed-price proposal
P: Scope, timeline and a fixed price within 48 hours. No vague day-rates.
T: 03
### Build
P: Weekly demo builds you can hold in your hand from the first sprint.
T: 04
### Launch & support
P: Store submission handled, then monitoring and iteration after launch.

=== SECTION ===
T: [EYEBROW] FAQ
## Common questions.
BUTTON {.faq-q}: Can it handle many locations?
T: Yes — our platform was built for multi-store chains: role-based access for head office, area managers and store staff, with analytics rolled up across every location.
BUTTON {.faq-q}: Does it work with unreliable store internet?
T: We design for the shop floor — offline-tolerant flows and sync so a weak connection doesn't stop a checklist or a training module.
BUTTON {.faq-q}: How long does a retail operations app take?
T: This platform took 32 weeks to full market release across both stores. A focused first version of your operations app can ship much sooner — estimate your scope here ⟨/app-cost-calculator/⟩.

=== SECTION ===
T: Start here
## Building for retail?
P {.lb-sub}: Store ops, stock, loyalty or a customer app — tell us what it has to do and we’ll come back with a fixed price.
[LEAD FORM — fields as in Global]

=== SECTION ===
## Get a fixed price / for your app.
P {.lead}: A 30-minute call, then a fixed-price proposal within 48 hours. NDA on request.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See our work ⟨/work/⟩



### FILE ride-hailing-app-development/index.html
TITLE: Ride-Hailing App Development | Soni Consultancy Services
DESC: Ride-hailing and taxi app development — rider and driver apps with real-time tracking, AI fare prediction and safety features.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › Ride-Hailing
T: [EYEBROW] Ride-Hailing · On-Demand
# Ride-hailing apps / riders trust.
P {.lead}: Rider, driver and dispatch — we build the full ride-hailing stack in React Native, with AI fare prediction and the safety features that earn rider trust. Our cab-booking platform is live on both stores.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Estimate your app cost ⟨/app-cost-calculator/⟩

=== SECTION ===
T: [EYEBROW] What we build
## Built for how it's / actually used.
### Real-time tracking
P: Live driver location, trip progress and accurate ETAs on the map.
### AI fare prediction
P: Transparent pricing up front instead of surge surprises — as built in our platform.
### Safety built in
P: SOS, driver ratings and trip sharing as first-class features.
### Scheduling & dispatch
P: Book-now and book-ahead with clean driver assignment.
### Payments & wallets
P: Card, wallet and cash flows with clear receipts.
### Rider + driver + admin
P: All three surfaces from one team — both apps and the operations dashboard.

=== SECTION ===
T: [EYEBROW] Proof
## Case study: Ride-Hailing Platform
P {.lead}: “Your reliable ride, every time” — a cab-booking platform with transparent pricing, real-time tracking and safety-first UX.
T: ~3 min
T: Average booking time, down from clunky multi-step flows
T: See the case study →
T: ⟨/work/#ride-hailing⟩ AI fares
T: Fare prediction for transparent pricing riders trust
T: See the case study →
T: ⟨/work/#ride-hailing⟩ SOS built in
T: Safety features and driver-rating assurance
T: See the case study →
T: ⟨/work/#ride-hailing⟩

=== SECTION ===
T: [EYEBROW] Process
## Idea to app store, / without the drama.
T: 01
### Scope call
P: 30 minutes on your goals, users and constraints — with an honest read on feasibility.
T: 02
### Fixed-price proposal
P: Scope, timeline and a fixed price within 48 hours. No vague day-rates.
T: 03
### Build
P: Weekly demo builds you can hold in your hand from the first sprint.
T: 04
### Launch & support
P: Store submission handled, then monitoring and iteration after launch.

=== SECTION ===
T: [EYEBROW] FAQ
## Common questions.
BUTTON {.faq-q}: How long does it take to build a taxi app?
T: Our platform took 25 weeks to full market release — rider experience, driver side and AI fare prediction included. A focused single-city MVP can ship faster; estimate your scope here ⟨/app-cost-calculator/⟩.
BUTTON {.faq-q}: Do you build the driver app and admin panel too?
T: Yes — rider app, driver app and the operations dashboard come from the same team and the same codebase strategy, so they never drift apart.
BUTTON {.faq-q}: Can it scale to more cities?
T: It runs on React Native, Next.js, PostgreSQL and AWS — an architecture built to add cities and fleets without a rewrite.

=== SECTION ===
T: Start here
## Building a ride-hailing product?
P {.lb-sub}: Rider app, driver app, dispatch and live tracking. Tell us the scope and we’ll tell you what it really takes.
[LEAD FORM — fields as in Global]

=== SECTION ===
## Get a fixed price / for your app.
P {.lead}: A 30-minute call, then a fixed-price proposal within 48 hours. NDA on request.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See our work ⟨/work/⟩



### FILE hr-payroll-app-development/index.html
TITLE: HR & Payroll App Development | Soni Consultancy Services
DESC: HR and payroll app development — biometric and GPS attendance, branch-level payroll rules and payslips. our HR platform cut payroll processing time by 40%.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › HR & Payroll
T: [EYEBROW] HR · Attendance · Payroll
# Attendance to payslip, / no spreadsheets.
P {.lead}: We build workforce apps that connect attendance to payroll automatically — like the HR platform we built — live on the App Store and Google Play — which cut payroll processing time by 40%.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Estimate your app cost ⟨/app-cost-calculator/⟩

=== SECTION ===
T: [EYEBROW] What we build
## Built for how it's / actually used.
### Biometric & GPS attendance
P: Check-ins that can't be gamed — on-site or in the field.
### Payroll rules per branch
P: Custom pay rules, overtime and deductions per location.
### Payslips & breakdowns
P: Detailed, transparent salary breakdowns staff can check themselves.
### Irregularity alerts
P: Real-time flags for missed punches and anomalies — before payday, not after.
### Role-based access
P: Company, branch and staff views, each with exactly the right data.
### Records in one place
P: Centralised staff records, reports and history across every branch.

=== SECTION ===
T: [EYEBROW] Proof
## Case study: HR & Payroll Platform
P {.lead}: Attendance & Salary Ledger System — built because manual spreadsheets were causing 15–20% payroll errors and zero branch-level visibility.
T: 40% less
T: Payroll processing time after switching from spreadsheets
T: See the case study →
T: ⟨/work/#hr-payroll⟩ 3 roles
T: Company, branch and staff — each with the right view
T: See the case study →
T: ⟨/work/#hr-payroll⟩ 2 stores
T: Live on both the App Store and Google Play
T: See the case study →
T: ⟨/work/#hr-payroll⟩

=== SECTION ===
T: [EYEBROW] Process
## Idea to app store, / without the drama.
T: 01
### Scope call
P: 30 minutes on your goals, users and constraints — with an honest read on feasibility.
T: 02
### Fixed-price proposal
P: Scope, timeline and a fixed price within 48 hours. No vague day-rates.
T: 03
### Build
P: Weekly demo builds you can hold in your hand from the first sprint.
T: 04
### Launch & support
P: Store submission handled, then monitoring and iteration after launch.

=== SECTION ===
T: [EYEBROW] FAQ
## Common questions.
BUTTON {.faq-q}: Can it integrate with our existing payroll software?
T: Yes — we build APIs that feed your existing payroll or accounting system, or replace the spreadsheet layer entirely, as our platform does.
BUTTON {.faq-q}: Does it support multiple branches?
T: That's the core of it — Our platform gives company, branch and staff roles their own views, with payroll rules customisable per branch.
BUTTON {.faq-q}: How is employee data protected?
T: Role-based access, encrypted storage and transport, and audit trails — staff see their own data, managers see their branch, head office sees everything.

=== SECTION ===
T: Start here
## Building an HR or payroll product?
P {.lb-sub}: Attendance, payroll runs, compliance and multi-branch structures. Tell us the shape and we’ll scope it.
[LEAD FORM — fields as in Global]

=== SECTION ===
## Get a fixed price / for your app.
P {.lead}: A 30-minute call, then a fixed-price proposal within 48 hours. NDA on request.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See our work ⟨/work/⟩




### FILE blog/index.html
TITLE: Blog — App Development Insights | Soni Consultancy Services
DESC: Practical guides on React Native, MERN and AI app development for founders and CTOs — costs, frameworks, architecture and AI strategy.

=== SECTION class=page-hero ===
T: Home ⟨/⟩ › Blog
T: [EYEBROW] Insights
# From the studio.
P {.lead}: Practical, honest guides on React Native, MERN and AI app development — written for founders and product leaders who want to ship better software.

=== SECTION ===
T: [CHIP] ✦ Featured
## How to Build an AI-Powered React Native App in 2026
P {.muted}: Where the model runs, how the pieces fit, what it costs and how long it takes — the complete founder's guide, with an interactive architecture explorer.
T: Mobile · AI14 min read
T: ⟨/blog/ai-react-native-app-development⟩
BUTTON {.fbtn active}: All
BUTTON {.fbtn}: AI
BUTTON {.fbtn}: Mobile
BUTTON {.fbtn}: Web
BUTTON {.fbtn}: Strategy
T: Mobile · Engineering · Interactive
### React Native’s New Architecture in 2026: What Changed and How to Migrate
P: 0.82 disabled the old bridge, 0.85 removed it. Check how urgent migration is for you.
T: Read more →
T: ⟨/blog/react-native-new-architecture-2026⟩
T: Strategy · FinTech · Interactive
### RBI Compliance for Fintech Apps in India (2026)
P: AFA and digital lending rules are live in 2026. Score your app against 10 requirements.
T: Read more →
T: ⟨/blog/rbi-fintech-app-compliance-india⟩
T: Mobile · Engineering · Interactive
### React Native Push Notifications: Firebase, OneSignal or Notifee in 2026
P: OneSignal’s free tier just shrank. See the real cost at your user count.
T: Read more →
T: ⟨/blog/react-native-push-notifications⟩
T: Mobile · Interactive
### Kotlin Multiplatform vs React Native (2026): Which Should You Pick?
P: KMP adoption is climbing fast. Answer 5 questions for a recommendation on your project.
T: Read more →
T: ⟨/blog/kotlin-multiplatform-vs-react-native⟩
T: Strategy · Compliance · Interactive
### India’s DPDP Act for Apps (2026): Deadlines and a Readiness Check
P: Full enforcement lands May 2027. Score your app against 10 controls and see what to fix first.
T: Read more →
T: ⟨/blog/dpdp-act-app-compliance-india⟩
T: AI · Strategy · Interactive
### Can AI Build My App? An Honest 2026 Answer for Founders
P: What AI genuinely accelerates, what it still cannot own — and which side your project falls on.
T: Read more →
T: ⟨/blog/can-ai-build-my-app⟩
T: Mobile · Strategy · Interactive
### Super Apps and Mini Apps in 2026: Should Your Product Become a Platform?
P: The model works only under specific conditions. Answer 5 questions to see if yours qualify.
T: Read more →
T: ⟨/blog/super-app-development⟩
T: Web · Interactive · Cost
### WordPress Website Cost in India (2026): Real Numbers + Calculator
P: Real market pricing by project type — and a calculator to estimate your own build.
T: Read more →
T: ⟨/blog/wordpress-website-cost-india⟩
T: Web · Interactive
### WordPress vs Custom Website in 2026: Which Should You Build?
P: Answer 5 questions, get an honest recommendation — from a team that builds both.
T: Read more →
T: ⟨/blog/wordpress-vs-custom-website⟩
T: Web · E-commerce
### Razorpay vs PayU vs Cashfree: Best Gateway for WooCommerce India
P: 2026 fees, plugin status and settlements compared — with live fee math for your volume.
T: Read more →
T: ⟨/blog/woocommerce-payment-gateway-india⟩
T: Web · SEO · Interactive
### WordPress Speed & SEO Checklist 2026: Score Your Site in 2 Minutes
P: 10 controls, a live score, and what to fix first — run the free self-audit.
T: Read more →
T: ⟨/blog/wordpress-seo-speed-checklist⟩
T: Mobile · Interactive
### Native vs Cross-Platform in 2026: An Interactive Decision Tool
P: Answer 5 questions, get a recommendation — native, React Native or Flutter — for your app.
T: Read more →
T: ⟨/blog/native-vs-cross-platform-2026⟩
T: Strategy · Interactive
### How to Choose Your MVP Tech Stack in 2026
P: Answer 5 questions — get frontend, backend, database and hosting for your product.
T: Read more →
T: ⟨/blog/mvp-tech-stack-2026⟩
T: Mobile · Security
### Mobile App Security Checklist 2026: Score Your App in 2 Minutes
P: 10 controls, a live score, and the fixes that matter first — run the free self-audit.
T: Read more →
T: ⟨/blog/mobile-app-security-checklist⟩
T: Strategy · Revenue
### App Monetization Models 2026: Interactive Revenue Explorer
P: Subscription, IAP, ads or commission — drag the sliders and see the math for your app.
T: Read more →
T: ⟨/blog/app-monetization-models⟩
T: Mobile · Timeline
### How Long Does It Take to Build a Mobile App in 2026?
P: A realistic timeline by phase — MVP vs full build, what drives the schedule, and why estimates slip.
T: Read more →
T: ⟨/blog/how-long-to-build-an-app⟩
T: DevOps · Mobile
### CI/CD for React Native Apps: A 2026 Setup Guide
P: Automated build, test, signing and store releases — plus OTA updates for the fast lane.
T: Read more →
T: ⟨/blog/ci-cd-react-native⟩
T: Strategy · Product
### How to Validate Your App Idea Before You Build It
P: The cheap way to find out people want your app — before you spend a development budget.
T: Read more →
T: ⟨/blog/validate-app-idea-before-building⟩
T: Mobile · Launch
### App Store & Google Play Launch: A 2026 Submission Checklist
P: Everything between a finished build and a live app — accounts, listings, privacy labels and review.
T: Read more →
T: ⟨/blog/app-store-launch-checklist⟩
T: Strategy · Cost
### What App Maintenance Really Costs After Launch
P: Apps aren't "done" at launch — the real ongoing cost of keeping one alive, and how to keep it down.
T: Read more →
T: ⟨/blog/app-maintenance-cost⟩
T: Cloud · Migration
### AWS Cloud Migration: A Practical Guide for 2026
P: The 6 R's, lift-and-shift vs re-architecture, a roadmap and how to control cloud cost.
T: Read more →
T: ⟨/blog/aws-cloud-migration-guide⟩
T: FinTech · Compliance
### BSA/AML Software: Build vs Buy in 2026
P: When to buy, when to build, and the architecture and compliance that decide it.
T: Read more →
T: ⟨/blog/bsa-aml-software-build-vs-buy⟩
T: Mobile · Cost
### React Native App Development Cost in 2026
P: A transparent breakdown by complexity, the hidden costs, and how to budget from MVP to scale.
T: Read more →
T: ⟨/blog/react-native-app-development-cost⟩
T: Mobile · Hiring
### How to Hire React Native Developers in 2026
P: In-house vs freelance vs agency, the skills to screen for, and what it really costs.
T: Read more →
T: ⟨/blog/hire-react-native-developers⟩
T: AI · Agents
### AI Agent Development Services in 2026
P: What agents are, what they cost, and how to build one that delivers outcomes — not demos.
T: Read more →
T: ⟨/blog/ai-agent-development-services⟩
T: AI · Cost
### How Much Does It Cost to Build an AI App in 2026?
P: A real pricing breakdown for founders and CTOs — no vague "it depends."
T: Read more →
T: ⟨/blog/ai-app-development-cost-2026⟩
T: AI · CTO Strategy
### Build vs Buy AI: A CTO's Decision Framework
P: The most expensive AI mistake is building what you should have bought.
T: Read more →
T: ⟨/blog/build-vs-buy-ai-cto-framework⟩ ✦ Work with us
### Have a project in mind?
P: Book a free 30-minute call — we’ll map the fastest path from idea to a shipped product.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: Mobile · Framework
### React Native vs Flutter in 2026: Which Should You Choose?
P: An honest comparison from a studio that ships both.
T: Read more →
T: ⟨/blog/react-native-vs-flutter-2026⟩
T: Web · Architecture
### Next.js SaaS Architecture: The Patterns We Use
P: Multi-tenancy, RBAC, API layers, Stripe — the patterns behind every SaaS we ship.
T: Read more →
T: ⟨/blog/nextjs-saas-architecture⟩
T: Strategy · Product
### From MVP to Product-Market Fit: What Changes After Launch
P: The mistakes founders make in the first 90 days — and how to find traction faster.
T: Read more →
T: ⟨/blog/mvp-to-product-market-fit⟩
T: Mobile · AI
### How to Build an AI-Powered React Native App in 2026
P: Where the model runs, how it's wired, what it costs — the complete guide.
T: Read more →
T: ⟨/blog/ai-react-native-app-development⟩
T: Mobile · AI
### Integrating ChatGPT & LLMs into a React Native App
P: The right way: secure proxy, streaming responses and cost control.
T: Read more →
T: ⟨/blog/react-native-chatgpt-integration⟩
T: Mobile · AI
### On-Device AI in React Native: Private, Offline, $0 per Call
P: Run models on the phone — privacy, offline and no per-call cost.
T: Read more →
T: ⟨/blog/on-device-ai-react-native⟩
T: Mobile · AI
### Building an AI Chatbot App with React Native
P: The four complexity tiers, realistic timelines and what drives cost.
T: Read more →
T: ⟨/blog/ai-chatbot-app-react-native⟩

=== SECTION ===
T: Start here
## Have a project in mind?
P {.lb-sub}: You’ve read the thinking. If you want it applied to your product, tell us in one line.
[LEAD FORM — fields as in Global]

=== SECTION ===
## Got a product idea? / Let's talk this week.
P {.lead}: 30 minutes. No pitch deck. An honest conversation about what you're building.
T: Book a Free Call → ⟨https://calendly.com/het-soni-soniconsultancyservices/introductory⟩
T: See our work ⟨/work/⟩
