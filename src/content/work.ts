// /work/ content, verbatim. Product names are withheld under client NDAs.
// Hard rules: no real names, no App Store / Play Store links, concepts stay labelled as concepts.

export type Screen = { src: string; alt: string; caption?: string }
export type Metric = { value: string; label: string }

export type CaseStudy = {
  id: string
  label: string // short label used in lists / reels
  title: string
  eyebrow: string
  summary: string
  kind: 'shipped' | 'platform' | 'concept'
  problem?: string
  solution?: string
  result?: string
  // concepts use named pillars instead of problem/solution/result
  pillars?: { title: string; body: string }[]
  research?: string
  metrics: Metric[]
  chips: string[]
  status?: string // non-linking status badge
  screens: Screen[]
  cover?: string // screen used for the 3D plate if not the first
  gallery?: { title: string; items: Screen[] }
  tile?: { title: string; sub: string } // abstract plate for products without screens
  flow?: { tabs: { label: string; steps: string[] }[]; title: string }
  weeks?: number
  tint: string // accent used for the 3D plate / glow, sampled from the product's own UI
}

export const WORK_HERO = {
  eyebrow: 'Selected work',
  title: ['Apps we\'ve shipped,', 'live on the stores.'],
  lead:
    'Four cross-platform products in React Native & MERN — from HR and retail to ride-hailing and creator platforms. Each one is live, in users\' hands, with results to show for it. Product names are withheld under client NDAs; every metric below is real.',
}

export const WORK_STATS: Metric[] = [
  { value: '4', label: 'Apps shipped' },
  { value: '8', label: 'Store listings (iOS+Android)' },
  { value: '97wk', label: 'Combined build time' },
  { value: '100%', label: 'React Native + MERN' },
]

const S = (f: string) => `/screens/${f}.webp`

export const CASES: CaseStudy[] = [
  {
    id: 'hr-payroll',
    label: 'HR & Payroll',
    title: 'HR & Payroll Platform',
    eyebrow: 'HR & Payroll · 16 weeks · Name withheld (NDA)',
    summary:
      'Attendance & salary ledger system — real-time attendance, automated payroll and centralised records across Company, Branch and Staff roles.',
    kind: 'shipped',
    problem: 'Manual spreadsheets caused 15–20% payroll errors, delayed slips and zero branch-level visibility.',
    solution:
      'Biometric & GPS attendance, customizable payroll rules per branch, real-time irregularity alerts, detailed salary breakdowns.',
    result: '40% less payroll processing time and accurate, transparent pay every cycle.',
    metrics: [
      { value: '40%', label: 'Faster payroll' },
      { value: '3', label: 'User roles' },
      { value: '2', label: 'Stores live' },
    ],
    chips: ['React Native', 'React', 'Node.js', 'MongoDB'],
    status: 'Live on the App Store & Google Play',
    screens: [
      { src: S('hr-payroll-sim-register'), alt: 'HR platform business registration screen' },
      { src: S('hr-payroll-sim-punch'), alt: 'HR platform punch in and out with live hour tracker' },
      { src: S('hr-payroll-sim-ledger'), alt: 'HR platform salary ledger with income breakdown' },
      { src: S('hr-payroll-sim-profile'), alt: 'HR platform staff profile update screen' },
    ],
    weeks: 16,
    tint: '#4C6FFF',
  },
  {
    id: 'creator-marketplace',
    label: 'Creator Marketplace',
    title: 'Creator–Venue Marketplace',
    eyebrow: 'Creator Marketplace · 24 weeks · Name withheld (NDA)',
    summary:
      'An influencer-to-venue collaboration platform — slot booking, in-app content sharing, chat and a points & rewards engine that keeps both sides engaged.',
    kind: 'shipped',
    problem: 'Influencer–venue deals were fragmented: no clean way to book slots, communicate, or reward engagement.',
    solution:
      'Dynamic real-time slot booking, content upload with status sharing, automated chat templates and a loyalty points system.',
    result: 'A 35% lift in downloads and a 20% rise in venue bookings driven by authentic creator content.',
    metrics: [
      { value: '+35%', label: 'Downloads' },
      { value: '+20%', label: 'Bookings' },
      { value: '4.x', label: 'App Store' },
    ],
    chips: ['React Native', 'Chat', 'Rewards', 'Maps'],
    status: 'Live on the App Store',
    screens: [
      { src: S('creator-marketplace-3'), alt: 'Creator marketplace venue discovery' },
      { src: S('creator-marketplace-1'), alt: 'Creator marketplace app home' },
    ],
    gallery: {
      title: 'Creator–Venue Marketplace · more screens',
      items: [
        { src: S('creator-marketplace-g1'), alt: 'Creator marketplace venue detail and service selection', caption: 'Service & combos' },
        { src: S('creator-marketplace-g2'), alt: 'Creator marketplace deals and content brief', caption: 'Deals & content briefs' },
        { src: S('creator-marketplace-g3'), alt: 'Creator marketplace date and slot picker', caption: 'Slot booking' },
        { src: S('creator-marketplace-g4'), alt: 'Creator marketplace bookings and content schedule', caption: 'Bookings & content' },
      ],
    },
    weeks: 24,
    tint: '#FF5A6E',
  },
  {
    id: 'retail-ops',
    label: 'Retail Operations',
    title: 'Retail Operations Platform',
    eyebrow: 'Retail SaaS · 32 weeks · Name withheld (NDA)',
    summary:
      'A retail chain management platform unifying operational checklists, a gamified LMS, issue logs and customer logs — standardising operations across every store.',
    kind: 'shipped',
    problem: 'Inconsistent store operations, unrecorded issues and outdated, inaccessible staff training.',
    solution:
      'Customizable checklists, gamified bite-sized LMS, structured issue logging and an analytics dashboard for head office.',
    result: 'Standardised multi-store operations with real-time visibility and measurably faster staff onboarding.',
    metrics: [
      { value: '4', label: 'Modules unified' },
      { value: '2', label: 'Stores live' },
      { value: 'LMS', label: 'Gamified' },
    ],
    chips: ['React Native', 'React', 'Node.js', 'MongoDB'],
    status: 'Live on the App Store & Google Play',
    screens: [
      { src: S('retail-ops-sim-menu'), alt: 'Retail platform store menu with checklists, trainings, logs and reports' },
      { src: S('retail-ops-sim-checklist'), alt: 'Retail platform checklist module' },
      { src: S('retail-ops-sim-training'), alt: 'Retail platform LMS training module' },
      { src: S('retail-ops-sim-submission'), alt: 'Retail platform checklist submission report' },
    ],
    weeks: 32,
    tint: '#FF7A3D',
  },
  {
    id: 'ride-hailing',
    label: 'Ride-Hailing',
    title: 'Ride-Hailing Platform',
    eyebrow: 'Ride-Hailing · AI · 25 weeks · Name withheld (NDA)',
    summary:
      'A cab-booking platform built around rider trust — transparent pricing, real-time tracking, safety features and AI-based fare prediction.',
    kind: 'shipped',
    problem: 'Driver cancellations, opaque surge pricing and clunky interfaces eroded rider trust.',
    solution:
      'AI fare prediction for transparent pricing, driver-rating assurance, ride scheduling, an SOS feature and an eco-friendly vehicle option.',
    result: 'Average booking time down to ~3 minutes with safety-first UX riders actually trust.',
    metrics: [
      { value: '3min', label: 'Avg. booking' },
      { value: 'AI', label: 'Fare prediction' },
      { value: 'SOS', label: 'Safety built-in' },
    ],
    chips: ['React Native', 'Next.js', 'PostgreSQL', 'AWS'],
    status: 'Live on the App Store & Google Play',
    cover: S('ride-hailing-sim-map'),
    screens: [
      { src: S('ride-hailing-sim-bookings'), alt: 'Ride-hailing driver app bookings list' },
      { src: S('ride-hailing-sim-driver'), alt: 'Ride-hailing driver profile details form' },
      { src: S('ride-hailing-sim-map'), alt: 'Ride-hailing live ride tracking with fare' },
      { src: S('ride-hailing-sim-nav'), alt: 'Ride-hailing turn by turn navigation screen' },
    ],
    weeks: 25,
    tint: '#35D07F',
  },
  {
    id: 'b2b-wholesale',
    label: 'B2B Wholesale',
    title: 'B2B Wholesale Platform',
    eyebrow: 'B2B Retail · Loyalty Platform · Name withheld (NDA)',
    summary:
      'A B2B wholesale ordering platform for retailers, with a points-based loyalty engine, tiered pricing catalogue and real-time inventory tracking.',
    kind: 'shipped',
    problem:
      'Retailers had no streamlined way to bulk-order, track inventory or earn loyalty rewards — existing systems were outdated and manual.',
    solution:
      'Dynamic points tied to purchasing volume, tiered wholesale pricing, predictive inventory analytics and ERP-synced ordering.',
    result: 'Order placement time cut by 30% and customer retention up 20% post-launch.',
    metrics: [
      { value: '-30%', label: 'Order time' },
      { value: '+20%', label: 'Retention' },
      { value: '60%', label: 'Redeemed in mo. 1' },
    ],
    chips: ['React.js', 'Node.js', 'ERP Integration'],
    status: 'Live on the App Store & Google Play',
    screens: [],
    tile: { title: 'B2B Wholesale', sub: 'Wholesale ordering & loyalty rewards for retailers' },
    tint: '#E8B04A',
  },
  {
    id: 'healthcare-staffing',
    label: 'Healthcare Staffing',
    title: 'Healthcare Staffing Platform',
    eyebrow: 'HealthTech · Platform · 26 weeks · Name withheld (NDA)',
    summary:
      'A digital hiring platform connecting hospitals with nurses for shift-based work — a mobile app for nurses and a web dashboard for hospital staffing teams.',
    kind: 'platform',
    problem:
      'Hospitals fill shifts by phone calls and spreadsheets; nurses struggle to find flexible, transparent-pay shifts that fit their schedule.',
    solution:
      'Real-time shift posting, AI-based nurse matching, a credential vault with auto-verification, and geo-filtered shift search.',
    result: 'Designed to cut average shift-fill time from 4–8 hours to under 30 minutes, based on research across 18 hospitals.',
    metrics: [
      { value: '78%', label: 'Want short-term shifts' },
      { value: '65%', label: 'Still use manual calls' },
      { value: '<30min', label: 'Target fill time' },
    ],
    chips: ['React Native', 'Next.js', 'Express.js', 'PostgreSQL'],
    screens: [],
    tile: { title: 'Healthcare Staffing', sub: 'Shift-based hiring platform connecting hospitals with nurses' },
    flow: {
      title: 'Healthcare Staffing Platform · how it works',
      tabs: [
        {
          label: 'Nurse mobile app',
          steps: [
            'Login & verification',
            'View recommended shifts',
            'Search & filter by distance, pay, facility',
            'Review shift details',
            'Apply → in-progress → confirmation',
            'Credential vault',
            'Payments & earnings',
            'Profile & reliability score',
          ],
        },
        {
          label: 'Hospital web dashboard',
          steps: [
            'Login',
            'Post a shift',
            'View applicants',
            'Review credentials',
            'Confirm nurse',
            'Track live shift status',
            'Rate nurse',
            'Analytics dashboard',
          ],
        },
      ],
    },
    weeks: 26,
    tint: '#5FD4E0',
  },
  {
    id: 'web3-creator',
    label: 'Web3 Creator',
    title: 'Web3 Creator Platform',
    eyebrow: 'Web3 · Social + Wallet + NFT · Name withheld (NDA)',
    summary:
      'A Web3 creator-economy concept — a social network, a multi-chain crypto wallet and an NFT marketplace in one premium dark experience, so creators can publish, mint and get paid inside a single app.',
    kind: 'concept',
    pillars: [
      { title: 'Wallet', body: 'A built-in multi-chain wallet with a native token, deposit/withdraw and balances across BTC, ETH, XRP and more.' },
      { title: 'Market', body: 'An NFT & SNFT marketplace with floor price, volume and offers — collect, buy and sell digital art.' },
      { title: 'Social', body: 'Creator profiles, a fan-following model and a "Social Art" feed where posts can be minted and earned from.' },
    ],
    metrics: [],
    chips: ['UI/UX Design', 'Web3', 'Crypto Wallet', 'NFT Marketplace', 'Mobile-first'],
    status: '✦ Product & UI/UX design concept',
    screens: [],
    tile: { title: 'Web3 Creator', sub: 'Social network + multi-chain wallet + NFT marketplace' },
    tint: '#A98BFF',
  },
  {
    id: 'fan-investing',
    label: 'Fan Investment',
    title: 'Fan Investment Platform',
    eyebrow: 'Music FinTech · Social investing · Name withheld (NDA)',
    summary:
      'A concept for a fan-investing app — discover emerging music artists, back them with fractional "shares" tied to their career milestones, and watch a personal portfolio grow inside a social feed of the artists you follow.',
    kind: 'concept',
    pillars: [
      { title: 'Discover', body: 'A home feed of hot new artists and people to follow, each with a live offering open to back.' },
      { title: 'Growth Score', body: 'A dynamic metric blending social reach, engagement and revenue — so backers can evaluate an artist before investing.' },
      { title: 'Portfolio', body: 'A wallet that tracks performance over time — total invested, milestone-based returns and each artist\'s share of the portfolio.' },
      { title: 'Artist', body: 'Rich artist profiles with bio, genre, monthly streams and the percentage offering available.' },
    ],
    research:
      'Concept research (82 respondents): 74% wanted a low-barrier way to invest in creative talent; 71% said they\'d trust the platform more with verifiable growth metrics — which shaped the Growth Score above.',
    metrics: [],
    chips: ['UI/UX Design', 'FinTech', 'Social Investing', 'Mobile-first', 'Dark UI'],
    status: '✦ Product & UI/UX design concept',
    screens: [
      { src: S('fan-investing-3'), alt: 'Fan investment platform wallet and portfolio performance screen' },
      { src: S('fan-investing-1'), alt: 'Fan investment platform home feed of new artists' },
    ],
    gallery: {
      title: 'Fan Investment Platform · more screens',
      items: [
        { src: S('fan-investing-2'), alt: 'Fan investment platform artist profile with offering', caption: 'Artist profile & offering' },
        { src: S('fan-investing-4'), alt: 'Fan investment platform list of artists held in portfolio', caption: 'Your artist holdings' },
      ],
    },
    tint: '#FF3D5A',
  },
]

export const caseById = (id: string) => CASES.find((c) => c.id === id)

// Home "Selected work" teasers (bare screens, phone aspect) + their live-site captions.
export const HOME_WORK: { id: string; title: string; line: string; src: string; alt: string; screen?: string }[] = [
  { id: 'hr-payroll', title: 'HR & Payroll', line: 'Attendance & payroll · MERN + RN', src: S('hr-payroll-teaser'), alt: 'HR and attendance app screen' },
  { id: 'creator-marketplace', title: 'Creator Marketplace', line: 'Influencer × venues · +35% installs', src: S('creator-marketplace-1'), alt: 'Creator marketplace app screen' },
  { id: 'retail-ops', title: 'Retail Operations', line: 'Retail chain ops · LMS + analytics', src: S('retail-ops-1'), alt: 'Retail operations app screen' },
  // The 3D phone shows the live-tracking screen (more representative); the DOM thumbnail keeps the live site's teaser.
  { id: 'ride-hailing', title: 'Ride-Hailing', line: 'Ride-hailing · AI fare prediction', src: S('ride-hailing-teaser'), alt: 'Ride-hailing cab booking app screen', screen: S('ride-hailing-sim-map') },
]

export const ENTERPRISE = {
  eyebrow: 'Enterprise & platform engineering',
  title: 'Beyond apps — platforms built to scale.',
  lead:
    'Soni Consultancy Services doesn\'t only ship mobile apps. We architect and deliver enterprise-grade platforms — BSA/AML and fraud-detection systems, sanctions-screening engines, loyalty and rewards platforms, large-scale AWS cloud migrations and HL7 healthcare integrations — built with microservices, event-driven architecture and DevOps for high availability, resilience and scale.',
  groups: [
    {
      title: 'FinTech, Risk & Compliance',
      intro: 'Regulatory-grade software for financial institutions — engineered for accuracy, auditability and scale.',
      items: [
        {
          name: 'BAM+ — AML & Fraud Case Management',
          role: 'Solution Architect & Delivery Lead',
          desc: 'A web-based BSA/AML and enterprise-fraud case management platform that lets financial institutions run every risk workflow from one console, driven by a configurable scenario library for a blended-analytics approach to risk. Coverage spans ACH origination & incoming fraud, check fraud, debit-card fraud, new-account fraud and wire fraud — on a C#/.NET microservices architecture with Apache Kafka event streaming.',
          chips: ['C#', 'ASP.NET Core', 'Microservices', 'Apache Kafka', 'MongoDB', 'Kubernetes', 'Azure', 'AWS', 'GraphQL', 'Terraform'],
        },
        {
          name: 'IQ AutoScan — Sanctions & Watchlist Screening',
          role: 'Solution Architect & Delivery Lead',
          desc: 'A real-time sanctions and watchlist screening solution that screens customers, vendors and counterparties against OFAC, EU/UN/UK and FinCEN lists and other watchlists — helping institutions meet complex AML and KYC compliance obligations. Delivered as event-driven microservices on a containerised, cloud-native stack.',
          chips: ['C#', 'ASP.NET Core', 'Microservices', 'Apache Kafka', 'MongoDB', 'Angular', 'TypeScript', 'Kubernetes', 'Azure', 'AWS'],
        },
      ],
    },
    {
      title: 'Loyalty & Rewards Platforms',
      intro: 'Configurable loyalty engines and financial analytics that power rewards programmes end to end.',
      items: [
        {
          name: 'Loyalty Rule Engine',
          role: 'Architecture & Implementation',
          desc: 'A high-throughput loyalty rule engine letting administrators configure an effectively unlimited set of rules across tiers, actions, rewards, events, benefits and channels — the configurable core of a modern rewards platform. Built with ASP.NET Core microservices, MongoDB and Apache Kafka on Azure.',
          chips: ['ASP.NET Core', 'Microservices', 'MongoDB', 'Apache Kafka', 'Azure', 'Kubernetes', 'Docker'],
        },
        {
          name: 'Loyalty P&L Reporting & Analytics',
          role: 'Architecture & Implementation',
          desc: 'A financial analytics and P&L reporting platform giving stakeholders self-serve access to margins, mark-ups, subscription fees, accruals and redemptions. A serverless data pipeline on AWS — Lambda, SQS, DynamoDB, Redshift and QuickSight — turns raw loyalty events into board-ready reporting.',
          chips: ['Python', '.NET Core', 'AWS Lambda', 'DynamoDB', 'Redshift', 'QuickSight', 'ETL', 'Microservices'],
        },
      ],
    },
    {
      title: 'Cloud Migration & DevOps',
      intro: 'On-premises to cloud — lifted, shifted and re-architected on AWS for resilience and elastic scale.',
      items: [
        {
          name: 'Loyalty Platform — Cloud Migration & Re-Architecture',
          role: 'Solutions Architecture & Migration',
          desc: 'End-to-end AWS cloud migration of a loyalty platform\'s on-premises integration services and APIs, followed by re-architecture of critical components using cloud-native AWS PaaS and proven patterns — delivering a highly available, resilient and horizontally scalable system.',
          chips: ['AWS', 'ASP.NET Core', 'Apache Kafka', 'React Native', 'Kubernetes', 'Docker', 'Microservices'],
        },
        {
          name: 'AWS Lift & Shift and Re-Architecture',
          role: 'Solutions Architecture & Migration',
          desc: 'Migration of on-premises integration services and APIs to AWS using IaaS, then re-architecture of critical components with AWS PaaS and Well-Architected patterns for high availability and elastic scale — infrastructure as code with HashiCorp Terraform across Route 53, CloudFront, WAF/Shield, VPC, EC2, RDS and S3.',
          chips: ['AWS', 'HashiCorp Terraform', 'IaC', 'CloudFront', 'WAF', 'VPC', 'EC2', 'RDS'],
        },
      ],
    },
    {
      title: 'Enterprise Integration & Identity',
      intro: 'EAI, API platforms and single sign-on that connect systems, partners and identities securely.',
      items: [
        {
          name: 'Marketplace Integration Platform',
          role: 'Solution Architect & Delivery Lead',
          desc: 'An enterprise integration platform that synchronises supplier catalogues into a marketplace and integrates order placement back to suppliers in real time. Event-driven microservices spanning AWS (ECS, Lambda, SQS, EventBridge, API Gateway) and Azure (AKS, API Management, Azure SQL), with GraphQL APIs.',
          chips: ['C#', 'ASP.NET Core', 'React', 'Microservices', 'AWS', 'Azure', 'GraphQL', 'Kubernetes'],
        },
        {
          name: 'Custom Integration Platform & Integrations',
          role: 'Architecture Lead',
          desc: 'A custom enterprise application integration (EAI) platform and a broad suite of integrations connecting on-premises and SaaS systems through APIs, messaging and event-driven flows — fronted by a Kong API gateway and built on reusable enterprise-integration patterns across a multi-year .NET estate.',
          chips: ['ASP.NET Core', '.NET', 'Microservices', 'RabbitMQ', 'Kong API Gateway', 'Azure', 'AWS', 'Kubernetes'],
        },
        {
          name: 'Azure AD OneClick SSO',
          role: 'Architecture & Implementation',
          desc: 'A one-click single sign-on (SSO) integration delivering uni-directional federation from Microsoft Azure Active Directory to Cornerstone — configurable in minutes and eliminating separate portal credentials.',
          chips: ['Azure Active Directory', 'SSO', '.NET Core', 'ASP.NET Core', 'MS SQL'],
        },
      ],
    },
    {
      title: 'Healthcare & HealthTech',
      intro: 'Clinical systems with HL7 integration across labs, providers and patient portals.',
      items: [
        {
          name: 'NHSP Hearing Screening System',
          role: 'Architecture & Technical Guidance',
          desc: 'A healthcare platform to manage patients, record newborn hearing-screening tests, generate clinical reports and run analytics — with HL7 integration to connected health systems.',
          chips: ['ASP.NET MVC', 'ASP.NET Web API', 'WCF', 'MS SQL Server', 'HL7'],
        },
        {
          name: 'CareEvolve — Lab Management & Health Data Integration',
          role: 'Architecture & Technical Guidance',
          desc: 'A laboratory management and health-data integration system enabling physicians to order lab tests, trigger alerts, generate reports and run analytics — with HL7 integration to multiple laboratories and a patient portal for results.',
          chips: ['ASP.NET MVC', 'Web Services', 'MS SQL Server', 'HL7', '.NET Framework'],
        },
      ],
    },
  ],
  cta: {
    eyebrow: 'Enterprise engagements',
    title: 'Have a platform to architect or migrate?',
    lead: 'From compliance systems to cloud migrations — let\'s scope the architecture together.',
  },
}

export const WORK_CTA = {
  title: ['Your project could be next', 'on this list.'],
  lead: 'Apps, AI or enterprise platforms — tell us what you\'re building and we\'ll show you how we\'d ship it.',
}

export const WORK_FAQ = {
  title: 'About the work above.',
  items: [
    {
      q: 'What real results have you delivered for clients?',
      a: 'Measured outcomes, not vanity metrics: 40% less payroll processing time for our HR & Payroll platform, a 35% lift in downloads and 20% rise in venue bookings for our Creator–Venue Marketplace, standardised multi-store operations for our Retail Operations platform, and average booking time down to ~3 minutes for our Ride-Hailing platform. Product names are withheld under client NDAs — every metric is real.',
    },
    {
      q: 'Are the Web3 Creator and Fan Investment platforms real, shipped products?',
      a: 'No — they\'re clearly labelled as product & UI/UX design concepts on this page. We don\'t claim results or live status for work that hasn\'t shipped.',
    },
    {
      q: 'What industries have you shipped apps in?',
      a: 'HR & payroll, influencer marketing, retail operations, and ride-hailing, among others — see the case studies above for the problem, approach and result on each.',
    },
    {
      q: 'Can I see case studies for a specific industry, like FinTech or retail?',
      a: 'Yes — check our industry pages for [FinTech](/fintech-app-development/), [Retail](/retail-app-development/), [Ride-Hailing](/ride-hailing-app-development/) and [HR & Payroll](/hr-payroll-app-development/) app development.',
    },
    {
      q: 'Is the Healthcare Staffing Platform live on the App Store or Google Play?',
      a: 'Not yet publicly — it\'s presented as a delivered platform (mobile app + web dashboard), the same way we present our enterprise engagements, without store links or live-status claims.',
    },
    {
      q: 'Why don\'t you name these products?',
      a: 'Client confidentiality agreements. The problems, solutions, metrics, tech stacks and screens shown are all real and unaltered — only the product names are withheld.',
    },
  ],
}
