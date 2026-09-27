// Lead-form copy, verbatim from the live site (CONTENT.md → "Short lead form").

export const LEAD_FIELDS = {
  name: { label: 'Your name', placeholder: 'Jane Doe' },
  email: { label: 'Work email', placeholder: 'jane@company.com' },
  want: {
    label: 'What are you building?',
    placeholder: 'One line is plenty — e.g. a patient booking app for 3 clinics',
  },
  budget: {
    label: 'Budget',
    placeholder: 'Select a range',
    options: ['Not sure yet', '<$10k', '$10-25k', '$25-60k', '$60k+'],
  },
  timeline: {
    label: 'Timeline',
    placeholder: 'Select a timeline',
    options: ['ASAP', '1-3 months', '3-6 months', 'Just exploring'],
  },
  consent:
    'I agree to Soni Consultancy Services storing these details to reply to my enquiry. No newsletter, no sharing with anyone else.',
  submit: 'Send →',
  note: 'Replies within one business day · no upfront fee to talk',
  honeypot: 'Leave this empty',
  kicker: 'Start here',
  success:
    '✓ Thanks — that’s with Het. You’ll get a reply within one business day, usually with either a straight answer or the two or three questions needed to scope it properly.',
  errors: {
    name: 'Please add your name.',
    email: 'Please check your email address.',
    want: 'A one-line description is enough.',
    consent: 'Please tick the consent box so we can reply.',
    network: 'Network error — please email het.soni@soniconsultancyservices.com directly.',
    generic: 'Something went wrong — please email us directly.',
  },
}

export type LeadVariant = { kind: string; projectType?: string; title: string; sub: string }

export const LEAD_VARIANTS: Record<string, LeadVariant> = {
  services: {
    kind: 'services',
    title: 'Tell us what you’re building.',
    sub: 'One short form. You get a straight answer on scope and a fixed price within 48 hours — or an honest no if it isn’t a fit.',
  },
  work: {
    kind: 'work',
    title: 'Want something like this built?',
    sub: 'Tell us what you have in mind. We’ll tell you what it takes, and what it doesn’t need.',
  },
  about: {
    kind: 'about',
    title: 'Start a conversation.',
    sub: 'No pitch deck, no discovery-call funnel. It goes straight to Het, who reads every brief personally.',
  },
  ai: {
    kind: 'ai',
    projectType: 'AI integration',
    title: 'Scope your AI feature.',
    sub: 'Describe the feature in one line. We’ll tell you honestly whether AI is the right tool for it — including when it isn’t.',
  },
  devops: {
    kind: 'devops',
    projectType: 'DevOps & cloud',
    title: 'Tell us about your infrastructure.',
    sub: 'Migration, CI/CD or a cloud bill that keeps climbing — tell us the problem and we’ll tell you the fix.',
  },
  hire: {
    kind: 'hire',
    projectType: 'Hire a developer',
    title: 'Tell us the role you need.',
    sub: 'Senior engineers only. We’ll come back within 24 hours with who’s available and what it costs.',
  },
  mvp: {
    kind: 'mvp',
    projectType: 'MVP',
    title: 'Get a fixed-price MVP estimate.',
    sub: 'Tell us what version one has to prove. You’ll get a scoped, fixed price within 48 hours.',
  },
  'react-native': {
    kind: 'react-native',
    projectType: 'React Native app',
    title: 'Get a fixed-price estimate.',
    sub: 'One short form. A scoped, fixed price within 48 hours — no hourly guesswork, no upfront fee to talk.',
  },
  blog: {
    kind: 'blog',
    title: 'Have a project in mind?',
    sub: 'You’ve read the thinking. If you want it applied to your product, tell us in one line.',
  },
  fintech: {
    kind: 'fintech',
    projectType: 'FinTech app',
    title: 'Building a fintech product?',
    sub: 'Payments, KYC, compliance and audit trails are the hard part. Tell us the shape of it and we’ll scope it properly.',
  },
  retail: {
    kind: 'retail',
    projectType: 'Retail app',
    title: 'Building for retail?',
    sub: 'Store ops, stock, loyalty or a customer app — tell us what it has to do and we’ll come back with a fixed price.',
  },
  'ride-hailing': {
    kind: 'ride-hailing',
    projectType: 'Ride-hailing app',
    title: 'Building a ride-hailing product?',
    sub: 'Rider app, driver app, dispatch and live tracking. Tell us the scope and we’ll tell you what it really takes.',
  },
  'hr-payroll': {
    kind: 'hr-payroll',
    projectType: 'HR & Payroll app',
    title: 'Building an HR or payroll product?',
    sub: 'Attendance, payroll runs, compliance and multi-branch structures. Tell us the shape and we’ll scope it.',
  },
}

export const CONTACT_FORM = {
  title: 'Send a brief',
  sub: 'Tell us about your app and we\'ll come to the call prepared.',
  fields: {
    first: { label: 'First name', placeholder: 'James' },
    last: { label: 'Last name', placeholder: 'Morrison' },
    email: { label: 'Work email', placeholder: 'james@company.com' },
    company: { label: 'Company', placeholder: 'Acme Inc.' },
    service: {
      label: 'I\'m interested in…',
      placeholder: 'Select a service',
      options: [
        'React Native App Development',
        'MERN / Web Development',
        'AI Integration',
        'DevOps & Cloud',
        'Hire a Developer',
        'Something else',
      ],
    },
    message: { label: 'Tell us about your project', placeholder: 'What are you building? What stage are you at?' },
  },
  submit: 'Send brief →',
  note: 'No spam, ever. We reply within one business day.',
  success: '✓ Brief received. We\'ll be in touch within one business day — or book a call to speak sooner.',
}
