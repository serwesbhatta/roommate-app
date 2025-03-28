import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    outDir: 'dist',  // Output directory for the build
  },
  server: {
    port: 3000,  // Port for the development server
  },
})
