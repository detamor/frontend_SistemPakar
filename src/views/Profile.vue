<template>
  <div class="page-wrapper">

    <!-- Header -->
    <section class="profile-hero">
      <div class="sp-container">
        <RouterLink to="/" class="sp-btn sp-btn-secondary sp-btn-sm" style="margin-bottom:1rem;display:inline-flex;">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Kembali
        </RouterLink>
        <h1 style="font-size:1.625rem;font-weight:800;color:var(--gray-900);margin:0 0 .25rem;">Profil Saya</h1>
        <p style="color:var(--text-muted);font-size:.9375rem;margin:0;">Kelola informasi profil dan keamanan akun Anda</p>
      </div>
    </section>

    <!-- Content -->
    <div class="sp-container profile-content">

      <!-- Loading -->
      <div v-if="loading && !user" class="sp-card" style="padding:3rem;text-align:center;">
        <div class="sp-spinner" style="margin:0 auto 1rem;"></div>
        <p style="color:var(--text-muted);">Memuat profil...</p>
      </div>

      <template v-else-if="user">

        <!-- Foto Profil -->
        <div class="sp-card profile-section">
          <h2 class="section-title">Foto Profil</h2>
          <div class="photo-area">
            <div class="photo-wrap">
              <img v-if="user.photo || photoPreview"
                :src="photoPreview || getPhotoUrl(user.photo)"
                :alt="user.name"
                class="photo-img" />
              <div v-else class="photo-initial">{{ user.name?.charAt(0).toUpperCase() }}</div>
              <div v-if="uploadingPhoto" class="photo-overlay">
                <div class="sp-spinner" style="width:24px;height:24px;border-width:3px;border-color:rgba(255,255,255,.4);border-top-color:#fff;"></div>
              </div>
            </div>
            <div class="photo-actions">
              <label for="photo-upload" class="sp-btn sp-btn-primary sp-btn-sm" :class="{ 'disabled': uploadingPhoto }">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                {{ user.photo ? 'Ganti Foto' : 'Upload Foto' }}
              </label>
              <input id="photo-upload" type="file" accept="image/jpeg,image/png,image/jpg,image/gif" @change="handlePhotoChange" :disabled="uploadingPhoto" style="display:none;" />
              <button v-if="user.photo" @click="handleRemovePhoto" :disabled="uploadingPhoto" class="sp-btn sp-btn-sm" style="color:#dc2626;border-color:#fca5a5;background:#fff5f5;">
                <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                Hapus Foto
              </button>
            </div>
            <div v-if="selectedPhoto" class="sp-alert sp-alert-info" style="font-size:.8125rem;">
              <strong>File:</strong> {{ selectedPhoto.name }} ({{ formatFileSize(selectedPhoto.size) }}) — klik "Simpan" untuk upload
            </div>
            <div v-if="photoError" class="sp-alert sp-alert-danger" style="font-size:.8125rem;">{{ photoError }}</div>
          </div>
        </div>

        <!-- Informasi Profil -->
        <div class="sp-card profile-section">
          <h2 class="section-title">Informasi Profil</h2>
          <form @submit.prevent="handleUpdateProfile" style="display:flex;flex-direction:column;gap:1.125rem;">
            <div>
              <label for="name" class="sp-label">Nama Lengkap <span style="color:#dc2626;">*</span></label>
              <input id="name" v-model="form.name" type="text" placeholder="Masukkan nama lengkap" required :disabled="loading" class="glass-input" />
            </div>
            <div>
              <label for="email" class="sp-label">Email <span style="color:#dc2626;">*</span></label>
              <input id="email" v-model="form.email" type="email" placeholder="Masukkan alamat email" required :disabled="loading" class="glass-input" />
            </div>
            <div v-if="error" class="sp-alert sp-alert-danger">{{ error }}</div>
            <div v-if="success" class="sp-alert sp-alert-success">{{ success }}</div>
            <button type="submit" :disabled="loading || uploadingPhoto" class="sp-btn sp-btn-primary" style="align-self:flex-start;min-width:160px;justify-content:center;">
              <span v-if="loading" class="sp-spinner" style="width:16px;height:16px;border-width:2px;border-color:rgba(255,255,255,.4);border-top-color:#fff;"></span>
              {{ loading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </form>
        </div>

        <!-- Ubah Password -->
        <div class="sp-card profile-section">
          <h2 class="section-title">Ubah Password</h2>
          <form @submit.prevent="handleChangePassword" style="display:flex;flex-direction:column;gap:1.125rem;">
            <div>
              <label for="current_password" class="sp-label">Password Lama <span style="color:#dc2626;">*</span></label>
              <input id="current_password" v-model="passwordForm.current_password" type="password" placeholder="Masukkan password lama" required :disabled="passwordLoading" class="glass-input" />
            </div>
            <div>
              <label for="new_password" class="sp-label">Password Baru <span style="color:#dc2626;">*</span></label>
              <input id="new_password" v-model="passwordForm.password" type="password" placeholder="Minimal 8 karakter" required minlength="8" :disabled="passwordLoading" class="glass-input" />
              <p class="sp-field-hint">Gunakan kombinasi huruf, angka, dan karakter khusus</p>
            </div>
            <div>
              <label for="password_confirmation" class="sp-label">Konfirmasi Password <span style="color:#dc2626;">*</span></label>
              <input id="password_confirmation" v-model="passwordForm.password_confirmation" type="password" placeholder="Ulangi password baru" required :disabled="passwordLoading" class="glass-input" />
            </div>
            <div v-if="passwordError" class="sp-alert sp-alert-danger">{{ passwordError }}</div>
            <div v-if="passwordSuccess" class="sp-alert sp-alert-success">{{ passwordSuccess }}</div>
            <button type="submit" :disabled="passwordLoading" class="sp-btn sp-btn-primary" style="align-self:flex-start;min-width:160px;justify-content:center;">
              <span v-if="passwordLoading" class="sp-spinner" style="width:16px;height:16px;border-width:2px;border-color:rgba(255,255,255,.4);border-top-color:#fff;"></span>
              {{ passwordLoading ? 'Mengubah...' : 'Ubah Password' }}
            </button>
          </form>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useProfileStore } from '../stores/profile'

const authStore    = useAuthStore()
const profileStore = useProfileStore()

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

const user         = computed(() => authStore.user)
const form         = ref({ name: '', email: '' })
const passwordForm = ref({ current_password: '', password: '', password_confirmation: '' })

const getPhotoUrl = (p) => {
  if (!p) return null
  if (p.startsWith('http')) return p
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${p}`
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024, s = ['Bytes','KB','MB']
  const i = Math.floor(Math.log(bytes)/Math.log(k))
  return Math.round(bytes/Math.pow(k,i)*100)/100 + ' ' + s[i]
}

const handlePhotoChange = (event) => {
  const file = event.target.files[0]
  photoError.value = null
  if (!file) return
  if (!['image/jpeg','image/png','image/jpg','image/gif'].includes(file.type)) {
    photoError.value = 'Format tidak didukung. Gunakan JPG, PNG, atau GIF.'; event.target.value = ''; return
  }
  if (file.size > 2*1024*1024) {
    photoError.value = 'Ukuran file terlalu besar. Maksimal 2MB.'; event.target.value = ''; return
  }
  selectedPhoto.value = file
  const reader = new FileReader()
  reader.onload = (e) => { photoPreview.value = e.target.result }
  reader.readAsDataURL(file)
}

const handleRemovePhoto = async () => {
  if (!confirm('Yakin ingin menghapus foto profil?')) return
  photoError.value = null; uploadingPhoto.value = true
  try {
    const r = await profileStore.removePhoto()
    if (r.success) { photoPreview.value = null; selectedPhoto.value = null; success.value = 'Foto berhasil dihapus'; setTimeout(() => { success.value = null }, 3000) }
  } catch (err) { photoError.value = err.response?.data?.message || 'Gagal menghapus foto' }
  finally { uploadingPhoto.value = false }
}

const handleUpdateProfile = async () => {
  error.value = null; success.value = null; photoError.value = null; loading.value = true
  const data = { name: form.value.name, email: form.value.email }
  if (selectedPhoto.value) data.photo = selectedPhoto.value
  try {
    const r = await profileStore.updateProfile(data)
    if (r.success) { success.value = r.message || 'Profil berhasil diperbarui'; selectedPhoto.value = null; photoPreview.value = null; setTimeout(() => { success.value = null }, 3000) }
  } catch (err) {
    if (err.response?.data?.errors) { const msgs = []; for (const f in err.response.data.errors) msgs.push(...err.response.data.errors[f]); error.value = msgs.join(', ') }
    else error.value = err.response?.data?.message || 'Gagal memperbarui profil'
  } finally { loading.value = false }
}

const handleChangePassword = async () => {
  passwordError.value = null; passwordSuccess.value = null; passwordLoading.value = true
  try {
    const r = await profileStore.changePassword(passwordForm.value)
    if (r.success) { passwordSuccess.value = r.message || 'Password berhasil diubah'; passwordForm.value = { current_password: '', password: '', password_confirmation: '' }; setTimeout(() => { passwordSuccess.value = null }, 3000) }
  } catch (err) {
    if (err.response?.data?.errors) { const msgs = []; for (const f in err.response.data.errors) msgs.push(...err.response.data.errors[f]); passwordError.value = msgs.join(', ') }
    else passwordError.value = err.response?.data?.message || 'Gagal mengubah password'
  } finally { passwordLoading.value = false }
}

onMounted(() => {
  if (user.value) { form.value.name = user.value.name || ''; form.value.email = user.value.email || '' }
})
</script>

<style scoped>
a { text-decoration: none; }

.page-wrapper { min-height: 100vh; background: var(--bg-subtle); }
.profile-hero {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 5rem 0 1.75rem;
}
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 2rem;
  padding-bottom: 4rem;
  max-width: 640px;
}
.profile-section { padding: 1.75rem 2rem; }
.section-title {
  font-size: 1.0625rem;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0 0 1.25rem;
  padding-bottom: .875rem;
  border-bottom: 1px solid var(--border);
}

/* Photo */
.photo-area { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }
.photo-wrap {
  position: relative;
  width: 96px; height: 96px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid var(--primary-200);
  background: var(--primary-50);
  flex-shrink: 0;
}
.photo-img  { width: 100%; height: 100%; object-fit: cover; }
.photo-initial {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 800; color: var(--primary-700);
}
.photo-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.45);
  display: flex; align-items: center; justify-content: center;
}
.photo-actions { display: flex; flex-wrap: wrap; gap: .625rem; }
.disabled { opacity: .5; pointer-events: none; }
</style>
