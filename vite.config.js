import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest-and-background',
      closeBundle() {
        const distDir = resolve(__dirname, 'dist')
        
        copyFileSync(resolve(__dirname, 'manifest.json'), resolve(distDir, 'manifest.json'))
        copyFileSync(resolve(__dirname, 'src/background.js'), resolve(distDir, 'background.js'))
        
        const iconsDir = resolve(distDir, 'icons')
        if (!existsSync(iconsDir)) {
          mkdirSync(iconsDir, { recursive: true })
        }
      }
    }
  ],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        newtab: 'index.html'
      }
    }
  }
})
