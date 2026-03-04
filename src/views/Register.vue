<template>
  <div class="auth-page">
    <div class="auth-container">

      <!-- Logo -->
      <div class="auth-logo">
        <img :src="logoImage" alt="System Pakar" class="auth-logo-img" />
        <div>
          <h1 class="auth-logo-name">System Pakar</h1>
          <p class="auth-logo-sub">Tanaman Hias</p>
        </div>
      </div>

      <!-- Step Indicator -->
      <div class="step-indicator">
        <div v-for="(s, i) in steps" :key="i" class="step-item">
          <div class="step-dot" :class="{ 'step-dot--active': step > i, 'step-dot--current': step === i + 1 }">
            <svg v-if="step > i + 1" width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
            <span v-else>{{ i + 1 }}</span>
          </div>
          <span class="step-label" :class="{ 'step-label--active': step === i + 1 }">{{ s }}</span>
          <div v-if="i < steps.length - 1" class="step-line" :class="{ 'step-line--done': step > i + 1 }"></div>
        </div>
      </div>

      <!-- Card -->
      <div class="sp-card auth-card">

        <!-- Step 1: Data Akun -->
        <template v-if="step === 1">
          <div class="auth-card-header">
            <h2 class="auth-title">Buat Akun Baru</h2>
            <p class="auth-sub">Isi data di bawah untuk mendaftar</p>
          </div>
          <form @submit.prevent="handleRegister" style="display:flex;flex-direction:column;gap:1.125rem;margin-top:1.5rem;">
            <div>
              <label for="reg-name" class="sp-label">Nama Lengkap <span style="color:#dc2626;">*</span></label>
              <input id="reg-name" v-model="form.name" type="text" placeholder="Masukkan nama lengkap" required :disabled="loading" class="glass-input" autocomplete="name" />
            </div>
            <div>
              <label for="reg-email" class="sp-label">Email <span style="color:#dc2626;">*</span></label>
              <input id="reg-email" v-model="form.email" type="email" placeholder="contoh@email.com" required :disabled="loading" class="glass-input" autocomplete="email" />
              <p class="sp-field-hint">Kode OTP akan dikirim ke email ini</p>
            </div>
            <div>
              <label for="reg-phone" class="sp-label">Nomor WhatsApp <span style="color:var(--text-muted);font-weight:400;font-size:.8125rem;">(opsional)</span></label>
              <input id="reg-phone" v-model="form.whatsapp_number" type="tel" placeholder="08xxxxxxxxxx" :disabled="loading" class="glass-input" autocomplete="tel" />
              <p class="sp-field-hint">Untuk fitur konsultasi langsung ke pakar via WhatsApp</p>
            </div>
            <div>
              <label for="reg-pass" class="sp-label">Password <span style="color:#dc2626;">*</span></label>
              <input id="reg-pass" v-model="form.password" type="password" placeholder="Minimal 8 karakter" required :disabled="loading" class="glass-input" autocomplete="new-password" />
            </div>
            <div>
              <label for="reg-pass2" class="sp-label">Konfirmasi Password <span style="color:#dc2626;">*</span></label>
              <input id="reg-pass2" v-model="form.password_confirmation" type="password" placeholder="Ulangi password" required :disabled="loading" class="glass-input" autocomplete="new-password" />
            </div>
            <div v-if="error" class="sp-alert sp-alert-danger" role="alert">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ error }}
            </div>
            <button type="submit" :disabled="loading" class="sp-btn sp-btn-primary sp-btn-lg" style="width:100%;justify-content:center;margin-top:.25rem;">
              <span v-if="loading" class="sp-spinner" style="width:18px;height:18px;border-width:2px;border-color:rgba(255,255,255,.4);border-top-color:#fff;"></span>
              {{ loading ? 'Mengirim OTP...' : 'Daftar & Kirim OTP' }}
            </button>
          </form>
        </template>

        <!-- Step 2: Verifikasi OTP -->
        <template v-if="step === 2">
          <div class="auth-card-header">
            <h2 class="auth-title">Verifikasi OTP</h2>
            <p class="auth-sub">Masukkan kode OTP yang dikirim ke:</p>
            <div class="otp-email-badge">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              {{ form.email }}
            </div>
          </div>
          <form @submit.prevent="handleVerifyOtp" style="display:flex;flex-direction:column;gap:1.25rem;margin-top:1.5rem;">
            <div>
              <label for="otp" class="sp-label" style="text-align:center;display:block;">Kode OTP (6 digit) <span style="color:#dc2626;">*</span></label>
              <input
                id="otp" v-model="otpCode"
                type="text" maxlength="6"
                placeholder="_ _ _ _ _ _"
                required :disabled="loading"
                class="glass-input otp-input"
                inputmode="numeric" pattern="[0-9]*"
                @input="otpCode = otpCode.replace(/\D/g, '')"
                autocomplete="one-time-code"
              />
              <p class="sp-field-hint" style="text-align:center;">Cek inbox dan folder spam email Anda</p>
            </div>
            <div v-if="error" class="sp-alert sp-alert-danger" role="alert">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ error }}
            </div>
            <button type="submit" :disabled="loading || otpCode.length < 6" class="sp-btn sp-btn-primary sp-btn-lg" style="width:100%;justify-content:center;">
              <span v-if="loading" class="sp-spinner" style="width:18px;height:18px;border-width:2px;border-color:rgba(255,255,255,.4);border-top-color:#fff;"></span>
              {{ loading ? 'Memverifikasi...' : 'Verifikasi OTP' }}
            </button>
            <button type="button" @click="resendOtp" :disabled="resendCooldown > 0 || loading" class="sp-btn sp-btn-secondary" style="width:100%;justify-content:center;">
              {{ resendCooldown > 0 ? `Kirim ulang dalam ${resendCooldown}d` : 'Kirim Ulang OTP' }}
            </button>
          </form>
          <div style="margin-top:1rem;text-align:center;">
            <button @click="step = 1; error = null" style="background:none;border:none;cursor:pointer;font-size:.875rem;color:var(--primary);text-decoration:underline;">← Kembali ubah data</button>
          </div>
        </template>

      </div>

      <!-- Login link -->
      <div class="auth-links-bottom">
        <RouterLink to="/login">Sudah punya akun? <strong>Masuk di sini</strong></RouterLink>
      </div>

      <p class="auth-footer-note">
        Dengan mendaftar, Anda menyetujui
        <a href="#">Ketentuan Layanan</a> dan <a href="#">Kebijakan Privasi</a> kami.
      </p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import logoImage from '../assets/logo-hydrangea.png'

const router   = useRouter()
const authStore = useAuthStore()

const step  = ref(1)
const steps = ['Data Akun', 'Verifikasi OTP']
const form  = ref({ name: '', email: '', whatsapp_number: '', password: '', password_confirmation: '' })
const otpCode        = ref('')
const loading        = ref(false)
const error          = ref(null)
const resendCooldown = ref(0)
let cooldownInterval = null

const handleRegister = async () => {
  error.value = null; loading.value = true
  try {
    // Kirim data dengan nama field yang benar sesuai backend
    const payload = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      whatsapp_number: form.value.whatsapp_number || null
    }
    const res = await authStore.register(payload)
    if (res.success) { step.value = 2; startResendCooldown() }
  } catch (err) {
    if (err.response?.data?.errors) {
      const msgs = []
      for (const field in err.response.data.errors) msgs.push(...err.response.data.errors[field])
      error.value = msgs.join(', ')
    } else {
      error.value = err.response?.data?.message || 'Registrasi gagal. Periksa data Anda.'
    }
  } finally { loading.value = false }
}

const handleVerifyOtp = async () => {
  error.value = null; loading.value = true
  try { await authStore.verifyOtp(form.value.email, otpCode.value) }
  catch (err) { error.value = err.response?.data?.message || 'OTP tidak valid atau sudah kadaluarsa.' }
  finally { loading.value = false }
}

const resendOtp = async () => {
  if (resendCooldown.value > 0) return
  error.value = null; loading.value = true
  try {
    const payload = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      password_confirmation: form.value.password_confirmation,
      whatsapp_number: form.value.whatsapp_number || null
    }
    await authStore.register(payload); startResendCooldown()
  }
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

onMounted(() => { if (authStore.isAuthenticated) router.push('/') })
onUnmounted(() => { if (cooldownInterval) clearInterval(cooldownInterval) })
</script>

<style scoped>
a { text-decoration: none; }

.auth-page {
  min-height: 100vh;
  background: var(--bg-subtle);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.25rem;
}

.auth-container {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}

/* Logo */
.auth-logo { display: flex; align-items: center; justify-content: center; gap: .75rem; }
.auth-logo-img  { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid var(--border); }
.auth-logo-name { font-size: 1.125rem; font-weight: 800; color: var(--gray-900); margin: 0; }
.auth-logo-sub  { font-size: .75rem; color: var(--text-muted); margin: 0; }

/* Steps */
.step-indicator { display: flex; align-items: center; gap: 0; justify-content: center; }
.step-item { display: flex; align-items: center; gap: .5rem; }
.step-dot {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--gray-200); color: var(--gray-500);
  font-size: .8125rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: background .2s, color .2s;
}
.step-dot--active  { background: var(--primary); color: #fff; }
.step-dot--current { background: var(--primary); color: #fff; box-shadow: 0 0 0 3px var(--primary-100); }
.step-label { font-size: .8125rem; font-weight: 500; color: var(--text-muted); white-space: nowrap; }
.step-label--active { color: var(--gray-900); font-weight: 600; }
.step-line { width: 40px; height: 2px; background: var(--gray-200); margin: 0 .625rem; transition: background .2s; flex-shrink: 0; }
.step-line--done { background: var(--primary); }

/* Card */
.auth-card { padding: 2rem; }
.auth-card-header { margin-bottom: 0; }
.auth-title { font-size: 1.25rem; font-weight: 700; color: var(--gray-900); margin: 0 0 .25rem; }
.auth-sub { font-size: .875rem; color: var(--text-muted); margin: 0; }

/* OTP email badge */
.otp-email-badge {
  display: inline-flex; align-items: center; gap: .375rem;
  margin-top: .625rem; padding: .375rem .75rem;
  background: var(--primary-50); color: var(--primary-700);
  border: 1px solid var(--primary-200); border-radius: 9999px;
  font-size: .8125rem; font-weight: 600;
}

/* OTP input */
.otp-input {
  text-align: center !important;
  font-size: 1.5rem !important;
  font-weight: 700 !important;
  letter-spacing: .5em !important;
  font-family: monospace !important;
}

/* Links */
.auth-links-bottom { text-align: center; font-size: .875rem; color: var(--text-muted); }
.auth-links-bottom a { color: var(--primary); transition: color .15s; }
.auth-links-bottom a:hover { color: var(--primary-dark); }

.auth-footer-note { text-align: center; font-size: .775rem; color: var(--text-faint); margin: 0; }
.auth-footer-note a { color: var(--primary); }
</style>
