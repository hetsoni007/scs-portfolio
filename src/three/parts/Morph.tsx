// GPU point-cloud morph between service forms. Positions A → B are interpolated
// in the vertex shader with a per-point delay, so the cloud "recompiles" rather
// than crossfades.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { gsap } from '../../lib/motion'
import { G } from '../compile'
import type { Pal } from '../palette'
import { makeForm, type FormKey } from './forms'

export function Morph({ pal, form, count, reduced, pulse }: { pal: Pal; form: FormKey; count: number; reduced?: boolean; pulse?: { value: number } }) {
  const forms = useRef(new Map<FormKey, Float32Array>())
  const getForm = (k: FormKey) => {
    if (!forms.current.has(k)) forms.current.set(k, makeForm(k, count))
    return forms.current.get(k)!
  }
  const current = useRef<FormKey>(form)

  const { geo, mat } = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const a = makeForm(form, count)
    const rand = new Float32Array(count)
    for (let i = 0; i < count; i++) rand[i] = ((i * 2654435761) % 1000) / 1000
    geo.setAttribute('position', new THREE.BufferAttribute(a.slice(), 3))
    geo.setAttribute('aB', new THREE.BufferAttribute(a.slice(), 3))
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1))
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uMorph: { value: 1 },
        uTime: G.uTime,
        uPresence: G.uPresence,
        uBuild: G.uBuild,
        uPulse: pulse ?? { value: 0 },
        uSize: { value: 2.3 * Math.min(2, window.devicePixelRatio) },
        uA: { value: new THREE.Color(pal.wire) },
        uHot: { value: new THREE.Color(pal.signal) },
        uFg: { value: new THREE.Color(pal.fg) },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aB; attribute float aRand;
        uniform float uMorph, uTime, uSize, uBuild, uPulse;
        varying float vHot; varying float vA;
        void main(){
          float t = clamp((uMorph - aRand * 0.35) / 0.65, 0.0, 1.0);
          t = t * t * (3.0 - 2.0 * t);
          vec3 p = mix(position, aB, t);
          float swirl = sin(t * 3.14159);
          p += swirl * 0.35 * vec3(sin(aRand * 40.0 + uTime), cos(aRand * 31.0 + uTime), sin(aRand * 23.0));
          p += 0.012 * vec3(sin(uTime * 1.3 + aRand * 60.0), cos(uTime * 1.1 + aRand * 50.0), 0.0);
          p *= mix(0.2, 1.0, uBuild) * (1.0 + uPulse * 0.06 * sin(aRand * 20.0 + uTime * 8.0));
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = uSize * (0.7 + aRand * 0.7) * (6.0 / -mv.z);
          vHot = step(0.93, aRand) + swirl * 0.8 + uPulse * step(0.7, aRand);
          vA = smoothstep(-2.0, 1.2, p.z) * 0.55 + 0.45;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uA, uHot, uFg; uniform float uPresence;
        varying float vHot; varying float vA;
        void main(){
          float d = length(gl_PointCoord - 0.5);
          if (d > 0.5) discard;
          vec3 c = mix(uA, uHot, clamp(vHot, 0.0, 1.0));
          gl_FragColor = vec4(c, (1.0 - d * 2.0) * vA * uPresence);
        #include <colorspace_fragment>
      }`,
      transparent: true,
      depthWrite: false,
      blending: pal.additive ? THREE.AdditiveBlending : THREE.NormalBlending,
      toneMapped: false,
    })
    return { geo, mat }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pal, count])

  useEffect(() => () => (geo.dispose(), mat.dispose()), [geo, mat])

  // Morph to a new form: snapshot where points are now → A, target → B.
  useEffect(() => {
    if (form === current.current) return
    const pos = geo.getAttribute('position') as THREE.BufferAttribute
    const b = geo.getAttribute('aB') as THREE.BufferAttribute
    const m = mat.uniforms.uMorph.value
    if (m >= 1) (pos.array as Float32Array).set(b.array as Float32Array)
    else {
      // mid-morph: blend so the new morph starts from the visible state
      const pa = pos.array as Float32Array
      const ba = b.array as Float32Array
      for (let i = 0; i < pa.length; i++) pa[i] = pa[i] + (ba[i] - pa[i]) * m
    }
    ;(b.array as Float32Array).set(getForm(form))
    pos.needsUpdate = true
    b.needsUpdate = true
    current.current = form
    if (reduced) {
      mat.uniforms.uMorph.value = 1
      return
    }
    mat.uniforms.uMorph.value = 0
    const tw = gsap.to(mat.uniforms.uMorph, { value: 1, duration: 1.5, ease: 'power2.inOut' })
    return () => {
      tw.kill()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, geo, mat, reduced])

  const ref = useRef<THREE.Points>(null)
  useFrame((_, dt) => {
    if (ref.current && !reduced) ref.current.rotation.y += dt * 0.12
  })

  return <points ref={ref} geometry={geo} material={mat} frustumCulled={false} />
}
