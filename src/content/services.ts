// /services/ — verbatim.
import { live } from './site'

export type Service = {
  n: string
  title: string
  body: string // may contain [text](href)
  bullets: string[]
  chips: string[]
  form: 'phone' | 'layers' | 'stack' | 'lattice' | 'loop' | 'pod' | 'browser'
  short: string
}

export const SERVICES_PAGE = {
  meta: {
    title: 'App Development Services | Soni Consultancy Services',
    description:
      'React Native, MERN, AI integration, DevOps and developer hiring — mobile-first app development services from idea to App Store.',
  },
  hero: {
    crumb: 'Services',
    eyebrow: 'What we do',
    title: ['From idea to App Store —', 'one senior team.'],
    lead: 'Mobile-first, AI-ready, full-stack. We design, build and launch React Native & MERN products — and stay to scale them.',
  },
  process: {
    eyebrow: 'How we work',
    title: 'Five steps. No surprises.',
    steps: [
      { n: '01', title: 'Discover', body: 'Goals, scope, the metric to move. Fixed proposal in 48h.' },
      { n: '02', title: 'Design', body: 'Clickable UX before a line of code.' },
      { n: '03', title: 'Build', body: 'Weekly working software, in your tools.' },
      { n: '04', title: 'Launch', body: 'App Store & Play Store submission, done for you.' },
      { n: '05', title: 'Scale', body: 'Iterate on real usage; own the ops.' },
    ],
  },
  cta: {
    title: 'Know what you want to build?',
    lead: 'Get a fixed-price proposal within 48 hours of a free call.',
    primary: 'Book a Free Call →',
    secondary: { label: 'See our work', href: '/work/' },
  },
  guides: {
    eyebrow: 'Free guides & tools',
    title: 'Not ready to talk? Try these first.',
    items: [
      { kicker: 'Stack picker', title: 'Which stack fits your MVP', action: 'Get a recommendation →', href: live('/blog/mvp-tech-stack-2026') },
      { kicker: 'Decision tool', title: 'Native, React Native or Flutter?', action: 'Get a recommendation →', href: live('/blog/native-vs-cross-platform-2026') },
      { kicker: 'Self-audit', title: 'Score your app’s security', action: 'Run the audit →', href: live('/blog/mobile-app-security-checklist') },
      { kicker: 'Revenue explorer', title: 'How will your app make money?', action: 'Explore models →', href: live('/blog/app-monetization-models') },
    ],
  },
  faq: {
    title: 'Before you get in touch.',
    items: [
      {
        q: 'What services does Soni Consultancy Services offer?',
        a: 'Five core services: React Native app development, MERN-stack & web development, AI integration (Claude & GPT), DevOps & cloud engineering, and hiring a developer through staff augmentation or a dedicated pod.',
      },
      {
        q: "What's your development process?",
        a: 'Five steps: Discover (goals, scope, a fixed proposal within 48 hours), Design (clickable UX before code), Build (weekly working software), Launch (App Store & Play Store submission handled for you), and Scale (iterate on real usage while we own the ops).',
      },
      {
        q: 'Do you build the backend as well as the app?',
        a: "Yes — one team covers the React Native front end and the MERN backend (APIs, auth, dashboards, real-time), so you're not coordinating separate vendors.",
      },
      {
        q: 'Can I hire a single developer instead of a full project team?',
        a: 'Yes — staff augmentation, dedicated pods or contract placements are available. See [our hiring page](/hire/) for engagement models.',
      },
      {
        q: 'Do you handle App Store and Google Play submission?',
        a: 'Yes — submission and approval on both stores is part of our Launch step, done for you.',
      },
    ],
  },
}

export const SERVICES: Service[] = [
  {
    n: '01',
    title: 'React Native App Development',
    short: 'React Native',
    body: 'Cross-platform iOS & Android apps from a single codebase — native performance, submitted, approved and live on both stores.',
    bullets: ['iOS + Android from one codebase', 'Push, maps, payments, biometrics, offline', 'App Store & Play Store submission'],
    chips: ['React Native', 'Expo', 'TypeScript'],
    form: 'phone',
  },
  {
    n: '02',
    title: 'MVP Development',
    short: 'MVP',
    body: 'A focused first product that proves the idea with real users — scoped hard, shipped in roughly 10–16 weeks on a fixed price. [See MVP development →](/mvp-development/)',
    bullets: ['Scope cut to Core / Supporting / Later', 'Fixed-price proposal within 48 hours', 'Analytics instrumented from day one'],
    chips: ['React Native', 'MERN', '10–16 weeks'],
    form: 'layers',
  },
  {
    n: '03',
    title: 'MERN-Stack & Web Development',
    short: 'MERN & Web',
    body: 'The backend, API, dashboards and SSR web app your product runs on — MongoDB, Express, React, Node and Next.js, built to scale.',
    bullets: ['REST/GraphQL APIs, auth, real-time', 'Admin dashboards & SSR web apps', 'Stripe, webhooks, multi-tenancy'],
    chips: ['Node.js', 'MongoDB', 'Next.js', 'PostgreSQL'],
    form: 'stack',
  },
  {
    n: '04',
    title: 'AI Integration',
    short: 'AI',
    body: 'Claude & GPT features that earn their place — assistants, matching, prediction, RAG. [See AI app ideas →](/ai-app-development/)',
    bullets: ['Claude / GPT pipelines & agents', 'RAG, embeddings, vector search', 'Evaluation, guardrails, cost control'],
    chips: ['Claude API', 'GPT', 'RAG'],
    form: 'lattice',
  },
  {
    n: '05',
    title: 'DevOps & Cloud',
    short: 'DevOps',
    body: 'CI/CD pipelines, containerised deploys and auto-scaling AWS infrastructure — we own the ops layer so launches are boring. [Explore DevOps & Cloud →](/devops-cloud-engineering/)',
    bullets: ['AWS architecture & auto-scaling', 'CI/CD, Docker, monitoring', '99.9% uptime infrastructure'],
    chips: ['AWS', 'Docker', 'CI/CD'],
    form: 'loop',
  },
  {
    n: '06',
    title: 'Hire a Developer',
    short: 'Hire',
    body: 'Embed our senior React Native, MERN or AI engineers into your team — staff augmentation, dedicated pods or contract. [See engagement models →](/hire/)',
    bullets: ['Senior-only, 5+ years commercial', 'Kick-off within 48 hours', 'IR35-aware for UK clients'],
    chips: ['Staff aug', 'Dedicated team', 'Contract'],
    form: 'pod',
  },
  {
    n: '07',
    title: 'WordPress Website Development',
    short: 'WordPress',
    body: `Custom WordPress & WooCommerce websites for Indian businesses, built by the same senior engineers. [See WordPress services →](${live('/wordpress-website-development-india/')})`,
    bullets: ['Custom theming, not just templates', 'WooCommerce & Indian payment gateways', 'Migration, speed & SEO setup'],
    chips: ['WordPress', 'WooCommerce', 'India'],
    form: 'browser',
  },
]
