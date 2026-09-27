// Hire: three engagement models as three pods. Staff augmentation = your team
// with our engineers embedded; dedicated team = a self-contained pod (engineers
// + design + DevOps); project contract = one scoped, fixed module. Hovering a
// model on the page brings its pod forward.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { TIER } from '../../lib/quality'
import { ch, useStore } from '../../state/store'
import { compileLines, compileUniforms, damp, edgesOf, withCompile } from '../compile'
import { usePalette } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { lookInput } from '../rig'
import { useAnchorFollow, useCameraReset, useIntro } from '../useAnchor'

type Member = { p: [number, number, number]; ours: boolean; role?: 'design' | 'devops' }
const PODS: { members: Member[]; boundary: 'ring' | 'box' | 'none'; center: [number, number, number] }[] = [
  // Staff augmentation: a client team (grey) with two of ours embedded
  {
    center: [-1.25, -0.55, 0],
    boundary: 'ring',
    members: [
      { p: [-0.3, 0, 0.1], ours: false },
      { p: [0.05, 0, -0.25], ours: false },
      { p: [0.32, 0, 0.12], ours: true },
      { p: [-0.05, 0, 0.35], ours: false },
      { p: [-0.35, 0, -0.28], ours: true },
    ],
  },
  // Dedicated team: a pod of ours incl. design + DevOps
  {
    center: [0, 0.75, 0],
    boundary: 'ring',
    members: [
      { p: [-0.3, 0, 0], ours: true },
      { p: [0.3, 0, 0], ours: true },
      { p: [0, 0, 0.32], ours: true },
      { p: [0, 0, -0.32], ours: true },
      { p: [-0.22, 0, 0.25], ours: true, role: 'design' },
      { p: [0.24, 0, -0.24], ours: true, role: 'devops' },
    ],
  },
  // Project contract: one fixed-scope module with a hard boundary
  { center: [1.25, -0.55, 0], boundary: 'box', members: [{ p: [0, 0, 0], ours: true }] },
]

export default function HireScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  const tier = useStore((s) => s.tier)
  useCameraReset()
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const pods = useRef<(THREE.Group | null)[]>([])
  useAnchorFollow(group, 'pods', { size: 3.2, fill: 0.92 })
  const u = useMemo(() => compileUniforms({ min: -0.2, max: 0.3, edge: 0.05, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 1.6, 0.2)

  const parts = useMemo(() => {
    const head = new THREE.SphereGeometry(0.11, 24, 16).translate(0, 0.2, 0)
    const body = new RoundedBoxGeometry(0.2, 0.2, 0.14, 3, 0.07)
    const ours = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.8, roughness: 0.28, emissive: new THREE.Color(pal.signal), emissiveIntensity: 0.25 }), u)
    const theirs = withCompile(new THREE.MeshStandardMaterial({ color: '#3b3232', metalness: 0.3, roughness: 0.6 }), u)
    const design = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.8, roughness: 0.28, emissive: new THREE.Color(pal.wire), emissiveIntensity: 0.5 }), u)
    const ringPts: number[] = []
    for (let i = 0; i < 72; i++) {
      const a = (i / 72) * Math.PI * 2
      const b = ((i + 1) / 72) * Math.PI * 2
      ringPts.push(Math.cos(a) * 0.62, -0.02, Math.sin(a) * 0.62, Math.cos(b) * 0.62, -0.02, Math.sin(b) * 0.62)
      if (i % 6 === 0) ringPts.push(Math.cos(a) * 0.62, -0.02, Math.sin(a) * 0.62, Math.cos(a) * 0.7, -0.02, Math.sin(a) * 0.7)
    }
    const ring = new THREE.BufferGeometry()
    ring.setAttribute('position', new THREE.Float32BufferAttribute(ringPts, 3))
    const box = edgesOf(new THREE.BoxGeometry(0.9, 0.7, 0.9).translate(0, 0.2, 0), 1)
    const lines = [0, 1, 2].map(() => compileLines(u, pal.wire, { additive: pal.additive, residual: 0.4 }))
    return { head, body, ours, theirs, design, ring, box, lines }
  }, [pal, u])
  useEffect(
    () => () => {
      ;[parts.head, parts.body, parts.ours, parts.theirs, parts.design, parts.ring, parts.box].forEach((p) => p.dispose())
      parts.lines.forEach((l) => l.dispose())
    },
    [parts],
  )

  const glow = useRef([0, 1, 0])
  useFrame((st, dt) => {
    const t = st.clock.elapsedTime
    const active = ch('hire.model', 1)
    pods.current.forEach((g, i) => {
      if (!g) return
      glow.current[i] = damp(glow.current[i], active === i ? 1 : 0, 4, dt)
      const k = glow.current[i]
      g.scale.setScalar(0.85 + k * 0.3)
      g.position.z = k * 0.6
      parts.lines[i].uniforms.uColor.value.set(k > 0.5 ? pal.signal : pal.wire)
      parts.lines[i].uniforms.uResidual.value = 0.25 + k * 0.6
      if (!reduced) g.children.forEach((c, j) => c.userData.member && (c.position.y = Math.sin(t * 1.4 + j + i) * 0.03))
    })
    if (inner.current) {
      const look = lookInput()
      inner.current.rotation.x = damp(inner.current.rotation.x, 0.5 - (reduced ? 0 : look.y * 0.15), 2, dt)
      inner.current.rotation.y = damp(inner.current.rotation.y, reduced ? 0 : look.x * 0.35, 2, dt)
    }
  })

  const q = TIER[tier].particles
  return (
    <>
      <DraftingGrid pal={pal} />
      {q > 0 ? <Dust pal={pal} count={Math.round(300 * q)} /> : null}
      <group ref={group}>
        <group ref={inner}>
          {PODS.map((pod, i) => (
            <group key={i} position={pod.center} ref={(el) => { pods.current[i] = el }}>
              {pod.boundary === 'ring' ? <lineSegments geometry={parts.ring} material={parts.lines[i]} /> : null}
              {pod.boundary === 'box' ? <lineSegments geometry={parts.box} material={parts.lines[i]} /> : null}
              {pod.members.map((m, j) => {
                const mat = m.role ? parts.design : m.ours ? parts.ours : parts.theirs
                return (
                  <group key={j} position={m.p} userData={{ member: true }}>
                    <mesh geometry={parts.head} material={mat} />
                    <mesh geometry={parts.body} material={mat} />
                  </group>
                )
              })}
            </group>
          ))}
        </group>
      </group>
    </>
  )
}
