// Screen textures: real portfolio screenshots (NDA-safe crops) loaded once and
// shared across scenes, plus canvas-drawn brand screens (never fake product UI).
import * as THREE from 'three'

const cache = new Map<string, THREE.Texture>()
const loader = new THREE.TextureLoader()

const blank = (() => {
  const t = new THREE.DataTexture(new Uint8Array([11, 14, 17, 255]), 1, 1)
  t.needsUpdate = true
  t.colorSpace = THREE.SRGBColorSpace
  return t
})()

export function screenTexture(src: string, onLoad?: (t: THREE.Texture) => void): THREE.Texture {
  const hit = cache.get(src)
  if (hit) {
    if (hit.image && onLoad) onLoad(hit)
    return hit
  }
  const t = loader.load(src, (tex) => onLoad?.(tex))
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  t.generateMipmaps = true
  t.minFilter = THREE.LinearMipmapLinearFilter
  cache.set(src, t)
  return t
}

export const blankTexture = blank

/** Aspect (w/h) of a texture's image, or a phone-ish default while loading. */
export function texAspect(t: THREE.Texture) {
  const img = t.image as { width?: number; height?: number } | undefined
  return img?.width && img?.height ? img.width / img.height : 0.46
}

/** A brand screen drawn in canvas. The copy passed in must be verbatim site copy. */
export async function brandScreen(opts: { kicker: string; title: string[]; action: string; theme: 'dark' | 'light' }) {
  const W = 540
  const H = 1170
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')!
  try {
    await Promise.all([
      document.fonts.load('72px Ruthie'),
      document.fonts.load('250 66px "Stack Sans Headline"'),
      document.fonts.load('400 20px "Stack Sans Headline"'),
    ])
  } catch {
    /* fall back to whatever is available */
  }
  const dark = opts.theme === 'dark'
  g.fillStyle = dark ? '#070404' : '#f8f3ec'
  g.fillRect(0, 0, W, H)
  // drafting grid
  g.strokeStyle = dark ? 'rgba(168,20,26,0.14)' : 'rgba(153,0,0,0.1)'
  g.lineWidth = 1
  for (let x = 0; x <= W; x += 30) {
    g.beginPath()
    g.moveTo(x + 0.5, 0)
    g.lineTo(x + 0.5, H)
    g.stroke()
  }
  for (let y = 0; y <= H; y += 30) {
    g.beginPath()
    g.moveTo(0, y + 0.5)
    g.lineTo(W, y + 0.5)
    g.stroke()
  }
  const fg = dark ? '#f3eeee' : '#160808'
  g.fillStyle = dark ? '#948888' : '#665656'
  g.font = '400 20px "Stack Sans Headline", sans-serif'
  g.fillText(opts.kicker.toUpperCase(), 48, 170)
  g.fillStyle = fg
  let y = 290
  opts.title.forEach((line, i) => {
    const script = i === opts.title.length - 1 && opts.title.length > 1
    g.fillStyle = script ? (dark ? '#e0121b' : '#990000') : fg
    g.font = script ? '88px Ruthie, cursive' : '250 66px "Stack Sans Headline", sans-serif'
    wrap(g, line, 48, y, W - 96, 70).forEach((l) => {
      g.fillText(l, 48, y)
      y += 72
    })
    y += 8
  })
  // action bar
  g.fillStyle = '#990000'
  g.fillRect(48, H - 260, W - 96, 84)
  g.fillStyle = '#ffffff'
  g.font = '500 21px "Stack Sans Headline", sans-serif'
  g.fillText(opts.action.toUpperCase(), 72, H - 208)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

function wrap(g: CanvasRenderingContext2D, text: string, _x: number, _y: number, max: number, _lh: number) {
  const words = text.split(' ')
  const out: string[] = []
  let line = ''
  for (const w of words) {
    const test = line ? `${line} ${w}` : w
    if (g.measureText(test).width > max && line) {
      out.push(line)
      line = w
    } else line = test
  }
  if (line) out.push(line)
  return out
}
