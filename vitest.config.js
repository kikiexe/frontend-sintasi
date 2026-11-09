import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true
  },
  resolve: {
    alias: {
      'src': path.resolve(import.meta.dirname, './src'),
      'boot': path.resolve(import.meta.dirname, './src/boot'),
      'pages': path.resolve(import.meta.dirname, './src/pages'),
      'assets': path.resolve(import.meta.dirname, './src/assets')
    }
  }
})
