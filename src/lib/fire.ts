// The flame wipe (DESIGN.md §8). Drawn procedurally on a 2D canvas: no image or GIF
// assets. A blood-red band sits between two ragged fronts, and both fronts are rows of
// flame tongues. `upper` rising covers the page (the burn). `lower` rising after it
// reveals the next page, with a charred, glowing edge and embers.
//
// Tongue shape: 1 - |sin| has a cusp at each zero, so peaks are pointed and troughs
// round. Raising it to a power narrows the tips. Two drifting frequencies stop the
// row from reading as a pattern.

type Ember = { x: number; y: number; vx: number; vy: number; r: number; life: number; max: number }

export class Fire {
  private c: HTMLCanvasElement
  private g: CanvasRenderingContext2D
  private w = 0
  private h = 0
  private dpr = 1
  private seed = Math.random() * 100
  private embers: Ember[] = []
  private last = 0

  constructor(canvas: HTMLCanvasElement) {
    this.c = canvas
    this.g = canvas.getContext('2d')!
    this.resize()
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    this.w = Math.ceil(window.innerWidth * this.dpr)
    this.h = Math.ceil(window.innerHeight * this.dpr)
    this.c.width = this.w
    this.c.height = this.h
  }

  clear() {
    this.g.clearRect(0, 0, this.w, this.h)
    this.embers.length = 0
  }

  private tongue(x: number, t: number, s: number) {
    const a = Math.pow(1 - Math.abs(Math.sin(x * 0.011 + t * 1.9 + s)), 2.4) * (0.62 + 0.38 * Math.sin(x * 0.0023 + t * 0.7 + s * 3.1))
    const b = 0.55 * Math.pow(1 - Math.abs(Math.sin(x * 0.026 - t * 2.8 + s * 1.3)), 3)
    const flicker = 0.05 * Math.sin(x * 0.13 + t * 17 + s)
    return Math.max(0, (a + b) / 1.55 + flicker)
  }

  /** Edge y (device px) of a front whose base sits at `base` (0..1 of viewport). */
  private edge(base: number, s: number, t: number, amp: number) {
    const step = 6 * this.dpr
    const pts: number[] = []
    for (let x = 0; x <= this.w + step; x += step) pts.push(x, base * this.h - this.tongue(x / this.dpr, t, s) * amp)
    return pts
  }

  /**
   * One frame. `upper` and `lower` are front bases as fractions of viewport height
   * (1 = bottom edge, 0 = top). The band between them is red. `t` is seconds.
   */
  draw(upper: number, lower: number, t: number) {
    const { g, w, h } = this
    g.clearRect(0, 0, w, h)
    const amp = h * 0.17
    if (lower * h - amp > h && upper * h - amp > h) return
    const up = this.edge(upper, this.seed, t, amp)
    const lo = this.edge(lower, this.seed + 7.3, t * 1.15, amp * 0.85)

    g.beginPath()
    g.moveTo(up[0], up[1])
    for (let i = 2; i < up.length; i += 2) g.lineTo(up[i], up[i + 1])
    for (let i = lo.length - 2; i >= 0; i -= 2) g.lineTo(lo[i], Math.max(lo[i + 1], 0))
    g.closePath()

    // Hot tips at the top of the burn, deep blood through the body.
    const top = upper * h - amp
    const grad = g.createLinearGradient(0, top, 0, top + h * 0.55)
    grad.addColorStop(0, '#ff5a1f')
    grad.addColorStop(0.14, '#e0121b')
    grad.addColorStop(0.45, '#990000')
    grad.addColorStop(1, '#6e0000')
    g.fillStyle = grad
    g.fill()

    // Char: the revealing front burns black into the red before it glows.
    if (lower < 1.12) {
      g.save()
      g.clip()
      const cb = lower * h
      const char = g.createLinearGradient(0, cb - amp * 1.25, 0, cb)
      char.addColorStop(0, 'rgba(10,0,0,0)')
      char.addColorStop(0.65, 'rgba(10,0,0,0.55)')
      char.addColorStop(1, 'rgba(10,0,0,0.9)')
      g.fillStyle = char
      g.fillRect(0, cb - amp * 1.25, w, amp * 1.25)
      g.restore()

      g.beginPath()
      g.moveTo(lo[0], lo[1])
      for (let i = 2; i < lo.length; i += 2) g.lineTo(lo[i], lo[i + 1])
      g.strokeStyle = '#ff3b1a'
      g.lineWidth = 1.6 * this.dpr
      g.shadowColor = '#ff2200'
      g.shadowBlur = 16 * this.dpr
      g.stroke()
      g.shadowBlur = 0
    }

    this.emberStep(t, upper, lower, amp)
  }

  private emberStep(t: number, upper: number, lower: number, amp: number) {
    const dt = Math.min(0.05, Math.max(0, t - this.last))
    this.last = t
    const { g, w, h, dpr } = this
    const burning = lower < 1.12 ? lower : upper
    if (burning < 1.1 && this.embers.length < 70) {
      for (let k = 0; k < 3; k++) {
        this.embers.push({
          x: Math.random() * w,
          y: burning * h - Math.random() * amp,
          vx: (Math.random() - 0.5) * 30 * dpr,
          vy: -(60 + Math.random() * 160) * dpr,
          r: (0.8 + Math.random() * 1.8) * dpr,
          life: 0,
          max: 0.5 + Math.random() * 0.9,
        })
      }
    }
    g.globalCompositeOperation = 'lighter'
    for (let i = this.embers.length - 1; i >= 0; i--) {
      const e = this.embers[i]
      e.life += dt
      if (e.life > e.max) {
        this.embers.splice(i, 1)
        continue
      }
      e.x += e.vx * dt + Math.sin(e.life * 9 + i) * 0.6 * dpr
      e.y += e.vy * dt
      const a = 1 - e.life / e.max
      g.fillStyle = `rgba(255,${80 + Math.floor(90 * a)},40,${a * 0.9})`
      g.beginPath()
      g.arc(e.x, e.y, e.r, 0, Math.PI * 2)
      g.fill()
    }
    g.globalCompositeOperation = 'source-over'
  }
}

/** Animate `from`→`to` over `dur` seconds, calling `frame(progress, seconds)`. */
export function run(dur: number, frame: (p: number, t: number) => void, ease: (p: number) => number = (p) => p) {
  return new Promise<void>((resolve) => {
    const t0 = performance.now()
    const tick = (now: number) => {
      const t = (now - t0) / 1000
      const p = Math.min(1, t / dur)
      frame(ease(p), t)
      if (p < 1) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })
}

export const easeInOut = (p: number) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2)
export const easeOut = (p: number) => 1 - Math.pow(1 - p, 3)
