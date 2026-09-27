// Blog: the archive as a slow vortex of 34 index cards, one per article. Picking
// a filter lights the matching cards and dims the rest.
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BLOG_PAGE, POSTS } from '../../content/blog'
import { live } from '../../lib/live'
import { ch, useStore } from '../../state/store'
import { damp } from '../compile'
import { usePalette } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { useCameraReset, useParallax } from '../useAnchor'

const tmp = new THREE.Object3D()
const col = new THREE.Color()

export default function BlogScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  useCameraReset()
  useParallax(0.12)
  const mesh = useRef<THREE.InstancedMesh>(null)
  const N = POSTS.length
  const parts = useMemo(() => {
    const geo = new THREE.PlaneGeometry(0.46, 0.3)
    // an index card drawn once (white, tinted per instance): hairline border, a title bar, text lines
    const c = document.createElement('canvas')
    c.width = 256
    c.height = 168
    const g = c.getContext('2d')!
    g.fillStyle = 'rgba(255,255,255,0.06)'
    g.fillRect(0, 0, 256, 168)
    g.strokeStyle = 'rgba(255,255,255,0.9)'
    g.lineWidth = 2
    g.strokeRect(1, 1, 254, 166)
    g.fillStyle = 'rgba(255,255,255,0.95)'
    g.fillRect(18, 22, 150, 12)
    g.fillStyle = 'rgba(255,255,255,0.5)'
    ;[58, 78, 98].forEach((y, k) => g.fillRect(18, y, [210, 180, 120][k], 6))
    g.fillRect(18, 138, 40, 6)
    const tex = new THREE.CanvasTexture(c)
    const mat = new THREE.MeshBasicMaterial({ map: tex, color: '#ffffff', transparent: true, side: THREE.DoubleSide, toneMapped: false, depthWrite: false })
    return { geo, mat, tex }
  }, [])
  useEffect(() => () => (parts.geo.dispose(), parts.mat.dispose(), parts.tex.dispose()), [parts])
  const glow = useRef(new Array(N).fill(1))
  const spin = useRef(0)

  useFrame((st, dt) => {
    const m = mesh.current
    if (!m) return
    const fi = ch('blog.filter', 0)
    const key = BLOG_PAGE.filters[fi]?.key ?? 'all'
    spin.current += reduced ? 0 : dt * 0.05
    // fade the whole vortex out as the page scrolls into the (opaque) list
    const fade = Math.max(0, 1 - live.scroll.y / (live.vh * 0.9))
    POSTS.forEach((p, i) => {
      const on = key === 'all' || (p.cats as string[]).includes(key)
      glow.current[i] = damp(glow.current[i], on ? 1 : 0.15, 4, dt)
      const a = (i / N) * Math.PI * 2 * 2.2 + spin.current
      const r = 1.6 + (i % 5) * 0.18
      const y = ((i / N) - 0.5) * 3.2 + Math.sin(st.clock.elapsedTime * 0.3 + i) * (reduced ? 0 : 0.04)
      tmp.position.set(2.1 + Math.cos(a) * r, y, Math.sin(a) * r - 1.2)
      tmp.rotation.set(0, -a + Math.PI / 2, 0.05)
      tmp.scale.setScalar(0.6 + glow.current[i] * 0.4)
      tmp.updateMatrix()
      m.setMatrixAt(i, tmp.matrix)
      col.set(glow.current[i] > 0.6 && i % 7 === 0 ? pal.signal : pal.wire).multiplyScalar((0.25 + glow.current[i] * 0.75) * fade)
      m.setColorAt(i, col)
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  })

  return (
    <>
      <DraftingGrid pal={pal} />
      <Dust pal={pal} count={220} />
      <instancedMesh ref={mesh} args={[parts.geo, parts.mat, N]} frustumCulled={false} />
    </>
  )
}
