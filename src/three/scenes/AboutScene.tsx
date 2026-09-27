// About: intentionally restrained. A field of soft bokeh discs at many depths;
// the focal plane travels back as you read down the page, so different layers
// come into focus. No objects, no interaction beyond scroll and a faint drift.
import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { live } from '../../lib/live'
import { TIER } from '../../lib/quality'
import { useStore } from '../../state/store'
import { damp, G } from '../compile'
import { usePalette } from '../palette'
import { useCameraReset, useParallax } from '../useAnchor'

export default function AboutScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  const tier = useStore((s) => s.tier)
  useCameraReset()
  useParallax(0.1)
  const count = Math.round(240 * Math.max(0.4, TIER[tier].particles))

  const { geo, mat } = useMemo(() => {
    const p = new Float32Array(count * 3)
    const s = new Float32Array(count)
    let seed = 5
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646
    for (let i = 0; i < count; i++) {
      p[i * 3] = (r() - 0.5) * 18
      p[i * 3 + 1] = (r() - 0.5) * 10
      p[i * 3 + 2] = 2 - r() * 22
      s[i] = r()
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(p, 3))
    geo.setAttribute('aS', new THREE.BufferAttribute(s, 1))
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uFocus: { value: 4 },
        uTime: G.uTime,
        uPresence: G.uPresence,
        uPx: { value: Math.min(2, window.devicePixelRatio) },
        uA: { value: new THREE.Color(pal.fg) },
        uHot: { value: new THREE.Color(pal.signal) },
      },
      vertexShader: /* glsl */ `
        attribute float aS; uniform float uFocus, uTime, uPx; varying float vBlur; varying float vHot; varying float vA;
        void main(){
          vec3 p = position; p.y += sin(uTime * 0.12 + aS * 20.0) * 0.12; p.x += cos(uTime * 0.1 + aS * 12.0) * 0.1;
          vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
          float depth = -mv.z;
          vBlur = clamp(abs(depth - uFocus) / 6.0, 0.0, 1.0);
          gl_PointSize = uPx * (1.6 + vBlur * 13.0) * (7.0 / depth) * (0.6 + aS * 0.8);
          vHot = step(0.985, aS);
          vA = smoothstep(26.0, 6.0, depth);
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uA, uHot; uniform float uPresence; varying float vBlur; varying float vHot; varying float vA;
        void main(){
          float d = length(gl_PointCoord - 0.5) * 2.0;
          float edge = mix(0.15, 0.9, 1.0 - vBlur);
          float disc = 1.0 - smoothstep(edge, 1.0, d);
          float ring = smoothstep(0.7, 0.95, d) * (1.0 - smoothstep(0.95, 1.0, d)) * vBlur * 0.35;
          float a = (disc * mix(0.4, 0.035, vBlur) + ring * 0.5) * vA * uPresence;
          if (a < 0.003) discard;
          gl_FragColor = vec4(mix(uA, uHot, vHot), a);
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    return { geo, mat }
  }, [pal, count])
  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat])

  useFrame((_, dt) => {
    // reading position → focal distance (4 at the top, ~16 at the end of the page)
    const target = 4 + live.scroll.p * 12
    mat.uniforms.uFocus.value = damp(mat.uniforms.uFocus.value, target, reduced ? 100 : 1.8, dt)
  })

  return <points geometry={geo} material={mat} frustumCulled={false} />
}
