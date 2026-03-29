<template>
  <div class="auth-page">
    <div class="auth-container">
      <!-- Logo -->
      <div class="auth-logo">
        <img :src="logoImage" alt="System Pakar" class="auth-logo-img" />
        <div>
          <h1 class="auth-logo-name">System Pakar</h1>
          <p class="auth-logo-sub">Tanaman Hias</p>
        </div>
      </div>

      <!-- Card -->
      <div class="sp-card auth-card">
        <h2 class="auth-title">Masuk ke Akun</h2>
        <p class="auth-sub">Silakan masukkan email dan password Anda</p>

        <form @submit.prevent="handleLogin" style="display:flex;flex-direction:column;gap:1.125rem;margin-top:1.5rem;">
          <div>
            <label for="email" class="sp-label">
              Email <span style="color:#dc2626;">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="user@email.com"
              required
              :disabled="loading"
              class="glass-input"
              autocomplete="email"
            />
          </div>

          <div>
            <label for="password" class="sp-label">
              Password <span style="color:#dc2626;">*</span>
            </label>
            <div style="position:relative;">
              <input
                id="password"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Masukkan password"
                required
                :disabled="loading"
                class="glass-input"
                autocomplete="current-password"
                style="padding-right:2.75rem;"
              />
              <button type="button" @click="showPassword = !showPassword" :disabled="loading" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;padding:0;cursor:pointer;color:var(--text-muted);">
                <svg v-if="showPassword" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.477 10.48a3 3 0 104.243 4.243M9.88 5.08A9.955 9.955 0 0112 4c5.523 0 10 5 10 8 0 1.248-.77 2.832-2.1 4.29M6.228 6.228C3.99 7.77 2 10.04 2 12c0 3 4.477 8 10 8 1.647 0 3.174-.445 4.52-1.128" />
                </svg>
                <svg v-else width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div v-if="error" class="sp-alert sp-alert-danger" role="alert">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            {{ error }}
          </div>

          <button type="submit" :disabled="loading" class="sp-btn sp-btn-primary sp-btn-lg" style="width:100%;justify-content:center;margin-top:.25rem;">
            <span v-if="loading" class="sp-spinner" style="width:18px;height:18px;border-width:2px;border-color:rgba(255,255,255,.4);border-top-color:#fff;"></span>
            {{ loading ? 'Memproses...' : 'Masuk' }}
          </button>
        </form>

        <div class="auth-links">
          <RouterLink to="/register">
            Belum punya akun? <strong>Daftar sekarang</strong>
          </RouterLink>
          <RouterLink to="/reset-password" style="color:var(--text-muted);">Lupa password?</RouterLink>
        </div>
      </div>

      <p class="auth-footer-note">
        Dengan masuk, Anda menyetujui
        <a href="#">Ketentuan Layanan</a> dan <a href="#">Kebijakan Privasi</a> kami.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logoImage from '../assets/logo-hydrangea.png'

const router = useRouter()
const authStore = useAuthStore()

const form    = ref({ email: '', password: '' })
const showPassword = ref(false)
const loading = ref(false)
const error   = ref(null)

const handleLogin = async () => {
  error.value = null
  loading.value = true
  try {
    await authStore.login(form.value.email, form.value.password)
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.'
  } finally {
    loading.value = false
  }
}

onMounted(() => { if (authStore.isAuthenticated) router.push('/') })
</script>

<style scoped>
a { text-decoration: none; }

.auth-page {
  min-height: 100vh;
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
}

.auth-container {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.auth-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  text-align: center;
}
.auth-logo-img  { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border); }
.auth-logo-name { font-size: 1.25rem; font-weight: 800; color: var(--gray-900); margin: 0; }
.auth-logo-sub  { font-size: .75rem; color: var(--text-muted); margin: 0; }

.auth-card  { padding: 2rem; }
.auth-title { font-size: 1.375rem; font-weight: 700; color: var(--gray-900); margin: 0 0 .25rem; }
.auth-sub   { font-size: .875rem; color: var(--text-muted); margin: 0; }

.auth-links {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: .625rem;
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--border);
  font-size: .875rem;
}
.auth-links a { color: var(--primary); transition: color .15s; }
.auth-links a:hover { color: var(--primary-dark); }

.auth-footer-note {
  text-align: center;
  font-size: .775rem;
  color: var(--text-faint);
  margin: 0;
}
.auth-footer-note a { color: var(--primary); }
</style>
