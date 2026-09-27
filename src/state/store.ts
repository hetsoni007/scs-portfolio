import { create } from 'zustand'

export type Tier = 'high' | 'medium' | 'low' | 'off'
export type Phase = 'idle' | 'out' | 'in'
export type Theme = 'dark' | 'light'

type Section = { id: string; label: string; index: number }

type State = {
  theme: Theme
  tier: Tier
  reduced: boolean
  mobile: boolean
  booted: boolean
  stageReady: boolean
  phase: Phase
  section: Section
  menuOpen: boolean
  tiltOn: boolean
  /** Page ↔ scene channels, e.g. `services.active`, `devops.layer`, `calc.weeks`. */
  ch: Record<string, number>
  setTheme: (t: Theme) => void
  setTier: (t: Tier) => void
  setBooted: () => void
  setStageReady: (v: boolean) => void
  setPhase: (p: Phase) => void
  setSection: (s: Section) => void
  setMenu: (v: boolean) => void
  setTilt: (v: boolean) => void
  setCh: (k: string, v: number) => void
}

export const useStore = create<State>((set) => ({
  theme: 'dark',
  tier: 'medium',
  reduced: false,
  mobile: false,
  booted: false,
  stageReady: false,
  phase: 'idle',
  section: { id: 'top', label: 'top', index: 0 },
  menuOpen: false,
  tiltOn: false,
  ch: {},
  setTheme: (theme) => {
    set({ theme })
    document.documentElement.setAttribute('data-theme', theme)
    try {
      localStorage.setItem('scs3d-theme', theme)
    } catch {
      /* private mode */
    }
  },
  setTier: (tier) => set({ tier }),
  setBooted: () => set({ booted: true }),
  setStageReady: (stageReady) => set({ stageReady }),
  setPhase: (phase) => set({ phase }),
  setSection: (section) => set({ section }),
  setMenu: (menuOpen) => set({ menuOpen }),
  setTilt: (tiltOn) => set({ tiltOn }),
  setCh: (k, v) => set((s) => (s.ch[k] === v ? s : { ch: { ...s.ch, [k]: v } })),
}))

/** Read a channel without subscribing (for useFrame loops). */
export const ch = (k: string, fallback = 0) => useStore.getState().ch[k] ?? fallback
