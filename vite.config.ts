import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Plain SPA build. three.js, r3f and postprocessing live only in the lazily
// imported stage/scene chunks, so the first paint ships React, the router, the
// page shell, GSAP/Lenis and CSS only.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2022',
    assetsInlineLimit: 0,
    // The WebGL vendor chunk is large by nature and never on the critical path.
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        // Cosmetic only: the bundler names shared chunks after one of their modules
        // ("palette"); call the WebGL vendor chunk what it is. The chunk graph is untouched.
        chunkFileNames: (info) =>
          info.moduleIds.some((id) => /[\\/]node_modules[\\/]three[\\/]build[\\/]/.test(id)) ? 'assets/three-[hash].js' : 'assets/[name]-[hash].js',
      },
    },
  },
  server: { port: 5178, strictPort: true },
  preview: { port: 4178, strictPort: true },
})
