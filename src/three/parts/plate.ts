// Abstract plate for products with no screens (B2B Wholesale, Healthcare
// Staffing, Web3 Creator). It is deliberately NOT a fake UI: a drafting grid,
// the product's tint, and its verbatim label from the live site.
import * as THREE from 'three'
import type { CaseStudy } from '../../content/work'

export async function plateTexture(c: CaseStudy, theme: 'dark' | 'light') {
  const W = 620
  const H = 1000
  const cv = document.createElement('canvas')
  cv.width = W
  cv.height = H
  const g = cv.getContext('2d')!
  try {
    await Promise.all([document.fonts.load('96px Ruthie'), document.fonts.load('400 20px "Stack Sans Headline"')])
  } catch {
    /* fallback fonts */
  }
  const dark = theme === 'dark'
  g.fillStyle = dark ? '#100a0a' : '#f8f3ec'
  g.fillRect(0, 0, W, H)
  const grd = g.createRadialGradient(W * 0.8, H * 0.12, 10, W * 0.8, H * 0.12, W * 1.1)
  const tint = bleed(c.tint)
  grd.addColorStop(0, tint + (dark ? '88' : '55'))
  grd.addColorStop(1, tint + '00')
  g.fillStyle = grd
  g.fillRect(0, 0, W, H)
  g.strokeStyle = dark ? 'rgba(168,20,26,0.13)' : 'rgba(153,0,0,0.09)'
  g.lineWidth = 1
  for (let x = 0; x <= W; x += 31) {
    g.beginPath()
    g.moveTo(x + 0.5, 0)
    g.lineTo(x + 0.5, H)
    g.stroke()
  }
  for (let y = 0; y <= H; y += 31) {
    g.beginPath()
    g.moveTo(0, y + 0.5)
    g.lineTo(W, y + 0.5)
    g.stroke()
  }
  // registration marks
  g.strokeStyle = dark ? 'rgba(243,238,238,0.45)' : 'rgba(22,8,8,0.5)'
  ;[
    [40, 40],
    [W - 40, 40],
    [40, H - 40],
    [W - 40, H - 40],
  ].forEach(([x, y]) => {
    g.beginPath()
    g.moveTo(x - 12, y)
    g.lineTo(x + 12, y)
    g.moveTo(x, y - 12)
    g.lineTo(x, y + 12)
    g.stroke()
  })
  const fg = dark ? '#f3eeee' : '#160808'
  const t = c.tile ?? { title: c.label, sub: c.summary }
  g.fillStyle = fg
  g.font = '96px Ruthie, cursive'
  const words = t.title.split(' ')
  let y = H - 300
  words.forEach((w) => {
    g.fillText(w, 56, y)
    y += 80
  })
  g.fillStyle = dark ? '#bdb2b2' : '#4a3a3a'
  g.font = '400 21px "Stack Sans Headline", sans-serif'
  wrap(g, t.sub.toUpperCase(), W - 112).forEach((l, i) => g.fillText(l, 56, H - 450 + i * 30))
  g.fillStyle = c.kind === 'concept' ? fg : dark ? '#e4d6c3' : '#5c4a38'
  g.font = '500 19px "Stack Sans Headline", sans-serif'
  g.fillText((c.status ?? 'Name withheld (NDA)').toUpperCase(), 56, 90)
  const tex = new THREE.CanvasTexture(cv)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  return tex
}

function wrap(g: CanvasRenderingContext2D, text: string, max: number) {
  const out: string[] = []
  let line = ''
  for (const w of text.split(' ')) {
    const test = line ? `${line} ${w}` : w
    if (g.measureText(test).width > max && line) {
      out.push(line)
      line = w
    } else line = test
  }
  if (line) out.push(line)
  return out
}

/** Pull a product's own UI colour 60% toward blood red, so each plate keeps a trace
 *  of its identity without breaking the red-and-black system. */
function bleed(hex: string, into = '#990000', k = 0.6) {
  const p = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))
  const a = p(hex)
  const r = p(into)
  return '#' + a.map((v, i) => Math.round(v + (r[i] - v) * k).toString(16).padStart(2, '0')).join('')
}
