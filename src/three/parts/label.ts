import * as THREE from 'three'

/** A crisp mono label as a texture (used on sprites/planes). Text must be site copy or indices. */
export function labelTexture(text: string, opts: { color?: string; size?: number; weight?: number; pad?: number; font?: string } = {}) {
  const size = opts.size ?? 48
  const pad = opts.pad ?? 12
  const font = `${opts.weight ?? 500} ${size}px ${opts.font ?? '"Stack Sans Headline", "Helvetica Neue", sans-serif'}`
  const c = document.createElement('canvas')
  const g = c.getContext('2d')!
  g.font = font
  const w = Math.ceil(g.measureText(text).width) + pad * 2
  const h = Math.ceil(size * 1.3) + pad * 2
  c.width = w
  c.height = h
  g.font = font
  g.fillStyle = opts.color ?? '#f3eeee'
  g.textBaseline = 'middle'
  g.fillText(text, pad, h / 2)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return { texture: t, aspect: w / h }
}

export function labelMaterial(text: string, color: string, opts: { size?: number } = {}) {
  const { texture, aspect } = labelTexture(text, { color, size: opts.size })
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false })
  return { mat, aspect, dispose: () => (texture.dispose(), mat.dispose()) }
}
