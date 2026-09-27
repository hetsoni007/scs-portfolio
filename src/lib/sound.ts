// Ambient sound, synthesized in WebAudio: no audio files. A low detuned drone through
// a slowly breathing low-pass, a soft fire roar and sparse crackle. Off by default.
// It can only start from a user gesture (browser autoplay rules), so the waveform
// toggle and the boot screen's click are the only ways in.

type Sub = (on: boolean) => void

let ctx: AudioContext | null = null
let master: GainNode | null = null
let analyser: AnalyserNode | null = null
let on = false
let stopTimer = 0
const subs = new Set<Sub>()

function noiseBuffer(c: AudioContext, seconds: number, crackle: boolean) {
  const len = Math.floor(c.sampleRate * seconds)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const d = buf.getChannelData(0)
  if (!crackle) {
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1
    return buf
  }
  // Sparse pops, each a few ms of decaying noise.
  let i = 0
  while (i < len) {
    i += Math.floor(c.sampleRate * (0.02 + Math.random() * 0.22))
    const n = Math.floor(c.sampleRate * (0.002 + Math.random() * 0.012))
    const amp = 0.3 + Math.random() * 0.7
    for (let k = 0; k < n && i + k < len; k++) d[i + k] = (Math.random() * 2 - 1) * amp * Math.pow(1 - k / n, 3)
  }
  return buf
}

function build() {
  const c = new AudioContext()
  const m = c.createGain()
  m.gain.value = 0
  const an = c.createAnalyser()
  an.fftSize = 64
  an.smoothingTimeConstant = 0.82
  m.connect(an)
  an.connect(c.destination)

  const lp = c.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 300
  lp.Q.value = 5
  const lfo = c.createOscillator()
  lfo.frequency.value = 0.06
  const lfoAmt = c.createGain()
  lfoAmt.gain.value = 150
  lfo.connect(lfoAmt).connect(lp.frequency)
  lfo.start()
  ;[
    [55, 'sawtooth', 0.16],
    [55.37, 'sawtooth', 0.16],
    [82.4, 'triangle', 0.1],
    [27.5, 'sine', 0.22],
  ].forEach(([f, type, gain]) => {
    const o = c.createOscillator()
    o.type = type as OscillatorType
    o.frequency.value = f as number
    const g = c.createGain()
    g.gain.value = gain as number
    o.connect(g).connect(lp)
    o.start()
  })
  lp.connect(m)

  const roar = c.createBufferSource()
  roar.buffer = noiseBuffer(c, 3, false)
  roar.loop = true
  const roarBp = c.createBiquadFilter()
  roarBp.type = 'bandpass'
  roarBp.frequency.value = 520
  roarBp.Q.value = 0.7
  const roarG = c.createGain()
  roarG.gain.value = 0.045
  roar.connect(roarBp).connect(roarG).connect(m)
  roar.start()

  const crack = c.createBufferSource()
  crack.buffer = noiseBuffer(c, 5, true)
  crack.loop = true
  const crackHp = c.createBiquadFilter()
  crackHp.type = 'highpass'
  crackHp.frequency.value = 1400
  const crackG = c.createGain()
  crackG.gain.value = 0.08
  crack.connect(crackHp).connect(crackG).connect(m)
  crack.start()

  ctx = c
  master = m
  analyser = an
}

const notify = () => subs.forEach((f) => f(on))

export const sound = {
  get on() {
    return on
  },
  get analyser() {
    return analyser
  },
  subscribe(fn: Sub) {
    subs.add(fn)
    return () => {
      subs.delete(fn)
    }
  },
  async start() {
    if (on) return
    try {
      if (!ctx) build()
      clearTimeout(stopTimer)
      await ctx!.resume()
      master!.gain.cancelScheduledValues(ctx!.currentTime)
      master!.gain.setTargetAtTime(0.32, ctx!.currentTime, 0.7)
      on = true
      notify()
    } catch {
      /* no audio device or blocked: stay silent */
    }
  },
  stop() {
    if (!on || !ctx || !master) return
    master.gain.cancelScheduledValues(ctx.currentTime)
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.25)
    on = false
    notify()
    stopTimer = window.setTimeout(() => ctx?.suspend(), 1200)
  },
  toggle() {
    return on ? sound.stop() : sound.start()
  },
  /** A rising filtered-noise gust, played with the flame wipe. */
  whoosh() {
    if (!on || !ctx || !master) return
    const c = ctx
    const src = c.createBufferSource()
    src.buffer = noiseBuffer(c, 1.2, false)
    const bp = c.createBiquadFilter()
    bp.type = 'bandpass'
    bp.Q.value = 1.4
    bp.frequency.setValueAtTime(260, c.currentTime)
    bp.frequency.exponentialRampToValueAtTime(2600, c.currentTime + 0.9)
    const g = c.createGain()
    g.gain.setValueAtTime(0.0001, c.currentTime)
    g.gain.exponentialRampToValueAtTime(0.5, c.currentTime + 0.35)
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + 1.1)
    src.connect(bp).connect(g).connect(master)
    src.start()
    src.stop(c.currentTime + 1.2)
  },
}
