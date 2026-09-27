// Calculator: a tower of weeks. The build-stage base, each chosen feature and
// the backend are blocks sized by their week weights (× design/platform
// multipliers), so the tower grows and shrinks with your scope as you toggle.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { CALC_PAGE } from '../../content/secondary'
import { live } from '../../lib/live'
import { ch, useStore } from '../../state/store'
import { compileUniforms, damp, withCompile } from '../compile'
import { usePalette } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { labelMaterial } from '../parts/label'
import { lookInput } from '../rig'
import { useAnchorFollow, useCameraReset, useIntro } from '../useAnchor'

const M = CALC_PAGE.model
const UNIT = 0.1 // world units per week
const REF = 4.2 // reference tower height (~42 weeks) for scaling to the anchor
const SLOTS = 1 + M.features.length + 1 // base + features + backend

export default function CalcScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  useCameraReset()
  const group = useRef<THREE.Group>(null)
  const spin = useRef<THREE.Group>(null)
  const blocks = useRef<(THREE.Mesh | null)[]>([])
  const label = useRef<THREE.Mesh>(null)
  useAnchorFollow(group, 'tower', { size: REF, fill: 0.95 })
  const u = useMemo(() => compileUniforms({ min: -0.5, max: 0.5, edge: 0.05, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 1.2, 0.1)

  const parts = useMemo(() => {
    const geo = new RoundedBoxGeometry(1.4, 1, 1.4, 2, 0.04)
    const base = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.8, roughness: 0.3 }), u)
    const feats = M.features.map((_, i) =>
      withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.6, roughness: 0.35, emissive: new THREE.Color(i % 2 ? pal.wire : pal.fg), emissiveIntensity: 0.18 }), u),
    )
    const backend = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.6, roughness: 0.3, emissive: new THREE.Color(pal.signal), emissiveIntensity: 0.55 }), u)
    // dimension rail: a tick every 2 weeks up to 40
    const d: number[] = [1.05, 0, 0, 1.05, 40 * UNIT, 0]
    for (let w = 0; w <= 40; w += 2) d.push(1.05, w * UNIT, 0, w % 8 === 0 ? 1.25 : 1.13, w * UNIT, 0)
    // floor plate outline
    d.push(-1.1, 0, -1.1, 1.1, 0, -1.1, 1.1, 0, -1.1, 1.1, 0, 1.1, 1.1, 0, 1.1, -1.1, 0, 1.1, -1.1, 0, 1.1, -1.1, 0, -1.1)
    const rail = new THREE.BufferGeometry()
    rail.setAttribute('position', new THREE.Float32BufferAttribute(d, 3))
    const railMat = new THREE.LineBasicMaterial({ color: pal.wire, transparent: true, opacity: 0.5 })
    return { geo, base, feats, backend, rail, railMat }
  }, [pal, u])
  useEffect(
    () => () => {
      ;[parts.geo, parts.base, parts.backend, parts.rail, parts.railMat].forEach((p) => p.dispose())
      parts.feats.forEach((m) => m.dispose())
    },
    [parts],
  )

  const lab = useRef<{ w: number; m: ReturnType<typeof labelMaterial> | null }>({ w: -1, m: null })
  useEffect(() => () => lab.current.m?.dispose(), [])

  const state = useRef(Array.from({ length: SLOTS }, () => ({ y: 8, h: 0.0001 })))
  const railTop = useRef(0)
  useFrame((st, dt) => {
    const mask = ch('calc.mask', 1)
    const mult = ch('calc.mult', 100) / 100
    const stage = M.stage[ch('calc.stage', 0)]
    const be = M.backend[ch('calc.backend', 0)]
    const heights = [stage.base, ...M.features.map((f, i) => (mask & (1 << i) ? f.weeks : 0)), be.add].map((w) => w * mult * UNIT)
    let y = 0
    const L = reduced ? 100 : 6
    heights.forEach((h, i) => {
      const s = state.current[i]
      const on = h > 0.0001
      if (on && s.h < 0.001) s.y = y + 2.5 // new block: drop in from above
      s.h = damp(s.h, on ? h : 0.0001, L, dt)
      s.y = damp(s.y, y, reduced ? 100 : 7, dt)
      const m = blocks.current[i]
      if (m) {
        m.visible = s.h > 0.002
        m.scale.set(i === 0 ? 1 : 0.94 - (i % 3) * 0.04, Math.max(0.0001, s.h - 0.012), i === 0 ? 1 : 0.94 - (i % 3) * 0.04)
        m.position.y = s.y + s.h / 2
      }
      if (on) y += h
    })
    railTop.current = damp(railTop.current, y, L, dt)
    // "~N WK" label riding the top of the tower (the DOM shows the same number)
    const weeks = Math.round(live.chan['calc.weeks'] ?? 0)
    if (weeks !== lab.current.w) {
      lab.current.m?.dispose()
      lab.current.m = labelMaterial(`~${weeks} WK`, pal.signal, { size: 40 })
      lab.current.w = weeks
      if (label.current) label.current.material = lab.current.m.mat
    }
    if (label.current && lab.current.m) {
      label.current.position.set(1.35 + (0.28 * lab.current.m.aspect) / 2, railTop.current, 0)
      label.current.scale.set(0.28 * lab.current.m.aspect, 0.28, 1)
    }
    if (spin.current) {
      const look = lookInput()
      spin.current.rotation.y = damp(spin.current.rotation.y, -0.55 + (reduced ? 0 : look.x * 0.4 + Math.sin(st.clock.elapsedTime * 0.3) * 0.1), 2, dt)
      spin.current.rotation.x = damp(spin.current.rotation.x, 0.22 - (reduced ? 0 : look.y * 0.1), 2, dt)
    }
  })

  return (
    <>
      <DraftingGrid pal={pal} />
      <Dust pal={pal} count={180} />
      <group ref={group}>
        <group position={[0, -REF / 2, 0]}>
          <group ref={spin}>
            {Array.from({ length: SLOTS }, (_, i) => (
              <mesh
                key={i}
                ref={(el) => {
                  blocks.current[i] = el
                }}
                geometry={parts.geo}
                material={i === 0 ? parts.base : i === SLOTS - 1 ? parts.backend : parts.feats[i - 1]}
              />
            ))}
            <lineSegments geometry={parts.rail} material={parts.railMat} />
            <mesh ref={label}>
              <planeGeometry />
            </mesh>
          </group>
        </group>
      </group>
    </>
  )
}
