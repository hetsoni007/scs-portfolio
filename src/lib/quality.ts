import type { Tier } from '../state/store'

/**
 * Pick a starting quality tier (DESIGN.md §7). The stage's frame-time monitor can
 * step it down later. `?tier=high|medium|low|off` overrides it for testing.
 */
export function detectTier(): Tier {
  const forced = new URLSearchParams(location.search).get('tier')
  if (forced === 'high' || forced === 'medium' || forced === 'low' || forced === 'off') return forced

  const canvas = document.createElement('canvas')
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null
  let caveat = false
  try {
    gl = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
    if (!gl) {
      caveat = true
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    }
  } catch {
    gl = null
  }
  if (!gl) return 'off'

  let renderer = ''
  const dbg = gl.getExtension('WEBGL_debug_renderer_info')
  if (dbg) renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || '')
  gl.getExtension('WEBGL_lose_context')?.loseContext()

  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } }
  const software = caveat || /swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)
  const memory = nav.deviceMemory ?? 8
  const cores = nav.hardwareConcurrency ?? 4
  if (software || nav.connection?.saveData || memory <= 2 || cores <= 2) return 'low'

  const coarse = matchMedia('(pointer: coarse)').matches
  if (coarse || window.innerWidth < 900) return 'medium'
  return cores >= 4 ? 'high' : 'medium'
}

export const TIER = {
  high: { dpr: 1.75, particles: 1, bloom: true },
  medium: { dpr: 1.5, particles: 0.5, bloom: false },
  low: { dpr: 1, particles: 0.2, bloom: false },
  off: { dpr: 1, particles: 0, bloom: false },
} as const
