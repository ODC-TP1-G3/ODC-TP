import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
 HEAD
        target: 'http://127.0.0.1:4000',

        target: 'http://192.168.0.32:4000',
 tp-devops
        changeOrigin: true,
      },
    },
  },
})