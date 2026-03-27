import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
// Import style.css PERTAMA karena berisi @import statements yang harus di atas
import './style.css'
// Import design-system.css SETELAH style.css
import './styles/design-system.css'
import App from './App.vue'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth store
const authStore = useAuthStore()
authStore
  .initAuth()
  .catch(() => {
    // noop: interceptor/store already handles invalid token cleanup
  })
  .finally(() => {
    app.mount('#app')
  })
