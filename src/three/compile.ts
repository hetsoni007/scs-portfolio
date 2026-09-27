// The "compile" effect (DESIGN.md §1, §7): every object has a SOURCE state
// (blood-red line art) and a BUILD state (lit material). A noisy ember-red burn
// band moves along an axis in object space; fragments past it are discarded on
// the solid, and the matching line material shows only on the unbuilt side.
import * as THREE from 'three'

/** Shared by every compile material. Route transitions animate these. */
export const G = {
  uBuild: { value: 1 }, // global solid progress multiplier (0 = all source)
  uPresence: { value: 1 }, // global wireframe opacity
  uTime: { value: 0 },
}

const NOISE = /* glsl */ `
float cHash(vec3 p){ p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float cNoise(vec3 x){
  vec3 i = floor(x); vec3 f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(cHash(i), cHash(i + vec3(1,0,0)), f.x), mix(cHash(i + vec3(0,1,0)), cHash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(cHash(i + vec3(0,0,1)), cHash(i + vec3(1,0,1)), f.x), mix(cHash(i + vec3(0,1,1)), cHash(i + vec3(1,1,1)), f.x), f.y), f.z);
}`

const CUT = /* glsl */ `
  float cmpT = dot(vCmp, uAxis);
  float cmpP = clamp(uProgress * uBuild, 0.0, 1.0);
  float cmpCut = mix(uMin - uEdge * 1.6, uMax + uEdge * 1.6, cmpP);
  float cmpD = cmpCut - cmpT + (cNoise(vCmp * uNoise + vec3(0.0, uTime * 0.35, 0.0)) - 0.5) * uEdge * 1.4;
`

export type CompileUniforms = {
  uProgress: { value: number }
  uAxis: { value: THREE.Vector3 }
  uMin: { value: number }
  uMax: { value: number }
  uEdge: { value: number }
  uNoise: { value: number }
  uEdgeColor: { value: THREE.Color }
  uBuild: { value: number }
  uPresence: { value: number }
  uTime: { value: number }
}

/** One set of uniforms per object: both its solid and its wireframe read it. */
export function compileUniforms(opts: {
  min: number
  max: number
  axis?: THREE.Vector3
  edge?: number
  noise?: number
  color?: THREE.ColorRepresentation
  progress?: number
}): CompileUniforms {
  return {
    uProgress: { value: opts.progress ?? 0 },
    uAxis: { value: (opts.axis ?? new THREE.Vector3(0, 1, 0)).clone().normalize() },
    uMin: { value: opts.min },
    uMax: { value: opts.max },
    uEdge: { value: opts.edge ?? 0.06 },
    uNoise: { value: opts.noise ?? 9 },
    uEdgeColor: { value: new THREE.Color(opts.color ?? '#e0121b') },
    uBuild: G.uBuild,
    uPresence: G.uPresence,
    uTime: G.uTime,
  }
}

/** Patch a built-in lit material so it compiles along the scan. */
export function withCompile<M extends THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial>(mat: M, u: CompileUniforms, glow = 3.2): M {
  mat.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, u)
    shader.vertexShader = shader.vertexShader
      .replace('#include <common>', '#include <common>\nvarying vec3 vCmp;')
      .replace('#include <begin_vertex>', '#include <begin_vertex>\nvCmp = position;')
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
varying vec3 vCmp;
uniform float uProgress, uBuild, uMin, uMax, uEdge, uNoise, uTime;
uniform vec3 uAxis, uEdgeColor;
${NOISE}`,
      )
      .replace(
        '#include <clipping_planes_fragment>',
        `#include <clipping_planes_fragment>
${CUT}
  if (cmpD < 0.0) discard;
  float cmpEdge = 1.0 - smoothstep(0.0, uEdge, cmpD);`,
      )
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n  totalEmissiveRadiance += uEdgeColor * cmpEdge * ${glow.toFixed(2)};`)
  }
  mat.customProgramCacheKey = () => `compile-${glow}`
  return mat
}

/** Wireframe for the SOURCE side of the scan. Use with LineSegments(EdgesGeometry). */
export function compileLines(u: CompileUniforms, color: THREE.ColorRepresentation, opts: { opacity?: number; residual?: number; additive?: boolean } = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      ...u,
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opts.opacity ?? 0.75 },
      uResidual: { value: opts.residual ?? 0.07 },
    },
    vertexShader: /* glsl */ `
      varying vec3 vCmp;
      #include <common>
      #include <logdepthbuf_pars_vertex>
      void main(){
        vCmp = position;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mv;
        #include <logdepthbuf_vertex>
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vCmp;
      uniform float uProgress, uBuild, uMin, uMax, uEdge, uNoise, uTime, uPresence, uOpacity, uResidual;
      uniform vec3 uAxis, uEdgeColor, uColor;
      ${NOISE}
      void main(){
        ${CUT}
        float span = max(0.001, uMax - uMin);
        float a;
        if (cmpD > uEdge) {
          a = uResidual;                       // built: a faint technical edge remains
        } else {
          float far = clamp(-cmpD / span, 0.0, 1.0);
          a = mix(1.0, 0.28, far);             // source: bright near the scan, fading away
        }
        float hot = 1.0 - smoothstep(0.0, uEdge * 2.2, abs(cmpD));
        vec3 col = mix(uColor, uEdgeColor, hot);
        gl_FragColor = vec4(col, a * uOpacity * uPresence);
        #include <colorspace_fragment>
      }`,
    transparent: true,
    depthWrite: false,
    blending: opts.additive === false ? THREE.NormalBlending : THREE.AdditiveBlending,
    toneMapped: false,
  })
}

/** Convenience: solid + edges built from one geometry and one uniform set. */
export function edgesOf(geo: THREE.BufferGeometry, threshold = 24) {
  return new THREE.EdgesGeometry(geo, threshold)
}

/** Critically damped approach, frame-rate independent. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt)
}
