// Scene code-splitting. Only `import()` calls live here, so this file adds no
// three.js weight to the main bundle; each scene is its own lazy chunk.
import type { ComponentType } from 'react'
import type { SceneKey } from '../routes'
import { useStore } from '../state/store'

type SceneModule = { default: ComponentType }

export const SCENE_LOADERS: Record<SceneKey, () => Promise<SceneModule>> = {
  home: () => import('./scenes/HomeScene'),
  services: () => import('./scenes/ServicesScene'),
  work: () => import('./scenes/WorkScene'),
  case: () => import('./scenes/CaseScene'),
  ai: () => import('./scenes/AIScene'),
  devops: () => import('./scenes/DevOpsScene'),
  about: () => import('./scenes/AboutScene'),
  contact: () => import('./scenes/ContactScene'),
  industry: () => import('./scenes/IndustryScene'),
  hire: () => import('./scenes/HireScene'),
  mvp: () => import('./scenes/MVPScene'),
  rn: () => import('./scenes/RNScene'),
  calc: () => import('./scenes/CalcScene'),
  guide: () => import('./scenes/GuideScene'),
  blog: () => import('./scenes/BlogScene'),
  lost: () => import('./scenes/LostScene'),
}

/** Warm a scene chunk ahead of navigation. Skipped when there is no WebGL stage. */
export function preloadScene(key: SceneKey) {
  if (useStore.getState().tier === 'off') return
  return SCENE_LOADERS[key]()
}
