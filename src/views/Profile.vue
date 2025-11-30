<template>
  <div class="min-h-screen bg-gray-50 pt-20 pb-12">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Tombol Kembali -->
      <div class="mb-6">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 text-gray-700 rounded-lg transition-colors text-sm font-medium shadow-sm border border-gray-200"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Kembali ke Home</span>
        </router-link>
      </div>

      <div v-if="loading && !user" class="bg-white rounded-xl shadow-md p-12 text-center">
        <div class="inline-block w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
        <p class="mt-4 text-gray-600">Memuat profil...</p>
      </div>

      <div v-else-if="user" class="space-y-6">
        <!-- Profile Photo Section -->
        <div class="bg-white rounded-xl shadow-md p-8 border-2 border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Foto Profil</h2>
          
          <div class="flex flex-col items-center">
            <!-- Photo Preview -->
            <div class="relative mb-6">
              <div class="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-green-200 shadow-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center">
                <img
                  v-if="user.photo || photoPreview"
                  :src="photoPreview || getPhotoUrl(user.photo)"
                  :alt="user.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="text-5xl md:text-6xl font-bold text-green-600">
                  {{ user.name?.charAt(0).toUpperCase() }}
                </div>
              </div>
              <!-- Upload Indicator -->
              <div v-if="uploadingPhoto" class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                <div class="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>

            <!-- Photo Actions -->
            <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <label
                for="photo-upload"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 cursor-pointer shadow-sm"
                :class="{ 'opacity-50 cursor-not-allowed': uploadingPhoto }"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span>{{ user.photo ? 'Ganti Foto' : 'Upload Foto' }}</span>
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/jpeg,image/png,image/jpg,image/gif"
                @change="handlePhotoChange"
                :disabled="uploadingPhoto"
                class="hidden"
              />
              <button
                v-if="user.photo"
                @click="handleRemovePhoto"
                :disabled="uploadingPhoto"
                class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>Hapus Foto</span>
              </button>
            </div>

            <!-- File Info -->
            <div v-if="selectedPhoto" class="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 w-full sm:w-auto">
              <p class="text-sm text-blue-800">
                <span class="font-medium">File dipilih:</span> {{ selectedPhoto.name }}
                <span class="text-blue-600">({{ formatFileSize(selectedPhoto.size) }})</span>
              </p>
              <p class="text-xs text-blue-600 mt-1">
                Klik "Simpan Perubahan" untuk mengupload foto
              </p>
            </div>

            <!-- Error Message -->
            <div v-if="photoError" class="mt-4 p-3 bg-red-50 rounded-lg border border-red-200 w-full sm:w-auto">
              <p class="text-sm text-red-800">{{ photoError }}</p>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="bg-white rounded-xl shadow-md p-8 border-2 border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Informasi Profil</h2>
          
          <form @submit.prevent="handleUpdateProfile" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-semibold text-gray-700 mb-2">
                Nama Lengkap <span class="text-red-500">*</span>
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Masukkan nama lengkap"
                required
                :disabled="loading"
                class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label for="email" class="block text-sm font-semibold text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Masukkan alamat email"
                required
                :disabled="loading"
                class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <div v-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <p class="text-sm text-red-700 font-medium">{{ error }}</p>
              </div>
            </div>

            <div v-if="success" class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <p class="text-sm text-green-700 font-medium">{{ success }}</p>
              </div>
            </div>

            <button
              type="submit"
              :disabled="loading || uploadingPhoto"
              class="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="loading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
            </button>
          </form>
        </div>

        <!-- Change Password Section -->
        <div class="bg-white rounded-xl shadow-md p-8 border-2 border-gray-200">
          <h2 class="text-xl font-bold text-gray-900 mb-6">Ubah Password</h2>
          
          <form @submit.prevent="handleChangePassword" class="space-y-6">
            <div>
              <label for="current_password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password Lama <span class="text-red-500">*</span>
              </label>
              <input
                id="current_password"
                v-model="passwordForm.current_password"
                type="password"
                placeholder="Masukkan password lama"
                required
                :disabled="passwordLoading"
                class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label for="new_password" class="block text-sm font-semibold text-gray-700 mb-2">
                Password Baru <span class="text-red-500">*</span>
              </label>
              <input
                id="new_password"
                v-model="passwordForm.password"
                type="password"
                placeholder="Minimal 8 karakter"
                required
                minlength="8"
                :disabled="passwordLoading"
                class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p class="mt-1.5 text-xs text-gray-500">
                Gunakan kombinasi huruf, angka, dan karakter khusus untuk keamanan lebih baik
              </p>
            </div>

            <div>
              <label for="password_confirmation" class="block text-sm font-semibold text-gray-700 mb-2">
                Konfirmasi Password Baru <span class="text-red-500">*</span>
              </label>
              <input
                id="password_confirmation"
                v-model="passwordForm.password_confirmation"
                type="password"
                placeholder="Ulangi password baru"
                required
                :disabled="passwordLoading"
                class="w-full px-4 py-3 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p class="mt-1.5 text-xs text-gray-500">
                Pastikan password sama dengan yang kamu masukkan di atas
              </p>
            </div>

            <div v-if="passwordError" class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                </svg>
                <p class="text-sm text-red-700 font-medium">{{ passwordError }}</p>
              </div>
            </div>

            <div v-if="passwordSuccess" class="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg">
              <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-green-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <p class="text-sm text-green-700 font-medium">{{ passwordSuccess }}</p>
              </div>
            </div>

            <button
              type="submit"
              :disabled="passwordLoading"
              class="w-full py-3.5 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span v-if="passwordLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ passwordLoading ? 'Mengubah...' : 'Ubah Password' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProfileStore } from '../stores/profile'

const authStore = useAuthStore()
const profileStore = useProfileStore()

const loading = ref(false)
const passwordLoading = ref(false)
const uploadingPhoto = ref(false)
const error = ref(null)
const success = ref(null)
const passwordError = ref(null)
const passwordSuccess = ref(null)
const photoError = ref(null)
const photoPreview = ref(null)
const selectedPhoto = ref(null)

const user = computed(() => authStore.user)

const form = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const getPhotoUrl = (photoPath) => {
  if (!photoPath) return null
  // Laravel storage path
  if (photoPath.startsWith('http')) {
    return photoPath
  }
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${photoPath}`
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  photoError.value = null
  
  if (!file) return

  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif']
  if (!validTypes.includes(file.type)) {
    photoError.value = 'Format file tidak didukung. Gunakan JPG, PNG, atau GIF.'
    event.target.value = ''
    return
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    photoError.value = 'Ukuran file terlalu besar. Maksimal 2MB.'
    event.target.value = ''
    return
  }

  selectedPhoto.value = file
  
  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleRemovePhoto = async () => {
  if (!confirm('Apakah kamu yakin ingin menghapus foto profil?')) {
    return
  }

  photoError.value = null
  uploadingPhoto.value = true

  try {
    const response = await profileStore.removePhoto()
    if (response.success) {
      photoPreview.value = null
      selectedPhoto.value = null
      success.value = 'Foto profil berhasil dihapus'
      setTimeout(() => {
        success.value = null
      }, 3000)
    }
  } catch (err) {
    photoError.value = err.response?.data?.message || 'Gagal menghapus foto profil'
  } finally {
    uploadingPhoto.value = false
  }
}

const handleUpdateProfile = async () => {
  error.value = null
  success.value = null
  photoError.value = null
  loading.value = true

  const profileData = {
    name: form.value.name,
    email: form.value.email
  }

  if (selectedPhoto.value) {
    profileData.photo = selectedPhoto.value
  }

  try {
    const response = await profileStore.updateProfile(profileData)
    if (response.success) {
      success.value = response.message || 'Profil berhasil diperbarui'
      selectedPhoto.value = null
      photoPreview.value = null
      setTimeout(() => {
        success.value = null
      }, 3000)
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      const errorMessages = []
      for (const field in errors) {
        errorMessages.push(...errors[field])
      }
      error.value = errorMessages.join(', ')
    } else {
      error.value = err.response?.data?.message || 'Gagal memperbarui profil'
    }
  } finally {
    loading.value = false
  }
}

const handleChangePassword = async () => {
  passwordError.value = null
  passwordSuccess.value = null
  passwordLoading.value = true

  try {
    const response = await profileStore.changePassword(passwordForm.value)
    if (response.success) {
      passwordSuccess.value = response.message || 'Password berhasil diubah'
      passwordForm.value = {
        current_password: '',
        password: '',
        password_confirmation: ''
      }
      setTimeout(() => {
        passwordSuccess.value = null
      }, 3000)
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      const errors = err.response.data.errors
      const errorMessages = []
      for (const field in errors) {
        errorMessages.push(...errors[field])
      }
      passwordError.value = errorMessages.join(', ')
    } else {
      passwordError.value = err.response?.data?.message || 'Gagal mengubah password'
    }
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  if (user.value) {
    form.value.name = user.value.name || ''
    form.value.email = user.value.email || ''
  }
})
</script>

<style scoped>
/* Additional styles if needed */
</style>
