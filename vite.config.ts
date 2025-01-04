import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  optimizeDeps: {
    include: ['axios', 'cheerio'],
  },
  build: {
    target: 'es2022', // Or esnext, depending on what works for you
  },
});
