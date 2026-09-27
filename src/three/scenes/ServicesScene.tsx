// Services: seven modules orbit a point cloud that morphs into the selected
// service's form. Drag spins the orbit; clicking a module selects it and scrolls
// the catalogue to it. Below, an assembly line compiles one module per station.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { SERVICES } from '../../content/services'
import { live, smooth } from '../../lib/live'
import { TIER } from '../../lib/quality'
import { ch, useStore } from '../../state/store'
import { compileLines, compileUniforms, damp, edgesOf, withCompile } from '../compile'
import { usePalette, type Pal } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { labelMaterial } from '../parts/label'
import { Morph } from '../parts/Morph'
import { useAnchorFollow, useCameraReset, useIntro, useParallax } from '../useAnchor'

const RX = 1.55
const RZ = 1.55
const onDom = (e: ThreeEvent<PointerEvent | MouseEvent>) =>
  !!(e.nativeEvent.target as Element | null)?.closest('a, button, input, select, textarea, label, [data-no-3d]')

function Orbit({ pal, reduced, count }: { pal: Pal; reduced: boolean; count: number }) {
  const group = useRef<THREE.Group>(null)
  const ring = useRef<THREE.Group>(null)
  const active = useStore((s) => s.ch['services.active'] ?? 0)
  const [hover, setHover] = useState(-1)
  const spin = useRef({ angle: 0, vel: 0, drag: false, lastX: 0, moved: 0, clicks: 0 })
  useAnchorFollow(group, 'orbit', { size: { w: 3.9, h: 2.9 }, fit: 'contain', fill: 0.95 })

  const u = useMemo(() => compileUniforms({ min: -0.12, max: 0.12, edge: 0.04, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 1.6, 0.2)

  const parts = useMemo(() => {
    const cube = new RoundedBoxGeometry(0.22, 0.22, 0.22, 3, 0.03)
    const edges = edgesOf(new THREE.BoxGeometry(0.22, 0.22, 0.22), 1)
    const idle = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.85, roughness: 0.3 }), u)
    const hot = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.6, roughness: 0.3, emissive: new THREE.Color(pal.signal), emissiveIntensity: 1.2 }), u)
    const lines = compileLines(u, pal.wire, { additive: pal.additive, residual: 0.35 })
    const hotLines = compileLines(u, pal.signal, { additive: pal.additive, residual: 0.9 })
    const labels = SERVICES.map((s) => labelMaterial(s.n, pal.fg, { size: 40 }))
    // the orbit path + ticks
    const path: number[] = []
    const N = 128
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2
      const b = ((i + 1) / N) * Math.PI * 2
      path.push(Math.cos(a) * RX, 0, Math.sin(a) * RZ, Math.cos(b) * RX, 0, Math.sin(b) * RZ)
      if (i % 4 === 0) path.push(Math.cos(a) * RX * 0.96, 0, Math.sin(a) * RZ * 0.96, Math.cos(a) * RX, 0, Math.sin(a) * RZ)
    }
    const pathGeo = new THREE.BufferGeometry()
    pathGeo.setAttribute('position', new THREE.Float32BufferAttribute(path, 3))
    const pathMat = new THREE.LineBasicMaterial({ color: pal.wire, transparent: true, opacity: 0.35, depthWrite: false })
    return { cube, edges, idle, hot, lines, hotLines, labels, pathGeo, pathMat }
  }, [pal, u])

  useEffect(
    () => () => {
      delete document.documentElement.dataset.cursor
      const p = parts
      ;[p.cube, p.edges, p.idle, p.hot, p.lines, p.hotLines, p.pathGeo, p.pathMat].forEach((x) => x.dispose())
      p.labels.forEach((l) => l.dispose())
    },
    [parts],
  )

  // Drag to spin (window listeners once a drag starts, so it survives leaving the orbit).
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const s = spin.current
      if (!s.drag) return
      const dx = e.clientX - s.lastX
      s.lastX = e.clientX
      s.moved += Math.abs(dx)
      s.vel = dx * 0.006
      s.angle += s.vel
    }
    const up = () => {
      spin.current.drag = false
      document.documentElement.style.userSelect = ''
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  const select = (i: number) => {
    const st = useStore.getState()
    spin.current.clicks++
    st.setCh('services.active', i)
    st.setCh('services.jump', spin.current.clicks * SERVICES.length + i)
  }

  useFrame((_, dt) => {
    const s = spin.current
    const r = ring.current
    if (!r) return
    if (!s.drag) {
      // settle so the active module swings to the front (angle where z is max)
      const step = (Math.PI * 2) / SERVICES.length
      const target = Math.PI / 2 - active * step
      let diff = target - s.angle
      diff = Math.atan2(Math.sin(diff), Math.cos(diff))
      s.vel *= Math.pow(0.02, dt)
      s.angle += s.vel + diff * Math.min(1, dt * (reduced ? 30 : 2.2))
    }
    r.rotation.y = s.angle
  })

  return (
    <group ref={group}>
      <group rotation={[0.38, 0, -0.06]}>
        <Morph pal={pal} form={SERVICES[active].form} count={count} reduced={reduced} />
        <group ref={ring}>
          <lineSegments geometry={parts.pathGeo} material={parts.pathMat} />
          {SERVICES.map((s, i) => {
            const a = (i / SERVICES.length) * Math.PI * 2
            const on = i === active
            const h = i === hover
            return (
              <group key={s.n} position={[Math.cos(a) * RX, 0, Math.sin(a) * RZ]}>
                <mesh
                  name={`svc-module-${i}`}
                  geometry={parts.cube}
                  material={on ? parts.hot : parts.idle}
                  scale={on ? 1.35 : h ? 1.2 : 1}
                  onPointerOver={(e) => {
                    if (onDom(e)) return
                    e.stopPropagation()
                    setHover(i)
                    document.documentElement.dataset.cursor = 'select'
                  }}
                  onPointerOut={() => {
                    setHover(-1)
                    document.documentElement.dataset.cursor = 'drag'
                  }}
                  onPointerDown={(e) => {
                    if (onDom(e)) return
                    e.stopPropagation()
                    spin.current.drag = true
                    spin.current.moved = 0
                    spin.current.lastX = e.nativeEvent.clientX
                  }}
                  onClick={(e) => {
                    if (onDom(e)) return
                    e.stopPropagation()
                    if (spin.current.moved < 6) select(i)
                  }}
                />
                <lineSegments geometry={parts.edges} material={on ? parts.hotLines : parts.lines} scale={on ? 1.35 : h ? 1.2 : 1} />
                <mesh position={[0, 0.3, 0]} material={parts.labels[i].mat} scale={[0.13 * parts.labels[i].aspect, 0.13, 1]}>
                  <planeGeometry />
                </mesh>
              </group>
            )
          })}
        </group>
        {/* invisible grab disc: drag anywhere on the orbit */}
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          onPointerOver={(e) => {
            if (!onDom(e)) document.documentElement.dataset.cursor = 'drag'
          }}
          onPointerOut={() => delete document.documentElement.dataset.cursor}
          onPointerDown={(e) => {
            if (onDom(e)) return
            spin.current.drag = true
            spin.current.moved = 0
            spin.current.lastX = e.nativeEvent.clientX
            document.documentElement.style.userSelect = 'none'
          }}
        >
          <circleGeometry args={[RX * 1.15, 48]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}

/** Five gantries; a module travels the line and compiles 20% at each station. */
function Line({ pal, reduced }: { pal: Pal; reduced: boolean }) {
  const group = useRef<THREE.Group>(null)
  const unit = useRef<THREE.Group>(null)
  useAnchorFollow(group, 'line', { size: { w: 5.6, h: 1.5 }, fit: 'contain', fill: 0.96 })
  const uUnit = useMemo(() => compileUniforms({ min: -0.32, max: 0.32, edge: 0.05, color: pal.signal }), [pal.signal])
  const uRig = useMemo(() => compileUniforms({ min: -0.6, max: 0.6, edge: 0.05, color: pal.signal, progress: 1 }), [pal.signal])
  const lamps = useRef<THREE.MeshStandardMaterial[]>([])

  const parts = useMemo(() => {
    const rail = new THREE.BoxGeometry(5.4, 0.03, 0.34).translate(0, -0.55, 0)
    const gantry = new THREE.BufferGeometry()
    const g: number[] = []
    const post = (x: number, z: number) => g.push(x, -0.55, z, x, 0.5, z)
    for (let i = 0; i < 5; i++) {
      const x = -2.2 + i * 1.1
      post(x - 0.02, -0.2)
      post(x - 0.02, 0.2)
      g.push(x - 0.02, 0.5, -0.2, x - 0.02, 0.5, 0.2)
      g.push(x - 0.02, 0.5, -0.2, x - 0.02, 0.38, 0) // brace
      g.push(x - 0.02, 0.5, 0.2, x - 0.02, 0.38, 0)
    }
    // dimension line under the rail
    g.push(-2.7, -0.75, 0, 2.7, -0.75, 0, -2.7, -0.8, 0, -2.7, -0.7, 0, 2.7, -0.8, 0, 2.7, -0.7, 0)
    gantry.setAttribute('position', new THREE.Float32BufferAttribute(g, 3))
    const box = new RoundedBoxGeometry(0.34, 0.62, 0.05, 4, 0.05)
    const boxEdges = edgesOf(new THREE.BoxGeometry(0.34, 0.62, 0.05), 1)
    const lamp = new THREE.BoxGeometry(0.1, 0.03, 0.1)
    const railMat = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.7, roughness: 0.45 }), uRig)
    const rigLines = compileLines(uRig, pal.wire, { additive: pal.additive, residual: 0.55, opacity: 0.8 })
    const unitMat = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.88, roughness: 0.28 }), uUnit)
    const unitLines = compileLines(uUnit, pal.wire, { additive: pal.additive })
    lamps.current = Array.from({ length: 5 }, () => new THREE.MeshStandardMaterial({ color: '#111', emissive: new THREE.Color(pal.signal), emissiveIntensity: 0 }))
    return { rail, gantry, box, boxEdges, lamp, railMat, rigLines, unitMat, unitLines }
  }, [pal, uUnit, uRig])
  useEffect(
    () => () => {
      Object.values(parts).forEach((p) => (p as { dispose: () => void }).dispose())
      lamps.current.forEach((m) => m.dispose())
    },
    [parts],
  )

  const cur = useRef(0)
  useFrame((st, dt) => {
    const p = live.chan['services.line'] ?? 0
    cur.current = damp(cur.current, p, reduced ? 100 : 5, dt)
    const t = cur.current
    if (unit.current) {
      unit.current.position.x = -2.6 + t * 5.2
      unit.current.rotation.y = reduced ? 0 : Math.sin(st.clock.elapsedTime * 0.8) * 0.3
    }
    // compile 20% per station passed
    uUnit.uProgress.value = smooth(0, 1, t * 1.05)
    lamps.current.forEach((m, i) => {
      const x = (i + 0.5) / 5
      m.emissiveIntensity = damp(m.emissiveIntensity, t >= x - 0.1 ? 2.2 : 0.05, 6, dt)
    })
  })

  return (
    <group ref={group}>
      <group rotation={[0.28, -0.32, 0]}>
        <mesh geometry={parts.rail} material={parts.railMat} />
        <lineSegments geometry={parts.gantry} material={parts.rigLines} />
        {lamps.current.map((m, i) => (
          <mesh key={i} geometry={parts.lamp} material={m} position={[-2.22 + i * 1.1, 0.52, 0]} />
        ))}
        <group ref={unit} position={[-2.6, -0.2, 0]}>
          <mesh geometry={parts.box} material={parts.unitMat} />
          <lineSegments geometry={parts.boxEdges} material={parts.unitLines} />
        </group>
      </group>
    </group>
  )
}

export default function ServicesScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  const tier = useStore((s) => s.tier)
  useCameraReset()
  useParallax(0.14)
  const q = TIER[tier].particles
  // keep the channel sane when arriving fresh
  useEffect(() => {
    if (ch('services.active', -1) < 0) useStore.getState().setCh('services.active', 0)
  }, [])
  return (
    <>
      <DraftingGrid pal={pal} />
      {q > 0 ? <Dust pal={pal} count={Math.round(360 * q)} /> : null}
      <Orbit pal={pal} reduced={reduced} count={Math.round(5200 * Math.max(0.25, q))} />
      <Line pal={pal} reduced={reduced} />
    </>
  )
}
