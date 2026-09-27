// Contact: physical keycaps for the real contact channels. Drag and throw them;
// a click (no drag) opens that channel. On phones, tilting the device changes
// gravity. Reduced motion: no physics, the keys sit in a neat row.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as CANNON from 'cannon-es'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { CALENDLY, EMAIL, SOCIALS, WHATSAPP } from '../../content/site'
import { live } from '../../lib/live'
import { useStore } from '../../state/store'
import { compileLines, compileUniforms, damp, edgesOf, withCompile } from '../compile'
import { usePalette, type Pal } from '../palette'
import { DraftingGrid } from '../parts/Backdrop'
import { labelTexture } from '../parts/label'
import { activeAnchor } from '../rig'
import { useCameraReset, useIntro } from '../useAnchor'

type Key = { label: string; href?: string; hot?: boolean }
// Labels are the real channels, plus two facts from the page ("Do you sign NDAs? Always", kick-off "Within 48 hours").
const KEYS: Key[] = [
  { label: 'BOOK A CALL', href: CALENDLY, hot: true },
  { label: 'EMAIL', href: `mailto:${EMAIL}` },
  { label: 'WHATSAPP', href: WHATSAPP },
  { label: 'LINKEDIN', href: SOCIALS[0].href },
  { label: 'NDA' },
  { label: '48H' },
]
const S = 0.66 // key size
const D = 0.3 // key depth
const H = 4.2 // local box height (world units before scaling)

function Keys({ pal, reduced }: { pal: Pal; reduced: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const group = useRef<THREE.Group>(null)
  const meshes = useRef<(THREE.Group | null)[]>([])
  const box = useRef({ w: 5, scale: 1 })
  const u = useMemo(() => compileUniforms({ min: -S / 2, max: S / 2, edge: 0.05, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 1.2, 0.2)

  // physics world
  const sim = useMemo(() => {
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -14, 0) })
    world.allowSleep = true
    const mat = new CANNON.Material('k')
    world.addContactMaterial(new CANNON.ContactMaterial(mat, mat, { friction: 0.35, restitution: 0.25 }))
    const plane = (pos: CANNON.Vec3, axis: CANNON.Vec3, angle: number) => {
      const b = new CANNON.Body({ mass: 0, material: mat, shape: new CANNON.Plane() })
      b.position.copy(pos)
      b.quaternion.setFromAxisAngle(axis, angle)
      world.addBody(b)
      return b
    }
    const floor = plane(new CANNON.Vec3(0, 0, 0), new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
    const left = plane(new CANNON.Vec3(-2.5, 0, 0), new CANNON.Vec3(0, 1, 0), Math.PI / 2)
    const right = plane(new CANNON.Vec3(2.5, 0, 0), new CANNON.Vec3(0, 1, 0), -Math.PI / 2)
    plane(new CANNON.Vec3(0, 0, -0.55), new CANNON.Vec3(0, 1, 0), 0)
    plane(new CANNON.Vec3(0, 0, 0.55), new CANNON.Vec3(0, 1, 0), Math.PI)
    const ceiling = plane(new CANNON.Vec3(0, H + 3, 0), new CANNON.Vec3(1, 0, 0), Math.PI / 2)
    const bodies = KEYS.map((_, i) => {
      const b = new CANNON.Body({ mass: 1, material: mat, shape: new CANNON.Box(new CANNON.Vec3(S / 2, S / 2, D / 2)), linearDamping: 0.08, angularDamping: 0.2 })
      b.position.set(-1.6 + (i % 3) * 1.6 + (i > 2 ? 0.5 : 0), H + 1.5 + i * 1.1, 0)
      b.quaternion.setFromEuler(0, 0, (i - 2.5) * 0.3)
      b.sleepSpeedLimit = 0.08
      world.addBody(b)
      return b
    })
    // drag rig: a kinematic body + point constraint
    const hand = new CANNON.Body({ mass: 0, type: CANNON.Body.KINEMATIC })
    hand.collisionFilterGroup = 0
    hand.collisionFilterMask = 0
    world.addBody(hand)
    return { world, bodies, floor, left, right, ceiling, hand, joint: null as CANNON.PointToPointConstraint | null, grabbed: -1, downAt: { x: 0, y: 0 }, moved: 0 }
  }, [])

  // Reduced motion: lay the keys out in two neat rows and skip simulation.
  useEffect(() => {
    if (!reduced) return
    sim.bodies.forEach((b, i) => {
      b.position.set(-1.1 + (i % 3) * 1.1, S / 2 + Math.floor(i / 3) * (S + 0.1), 0)
      b.quaternion.set(0, 0, 0, 1)
      b.velocity.setZero()
      b.angularVelocity.setZero()
    })
  }, [reduced, sim])

  const parts = useMemo(() => {
    const geo = new RoundedBoxGeometry(S, S, D, 4, 0.12)
    const edges = edgesOf(new THREE.BoxGeometry(S, S, D), 1)
    const cap = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.75, roughness: 0.32 }), u)
    const hot = withCompile(new THREE.MeshStandardMaterial({ color: pal.signal, metalness: 0.25, roughness: 0.4, emissive: new THREE.Color(pal.signal), emissiveIntensity: 0.25 }), u)
    const lines = compileLines(u, pal.wire, { additive: pal.additive, residual: 0.25 })
    const faces = KEYS.map((k) => {
      const { texture, aspect } = labelTexture(k.label, { color: k.hot ? '#ffffff' : pal.fg, size: 44, weight: 500 })
      const m = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false })
      return { m, aspect, texture }
    })
    return { geo, edges, cap, hot, lines, faces }
  }, [pal, u])
  useEffect(
    () => () => {
      ;[parts.geo, parts.edges, parts.cap, parts.hot, parts.lines].forEach((p) => p.dispose())
      parts.faces.forEach((f) => (f.m.dispose(), f.texture.dispose()))
      delete document.documentElement.dataset.cursor
    },
    [parts],
  )

  // pointer → local physics coordinates (on the z = 0 plane of the box)
  const toLocal = (clientX: number, clientY: number) => {
    const g = group.current
    if (!g) return null
    const ndc = new THREE.Vector3((clientX / live.vw) * 2 - 1, -(clientY / live.vh) * 2 + 1, 0.5)
    ndc.unproject(camera)
    const dir = ndc.sub(camera.position).normalize()
    const t = -camera.position.z / dir.z
    const world = camera.position.clone().add(dir.multiplyScalar(t))
    return g.worldToLocal(world)
  }

  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (sim.grabbed < 0) return
      const p = toLocal(e.clientX, e.clientY)
      if (!p) return
      sim.moved += Math.abs(e.movementX) + Math.abs(e.movementY)
      sim.hand.position.set(p.x, Math.max(0.2, p.y), 0)
    }
    const up = () => {
      if (sim.grabbed < 0) return
      const k = KEYS[sim.grabbed]
      if (sim.moved < 6 && k.href) {
        if (k.href.startsWith('mailto:')) window.location.href = k.href
        else window.open(k.href, '_blank', 'noopener,noreferrer')
      }
      if (sim.joint) sim.world.removeConstraint(sim.joint)
      sim.joint = null
      sim.grabbed = -1
      document.documentElement.style.userSelect = ''
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim])

  const grab = (i: number) => (e: ThreeEvent<PointerEvent>) => {
    if ((e.nativeEvent.target as Element | null)?.closest('a, button, input, select, textarea, label')) return
    e.stopPropagation()
    const b = sim.bodies[i]
    const p = toLocal(e.nativeEvent.clientX, e.nativeEvent.clientY)
    if (!p) return
    sim.grabbed = i
    sim.moved = 0
    document.documentElement.style.userSelect = 'none'
    if (reduced) return // click still works
    sim.hand.position.set(p.x, p.y, 0)
    const pivot = b.pointToLocalFrame(new CANNON.Vec3(p.x, p.y, b.position.z))
    sim.joint = new CANNON.PointToPointConstraint(b, pivot, sim.hand, new CANNON.Vec3(0, 0, 0), 60)
    sim.world.addConstraint(sim.joint)
    b.wakeUp()
  }

  const g = useRef(new CANNON.Vec3())
  useFrame((st, dt) => {
    const grp = group.current
    if (!grp) return
    // follow the anchor: the box's floor sits on the anchor's bottom edge
    const a = activeAnchor(camera, st.clock.elapsedTime, (el) => el.dataset.anchor === 'keys')
    if (a) {
      const scale = a.h / H
      const w = Math.max(3.2, Math.min(8, a.w / scale))
      if (Math.abs(w - box.current.w) > 0.01) {
        box.current.w = w
        sim.left.position.x = -w / 2
        sim.right.position.x = w / 2
        sim.bodies.forEach((b) => {
          b.position.x = THREE.MathUtils.clamp(b.position.x, -w / 2 + S / 2, w / 2 - S / 2)
          b.wakeUp()
        })
      }
      grp.position.x = damp(grp.position.x, a.x, 8, dt)
      grp.position.y = damp(grp.position.y, a.y - a.h / 2, 8, dt)
      grp.scale.setScalar(scale)
    }
    if (!reduced) {
      // gravity follows device tilt on phones
      if (live.tilt.active) {
        g.current.set(live.tilt.x * 16, -14 + Math.max(0, -live.tilt.y) * 6, 0)
        sim.world.gravity.copy(g.current)
        sim.bodies.forEach((b) => b.wakeUp())
      }
      sim.world.step(1 / 60, Math.min(dt, 0.05), 3)
    }
    sim.bodies.forEach((b, i) => {
      const m = meshes.current[i]
      if (!m) return
      m.position.set(b.position.x, b.position.y, b.position.z)
      m.quaternion.set(b.quaternion.x, b.quaternion.y, b.quaternion.z, b.quaternion.w)
    })
  })

  return (
    <group ref={group}>
      {KEYS.map((k, i) => {
        const f = parts.faces[i]
        const w = Math.min(S * 0.8, 0.13 * f.aspect)
        return (
          <group key={k.label} ref={(el) => { meshes.current[i] = el }}>
            <mesh
              geometry={parts.geo}
              material={k.hot ? parts.hot : parts.cap}
              onPointerDown={grab(i)}
              onPointerOver={() => (document.documentElement.dataset.cursor = k.href ? 'open' : 'drag')}
              onPointerOut={() => delete document.documentElement.dataset.cursor}
            />
            <lineSegments geometry={parts.edges} material={parts.lines} />
            <mesh position={[0, 0, D / 2 + 0.002]} material={f.m} scale={[w, w / f.aspect, 1]}>
              <planeGeometry />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function ContactScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  useCameraReset()
  return (
    <>
      <DraftingGrid pal={pal} />
      <Keys pal={pal} reduced={reduced} />
    </>
  )
}
