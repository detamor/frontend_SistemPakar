<template>
  <div class="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex items-center justify-center px-4 py-8 sm:py-12">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="inline-flex items-center gap-2 mb-3 sm:mb-4">
          <img :src="logoImage" alt="System Pakar" class="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-xl" />
          <span class="text-xl sm:text-2xl font-bold bg-linear-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-poppins">
            System Pakar
          </span>
        </div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {{ step === 1 ? 'Buat Akun Baru' : 'Verifikasi OTP' }}
        </h1>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
          {{ step === 1 ? 'Daftar sekarang dan mulai diagnosis tanaman hias kamu' : 'Masukkan kode OTP yang telah dikirim ke WhatsApp kamu' }}
        </p>
      </div>

      <!-- Register Card -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200">
        <!-- Step 1: Register Form -->
        <form v-if="step === 1" @submit.prevent="handleRegister" class="space-y-5">
          <!-- Name Input -->
          <div>
            <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
              Nama Lengkap <span class="text-red-500">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              placeholder="Contoh: Budi Santoso"
              required
              :disabled="loading"
              class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- Email Input -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              placeholder="Contoh: budi.santoso@email.com"
              required
              :disabled="loading"
              class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- WhatsApp Input -->
          <div>
            <label for="whatsapp" class="block text-sm font-semibold text-gray-700 mb-2">
              Nomor WhatsApp <span class="text-red-500">*</span>
            </label>
            <input
              id="whatsapp"
              v-model="form.whatsapp_number"
              type="tel"
              placeholder="Contoh: 081234567890 atau +62 812-3456-7890"
              required
              :disabled="loading"
              class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- Password Input -->
          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 mb-2">
              Password <span class="text-red-500">*</span>
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              placeholder="Minimal 8 karakter, kombinasi huruf dan angka"
              required
              minlength="8"
              :disabled="loading"
              class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- Password Confirmation Input -->
          <div>
            <label for="password_confirmation" class="block text-sm font-semibold text-gray-700 mb-2">
              Konfirmasi Password <span class="text-red-500">*</span>
            </label>
            <input
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              placeholder="Ketik ulang password yang sama"
              required
              :disabled="loading"
              class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
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
            class="w-full py-3.5 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ loading ? 'Mengirim OTP...' : 'Daftar & Kirim OTP' }}</span>
          </button>
        </form>

        <!-- Step 2: OTP Verification -->
        <div v-if="step === 2" class="space-y-6">
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

          <form @submit.prevent="handleVerifyOtp" class="space-y-5">
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
              <p class="mt-1.5 text-xs text-gray-500 text-center">
                Masukkan 6 digit kode OTP yang diterima
              </p>
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
                class="w-full py-3.5 bg-linear-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ loading ? 'Memverifikasi...' : 'Verifikasi OTP' }}</span>
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
        </div>

        <!-- Links -->
        <div class="mt-6 text-center">
          <router-link
            to="/login"
            class="text-sm text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
          >
            Sudah punya akun? <span class="underline">Masuk</span>
          </router-link>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Dengan mendaftar, Anda menyetujui
          <a href="#" class="text-green-600 hover:text-green-700 font-medium">Ketentuan Layanan</a>
          dan
          <a href="#" class="text-green-600 hover:text-green-700 font-medium">Kebijakan Privasi</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logoImage from '../assets/logo-hydrangea.png'

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
  cooldownInterval = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0) {
      clearInterval(cooldownInterval)
    }
  }, 1000)
}

onMounted(() => {
  // Jika sudah login, redirect
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

onUnmounted(() => {
  if (cooldownInterval) {
    clearInterval(cooldownInterval)
  }
})
</script>
