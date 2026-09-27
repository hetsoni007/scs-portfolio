// One persistent WebGL canvas behind the whole site (DESIGN.md §7). Route scenes
// are lazy chunks mounted inside it, so there is only ever one GL context and a
// page change reads as a rebuild inside a single continuous space.
import { lazy, Suspense, useEffect, useMemo, useRef, type ComponentType, type LazyExoticComponent } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import { BloomEffect, EffectComposer, EffectPass, RenderPass, ToneMappingEffect, ToneMappingMode } from 'postprocessing'
import { gsap } from '../lib/motion'
import { TIER } from '../lib/quality'
import { registerStageTransition } from '../lib/transition'
import { sceneFor, type SceneKey } from '../routes'
import { useStore } from '../state/store'
import { G } from './compile'
import { usePalette } from './palette'
import { SCENE_LOADERS } from './registry'

const lazyScenes = new Map<SceneKey, LazyExoticComponent<ComponentType>>()
const sceneFor_ = (k: SceneKey) => {
  if (!lazyScenes.has(k)) lazyScenes.set(k, lazy(SCENE_LOADERS[k]))
  return lazyScenes.get(k)!
}

/** Procedural studio lighting: emissive "lightformer" panels baked to a PMREM env map. */
function Environment() {
  const { gl, scene } = useThree()
  const pal = usePalette()
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl)
    const env = new THREE.Scene()
    env.background = new THREE.Color(pal.envBg)
    const disposables: { dispose: () => void }[] = []
    const panel = (w: number, h: number, color: string, intensity: number, pos: [number, number, number]) => {
      const geo = new THREE.PlaneGeometry(w, h)
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide })
      const m = new THREE.Mesh(geo, mat)
      m.position.set(...pos)
      m.lookAt(0, 0, 0)
      env.add(m)
      disposables.push(geo, mat)
    }
    panel(7, 4, '#f3ede2', 2.2, [-4.5, 5, 4]) // warm bone key, top left
    panel(0.7, 9, pal.signal, 3.4, [5.2, 0, 1]) // blood rim strip, right
    panel(9, 2.4, pal.wire, 1.1, [0, -5, 2.5]) // ember fill, below
    panel(2.2, 1.2, '#ffffff', 5, [2.5, 3.5, 5.5]) // small hot specular
    panel(14, 14, '#1f1414', 0.9, [0, 0, -9]) // back wall
    const rt = pm.fromScene(env, 0.035)
    scene.environment = rt.texture
    return () => {
      scene.environment = null
      rt.dispose()
      pm.dispose()
      disposables.forEach((d) => d.dispose())
    }
  }, [gl, scene, pal])
  return null
}

function Atmosphere() {
  const scene = useThree((s) => s.scene)
  const pal = usePalette()
  useEffect(() => {
    scene.background = new THREE.Color(pal.bg)
    scene.fog = new THREE.Fog(pal.bg, pal.fog[0], pal.fog[1])
  }, [scene, pal])
  return null
}

/** Bloom on the high tier only (dark theme): makes the scan edge actually glow. */
function Bloom() {
  const { gl, scene, camera, size } = useThree()
  const composer = useMemo(() => {
    const c = new EffectComposer(gl, { frameBufferType: THREE.HalfFloatType })
    c.addPass(new RenderPass(scene, camera))
    c.addPass(
      new EffectPass(
        camera,
        new BloomEffect({ mipmapBlur: true, intensity: 0.9, luminanceThreshold: 0.82, luminanceSmoothing: 0.18, radius: 0.72 }),
        new ToneMappingEffect({ mode: ToneMappingMode.ACES_FILMIC }),
      ),
    )
    return c
  }, [gl, scene, camera])
  useEffect(() => {
    const prev = gl.toneMapping
    gl.toneMapping = THREE.NoToneMapping
    return () => {
      gl.toneMapping = prev
      composer.dispose()
    }
  }, [gl, composer])
  useEffect(() => composer.setSize(size.width, size.height), [composer, size])
  useFrame((_, dt) => composer.render(dt), 1)
  return null
}

/** Frame-time watchdog: steps the tier down if the device can't hold ~40fps. */
function FrameMonitor() {
  const acc = useRef({ t: 0, n: 0, strikes: 0, warm: 0 })
  useFrame((_, dt) => {
    const a = acc.current
    if (document.hidden) return
    a.warm += dt
    if (a.warm < 2.5) return // ignore shader-compile hitches on mount
    a.t += dt
    a.n++
    if (a.n < 90) return
    const avg = a.t / a.n
    a.t = 0
    a.n = 0
    a.strikes = avg > 1 / 40 ? a.strikes + 1 : 0
    if (a.strikes >= 2) {
      a.strikes = 0
      a.warm = 0
      const { tier, setTier } = useStore.getState()
      if (tier === 'high') setTier('medium')
      else if (tier === 'medium') setTier('low')
    }
  })
  return null
}

/** Stop rendering while an opaque section fully covers the viewport. */
function CoverPause() {
  const setFrameloop = useThree((s) => s.setFrameloop)
  useEffect(() => {
    let paused = false
    const check = () => {
      const vh = window.innerHeight
      let covered = false
      for (const el of document.querySelectorAll('[data-cover]')) {
        const r = el.getBoundingClientRect()
        if (r.top <= 0 && r.bottom >= vh) {
          covered = true
          break
        }
      }
      if (covered !== paused) {
        paused = covered
        setFrameloop(covered ? 'never' : 'always')
      }
    }
    gsap.ticker.add(check)
    return () => {
      gsap.ticker.remove(check)
      setFrameloop('always')
    }
  }, [setFrameloop])
  return null
}

/** WebGL half of the route rebuild: decompile to source, then compile the next scene. */
function StageTransitions() {
  useEffect(() => {
    registerStageTransition({
      out: () =>
        new Promise<void>((resolve) => {
          gsap
            .timeline({ onComplete: resolve })
            .to(G.uBuild, { value: 0, duration: 0.45, ease: 'power2.in' }, 0)
            .to(G.uPresence, { value: 0, duration: 0.22, ease: 'power1.in' }, 0.3)
        }),
      in: () =>
        new Promise<void>((resolve) => {
          gsap
            .timeline({ onComplete: resolve })
            .set(G.uBuild, { value: 0 })
            .to(G.uPresence, { value: 1, duration: 0.3 }, 0)
            .to(G.uBuild, { value: 1, duration: 1.2, ease: 'power2.out' }, 0.12)
        }),
    })
    return () => {
      registerStageTransition({ out: undefined, in: undefined })
    }
  }, [])
  return null
}

function Clock() {
  useFrame((s) => {
    G.uTime.value = s.clock.elapsedTime
  })
  return null
}

function SceneSwitch({ k }: { k: SceneKey }) {
  const Scene = sceneFor_(k)
  return <Scene key={k} />
}

export default function Stage() {
  const { pathname } = useLocation()
  const tier = useStore((s) => s.tier)
  const theme = useStore((s) => s.theme)
  const setStageReady = useStore((s) => s.setStageReady)
  const key = sceneFor(pathname)
  const cfg = TIER[tier]
  const root = useMemo(() => document.getElementById('root')!, [])

  useEffect(() => () => setStageReady(false), [setStageReady])

  return (
    <div className="stage" aria-hidden="true">
      <Canvas
        dpr={[1, cfg.dpr]}
        gl={{ antialias: tier !== 'low', powerPreference: 'high-performance', alpha: false, stencil: false }}
        camera={{ fov: 32, near: 0.1, far: 80, position: [0, 0, 7] }}
        eventSource={root}
        eventPrefix="client"
        onCreated={(state) => {
          setStageReady(true)
          // Dev-only handle for automated checks (projecting 3D objects to screen).
          if (import.meta.env.DEV) Object.assign(window, { __r3f: state })
        }}
      >
        <Atmosphere />
        <Environment />
        <Clock />
        <StageTransitions />
        <CoverPause />
        <FrameMonitor />
        <Suspense fallback={null}>
          <SceneSwitch k={key} />
        </Suspense>
        {cfg.bloom && theme === 'dark' ? <Bloom /> : null}
      </Canvas>
    </div>
  )
}
