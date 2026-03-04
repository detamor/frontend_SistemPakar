<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md animate-fade-in">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-4">
          <img :src="logoImage" alt="System Pakar" class="w-12 h-12 object-contain rounded-xl ring-2 ring-emerald-400/30" />
          <span class="text-2xl font-bold bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">System Pakar</span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-white mb-2">Reset Password</h1>
        <p class="text-sm text-slate-400">
          {{ step === 1 ? 'Masukkan email yang terdaftar untuk menerima kode OTP' : 'Masukkan kode OTP dan password baru Anda' }}
        </p>
      </div>

      <!-- Glass Card -->
      <div class="glass-card-strong p-6 sm:p-8">
        <!-- Step 1: Request OTP -->
        <form v-if="step === 1" @submit.prevent="handleRequestReset" class="space-y-5">
          <div>
            <label for="email" class="form-label">Email <span class="text-red-400">*</span></label>
            <input id="email" v-model="form.email" type="email" placeholder="Email yang terdaftar" required aria-required="true" :disabled="loading" class="glass-input" autocomplete="email" />
          </div>

          <div v-if="error" role="alert" aria-live="assertive" class="alert alert-danger flex items-center gap-2 !text-sm">
            <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
            <span>{{ error }}</span>
          </div>

          <button type="submit" :disabled="loading" class="glass-btn glass-btn-primary w-full !py-3.5">
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ loading ? 'Mengirim OTP...' : 'Kirim Kode OTP' }}</span>
          </button>
        </form>

        <!-- Step 2: Verify OTP & New Password -->
        <form v-if="step === 2" @submit.prevent="handleResetPassword" class="space-y-5">
          <div role="alert" aria-live="polite" class="alert alert-success flex items-start gap-3">
            <svg class="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
            <div class="text-sm">Kode OTP telah dikirim ke email:<br><strong class="text-emerald-300">{{ form.email }}</strong></div>
          </div>

          <div>
            <label for="otp" class="form-label">Kode OTP (6 digit) <span class="text-red-400">*</span></label>
            <input id="otp" v-model="otpCode" type="text" maxlength="6" placeholder="000000" required aria-required="true" :disabled="loading" class="glass-input text-center text-xl tracking-[0.5em] font-mono" inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" @input="otpCode = otpCode.replace(/\D/g, '')" />
          </div>

          <div>
            <label for="password" class="form-label">Password Baru <span class="text-red-400">*</span></label>
            <input id="password" v-model="form.password" type="password" placeholder="Minimal 8 karakter" required aria-required="true" :disabled="loading" class="glass-input" autocomplete="new-password" />
          </div>

          <div>
            <label for="password_confirmation" class="form-label">Konfirmasi Password Baru <span class="text-red-400">*</span></label>
            <input id="password_confirmation" v-model="form.password_confirmation" type="password" placeholder="Ulangi password baru" required aria-required="true" :disabled="loading" class="glass-input" autocomplete="new-password" />
          </div>

          <div v-if="error" role="alert" aria-live="assertive" class="alert alert-danger flex items-center gap-2 !text-sm">
            <svg class="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path></svg>
            <span>{{ error }}</span>
          </div>

          <div class="space-y-3">
            <button type="submit" :disabled="loading" class="glass-btn glass-btn-primary w-full !py-3.5">
              <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ loading ? 'Mereset...' : 'Reset Password' }}</span>
            </button>
            <button type="button" @click="resendOtp" :disabled="resendCooldown > 0 || loading" class="glass-btn glass-btn-secondary w-full !py-3">
              {{ resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}s` : 'Kirim Ulang OTP' }}
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <router-link to="/login" class="text-sm text-emerald-400 font-semibold hover:text-emerald-300 transition-colors">
            Kembali ke halaman masuk
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logoImage from '../assets/logo-hydrangea.png'

const router = useRouter()
const authStore = useAuthStore()

const step = ref(1)
const form = ref({ email: '', password: '', password_confirmation: '' })
const otpCode = ref('')
const loading = ref(false)
const error = ref(null)
const resendCooldown = ref(0)
let cooldownInterval = null

const handleRequestReset = async () => {
  error.value = null; loading.value = true
  try { await authStore.requestPasswordReset(form.value.email); step.value = 2; startResendCooldown() }
  catch (err) { error.value = err.response?.data?.message || 'Gagal mengirim OTP. Periksa email Anda.' }
  finally { loading.value = false }
}

const handleResetPassword = async () => {
  error.value = null; loading.value = true
  try { await authStore.resetPassword(form.value.email, otpCode.value, form.value.password, form.value.password_confirmation) }
  catch (err) { error.value = err.response?.data?.message || 'Gagal reset password.' }
  finally { loading.value = false }
}

const resendOtp = async () => {
  if (resendCooldown.value > 0) return
  error.value = null; loading.value = true
  try { await authStore.requestPasswordReset(form.value.email); startResendCooldown() }
  catch (err) { error.value = err.response?.data?.message || 'Gagal mengirim ulang OTP.' }
  finally { loading.value = false }
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) clearInterval(cooldownInterval)
  }, 1000)
}

onUnmounted(() => { if (cooldownInterval) clearInterval(cooldownInterval) })
</script>

<style scoped>
a { text-decoration: none !important; }
</style>
