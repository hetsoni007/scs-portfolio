// Secondary pages — /hire/, /mvp-development/, /react-native-app-development/,
// /app-cost-calculator/, /app-scoping-guide/. Verbatim.
import { CALENDLY, live } from './site'

export const HIRE_PAGE = {
  meta: {
    title: 'Hire React Native Developers | Soni Consultancy Services',
    description: 'Hire senior React Native, MERN, Flutter, AI and DevOps engineers — staff augmentation, dedicated teams or contract. IR35-aware, kick-off within 48 hours.',
  },
  hero: {
    crumb: 'Hire a Developer',
    eyebrow: 'Hire a developer',
    title: ['Senior engineers.', 'Ready this month.'],
    lead: 'Staff augmentation, dedicated pods or contract. Senior React Native, MERN, Flutter, AI and DevOps engineers — IR35-aware, UK-based and remote-global.',
    primary: 'Discuss a Placement →',
    secondary: { label: 'Send a brief', href: '/contact/' },
  },
  models: {
    eyebrow: 'How we work',
    title: ['Three ways to work', 'with our engineers.'],
    items: [
      { title: 'Staff Augmentation', body: 'Embed our senior engineers into your team — your tools, your sprints, your culture.', bullets: ['Senior-only, no juniors', 'Works in your sprint cadence', 'Scales up or down monthly', 'IR35-compliant contracts'], chips: ['From 1 month', 'Remote/hybrid'] },
      { title: 'Dedicated Team', badge: 'Most popular', body: 'A dedicated pod — engineers plus design & DevOps — focused entirely on your roadmap, managed by us.', bullets: ['Dedicated bandwidth', 'Weekly demos & updates', 'Design + Dev + DevOps', 'Kick-off within 48 hours'], chips: ['From 3 months', 'Full-stack pod'] },
      { title: 'Project Contract', body: 'A scoped, fixed-price engagement with a defined deliverable — ideal for a discrete feature or MVP.', bullets: ['Fixed scope, price, timeline', 'Senior engineer every sprint', 'Full handover & docs', 'No retainer after delivery'], chips: ['From 4 weeks', 'Fixed price'] },
    ],
  },
  skills: {
    eyebrow: 'Available skills',
    title: 'The engineers we place.',
    items: [
      { title: 'React Native Engineer', body: 'iOS & Android from one codebase — push, maps, biometrics, store submissions.', chips: ['React Native', 'Expo'] },
      { title: 'MERN / Full-Stack Engineer', body: 'React, Node, MongoDB end-to-end — APIs, dashboards, real-time, Stripe.', chips: ['Node.js', 'MongoDB', 'Next.js'] },
      { title: 'AI / Claude Engineer', body: 'Claude & GPT integration, RAG pipelines, agents, evaluation & cost control.', chips: ['Claude API', 'RAG', 'Python'] },
      { title: 'Flutter Engineer', body: 'Cross-platform mobile with native performance, complex animations, platform channels.', chips: ['Flutter', 'Dart'] },
      { title: 'DevOps / Cloud Engineer', body: 'AWS, Docker, CI/CD, Terraform, monitoring and 99.9% uptime infrastructure.', chips: ['AWS', 'Docker', 'CI/CD'] },
      { title: 'Product Designer', body: 'UX & UI for mobile-first products — research, prototypes, design systems.', chips: ['Figma', 'UX/UI'] },
    ],
  },
  process: {
    eyebrow: 'The process',
    title: ['From brief to first commit', 'in 48 hours.'],
    steps: [
      { n: '01', title: 'Share your brief', body: 'Role, skills, timeline, working style. 10 minutes, no long forms.' },
      { n: '02', title: 'Candidate match', body: `We match from our vetted pool within 24 hours — see [what we actually screen for](${live('/blog/hire-react-native-developers')}).` },
      { n: '03', title: 'Intro call', body: '30 minutes with the engineer — technical & culture fit.' },
      { n: '04', title: 'Kick-off', body: 'Contracts, onboarding, first standup — within 48 hours.' },
    ],
  },
  ir35: {
    title: 'IR35-aware placements for UK clients',
    body: "We understand the UK contractor landscape and structure engagements with IR35 compliance in mind — inside-IR35 via umbrella or outside-IR35 limited company. We'll discuss the right structure on the first call.",
  },
  cta: {
    title: ['Need a developer', 'this month?'],
    lead: "Tell us what you need — we'll match the right engineer within 24 hours.",
    primary: 'Discuss a Placement →',
    secondary: { label: 'Send a brief', href: '/contact/' },
  },
  faq: {
    title: 'Before you hire.',
    items: [
      { q: 'What engagement models do you offer for hiring developers?', a: 'Three models: staff augmentation (embed our engineers into your team), a dedicated team/pod managed by us, or a fixed-price project contract.' },
      { q: 'How fast can you place a developer?', a: 'We match a candidate within 24 hours of your brief and can kick off within 48 hours.' },
      { q: 'Which roles can I hire?', a: 'React Native, MERN/full-stack, AI/Claude, Flutter, and DevOps/Cloud engineers, plus product designers.' },
      { q: 'Are your contracts IR35-compliant for UK clients?', a: 'Yes — we structure engagements with IR35 compliance in mind, inside via umbrella or outside via limited company, and discuss the right structure on the first call.' },
      { q: 'Do you provide junior developers?', a: 'No — senior-only, with 5+ years commercial experience each. No juniors learning on your budget.' },
    ],
  },
}

export const MVP_PAGE = {
  meta: {
    title: 'MVP Development Company | Build Your MVP in 10–16 Weeks',
    description: 'MVP development for founders — scope it properly, ship in 10–16 weeks, learn from real users. Fixed-price proposal within 48 hours of a free call.',
  },
  hero: {
    crumb: 'MVP Development',
    eyebrow: 'MVP · Founders · 10–16 weeks',
    title: ['Build the version', 'that proves it works.'],
    lead: 'Most failed builds are not engineering failures — they are scoping failures. We help founders cut to a version one that a real user can actually use, then ship it in roughly 10–16 weeks of senior engineering effort, on a fixed price agreed before any code is written.',
    primary: 'Book a free scoping call →',
    secondary: { label: 'Estimate your MVP cost', href: '/app-cost-calculator/' },
  },
  buckets: {
    eyebrow: 'The hard part',
    title: ['Deciding what not', 'to build.'],
    lead: 'An MVP is not a cheap version of your product. It is the smallest thing that produces a real answer. Sort every feature into three buckets and be strict about the first one.',
    items: [
      { tag: 'Core', title: 'Without it, there is no product', body: 'If you can describe a usable product without the feature, it is not core. Most scopes have far fewer core features than the founder first thinks.' },
      { tag: 'Supporting', title: 'The core genuinely depends on it', body: 'Sign-in, basic settings, the plumbing the core cannot run without. Keep this list short and treat every addition with suspicion.' },
      { tag: 'Later', title: 'Scheduled, not cancelled', body: 'Everything else. Writing it down as later matters — a feature with a date stops being argued about every week.' },
    ],
    test: 'A practical test: for each feature, ask what actually happens if it ships three months after launch. “Some users would find it inconvenient” means it is not core. “The product makes no sense” means it is.',
  },
  get: {
    eyebrow: 'What you get',
    title: ['A real product,', 'not a demo.'],
    items: [
      { title: 'Cross-platform from one codebase', body: 'iOS and Android from a single [React Native](/react-native-app-development/) codebase, so you are not funding two teams before you have proof anyone wants it.' },
      { title: 'A backend that survives launch', body: 'MERN or PostgreSQL, real auth, and an architecture that will not need a rewrite the week after you get traction.' },
      { title: 'AI only where it earns its place', body: 'Claude or GPT features when they solve a real problem — see [AI app development](/ai-app-development/). We will talk you out of it when they do not.' },
      { title: 'Store submission handled', body: 'Review-ready builds, listings and the back-and-forth with Apple and Google, included rather than quoted separately.' },
      { title: 'Analytics from day one', body: 'An MVP that ships without instrumentation cannot answer the question you built it to answer. Events and funnels are part of the build.' },
      { title: 'Code and accounts you own', body: 'Your repository, your infrastructure, your IP. Nothing to extract if you take it in-house or to another team later.' },
    ],
  },
  timeline: {
    eyebrow: 'Timeline',
    title: 'Where an MVP sits.',
    lead: 'These bands are engineering effort — the working time of a senior team — not calendar time with more people thrown at it. Adding people to a late project reliably makes it later.',
    bands: [
      { range: '~10–16 weeks', from: 10, to: 16, name: 'MVP / focused first product.', body: 'One core loop, a handful of screens, standard auth, a straightforward backend, one or two integrations. This is what you build to test demand. An attendance and payroll platform we built shipped in around 16 weeks, at the fuller end of this band.' },
      { range: '~24–32 weeks', from: 24, to: 32, name: 'Standard / market-ready.', body: 'Several connected modules, custom interface work, real-time features, payments and a proper admin side. Most funded products land here — it is a step beyond an MVP, not an MVP.' },
      { range: '32+ weeks', from: 32, to: 32, open: true, name: 'Complex / scale.', body: 'Multi-sided platforms, heavy integrations, strict compliance or high concurrency. If your idea only works at this size, an MVP may not be the right first move — and we will say so.' },
    ],
    more: `More detail on how these are estimated: [how long it takes to build a mobile app](${live('/blog/how-long-to-build-an-app')}).`,
  },
  budget: {
    eyebrow: 'Budget',
    title: ['What it costs,', 'honestly.'],
    lead: 'A focused MVP typically starts in the low five figures (USD), and scales from there with feature depth. Anyone quoting a single number for “an app” without asking about your backend is guessing.',
    body: 'The thing that moves the number most is not screen count — it is what has to be true underneath. Real-time updates, payments, offline behaviour, role-based access and third-party integrations drive far more cost than another screen does. That is the question we spend most of the scoping call on.',
    primary: { label: 'Estimate your scope →', href: '/app-cost-calculator/' },
    secondary: { label: 'Read the full cost breakdown', href: live('/blog/react-native-app-development-cost') },
  },
  process: {
    eyebrow: 'Process',
    title: ['Idea to launch,', 'without the drama.'],
    steps: [
      { n: '01', title: 'Scope call', body: '30 minutes on your goals, users and constraints — with an honest read on feasibility. If the idea has a serious problem, you hear it here, not in month three.' },
      { n: '02', title: 'Fixed-price proposal', body: 'Scope, timeline and a fixed price within 48 hours. Version one separated from later phases explicitly, with the assumptions written down.' },
      { n: '03', title: 'Build', body: 'Weekly demo builds you can hold in your hand from the first sprint — working software, not a status report describing it.' },
      { n: '04', title: 'Launch & learn', body: 'Store submission handled, then monitoring and iteration once real usage starts telling you what you actually built.' },
    ],
  },
  proof: {
    eyebrow: 'Proof',
    title: 'Products we shipped.',
    lead: "Real builds, live in users' hands. Product names are withheld under client NDAs — every metric and timeline below is real.",
    items: [
      { value: '16 weeks', body: 'HR & payroll platform — the closest of our builds to MVP scale, live on both stores', href: '/work/hr-payroll/' },
      { value: '+35%', body: 'Downloads after launch for a creator–venue marketplace', href: '/work/creator-marketplace/' },
      { value: '~3 min', body: 'Average booking time on a ride-hailing platform with AI fare prediction', href: '/work/ride-hailing/' },
    ],
    action: 'See the case study →',
  },
  reading: {
    eyebrow: 'Before you commit',
    title: 'Worth reading first.',
    items: [
      { title: 'Validate before you build', body: `The cheapest MVP is the one you did not need. [How to validate an app idea](${live('/blog/validate-app-idea-before-building')}) before spending on engineering.` },
      { title: 'Choosing the stack', body: `Framework choice is mostly a hiring decision, not a benchmark one. [How to choose your MVP tech stack](${live('/blog/mvp-tech-stack-2026')}).` },
      { title: 'Can AI just build it?', body: `A straight answer rather than a sales one: [what AI genuinely accelerates](${live('/blog/can-ai-build-my-app')}), and what it still cannot own.` },
      { title: 'After launch', body: `What changes once real users arrive: [from MVP to product-market fit](${live('/blog/mvp-to-product-market-fit')}).` },
      { title: 'Scope it yourself', body: 'The five questions we ask on every scoping call, as a free 8-page guide: [the app scoping guide](/app-scoping-guide/).' },
      { title: 'Need a team, not a project?', body: 'If you have ongoing capacity needs rather than a fixed scope, you can [hire a dedicated team](/hire/) instead.' },
    ],
  },
  guides: {
    eyebrow: 'Free guides & tools',
    title: 'Do your homework first.',
    items: [
      { kicker: 'Stack picker', title: 'Which stack fits your MVP', action: 'Get a recommendation →', href: live('/blog/mvp-tech-stack-2026') },
      { kicker: 'Scope tool', title: 'Can AI build your app?', action: 'Find out →', href: live('/blog/can-ai-build-my-app') },
      { kicker: 'Decision tool', title: 'Native, React Native or Flutter?', action: 'Get a recommendation →', href: live('/blog/native-vs-cross-platform-2026') },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Common questions.',
    items: [
      { q: 'What exactly is an MVP, and how is it different from a prototype?', a: 'A prototype answers “could this work?” and is usually throwaway. An MVP answers “will people actually use this?” and has to survive real users, real data and real edge cases. That difference is most of the cost. If you only need to test a concept with a few people, a prototype is cheaper and faster — and we will say so on the call.' },
      { q: 'How long does MVP development take?', a: 'Most focused MVPs land in roughly 10–16 weeks of senior engineering effort. That is effort, not calendar time with more people added — adding people to a late project reliably makes it later. For reference, an attendance and payroll platform we built shipped in around 16 weeks, at the fuller end of that band.' },
      { q: 'How much does an MVP cost?', a: 'A focused MVP typically starts in the low five figures (USD), and scales from there with feature depth — particularly the back-end surface: real-time data, payments, offline behaviour, role-based access and third-party integrations move the number far more than screen count does. Use the app cost calculator for a range against your own scope, then a free call gets you a fixed-price proposal within 48 hours.' },
      { q: 'What should I cut from version one?', a: 'Sort every feature into Core, Supporting and Later. Core means the product does not do its one job without it. Supporting means the core genuinely depends on it. Everything else is Later — scheduled, not cancelled. A practical test: ask what actually happens if a feature ships three months after launch. If the answer is “some users would find it inconvenient”, it is not core.' },
      { q: 'Do I own the code?', a: 'Yes. You own the repository, the infrastructure accounts and the intellectual property. We build in your accounts where possible so there is nothing to extract if you take the product in-house or to another team later.' },
      { q: 'What happens after the MVP launches?', a: 'Launch is the start of the cost, not the end of it. App stores need ongoing releases, OS versions change, and real usage produces work no plan anticipated. We stay for monitoring and iteration sprints, or hand over cleanly if you are building an in-house team — both are normal.' },
    ],
  },
  cta: {
    title: ['Get a fixed price', 'for your MVP.'],
    lead: 'A 30-minute scoping call, then a fixed-price proposal within 48 hours. If an MVP is not the right first move, we will tell you on the call. NDA on request.',
    primary: 'Book a free scoping call →',
    secondary: { label: 'See our work', href: '/work/' },
  },
}

export const RN_PAGE = {
  meta: {
    title: 'Hire React Native Developers | Development Company',
    description: 'Hire senior React Native developers for iOS & Android. Fixed pricing, no setup fees, apps live on both stores.',
  },
  hero: {
    crumb: 'React Native Development',
    eyebrow: 'React Native · Cross-platform',
    title: ['Hire expert React Native developers.', 'Ship to both app stores.'],
    lead: "Hire senior React Native developers (5+ years) to build your iOS and Android app. Fixed pricing, no upfront fees, 8-week timeline. We've shipped 4 production apps to both stores. Direct access to Het and the team—no middlemen.",
    primary: 'Get Free App Scoping (15 min) →',
    secondary: { label: 'Download Free Guide', href: '/app-scoping-guide/' },
  },
  build: {
    eyebrow: 'What we build',
    title: ["Built for how it's", 'actually used.'],
    items: [
      { title: 'Cross-platform by default', body: 'One React Native codebase compiles to native iOS and Android, so you ship to both stores without paying for two teams.' },
      { title: 'Native performance', body: `We build on [React Native's New Architecture](${live('/blog/react-native-new-architecture-2026')}), 60fps animation and native modules where it matters. Users can't tell it isn't Swift or Kotlin — and don't care.` },
      { title: 'MERN backends', body: 'Node.js APIs, MongoDB, real-time data and AWS infrastructure, built by the same team that builds your app.' },
      { title: 'AI where it earns its place', body: 'Claude and GPT integration, retrieval and agents — see our [AI app development services](/ai-app-development/).' },
      { title: 'Store submission handled', body: 'Review-ready builds, listings, screenshots and the back-and-forth with Apple and Google — included.' },
      { title: 'Support after launch', body: 'Monitoring, updates and iteration sprints, with direct access to the engineers who built your app. Need ongoing capacity instead of a fixed project? You can [hire a dedicated React Native team](/hire/).' },
    ],
  },
  proof: {
    eyebrow: 'Proof',
    title: 'Four React Native apps, live on the stores',
    lead: 'Every case study below is a real product you can download today.',
    items: [
      { value: 'HR & Payroll', body: 'HR & payroll — 40% faster payroll processing', href: '/work/hr-payroll/' },
      { value: 'Creator Marketplace', body: 'Creator marketplace — +35% downloads', href: '/work/creator-marketplace/' },
      { value: 'Retail Ops', body: 'Retail SaaS — multi-store operations standardised', href: '/work/retail-ops/' },
      { value: 'Ride-Hailing', body: 'Ride-hailing — ~3 minute average booking', href: '/work/ride-hailing/' },
    ],
    action: 'See the case study →',
  },
  regions: {
    eyebrow: 'Where we work',
    title: 'Founders we build for, by region.',
    items: [
      { label: 'React Native development — UK', href: live('/react-native-app-development-uk/') },
      { label: 'React Native development — Dubai', href: live('/react-native-app-development-dubai/') },
      { label: 'React Native development — USA', href: live('/react-native-app-development-usa/') },
    ],
  },
  guides: {
    eyebrow: 'Free guides & tools',
    title: 'Free tools for your decision.',
    items: [
      { kicker: 'Decision tool', title: 'Native, React Native or Flutter?', action: 'Get a recommendation →', href: live('/blog/native-vs-cross-platform-2026') },
      { kicker: 'Decision tool', title: 'Kotlin Multiplatform or React Native?', action: 'Get a recommendation →', href: live('/blog/kotlin-multiplatform-vs-react-native') },
      { kicker: 'Migration check', title: 'Is your app on borrowed time?', action: 'Check urgency →', href: live('/blog/react-native-new-architecture-2026') },
      { kicker: 'Self-audit', title: 'Score your app’s security', action: 'Run the audit →', href: live('/blog/mobile-app-security-checklist') },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Common questions.',
    items: [
      { q: 'How much does a React Native app cost?', a: 'A focused MVP typically starts in the low five figures (USD); full products scale with feature depth. Get an instant range with our [app cost calculator](/app-cost-calculator/), then a fixed-price proposal within 48 hours of a call.' },
      { q: 'How long does a React Native app take to build?', a: 'Most MVPs land in 6–12 weeks. The four products in our portfolio took 16–32 weeks each to reach full market release on both stores.' },
      { q: 'Is React Native better than Flutter or going fully native?', a: `For most products, yes — one codebase, native performance, the largest ecosystem and over-the-air updates. We compare the options honestly in our [React Native vs Flutter guide](${live('/blog/react-native-vs-flutter-2026')}).` },
      { q: 'Who actually builds my app?', a: 'Het Soni and senior engineers — no handoffs to juniors and no account managers between you and the people writing the code.' },
    ],
  },
  cta: {
    title: ['Get a fixed price for your', 'React Native app.'],
    lead: '30-minute scoping call with Het → fixed-price proposal within 48 hours → senior developers start in 2 days. No setup fees. NDA on request.',
    primary: 'Get Free App Scoping (15 min) →',
    secondary: { label: 'Download Free Guide', href: '/app-scoping-guide/' },
  },
}

export const CALC_PAGE = {
  meta: {
    title: 'App Development Cost Calculator | Soni Consultancy Services',
    description: "Estimate your React Native or MERN app's timeline and cost in 60 seconds. Pick platforms and features, get an indicative range, then a fixed-price quote.",
  },
  hero: {
    crumb: 'App Cost Calculator',
    eyebrow: 'Free tool',
    title: ['What will your app', 'cost to build?'],
    lead: "Pick your platforms and features. You'll get an indicative timeline and cost range instantly — then a precise, fixed-price quote after a 30-minute call.",
  },
  // Model is verbatim from the live page's JS (RATE_LO/RATE_HI are the live placeholders).
  model: {
    RATE_LO: 1800,
    RATE_HI: 3200,
    platform: [
      { value: 'cross', label: 'Cross-platform', mult: 1 },
      { value: 'ios', label: 'iOS only', mult: 0.9 },
      { value: 'android', label: 'Android only', mult: 0.9 },
    ],
    stage: [
      { value: 'mvp', label: 'MVP', base: 4, hint: '~4 wk base' },
      { value: 'ready', label: 'Market-ready', base: 8, hint: '~8 wk base' },
      { value: 'scale', label: 'Scale / enterprise', base: 14, hint: '~14 wk base' },
    ],
    features: [
      { label: 'User accounts & profiles', weeks: 1.5, on: true },
      { label: 'Payments / subscriptions', weeks: 2.5 },
      { label: 'Chat / messaging', weeks: 2.5 },
      { label: 'Maps & geolocation', weeks: 2 },
      { label: 'Push notifications', weeks: 1 },
      { label: 'Admin dashboard', weeks: 3 },
      { label: 'AI integration', weeks: 3 },
      { label: 'Offline mode / sync', weeks: 2 },
      { label: 'Analytics dashboards', weeks: 1.5 },
      { label: 'Social feed', weeks: 2 },
    ],
    design: [
      { value: 'standard', label: 'Standard', mult: 1 },
      { value: 'custom', label: 'Custom UI/UX', mult: 1.2 },
      { value: 'premium', label: 'Premium / animated', mult: 1.4 },
    ],
    backend: [
      { value: 'baas', label: 'Managed / BaaS', add: 0 },
      { value: 'mern', label: 'Custom MERN API', add: 3, hint: '+3' },
      { value: 'realtime', label: 'Realtime + scale', add: 5, hint: '+5' },
    ],
  },
  labels: {
    groups: { platform: 'Platforms', stage: 'Build stage', features: 'Features', design: 'Design', backend: 'Backend' },
    result: 'Indicative estimate',
    range: 'Typical range for this scope · USD',
    timeline: 'Timeline',
    team: 'Team',
    teamValue: 'Het + dedicated engineers',
    pricing: 'Pricing model',
    pricingValue: 'Fixed-price',
    name: { label: 'Your name', placeholder: 'James Morrison' },
    email: { label: 'Work email', placeholder: 'james@company.com' },
    submit: 'Email me the breakdown →',
    note: "We'll send a detailed scope breakdown and reply within one business day. No spam.",
    success: `✓ Got it. We'll review your scope and reply with a detailed breakdown within one business day — or [book a call](${CALENDLY}) to lock the fixed price now.`,
    disclaimer: 'Estimates are indicative, based on typical project scope — not a quote. Your exact fixed price is confirmed after a short discovery call once requirements are clear.',
  },
  cta: {
    title: 'Want the exact number?',
    lead: "Book a free 30-minute call — we'll turn this estimate into a fixed-price proposal within 48 hours.",
    primary: 'Book a Free Call →',
    secondary: { label: 'See our work', href: '/work/' },
  },
}

export const GUIDE_PAGE = {
  meta: {
    title: 'Free App Scoping Guide for Founders | Soni Consultancy',
    description: 'Free guide: How to scope React Native and MERN apps — timeline, cost estimates, and the 5 questions that unlock your project brief. Download now.',
  },
  hero: {
    eyebrow: 'FREE GUIDE',
    title: 'Scope Your App Like a Founder, Not a Salesperson',
    lead: 'The five questions every founder should ask before building. Plus timelines, cost ranges, and the exact methodology we use to give fixed prices in 48 hours.',
    includes: [
      { title: 'The 5 Discovery Questions', body: "Ask these of any team and you'll get real answers about feasibility and cost." },
      { title: 'Timeline Estimates', body: 'MVP vs full product. React Native vs Flutter vs native. Realistic ranges.' },
      { title: 'Cost Ranges', body: 'What you should expect to pay for different project sizes and complexity levels.' },
      { title: 'Scoping Methodology', body: 'The exact process we use to turn your idea into a fixed-price proposal.' },
    ],
    note: 'This is not a sales pitch. Whether you build with us or another team, this guide will help you ask smarter questions and avoid costly mistakes.',
    primary: { label: 'Get the Guide (Free) →', href: '#form' },
    secondary: 'Or book a call',
  },
  form: {
    title: 'Download the Guide',
    sub: 'Instant download — no waiting on an email. 8 pages, free.',
    fields: {
      name: { label: 'First name', placeholder: 'James' },
      email: { label: 'Work email', placeholder: 'james@company.com' },
      company: { label: 'Company', placeholder: 'Acme Inc.' },
      stage: { label: 'Stage', placeholder: 'Select your stage', options: ['Just an idea', 'Prototype / MVP started', 'MVP ready, raising funds', 'Post-launch, scaling'] },
    },
    submit: 'Get the guide →',
    legal: 'No spam. By downloading you agree to our privacy policy.',
    required: 'Please fill in your name and email.',
    successTitle: '✓ Your guide is ready.',
    successBody: 'Click below to download it — it opens straight away, nothing to wait for.',
    download: { label: 'Download the PDF (8 pages)', href: live('/assets/app-scoping-guide.pdf') },
    talk: 'Prefer to talk it through? Book a free 30-min scoping call →',
  },
  why: {
    eyebrow: 'Why scoping matters',
    title: "Most founders get their app wrong because they didn't scope it right.",
    items: [
      { title: 'Scope creep', body: "You add features mid-build because you didn't think through what's actually MVP and what's Phase 2. Timeline doubles, costs triple." },
      { title: 'Wrong tech choice', body: "You pick a stack based on what your friend used, not what your app needs. Six months in, you realise you chose the wrong framework." },
      { title: 'Bad vendor choice', body: "You hire the cheapest team because you didn't know what questions to ask. They build you something that can't scale, and you're stuck rewriting." },
    ],
    close: "This guide teaches you the exact questions and framework we use so you don't make these mistakes — and you know exactly what to expect from any team you work with.",
  },
  who: {
    eyebrow: 'Who this is for',
    title: 'Founders. Technical co-founders. Product leads.',
    body: [
      "If you're building a mobile or web app and want to understand how to scope it properly before you talk to any team, this guide is for you.",
      "It's agnostic — you might end up working with us, or you might build in-house, or you might hire someone else. Either way, this guide will save you time and money.",
      "The only people this won't help: if you've already built your app and it works perfectly, you probably don't need it.",
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Common questions.',
    items: [
      { q: "What's included in the App Scoping Guide?", a: 'The guide covers how to define your MVP, the five discovery questions every founder should ask, realistic timeline estimates for React Native and MERN projects, cost ranges for different project sizes, and the exact process we use to scope projects within 48 hours.' },
      { q: 'How do I get the guide after filling in the form?', a: "The download link appears immediately on the page once you submit — there's no waiting on an email. The PDF is 8 pages and free to keep or share." },
      { q: 'Will you use my email to spam me?', a: 'No. We may follow up once about your project or occasionally share new work — nothing more, and you can opt out any time.' },
      { q: 'Is this guide specific to Soni Consultancy?', a: 'No — the scoping methodology is universal. Whether you work with us or another team, this guide will help you scope your app accurately and ask smarter vendor questions.' },
    ],
  },
  cta: {
    title: 'Ready to scope your app?',
    lead: 'Download the guide, or skip straight to a 30-minute discovery call with Het.',
    primary: { label: 'Get the Guide (Free)', href: '#form' },
    secondary: 'Book a Call',
  },
}
