
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Required for GitHub Pages project sites like:
  // https://miklamx.github.io/door-fab-app/
  base: '/door-fab-app/',
})
