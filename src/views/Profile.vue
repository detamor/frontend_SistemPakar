<template>
  <div class="profile-container">
    <div class="profile-card">
      <h1>Profil Saya</h1>

      <div v-if="loading && !user" class="loading">
        Memuat profil...
      </div>

      <div v-else-if="user">
        <!-- Profile Photo -->
        <div class="photo-section">
          <div class="photo-preview">
            <img
              v-if="user.photo || photoPreview"
              :src="photoPreview || getPhotoUrl(user.photo)"
              :alt="user.name"
              class="profile-photo"
            />
            <div v-else class="profile-photo-placeholder">
              {{ user.name?.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="photo-actions">
            <label for="photo-upload" class="btn-upload">
              {{ user.photo ? 'Ganti Foto' : 'Upload Foto' }}
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              @change="handlePhotoChange"
              style="display: none"
            />
            <button
              v-if="user.photo"
              @click="removePhoto"
              class="btn-remove-photo"
            >
              Hapus Foto
            </button>
          </div>
        </div>

        <!-- Profile Form -->
        <form @submit.prevent="handleUpdateProfile">
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
              placeholder="email@example.com"
              required
              :disabled="loading"
            />
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            {{ success }}
          </div>

          <button type="submit" :disabled="loading" class="btn-primary">
            {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
          </button>
        </form>

        <!-- Change Password Section -->
        <div class="password-section">
          <h2>Ubah Password</h2>
          <form @submit.prevent="handleChangePassword">
            <div class="form-group">
              <label for="current_password">Password Lama</label>
              <input
                id="current_password"
                v-model="passwordForm.current_password"
                type="password"
                placeholder="Masukkan password lama"
                required
                :disabled="passwordLoading"
              />
            </div>

            <div class="form-group">
              <label for="new_password">Password Baru</label>
              <input
                id="new_password"
                v-model="passwordForm.password"
                type="password"
                placeholder="Minimal 8 karakter"
                required
                minlength="8"
                :disabled="passwordLoading"
              />
            </div>

            <div class="form-group">
              <label for="password_confirmation">Konfirmasi Password Baru</label>
              <input
                id="password_confirmation"
                v-model="passwordForm.password_confirmation"
                type="password"
                placeholder="Ulangi password baru"
                required
                :disabled="passwordLoading"
              />
            </div>

            <div v-if="passwordError" class="error-message">
              {{ passwordError }}
            </div>

            <div v-if="passwordSuccess" class="success-message">
              {{ passwordSuccess }}
            </div>

            <button type="submit" :disabled="passwordLoading" class="btn-primary">
              {{ passwordLoading ? 'Mengubah...' : 'Ubah Password' }}
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
const error = ref(null)
const success = ref(null)
const passwordError = ref(null)
const passwordSuccess = ref(null)
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
  // Assuming photos are stored in public storage
  return `/storage/${photoPath}`
}

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedPhoto.value = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = () => {
  selectedPhoto.value = null
  photoPreview.value = null
  // Note: Backend needs endpoint to remove photo
}

const handleUpdateProfile = async () => {
  error.value = null
  success.value = null
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
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal memperbarui profil'
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
    }
  } catch (err) {
    passwordError.value = err.response?.data?.message || 'Gagal mengubah password'
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
.profile-container {
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 2rem 0;
  color: #333;
  font-size: 2rem;
}

.photo-section {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #eee;
}

.photo-preview {
  margin-bottom: 1rem;
}

.profile-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #667eea;
}

.profile-photo-placeholder {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: #667eea;
  color: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto;
}

.photo-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-upload,
.btn-remove-photo {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
  border: none;
}

.btn-upload {
  background: #667eea;
  color: white;
}

.btn-upload:hover {
  background: #5568d3;
}

.btn-remove-photo {
  background: #e74c3c;
  color: white;
}

.btn-remove-photo:hover {
  background: #c0392b;
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

.password-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.password-section h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
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
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>


