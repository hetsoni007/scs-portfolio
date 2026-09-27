// MVP: scope as three concentric rings — Core (inner), Supporting, Later (outer).
// Feature tokens drift in from a loose backlog and settle into their ring; the
// ring you hover on the page lights up. Core is deliberately the smallest.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { ch, useStore } from '../../state/store'
import { compileUniforms, damp, withCompile } from '../compile'
import { usePalette } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { lookInput } from '../rig'
import { useAnchorFollow, useCameraReset, useIntro } from '../useAnchor'

const RINGS = [0.5, 0.95, 1.4]
// token counts per ring: core is small on purpose
const COUNTS = [4, 7, 13]
const tmp = new THREE.Object3D()
const col = new THREE.Color()

export default function MVPScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  useCameraReset()
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const tokens = useRef<THREE.InstancedMesh>(null)
  const ringMats = useRef<THREE.LineBasicMaterial[]>([])
  useAnchorFollow(group, 'buckets', { size: 3.2, fill: 0.95 })
  const u = useMemo(() => compileUniforms({ min: -0.1, max: 0.1, edge: 0.03, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 1.4, 0.2)
  const total = COUNTS.reduce((a, b) => a + b, 0)

  const parts = useMemo(() => {
    const geo = new RoundedBoxGeometry(0.13, 0.13, 0.13, 2, 0.03)
    const mat = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.6, roughness: 0.35, emissive: new THREE.Color('#ffffff'), emissiveIntensity: 0.3 }), u)
    const rings = RINGS.map((r) => {
      const p: number[] = []
      for (let i = 0; i < 96; i++) {
        const a = (i / 96) * Math.PI * 2
        const b = ((i + 1) / 96) * Math.PI * 2
        p.push(Math.cos(a) * r, 0, Math.sin(a) * r, Math.cos(b) * r, 0, Math.sin(b) * r)
      }
      const g = new THREE.BufferGeometry()
      g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
      return g
    })
    ringMats.current = RINGS.map(() => new THREE.LineBasicMaterial({ color: pal.wire, transparent: true, opacity: 0.4 }))
    // each token: ring index, slot angle, and a random backlog start
    const meta = Array.from({ length: total }, (_, i) => {
      let ring = 0
      let idx = i
      while (idx >= COUNTS[ring]) {
        idx -= COUNTS[ring]
        ring++
      }
      return { ring, angle: (idx / COUNTS[ring]) * Math.PI * 2 + ring * 0.4, start: new THREE.Vector3(2.4 + ((i * 37) % 10) * 0.08, 1.4 - ((i * 53) % 10) * 0.28, (((i * 71) % 10) - 5) * 0.08), delay: i * 0.09 }
    })
    return { geo, mat, rings, meta }
  }, [pal, u, total])
  useEffect(
    () => () => {
      parts.geo.dispose()
      parts.mat.dispose()
      parts.rings.forEach((g) => g.dispose())
      ringMats.current.forEach((m) => m.dispose())
    },
    [parts],
  )

  const t0 = useRef<number | null>(null)
  const glow = useRef([1, 0, 0])
  useFrame((st, dt) => {
    const m = tokens.current
    if (!m) return
    const t = st.clock.elapsedTime
    if (t0.current === null) t0.current = t
    const since = t - t0.current
    const active = ch('mvp.bucket', 0)
    RINGS.forEach((_, r) => {
      glow.current[r] = damp(glow.current[r], active === r ? 1 : 0, 4, dt)
      ringMats.current[r].color.set(glow.current[r] > 0.5 ? pal.signal : pal.wire)
      ringMats.current[r].opacity = 0.3 + glow.current[r] * 0.6
    })
    parts.meta.forEach((mt, i) => {
      const p = reduced ? 1 : THREE.MathUtils.clamp((since - 0.6 - mt.delay) / 1.4, 0, 1)
      const e = p * p * (3 - 2 * p)
      const a = mt.angle + (reduced ? 0 : t * (0.12 - mt.ring * 0.03))
      const R = RINGS[mt.ring]
      tmp.position.set(
        THREE.MathUtils.lerp(mt.start.x, Math.cos(a) * R, e),
        THREE.MathUtils.lerp(mt.start.y, 0.07, e),
        THREE.MathUtils.lerp(mt.start.z, Math.sin(a) * R, e),
      )
      tmp.rotation.set(t * 0.3 * (1 - e), a, 0)
      tmp.scale.setScalar(1 + glow.current[mt.ring] * 0.35)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
      col.set(mt.ring === 0 ? pal.signal : mt.ring === 1 ? pal.wire : pal.fg).multiplyScalar(0.35 + glow.current[mt.ring] * 0.65)
      m.setColorAt(i, col)
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
    if (inner.current) {
      const look = lookInput()
      inner.current.rotation.x = damp(inner.current.rotation.x, 0.62 - (reduced ? 0 : look.y * 0.15), 2, dt)
      inner.current.rotation.z = damp(inner.current.rotation.z, reduced ? 0 : -look.x * 0.12, 2, dt)
    }
  })

  return (
    <>
      <DraftingGrid pal={pal} />
      <Dust pal={pal} count={240} />
      <group ref={group}>
        <group ref={inner}>
          {parts.rings.map((g, r) => (
            <lineSegments key={r} geometry={g} material={ringMats.current[r]} />
          ))}
          <instancedMesh ref={tokens} args={[parts.geo, parts.mat, total]} frustumCulled={false} />
        </group>
      </group>
    </>
  )
}
