import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      canvas: resolve('./src/utils/canvasMock.js'),
    }
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  worker: {
    format: 'iife'
  }
})
