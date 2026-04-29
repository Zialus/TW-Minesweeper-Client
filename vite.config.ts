import { defineConfig } from 'vite'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  root: 'src',
  publicDir: false,
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    open: true,
  },
  plugins: [
    {
      name: 'copy-static',
      apply: 'build',
      enforce: 'post',
      async writeBundle() {
        const src = path.resolve(__dirname, 'src/static')
        const dest = path.resolve(__dirname, 'dist/static')
        
        if (fs.existsSync(src)) {
          fs.cpSync(src, dest, { recursive: true, force: true })
        }
      },
    },
  ],
})
