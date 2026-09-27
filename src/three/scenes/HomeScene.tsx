// Home: the phone rig compiles on arrival, cycles the four live apps on its
// screen, explodes into Interface / Logic / Intelligence over the services,
// reassembles for the work reel, then faces you for the call to action.
// Where it sits on screen comes from [data-anchor] elements in the page layout.
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { HOME } from '../../content/home'
import { BRAND } from '../../content/site'
import { HOME_WORK } from '../../content/work'
import { gsap } from '../../lib/motion'
import { ch, useStore } from '../../state/store'
import { damp } from '../compile'
import { usePalette } from '../palette'
import { Dust, DraftingGrid, Modules } from '../parts/Backdrop'
import { Phone, PHONE, type PhoneHandle } from '../parts/Phone'
import { brandScreen, screenTexture } from '../parts/screens'
import { activeAnchor, lookInput } from '../rig'
import { TIER } from '../../lib/quality'

type Pose = { rx: number; ry: number; rz: number; fill: number; explode: number; screen: 'cycle' | 'work' | 'cta' | 'hold'; follow: number; modules: number; layers?: boolean }

const POSES: Record<string, Pose> = {
  hero: { rx: 0.1, ry: -0.46, rz: 0.05, fill: 0.84, explode: 0, screen: 'cycle', follow: 1, modules: 1 },
  proof: { rx: 0.06, ry: 1.02, rz: -0.1, fill: 0.78, explode: 0, screen: 'hold', follow: 0.4, modules: 0 },
  layers: { rx: 0.3, ry: -1.02, rz: 0.12, fill: 0.56, explode: 1, screen: 'hold', follow: 0.3, modules: 0, layers: true },
  work: { rx: 0.03, ry: -0.2, rz: 0, fill: 0.9, explode: 0, screen: 'work', follow: 0.55, modules: 0 },
  flat: { rx: -1.08, ry: 0.42, rz: 0.2, fill: 2.1, explode: 0, screen: 'hold', follow: 0.25, modules: 0 },
  cta: { rx: 0.05, ry: 0.32, rz: -0.04, fill: 0.88, explode: 0, screen: 'cta', follow: 0.8, modules: 0.35 },
}

export default function HomeScene() {
  const pal = usePalette()
  const theme = useStore((s) => s.theme)
  const reduced = useStore((s) => s.reduced)
  const tier = useStore((s) => s.tier)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const phone = useRef<PhoneHandle>(null)
  const spread = useMemo(() => ({ value: 0 }), [])
  const apps = useMemo(() => HOME_WORK.map((w) => screenTexture(w.screen ?? w.src)), [])
  const [cta, setCta] = useState<THREE.Texture | null>(null)
  const k = useRef({ x: 1.6, y: -0.3, s: 1, rx: 0, ry: -0.9, rz: 0, cx: 0, cy: 0, cycleT: 0, cycleI: 0, shown: null as THREE.Texture | null, spread: 0 })

  useLayoutEffect(() => {
    camera.position.set(0, 0, 7)
    camera.rotation.set(0, 0, 0)
    camera.fov = 32
    camera.updateProjectionMatrix()
  }, [camera])

  useEffect(() => {
    let alive = true
    let made: THREE.Texture | null = null
    brandScreen({ kicker: BRAND.name, title: HOME.cta.title, action: HOME.cta.primary, theme }).then((t) => {
      if (!alive) return t.dispose()
      made = t
      setCta(t)
    })
    return () => {
      alive = false
      made?.dispose()
    }
  }, [theme])

  // Intro compile: runs as soon as the boot loader hands over.
  useEffect(() => {
    const s = phone.current?.state
    if (!s) return
    if (reduced) {
      Object.assign(s, { progress: 1, power: 1 })
      return
    }
    let tl: gsap.core.Timeline | null = null
    const run = () => {
      tl = gsap
        .timeline()
        .fromTo(s, { progress: 0 }, { progress: 1, duration: 2.6, ease: 'power2.inOut' })
        .to(s, { power: 1, duration: 0.8 }, '-=0.5')
    }
    if (useStore.getState().booted) run()
    const unsub = useStore.subscribe((st, prev) => {
      if (st.booted && !prev.booted) run()
    })
    return () => {
      unsub()
      tl?.kill()
    }
  }, [reduced])

  useFrame((st, dt) => {
    const P = phone.current
    if (!P) return
    const c = k.current
    const now = st.clock.elapsedTime
    const look = lookInput()
    const L = reduced ? 30 : 3.4

    // subtle camera parallax (the anchors compensate, so only the backdrop shifts)
    c.cx = damp(c.cx, reduced ? 0 : look.x * 0.18, 2, dt)
    c.cy = damp(c.cy, reduced ? 0 : look.y * 0.12, 2, dt)
    camera.position.x = c.cx
    camera.position.y = c.cy

    const a = activeAnchor(camera, now)
    const pose = POSES[a?.pose ?? 'hero'] ?? POSES.hero
    if (a) {
      const ts = (a.h * pose.fill) / PHONE.H
      c.x = damp(c.x, a.x, L, dt)
      c.y = damp(c.y, a.y, L, dt)
      c.s = damp(c.s, ts, L, dt)
    }
    const f = reduced ? 0 : pose.follow
    c.rx = damp(c.rx, pose.rx - look.y * 0.2 * f, 2.6, dt)
    c.ry = damp(c.ry, pose.ry + look.x * 0.42 * f + (reduced ? 0 : Math.sin(now * 0.35) * 0.06 * f), 2.6, dt)
    c.rz = damp(c.rz, pose.rz, 2.6, dt)
    c.spread = damp(c.spread, reduced ? 0 : pose.modules * P.state.progress, 2.2, dt)
    spread.value = c.spread

    P.group.position.set(c.x, c.y + (reduced ? 0 : Math.sin(now * 0.9) * 0.018 * c.s), 0)
    P.group.scale.setScalar(c.s)
    P.group.rotation.set(c.rx, c.ry, c.rz)
    P.state.explode = pose.explode
    // Desktop pins one anchor and scroll picks the layer/app; mobile gives each item its own anchor.
    const own = (k: 'layer' | 'work') => (a?.el.dataset[k] != null ? Number(a.el.dataset[k]) : null)
    P.state.layer = pose.layers ? (own('layer') ?? ch('home.layer', 0)) : -1

    // what's on the screen
    let want: THREE.Texture | null = c.shown
    if (pose.screen === 'cycle') {
      c.cycleT += dt
      if (c.cycleT > 3.4 && !reduced) {
        c.cycleT = 0
        c.cycleI = (c.cycleI + 1) % apps.length
      }
      want = apps[c.cycleI]
      if (ch('home.screen', -1) !== c.cycleI) useStore.getState().setCh('home.screen', c.cycleI)
    } else if (pose.screen === 'work') {
      const i = Math.max(0, Math.min(apps.length - 1, own('work') ?? ch('home.work', 0)))
      want = apps[i]
      c.cycleI = i
    } else if (pose.screen === 'cta' && cta) want = cta
    if (!want) want = apps[0]
    if (want !== c.shown) {
      P.show(want)
      c.shown = want
    }
  })

  const q = TIER[tier].particles
  return (
    <>
      <DraftingGrid pal={pal} />
      {q > 0 ? <Dust pal={pal} count={Math.round(460 * q)} /> : null}
      <group>
        <Phone ref={phone} pal={pal} reduced={reduced} initial={apps[0]} />
      </group>
      <ModulesFollow spread={spread} phone={phone} pal={pal} count={Math.round(24 * Math.max(0.5, q))} />
    </>
  )
}

/** The orbiting modules track the phone's position and scale, not its rotation. */
function ModulesFollow({ spread, phone, pal, count }: { spread: { value: number }; phone: RefObject<PhoneHandle | null>; pal: ReturnType<typeof usePalette>; count: number }) {
  const g = useRef<THREE.Group>(null)
  useFrame(() => {
    const P = phone.current
    if (!P || !g.current) return
    g.current.position.copy(P.group.position)
    g.current.scale.copy(P.group.scale)
  })
  return (
    <group ref={g}>
      <Modules pal={pal} count={count} spread={spread} />
    </group>
  )
}
