// Layout-driven 3D: pages drop sized placeholder elements (`data-anchor="pose"`)
// into their DOM, and scenes map those rects into world space each frame. Objects
// therefore sit *in* the responsive layout at every breakpoint, and flying between
// anchors on scroll becomes the choreography.
import * as THREE from 'three'
import { live } from '../lib/live'

export type Anchor = { el: HTMLElement; pose: string; x: number; y: number; h: number; w: number; center: number; visible: boolean }

let cache: HTMLElement[] = []
let cacheAt = -1

/** All anchors currently in the DOM (re-queried at most ~4×/s; pages mount lazily). */
export function anchors(now: number): HTMLElement[] {
  if (now - cacheAt > 0.25 || cache.some((el) => !el.isConnected)) {
    cache = Array.from(document.querySelectorAll<HTMLElement>('[data-anchor]'))
    cacheAt = now
  }
  return cache
}

/** World-space size of one CSS pixel on the z = depth plane, for an unrotated camera. */
export function pxToWorld(camera: THREE.PerspectiveCamera, depth = 0) {
  const dist = camera.position.z - depth
  return (2 * dist * Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2)) / live.vh
}

/** Project an element's rect onto the z = depth plane. */
export function measure(el: HTMLElement, camera: THREE.PerspectiveCamera, depth = 0): Anchor {
  const r = el.getBoundingClientRect()
  const k = pxToWorld(camera, depth)
  const cx = r.left + r.width / 2
  const cy = r.top + r.height / 2
  return {
    el,
    pose: el.dataset.anchor ?? '',
    x: camera.position.x + (cx - live.vw / 2) * k,
    y: camera.position.y - (cy - live.vh / 2) * k,
    w: r.width * k,
    h: r.height * k,
    center: Math.abs(cy - live.vh / 2),
    visible: r.bottom > -live.vh * 0.25 && r.top < live.vh * 1.25,
  }
}

/** The anchor nearest the viewport's centre line (the one the object should occupy). */
export function activeAnchor(camera: THREE.PerspectiveCamera, now: number, filter?: (el: HTMLElement) => boolean): Anchor | null {
  let best: Anchor | null = null
  for (const el of anchors(now)) {
    if (filter && !filter(el)) continue
    if (el.offsetWidth === 0 && el.offsetHeight === 0) continue // display:none at this breakpoint
    const a = measure(el, camera)
    if (!best || a.center < best.center) best = a
  }
  return best
}

/** Pointer (desktop) or device tilt (mobile) as a -1..1 vector. */
export function lookInput() {
  if (live.tilt.active) return { x: live.tilt.x, y: -live.tilt.y }
  return { x: live.pointer.nx, y: live.pointer.ny }
}

export const TAU = Math.PI * 2
