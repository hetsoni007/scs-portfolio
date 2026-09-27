import { useStore, type Theme } from '../state/store'

// 3D mirror of the CSS tokens (DESIGN.md §2). Kept in one place so both themes
// stay in step with styles/tokens.css.
export const PALETTE = {
  // wire: the SOURCE line art — blood red on black, like drafting in red ink.
  // signal: the burning edge of the scan and every hot accent.
  dark: {
    bg: '#050303',
    fg: '#f3eeee',
    signal: '#e0121b',
    wire: '#a8141a',
    metal: '#1e1717',
    glass: '#070404',
    board: '#140d0d',
    additive: true,
    fog: [7, 26] as [number, number],
    envBg: '#0a0606',
  },
  light: {
    bg: '#efe8df',
    fg: '#160808',
    signal: '#b3070c',
    wire: '#990000',
    metal: '#2e2626',
    glass: '#0c0808',
    board: '#221a1a',
    additive: false,
    fog: [8, 30] as [number, number],
    envBg: '#ddd3c6',
  },
} as const

export type Pal = (typeof PALETTE)[Theme]

export function usePalette(): Pal {
  const theme = useStore((s) => s.theme)
  return PALETTE[theme]
}
