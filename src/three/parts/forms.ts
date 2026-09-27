// Point-cloud "forms" for the service morph. Each returns N xyz points inside a
// ~2-unit box. Deterministic (seeded) so the morph looks the same every visit.
export type FormKey = 'phone' | 'layers' | 'stack' | 'lattice' | 'loop' | 'pod' | 'browser'

function rng(seed: number) {
  let s = seed
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
}

function rectPerimeter(r: () => number, w: number, h: number, rad: number) {
  // sample along a rounded-rect outline
  const straight = 2 * (w - 2 * rad) + 2 * (h - 2 * rad)
  const arc = 2 * Math.PI * rad
  let t = r() * (straight + arc)
  const sw = w - 2 * rad
  const sh = h - 2 * rad
  if (t < sw) return [-sw / 2 + t, h / 2]
  t -= sw
  if (t < sw) return [-sw / 2 + t, -h / 2]
  t -= sw
  if (t < sh) return [w / 2, -sh / 2 + t]
  t -= sh
  if (t < sh) return [-w / 2, -sh / 2 + t]
  t -= sh
  const a = (t / arc) * Math.PI * 2
  const q = Math.floor((a / (Math.PI * 2)) * 4)
  const cx = q === 0 || q === 3 ? sw / 2 : -sw / 2
  const cy = q < 2 ? sh / 2 : -sh / 2
  return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad]
}

export function makeForm(key: FormKey, n: number): Float32Array {
  const out = new Float32Array(n * 3)
  const r = rng(key.length * 97 + n)
  const put = (i: number, x: number, y: number, z: number) => {
    out[i * 3] = x
    out[i * 3 + 1] = y
    out[i * 3 + 2] = z
  }
  for (let i = 0; i < n; i++) {
    const k = r()
    switch (key) {
      case 'phone': {
        if (k < 0.55) {
          const [x, y] = rectPerimeter(r, 0.95, 1.9, 0.14)
          put(i, x, y, (r() - 0.5) * 0.1)
        } else if (k < 0.85) {
          // screen content: rows of "UI"
          const row = Math.floor(r() * 9)
          const len = 0.3 + ((row * 37) % 5) * 0.1
          put(i, -0.36 + r() * len, 0.62 - row * 0.15, 0.06)
        } else {
          const [x, y] = rectPerimeter(r, 0.24, 0.06, 0.03)
          put(i, x, y + 0.82, 0.06)
        }
        break
      }
      case 'layers': {
        const L = Math.floor(r() * 3) // Core / Supporting / Later
        const s = [0.75, 1.15, 1.55][L]
        const y = [-0.55, 0, 0.55][L]
        const [x, z] = k < 0.7 ? rectPerimeter(r, s, s * 0.62, 0.05) : [(r() - 0.5) * s, (r() - 0.5) * s * 0.62]
        put(i, x, y + (r() - 0.5) * 0.02, z)
        break
      }
      case 'stack': {
        const L = Math.floor(r() * 3)
        const y = -0.6 + L * 0.6
        if (k < 0.7) {
          const a = r() * Math.PI * 2
          const top = r() < 0.5 ? 0.2 : -0.2
          put(i, Math.cos(a) * 0.85, y + top, Math.sin(a) * 0.85)
        } else {
          const a = Math.floor(r() * 12) * ((Math.PI * 2) / 12)
          put(i, Math.cos(a) * 0.85, y + (r() - 0.5) * 0.4, Math.sin(a) * 0.85)
        }
        break
      }
      case 'lattice': {
        // fibonacci shell + inner neurons
        if (k < 0.72) {
          const t = i / n
          const inc = Math.PI * (3 - Math.sqrt(5))
          const y = 1 - t * 2
          const rad = Math.sqrt(1 - y * y)
          const phi = i * inc
          const R = 1.02 + (r() - 0.5) * 0.04
          put(i, Math.cos(phi) * rad * R, y * R, Math.sin(phi) * rad * R)
        } else {
          const R = Math.cbrt(r()) * 0.7
          const a = r() * Math.PI * 2
          const b = Math.acos(2 * r() - 1)
          put(i, R * Math.sin(b) * Math.cos(a), R * Math.cos(b), R * Math.sin(b) * Math.sin(a))
        }
        break
      }
      case 'loop': {
        // lemniscate tube: the CI/CD infinity loop
        const t = r() * Math.PI * 2
        const d = 1 + Math.sin(t) ** 2
        const x = (1.25 * Math.cos(t)) / d
        const y = (1.25 * Math.sin(t) * Math.cos(t)) / d
        const a = r() * Math.PI * 2
        const tr = 0.11
        put(i, x, y + Math.cos(a) * tr, Math.sin(a) * tr)
        break
      }
      case 'pod': {
        const c = Math.floor(r() * 3)
        const cx = [-0.6, 0.6, 0][c]
        const cy = [-0.38, -0.38, 0.62][c]
        const a = r() * Math.PI * 2
        const b = Math.acos(2 * r() - 1)
        const R = 0.4
        put(i, cx + R * Math.sin(b) * Math.cos(a), cy + R * Math.cos(b), R * Math.sin(b) * Math.sin(a))
        break
      }
      case 'browser': {
        if (k < 0.5) {
          const [x, y] = rectPerimeter(r, 1.9, 1.25, 0.05)
          put(i, x, y, 0)
        } else if (k < 0.62) {
          put(i, -0.95 + r() * 1.9, 0.44, 0)
        } else if (k < 0.7) {
          const d = Math.floor(r() * 3)
          const a = r() * Math.PI * 2
          put(i, -0.82 + d * 0.1 + Math.cos(a) * 0.025, 0.53 + Math.sin(a) * 0.025, 0)
        } else {
          const row = Math.floor(r() * 6)
          put(i, -0.8 + r() * (0.6 + (row % 3) * 0.35), 0.25 - row * 0.12, 0.02)
        }
        break
      }
    }
  }
  return out
}
