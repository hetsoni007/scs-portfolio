// The phone rig: the site's recurring object (DESIGN.md §7). Procedural, no GLTF.
// Layers: display (Interface) · frame · board (Logic) · chip (Intelligence).
// All geometry is authored in phone space so the compile scan runs bottom→top
// across every part in one sweep.
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { compileLines, compileUniforms, damp, withCompile, type CompileUniforms } from '../compile'
import type { Pal } from '../palette'
import { blankTexture, texAspect } from './screens'

export const PHONE = { W: 0.74, H: 1.52, D: 0.078, R: 0.1 }

/** Mutable, per-frame state the parent scene writes into. */
export type PhoneState = {
  progress: number // compile 0..1
  explode: number // 0 assembled … 1 exploded
  layer: number // highlighted layer: -1 none, 0 display, 1 board, 2 chip
  power: number // screen brightness 0..1
}

export type PhoneHandle = {
  group: THREE.Group
  state: PhoneState
  uniforms: CompileUniforms
  /** Cross-fade the screen to a new texture with a scan wipe. */
  show: (tex: THREE.Texture) => void
}

// ── geometry helpers ──────────────────────────────────────
function roundedRect(w: number, h: number, r: number, z: number, seg = 8) {
  const pts: THREE.Vector3[] = []
  const corners: [number, number, number][] = [
    [w / 2 - r, h / 2 - r, 0],
    [-w / 2 + r, h / 2 - r, Math.PI / 2],
    [-w / 2 + r, -h / 2 + r, Math.PI],
    [w / 2 - r, -h / 2 + r, (3 * Math.PI) / 2],
  ]
  for (const [cx, cy, a0] of corners)
    for (let i = 0; i <= seg; i++) {
      const a = a0 + (i / seg) * (Math.PI / 2)
      pts.push(new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z))
    }
  return pts
}
function loopSegments(pts: THREE.Vector3[], out: number[]) {
  for (let i = 0; i < pts.length; i++) {
    const a = pts[i]
    const b = pts[(i + 1) % pts.length]
    out.push(a.x, a.y, a.z, b.x, b.y, b.z)
  }
}
function circle(cx: number, cy: number, r: number, z: number, out: number[], seg = 24) {
  const pts = Array.from({ length: seg }, (_, i) => {
    const a = (i / seg) * Math.PI * 2
    return new THREE.Vector3(cx + Math.cos(a) * r, cy + Math.sin(a) * r, z)
  })
  loopSegments(pts, out)
}
function seg(out: number[], a: number[], b: number[]) {
  out.push(a[0], a[1], a[2], b[0], b[1], b[2])
}
function lineGeo(arr: number[]) {
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3))
  return g
}
// Seeded random so the board traces are identical on every visit.
function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

// ── screen shader: top-anchored cover fit, rounded mask, scan wipe ──
const SCREEN_VERT = /* glsl */ `
  varying vec2 vUv; varying vec3 vCmp;
  void main(){ vUv = uv; vCmp = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const SCREEN_FRAG = /* glsl */ `
  varying vec2 vUv; varying vec3 vCmp;
  uniform sampler2D uA, uB; uniform float uAspA, uAspB, uPlane, uMix, uPower, uTime;
  uniform float uProgress, uBuild, uMin, uMax, uEdge; uniform vec3 uEdgeColor, uBg;
  vec2 cover(vec2 uv, float tex, float plane){
    vec2 s = vec2(1.0);
    if (tex > plane) s.x = plane / tex; else s.y = tex / plane;
    return vec2(uv.x * s.x + (1.0 - s.x) * 0.5, uv.y * s.y + (1.0 - s.y));
  }
  float rbox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main(){
    float cut = mix(uMin - uEdge, uMax + uEdge, clamp(uProgress * uBuild, 0.0, 1.0));
    if (vCmp.y > cut) discard;
    vec2 p = (vUv - 0.5) * vec2(uPlane, 1.0);
    float d = rbox(p, vec2(uPlane * 0.5, 0.5), 0.062);
    if (d > 0.0) discard;
    float line = 1.0 - uMix * 1.08;             // wipe travels top → bottom
    vec3 a = texture2D(uA, cover(vUv, uAspA, uPlane)).rgb;
    vec3 b = texture2D(uB, cover(vUv, uAspB, uPlane)).rgb;
    vec3 col = vUv.y > line ? b : a;
    float glow = (1.0 - smoothstep(0.0, 0.012, abs(vUv.y - line))) * step(0.001, uMix) * step(uMix, 0.999);
    col = mix(uBg, col * 0.76, uPower);          // stays under the bloom threshold; only the scan glows
    col += uEdgeColor * glow * 1.6;
    col += uEdgeColor * (1.0 - smoothstep(0.0, uEdge * 1.5, cut - vCmp.y)) * 1.4 * step(cut, uMax);
    col *= 0.94 + 0.06 * sin(vUv.y * 900.0 + uTime * 2.0) * uPower * 0.35;
    gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`

type Props = { pal: Pal; reduced?: boolean; initial?: THREE.Texture }

export const Phone = forwardRef<PhoneHandle, Props>(function Phone({ pal, reduced, initial }, ref) {
  const group = useRef<THREE.Group>(null!)
  const display = useRef<THREE.Group>(null!)
  const board = useRef<THREE.Group>(null!)
  const chip = useRef<THREE.Group>(null!)
  const state = useRef<PhoneState>({ progress: 0, explode: 0, layer: -1, power: 0 }).current
  const live = useRef({ explode: 0, layer: [0, 0, 0], mix: 0, wiping: false, next: null as THREE.Texture | null })

  const { W, H, D, R } = PHONE
  const u = useMemo(() => compileUniforms({ min: -H / 2 - 0.02, max: H / 2 + 0.02, edge: 0.05, color: pal.signal }), [H, pal.signal])

  const parts = useMemo(() => {
    // Solids
    const frameGeo = new RoundedBoxGeometry(W, H, D, 6, R)
    const glassGeo = new RoundedBoxGeometry(W - 0.018, H - 0.018, 0.006, 4, R - 0.008)
    const islandGeo = new RoundedBoxGeometry(0.2, 0.052, 0.006, 3, 0.026).translate(0, H / 2 - 0.075, 0.006)
    const btnGeo = [
      new RoundedBoxGeometry(0.014, 0.19, 0.03, 2, 0.006).translate(W / 2 + 0.004, 0.26, 0),
      new RoundedBoxGeometry(0.014, 0.1, 0.03, 2, 0.006).translate(-W / 2 - 0.004, 0.36, 0),
      new RoundedBoxGeometry(0.014, 0.1, 0.03, 2, 0.006).translate(-W / 2 - 0.004, 0.22, 0),
    ]
    const camGeo = new RoundedBoxGeometry(0.3, 0.3, 0.022, 4, 0.07).translate(-W / 2 + 0.2, H / 2 - 0.2, -D / 2 - 0.009)
    const lensGeo = [
      [-W / 2 + 0.13, H / 2 - 0.13],
      [-W / 2 + 0.13, H / 2 - 0.27],
      [-W / 2 + 0.27, H / 2 - 0.2],
    ].map(([x, y]) => new THREE.CylinderGeometry(0.048, 0.052, 0.03, 28).rotateX(Math.PI / 2).translate(x, y, -D / 2 - 0.022))
    const boardGeo = new RoundedBoxGeometry(W - 0.1, H - 0.34, 0.012, 3, 0.03).translate(0, 0.08, 0)
    const batteryGeo = new RoundedBoxGeometry(W - 0.22, 0.52, 0.03, 3, 0.03).translate(0, -0.38, 0.018)
    const socGeo = new RoundedBoxGeometry(0.16, 0.16, 0.022, 2, 0.012).translate(0.1, 0.36, 0.014)
    const smallChips = [
      [-0.2, 0.46, 0.09, 0.06],
      [-0.2, 0.3, 0.07, 0.1],
      [0.22, 0.12, 0.08, 0.08],
      [-0.12, 0.12, 0.12, 0.05],
    ].map(([x, y, w, h]) => new RoundedBoxGeometry(w, h, 0.014, 2, 0.006).translate(x, y, 0.012))
    const aiGeo = new RoundedBoxGeometry(0.42, 0.42, 0.03, 3, 0.03)

    // Wireframes: hand-authored like a technical drawing (clean, not triangle soup).
    const frameLines: number[] = []
    const outer = roundedRect(W, H, R, D / 2)
    loopSegments(outer, frameLines)
    loopSegments(roundedRect(W, H, R, -D / 2), frameLines)
    for (let i = 0; i < outer.length; i += 9) {
      const p = outer[i]
      seg(frameLines, [p.x, p.y, D / 2], [p.x, p.y, -D / 2])
    }
    loopSegments(roundedRect(0.3, 0.3, 0.07, -D / 2 - 0.02).map((p) => p.add(new THREE.Vector3(-W / 2 + 0.2, H / 2 - 0.2, 0))), frameLines)
    circle(-W / 2 + 0.13, H / 2 - 0.13, 0.05, -D / 2 - 0.037, frameLines)
    circle(-W / 2 + 0.13, H / 2 - 0.27, 0.05, -D / 2 - 0.037, frameLines)
    circle(-W / 2 + 0.27, H / 2 - 0.2, 0.05, -D / 2 - 0.037, frameLines)
    // dimension ticks along the right edge (a drafting detail)
    for (let i = 0; i <= 10; i++) {
      const y = -H / 2 + (i / 10) * H
      seg(frameLines, [W / 2 + 0.06, y, 0], [W / 2 + (i % 5 === 0 ? 0.11 : 0.085), y, 0])
    }
    seg(frameLines, [W / 2 + 0.06, -H / 2, 0], [W / 2 + 0.06, H / 2, 0])

    const displayLines: number[] = []
    loopSegments(roundedRect(W - 0.05, H - 0.05, R - 0.02, 0.004), displayLines)
    loopSegments(roundedRect(0.2, 0.052, 0.026, 0.01).map((p) => p.add(new THREE.Vector3(0, H / 2 - 0.075, 0))), displayLines)

    const boardLines: number[] = []
    loopSegments(roundedRect(W - 0.1, H - 0.34, 0.03, 0.008).map((p) => p.add(new THREE.Vector3(0, 0.08, 0))), boardLines)
    const r = rng(7)
    for (let i = 0; i < 26; i++) {
      // Manhattan traces between random pads
      const x0 = (r() - 0.5) * (W - 0.18)
      const y0 = 0.08 + (r() - 0.5) * (H - 0.44)
      const x1 = (r() - 0.5) * (W - 0.18)
      const y1 = 0.08 + (r() - 0.5) * (H - 0.44)
      const z = 0.008
      seg(boardLines, [x0, y0, z], [x1, y0, z])
      seg(boardLines, [x1, y0, z], [x1, y1, z])
    }
    loopSegments(roundedRect(W - 0.22, 0.52, 0.03, 0.035).map((p) => p.add(new THREE.Vector3(0, -0.38, 0))), boardLines)

    const chipLines: number[] = []
    loopSegments(roundedRect(0.42, 0.42, 0.03, 0.016), chipLines)
    // a small neural lattice etched on the "Intelligence" die
    const nodes: [number, number][] = []
    for (let c = 0; c < 4; c++) for (let rr = 0; rr < 4; rr++) nodes.push([-0.13 + c * 0.087, -0.13 + rr * 0.087])
    for (let c = 0; c < 3; c++)
      for (let a = 0; a < 4; a++)
        for (let b = 0; b < 4; b++) if ((a + b + c) % 2 === 0) seg(chipLines, [nodes[c * 4 + a][0], nodes[c * 4 + a][1], 0.017], [nodes[(c + 1) * 4 + b][0], nodes[(c + 1) * 4 + b][1], 0.017])
    nodes.forEach(([x, y]) => circle(x, y, 0.012, 0.017, chipLines, 8))

    return {
      frameGeo, glassGeo, islandGeo, btnGeo, camGeo, lensGeo, boardGeo, batteryGeo, socGeo, smallChips, aiGeo,
      frameLines: lineGeo(frameLines),
      displayLines: lineGeo(displayLines),
      boardLines: lineGeo(boardLines),
      chipLines: lineGeo(chipLines),
      screenGeo: new THREE.PlaneGeometry(W - 0.05, H - 0.05),
    }
  }, [W, H, D, R])

  const mats = useMemo(() => {
    const metal = withCompile(new THREE.MeshStandardMaterial({ color: pal.metal, metalness: 0.88, roughness: 0.3, envMapIntensity: 1.25 }), u)
    const glass = withCompile(new THREE.MeshStandardMaterial({ color: pal.glass, metalness: 0.3, roughness: 0.06, envMapIntensity: 1.5 }), u)
    const dark = withCompile(new THREE.MeshStandardMaterial({ color: '#070505', metalness: 1, roughness: 0.08 }), u)
    const board = withCompile(new THREE.MeshStandardMaterial({ color: pal.board, metalness: 0.45, roughness: 0.55 }), u)
    const chipM = withCompile(new THREE.MeshStandardMaterial({ color: '#161010', metalness: 0.75, roughness: 0.32, emissive: new THREE.Color(pal.signal), emissiveIntensity: 0 }), u)
    const battery = withCompile(new THREE.MeshStandardMaterial({ color: '#241a1a', metalness: 0.2, roughness: 0.7 }), u)
    const lines = (color: string, opacity = 0.7) => compileLines(u, color, { opacity, additive: pal.additive })
    const screen = new THREE.ShaderMaterial({
      uniforms: {
        ...u,
        uA: { value: initial ?? blankTexture },
        uB: { value: initial ?? blankTexture },
        uAspA: { value: 0.46 },
        uAspB: { value: 0.46 },
        uPlane: { value: (W - 0.05) / (H - 0.05) },
        uMix: { value: 0 },
        uPower: { value: 0 },
        uBg: { value: new THREE.Color(pal.glass) },
      },
      vertexShader: SCREEN_VERT,
      fragmentShader: SCREEN_FRAG,
      toneMapped: false,
    })
    return {
      metal, glass, dark, board, chip: chipM, battery, screen,
      frameL: lines(pal.wire),
      displayL: lines(pal.wire, 0.8),
      boardL: lines(pal.wire, 0.55),
      chipL: lines(pal.wire, 0.8),
    }
  }, [u, pal, initial, W, H])

  useEffect(
    () => () => {
      Object.values(mats).forEach((m) => m.dispose())
      Object.values(parts).forEach((g) => (Array.isArray(g) ? g.forEach((x) => x.dispose()) : g.dispose()))
    },
    [mats, parts],
  )

  useImperativeHandle(
    ref,
    () => ({
      group: group.current,
      state,
      uniforms: u,
      show: (tex: THREE.Texture) => {
        const s = mats.screen.uniforms
        if (s.uA.value === tex && !live.current.wiping) return
        if (reduced) {
          s.uA.value = tex
          s.uAspA.value = texAspect(tex)
          return
        }
        if (live.current.wiping) {
          // Land the current wipe before starting the next one.
          s.uA.value = s.uB.value
          s.uAspA.value = s.uAspB.value
        }
        s.uB.value = tex
        s.uAspB.value = texAspect(tex)
        s.uMix.value = 0
        live.current.wiping = true
      },
    }),
    [mats, state, u, reduced],
  )

  const layerLines = [mats.displayL, mats.boardL, mats.chipL]

  useFrame((_, dt) => {
    const L = live.current
    u.uProgress.value = state.progress
    L.explode = damp(L.explode, state.explode, 3.2, dt)
    const e = L.explode
    // the frame ghosts out when exploded so the layers behind it read
    const ghost = e > 0.02
    if (mats.metal.transparent !== ghost) {
      mats.metal.transparent = ghost
      mats.metal.needsUpdate = true
    }
    mats.metal.opacity = 1 - e * 0.72
    mats.metal.depthWrite = !ghost
    display.current.position.z = D / 2 + 0.001 + e * 0.62
    board.current.position.z = -e * 0.5
    chip.current.position.z = -e * 1.02
    chip.current.rotation.z = e * 0.12

    const s = mats.screen.uniforms
    s.uPower.value = damp(s.uPower.value, state.power, 2.5, dt)
    // aspect may only be known after the image loads
    s.uAspA.value = texAspect(s.uA.value as THREE.Texture)
    s.uAspB.value = texAspect(s.uB.value as THREE.Texture)
    if (L.wiping) {
      s.uMix.value = Math.min(1, s.uMix.value + dt / 0.85)
      if (s.uMix.value >= 1) {
        s.uA.value = s.uB.value
        s.uAspA.value = s.uAspB.value
        s.uMix.value = 0
        L.wiping = false
      }
    }

    // Highlight the active layer: its linework turns ember red and brightens.
    for (let i = 0; i < 3; i++) {
      L.layer[i] = damp(L.layer[i], state.layer === i ? 1 : 0, 4, dt)
      const m = layerLines[i]
      ;(m.uniforms.uColor.value as THREE.Color).set(pal.wire).lerp(new THREE.Color(pal.signal), L.layer[i])
      m.uniforms.uResidual.value = 0.07 + L.layer[i] * 0.5 * e
    }
    mats.chip.emissiveIntensity = 0.15 + L.layer[2] * 1.6 * e
  })

  const P = parts
  return (
    <group ref={group}>
      {/* frame + camera module (stays at z = 0) */}
      <mesh geometry={P.frameGeo} material={mats.metal} />
      {P.btnGeo.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.metal} />
      ))}
      <mesh geometry={P.camGeo} material={mats.glass} />
      {P.lensGeo.map((g, i) => (
        <mesh key={i} geometry={g} material={mats.dark} />
      ))}
      <lineSegments geometry={P.frameLines} material={mats.frameL} />

      {/* Interface: glass + live screen */}
      <group ref={display}>
        <mesh geometry={P.glassGeo} material={mats.glass} />
        <mesh geometry={P.screenGeo} material={mats.screen} position={[0, 0, 0.0035]} />
        <mesh geometry={P.islandGeo} material={mats.dark} />
        <lineSegments geometry={P.displayLines} material={mats.displayL} />
      </group>

      {/* Logic: board, SoC, battery, traces */}
      <group ref={board}>
        <mesh geometry={P.boardGeo} material={mats.board} />
        <mesh geometry={P.batteryGeo} material={mats.battery} />
        <mesh geometry={P.socGeo} material={mats.metal} />
        {P.smallChips.map((g, i) => (
          <mesh key={i} geometry={g} material={mats.metal} />
        ))}
        <lineSegments geometry={P.boardLines} material={mats.boardL} />
      </group>

      {/* Intelligence: the AI die */}
      <group ref={chip} position={[0.02, 0.2, 0]}>
        <mesh geometry={P.aiGeo} material={mats.chip} />
        <lineSegments geometry={P.chipLines} material={mats.chipL} />
      </group>
    </group>
  )
})
