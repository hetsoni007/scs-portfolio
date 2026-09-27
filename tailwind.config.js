/** Tailwind is layout scaffolding only (grid, flex, spacing, display).
 *  Every visual decision lives in src/styles as bespoke CSS on design tokens. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    screens: { sm: '640px', md: '900px', lg: '1200px', xl: '1480px' },
    extend: {
      colors: {
        bg: 'var(--bg)',
        fg: 'var(--fg)',
        'fg-2': 'var(--fg-2)',
        'fg-3': 'var(--fg-3)',
        signal: 'var(--signal)',
        cyan: 'var(--cyan)',
      },
      fontFamily: {
        display: ['Fraunces', 'Iowan Old Style', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
