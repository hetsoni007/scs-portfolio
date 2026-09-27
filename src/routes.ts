import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import Home from './pages/Home'

export type SceneKey =
  | 'home' | 'services' | 'work' | 'case' | 'ai' | 'devops' | 'about' | 'contact'
  | 'industry' | 'hire' | 'mvp' | 'rn' | 'calc' | 'guide' | 'blog' | 'lost'

type Loader = () => Promise<{ default: ComponentType }>
export type PageComponent = (LazyExoticComponent<ComponentType> & { preload?: Loader }) | ComponentType

function page(loader: Loader) {
  const C = lazy(loader) as LazyExoticComponent<ComponentType> & { preload: Loader }
  C.preload = loader
  return C
}

const Industry = page(() => import('./pages/Industry'))

export type RouteDef = { path: string; scene: SceneKey; label: string; Page: PageComponent }

// Every internal link on the site resolves to one of these. Anything else the
// live site has (blog posts, privacy, WordPress, geo pages) links out to it.
export const ROUTES: RouteDef[] = [
  { path: '/', scene: 'home', label: 'index', Page: Home },
  { path: '/services/', scene: 'services', label: 'services', Page: page(() => import('./pages/Services')) },
  { path: '/work/', scene: 'work', label: 'work', Page: page(() => import('./pages/Work')) },
  { path: '/work/:id/', scene: 'case', label: 'case study', Page: page(() => import('./pages/CaseStudy')) },
  { path: '/ai-app-development/', scene: 'ai', label: 'ai apps', Page: page(() => import('./pages/AI')) },
  { path: '/devops-cloud-engineering/', scene: 'devops', label: 'devops & cloud', Page: page(() => import('./pages/DevOps')) },
  { path: '/about/', scene: 'about', label: 'about', Page: page(() => import('./pages/About')) },
  { path: '/contact/', scene: 'contact', label: 'contact', Page: page(() => import('./pages/Contact')) },
  { path: '/fintech-app-development/', scene: 'industry', label: 'fintech', Page: Industry },
  { path: '/retail-app-development/', scene: 'industry', label: 'retail', Page: Industry },
  { path: '/ride-hailing-app-development/', scene: 'industry', label: 'ride-hailing', Page: Industry },
  { path: '/hr-payroll-app-development/', scene: 'industry', label: 'hr & payroll', Page: Industry },
  { path: '/hire/', scene: 'hire', label: 'hire', Page: page(() => import('./pages/Hire')) },
  { path: '/mvp-development/', scene: 'mvp', label: 'mvp', Page: page(() => import('./pages/MVP')) },
  { path: '/react-native-app-development/', scene: 'rn', label: 'react native', Page: page(() => import('./pages/ReactNative')) },
  { path: '/app-cost-calculator/', scene: 'calc', label: 'cost calculator', Page: page(() => import('./pages/Calculator')) },
  { path: '/app-scoping-guide/', scene: 'guide', label: 'scoping guide', Page: page(() => import('./pages/Guide')) },
  { path: '/blog/', scene: 'blog', label: 'blog', Page: page(() => import('./pages/Blog')) },
]

export const NotFound = page(() => import('./pages/NotFound'))

const norm = (p: string) => (p.endsWith('/') ? p : p + '/')

export function matchRoute(pathname: string): RouteDef | null {
  const p = norm(pathname)
  for (const r of ROUTES) {
    if (r.path === p) return r
    if (r.path.includes(':')) {
      const re = new RegExp('^' + r.path.replace(/:[^/]+/g, '[^/]+') + '$')
      if (re.test(p)) return r
    }
  }
  return null
}

export const sceneFor = (pathname: string): SceneKey => matchRoute(pathname)?.scene ?? 'lost'
export const labelFor = (pathname: string) => matchRoute(pathname)?.label ?? 'not found'

export function preloadRoute(pathname: string) {
  const r = matchRoute(pathname)
  const P = (r?.Page ?? NotFound) as { preload?: Loader }
  return P.preload?.()
}
