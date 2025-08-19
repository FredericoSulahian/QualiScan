import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      'components': path.resolve(__dirname, './components'),
      'lib': path.resolve(__dirname, './lib'),
      'types': path.resolve(__dirname, './types')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})