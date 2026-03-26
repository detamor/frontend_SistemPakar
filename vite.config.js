import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // VITE_API_BASE_URL biasanya bentuknya: http://10.4.10.128:8000/api
  // Kita butuh backendUrl tanpa "/api" untuk proxy target.
  const apiBaseWithApi = env.VITE_API_BASE_URL || 'http://localhost:8000/api'

  // Kalau VITE_API_BASE_URL berupa path relatif (/api),
  // maka proxy target pakai VITE_BACKEND_PROXY_TARGET.
  const backendUrl = apiBaseWithApi.startsWith('http')
    ? apiBaseWithApi.replace(/\/api\/?$/, '')
    : (env.VITE_BACKEND_PROXY_TARGET || 'http://127.0.0.1:8000')

  return {
    plugins: [vue(), tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 5175,
      strictPort: true,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
