// Device-orientation input for the mobile experience (DESIGN.md §7):
// tilt drives the hero phone, the contact gravity and camera parallax.
import { live } from './live'
import { useStore } from '../state/store'

type DOE = typeof DeviceOrientationEvent & { requestPermission?: () => Promise<'granted' | 'denied'> }

let attached = false
let base: { b: number; g: number } | null = null

function onOrient(e: DeviceOrientationEvent) {
  if (e.beta == null || e.gamma == null) return
  // Calibrate to however the phone is held when tilt starts.
  if (!base) base = { b: e.beta, g: e.gamma }
  const tx = (e.gamma - base.g) / 30
  const ty = (e.beta - base.b) / 30
  live.tilt.x = Math.max(-1, Math.min(1, tx))
  live.tilt.y = Math.max(-1, Math.min(1, ty))
  live.tilt.active = true
}

function attach() {
  if (attached) return
  attached = true
  window.addEventListener('deviceorientation', onOrient, { passive: true })
  useStore.getState().setTilt(true)
}

export const tiltNeedsPermission = () =>
  typeof window !== 'undefined' &&
  typeof (window.DeviceOrientationEvent as DOE | undefined)?.requestPermission === 'function'

/** Android and others: no prompt needed, so start listening straight away. */
export function autoTilt() {
  if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) return
  if (!matchMedia('(pointer: coarse)').matches) return
  if (!tiltNeedsPermission()) attach()
}

/** iOS: must be called from a user gesture. */
export async function requestTilt(): Promise<boolean> {
  const D = window.DeviceOrientationEvent as DOE
  try {
    if (D.requestPermission) {
      const res = await D.requestPermission()
      if (res !== 'granted') return false
    }
    attach()
    return true
  } catch {
    return false
  }
}

export function recalibrateTilt() {
  base = null
}
