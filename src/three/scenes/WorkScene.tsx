// Work: a depth corridor of case plates. Scroll flies you through it; the plate
// in focus is sharp and in colour, the rest recede. Hover ripples + splits the
// image under the pointer; click rebuilds into that case study.
import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import { CASES, type CaseStudy } from '../../content/work'
import { live } from '../../lib/live'
import { TIER } from '../../lib/quality'
import { go } from '../../lib/transition'
import { ch, useStore } from '../../state/store'
import { compileUniforms, damp, G } from '../compile'
import { usePalette, type Pal } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { labelMaterial } from '../parts/label'
import { plateTexture } from '../parts/plate'
import { blankTexture, screenTexture, texAspect } from '../parts/screens'
import { measure } from '../rig'
import { useCameraReset } from '../useAnchor'

const GAP = 2.7
const PW = 1.25
const PH = 2.1

const VERT = /* glsl */ `
  varying vec2 vUv; varying vec3 vP;
  void main(){ vUv = uv; vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const FRAG = /* glsl */ `
  varying vec2 vUv; varying vec3 vP;
  uniform sampler2D uMap; uniform float uAsp, uPlane, uHoverAmt, uFocus, uFade, uTime, uProgress, uBuild;
  uniform vec2 uHover; uniform vec3 uEdge, uBg;
  vec2 cover(vec2 uv){ vec2 s = vec2(1.0); if (uAsp > uPlane) s.x = uPlane / uAsp; else s.y = uAsp / uPlane; return vec2(uv.x * s.x + (1.0 - s.x) * 0.5, uv.y * s.y + (1.0 - s.y)); }
  float rbox(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
  void main(){
    float cut = mix(${(-PH / 2 - 0.1).toFixed(2)}, ${(PH / 2 + 0.1).toFixed(2)}, clamp(uProgress * uBuild, 0.0, 1.0));
    if (vP.y > cut) discard;
    vec2 p = (vUv - 0.5) * vec2(uPlane, 1.0);
    if (rbox(p, vec2(uPlane * 0.5, 0.5), 0.035) > 0.0) discard;
    vec2 uv = vUv;
    vec2 hp = (uv - uHover) * vec2(uPlane, 1.0);
    float d = length(hp);
    float ripple = sin(d * 46.0 - uTime * 7.0) * exp(-d * 7.0) * uHoverAmt;
    uv += normalize(hp + 1e-5) * ripple * 0.012;
    vec2 off = (uv - uHover) * 0.018 * uHoverAmt;
    vec3 col = vec3(texture2D(uMap, cover(uv + off)).r, texture2D(uMap, cover(uv)).g, texture2D(uMap, cover(uv - off)).b);
    float g = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(g) * 0.55 + uBg * 0.25, col, 0.25 + 0.75 * uFocus);
    col += uEdge * (1.0 - smoothstep(0.0, 0.03, cut - vP.y)) * 1.6;
    gl_FragColor = vec4(col, uFade);
        #include <colorspace_fragment>
      }`

function Plate({ c, index, pal, reduced, theme }: { c: CaseStudy; index: number; pal: Pal; reduced: boolean; theme: 'dark' | 'light' }) {
  const mesh = useRef<THREE.Mesh>(null)
  const group = useRef<THREE.Group>(null)
  const [tex, setTex] = useState<THREE.Texture>(() => (c.screens[0] ? screenTexture(c.cover ?? c.screens[0].src) : blankTexture))
  const hovered = useRef(false)

  useEffect(() => {
    if (c.screens[0]) return
    let alive = true
    let made: THREE.Texture | null = null
    plateTexture(c, theme).then((t) => {
      if (!alive) return t.dispose()
      made = t
      setTex(t)
    })
    return () => {
      alive = false
      made?.dispose()
    }
  }, [c, theme])

  const u = useMemo(() => compileUniforms({ min: -PH / 2, max: PH / 2, color: pal.signal, progress: reduced ? 1 : 0 }), [pal.signal, reduced])
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: tex },
          uAsp: { value: 0.6 },
          uPlane: { value: PW / PH },
          uHover: { value: new THREE.Vector2(0.5, 0.5) },
          uHoverAmt: { value: 0 },
          uFocus: { value: 0 },
          uFade: { value: 1 },
          uTime: G.uTime,
          uProgress: u.uProgress,
          uBuild: G.uBuild,
          uEdge: { value: new THREE.Color(pal.signal) },
          uBg: { value: new THREE.Color(pal.bg) },
        },
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pal, u],
  )
  useEffect(() => {
    mat.uniforms.uMap.value = tex
  }, [mat, tex])

  const frame = useMemo(() => {
    const w = PW / 2 + 0.06
    const h = PH / 2 + 0.06
    const m = 0.12
    const p = [
      -w, h, 0, -w + m, h, 0, -w, h, 0, -w, h - m, 0,
      w, h, 0, w - m, h, 0, w, h, 0, w, h - m, 0,
      -w, -h, 0, -w + m, -h, 0, -w, -h, 0, -w, -h + m, 0,
      w, -h, 0, w - m, -h, 0, w, -h, 0, w, -h + m, 0,
    ]
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
    return { g, m: new THREE.LineBasicMaterial({ color: pal.wire, transparent: true, opacity: 0.6 }) }
  }, [pal.wire])
  const label = useMemo(() => labelMaterial(`${String(index + 1).padStart(2, '0')} — ${c.label.toUpperCase()}`, pal.fg, { size: 36 }), [c.label, index, pal.fg])

  useEffect(
    () => () => {
      mat.dispose()
      frame.g.dispose()
      frame.m.dispose()
      label.dispose()
    },
    [mat, frame, label],
  )

  // Intro: plates compile in sequence
  useEffect(() => {
    if (reduced) return
    const t0 = performance.now() + index * 140
    let raf = 0
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - t0) / 1100))
      u.uProgress.value = p * p * (3 - 2 * p)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [u, index, reduced])

  const side = index % 2 === 0 ? -1 : 1
  useFrame((_, dt) => {
    const U = mat.uniforms
    U.uAsp.value = texAspect(tex)
    const focus = Math.round(live.chan['work.p'] ? live.chan['work.p'] * (CASES.length - 1) : 0) === index || ch('work.hover', -1) === index
    U.uFocus.value = damp(U.uFocus.value, focus ? 1 : 0, 4, dt)
    U.uHoverAmt.value = damp(U.uHoverAmt.value, hovered.current ? 1 : 0, 5, dt)
    // fade plates as they pass the camera
    const wz = group.current ? group.current.getWorldPosition(tmp).z : 0
    U.uFade.value = THREE.MathUtils.clamp((6.4 - wz) / 1.6, 0, 1) * THREE.MathUtils.clamp((wz + 24) / 6, 0, 1)
    frame.m.opacity = 0.2 + U.uFocus.value * 0.6
    if (group.current) group.current.rotation.y = damp(group.current.rotation.y, -side * (0.32 - U.uFocus.value * 0.22), 3, dt)
  })

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.uv) mat.uniforms.uHover.value.copy(e.uv)
  }
  return (
    <group ref={group} position={[0.7 + side * 0.85, (index % 3) * 0.12 - 0.12, -index * GAP]}>
      <mesh
        ref={mesh}
        onPointerMove={onMove}
        onPointerOver={(e) => {
          if ((e.nativeEvent.target as Element)?.closest('a, button')) return
          hovered.current = true
          document.documentElement.dataset.cursor = 'view'
        }}
        onPointerOut={() => {
          hovered.current = false
          delete document.documentElement.dataset.cursor
        }}
        onClick={(e) => {
          if ((e.nativeEvent.target as Element)?.closest('a, button, input, select, textarea')) return
          if (mat.uniforms.uFade.value < 0.5) return
          e.stopPropagation()
          go(`/work/${c.id}/`)
        }}
      >
        <planeGeometry args={[PW, PH, 1, 1]} />
        <primitive object={mat} attach="material" />
      </mesh>
      <lineSegments geometry={frame.g} material={frame.m} />
      <mesh position={[-PW / 2 + (0.09 * label.aspect) / 2, -PH / 2 - 0.16, 0]} material={label.mat} scale={[0.09 * label.aspect, 0.09, 1]}>
        <planeGeometry />
      </mesh>
    </group>
  )
}
const tmp = new THREE.Vector3()

export default function WorkScene() {
  const pal = usePalette()
  const theme = useStore((s) => s.theme)
  const reduced = useStore((s) => s.reduced)
  const tier = useStore((s) => s.tier)
  const camera = useCameraReset()
  const size = useThree((s) => s.size)
  const corridor = useRef<THREE.Group>(null)
  const k = useRef({ z: 0, y: -8 })
  useEffect(() => () => void delete document.documentElement.dataset.cursor, [])

  useFrame((st, dt) => {
    const g = corridor.current
    if (!g) return
    const el = document.querySelector<HTMLElement>('[data-anchor="corridor"]')
    const p = live.chan['work.p'] ?? 0
    // vertical: ride along with the pinned section as it enters/leaves
    const a = el ? measure(el, camera) : null
    const L = reduced ? 100 : 5
    k.current.y = damp(k.current.y, a ? a.y : -8, L, dt)
    k.current.z = damp(k.current.z, 1.2 + p * (CASES.length - 1) * GAP, reduced ? 100 : 3.2, dt)
    g.position.set(0, k.current.y, k.current.z)
    // narrow screens: tighten the zig-zag so plates stay in frame
    g.scale.setScalar(size.width < 700 ? 0.72 : 1)
    if (!reduced) {
      camera.position.x = damp(camera.position.x, live.pointer.nx * 0.25, 2, dt)
      camera.position.y = damp(camera.position.y, live.pointer.ny * 0.15, 2, dt)
      camera.lookAt(0, camera.position.y * 0.5, 0)
    }
    void st
  })

  const q = TIER[tier].particles
  return (
    <>
      <DraftingGrid pal={pal} z={-20} opacity={0.05} />
      {q > 0 ? <Dust pal={pal} count={Math.round(600 * q)} spread={[14, 8, 26]} /> : null}
      <group ref={corridor}>
        {CASES.map((c, i) => (
          <Plate key={c.id} c={c} index={i} pal={pal} reduced={reduced} theme={theme} />
        ))}
      </group>
    </>
  )
}
