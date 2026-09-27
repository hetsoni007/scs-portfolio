// React Native: one codebase compiles to two devices. A source slab of
// (abstract) code feeds two phones through streams of build particles; both
// phones show the same real app, because it is the same code.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { CASES } from '../../content/work'
import { TIER } from '../../lib/quality'
import { useStore } from '../../state/store'
import { compileLines, compileUniforms, damp, edgesOf, G, withCompile } from '../compile'
import { usePalette, type Pal } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { Phone, type PhoneHandle } from '../parts/Phone'
import { screenTexture } from '../parts/screens'
import { lookInput } from '../rig'
import { useAnchorFollow, useCameraReset, useIntro } from '../useAnchor'

const SHOWN = CASES.filter((c) => c.kind === 'shipped' && c.screens.length).flatMap((c) => c.screens.slice(0, 2).map((s) => s.src))

function codeTexture(pal: Pal) {
  const c = document.createElement('canvas')
  c.width = 512
  c.height = 340
  const g = c.getContext('2d')!
  g.fillStyle = '#070404'
  g.fillRect(0, 0, 512, 340)
  let y = 30
  let s = 9
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
  for (let i = 0; i < 13; i++) {
    const indent = [0, 1, 2, 2, 1, 2, 3, 3, 2, 1, 1, 2, 0][i] * 26
    let x = 30 + indent
    const words = 2 + Math.floor(r() * 4)
    for (let w = 0; w < words; w++) {
      const len = 20 + r() * 70
      g.fillStyle = w === 0 ? pal.signal : r() > 0.6 ? pal.wire : 'rgba(236,231,220,0.55)'
      g.fillRect(x, y, len, 9)
      x += len + 10
    }
    y += 22
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

export default function RNScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  const tier = useStore((s) => s.tier)
  useCameraReset()
  const group = useRef<THREE.Group>(null)
  const inner = useRef<THREE.Group>(null)
  const left = useRef<PhoneHandle>(null)
  const right = useRef<PhoneHandle>(null)
  useAnchorFollow(group, 'twin', { size: { w: 3.4, h: 2.4 }, fit: 'contain', fill: 0.95 })
  const texs = useMemo(() => SHOWN.map((s) => screenTexture(s)), [])
  const u = useMemo(() => compileUniforms({ min: -0.4, max: 0.4, edge: 0.05, color: pal.signal }), [pal.signal])
  useIntro([u.uProgress], 1.2, 0)

  const parts = useMemo(() => {
    const slab = new RoundedBoxGeometry(1.25, 0.84, 0.06, 3, 0.04)
    const slabMat = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.8, roughness: 0.3 }), u)
    const face = new THREE.PlaneGeometry(1.19, 0.78)
    const tex = codeTexture(pal)
    const faceMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
    const edges = edgesOf(new THREE.BoxGeometry(1.25, 0.84, 0.06), 1)
    const lines = compileLines(u, pal.wire, { additive: pal.additive, residual: 0.35 })
    // build particles: source → each phone along a curve (GPU)
    const N = 260
    const from = new Float32Array(N * 3)
    const seed = new Float32Array(N * 2)
    for (let i = 0; i < N; i++) {
      from[i * 3] = (((i * 37) % 100) / 100 - 0.5) * 1.0
      from[i * 3 + 1] = (((i * 61) % 100) / 100 - 0.5) * 0.6
      from[i * 3 + 2] = 0.05
      seed[i * 2] = i % 2 === 0 ? -1 : 1
      seed[i * 2 + 1] = ((i * 53) % 100) / 100
    }
    const pg = new THREE.BufferGeometry()
    pg.setAttribute('position', new THREE.BufferAttribute(from, 3))
    pg.setAttribute('aSeed', new THREE.BufferAttribute(seed, 2))
    const pm = new THREE.ShaderMaterial({
      uniforms: { uTime: G.uTime, uA: { value: new THREE.Color(pal.wire) }, uB: { value: new THREE.Color(pal.signal) }, uPx: { value: Math.min(2, window.devicePixelRatio) }, uPresence: G.uPresence },
      vertexShader: `attribute vec2 aSeed; uniform float uTime, uPx; varying float vT;
        void main(){ float t = fract(uTime * 0.35 + aSeed.y); vT = t;
          vec3 a = position; vec3 b = vec3(aSeed.x * 1.25, -0.77, 0.85); vec3 c = vec3(aSeed.x * 0.75, 0.25, 0.7);
          vec3 p = mix(mix(a, c, t), mix(c, b, t), t);
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv; gl_PointSize = 2.6 * uPx * (6.0 / -mv.z); }`,
      fragmentShader: `uniform vec3 uA, uB; uniform float uPresence; varying float vT;
        void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(mix(uA, uB, vT), sin(vT * 3.14159) * (1.0 - d * 2.0) * uPresence);
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    return { slab, slabMat, face, tex, faceMat, edges, lines, pg, pm }
  }, [pal, u])
  useEffect(() => () => Object.values(parts).forEach((p) => p.dispose()), [parts])

  // both phones compile in, then share the same screen cycle
  useEffect(() => {
    const phones = [left.current, right.current]
    phones.forEach((p) => p && Object.assign(p.state, { progress: reduced ? 1 : 0, power: reduced ? 1 : 0, explode: 0, layer: -1 }))
    if (reduced) return
    let raf = 0
    const t0 = performance.now()
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / 2400)
      phones.forEach((p, i) => {
        if (!p) return
        const kk = Math.min(1, Math.max(0, k * 1.2 - i * 0.15))
        p.state.progress = kk * kk * (3 - 2 * kk)
        p.state.power = Math.max(0, (kk - 0.75) / 0.25)
      })
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  const cyc = useRef({ t: 0, i: 0, shown: -1 })
  useFrame((st, dt) => {
    const c = cyc.current
    c.t += dt
    if (c.t > 3.4 && !reduced) {
      c.t = 0
      c.i = (c.i + 1) % texs.length
    }
    if (c.i !== c.shown) {
      left.current?.show(texs[c.i])
      right.current?.show(texs[c.i])
      c.shown = c.i
    }
    const look = lookInput()
    const L = left.current?.group
    const R = right.current?.group
    const f = reduced ? 0 : 1
    if (L) {
      L.position.set(-1.25, -0.05, 0.45)
      L.scale.setScalar(0.95)
      L.rotation.set(0.04 - look.y * 0.1 * f, 0.42 + look.x * 0.25 * f, 0.04)
    }
    if (R) {
      R.position.set(1.25, -0.05, 0.45)
      R.scale.setScalar(0.95)
      R.rotation.set(0.04 - look.y * 0.1 * f, -0.42 + look.x * 0.25 * f, -0.04)
    }
    if (inner.current) inner.current.rotation.x = damp(inner.current.rotation.x, 0.08 - look.y * 0.08 * f, 2, dt)
    void st
  })

  const q = TIER[tier].particles
  return (
    <>
      <DraftingGrid pal={pal} />
      {q > 0 ? <Dust pal={pal} count={Math.round(300 * q)} /> : null}
      <group ref={group}>
        <group ref={inner}>
          <group position={[0, 0.72, -0.4]}>
            <mesh geometry={parts.slab} material={parts.slabMat} />
            <mesh geometry={parts.face} material={parts.faceMat} position={[0, 0, 0.032]} />
            <lineSegments geometry={parts.edges} material={parts.lines} />
            {!reduced ? <points geometry={parts.pg} material={parts.pm} frustumCulled={false} position={[0, 0, 0]} /> : null}
          </group>
          <Phone ref={left} pal={pal} reduced={reduced} initial={texs[0]} />
          <Phone ref={right} pal={pal} reduced={reduced} initial={texs[0]} />
        </group>
      </group>
    </>
  )
}
