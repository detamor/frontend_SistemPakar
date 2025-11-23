<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Daftar</h1>
      <p class="subtitle">Buat akun baru</p>

      <!-- Step 1: Register Form -->
      <form v-if="step === 1" @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="name">Nama Lengkap</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            placeholder="Nama lengkap"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="nama@example.com"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="whatsapp">Nomor WhatsApp</label>
          <input
            id="whatsapp"
            v-model="form.whatsapp_number"
            type="tel"
            placeholder="+62 896-0201-5724 atau 081234567890"
            required
            :disabled="loading"
          />
          <small>Format: +62 896-0201-5724, 081234567890, atau 6281234567890</small>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Minimal 8 karakter"
            required
            minlength="8"
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password_confirmation">Konfirmasi Password</label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            placeholder="Ulangi password"
            required
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Mengirim OTP...' : 'Daftar & Kirim OTP' }}
        </button>
      </form>

      <!-- Step 2: OTP Verification -->
      <div v-if="step === 2" class="otp-verification">
        <p class="info-text">
          Kode OTP telah dikirim ke WhatsApp:<br>
          <strong>{{ form.whatsapp_number }}</strong>
        </p>

        <form @submit.prevent="handleVerifyOtp">
          <div class="form-group">
            <label for="otp">Kode OTP (6 digit)</label>
            <input
              id="otp"
              v-model="otpCode"
              type="text"
              placeholder="123456"
              maxlength="6"
              pattern="[0-9]{6}"
              required
              :disabled="loading"
              class="otp-input"
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div class="button-group">
            <button type="submit" :disabled="loading" class="btn-primary">
              {{ loading ? 'Memverifikasi...' : 'Verifikasi OTP' }}
            </button>
            <button type="button" @click="resendOtp" :disabled="loading || resendCooldown > 0" class="btn-secondary">
              {{ resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang OTP' }}
            </button>
          </div>
        </form>
      </div>

      <div class="links">
        <router-link to="/login">Sudah punya akun? Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)
const form = ref({
  name: '',
  email: '',
  whatsapp_number: '',
  password: '',
  password_confirmation: ''
})
const otpCode = ref('')
const loading = ref(false)
const error = ref(null)
const resendCooldown = ref(0)
let cooldownInterval = null

const handleRegister = async () => {
  error.value = null
  loading.value = true

  try {
    const response = await authStore.register(form.value)
    if (response.success) {
      step.value = 2
      startResendCooldown()
    }
  } catch (err) {
    // Tampilkan error detail dari validasi
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      const errorMessages = []
      for (const field in errors) {
        errorMessages.push(...errors[field])
      }
      error.value = errorMessages.join(', ')
    } else {
      error.value = err.response?.data?.message || 'Registrasi gagal. Periksa data Anda.'
    }
    console.error('Register error:', err.response?.data)
  } finally {
    loading.value = false
  }
}

const handleVerifyOtp = async () => {
  error.value = null
  loading.value = true

  try {
    await authStore.verifyOtp(form.value.whatsapp_number, otpCode.value)
    // Redirect akan dilakukan di store
  } catch (err) {
    error.value = err.response?.data?.message || 'OTP tidak valid. Periksa kembali kode OTP Anda.'
  } finally {
    loading.value = false
  }
}

const resendOtp = async () => {
  if (resendCooldown.value > 0) return

  error.value = null
  loading.value = true

  try {
    await authStore.register(form.value)
    startResendCooldown()
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal mengirim ulang OTP.'
  } finally {
    loading.value = false
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  if (cooldownInterval) clearInterval(cooldownInterval)
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

onUnmounted(() => {
  if (cooldownInterval) clearInterval(cooldownInterval)
})
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.register-card {
  background: white;
  border-radius: 12px;
  padding: 3rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.85rem;
}

.otp-input {
  text-align: center;
  font-size: 1.5rem;
  letter-spacing: 0.5rem;
  font-weight: bold;
}

.info-text {
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  margin-bottom: 0.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  width: 100%;
  padding: 0.75rem;
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover:not(:disabled) {
  background: #f5f5f5;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.links {
  margin-top: 1.5rem;
  text-align: center;
}

.links a {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
}

.links a:hover {
  text-decoration: underline;
}
</style>


