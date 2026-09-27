// /about/ and /contact/ — verbatim.

export const ABOUT_PAGE = {
  meta: {
    title: 'About | Soni Consultancy Services',
    description:
      'A senior-only React Native, MERN & AI app studio founded by Het Soni, shipping apps live on the App Store & Google Play across six countries.',
  },
  hero: {
    crumb: 'About',
    eyebrow: 'Who we are',
    title: ['A senior-only studio', 'that actually ships.'],
    lead: 'Soni Consultancy Services builds React Native & MERN apps with AI inside — for founders and teams who care more about shipping than slideware.',
  },
  story: {
    initials: 'HS',
    name: 'Het Soni',
    role: 'Founder & Lead Engineer',
    linkedin: 'LinkedIn ↗',
    title: 'Built by engineers, run like a product team.',
    body: [
      "We're a boutique studio, not an agency body-shop. The senior engineers on your first call are the ones who write your code and submit your app. We've shipped attendance & payroll, retail ops, creator marketplaces and ride-hailing — real products, live on the App Store and Google Play, across six countries.",
      'Our edge is range: deep React Native and MERN, plus AI integration that earns its place. We move fast because we keep the team small and the standards high.',
    ],
  },
  stats: [
    { value: '4+', label: 'Apps shipped' },
    { value: '30+', label: 'Countries served' },
    { value: '8', label: 'Store listings' },
    { value: '5+', label: 'Yrs senior experience' },
  ],
  values: {
    eyebrow: 'What we value',
    title: 'How we work.',
    items: [
      { title: 'Ship over slideware', body: 'Working software every week beats a perfect plan. You see progress, not promises.' },
      { title: 'Senior, not staffed-up', body: "No juniors learning on your budget. Every line is written by someone who's shipped before." },
      { title: 'Honest, even when it costs us', body: "If you shouldn't build it, we'll tell you. Trust beats one more invoice." },
    ],
  },
  regions: { eyebrow: 'Where we work', title: 'Six countries. One standard.' },
  cta: {
    title: ["Let's build something", 'worth shipping.'],
    primary: 'Book a Free Call →',
    secondary: { label: 'See our work', href: '/work/' },
  },
  faq: {
    title: 'About the studio.',
    items: [
      { q: 'Who founded Soni Consultancy Services?', a: 'Het Soni, Founder & Lead Engineer, with 5+ years of senior commercial experience in React Native, MERN and AI.' },
      { q: 'What makes Soni Consultancy Services different from a typical agency?', a: "We're a boutique studio, not an agency body-shop — the senior engineers on your first call are the ones who write your code and submit your app. No juniors, no account-manager layer." },
      { q: 'Which countries do you work with clients in?', a: 'The UK, US, UAE, India, Canada and Australia — six countries, one standard of senior-only engineering.' },
      { q: 'How many apps has Soni Consultancy Services shipped?', a: '4+ apps live across 8 store listings, serving users in 30+ countries.' },
    ],
  },
}

export const CONTACT_PAGE = {
  meta: {
    title: 'Contact | Soni Consultancy Services',
    description:
      'Book a free 30-minute call to scope your React Native, MERN or AI app, or send a brief — we reply within one business day.',
  },
  hero: {
    crumb: 'Contact',
    eyebrow: 'Get in touch',
    title: ["Let's scope your app", 'this week.'],
    lead: "30 minutes, no pitch deck — just an honest conversation about what you're building and whether we're the right team.",
  },
  channels: {
    call: { kicker: 'Fastest · Recommended', title: 'Book a Free 30-Min Call', body: 'Calendly with Het directly — UK, US & UAE times available.' },
    email: { kicker: 'Email', body: 'Replies within one business day.' },
    linkedin: { kicker: 'LinkedIn', title: 'Connect with Het Soni', body: 'Good for a quick intro before reaching out.' },
  },
  response: {
    title: 'Response times',
    rows: [
      { k: 'Discovery call', v: 'Same day' },
      { k: 'Email', v: '1 business day' },
      { k: 'Project kick-off', v: 'Within 48 hours' },
    ],
  },
  regions: { eyebrow: 'Where we work', title: 'Six countries. One standard.' },
  faq: {
    title: 'Before you reach out.',
    items: [
      { q: 'How quickly can you start?', a: "Fast — average kick-off from signed contract is 48 hours, and discovery calls are bookable same-day. Flag anything urgent in the form and we'll prioritise." },
      { q: 'Do you work with early-stage founders?', a: 'Yes — from solo founders on a first MVP to teams at Series B. What matters is a clear problem and the seriousness to ship.' },
      { q: 'What does a typical app cost?', a: 'A focused MVP starts in the low five figures; full products with mobile + AI scale from there. You get a fixed-price proposal within 48 hours of the call — no vague "it depends."' },
      { q: 'Do you sign NDAs?', a: 'Always, before any substantive discussion of your product. Your ideas and data stay confidential throughout and after.' },
      { q: 'Will I work directly with Het?', a: 'Yes — directly with Het from first call to delivery. No account managers, and direct access to the engineers building your app.' },
    ],
  },
}
