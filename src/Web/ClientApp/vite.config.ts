import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

const apiTarget =
  process.env.services__webapi__https__0 ??
  process.env.services__webapi__http__0 ??
  'https://localhost:5001'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
  server: {
    host: '0.0.0.0',
    port: Number(process.env.PORT) || 5173,
    strictPort: true,
    proxy: {
      '/api': apiTarget,
      '/openapi': apiTarget,
      '/scalar': apiTarget,
      '/weatherforecast': apiTarget,
      '/WeatherForecast': apiTarget,
    },
  },
})
