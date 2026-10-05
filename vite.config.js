import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 1. Import the Tailwind Vite plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 2. Add the Tailwind plugin here
  ],
  base: './',
  build: {
    rollupOptions: {
      external: ['roslib'],
      output: {
        globals: {
          roslib: 'ROSLIB'
        }
      }
    }
  }
})
