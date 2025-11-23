<template>
  <div class="reset-container">
    <div class="reset-card">
      <h1>Reset Password</h1>
      <p class="subtitle">Reset password Anda dengan OTP</p>

      <!-- Step 1: Request OTP -->
      <form v-if="step === 1" @submit.prevent="handleRequestOtp">
        <div class="form-group">
          <label for="whatsapp">Nomor WhatsApp Terdaftar</label>
          <input
            id="whatsapp"
            v-model="whatsappNumber"
            type="tel"
            placeholder="+62 896-0201-5724 atau 081234567890"
            required
            :disabled="loading"
          />
          <small>Format: +62 896-0201-5724, 081234567890, atau 6281234567890</small>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="btn-primary">
          {{ loading ? 'Mengirim OTP...' : 'Kirim OTP' }}
        </button>
      </form>

      <!-- Step 2: Verify OTP & Reset Password -->
      <form v-if="step === 2" @submit.prevent="handleResetPassword">
        <p class="info-text">
          Kode OTP telah dikirim ke WhatsApp:<br>
          <strong>{{ whatsappNumber }}</strong>
        </p>

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

        <div class="form-group">
          <label for="password">Password Baru</label>
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
          <label for="password_confirmation">Konfirmasi Password Baru</label>
          <input
            id="password_confirmation"
            v-model="form.password_confirmation"
            type="password"
            placeholder="Ulangi password baru"
            required
            :disabled="loading"
          />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div class="button-group">
          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Memproses...' : 'Reset Password' }}
          </button>
          <button type="button" @click="resendOtp" :disabled="loading || resendCooldown > 0" class="btn-secondary">
            {{ resendCooldown > 0 ? `Kirim ulang (${resendCooldown}s)` : 'Kirim Ulang OTP' }}
          </button>
        </div>
      </form>

      <div v-if="success" class="success-message">
        {{ success }}
      </div>

      <div class="links">
        <router-link to="/login">Kembali ke Login</router-link>
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
const whatsappNumber = ref('')
const otpCode = ref('')
const form = ref({
  password: '',
  password_confirmation: ''
})
const loading = ref(false)
const error = ref(null)
const success = ref(null)
const resendCooldown = ref(0)
let cooldownInterval = null

const handleRequestOtp = async () => {
  error.value = null
  loading.value = true

  try {
    const response = await authStore.requestPasswordReset(whatsappNumber.value)
    if (response.success) {
      step.value = 2
      startResendCooldown()
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal mengirim OTP. Periksa nomor WhatsApp Anda.'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  error.value = null
  success.value = null
  loading.value = true

  try {
    const response = await authStore.resetPassword(
      whatsappNumber.value,
      otpCode.value,
      form.value.password,
      form.value.password_confirmation
    )
    
    if (response.success) {
      success.value = response.message
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal reset password. Periksa OTP dan password Anda.'
  } finally {
    loading.value = false
  }
}

const resendOtp = async () => {
  if (resendCooldown.value > 0) return

  error.value = null
  loading.value = true

  try {
    await authStore.requestPasswordReset(whatsappNumber.value)
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
.reset-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.reset-card {
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

.success-message {
  background: #efe;
  color: #3c3;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
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


