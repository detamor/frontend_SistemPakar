<template>
  <div class="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-12">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center gap-2 mb-4">
          <img :src="logoImage" alt="System Pakar" class="w-12 h-12 object-contain rounded-xl" />
          <span class="text-2xl font-bold bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-poppins">
            System Pakar
          </span>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          {{ step === 1 ? 'Reset Password' : 'Buat Password Baru' }}
        </h1>
        <p class="text-gray-600">
          {{ step === 1 ? 'Masukkan nomor WhatsApp yang terdaftar untuk menerima kode OTP' : 'Masukkan kode OTP dan password baru Anda' }}
        </p>
      </div>

      <!-- Reset Password Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 md:p-10 border border-gray-100">
        <!-- Step 1: Request OTP -->
        <form v-if="step === 1" @submit.prevent="handleRequestReset" class="space-y-5">
          <!-- WhatsApp Input -->
          <div>
            <label for="whatsapp" class="block text-sm font-semibold text-gray-700 mb-2">
              Nomor WhatsApp <span class="text-red-500">*</span>
            </label>
            <input
              id="whatsapp"
              v-model="form.whatsapp_number"
              type="tel"
              placeholder="Masukkan nomor WhatsApp anda yang terdaftar"
              required
              :disabled="loading"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm text-red-700 font-medium">{{ error }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="loading"
            class="w-full py-3.5 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ loading ? 'Mengirim OTP...' : 'Kirim Kode OTP' }}</span>
          </button>
        </form>

        <!-- Step 2: Verify OTP & New Password -->
        <form v-if="step === 2" @submit.prevent="handleResetPassword" class="space-y-5">
          <!-- Info Text -->
          <div class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-green-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
              </svg>
              <div>
                <p class="text-sm font-semibold text-green-800 mb-1">Kode OTP telah dikirim!</p>
                <p class="text-sm text-green-700">
                  Kode OTP telah dikirim ke WhatsApp:<br>
                  <strong class="font-semibold">{{ form.whatsapp_number }}</strong>
                </p>
              </div>
            </div>
          </div>

          <!-- OTP Input -->
          <div>
            <label for="otp" class="block text-sm font-semibold text-gray-700 mb-2">
              Kode OTP (6 digit) <span class="text-red-500">*</span>
            </label>
            <input
              id="otp"
              v-model="otpCode"
              type="text"
              placeholder="123456"
              maxlength="6"
              pattern="[0-9]{6}"
              required
              :disabled="loading"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed text-center text-2xl font-bold tracking-widest"
              @input="otpCode = otpCode.replace(/\D/g, '')"
            />
          </div>

          <!-- New Password Input -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Password Baru <span class="text-red-500">*</span>
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Minimal 8 karakter"
              required
              minlength="8"
              :disabled="loading"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- Password Confirmation Input -->
          <div>
            <label for="password_confirmation" class="block text-sm font-semibold text-gray-700 mb-2">
              Konfirmasi Password Baru <span class="text-red-500">*</span>
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              placeholder="Ulangi password baru"
              required
              :disabled="loading"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div class="flex items-start gap-2">
              <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <p class="text-sm text-red-700 font-medium">{{ error }}</p>
            </div>
          </div>

          <!-- Buttons -->
          <div class="space-y-3">
            <button
              type="submit"
              :disabled="loading"
              class="w-full py-3.5 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ loading ? 'Mengatur ulang...' : 'Reset Password' }}</span>
            </button>
            
            <button
              type="button"
              @click="resendOtp"
              :disabled="loading || resendCooldown > 0"
              class="w-full py-3 border-2 border-green-600 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}s` : 'Kirim Ulang OTP' }}
            </button>
          </div>
        </form>

        <!-- Links -->
        <div class="mt-6 text-center space-y-2">
          <router-link
            to="/login"
            class="block text-sm text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
          >
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
const form = ref({
  whatsapp_number: '',
  password: '',
  password_confirmation: ''
})
const otpCode = ref('')
const loading = ref(false)
const error = ref(null)
const resendCooldown = ref(0)
let cooldownInterval = null

const handleRequestReset = async () => {
  error.value = null
  loading.value = true

  try {
    await authStore.requestPasswordReset(form.value.whatsapp_number)
    step.value = 2
    startResendCooldown()
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal mengirim OTP. Periksa nomor WhatsApp Anda.'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  error.value = null
  loading.value = true

  try {
    await authStore.resetPassword(form.value.whatsapp_number, otpCode.value, form.value.password, form.value.password_confirmation)
    // Redirect akan dilakukan di store
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal reset password. Periksa kode OTP dan password Anda.'
  } finally {
    loading.value = false
  }
}

const resendOtp = async () => {
  if (resendCooldown.value > 0) return

  error.value = null
  loading.value = true

  try {
    await authStore.requestPasswordReset(form.value.whatsapp_number)
    startResendCooldown()
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal mengirim ulang OTP.'
  } finally {
    loading.value = false
  }
}

const startResendCooldown = () => {
  resendCooldown.value = 60
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>
