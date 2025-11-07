import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    proxy: {
      '/predict': 'http://localhost:5000',
      '/upload': 'http://localhost:5000',
      '/generate-ai': 'http://localhost:5000',
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // This sets @ to point to src/
    },
  },
})
