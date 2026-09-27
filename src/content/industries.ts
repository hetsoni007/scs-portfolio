// Industry pages — one template, four data sets. Verbatim.
import { live } from './site'

export type Industry = {
  slug: string
  path: string
  variant: 'fintech' | 'retail' | 'ride' | 'hr'
  leadKind: string
  caseId: string // whose screens drive the 3D phone
  meta: { title: string; description: string }
  hero: { crumb: string; eyebrow: string; title: [string, string]; lead: string }
  build: { title: string; body: string }[]
  proof: {
    title: string
    lead: string
    items: { value: string; body: string; href: string }[]
  }
  guides?: { eyebrow: string; title: string; items: { kicker: string; title: string; action: string; href: string }[] }
  faq: { q: string; a: string }[]
}

const commonHeroSecondary = { label: 'Estimate your app cost', href: '/app-cost-calculator/' }
export const INDUSTRY_COMMON = {
  buildEyebrow: 'What we build',
  buildTitle: ["Built for how it's", 'actually used.'],
  proofEyebrow: 'Proof',
  processEyebrow: 'Process',
  processTitle: ['Idea to app store,', 'without the drama.'],
  faqEyebrow: 'FAQ',
  faqTitle: 'Common questions.',
  proofAction: 'See the case study →',
  primary: 'Book a Free Call →',
  secondary: commonHeroSecondary,
  cta: {
    title: ['Get a fixed price', 'for your app.'],
    lead: 'A 30-minute call, then a fixed-price proposal within 48 hours. NDA on request.',
    primary: 'Book a Free Call →',
    secondary: { label: 'See our work', href: '/work/' },
  },
}

export const INDUSTRIES: Industry[] = [
  {
    slug: 'fintech',
    path: '/fintech-app-development/',
    variant: 'fintech',
    leadKind: 'fintech',
    caseId: 'fan-investing',
    meta: {
      title: 'FinTech App Development | Soni Consultancy Services',
      description: 'FinTech app development — payments, wallets, KYC-ready onboarding and investing UX in React Native, engineered with security-first practices.',
    },
    hero: {
      crumb: 'FinTech',
      eyebrow: 'FinTech · Payments · Investing',
      title: ['FinTech apps users', 'trust with money.'],
      lead: 'Payments, subscriptions, wallets and investing flows — built in React Native with security-first engineering and the polish financial users expect.',
    },
    build: [
      { title: 'Payments & subscriptions', body: 'Card payments, recurring billing and in-app purchase flows, integrated with Stripe-class gateways and store billing rules.' },
      { title: 'Wallets & portfolio UX', body: 'Balance views, transaction histories and performance charts that make complex money data feel obvious.' },
      { title: 'KYC-ready onboarding', body: 'Identity capture and verification flows designed for completion rates, not drop-off.' },
      { title: 'Security first', body: 'Encrypted storage and transport, secure auth, role-based access and audit trails as defaults, not add-ons.' },
      { title: 'Real-time data', body: 'Live prices, instant updates and offline-tolerant sync built on MERN and websockets.' },
      { title: 'Compliance-aware builds', body: 'Architecture that respects data residency and access-control requirements from day one.' },
    ],
    proof: {
      title: 'Our product work in FinTech',
      lead: 'Investing and wallet product design, plus production transactional systems.',
      items: [
        { value: 'Fan Investing', body: 'Social-investing concept — discover artists, back offerings, track a portfolio', href: '/work/fan-investing/' },
        { value: 'Web3 Creator', body: 'Multi-chain wallet & NFT marketplace concept', href: '/work/web3-creator/' },
        { value: 'Creator Marketplace', body: 'Production points & rewards engine, live on the App Store', href: '/work/creator-marketplace/' },
      ],
    },
    guides: {
      eyebrow: 'Free guides & tools',
      title: "Compliance, checked before it's a problem.",
      items: [
        { kicker: 'Self-audit', title: 'Is your app RBI-compliant?', action: 'Score your readiness →', href: live('/blog/rbi-fintech-app-compliance-india') },
        { kicker: 'Self-audit', title: 'Is your app DPDP-ready?', action: 'Score your readiness →', href: live('/blog/dpdp-act-app-compliance-india') },
        { kicker: 'Self-audit', title: 'Score your app’s security', action: 'Run the audit →', href: live('/blog/mobile-app-security-checklist') },
      ],
    },
    faq: [
      { q: 'Can you integrate payment gateways?', a: 'Yes — Stripe-class gateways, subscriptions and store billing, including the Apple and Google policy rules around digital goods that trip up many FinTech launches.' },
      { q: 'How do you secure financial data?', a: `Encryption at rest and in transit, secure key storage, role-based access and audit logging by default — with a security review before anything ships. For apps in India, that also means building to RBI's requirements — see our [RBI compliance readiness check](${live('/blog/rbi-fintech-app-compliance-india')}).` },
      { q: 'Do you build investing or trading apps?', a: "We've designed investing product concepts and ship production transactional systems. For regulated trading we build against your licensed backend or broker APIs." },
    ],
  },
  {
    slug: 'retail',
    path: '/retail-app-development/',
    variant: 'retail',
    leadKind: 'retail',
    caseId: 'retail-ops',
    meta: {
      title: 'Retail App Development | Soni Consultancy Services',
      description: 'Retail app development — store operations checklists, gamified staff training and head-office analytics. Our retail operations platform is live on both stores.',
    },
    hero: {
      crumb: 'Retail',
      eyebrow: 'Retail · Operations · LMS',
      title: ['Every store, run', 'to one standard.'],
      lead: 'We build retail operations apps — checklists, training, issue tracking and analytics — that make every branch run like your best branch. Our retail chain platform is live on the App Store and Google Play.',
    },
    build: [
      { title: 'Operational checklists', body: 'Customisable open, close and audit checklists with photo proof and timestamps per store.' },
      { title: 'Gamified staff training', body: 'Bite-sized LMS modules staff actually finish, with scores head office can see.' },
      { title: 'Issue & customer logs', body: 'Structured logging that turns floor problems into trackable, assignable items.' },
      { title: 'Head-office analytics', body: 'One dashboard for compliance, training and issues across every location.' },
      { title: 'Multi-store rollouts', body: 'Role-based access for HQ, area managers and store staff.' },
      { title: 'Works on the shop floor', body: 'Fast on mid-range Android devices and tolerant of patchy store Wi-Fi.' },
    ],
    proof: {
      title: 'Case study: Retail Operations Platform',
      lead: 'A retail chain management platform unifying four modules — operational checklists, a gamified LMS, issue logs and customer logs — live on the App Store and Google Play.',
      items: [
        { value: '4 modules', body: 'Checklists, LMS, issue logs and customer logs in one platform', href: '/work/retail-ops/' },
        { value: 'Multi-store', body: 'Standardised operations with real-time head-office visibility', href: '/work/retail-ops/' },
        { value: 'Faster onboarding', body: 'Gamified bite-sized training measurably sped up staff onboarding', href: '/work/retail-ops/' },
      ],
    },
    faq: [
      { q: 'Can it handle many locations?', a: 'Yes — our platform was built for multi-store chains: role-based access for head office, area managers and store staff, with analytics rolled up across every location.' },
      { q: 'Does it work with unreliable store internet?', a: "We design for the shop floor — offline-tolerant flows and sync so a weak connection doesn't stop a checklist or a training module." },
      { q: 'How long does a retail operations app take?', a: 'This platform took 32 weeks to full market release across both stores. A focused first version of your operations app can ship much sooner — [estimate your scope here](/app-cost-calculator/).' },
    ],
  },
  {
    slug: 'ride-hailing',
    path: '/ride-hailing-app-development/',
    variant: 'ride',
    leadKind: 'ride-hailing',
    caseId: 'ride-hailing',
    meta: {
      title: 'Ride-Hailing App Development | Soni Consultancy Services',
      description: 'Ride-hailing and taxi app development — rider and driver apps with real-time tracking, AI fare prediction and safety features.',
    },
    hero: {
      crumb: 'Ride-Hailing',
      eyebrow: 'Ride-Hailing · On-Demand',
      title: ['Ride-hailing apps', 'riders trust.'],
      lead: 'Rider, driver and dispatch — we build the full ride-hailing stack in React Native, with AI fare prediction and the safety features that earn rider trust. Our cab-booking platform is live on both stores.',
    },
    build: [
      { title: 'Real-time tracking', body: 'Live driver location, trip progress and accurate ETAs on the map.' },
      { title: 'AI fare prediction', body: 'Transparent pricing up front instead of surge surprises — as built in our platform.' },
      { title: 'Safety built in', body: 'SOS, driver ratings and trip sharing as first-class features.' },
      { title: 'Scheduling & dispatch', body: 'Book-now and book-ahead with clean driver assignment.' },
      { title: 'Payments & wallets', body: 'Card, wallet and cash flows with clear receipts.' },
      { title: 'Rider + driver + admin', body: 'All three surfaces from one team — both apps and the operations dashboard.' },
    ],
    proof: {
      title: 'Case study: Ride-Hailing Platform',
      lead: '“Your reliable ride, every time” — a cab-booking platform with transparent pricing, real-time tracking and safety-first UX.',
      items: [
        { value: '~3 min', body: 'Average booking time, down from clunky multi-step flows', href: '/work/ride-hailing/' },
        { value: 'AI fares', body: 'Fare prediction for transparent pricing riders trust', href: '/work/ride-hailing/' },
        { value: 'SOS built in', body: 'Safety features and driver-rating assurance', href: '/work/ride-hailing/' },
      ],
    },
    faq: [
      { q: 'How long does it take to build a taxi app?', a: 'Our platform took 25 weeks to full market release — rider experience, driver side and AI fare prediction included. A focused single-city MVP can ship faster; [estimate your scope here](/app-cost-calculator/).' },
      { q: 'Do you build the driver app and admin panel too?', a: 'Yes — rider app, driver app and the operations dashboard come from the same team and the same codebase strategy, so they never drift apart.' },
      { q: 'Can it scale to more cities?', a: 'It runs on React Native, Next.js, PostgreSQL and AWS — an architecture built to add cities and fleets without a rewrite.' },
    ],
  },
  {
    slug: 'hr-payroll',
    path: '/hr-payroll-app-development/',
    variant: 'hr',
    leadKind: 'hr-payroll',
    caseId: 'hr-payroll',
    meta: {
      title: 'HR & Payroll App Development | Soni Consultancy Services',
      description: 'HR and payroll app development — biometric and GPS attendance, branch-level payroll rules and payslips. our HR platform cut payroll processing time by 40%.',
    },
    hero: {
      crumb: 'HR & Payroll',
      eyebrow: 'HR · Attendance · Payroll',
      title: ['Attendance to payslip,', 'no spreadsheets.'],
      lead: 'We build workforce apps that connect attendance to payroll automatically — like the HR platform we built — live on the App Store and Google Play — which cut payroll processing time by 40%.',
    },
    build: [
      { title: 'Biometric & GPS attendance', body: "Check-ins that can't be gamed — on-site or in the field." },
      { title: 'Payroll rules per branch', body: 'Custom pay rules, overtime and deductions per location.' },
      { title: 'Payslips & breakdowns', body: 'Detailed, transparent salary breakdowns staff can check themselves.' },
      { title: 'Irregularity alerts', body: 'Real-time flags for missed punches and anomalies — before payday, not after.' },
      { title: 'Role-based access', body: 'Company, branch and staff views, each with exactly the right data.' },
      { title: 'Records in one place', body: 'Centralised staff records, reports and history across every branch.' },
    ],
    proof: {
      title: 'Case study: HR & Payroll Platform',
      lead: 'Attendance & Salary Ledger System — built because manual spreadsheets were causing 15–20% payroll errors and zero branch-level visibility.',
      items: [
        { value: '40% less', body: 'Payroll processing time after switching from spreadsheets', href: '/work/hr-payroll/' },
        { value: '3 roles', body: 'Company, branch and staff — each with the right view', href: '/work/hr-payroll/' },
        { value: '2 stores', body: 'Live on both the App Store and Google Play', href: '/work/hr-payroll/' },
      ],
    },
    faq: [
      { q: 'Can it integrate with our existing payroll software?', a: 'Yes — we build APIs that feed your existing payroll or accounting system, or replace the spreadsheet layer entirely, as our platform does.' },
      { q: 'Does it support multiple branches?', a: "That's the core of it — Our platform gives company, branch and staff roles their own views, with payroll rules customisable per branch." },
      { q: 'How is employee data protected?', a: 'Role-based access, encrypted storage and transport, and audit trails — staff see their own data, managers see their branch, head office sees everything.' },
    ],
  },
]

export const industryByPath = (p: string) => INDUSTRIES.find((i) => i.path === p)
