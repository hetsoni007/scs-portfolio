// 404: a failed build. The phone is stuck half-compiled, the scan line
// stutters back and forth, and nothing ever powers on.
import { useEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../state/store'
import { damp } from '../compile'
import { usePalette } from '../palette'
import { DraftingGrid } from '../parts/Backdrop'
import { Phone, PHONE, type PhoneHandle } from '../parts/Phone'
import { activeAnchor, lookInput } from '../rig'
import { useCameraReset } from '../useAnchor'

export default function LostScene() {
  const pal = usePalette()
  const reduced = useStore((s) => s.reduced)
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  useCameraReset()
  const phone = useRef<PhoneHandle>(null)
  const k = useRef({ x: 1.5, y: 0, s: 1 })
  useEffect(() => {
    const s = phone.current?.state
    if (s) Object.assign(s, { progress: 0.45, power: 0, explode: 0.18, layer: 2 })
  }, [])
  useFrame((st, dt) => {
    const P = phone.current
    if (!P) return
    const t = st.clock.elapsedTime
    const a = activeAnchor(camera, t)
    const c = k.current
    if (a) {
      c.x = damp(c.x, a.x, 4, dt)
      c.y = damp(c.y, a.y, 4, dt)
      c.s = damp(c.s, (a.h * 0.8) / PHONE.H, 4, dt)
    }
    const look = lookInput()
    // stutter: the compile never gets past the middle
    P.state.progress = reduced ? 0.45 : 0.42 + Math.sin(t * 2.3) * 0.05 + (Math.sin(t * 17) > 0.96 ? 0.12 : 0)
    P.group.position.set(c.x + (reduced ? 0 : Math.sin(t * 40) * 0.004 * (Math.sin(t * 3) > 0.8 ? 1 : 0)), c.y, 0)
    P.group.scale.setScalar(c.s)
    P.group.rotation.set(0.12 - look.y * 0.1, -0.6 + look.x * 0.3, 0.08)
  })
  return (
    <>
      <DraftingGrid pal={pal} />
      <Phone ref={phone} pal={pal} reduced={reduced} />
    </>
  )
}
