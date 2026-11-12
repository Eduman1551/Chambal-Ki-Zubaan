import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // The lazy-loaded 3D chunk (three.js) is big by nature; the main bundle stays small.
    chunkSizeWarningLimit: 1100,
  },
})
