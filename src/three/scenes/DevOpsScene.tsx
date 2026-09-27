// DevOps: the reference architecture as a live 3D stack. Eight layers (clients →
// edge → routing → pods → DB → cache/queue → CI/CD → observability), requests
// falling through in blood red and responses rising in ember red. Hover or tap a layer
// (here or in the list) to light it and read what it does.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { DEVOPS_PAGE } from '../../content/devops'
import { TIER } from '../../lib/quality'
import { ch, useStore } from '../../state/store'
import { compileLines, compileUniforms, damp, G, withCompile } from '../compile'
import { usePalette, type Pal } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { labelMaterial } from '../parts/label'
import { lookInput } from '../rig'
import { useAnchorFollow, useCameraReset, useIntro } from '../useAnchor'

const L = DEVOPS_PAGE.arch.nodes.length
const GAP = 0.44
const TOP = ((L - 1) * GAP) / 2
const yOf = (i: number) => TOP - i * GAP

function lines(pts: number[]) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return g
}
function ring(r: number, y: number, n = 48, out: number[] = []) {
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const b = ((i + 1) / n) * Math.PI * 2
    out.push(Math.cos(a) * r, y, Math.sin(a) * r, Math.cos(b) * r, y, Math.sin(b) * r)
  }
  return out
}
function box(w: number, h: number, d: number, x = 0, y = 0, z = 0, out: number[] = []) {
  const X = [x - w / 2, x + w / 2]
  const Y = [y - h / 2, y + h / 2]
  const Z = [z - d / 2, z + d / 2]
  const c = (i: number, j: number, k: number) => [X[i], Y[j], Z[k]]
  const e = [
    [c(0, 0, 0), c(1, 0, 0)], [c(0, 1, 0), c(1, 1, 0)], [c(0, 0, 1), c(1, 0, 1)], [c(0, 1, 1), c(1, 1, 1)],
    [c(0, 0, 0), c(0, 1, 0)], [c(1, 0, 0), c(1, 1, 0)], [c(0, 0, 1), c(0, 1, 1)], [c(1, 0, 1), c(1, 1, 1)],
    [c(0, 0, 0), c(0, 0, 1)], [c(1, 0, 0), c(1, 0, 1)], [c(0, 1, 0), c(0, 1, 1)], [c(1, 1, 0), c(1, 1, 1)],
  ]
  e.forEach(([a, b]) => out.push(...a, ...b))
  return out
}

/** The per-layer "glyph" sitting on each slab, as linework. */
function glyph(i: number): number[] {
  const o: number[] = []
  const y = 0.1
  switch (i) {
    case 0: // clients: phone + laptop + api
      box(0.16, 0.26, 0.02, -0.5, y + 0.05, 0, o)
      box(0.42, 0.02, 0.28, 0.05, y - 0.06, 0, o)
      box(0.42, 0.24, 0.02, 0.05, y + 0.06, -0.14, o)
      box(0.18, 0.18, 0.18, 0.6, y, 0, o)
      break
    case 1: // edge: globe + shield ring
      ring(0.22, y, 40, o)
      for (let k = 0; k < 6; k++) {
        const a = (k / 6) * Math.PI
        const pts = 24
        for (let s = 0; s < pts; s++) {
          const t0 = (s / pts) * Math.PI * 2
          const t1 = ((s + 1) / pts) * Math.PI * 2
          o.push(Math.cos(t0) * 0.22 * Math.cos(a), y + Math.sin(t0) * 0.22, Math.cos(t0) * 0.22 * Math.sin(a), Math.cos(t1) * 0.22 * Math.cos(a), y + Math.sin(t1) * 0.22, Math.cos(t1) * 0.22 * Math.sin(a))
        }
      }
      ring(0.38, y - 0.08, 48, o)
      break
    case 2: // routing: a splitter fanning out
      for (let k = -2; k <= 2; k++) o.push(-0.55, y, 0, 0.55, y, k * 0.12)
      box(0.14, 0.14, 0.14, -0.55, y, 0, o)
      break
    case 3: // pods: drawn as meshes separately
      break
    case 4: // DB cylinder
      ring(0.22, y - 0.08, 40, o)
      ring(0.22, y + 0.02, 40, o)
      ring(0.22, y + 0.12, 40, o)
      for (let k = 0; k < 8; k++) {
        const a = (k / 8) * Math.PI * 2
        o.push(Math.cos(a) * 0.22, y - 0.08, Math.sin(a) * 0.22, Math.cos(a) * 0.22, y + 0.12, Math.sin(a) * 0.22)
      }
      break
    case 5: // cache + queue
      ring(0.14, y - 0.04, 28, o)
      ring(0.14, y + 0.08, 28, o)
      for (let k = 0; k < 5; k++) box(0.1, 0.1, 0.1, 0.15 + k * 0.13, y, 0, o)
      break
    case 6: // CI/CD ring + 4 stations
      ring(0.42, y, 64, o)
      for (let k = 0; k < 4; k++) {
        const a = (k / 4) * Math.PI * 2 + 0.4
        box(0.07, 0.07, 0.07, Math.cos(a) * 0.42, y, Math.sin(a) * 0.42, o)
      }
      break
    case 7: // observability: drawn as an animated trace separately
      break
  }
  return o
}

function Stack({ pal, reduced, packets }: { pal: Pal; reduced: boolean; packets: number }) {
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  useAnchorFollow(group, ['infra', 'arch'], { size: L * GAP + 1.2, fill: 0.95 })
  const u = useMemo(() => compileUniforms({ min: -TOP - 0.3, max: TOP + 0.3, edge: 0.08, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 2.4, 0.1)
  const glow = useRef<number[]>(new Array(L).fill(0))
  const pods = useRef<THREE.InstancedMesh>(null)
  const pkt = useRef<THREE.ShaderMaterial | null>(null)

  const parts = useMemo(() => {
    const slab = new RoundedBoxGeometry(1.9, 0.045, 1.15, 3, 0.02)
    const slabMats = Array.from({ length: L }, () =>
      withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.7, roughness: 0.4, emissive: new THREE.Color(pal.signal), emissiveIntensity: 0, transparent: true, opacity: 0.92 }), u),
    )
    const slabEdge = lines(box(1.9, 0.045, 1.15))
    const edgeMats = Array.from({ length: L }, () => compileLines(u, pal.wire, { additive: pal.additive, residual: 0.35 }))
    const glyphs = Array.from({ length: L }, (_, i) => lines(glyph(i)))
    const glyphMats = Array.from({ length: L }, () => compileLines(u, pal.wire, { additive: pal.additive, residual: 0.75, opacity: 0.9 }))
    const labels = DEVOPS_PAGE.arch.nodes.map((n) => labelMaterial(n.k.toUpperCase(), pal.fg, { size: 34 }))
    // spine: dashed vertical conduits
    const sp: number[] = []
    for (const x of [-0.8, 0.8])
      for (let y = -TOP - 0.1; y < TOP + 0.1; y += 0.08) sp.push(x, y, -0.45, x, y + 0.04, -0.45)
    const spine = lines(sp)
    const spineMat = new THREE.LineBasicMaterial({ color: pal.wire, transparent: true, opacity: 0.35 })
    const podGeo = new RoundedBoxGeometry(0.12, 0.12, 0.12, 2, 0.02)
    const podMat = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.8, roughness: 0.3, emissive: new THREE.Color(pal.wire), emissiveIntensity: 0.25 }), u)
    // request / response packets
    const P = packets
    const seed = new Float32Array(P * 3)
    for (let i = 0; i < P; i++) {
      seed[i * 3] = ((i * 37) % 100) / 100 // phase
      seed[i * 3 + 1] = (((i * 53) % 100) / 100 - 0.5) * 1.3 // x
      seed[i * 3 + 2] = i % 2 // 0 = request (down), 1 = response (up)
    }
    const pktGeo = new THREE.BufferGeometry()
    pktGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P * 3), 3))
    pktGeo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3))
    const pktMat = new THREE.ShaderMaterial({
      uniforms: { uTime: G.uTime, uTop: { value: TOP + 0.25 }, uDown: { value: new THREE.Color(pal.wire) }, uUp: { value: new THREE.Color(pal.signal) }, uPx: { value: Math.min(2, window.devicePixelRatio) }, uPresence: G.uPresence, uSpeed: { value: 1 } },
      vertexShader: `attribute vec3 aSeed; uniform float uTime, uTop, uPx, uSpeed; varying float vUp; varying float vA;
        void main(){ float t = fract(uTime * 0.12 * uSpeed + aSeed.x); float y = mix(uTop, -uTop, aSeed.z > 0.5 ? 1.0 - t : t);
          vec3 p = vec3(aSeed.y, y, 0.18 + aSeed.z * -0.36); vUp = aSeed.z; vA = sin(t * 3.14159);
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = 4.0 * uPx * (6.0 / -mv.z); }`,
      fragmentShader: `uniform vec3 uDown, uUp; uniform float uPresence; varying float vUp; varying float vA;
        void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(mix(uDown, uUp, vUp), vA * (1.0 - d * 2.0) * uPresence);
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    pkt.current = pktMat
    const traceGeo = new THREE.BufferGeometry()
    traceGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(64 * 3), 3))
    const traceMat = new THREE.LineBasicMaterial({ color: pal.signal, transparent: true, opacity: 0.9 })
    const traceLine = new THREE.Line(traceGeo, traceMat)
    traceLine.frustumCulled = false
    return { slab, slabMats, slabEdge, edgeMats, glyphs, glyphMats, labels, spine, spineMat, podGeo, podMat, pktGeo, pktMat, traceGeo, traceMat, traceLine }
  }, [pal, u, packets])

  useEffect(
    () => () => {
      Object.values(parts).forEach((p) =>
        Array.isArray(p) ? p.forEach((x) => (x as { dispose: () => void }).dispose()) : (p as { dispose?: () => void }).dispose?.(),
      )
      delete document.documentElement.dataset.cursor
    },
    [parts],
  )

  const m4 = useMemo(() => new THREE.Matrix4(), [])
  useFrame((st, dt) => {
    const t = st.clock.elapsedTime
    const active = ch('devops.layer', -1)
    for (let i = 0; i < L; i++) {
      glow.current[i] = damp(glow.current[i], active === i ? 1 : 0, 5, dt)
      const gv = glow.current[i]
      parts.slabMats[i].emissiveIntensity = gv * 1.2
      parts.edgeMats[i].uniforms.uColor.value.set(gv > 0.5 ? pal.signal : pal.wire)
      parts.glyphMats[i].uniforms.uColor.value.set(gv > 0.5 ? pal.signal : pal.wire)
      parts.edgeMats[i].uniforms.uResidual.value = 0.3 + gv * 0.6
      parts.labels[i].mat.opacity = 0.35 + gv * 0.65
    }
    // pods autoscale: a sixth pod comes and goes
    if (pods.current) {
      const n = 6
      for (let k = 0; k < n; k++) {
        const s = k < 5 ? 1 : reduced ? 1 : Math.max(0, Math.sin(t * 0.5)) * 1
        m4.makeScale(s, s, s).setPosition(-0.45 + (k % 3) * 0.45, yOf(3) + 0.12, -0.2 + Math.floor(k / 3) * 0.4)
        pods.current.setMatrixAt(k, m4)
      }
      pods.current.instanceMatrix.needsUpdate = true
    }
    // observability trace
    {
      const a = parts.traceGeo.getAttribute('position') as THREE.BufferAttribute
      for (let k = 0; k < 64; k++) {
        const x = -0.8 + (k / 63) * 1.6
        const y = yOf(7) + 0.12 + Math.sin(k * 0.45 + (reduced ? 0 : t * 3)) * 0.05 + (k % 17 === 0 ? 0.08 : 0)
        a.setXYZ(k, x, y, 0)
      }
      a.needsUpdate = true
    }
    if (pkt.current) pkt.current.uniforms.uSpeed.value = active >= 0 ? 1.8 : 1
    if (inner.current) {
      const look = lookInput()
      inner.current.rotation.y = damp(inner.current.rotation.y, -0.62 + (reduced ? 0 : look.x * 0.35 + Math.sin(t * 0.25) * 0.08), 2, dt)
      inner.current.rotation.x = damp(inner.current.rotation.x, 0.42 - (reduced ? 0 : look.y * 0.12), 2, dt)
    }
  })

  const over = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    if ((e.nativeEvent.target as Element | null)?.closest('a, button, input, select, textarea')) return
    e.stopPropagation()
    useStore.getState().setCh('devops.layer', i)
    document.documentElement.dataset.cursor = 'layer'
  }

  return (
    <group ref={group}>
      <group ref={inner}>
        <lineSegments geometry={parts.spine} material={parts.spineMat} />
        {Array.from({ length: L }, (_, i) => (
          <group key={i} position={[0, yOf(i), 0]}>
            <mesh geometry={parts.slab} material={parts.slabMats[i]} onPointerOver={over(i)} onPointerOut={() => delete document.documentElement.dataset.cursor} />
            <lineSegments geometry={parts.slabEdge} material={parts.edgeMats[i]} />
            <lineSegments geometry={parts.glyphs[i]} material={parts.glyphMats[i]} />
            <mesh position={[1.12 + (0.075 * parts.labels[i].aspect) / 2, 0, 0.5]} material={parts.labels[i].mat} scale={[0.075 * parts.labels[i].aspect, 0.075, 1]}>
              <planeGeometry />
            </mesh>
          </group>
        ))}
        <instancedMesh ref={pods} args={[parts.podGeo, parts.podMat, 6]} />
        <primitive object={parts.traceLine} />
        <points geometry={parts.pktGeo} material={parts.pktMat} frustumCulled={false} />
      </group>
    </group>
  )
}

export default function DevOpsScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  const tier = useStore((s) => s.tier)
  useCameraReset()
  const q = TIER[tier].particles
  return (
    <>
      <DraftingGrid pal={pal} />
      {q > 0 ? <Dust pal={pal} count={Math.round(320 * q)} /> : null}
      <Stack pal={pal} reduced={reduced} packets={Math.round(90 * Math.max(0.4, q))} />
    </>
  )
}
