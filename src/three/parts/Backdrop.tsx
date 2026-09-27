// Shared scenery: a faint drafting grid far behind, and depth dust for parallax.
import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { G } from '../compile'
import type { Pal } from '../palette'

export function DraftingGrid({ pal, z = -6, size = 30, step = 0.6, opacity = 0.07 }: { pal: Pal; z?: number; size?: number; step?: number; opacity?: number }) {
  const { geo, mat } = useMemo(() => {
    const p: number[] = []
    const n = Math.floor(size / step)
    for (let i = -n / 2; i <= n / 2; i++) {
      const v = i * step
      p.push(-size / 2, v, 0, size / 2, v, 0, v, -size / 2, 0, v, size / 2, 0)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(p, 3))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(pal.wire) }, uOpacity: { value: opacity }, uPresence: G.uPresence },
      vertexShader: `varying vec2 vP; void main(){ vP = position.xy; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `varying vec2 vP; uniform vec3 uColor; uniform float uOpacity, uPresence;
        void main(){ float f = 1.0 - smoothstep(4.0, 13.0, length(vP)); gl_FragColor = vec4(uColor, uOpacity * f * (0.4 + 0.6 * uPresence));
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      fog: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    return { geo, mat }
  }, [pal, size, step, opacity])
  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat])
  return <lineSegments geometry={geo} material={mat} position={[0, 0, z]} />
}

export function Dust({ pal, count = 420, spread = [16, 10, 10] as [number, number, number], size = 0.035 }: { pal: Pal; count?: number; spread?: [number, number, number]; size?: number }) {
  const { geo, mat } = useMemo(() => {
    const p = new Float32Array(count * 3)
    const s = new Float32Array(count)
    let seed = 11
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    for (let i = 0; i < count; i++) {
      p[i * 3] = (r() - 0.5) * spread[0]
      p[i * 3 + 1] = (r() - 0.5) * spread[1]
      p[i * 3 + 2] = -r() * spread[2] + 1.5
      s[i] = 0.4 + r() * 0.8
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3))
    geo.setAttribute('aScale', new THREE.BufferAttribute(s, 1))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(pal.fg) }, uSize: { value: size }, uTime: G.uTime, uPresence: G.uPresence, uPx: { value: Math.min(2, window.devicePixelRatio) } },
      vertexShader: `attribute float aScale; uniform float uSize, uTime, uPx; varying float vA;
        void main(){ vec3 p = position; p.y += sin(uTime * 0.2 + position.x) * 0.08;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * aScale * uPx * 300.0 / -mv.z; vA = smoothstep(18.0, 3.0, -mv.z); }`,
      fragmentShader: `uniform vec3 uColor; uniform float uPresence; varying float vA;
        void main(){ float d = length(gl_PointCoord - 0.5); if (d > 0.5) discard; gl_FragColor = vec4(uColor, (1.0 - d * 2.0) * 0.35 * vA * uPresence);
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    return { geo, mat }
  }, [pal, count, spread, size])
  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat])
  return <points geometry={geo} material={mat} frustumCulled={false} />
}

/** Wireframe UI modules (buttons, cards, rows, toggles, charts) orbiting a point:
 *  the "source" of an app, absorbed into the device as it compiles. One draw call. */
export function Modules({ pal, count = 22, spread }: { pal: Pal; count?: number; spread: { value: number } }) {
  const { geo, mat } = useMemo(() => {
    const glyphs: number[][] = []
    const rect = (w: number, h: number, ox = 0, oy = 0) => [
      -w / 2 + ox, -h / 2 + oy, 0, w / 2 + ox, -h / 2 + oy, 0,
      w / 2 + ox, -h / 2 + oy, 0, w / 2 + ox, h / 2 + oy, 0,
      w / 2 + ox, h / 2 + oy, 0, -w / 2 + ox, h / 2 + oy, 0,
      -w / 2 + ox, h / 2 + oy, 0, -w / 2 + ox, -h / 2 + oy, 0,
    ]
    const ring = (r: number, ox: number, oy: number, n = 14) => {
      const o: number[] = []
      for (let i = 0; i < n; i++) {
        const a = (i / n) * Math.PI * 2
        const b = ((i + 1) / n) * Math.PI * 2
        o.push(ox + Math.cos(a) * r, oy + Math.sin(a) * r, 0, ox + Math.cos(b) * r, oy + Math.sin(b) * r, 0)
      }
      return o
    }
    const hline = (x0: number, x1: number, y: number) => [x0, y, 0, x1, y, 0]
    glyphs.push([...rect(0.36, 0.1), ...hline(-0.1, 0.1, 0)]) // button
    glyphs.push([...rect(0.4, 0.26), ...rect(0.4, 0.1, 0, 0.08), ...hline(-0.16, 0.06, -0.06)]) // card
    glyphs.push([...ring(0.045, -0.14, 0), ...hline(-0.07, 0.16, 0.02), ...hline(-0.07, 0.08, -0.02)]) // list row
    glyphs.push([...rect(0.14, 0.07), ...ring(0.026, 0.035, 0, 10)]) // toggle
    glyphs.push([...hline(-0.14, 0.14, -0.08), ...rect(0.04, 0.08, -0.08, -0.04), ...rect(0.04, 0.14, 0, -0.01), ...rect(0.04, 0.11, 0.08, -0.025)]) // chart
    glyphs.push([...hline(-0.16, 0.16, 0.05), ...hline(-0.16, 0.1, 0), ...hline(-0.16, 0.13, -0.05)]) // text block

    const pos: number[] = []
    const center: number[] = []
    const seed: number[] = []
    let s = 3
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
    for (let i = 0; i < count; i++) {
      const g = glyphs[i % glyphs.length]
      const radius = 0.75 + r() * 0.75
      const angle = r() * Math.PI * 2
      const height = (r() - 0.5) * 1.9
      const speed = 0.4 + r() * 0.8
      const phase = r() * 6.28
      const z = (r() - 0.5) * 0.6
      const scale = 0.6 + r() * 0.5
      for (let v = 0; v < g.length; v += 3) {
        pos.push(g[v], g[v + 1], g[v + 2])
        center.push(radius, angle, height)
        seed.push(speed, phase, z, scale)
      }
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('aCenter', new THREE.Float32BufferAttribute(center, 3))
    geo.setAttribute('aSeed', new THREE.Float32BufferAttribute(seed, 4))
    const mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(pal.wire) }, uHot: { value: new THREE.Color(pal.signal) }, uTime: G.uTime, uSpread: spread, uPresence: G.uPresence },
      vertexShader: /* glsl */ `
        attribute vec3 aCenter; attribute vec4 aSeed;
        uniform float uTime, uSpread; varying float vA; varying float vHot;
        void main(){
          float ang = aCenter.y + uTime * aSeed.x * 0.12;
          // orbit biased to the right of the phone so modules never sit on the headline
          vec3 c = vec3(cos(ang) * aCenter.x * 0.95 + 0.25, aCenter.z + sin(uTime * aSeed.x + aSeed.y) * 0.05, sin(ang) * aCenter.x * 0.5 + aSeed.z);
          vec3 p = mix(position * aSeed.w * 0.15, c + position * aSeed.w, uSpread);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          vA = uSpread * smoothstep(-2.5, 0.2, c.z);
          vHot = smoothstep(0.9, 0.5, aCenter.x) * (0.5 + 0.5 * sin(uTime * 2.0 + aSeed.y));
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uColor, uHot; uniform float uPresence; varying float vA; varying float vHot;
        void main(){ gl_FragColor = vec4(mix(uColor, uHot, vHot * 0.6), 0.55 * vA * uPresence);
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    return { geo, mat }
  }, [pal, count, spread])
  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat])
  useFrame(() => {
    mat.visible = spread.value > 0.01
  })
  return <lineSegments geometry={geo} material={mat} frustumCulled={false} />
}
