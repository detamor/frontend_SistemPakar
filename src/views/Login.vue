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
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Masuk ke Akun</h1>
        <p class="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
          Selamat datang kembali! Masukkan email/nomor WhatsApp dan password untuk mengakses semua fitur sistem pakar.
        </p>
      </div>

      <!-- Login Card -->
      <div class="bg-white rounded-xl sm:rounded-2xl shadow-lg p-6 sm:p-8 md:p-10 border border-gray-200">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email/WhatsApp Input -->
          <div>
            <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
              Email atau Nomor WhatsApp <span class="text-red-500">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              type="text"
              placeholder="Contoh: user@email.com atau 081234567890"
              required
              :disabled="loading"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
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
              placeholder="Masukkan password akun kamu"
              required
              :disabled="loading"
              class="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>

          <!-- Error Message -->
          <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
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
            <span>{{ loading ? 'Memproses...' : 'Masuk' }}</span>
          </button>
        </form>

        <!-- Links -->
        <div class="mt-6 space-y-3 text-center">
          <router-link
            to="/register"
            class="block text-sm text-green-600 font-semibold hover:text-green-700 transition-colors duration-200"
          >
            Belum punya akun? <span class="underline">Daftar sekarang</span>
          </router-link>
          <router-link
            to="/reset-password"
            class="block text-sm text-gray-600 hover:text-green-600 transition-colors duration-200"
          >
            Lupa password?
          </router-link>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-500">
          Dengan masuk, Anda menyetujui
          <a href="#" class="text-green-600 hover:text-green-700 font-medium">Ketentuan Layanan</a>
          dan
          <a href="#" class="text-green-600 hover:text-green-700 font-medium">Kebijakan Privasi</a>
        </p>
      </div>
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

const form = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  error.value = null
  loading.value = true

  try {
    await authStore.login(form.value.email, form.value.password)
  } catch (err) {
    error.value = err.response?.data?.message || 'Login gagal. Periksa email/nomor WhatsApp dan password kamu.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // Jika sudah login, redirect
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})
</script>
