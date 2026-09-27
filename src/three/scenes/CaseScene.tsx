// Case study: the phone returns carrying this product's real screens, and steps
// through them as you scroll. Products without screens get an abstract plate
// monolith instead. Never an invented UI.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { caseById } from '../../content/work'
import { TIER } from '../../lib/quality'
import { ch, useStore } from '../../state/store'
import { compileLines, compileUniforms, damp, edgesOf, withCompile } from '../compile'
import { usePalette } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { Phone, PHONE, type PhoneHandle } from '../parts/Phone'
import { plateTexture } from '../parts/plate'
import { screenTexture } from '../parts/screens'
import { activeAnchor, lookInput } from '../rig'
import { useCameraReset, useIntro } from '../useAnchor'

const POSE: Record<string, { rx: number; ry: number; rz: number; fill: number }> = {
  case: { rx: 0.08, ry: -0.5, rz: 0.05, fill: 0.86 },
  'case-screens': { rx: 0.02, ry: -0.16, rz: 0, fill: 0.9 },
}

function PhoneRig({ screens }: { screens: string[] }) {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const phone = useRef<PhoneHandle>(null)
  const texs = useMemo(() => screens.map((s) => screenTexture(s)), [screens])
  const k = useRef({ x: 1.5, y: 0, s: 1, rx: 0, ry: -1, rz: 0, shown: null as THREE.Texture | null, t: 0, i: 0 })

  useEffect(() => {
    const s = phone.current?.state
    if (!s) return
    if (reduced) return void Object.assign(s, { progress: 1, power: 1 })
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 2200)
      s.progress = p * p * (3 - 2 * p)
      s.power = Math.max(0, (p - 0.7) / 0.3)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  useFrame((st, dt) => {
    const P = phone.current
    if (!P) return
    const c = k.current
    const a = activeAnchor(camera, st.clock.elapsedTime)
    const pose = POSE[a?.pose ?? 'case'] ?? POSE.case
    const look = lookInput()
    const L = reduced ? 100 : 3.6
    if (a) {
      c.x = damp(c.x, a.x, L, dt)
      c.y = damp(c.y, a.y, L, dt)
      c.s = damp(c.s, (a.h * pose.fill) / PHONE.H, L, dt)
    }
    const f = reduced ? 0 : 1
    c.rx = damp(c.rx, pose.rx - look.y * 0.18 * f, 2.6, dt)
    c.ry = damp(c.ry, pose.ry + look.x * 0.35 * f, 2.6, dt)
    c.rz = damp(c.rz, pose.rz, 2.6, dt)
    P.group.position.set(c.x, c.y, 0)
    P.group.scale.setScalar(c.s)
    P.group.rotation.set(c.rx, c.ry, c.rz)
    P.state.explode = 0
    P.state.layer = -1

    let i: number
    if (a?.pose === 'case-screens') {
      const own = a.el.dataset.screen
      i = own != null ? Number(own) : ch('case.screen', 0)
    } else {
      // hero: slow cycle through the product's screens
      c.t += dt
      if (c.t > 3.6 && !reduced) {
        c.t = 0
        c.i = (c.i + 1) % texs.length
      }
      i = c.i
    }
    const want = texs[Math.max(0, Math.min(texs.length - 1, i))]
    if (want && want !== c.shown) {
      P.show(want)
      c.shown = want
    }
  })

  return <Phone ref={phone} pal={pal} reduced={reduced} initial={texs[0]} />
}

/** For products without screens: a tall slab carrying the abstract plate. */
function Monolith({ id }: { id: string }) {
  const pal = usePalette()
  const theme = useStore((s) => s.theme)
  const reduced = useStore((s) => s.reduced)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const group = useRef<THREE.Group>(null)
  const c = caseById(id)!
  const [tex, setTex] = useState<THREE.Texture | null>(null)
  const H = 2
  const W = 1.24
  const u = useMemo(() => compileUniforms({ min: -H / 2, max: H / 2, edge: 0.06, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 2.2)
  useEffect(() => {
    let alive = true
    let made: THREE.Texture | null = null
    plateTexture(c, theme).then((t) => {
      if (!alive) return t.dispose()
      made = t
      setTex(t)
    })
    return () => {
      alive = false
      made?.dispose()
    }
  }, [c, theme])
  const parts = useMemo(() => {
    const geo = new RoundedBoxGeometry(W, H, 0.12, 4, 0.04)
    const edges = edgesOf(new THREE.BoxGeometry(W, H, 0.12), 1)
    const body = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.85, roughness: 0.3 }), u)
    const face = withCompile(new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.5, metalness: 0, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.9 }), u)
    const lines = compileLines(u, pal.wire, { additive: pal.additive, residual: 0.2 })
    const faceGeo = new THREE.PlaneGeometry(W - 0.06, H - 0.06)
    return { geo, edges, body, face, lines, faceGeo }
  }, [pal, u])
  useEffect(() => {
    parts.face.map = tex
    parts.face.emissiveMap = tex
    parts.face.needsUpdate = true
  }, [parts, tex])
  useEffect(() => () => Object.values(parts).forEach((p) => (p as { dispose: () => void }).dispose()), [parts])
  const k = useRef({ ry: -0.4 })
  useFrame((st, dt) => {
    const g = group.current
    if (!g) return
    const a = activeAnchor(camera, st.clock.elapsedTime)
    if (a) {
      const L = reduced ? 100 : 3.6
      g.position.x = damp(g.position.x, a.x, L, dt)
      g.position.y = damp(g.position.y, a.y, L, dt)
      g.scale.setScalar(damp(g.scale.x, (a.h * 0.84) / H, L, dt))
    }
    const look = lookInput()
    k.current.ry = damp(k.current.ry, -0.42 + (reduced ? 0 : look.x * 0.3 + Math.sin(st.clock.elapsedTime * 0.4) * 0.05), 2.4, dt)
    g.rotation.set(0.06 - (reduced ? 0 : look.y * 0.12), k.current.ry, 0.03)
  })
  return (
    <group ref={group} position={[1.6, 0, 0]}>
      <mesh geometry={parts.geo} material={parts.body} />
      <mesh geometry={parts.faceGeo} material={parts.face} position={[0, 0, 0.062]} />
      <lineSegments geometry={parts.edges} material={parts.lines} />
    </group>
  )
}

export default function CaseScene() {
  const pal = usePalette()
  const tier = useStore((s) => s.tier)
  // The stage lives outside <Routes>, so read the id from the location (r3f bridges router context).
  const { pathname } = useLocation()
  const id = pathname.match(/\/work\/([^/]+)/)?.[1] ?? ''
  useCameraReset()
  const c = caseById(id)
  const screens = useMemo(() => (c ? c.screens.map((s) => s.src) : []), [c])
  const q = TIER[tier].particles
  return (
    <>
      <DraftingGrid pal={pal} />
      {q > 0 ? <Dust pal={pal} count={Math.round(380 * q)} /> : null}
      {c ? screens.length ? <PhoneRig key={c.id} screens={screens} /> : <Monolith key={c.id} id={c.id} /> : null}
    </>
  )
}
