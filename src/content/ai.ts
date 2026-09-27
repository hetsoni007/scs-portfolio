// /ai-app-development/ — verbatim.
import { live } from './site'

export const AI_PAGE = {
  meta: {
    title: 'AI App Development | Soni Consultancy Services',
    description:
      'Build AI-powered mobile apps — Claude & GPT integration, assistants, RAG and prediction in React Native. 12 AI app ideas and how we ship them.',
  },
  hero: {
    eyebrow: 'AI App Development',
    title: ['Build an app that', 'thinks.'],
    lead:
      "AI is no longer a feature you bolt on — it's the reason users pick one app over another. We build React Native apps with Claude & GPT inside, from smart assistants to prediction engines. Here are the ideas, and how we ship them.",
    primary: 'Discuss Your AI App',
    secondary: { label: 'See 12 AI app ideas ↓', href: '#ideas' },
  },
  why: [
    { value: '3×', label: 'Higher engagement when AI removes a manual step users hate' },
    { value: '6wk', label: "From idea to a working AI feature in users' hands" },
    { value: '∞', label: 'Models improve over time — your app gets smarter without a rebuild' },
  ],
  ideas: {
    eyebrow: 'Ideas worth building',
    title: ['12 AI app ideas', 'that actually convert.'],
    lead: 'Not "AI for AI\'s sake" — each of these solves a real, billable problem. Pick one, or bring your own and we\'ll scope it.',
    items: [
      { title: 'AI Support Assistant', body: 'A 24/7 in-app assistant that answers from your own docs (RAG), deflects tickets and hands off to a human when it matters.', tag: 'Claude · RAG · Chat' },
      { title: 'Predictive Pricing', body: "AI fare / price prediction based on demand, time and traffic — like we've built for ride-hailing clients. Transparent pricing users trust.", tag: 'ML · Forecasting' },
      { title: 'Smart Matching Engine', body: 'Pair people, jobs, venues or products by intent — not keywords. Embeddings + ranking that gets better as data grows.', tag: 'Embeddings · Vector DB' },
      { title: 'Document & Receipt Scanner', body: 'Snap a photo → AI extracts, classifies and files it. Invoices, IDs, receipts, forms — OCR plus an LLM that understands context.', tag: 'Vision · OCR · LLM' },
      { title: 'AI Voice Assistant', body: 'Hands-free, natural-language control of your app. Speech-to-text, intent, and an LLM that actually does the task.', tag: 'Voice · STT · Agents' },
      { title: 'AI Health & Fitness Coach', body: 'Personalised plans, form feedback and check-ins that adapt to the user — coaching that feels one-to-one at scale.', tag: 'Personalisation' },
      { title: 'AI Content Generator', body: 'Captions, listings, replies, summaries — on-brand content generated in-app so users ship faster and stay longer.', tag: 'GPT · Claude' },
      { title: 'AI Analytics & Insights', body: 'Turn raw data into plain-English insights and next actions — a "talk to your data" layer on dashboards.', tag: 'RAG · Analytics' },
      { title: 'AI Sales Co-pilot', body: 'Lead scoring, follow-up drafting and call summaries inside your CRM app — reps sell, AI handles the admin.', tag: 'Agents · Automation' },
      { title: 'AI Tutor / LMS', body: 'Adaptive lessons, instant Q&A and auto-graded practice — like the gamified LMS we built for a retail platform, with an AI that meets each learner.', tag: 'Education · RAG' },
      { title: 'AI Shopping Concierge', body: 'Natural-language product discovery and recommendations that lift basket size and cut returns.', tag: 'Recommendations' },
      { title: 'AI Moderation & Safety', body: 'Real-time content moderation, fraud signals and SOS triage — keep your community and platform safe at scale.', tag: 'Classification · Trust' },
    ],
  },
  how: {
    eyebrow: 'How we ship AI',
    title: ['From idea to a smart', 'app in four moves.'],
    steps: [
      { n: '01', title: 'Define the win & the eval', body: 'We start from the outcome — the manual step to kill or the metric to move — and write the test cases that prove the AI works before we build it.' },
      { n: '02', title: 'Pick the right model & pattern', body: 'Claude or GPT, RAG vs fine-tune, on-device vs cloud, single call vs agent. We choose for accuracy, latency and cost — not hype.' },
      { n: '03', title: 'Build into React Native + MERN', body: 'The AI ships inside a real product — clean UX, a MERN backend, vector store, caching and guardrails for when the model is wrong.' },
      { n: '04', title: 'Measure, ship, improve', body: 'Instrumented from day one — cost, latency and quality visible. We launch behind a human-in-the-loop, then expand as the data earns trust.' },
    ],
  },
  market: {
    eyebrow: 'Where the market is moving',
    title: ["What everyone's", 'searching for in 2026.'],
    lead: "High-intent demand around React Native & AI — the conversations we're having with founders every week.",
    terms: [
      'AI app development', 'React Native AI integration', 'ChatGPT app development', 'Claude API integration',
      'build an AI app', 'AI chatbot for business', 'LLM app development', 'AI agent development',
      'on-device AI mobile', 'cross-platform app development', 'hire React Native developers', 'AI SaaS development',
      'RAG application development', 'AI MVP development', 'React Native vs Flutter',
    ],
  },
  cta: {
    title: ['Got an AI idea?', "Let's see if it's worth building."],
    lead: "30 minutes with a senior engineer who ships AI for a living. We'll tell you honestly whether AI is the right call — and what it takes.",
    primary: 'Book Your Free AI Call →',
    secondary: { label: "See AI we've shipped", href: '/work/' },
  },
  guides: {
    eyebrow: 'Free guides & tools',
    title: 'Scope it before you build it.',
    items: [
      { kicker: 'Scope tool', title: 'Can AI build your app?', action: 'Find out →', href: live('/blog/can-ai-build-my-app') },
      { kicker: 'Stack picker', title: 'Which stack fits your MVP', action: 'Get a recommendation →', href: live('/blog/mvp-tech-stack-2026') },
      { kicker: 'Self-audit', title: 'Is your app DPDP-ready?', action: 'Score your readiness →', href: live('/blog/dpdp-act-app-compliance-india') },
    ],
  },
  faq: {
    title: 'About building AI in.',
    items: [
      { q: 'What kind of AI features do you build into apps?', a: 'Practical, revenue-relevant features — AI support assistants (RAG), predictive pricing, smart matching engines, document/receipt scanning, voice assistants, content generation, analytics copilots, sales copilots, AI tutors, shopping concierges, and moderation/safety. See the 12 ideas above.' },
      { q: 'Do you use Claude or GPT?', a: 'Both — we choose the model and pattern (RAG vs fine-tune, on-device vs cloud, single call vs agent) based on accuracy, latency and cost for your use case, not hype.' },
      { q: 'How long does it take to ship an AI feature?', a: "Typically around 6 weeks from idea to a working AI feature in users' hands." },
      { q: 'Is the AI feature built into my React Native app, or is it a separate product?', a: 'It ships inside your real product — React Native front end, MERN backend, vector store, caching and guardrails for when the model gets it wrong.' },
      { q: 'How do you make sure the AI actually works before launch?', a: 'We define the outcome and write eval/test cases before building, then launch behind a human-in-the-loop and expand automation as the data earns trust.' },
    ],
  },
}
