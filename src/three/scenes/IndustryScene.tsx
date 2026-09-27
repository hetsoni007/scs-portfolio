// Industry template: one scene, four artefacts, plus the phone carrying the
// relevant case study's screens in the proof section.
//   fintech → a live ledger ring      retail → a chain of stores reporting to HQ
//   ride    → a street grid + route   hr     → company → branches → staff, punches flowing up
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useLocation } from 'react-router-dom'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { industryByPath, type Industry } from '../../content/industries'
import { caseById } from '../../content/work'
import { TIER } from '../../lib/quality'
import { useStore } from '../../state/store'
import { compileLines, compileUniforms, damp, G, withCompile, type CompileUniforms } from '../compile'
import { usePalette, type Pal } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { Phone, PHONE, type PhoneHandle } from '../parts/Phone'
import { screenTexture } from '../parts/screens'
import { activeAnchor, lookInput } from '../rig'
import { useAnchorFollow, useCameraReset, useIntro } from '../useAnchor'

const tmpM = new THREE.Matrix4()
const tmpC = new THREE.Color()

function Ledger({ pal, u, reduced }: { pal: Pal; u: CompileUniforms; reduced: boolean }) {
  const bars = useRef<THREE.InstancedMesh>(null)
  const coins = useRef<THREE.Group>(null)
  const N = 36
  const parts = useMemo(() => {
    const geo = new THREE.BoxGeometry(0.055, 1, 0.055).translate(0, 0.5, 0)
    const mat = withCompile(new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.15, roughness: 0.55 }), u)
    const coin = new THREE.CylinderGeometry(0.34, 0.34, 0.06, 48).rotateX(Math.PI / 2)
    const coinMat = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.95, roughness: 0.18 }), u)
    const ringPts: number[] = []
    for (let i = 0; i < 96; i++) {
      const a = (i / 96) * Math.PI * 2
      const b = ((i + 1) / 96) * Math.PI * 2
      ringPts.push(Math.cos(a) * 1.35, 0, Math.sin(a) * 1.35, Math.cos(b) * 1.35, 0, Math.sin(b) * 1.35)
    }
    const ring = new THREE.BufferGeometry()
    ring.setAttribute('position', new THREE.Float32BufferAttribute(ringPts, 3))
    const ringMat = compileLines(u, pal.wire, { additive: pal.additive, residual: 0.5 })
    return { geo, mat, coin, coinMat, ring, ringMat }
  }, [pal, u])
  useEffect(() => () => Object.values(parts).forEach((p) => p.dispose()), [parts])
  useFrame((st) => {
    const t = reduced ? 0 : st.clock.elapsedTime
    const m = bars.current
    if (m) {
      for (let i = 0; i < N; i++) {
        const a = (i / N) * Math.PI * 2
        const h = 0.25 + (Math.sin(i * 0.7 + t * 1.2) * 0.5 + 0.5) * 0.9 + (i % 9 === 0 ? 0.4 : 0)
        tmpM.makeScale(1, h, 1).setPosition(Math.cos(a) * 1.35, -0.7, Math.sin(a) * 1.35)
        m.setMatrixAt(i, tmpM)
        m.setColorAt(i, tmpC.set(h > 1.05 ? pal.signal : pal.wire).multiplyScalar(h > 1.05 ? 1 : 0.55))
      }
      m.instanceMatrix.needsUpdate = true
      if (m.instanceColor) m.instanceColor.needsUpdate = true
    }
    if (coins.current) coins.current.children.forEach((c, i) => ((c.rotation.y = t * (0.6 + i * 0.2)), (c.position.y = 0.3 + i * 0.3 + Math.sin(t + i) * 0.05)))
  })
  return (
    <group rotation={[0.35, 0, 0]}>
      <lineSegments geometry={parts.ring} material={parts.ringMat} position={[0, -0.7, 0]} />
      <instancedMesh ref={bars} args={[parts.geo, parts.mat, N]} />
      <group ref={coins}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} geometry={parts.coin} material={parts.coinMat} position={[0, 0.3 + i * 0.3, 0]} />
        ))}
      </group>
    </group>
  )
}

function Stores({ pal, u, reduced }: { pal: Pal; u: CompileUniforms; reduced: boolean }) {
  const blocks = useRef<THREE.InstancedMesh>(null)
  const cols = 6
  const rows = 4
  const N = cols * rows
  const parts = useMemo(() => {
    const geo = new RoundedBoxGeometry(0.34, 0.22, 0.34, 2, 0.03)
    const mat = withCompile(new THREE.MeshStandardMaterial({ color: '#ffffff', metalness: 0.2, roughness: 0.55 }), u)
    const hq = new RoundedBoxGeometry(0.46, 0.9, 0.46, 2, 0.04)
    const hqMat = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.85, roughness: 0.25, emissive: new THREE.Color(pal.signal), emissiveIntensity: 0.3 }), u)
    const p: number[] = []
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const x = (c - (cols - 1) / 2) * 0.55
        const z = (r - (rows - 1) / 2) * 0.55
        p.push(x, 0.12, z, 0, 0.9, 0)
      }
    const links = new THREE.BufferGeometry()
    links.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
    const linkMat = compileLines(u, pal.wire, { additive: pal.additive, residual: 0.22 })
    return { geo, mat, hq, hqMat, links, linkMat }
  }, [pal, u])
  useEffect(() => () => Object.values(parts).forEach((p) => p.dispose()), [parts])
  useFrame((st) => {
    const m = blocks.current
    if (!m) return
    const t = reduced ? 3 : st.clock.elapsedTime
    // a checklist wave completes store by store
    const done = Math.floor((t * 3) % (N + 8))
    for (let i = 0; i < N; i++) {
      const c = i % cols
      const r = Math.floor(i / cols)
      tmpM.makeTranslation((c - (cols - 1) / 2) * 0.55, 0, (r - (rows - 1) / 2) * 0.55)
      m.setMatrixAt(i, tmpM)
      m.setColorAt(i, tmpC.set(i < done ? pal.signal : pal.wire).multiplyScalar(i < done ? 1 : 0.35))
    }
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })
  return (
    <group rotation={[0.55, -0.5, 0]} position={[0, -0.3, 0]}>
      <instancedMesh ref={blocks} args={[parts.geo, parts.mat, N]} />
      <mesh geometry={parts.hq} material={parts.hqMat} position={[0, 0.45, 0]} />
      <lineSegments geometry={parts.links} material={parts.linkMat} />
    </group>
  )
}

function Route({ pal, u, reduced }: { pal: Pal; u: CompileUniforms; reduced: boolean }) {
  const car = useRef<THREE.Mesh>(null)
  const eta = useRef<THREE.Mesh>(null)
  const parts = useMemo(() => {
    const g: number[] = []
    for (let i = -5; i <= 5; i++) {
      g.push(i * 0.32, 0, -1.6, i * 0.32 + (i % 2) * 0.1, 0, 1.6)
      g.push(-1.6, 0, i * 0.32, 1.6, 0, i * 0.32 + (i % 3) * 0.06)
    }
    const grid = new THREE.BufferGeometry()
    grid.setAttribute('position', new THREE.Float32BufferAttribute(g, 3))
    const gridMat = compileLines(u, pal.wire, { additive: pal.additive, residual: 0.25, opacity: 0.6 })
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.4, 0.02, 1.2),
      new THREE.Vector3(-0.64, 0.02, 0.64),
      new THREE.Vector3(-0.32, 0.02, -0.32),
      new THREE.Vector3(0.64, 0.02, -0.64),
      new THREE.Vector3(1.3, 0.02, -1.3),
    ])
    const tube = new THREE.TubeGeometry(curve, 120, 0.018, 8, false)
    const tubeMat = withCompile(new THREE.MeshStandardMaterial({ color: pal.signal, emissive: new THREE.Color(pal.signal), emissiveIntensity: 1.2 }), u)
    const carGeo = new RoundedBoxGeometry(0.14, 0.08, 0.22, 2, 0.03)
    const carMat = new THREE.MeshStandardMaterial({ color: pal.fg, metalness: 0.4, roughness: 0.3, emissive: new THREE.Color(pal.fg), emissiveIntensity: 0.4 })
    const pin = new THREE.ConeGeometry(0.07, 0.22, 16).rotateX(Math.PI).translate(1.3, 0.14, -1.3)
    const pinMat = withCompile(new THREE.MeshStandardMaterial({ color: pal.signal, emissive: new THREE.Color(pal.signal), emissiveIntensity: 0.8 }), u)
    const etaGeo = new THREE.RingGeometry(0.16, 0.18, 48).rotateX(-Math.PI / 2)
    const etaMat = new THREE.MeshBasicMaterial({ color: pal.signal, transparent: true, depthWrite: false })
    return { grid, gridMat, curve, tube, tubeMat, carGeo, carMat, pin, pinMat, etaGeo, etaMat }
  }, [pal, u])
  useEffect(() => () => Object.values(parts).forEach((p) => (p as { dispose?: () => void }).dispose?.()), [parts])
  const pt = useMemo(() => new THREE.Vector3(), [])
  const tan = useMemo(() => new THREE.Vector3(), [])
  useFrame((st) => {
    const t = reduced ? 0.6 : (st.clock.elapsedTime * 0.12) % 1
    parts.curve.getPointAt(t, pt)
    parts.curve.getTangentAt(t, tan)
    if (car.current) {
      car.current.position.copy(pt).setY(0.06)
      car.current.rotation.y = Math.atan2(tan.x, tan.z)
    }
    if (eta.current) {
      const k = reduced ? 0.5 : (st.clock.elapsedTime * 0.8) % 1
      eta.current.scale.setScalar(1 + k * 2)
      parts.etaMat.opacity = 1 - k
    }
  })
  return (
    <group rotation={[0.62, -0.4, 0]}>
      <lineSegments geometry={parts.grid} material={parts.gridMat} />
      <mesh geometry={parts.tube} material={parts.tubeMat} />
      <mesh ref={car} geometry={parts.carGeo} material={parts.carMat} />
      <mesh geometry={parts.pin} material={parts.pinMat} />
      <mesh ref={eta} geometry={parts.etaGeo} material={parts.etaMat} position={[1.3, 0.01, -1.3]} />
    </group>
  )
}

function Org({ pal, u, reduced }: { pal: Pal; u: CompileUniforms; reduced: boolean }) {
  const pulses = useRef<THREE.ShaderMaterial | null>(null)
  const parts = useMemo(() => {
    const company = new THREE.Vector3(0, 1.1, 0)
    const branches = [-1, 0, 1].map((k) => new THREE.Vector3(k * 1.05, 0.2, 0))
    const staff: THREE.Vector3[] = []
    branches.forEach((b) => [-1, 0, 1].forEach((k) => staff.push(new THREE.Vector3(b.x + k * 0.32, -0.8, (k === 0 ? 0.1 : -0.05)))))
    const l: number[] = []
    branches.forEach((b) => l.push(...company.toArray(), ...b.toArray()))
    staff.forEach((s, i) => l.push(...branches[Math.floor(i / 3)].toArray(), ...s.toArray()))
    const lines = new THREE.BufferGeometry()
    lines.setAttribute('position', new THREE.Float32BufferAttribute(l, 3))
    const lineMat = compileLines(u, pal.wire, { additive: pal.additive, residual: 0.45 })
    const node = new RoundedBoxGeometry(1, 1, 1, 2, 0.12)
    const mat = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.6, roughness: 0.3, emissive: new THREE.Color(pal.wire), emissiveIntensity: 0.45 }), u)
    const hot = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.5, roughness: 0.3, emissive: new THREE.Color(pal.signal), emissiveIntensity: 0.9 }), u)
    // punches: staff → branch → company, looping
    const P = staff.length * 2
    const a = new Float32Array(P * 3)
    const b = new Float32Array(P * 3)
    const c = new Float32Array(P * 3)
    const ph = new Float32Array(P)
    for (let i = 0; i < P; i++) {
      const s = staff[i % staff.length]
      const br = branches[Math.floor((i % staff.length) / 3)]
      s.toArray(a, i * 3)
      br.toArray(b, i * 3)
      company.toArray(c, i * 3)
      ph[i] = (i * 0.137) % 1
    }
    const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(a, 3))
    pg.setAttribute('aB', new THREE.BufferAttribute(b, 3))
    pg.setAttribute('aC', new THREE.BufferAttribute(c, 3))
    pg.setAttribute('aPh', new THREE.BufferAttribute(ph, 1))
    const pm = new THREE.ShaderMaterial({
      uniforms: { uTime: G.uTime, uColor: { value: new THREE.Color(pal.signal) }, uPx: { value: Math.min(2, window.devicePixelRatio) }, uPresence: G.uPresence },
      vertexShader: `attribute vec3 aB, aC; attribute float aPh; uniform float uTime, uPx; varying float vA;
        void main(){ float t = fract(uTime * 0.25 + aPh); vec3 p = t < 0.5 ? mix(position, aB, t * 2.0) : mix(aB, aC, t * 2.0 - 1.0);
          vA = sin(t * 3.14159); vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = 4.0 * uPx * (6.0 / -mv.z); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uPresence; varying float vA;
        void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(uColor, vA * (1.0 - d * 2.0) * uPresence);
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    pulses.current = pm
    return { company, branches, staff, lines, lineMat, node, mat, hot, pg, pm }
  }, [pal, u])
  useEffect(
    () => () => {
      ;[parts.lines, parts.lineMat, parts.node, parts.mat, parts.hot, parts.pg, parts.pm].forEach((p) => p.dispose())
    },
    [parts],
  )
  return (
    <group rotation={[0.18, -0.35, 0]}>
      <lineSegments geometry={parts.lines} material={parts.lineMat} />
      <mesh geometry={parts.node} material={parts.hot} position={parts.company} scale={0.32} />
      {parts.branches.map((b, i) => (
        <mesh key={i} geometry={parts.node} material={parts.mat} position={b} scale={0.22} />
      ))}
      {parts.staff.map((s, i) => (
        <mesh key={i} geometry={parts.node} material={parts.mat} position={s} scale={0.12} />
      ))}
      {!reduced ? <points geometry={parts.pg} material={parts.pm} frustumCulled={false} /> : null}
    </group>
  )
}

function Artefact({ ind, pal, reduced }: { ind: Industry; pal: Pal; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  useAnchorFollow(group, 'artefact', { size: 3.2, fill: 0.9 })
  const u = useMemo(() => compileUniforms({ min: -1.2, max: 1.4, edge: 0.07, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 2.2, 0.15)
  useFrame((st, dt) => {
    if (!spin.current) return
    const look = lookInput()
    spin.current.rotation.y = damp(spin.current.rotation.y, reduced ? 0 : look.x * 0.4 + Math.sin(st.clock.elapsedTime * 0.2) * 0.15, 2, dt)
    spin.current.rotation.x = damp(spin.current.rotation.x, reduced ? 0 : -look.y * 0.15, 2, dt)
  })
  const V = { fintech: Ledger, retail: Stores, ride: Route, hr: Org }[ind.variant]
  return (
    <group ref={group}>
      <group ref={spin}>
        <V pal={pal} u={u} reduced={reduced} />
      </group>
    </group>
  )
}

function ProofPhone({ ind, pal, reduced }: { ind: Industry; pal: Pal; reduced: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const phone = useRef<PhoneHandle>(null)
  const cs = caseById(ind.caseId)
  const texs = useMemo(() => (cs ? cs.screens.map((s) => screenTexture(s.src)) : []), [cs])
  const k = useRef({ x: 3, y: -4, s: 0.5, i: 0, t: 0, shown: null as THREE.Texture | null })
  useEffect(() => {
    const s = phone.current?.state
    if (s) Object.assign(s, { progress: 1, power: 1, explode: 0, layer: -1 })
  }, [])
  useFrame((st, dt) => {
    const P = phone.current
    if (!P || !texs.length) return
    const a = activeAnchor(camera, st.clock.elapsedTime, (el) => el.dataset.anchor === 'phone')
    const c = k.current
    if (a) {
      const L = reduced ? 100 : 3.5
      c.x = damp(c.x, a.x, L, dt)
      c.y = damp(c.y, a.y, L, dt)
      c.s = damp(c.s, (a.h * 0.86) / PHONE.H, L, dt)
    }
    const look = lookInput()
    P.group.position.set(c.x, c.y, 0)
    P.group.scale.setScalar(c.s)
    P.group.rotation.set(0.05 - (reduced ? 0 : look.y * 0.12), -0.35 + (reduced ? 0 : look.x * 0.3), 0.03)
    c.t += dt
    if (c.t > 3.2 && !reduced) {
      c.t = 0
      c.i = (c.i + 1) % texs.length
    }
    const want = texs[c.i]
    if (want !== c.shown) {
      P.show(want)
      c.shown = want
    }
  })
  if (!texs.length) return null
  return <Phone ref={phone} pal={pal} reduced={reduced} initial={texs[0]} />
}

export default function IndustryScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  const tier = useStore((s) => s.tier)
  const { pathname } = useLocation()
  useCameraReset()
  const ind = industryByPath(pathname.endsWith('/') ? pathname : pathname + '/')
  const q = TIER[tier].particles
  if (!ind) return null
  return (
    <>
      <DraftingGrid pal={pal} />
      {q > 0 ? <Dust pal={pal} count={Math.round(320 * q)} /> : null}
      <Artefact key={ind.slug} ind={ind} pal={pal} reduced={reduced} />
      <ProofPhone key={`p-${ind.slug}`} ind={ind} pal={pal} reduced={reduced} />
    </>
  )
}
