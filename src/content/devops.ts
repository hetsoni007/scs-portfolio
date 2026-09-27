// /devops-cloud-engineering/ — verbatim.
import { CALENDLY, live } from './site'

export const DEVOPS_PAGE = {
  meta: {
    title: 'DevOps & Cloud Engineering | Soni Consultancy Services',
    description:
      'Managed DevOps & cloud engineering — CI/CD, Kubernetes, Terraform IaC, AWS & Azure migration, observability and SRE.',
  },
  hero: {
    crumb: 'DevOps & Cloud',
    eyebrow: 'DevOps & Cloud · AWS · Azure',
    title: ['Ship faster.', 'Spend less on cloud.'],
    lead:
      'CI/CD pipelines, Kubernetes, Terraform infrastructure-as-code, AWS & Azure migration, and observability — engineered so your team deploys on demand, recovers in minutes, and stops overpaying for idle infrastructure.',
    primary: 'Book a Free Call →',
    secondary: { label: 'See the live dashboard ↓', href: '#obs' },
  },
  credibility: {
    lead: 'Architected by senior engineers',
    items: ['AWS Certified', 'Azure Solutions Architect Expert', 'TOGAF 9', '15+ yrs · fintech · healthcare · enterprise'],
  },
  dashboard: {
    title: 'Operations & delivery health',
    sub: 'DORA metrics · pipeline · uptime — the signals we engineer toward',
    badge: 'Illustrative demo · sample data',
    metrics: [
      { label: 'Deploy frequency', value: '14', unit: ' / day', delta: '▲ on-demand' },
      { label: 'Lead time', value: '42', unit: ' min', delta: '▼ from 6 days' },
      { label: 'Change-fail rate', value: '3.1', unit: ' %', delta: '▼ elite band' },
      { label: 'MTTR', value: '11', unit: ' min', delta: '▼ auto-rollback' },
    ],
    chartTitle: 'Deployments — last 14 days',
    uptimeTitle: 'Uptime · 30 days',
    uptime: '99.98%',
    uptimeBadge: 'SLA met',
    uptimeNote: ['Error budget healthy.', '2 alerts auto-resolved this week.'],
    pipeline: ['Build', 'Test', 'Scan', 'Deploy'],
    services: ['api-gateway', 'auth-service', 'payments', 'worker-queue'],
    disclaimer:
      'Illustrative dashboard with sample data — not live telemetry. It shows the kind of delivery and reliability signals we instrument and optimise for your team.',
  },
  tools: [
    {
      title: 'DevOps maturity assessment',
      body: 'Answer a few quick questions and get your maturity score — Foundational to Elite — with tailored next steps. About two minutes.',
      action: 'Start the assessment →',
      href: live('/devops-maturity-assessment/'),
    },
    {
      title: 'Cloud cost calculator',
      body: 'Estimate how much you could save on AWS/Azure from your current monthly spend. Instant, indicative range — no strings.',
      action: 'Estimate your savings →',
      href: live('/cloud-cost-calculator/'),
    },
  ],
  forYou: {
    eyebrow: 'Is this for you?',
    title: ["You're in the", 'right place if…'],
    items: [
      { title: 'Releases are scary', body: 'Deploys are manual, infrequent and stressful — and a bad one means downtime or a late night.' },
      { title: 'The cloud bill keeps climbing', body: "Your AWS or Azure spend grows faster than usage, and nobody's quite sure where the money goes." },
      { title: "You're outgrowing click-ops", body: "Scaling, on-call and environments are held together by hand and tribal knowledge — and it's starting to crack." },
    ],
  },
  what: {
    eyebrow: 'What we do',
    title: ['From commit to', 'production — automated.'],
    items: [
      { title: 'CI/CD pipelines', body: 'Automated test, security-scan, build and deploy on every commit — with safe rollbacks. Push-button, low-risk releases so you ship daily, not monthly.' },
      { title: 'Cloud migration · AWS & Azure', body: 'Lift-and-shift and re-architecture to AWS or Azure — made highly available, resilient and scalable, with a clear, low-downtime cutover plan.' },
      { title: 'Kubernetes & containers', body: 'Docker and Kubernetes (EKS/AKS) done right — autoscaling, zero-downtime rollouts, health checks and sane resource limits. No 2am pages.' },
      { title: 'Infrastructure as Code', body: 'Your whole stack codified in Terraform (or Bicep/CloudFormation) — versioned, reviewable and reproducible. Spin up identical environments in minutes.' },
      { title: 'Observability & SRE', body: 'Metrics, logs, traces and alerting with Prometheus, Grafana, CloudWatch or Datadog — plus SLOs and error budgets so you catch issues before users do.' },
      { title: 'Mobile CI/CD', body: 'Automated React Native release pipelines — Fastlane & EAS, signed builds, App Store and Play Store submission, and over-the-air updates. Ties into our [React Native development](/react-native-app-development/).' },
    ],
  },
  arch: {
    eyebrow: 'Reference architecture',
    title: ['Tap any layer to', 'see how it fits.'],
    lead: 'A production-grade cloud architecture we build toward. Explore each layer — what it does and why it matters.',
    idleKicker: 'Reference architecture',
    idleTitle: 'Tap any layer above',
    idleBody:
      'Each box is a layer of a resilient, scalable cloud platform. Select one to see what it does and why it earns its place — from the edge all the way down to your data and the pipelines that keep it shipping.',
    nodes: [
      { label: 'Users · Web · Mobile', sub: '', k: 'Clients', t: 'Users & devices', d: 'Web, mobile (React Native) and API clients hit your platform from anywhere. Everything downstream is designed to keep their experience fast and available.' },
      { label: 'CDN · WAF', sub: 'CloudFront / Front Door', k: 'Edge', t: 'Edge, CDN & WAF', d: 'A CDN (CloudFront / Azure Front Door) caches content close to users and a Web Application Firewall blocks malicious traffic before it ever reaches your servers. Faster pages, smaller attack surface.' },
      { label: 'Load balancer · API gateway', sub: '', k: 'Routing', t: 'Load balancing & API gateway', d: 'Traffic is spread across healthy instances and routed by an API gateway. Unhealthy nodes are removed automatically, so a single failure never takes the system down.' },
      { label: 'Kubernetes pods', sub: 'EKS / AKS · autoscaling', k: 'Compute', t: 'Kubernetes app tier', d: 'Your services run as containers on Kubernetes (EKS/AKS). Pods autoscale with demand, roll out with zero downtime, and self-heal when a container dies. You pay for what you actually use.' },
      { label: 'Managed DB', sub: '', k: 'Data', t: 'Managed database', d: 'Managed databases (RDS / Azure SQL / MongoDB Atlas) with automated backups, failover replicas and point-in-time recovery — durability without the babysitting.' },
      { label: 'Cache · Queue', sub: '', k: 'Data', t: 'Cache & queue', d: 'A cache (Redis) absorbs read load and a message queue (Kafka / SQS) decouples services so spikes are smoothed out instead of cascading into outages.' },
      { label: 'CI/CD · Terraform IaC', sub: '', k: 'Delivery', t: 'CI/CD & IaC', d: 'Every commit flows through an automated pipeline (build → test → scan → deploy) and all infrastructure is defined as code in Terraform — so environments are reproducible and releases are boring, in the best way.' },
      { label: 'Observability · SRE', sub: '', k: 'Ops', t: 'Observability', d: 'Metrics, logs and traces feed dashboards and alerts (Prometheus / Grafana / CloudWatch). SLOs and error budgets tell you when to ship and when to slow down.' },
    ],
  },
  midCta: {
    title: 'See where your biggest win is.',
    body: "A free 30-minute call — we'll find the one change that moves the needle most for your stack.",
    primary: 'Book a Free Call →',
  },
  where: {
    eyebrow: 'Where this comes from',
    title: ['Enterprise-grade,', 'not theory.'],
    lead: 'The same patterns we’d bring to your platform — proven on regulated, high-scale systems. A few anonymised examples (client and product names withheld):',
    items: [
      { title: 'FinTech case-management platform', body: 'Microservices architecture with Kafka event streaming and Kubernetes for a financial-crime / AML platform — built for high throughput and auditability.' },
      { title: 'On-prem → AWS migration', body: 'Lift-and-shift and re-architecture of a legacy loyalty platform to AWS, making critical components highly available, resilient and scalable.' },
      { title: 'Multi-cloud integration layer', body: 'A custom integration platform spanning AWS and Azure managed services, containerised with Docker/Kubernetes and provisioned via Terraform.' },
    ],
    note: 'Anonymised summaries of representative work — client and product names withheld. No confidential details or metrics are shown.',
  },
  models: {
    eyebrow: 'Engagement models',
    title: ['Start small.', 'Scale when it pays off.'],
    items: [
      {
        name: 'Cloud Cost Audit',
        price: 'Custom · one-off audit',
        body: 'A fast, fixed-scope review of your AWS/Azure bill and architecture.',
        bullets: ['Spend & waste analysis', 'Right-sizing & savings-plan recommendations', 'Prioritised action plan with $ impact'],
        action: { label: 'Estimate your savings →', href: live('/cloud-cost-calculator/') },
      },
      {
        name: 'DevOps Foundations',
        price: 'Custom · project',
        body: 'Get the core automation in place: pipelines, IaC and observability.',
        bullets: ['CI/CD pipeline setup', 'Terraform infrastructure-as-code', 'Monitoring, logging & alerting', 'Runbooks & handover'],
        action: { label: 'Scope a project →', href: CALENDLY },
      },
      {
        name: 'Managed SRE / Platform',
        price: 'Custom · monthly',
        body: 'We run and continuously improve your platform as an extension of your team.',
        bullets: ['On-going reliability & on-call support', 'Cost optimisation & capacity planning', 'Security patching & upgrades', 'Quarterly architecture reviews'],
        action: { label: 'Talk to us →', href: CALENDLY },
      },
    ],
    note: 'Every engagement is scoped to your stack and goals — we confirm a fixed price after a short discovery call. No obligation.',
  },
  process: {
    eyebrow: 'How we work',
    title: ['Assess. Architect.', 'Automate. Operate.'],
    steps: [
      { n: '01', title: 'Assess', body: 'We map your current stack, pipelines, cloud spend and pain points — and agree the highest-leverage fixes first.' },
      { n: '02', title: 'Architect', body: 'A target architecture and migration/automation plan with clear trade-offs, timelines and a fixed price.' },
      { n: '03', title: 'Automate', body: 'We build the pipelines, codify infrastructure in Terraform and ship in safe, reviewable increments.' },
      { n: '04', title: 'Operate', body: 'Observability, SLOs and optional managed support keep it fast, reliable and cost-efficient as you grow.' },
    ],
  },
  stack: {
    eyebrow: 'Tooling',
    title: 'The stack we work in.',
    items: ['AWS', 'Microsoft Azure', 'Docker', 'Kubernetes', 'Terraform', 'Azure Bicep', 'CloudFormation', 'GitHub Actions', 'GitLab CI', 'Jenkins', 'Argo CD', 'Helm', 'Prometheus', 'Grafana', 'CloudWatch', 'Datadog', 'New Relic', 'Apache Kafka', 'RabbitMQ', 'Redis', 'PostgreSQL', 'MongoDB', 'Fastlane', 'EAS'],
  },
  guides: {
    eyebrow: 'Free guides & tools',
    title: 'Guides for your infrastructure.',
    items: [
      { kicker: 'Migration check', title: 'Is your app on borrowed time?', action: 'Check urgency →', href: live('/blog/react-native-new-architecture-2026') },
      { kicker: 'Guide', title: 'AWS cloud migration, done right', action: 'Read the guide →', href: live('/blog/aws-cloud-migration-guide') },
      { kicker: 'Guide', title: 'CI/CD for React Native apps', action: 'Read the guide →', href: live('/blog/ci-cd-react-native') },
    ],
  },
  faq: {
    eyebrow: 'FAQ',
    title: 'Common questions.',
    items: [
      { q: 'What does a DevOps & cloud engagement include?', a: 'It depends on where you are. Common scope: setting up CI/CD pipelines, containerising apps and moving them to Kubernetes, codifying infrastructure with Terraform, migrating to or optimising AWS/Azure, and adding observability so you catch issues before users do. We scope it on a short call and propose a fixed plan.' },
      { q: 'Do you work with both AWS and Azure?', a: 'Yes. We design and operate on both AWS and Azure (and the surrounding ecosystem — Docker, Kubernetes, Terraform, GitHub Actions, Prometheus, Grafana). We pick the stack that fits your team and workloads, not the one we want to sell.' },
      { q: 'Can you reduce our cloud bill?', a: `Usually, yes. Most teams over-provision compute, leave idle resources running and miss savings plans. A cloud cost audit identifies the waste; right-sizing, autoscaling and IaC guardrails keep it from coming back. Try our [cloud cost calculator](${live('/cloud-cost-calculator/')}) for an indicative estimate.` },
      { q: 'How do you set up CI/CD pipelines?', a: 'We build automated pipelines (GitHub Actions, GitLab CI, Jenkins or Azure DevOps) that test, security-scan, build and deploy on every commit — with safe rollbacks. The goal is push-button, low-risk releases so your team ships daily instead of monthly.' },
      { q: 'Do you support mobile CI/CD for React Native apps?', a: 'Yes — automated React Native release pipelines with Fastlane and EAS, signed builds, App Store and Play Store submission, and over-the-air updates. It ties directly into our [React Native app development](/react-native-app-development/) practice.' },
      { q: 'How quickly can you start?', a: 'Most engagements begin within a week of a scoping call. A focused cloud cost audit or CI/CD setup can show results in the first couple of weeks.' },
    ],
  },
  cta: {
    title: 'Deploy with confidence.',
    lead: 'A 30-minute call to find your highest-leverage win — then a fixed-price plan within 48 hours. NDA on request.',
    primary: 'Book a Free Call →',
    secondary: { label: 'Estimate cloud savings', href: live('/cloud-cost-calculator/') },
  },
}
