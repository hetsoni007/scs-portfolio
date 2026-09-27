// Global facts. Transcribed verbatim from CONTENT.md → "Global".
// These are the ONLY real contact channels. Never add others.

export const LIVE = 'https://soniconsultancyservices.com'

export const CALENDLY = 'https://calendly.com/het-soni-soniconsultancyservices/introductory'
export const EMAIL = 'het.soni@soniconsultancyservices.com'
export const PHONE_DISPLAY = '+91 8160682185'
export const WHATSAPP = 'https://wa.me/918160682185'
export const LEAD_ENDPOINT = 'https://9cjt6qwy71.execute-api.ap-south-1.amazonaws.com'

export const SOCIALS = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hetsoni/' },
  { label: 'Instagram', href: 'https://www.instagram.com/soni.consultancyservices/' },
  { label: 'Facebook', href: 'https://www.facebook.com/soniconsultancyservices' },
  { label: 'Medium', href: 'https://medium.com/@hetsoni9398' },
] as const

export const BRAND = {
  name: 'Soni Consultancy Services',
  short: 'SCS',
  founder: 'Het Soni',
  founderRole: 'Founder & Lead Engineer',
  tagline:
    'React Native & MERN-stack mobile app development with AI built in. Live on the App Store & Google Play.',
  strap: 'React Native · MERN · AI',
  copyright: '© 2026 Soni Consultancy Services. All rights reserved.',
}

export const NAV = [
  { label: 'Services', href: '/services/' },
  { label: 'Work', href: '/work/' },
  { label: 'Blog', href: '/blog/' },
  { label: 'AI Apps', href: '/ai-app-development/' },
  { label: 'DevOps & Cloud', href: '/devops-cloud-engineering/' },
  { label: 'About', href: '/about/' },
  { label: 'Contact', href: '/contact/' },
] as const

export const NAV_CTA = { label: 'Book a Call', mobileLabel: 'Book a Free Call →', href: CALENDLY }

// Pages that exist on the live site but are not rebuilt here link out to it.
export const live = (path: string) => `${LIVE}${path}`

export const FOOTER = [
  {
    title: 'Explore',
    links: [
      { label: 'Services', href: '/services/' },
      { label: 'React Native', href: '/react-native-app-development/' },
      { label: 'MVP Development', href: '/mvp-development/' },
      { label: 'Work', href: '/work/' },
      { label: 'Blog', href: '/blog/' },
      { label: 'AI Apps', href: '/ai-app-development/' },
      { label: 'DevOps & Cloud', href: '/devops-cloud-engineering/' },
      { label: 'About', href: '/about/' },
      { label: 'WordPress Websites', href: live('/wordpress-website-development-india/') },
    ],
  },
  {
    title: 'Industries',
    links: [
      { label: 'FinTech', href: '/fintech-app-development/' },
      { label: 'Retail', href: '/retail-app-development/' },
      { label: 'Ride-Hailing', href: '/ride-hailing-app-development/' },
      { label: 'HR & Payroll', href: '/hr-payroll-app-development/' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/hetsoni/' },
      { label: 'Contact', href: '/contact/' },
      { label: 'Privacy', href: live('/privacy/') },
    ],
  },
  {
    title: 'Start',
    links: [
      { label: 'Book a Call', href: CALENDLY },
      { label: 'App cost estimate', href: '/app-cost-calculator/' },
      { label: 'Email us', href: `mailto:${EMAIL}` },
    ],
  },
] as const

export const TECH_MARQUEE = [
  'React Native', 'MERN Stack', 'Next.js', 'Node.js', 'MongoDB', 'AWS', 'Claude AI',
  'GPT', 'Expo', 'TypeScript', 'PostgreSQL', 'App Store', 'Google Play',
]

// Testimonials: shared by Home and Work (verbatim, real, non-fabricated).
export const TESTIMONIALS = {
  goodfirms: {
    rating: '★★★★★ 5.0',
    project:
      'A 5.0-rated engagement for the Sales Automation project — Mobile App Development, on a fixed-price build.',
    name: 'Satyam Rathaur',
    initials: 'SR',
    role: 'Verified client review',
    source: 'GoodFirms',
  },
  quotes: [
    {
      quote:
        '“I\'ve had the pleasure of collaborating with Het. Having strong technical knowledge, particularly in DevOps and Power BI, and always approaching challenges with a solution-oriented mindset.”',
      name: 'Shalin Bhatt',
      initials: 'SB',
      role: 'Business Consultant for Startups & SMBs',
      source: 'LinkedIn',
    },
    {
      quote:
        '“Het is a friendly, positive, responsible person and it was amazing meeting him on my networking sessions about digital marketing.”',
      name: 'Jiri Borc',
      initials: 'JB',
      role: 'Networking & community building',
      source: 'LinkedIn',
    },
  ],
}

export const REGIONS = [
  { flag: '🇬🇧', name: 'United Kingdom', sectors: 'SaaS · FinTech · Healthcare' },
  { flag: '🇺🇸', name: 'United States', sectors: 'SaaS · AI · E-commerce' },
  { flag: '🇦🇪', name: 'UAE', sectors: 'Real Estate · Retail' },
  { flag: '🇮🇳', name: 'India', sectors: 'EdTech · FinTech · SaaS' },
  { flag: '🇨🇦', name: 'Canada', sectors: 'Healthcare · B2B' },
  { flag: '🇦🇺', name: 'Australia', sectors: 'PropTech · Marketplace' },
]

// 4-step process shared verbatim by /react-native-app-development/ and the four industry pages.
export const PROCESS_4 = [
  { n: '01', title: 'Scope call', body: '30 minutes on your goals, users and constraints — with an honest read on feasibility.' },
  { n: '02', title: 'Fixed-price proposal', body: 'Scope, timeline and a fixed price within 48 hours. No vague day-rates.' },
  { n: '03', title: 'Build', body: 'Weekly demo builds you can hold in your hand from the first sprint.' },
  { n: '04', title: 'Launch & support', body: 'Store submission handled, then monitoring and iteration after launch.' },
]
