// AI: twelve capability nodes wired into a neural field. The cursor (or tilt)
// parts the field and lights the nodes it passes; signals run along the edges;
// asking the scripted demo sends a pulse through the whole network.
import { useEffect, useMemo, useRef, type ReactNode } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { AI_PAGE } from '../../content/ai'
import { live } from '../../lib/live'
import { scrollToTarget } from '../../lib/motion'
import { TIER } from '../../lib/quality'
import { ch, useStore } from '../../state/store'
import { compileUniforms, damp, G, withCompile } from '../compile'
import { usePalette, type Pal } from '../palette'
import { DraftingGrid } from '../parts/Backdrop'
import { lookInput, pxToWorld } from '../rig'
import { useAnchorFollow, useCameraReset, useIntro } from '../useAnchor'

const N = AI_PAGE.ideas.items.length

function layout() {
  const nodes: THREE.Vector3[] = []
  const inc = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const phi = i * inc
    const R = 1.15 + ((i * 7) % 3) * 0.12
    nodes.push(new THREE.Vector3(Math.cos(phi) * r * R, y * R * 0.95, Math.sin(phi) * r * R))
  }
  const edges: [number, number][] = []
  nodes.forEach((a, i) => {
    const near = nodes
      .map((b, j) => ({ j, d: a.distanceTo(b) }))
      .filter((x) => x.j !== i)
      .sort((p, q) => p.d - q.d)
      .slice(0, 3)
    near.forEach(({ j }) => {
      if (!edges.some(([p, q]) => (p === i && q === j) || (p === j && q === i))) edges.push([i, j])
    })
  })
  return { nodes, edges }
}

function Network({ pal, reduced, fieldCount }: { pal: Pal; reduced: boolean; fieldCount: number }) {
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  useAnchorFollow(group, 'net', { size: 3.1, fill: 0.95 })
  const { nodes, edges } = useMemo(layout, [])
  const u = useMemo(() => compileUniforms({ min: -0.1, max: 0.1, edge: 0.03, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 1.4, 0.3)
  const pulse = useMemo(() => ({ value: 0 }), [])
  const mouse = useMemo(() => ({ value: new THREE.Vector3(99, 99, 0) }), [])
  const glow = useRef<number[]>(new Array(N).fill(0))

  const parts = useMemo(() => {
    const nodeGeo = new THREE.IcosahedronGeometry(0.075, 1)
    const nodeMats = nodes.map(() =>
      withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.6, roughness: 0.35, emissive: new THREE.Color(pal.wire), emissiveIntensity: 0.3 }), u),
    )
    const haloGeo = new THREE.RingGeometry(0.12, 0.13, 40)
    const haloMat = nodes.map(() => new THREE.MeshBasicMaterial({ color: pal.signal, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide }))
    // edges
    const ep: number[] = []
    edges.forEach(([a, b]) => ep.push(...nodes[a].toArray(), ...nodes[b].toArray()))
    // spokes to the core
    nodes.forEach((n) => ep.push(0, 0, 0, ...n.toArray()))
    const edgeGeo = new THREE.BufferGeometry()
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(ep, 3))
    const edgeMat = new THREE.LineBasicMaterial({ color: pal.wire, transparent: true, opacity: 0.22, depthWrite: false, blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending })
    // signals running along edges (GPU)
    const S = edges.length * 3
    const sa = new Float32Array(S * 3)
    const sb = new Float32Array(S * 3)
    const sp = new Float32Array(S * 2)
    for (let i = 0; i < S; i++) {
      const [a, b] = edges[i % edges.length]
      const flip = i % 2 === 0
      ;(flip ? nodes[a] : nodes[b]).toArray(sa, i * 3)
      ;(flip ? nodes[b] : nodes[a]).toArray(sb, i * 3)
      sp[i * 2] = 0.25 + ((i * 37) % 10) / 20
      sp[i * 2 + 1] = ((i * 53) % 100) / 100
    }
    const sigGeo = new THREE.BufferGeometry()
    sigGeo.setAttribute('position', new THREE.BufferAttribute(sa, 3))
    sigGeo.setAttribute('aB', new THREE.BufferAttribute(sb, 3))
    sigGeo.setAttribute('aSp', new THREE.BufferAttribute(sp, 2))
    const sigMat = new THREE.ShaderMaterial({
      uniforms: { uTime: G.uTime, uPulse: pulse, uColor: { value: new THREE.Color(pal.signal) }, uPx: { value: Math.min(2, window.devicePixelRatio) }, uPresence: G.uPresence },
      vertexShader: `attribute vec3 aB; attribute vec2 aSp; uniform float uTime, uPulse, uPx; varying float vA;
        void main(){ float t = fract(uTime * aSp.x * (1.0 + uPulse * 3.0) + aSp.y); vec3 p = mix(position, aB, t);
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = (3.0 + uPulse * 4.0) * uPx; vA = sin(t * 3.14159); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uPresence; varying float vA;
        void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(uColor, vA * (1.0 - d * 2.0) * uPresence);
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    // the neural field: parts around the cursor
    const fp = new Float32Array(fieldCount * 3)
    let s = 17
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
    for (let i = 0; i < fieldCount; i++) {
      const R = 0.5 + Math.cbrt(r()) * 2.1
      const a = r() * Math.PI * 2
      const b = Math.acos(2 * r() - 1)
      fp[i * 3] = R * Math.sin(b) * Math.cos(a) * 1.25
      fp[i * 3 + 1] = R * Math.cos(b) * 0.9
      fp[i * 3 + 2] = R * Math.sin(b) * Math.sin(a)
    }
    const fieldGeo = new THREE.BufferGeometry()
    fieldGeo.setAttribute('position', new THREE.BufferAttribute(fp, 3))
    const fieldMat = new THREE.ShaderMaterial({
      uniforms: { uTime: G.uTime, uMouse: mouse, uPulse: pulse, uA: { value: new THREE.Color(pal.fg) }, uHot: { value: new THREE.Color(pal.wire) }, uPx: { value: Math.min(2, window.devicePixelRatio) }, uPresence: G.uPresence, uBuild: G.uBuild },
      vertexShader: `uniform float uTime, uPulse, uPx, uBuild; uniform vec3 uMouse; varying float vHot; varying float vA;
        void main(){
          vec3 p = position * mix(0.4, 1.0, uBuild);
          p += 0.03 * vec3(sin(uTime * 0.6 + position.y * 3.0), cos(uTime * 0.5 + position.x * 3.0), 0.0);
          vec4 wp = modelMatrix * vec4(p, 1.0);
          vec3 d = wp.xyz - uMouse; d.z *= 0.35;
          float k = exp(-dot(d, d) * 2.2);
          wp.xyz += normalize(d + 1e-4) * k * 0.45;
          vHot = k + uPulse * 0.4;
          vec4 mv = viewMatrix * wp; gl_Position = projectionMatrix * mv;
          gl_PointSize = (1.6 + k * 3.0) * uPx * (6.0 / -mv.z);
          vA = smoothstep(14.0, 4.0, -mv.z);
        }`,
      fragmentShader: `uniform vec3 uA, uHot; uniform float uPresence; varying float vHot; varying float vA;
        void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(mix(uA, uHot, clamp(vHot, 0.0, 1.0)), (0.22 + vHot * 0.6) * vA * (1.0 - d * 2.0) * uPresence);
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    const coreGeo = new THREE.IcosahedronGeometry(0.2, 2)
    const coreMat = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.9, roughness: 0.2, emissive: new THREE.Color(pal.signal), emissiveIntensity: 0.4, wireframe: false }), u)
    return { nodeGeo, nodeMats, haloGeo, haloMat, edgeGeo, edgeMat, sigGeo, sigMat, fieldGeo, fieldMat, coreGeo, coreMat }
  }, [nodes, edges, pal, u, pulse, mouse, fieldCount])

  useEffect(
    () => () => {
      Object.values(parts).forEach((p) => (Array.isArray(p) ? p.forEach((m) => m.dispose()) : (p as { dispose: () => void }).dispose()))
      delete document.documentElement.dataset.cursor
    },
    [parts],
  )

  // Click a node → scroll the ideas list to it.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if ((e.target as Element | null)?.closest('a, button, input, select, textarea, label')) return
      const h = ch('ai.hover', -1)
      if (h >= 0) scrollToTarget(`#idea-${h}`, -window.innerHeight * 0.35)
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const tmp = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, dt) => {
    const g = group.current
    const I = inner.current
    if (!g || !I) return
    if (!reduced) I.rotation.y += dt * 0.08
    const look = lookInput()
    I.rotation.x = damp(I.rotation.x, reduced ? 0 : look.y * -0.25, 2, dt)

    // cursor → world (z = 0 plane)
    const k = pxToWorld(camera)
    mouse.value.set(camera.position.x + (live.pointer.x - live.vw / 2) * k, camera.position.y - (live.pointer.y - live.vh / 2) * k, 0)
    if (live.tilt.active) mouse.value.set(g.position.x + live.tilt.x * 1.2, g.position.y - live.tilt.y * 1.2, 0)

    // pulse from the scripted demo decays
    pulse.value = damp(pulse.value, 0, 1.6, dt)
    if (live.chan['ai.pulse']) {
      pulse.value = Math.max(pulse.value, live.chan['ai.pulse'])
      live.chan['ai.pulse'] = 0
    }

    // nearest node to the pointer (screen space) lights up
    let best = -1
    let bd = 1e9
    const active = ch('ai.node', 0)
    nodes.forEach((n, i) => {
      tmp.copy(n).applyMatrix4(I.matrixWorld)
      const d = Math.hypot(tmp.x - mouse.value.x, tmp.y - mouse.value.y)
      if (d < bd) {
        bd = d
        best = i
      }
    })
    const scale = g.scale.x || 1
    const hover = bd < 0.28 * scale && live.pointer.moved ? best : -1
    if (ch('ai.hover', -2) !== hover) {
      useStore.getState().setCh('ai.hover', hover)
      if (hover >= 0) document.documentElement.dataset.cursor = 'idea'
      else delete document.documentElement.dataset.cursor
    }
    nodes.forEach((_, i) => {
      const target = i === hover ? 1 : i === active ? 0.8 : 0
      glow.current[i] = damp(glow.current[i], target, 6, dt)
      const m = parts.nodeMats[i]
      m.emissive.set(glow.current[i] > 0.4 ? pal.signal : pal.wire)
      m.emissiveIntensity = 0.3 + glow.current[i] * 2.2 + pulse.value
      parts.haloMat[i].opacity = glow.current[i] * 0.9
    })
    parts.coreMat.emissiveIntensity = 0.4 + pulse.value * 3
  })

  return (
    <group ref={group}>
      <group ref={inner}>
        <points geometry={parts.fieldGeo} material={parts.fieldMat} frustumCulled={false} />
        <lineSegments geometry={parts.edgeGeo} material={parts.edgeMat} />
        <points geometry={parts.sigGeo} material={parts.sigMat} frustumCulled={false} />
        <mesh geometry={parts.coreGeo} material={parts.coreMat} />
        {nodes.map((n, i) => (
          <group key={i} position={n}>
            <mesh geometry={parts.nodeGeo} material={parts.nodeMats[i]} />
            <Billboard>
              <mesh geometry={parts.haloGeo} material={parts.haloMat[i]} />
            </Billboard>
          </group>
        ))}
      </group>
    </group>
  )
}

/** Face the camera regardless of parent rotation. */
function Billboard({ children }: { children: ReactNode }) {
  const ref = useRef<THREE.Group>(null)
  const q = useMemo(() => new THREE.Quaternion(), [])
  useFrame(({ camera }) => {
    const g = ref.current
    if (!g || !g.parent) return
    g.parent.getWorldQuaternion(q)
    g.quaternion.copy(q.invert()).multiply(camera.quaternion)
  })
  return <group ref={ref}>{children}</group>
}

export default function AIScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  const tier = useStore((s) => s.tier)
  useCameraReset()
  const q = TIER[tier].particles
  return (
    <>
      <DraftingGrid pal={pal} opacity={0.05} />
      <Network pal={pal} reduced={reduced} fieldCount={Math.round(2600 * Math.max(0.2, q))} />
    </>
  )
}
