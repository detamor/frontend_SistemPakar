<template>
  <div class="profile-page">
    <div class="profile-container">

      <!-- Loading State -->
      <div v-if="loading && !user" class="loading-box">
        <div class="spinner"></div>
        <p>Memuat...</p>
      </div>

      <template v-else-if="user">
        <transition name="fade" mode="out-in">

          <!-- ==================== VIEW MODE ==================== -->
          <div v-if="!isEditing" key="view" class="profile-card">

            <!-- Top Section: Avatar + Info -->
            <div class="profile-header">
              <div class="avatar-wrapper">
                <div class="avatar">
                  <img v-if="user.photo && !photoLoadError" :src="getPhotoUrl(user.photo)" :alt="user.name" @error="photoLoadError = true" />
                  <svg v-else class="avatar-placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              </div>

              <div class="info">
                <h2 class="info-name">{{ user.name }}</h2>
                <div class="info-row">
                  <span class="info-label">Email</span>
                  <span class="info-value">{{ user.email }}</span>
                </div>
              </div>
            </div>

            <!-- Bio Section -->
            <div class="bio-section" v-if="user.bio">
              <span class="bio-label">Tentang</span>
              <p class="bio-text">{{ user.bio }}</p>
            </div>

            <!-- Actions -->
            <div class="actions-row">
              <button @click="startEditing" class="btn btn-outline">Edit Profile</button>
              <button @click="openEmailModal" class="btn btn-outline">Ubah Email</button>
              <button @click="showPasswordModal = true" class="btn btn-outline">Ubah Password</button>
            </div>
          </div>

          <!-- ==================== EDIT MODE ==================== -->
          <div v-else key="edit" class="profile-card">
            <form @submit.prevent="handleUpdateProfile">

              <!-- Photo Profile Section -->
              <div class="form-section">
                <span class="form-section-title">Photo Profile</span>
                <div class="photo-upload-row">
                  <div class="avatar avatar--small">
                    <img v-if="(photoPreview || user.photo) && !editPhotoLoadError" :src="photoPreview || getPhotoUrl(user.photo)" @error="editPhotoLoadError = true" />
                    <svg v-else class="avatar-placeholder" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                  </div>
                  <div class="photo-upload-info">
                    <label for="photo-upload" class="btn btn-outline btn--sm">Choose Photo</label>
                    <span class="photo-hint">JPG, PNG max 2MB</span>
                    <input id="photo-upload" type="file" @change="handlePhotoChange" hidden accept="image/*" />
                  </div>
                </div>
              </div>

              <!-- Name -->
              <div class="form-group">
                <label class="form-label">Name</label>
                <input v-model="form.name" type="text" class="form-input" />
              </div>

              <!-- Bio -->
              <div class="form-group">
                <label class="form-label">Tentang</label>
                <textarea v-model="form.bio" rows="4" class="form-input form-textarea"></textarea>
              </div>

              <!-- Feedback -->
              <transition name="fade" mode="out-in">
                <div v-if="error" key="error" class="feedback feedback--error">{{ error }}</div>
                <div v-else-if="success" key="success" class="feedback feedback--success">{{ success }}</div>
              </transition>

              <!-- Actions -->
              <div class="actions-row">
                <button type="submit" :disabled="loading" class="btn btn-primary">
                  <div v-if="loading" class="spinner spinner--sm"></div>
                  Save
                </button>
                <button type="button" @click="cancelEditing" class="btn btn-outline">Cancel</button>
              </div>

            </form>
          </div>

        </transition>
      </template>
    </div>

    <!-- ==================== PASSWORD MODAL ==================== -->
    <transition name="fade">
      <div v-if="showPasswordModal" class="modal-overlay">
        <div class="modal-card" @click.stop>
          <h3 class="modal-title">Ubah Password</h3>

          <form @submit.prevent="handleChangePassword">
            <div class="form-group">
              <label class="form-label">Password Lama</label>
              <div style="position:relative;">
                <input v-model="passwordForm.current_password" :type="showCurrentPassword ? 'text' : 'password'" class="form-input" required style="padding-right:2.75rem;" autocomplete="current-password" />
                <button type="button" @click="showCurrentPassword = !showCurrentPassword" :disabled="passwordLoading" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;padding:0;cursor:pointer;color:#6b7280;">
                  <svg v-if="showCurrentPassword" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.477 10.48a3 3 0 104.243 4.243M9.88 5.08A9.955 9.955 0 0112 4c5.523 0 10 5 10 8 0 1.248-.77 2.832-2.1 4.29M6.228 6.228C3.99 7.77 2 10.04 2 12c0 3 4.477 8 10 8 1.647 0 3.174-.445 4.52-1.128" />
                  </svg>
                  <svg v-else width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label">Password Baru</label>
              <div style="position:relative;">
                <input v-model="passwordForm.password" :type="showNewPassword ? 'text' : 'password'" class="form-input" required minlength="8" style="padding-right:2.75rem;" autocomplete="new-password" placeholder="Minimal 8 karakter" />
                <button type="button" @click="showNewPassword = !showNewPassword" :disabled="passwordLoading" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;padding:0;cursor:pointer;color:#6b7280;">
                  <svg v-if="showNewPassword" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.477 10.48a3 3 0 104.243 4.243M9.88 5.08A9.955 9.955 0 0112 4c5.523 0 10 5 10 8 0 1.248-.77 2.832-2.1 4.29M6.228 6.228C3.99 7.77 2 10.04 2 12c0 3 4.477 8 10 8 1.647 0 3.174-.445 4.52-1.128" />
                  </svg>
                  <svg v-else width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
              <div class="photo-hint" style="margin-top:6px;">Minimal 8 karakter, bebas kombinasi huruf/angka/simbol.</div>
            </div>
            <div class="form-group">
              <label class="form-label">Konfirmasi Password</label>
              <div style="position:relative;">
                <input v-model="passwordForm.password_confirmation" :type="showNewPasswordConfirmation ? 'text' : 'password'" class="form-input" required style="padding-right:2.75rem;" autocomplete="new-password" />
                <button type="button" @click="showNewPasswordConfirmation = !showNewPasswordConfirmation" :disabled="passwordLoading" style="position:absolute;right:.75rem;top:50%;transform:translateY(-50%);background:none;border:none;padding:0;cursor:pointer;color:#6b7280;">
                  <svg v-if="showNewPasswordConfirmation" width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3l18 18M10.477 10.48a3 3 0 104.243 4.243M9.88 5.08A9.955 9.955 0 0112 4c5.523 0 10 5 10 8 0 1.248-.77 2.832-2.1 4.29M6.228 6.228C3.99 7.77 2 10.04 2 12c0 3 4.477 8 10 8 1.647 0 3.174-.445 4.52-1.128" />
                  </svg>
                  <svg v-else width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="passwordError" class="feedback feedback--error">{{ passwordError }}</div>
            <div v-if="passwordSuccess" class="feedback feedback--success">{{ passwordSuccess }}</div>

            <div class="actions-row">
              <button type="submit" :disabled="passwordLoading" class="btn btn-primary">
                <div v-if="passwordLoading" class="spinner spinner--sm"></div>
                Simpan
              </button>
              <button type="button" @click="showPasswordModal = false" class="btn btn-outline">Batal</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showEmailModal" class="modal-overlay">
        <div class="modal-card" @click.stop>
          <h3 class="modal-title">Ubah Email</h3>

          <form v-if="emailStep === 1" @submit.prevent="handleRequestEmailOtp">
            <div class="form-group">
              <label class="form-label">Email Baru</label>
              <input v-model="emailForm.new_email" type="email" class="form-input" required autocomplete="email" placeholder="contoh@email.com" />
            </div>

            <div v-if="emailError" class="feedback feedback--error">{{ emailError }}</div>
            <div v-if="emailSuccess" class="feedback feedback--success">{{ emailSuccess }}</div>

            <div class="actions-row">
              <button type="submit" :disabled="emailLoading" class="btn btn-primary">
                <div v-if="emailLoading" class="spinner spinner--sm"></div>
                Kirim OTP
              </button>
              <button type="button" @click="closeEmailModal" class="btn btn-outline">Batal</button>
            </div>
          </form>

          <form v-else @submit.prevent="handleVerifyEmailOtp">
            <div class="form-group">
              <label class="form-label">Kode OTP (6 digit)</label>
              <input v-model="emailForm.otp_code" type="text" maxlength="6" class="form-input" required inputmode="numeric" pattern="[0-9]*" autocomplete="one-time-code" @input="emailForm.otp_code = emailForm.otp_code.replace(/\\D/g, '')" placeholder="000000" />
            </div>

            <div v-if="emailError" class="feedback feedback--error">{{ emailError }}</div>
            <div v-if="emailSuccess" class="feedback feedback--success">{{ emailSuccess }}</div>

            <div class="actions-row">
              <button type="submit" :disabled="emailLoading || emailForm.otp_code.length < 6" class="btn btn-primary">
                <div v-if="emailLoading" class="spinner spinner--sm"></div>
                Verifikasi & Simpan
              </button>
              <button type="button" @click="handleResendEmailOtp" :disabled="emailResendCooldown > 0 || emailLoading" class="btn btn-outline">
                {{ emailResendCooldown > 0 ? `Kirim ulang ${emailResendCooldown}s` : 'Kirim Ulang OTP' }}
              </button>
              <button type="button" @click="emailStep = 1" :disabled="emailLoading" class="btn btn-outline">Kembali</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProfileStore } from '../stores/profile'

const authStore    = useAuthStore()
const profileStore = useProfileStore()

const isEditing       = ref(false)
const loading         = ref(false)
const passwordLoading = ref(false)
const uploadingPhoto  = ref(false)
const error           = ref(null)
const success         = ref(null)
const passwordError   = ref(null)
const passwordSuccess = ref(null)
const photoError      = ref(null)
const photoPreview    = ref(null)
const selectedPhoto   = ref(null)
const showPasswordModal = ref(false)
const showEmailModal = ref(false)
const photoLoadError    = ref(false)
const editPhotoLoadError = ref(false)

const user         = computed(() => authStore.user)
const form         = reactive({ name: '', bio: '' })
const passwordForm = reactive({ current_password: '', password: '', password_confirmation: '' })
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showNewPasswordConfirmation = ref(false)
const emailStep = ref(1)
const emailForm = reactive({ new_email: '', otp_code: '' })
const emailLoading = ref(false)
const emailError = ref(null)
const emailSuccess = ref(null)
const emailResendCooldown = ref(0)
let emailCooldownInterval = null

const getPhotoUrl = (p) => {
  if (!p) return null
  if (p.startsWith('http')) return p
  
  // Strip /api or /api/ if present at the end of VITE_API_BASE_URL
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const baseUrl = apiUrl.replace(/\/api$/, '').replace(/\/api\/$/, '')
  
  return `${baseUrl}/storage/${p}`
}

const startEditing = () => {
  resetForm()
  editPhotoLoadError.value = false
  isEditing.value = true
}

const cancelEditing = () => {
  isEditing.value = false
  photoPreview.value = null
  selectedPhoto.value = null
  error.value = null
}

const resetForm = () => {
  form.name = user.value?.name || ''
  form.bio = user.value?.bio || ''
}

const openEmailModal = () => {
  emailError.value = null
  emailSuccess.value = null
  emailStep.value = 1
  emailForm.new_email = ''
  emailForm.otp_code = ''
  showEmailModal.value = true
}

const closeEmailModal = () => {
  showEmailModal.value = false
  emailError.value = null
  emailSuccess.value = null
  emailStep.value = 1
  emailForm.new_email = ''
  emailForm.otp_code = ''
  if (emailCooldownInterval) clearInterval(emailCooldownInterval)
  emailCooldownInterval = null
  emailResendCooldown.value = 0
}

const startEmailResendCooldown = () => {
  emailResendCooldown.value = 60
  if (emailCooldownInterval) clearInterval(emailCooldownInterval)
  emailCooldownInterval = setInterval(() => {
    emailResendCooldown.value--
    if (emailResendCooldown.value <= 0) {
      clearInterval(emailCooldownInterval)
      emailCooldownInterval = null
    }
  }, 1000)
}

const handleRequestEmailOtp = async () => {
  emailError.value = null
  emailSuccess.value = null
  emailLoading.value = true
  try {
    const r = await profileStore.requestEmailChangeOtp(emailForm.new_email)
    if (r.success) {
      emailStep.value = 2
      startEmailResendCooldown()
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      emailError.value = Object.values(err.response.data.errors).flat().join(', ')
    } else {
      emailError.value = err.response?.data?.message || 'Gagal mengirim OTP'
    }
  } finally {
    emailLoading.value = false
  }
}

const handleResendEmailOtp = async () => {
  if (emailResendCooldown.value > 0) return
  emailError.value = null
  emailSuccess.value = null
  emailLoading.value = true
  try {
    const r = await profileStore.requestEmailChangeOtp(emailForm.new_email)
    if (r.success) {
      startEmailResendCooldown()
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      emailError.value = Object.values(err.response.data.errors).flat().join(', ')
    } else {
      emailError.value = err.response?.data?.message || 'Gagal mengirim ulang OTP'
    }
  } finally {
    emailLoading.value = false
  }
}

const handleVerifyEmailOtp = async () => {
  emailError.value = null
  emailSuccess.value = null
  emailLoading.value = true
  try {
    const r = await profileStore.verifyEmailChangeOtp(emailForm.new_email, emailForm.otp_code)
    if (r.success) {
      emailSuccess.value = 'Email berhasil diubah'
      setTimeout(() => {
        closeEmailModal()
      }, 1500)
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      emailError.value = Object.values(err.response.data.errors).flat().join(', ')
    } else {
      emailError.value = err.response?.data?.message || 'Gagal verifikasi OTP'
    }
  } finally {
    emailLoading.value = false
  }
}

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  photoError.value = null
  editPhotoLoadError.value = false
  if (!file) return
  if (!file.type.startsWith('image/')) {
    photoError.value = 'Format tidak valid.'; return
  }
  if (file.size > 2*1024*1024) {
    photoError.value = 'Maksimal 2MB.'; return
  }
  selectedPhoto.value = file
  const reader = new FileReader()
  reader.onload = (e) => { photoPreview.value = e.target.result }
  reader.readAsDataURL(file)
}

const handleUpdateProfile = async () => {
  error.value = null; success.value = null; loading.value = true
  const submissionData = { ...form }
  if (selectedPhoto.value) submissionData.photo = selectedPhoto.value
  
  try {
    const r = await profileStore.updateProfile(submissionData)
    if (r.success) { 
      success.value = 'Profil berhasil diperbarui'
      photoLoadError.value = false
      setTimeout(() => { 
        success.value = null 
        isEditing.value = false
        selectedPhoto.value = null
        photoPreview.value = null
      }, 2000) 
    }
  } catch (err) {
    if (err.response?.data?.errors) { 
      error.value = Object.values(err.response.data.errors).flat().join(', ') 
    } else {
      error.value = err.response?.data?.message || 'Gagal menyimpan'
    }
  } finally { loading.value = false }
}

const handleChangePassword = async () => {
  passwordError.value = null; passwordSuccess.value = null; passwordLoading.value = true
  try {
    const r = await profileStore.changePassword(passwordForm)
    if (r.success) { 
      passwordSuccess.value = 'Password berhasil diubah'
      passwordForm.current_password = ''
      passwordForm.password = ''
      passwordForm.password_confirmation = ''
      setTimeout(() => { 
        passwordSuccess.value = null 
        showPasswordModal.value = false
      }, 2000) 
    }
  } catch (err) {
    if (err.response?.data?.errors) { 
      passwordError.value = Object.values(err.response.data.errors).flat().join(', ') 
    } else {
      passwordError.value = err.response?.data?.message || 'Gagal mengubah password'
    }
  } finally { passwordLoading.value = false }
}

onMounted(() => {
  if (user.value) resetForm()
})

onUnmounted(() => {
  if (emailCooldownInterval) clearInterval(emailCooldownInterval)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

/* ===== Page Layout ===== */
.profile-page {
  min-height: 100vh;
  background: #f8f9fa;
  font-family: 'Inter', sans-serif;
  color: #333;
  padding: 24px 16px;
}

.profile-container {
  max-width: 560px;
  margin: 0 auto;
}

/* ===== Card ===== */
.profile-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 28px 24px;
}

@media (min-width: 640px) {
  .profile-page { padding: 40px 24px; }
  .profile-card { padding: 32px 32px; }
}

/* ===== Loading ===== */
.loading-box {
  text-align: center;
  padding: 60px 20px;
}
.loading-box p {
  margin-top: 12px;
  color: #999;
  font-size: 13px;
}

/* ===== Spinner ===== */
.spinner {
  width: 28px;
  height: 28px;
  border: 2.5px solid #e5e7eb;
  border-top-color: #1a1a2e;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin: 0 auto;
}
.spinner--sm {
  width: 16px;
  height: 16px;
  border-width: 2px;
  margin: 0;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ===== View Mode: Header ===== */
.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.avatar-wrapper {
  flex-shrink: 0;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background: #f9fafb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 38px;
  height: 38px;
  color: #c0c4cc;
}

.avatar--small {
  width: 64px;
  height: 64px;
}
.avatar--small .avatar-placeholder {
  width: 32px;
  height: 32px;
}

@media (min-width: 640px) {
  .avatar { width: 80px; height: 80px; }
  .avatar--small { width: 68px; height: 68px; }
}

/* ===== Info ===== */
.info {
  flex: 1;
  min-width: 0;
}

.info-name {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.info-row {
  display: flex;
  flex-direction: column;
  margin-top: 2px;
}

.info-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #333;
  word-break: break-all;
}

/* ===== Bio ===== */
.bio-section {
  padding-top: 16px;
}

.bio-label {
  font-size: 12px;
  color: #999;
  font-weight: 500;
  display: block;
  margin-bottom: 4px;
}

.bio-text {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
  margin: 0;
  white-space: pre-line;
}

/* ===== Actions ===== */
.actions-row {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

/* ===== Buttons ===== */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 20px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.btn-primary {
  background: #1a1a2e;
  color: #fff;
  border-color: #1a1a2e;
}
.btn-primary:hover { background: #2d2d44; }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-outline {
  background: #fff;
  color: #555;
  border-color: #d1d5db;
}
.btn-outline:hover {
  background: #f9fafb;
  border-color: #aaa;
  color: #333;
}

.btn--sm {
  font-size: 12px;
  padding: 6px 14px;
}

/* ===== Edit Mode: Photo Upload ===== */
.form-section {
  margin-bottom: 24px;
}

.form-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #555;
  display: block;
  margin-bottom: 12px;
}

.photo-upload-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.photo-upload-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.photo-hint {
  font-size: 11px;
  color: #aaa;
}

/* ===== Form Fields ===== */
.form-group {
  margin-bottom: 18px;
}

.form-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #555;
  margin-bottom: 6px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  font-family: inherit;
  color: #333;
  background: #fff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.form-input:focus {
  border-color: #1a1a2e;
  box-shadow: 0 0 0 2px rgba(26, 26, 46, 0.08);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

/* ===== Feedback ===== */
.feedback {
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
}

.feedback--error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.feedback--success {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

/* ===== Modal ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
}

.modal-card {
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}

.modal-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 20px 0;
}

/* ===== Transitions ===== */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
