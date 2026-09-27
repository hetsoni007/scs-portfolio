// Home (/) — verbatim.

export const HOME = {
  meta: {
    title: 'React Native & AI App Development Company | Soni Consultancy',
    description:
      'React Native, MERN & AI app development for founders. Senior engineers, fixed-price proposals in 48 hours, apps live on both stores. Book a free scoping call.',
  },
  hero: {
    eyebrow: 'React Native · MERN · AI Integration',
    titleLead: 'Build iOS & Android apps in',
    words: ['8 weeks.', 'one codebase.', 'with senior engineers.', 'with AI built in.'],
    // "cross-platform iOS & Android apps" is emphasised on the live site
    lead: [
      'We design and build ',
      { strong: 'cross-platform iOS & Android apps' },
      ' in React Native & MERN — with AI built in. Real products, live on both stores, shipped by senior engineers.',
    ] as (string | { strong: string })[],
    primary: 'Get Free App Scoping (15 min)',
    secondary: { label: 'Free Guide →', href: '/app-scoping-guide/' },
    trust: 'Live on the App Store & Google Play · 4+ products shipped · No upfront fee to talk',
  },
  proof: {
    eyebrow: 'Proof, not promises',
    title: ['Real apps. Real results.', 'Live on the stores today.'],
    stats: [
      { count: 4, suffix: '+', label: 'Apps live on App Store & Play Store' },
      { count: 35, suffix: '%', label: 'More downloads (creator marketplace)' },
      { count: 40, suffix: '%', label: 'Less payroll admin (HR platform)' },
      { count: 30, suffix: '+', label: 'Countries served' },
    ],
  },
  services: {
    eyebrow: 'What we do',
    title: ['One team, from idea', 'to App Store.'],
    lead: 'Mobile-first, AI-ready, senior-only. We own design, build and launch so you ship faster with fewer moving parts.',
    items: [
      {
        layer: 'Interface',
        title: 'React Native App Development',
        body: 'iOS & Android from one codebase — native performance, push, maps, payments, offline. Submitted, approved, live.',
        chips: ['React Native', 'Expo', 'iOS + Android'],
      },
      {
        layer: 'Logic',
        title: 'MERN-Stack Backends',
        body: 'MongoDB, Express, React, Node — the API, auth, dashboards and real-time infrastructure your app runs on, built to scale.',
        chips: ['Node.js', 'MongoDB', 'Next.js', 'AWS'],
      },
      {
        layer: 'Intelligence',
        title: 'AI Integration',
        body: 'Claude & GPT features that earn their place — AI fare prediction, smart matching, assistants, RAG.',
        link: { label: 'See AI app ideas →', href: '/ai-app-development/' },
        chips: ['Claude API', 'GPT', 'RAG'],
      },
    ],
  },
  work: {
    eyebrow: 'Selected work',
    title: 'Apps we\'ve shipped.',
    more: { label: 'Explore the full portfolio →', href: '/work/' },
  },
  why: {
    eyebrow: 'Why founders pick us',
    title: ['Less risk. Faster ship.', 'Senior hands only.'],
    items: [
      { title: 'Ship in weeks, not quarters', body: 'A focused MVP on both stores in 6–10 weeks. You see working software every week — no black box.', dim: '6–10 wk' },
      { title: 'Senior engineers, no juniors', body: 'The people on your call are the people writing the code. 5+ years commercial, store-proven.', dim: '5+ yrs' },
      { title: 'Fixed scope, fixed price', body: 'A clear proposal within 48 hours of our call. You know the number before you commit a penny.', dim: '48 h' },
    ],
  },
  founder: {
    eyebrow: 'Who you\'ll work with',
    initials: 'HS',
    title: 'Het Soni — Founder & Lead Engineer',
    body: [
      '5+ years building and shipping commercial apps — React Native, MERN and AI — live on the App Store and Google Play. The senior engineer who scopes, builds and ships your product is the person you talk to, not a sales rep who hands it to juniors.',
      'Working across UK, US, UAE and India time zones for real-time collaboration, with transparent fixed pricing agreed before a line of code is written. [More about how we work →](/about/)',
    ],
    linkedin: 'Connect on LinkedIn →',
  },
  voices: {
    eyebrow: 'What people say',
    title: ['Trusted by clients', 'and collaborators.'],
  },
  cta: {
    title: ['Have an app idea?', 'Let\'s pressure-test it — free.'],
    lead: '30 minutes with a senior engineer. We\'ll tell you what it takes to build, what it costs, and whether we\'re the right team. No pitch, no obligation.',
    primary: 'Book Your Free Call →',
    secondary: { label: 'Send a brief', href: '/contact/' },
    assurances: 'You own all code & IP · NDA on request · Free intro call, no upfront fee · Fixed scope & price up front',
    emailLine: 'Or email',
  },
}
