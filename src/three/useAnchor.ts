import { useLayoutEffect, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../state/store'
import { damp } from './compile'
import { activeAnchor, lookInput, type Anchor } from './rig'

/**
 * Keep a group sitting on the nearest `[data-anchor=<pose>]` placeholder.
 * `size` is the object's own height in world units at scale 1; `fill` is how
 * much of the anchor's height it should occupy.
 */
export function useAnchorFollow(
  group: RefObject<THREE.Group | null>,
  pose: string | string[],
  opts: { size: number | { w: number; h: number }; fill?: number; lambda?: number; fit?: 'height' | 'width' | 'contain'; onAnchor?: (a: Anchor | null, dt: number) => void } = { size: 1 },
) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const reduced = useStore((s) => s.reduced)
  const poses = Array.isArray(pose) ? pose : [pose]
  const first = useRef(true)
  useFrame((st, dt) => {
    const g = group.current
    if (!g) return
    const a = activeAnchor(camera, st.clock.elapsedTime, (el) => poses.includes(el.dataset.anchor ?? ''))
    opts.onAnchor?.(a, dt)
    if (!a) return
    const fill = opts.fill ?? 0.9
    const fit = opts.fit ?? 'height'
    const sw = typeof opts.size === 'number' ? opts.size : opts.size.w
    const sh = typeof opts.size === 'number' ? opts.size : opts.size.h
    const byH = (a.h * fill) / sh
    const byW = (a.w * fill) / sw
    const s = fit === 'height' ? byH : fit === 'width' ? byW : Math.min(byH, byW)
    const L = reduced || first.current ? 1000 : (opts.lambda ?? 4)
    first.current = false
    g.position.x = damp(g.position.x, a.x, L, dt)
    g.position.y = damp(g.position.y, a.y, L, dt)
    const ns = damp(g.scale.x, s, L, dt)
    g.scale.setScalar(ns)
  })
}

/** Reset the shared camera when a scene mounts (scenes may move it). */
export function useCameraReset(z = 7, fov = 32) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  useLayoutEffect(() => {
    camera.position.set(0, 0, z)
    camera.rotation.set(0, 0, 0)
    camera.fov = fov
    camera.updateProjectionMatrix()
  }, [camera, z, fov])
  return camera
}

/** Gentle camera parallax from pointer / tilt. Anchored objects compensate automatically. */
export function useParallax(amount = 0.16) {
  const camera = useThree((s) => s.camera)
  const reduced = useStore((s) => s.reduced)
  const v = useRef({ x: 0, y: 0 })
  useFrame((_, dt) => {
    if (reduced) return
    const look = lookInput()
    v.current.x = damp(v.current.x, look.x * amount, 2, dt)
    v.current.y = damp(v.current.y, look.y * amount * 0.7, 2, dt)
    camera.position.x = v.current.x
    camera.position.y = v.current.y
  })
}

/** Intro compile for a set of uniforms: 0 → 1 once the boot loader has handed over. */
export function useIntro(targets: { value: number }[] | (() => { value: number }[]), duration = 2.2, delay = 0) {
  const reduced = useStore((s) => s.reduced)
  useLayoutEffect(() => {
    const list = typeof targets === 'function' ? targets() : targets
    if (reduced) {
      list.forEach((t) => (t.value = 1))
      return
    }
    let raf = 0
    let t0 = -1
    const run = () => {
      const tick = (now: number) => {
        if (t0 < 0) t0 = now
        const p = Math.min(1, Math.max(0, (now - t0) / 1000 - delay) / duration)
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2
        list.forEach((t) => (t.value = e))
        if (p < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    list.forEach((t) => (t.value = 0))
    if (useStore.getState().booted) run()
    const unsub = useStore.subscribe((s, prev) => {
      if (s.booted && !prev.booted) run()
    })
    return () => {
      unsub()
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced])
}
