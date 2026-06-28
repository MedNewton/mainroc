import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GLB lives in /public, so it's served at /models/enchanted_crystal.glb
})
