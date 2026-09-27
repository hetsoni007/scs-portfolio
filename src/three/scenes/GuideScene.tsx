// Scoping guide: the 8-page guide as a booklet whose pages fan open. The cover
// carries the guide's real title; inner pages are abstract layouts (no invented copy).
import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { GUIDE_PAGE } from '../../content/secondary'
import { live } from '../../lib/live'
import { useStore } from '../../state/store'
import { damp } from '../compile'
import { usePalette, type Pal } from '../palette'
import { Dust, DraftingGrid } from '../parts/Backdrop'
import { lookInput } from '../rig'
import { useAnchorFollow, useCameraReset } from '../useAnchor'

const PAGES = 8
const W = 1.0
const H = 1.3

function pageTexture(i: number, pal: Pal, dark: boolean) {
  const c = document.createElement('canvas')
  c.width = 400
  c.height = 520
  const g = c.getContext('2d')!
  g.fillStyle = dark ? '#f1e9df' : '#ffffff'
  g.fillRect(0, 0, 400, 520)
  g.strokeStyle = 'rgba(153,0,0,0.1)'
  for (let y = 0; y < 520; y += 20) {
    g.beginPath()
    g.moveTo(0, y + 0.5)
    g.lineTo(400, y + 0.5)
    g.stroke()
  }
  if (i === 0) {
    g.fillStyle = pal.signal
    g.fillRect(28, 28, 60, 6)
    g.fillStyle = '#160808'
    g.font = '250 36px "Stack Sans Headline", sans-serif'
    const words = GUIDE_PAGE.hero.title.split(' ')
    let line = ''
    let y = 120
    for (const w of words) {
      const test = line ? `${line} ${w}` : w
      if (g.measureText(test).width > 340) {
        g.fillText(line, 28, y)
        y += 42
        line = w
      } else line = test
    }
    g.fillText(line, 28, y)
    g.font = '500 13px "Stack Sans Headline", sans-serif'
    g.fillStyle = '#665656'
    g.fillText(GUIDE_PAGE.hero.eyebrow, 28, 480)
  } else {
    let s = i * 31
    const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
    g.fillStyle = '#160808'
    g.fillRect(28, 40, 150 + r() * 120, 14)
    for (let k = 0; k < 14; k++) {
      g.fillStyle = k % 5 === 0 ? pal.signal : 'rgba(22,8,8,0.35)'
      g.fillRect(28, 80 + k * 26, 120 + r() * 220, 7)
    }
    g.font = '500 13px "Stack Sans Headline", sans-serif'
    g.fillStyle = '#665656'
    g.fillText(String(i + 1).padStart(2, '0') + ' / 08', 320, 500)
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

export default function GuideScene() {
  const pal = usePalette()
  const theme = useStore((s) => s.theme)
  const reduced = useStore((s) => s.reduced)
  useCameraReset()
  const group = useRef<THREE.Group>(null)
  const book = useRef<THREE.Group>(null)
  const pages = useRef<(THREE.Group | null)[]>([])
  useAnchorFollow(group, 'booklet', { size: { w: 3, h: 1.6 }, fit: 'contain', fill: 0.95 })

  const parts = useMemo(() => {
    const geo = new THREE.PlaneGeometry(W, H).translate(W / 2, 0, 0) // hinge on the left edge
    const mats = Array.from({ length: PAGES }, (_, i) => {
      const map = pageTexture(i, pal, theme === 'dark')
      return new THREE.MeshStandardMaterial({ map, roughness: 0.85, metalness: 0, side: THREE.DoubleSide, emissive: new THREE.Color('#ffffff'), emissiveMap: map, emissiveIntensity: theme === 'dark' ? 0.35 : 0.1 })
    })
    const edge = new THREE.EdgesGeometry(geo)
    const edgeMat = new THREE.LineBasicMaterial({ color: pal.wire, transparent: true, opacity: 0.5 })
    return { geo, mats, edge, edgeMat }
  }, [pal, theme])
  useEffect(
    () => () => {
      parts.geo.dispose()
      parts.edge.dispose()
      parts.edgeMat.dispose()
      parts.mats.forEach((m) => (m.map?.dispose(), m.dispose()))
    },
    [parts],
  )

  const open = useRef(0)
  useFrame((st, dt) => {
    // pages fan open as the reader approaches the form; a slow breath otherwise
    const t = st.clock.elapsedTime
    const target = reduced ? 0.7 : 0.55 + 0.25 * Math.sin(t * 0.5) + Math.min(0.3, live.scroll.p * 2)
    open.current = damp(open.current, target, 2, dt)
    pages.current.forEach((p, i) => {
      if (!p) return
      const k = i / (PAGES - 1)
      p.rotation.y = -open.current * Math.PI * 0.92 * (1 - k) * (i === 0 ? 1 : 0.92)
      p.position.z = -i * 0.004
    })
    if (book.current) {
      const look = lookInput()
      book.current.rotation.x = damp(book.current.rotation.x, -0.35 - (reduced ? 0 : look.y * 0.1), 2, dt)
      book.current.rotation.y = damp(book.current.rotation.y, 0.25 + (reduced ? 0 : look.x * 0.25), 2, dt)
    }
  })

  return (
    <>
      <DraftingGrid pal={pal} />
      <Dust pal={pal} count={160} />
      <group ref={group}>
        <group ref={book} position={[0, 0, 0]}>
          {Array.from({ length: PAGES }, (_, i) => (
            <group
              key={i}
              ref={(el) => {
                pages.current[i] = el
              }}
            >
              <mesh geometry={parts.geo} material={parts.mats[i]} />
              <lineSegments geometry={parts.edge} material={parts.edgeMat} />
            </group>
          ))}
        </group>
      </group>
    </>
  )
}
