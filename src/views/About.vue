<template>
  <div class="page-wrapper">

    <!-- Hero -->
    <section class="about-hero">
      <div class="sp-container">
        <RouterLink to="/" class="sp-btn sp-btn-secondary sp-btn-sm" style="margin-bottom:1.25rem;display:inline-flex;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Kembali
        </RouterLink>
        <div style="display:flex;align-items:center;gap:.75rem;margin-bottom:.75rem;">
          <img :src="logoImage" alt="System Pakar" style="width:40px;height:40px;border-radius:8px;border:1px solid var(--border);object-fit:cover;" />
          <h1 style="font-size:1.75rem;font-weight:800;color:var(--gray-900);margin:0;">Tentang System Pakar</h1>
        </div>
        <p style="color:var(--text-muted);font-size:.9375rem;max-width:560px;">
          Sistem pakar berbasis web untuk diagnosis penyakit tanaman hias menggunakan metode Certainty Factor dan integrasi WhatsApp.
        </p>
      </div>
    </section>

    <!-- Content -->
    <div class="sp-container about-content">

      <!-- Deskripsi -->
      <div class="sp-card about-section">
        <div class="section-badge" style="background:var(--primary-50);color:var(--primary-700);">🌱 Tentang Sistem</div>
        <p style="color:var(--text-secondary);font-size:.9375rem;line-height:1.75;margin:.75rem 0 0;">
          <strong style="color:var(--gray-900);">System Pakar</strong> adalah sistem berbasis web yang dirancang khusus untuk membantu petani, penghobi, dan pelaku usaha dalam mengidentifikasi penyakit tanaman hias serta mendapatkan solusi perawatan yang tepat.
        </p>
        <p style="color:var(--text-secondary);font-size:.9375rem;line-height:1.75;margin:.625rem 0 0;">
          Sistem ini mengintegrasikan pengetahuan pakar lokal dengan teknologi modern untuk memberikan diagnosis yang akurat menggunakan metode <strong style="color:var(--primary-700);">Certainty Factor</strong> dan <strong style="color:var(--primary-700);">Forward Chaining</strong>.
        </p>
        <p style="color:var(--text-secondary);font-size:.9375rem;line-height:1.75;margin:.625rem 0 0;">
          Dengan lebih dari tiga puluh tahun pengalaman praktis dari pakar budidaya tanaman hias di kawasan Parongpong, sistem ini meniru cara berpikir pakar sesungguhnya.
        </p>
      </div>

      <!-- Fitur Utama -->
      <div class="sp-card about-section">
        <div class="section-badge" style="background:#fffbeb;color:#92400e;">✨ Fitur Utama</div>
        <div class="feature-grid">
          <div v-for="f in features" :key="f.title" class="feature-item">
            <div class="feature-icon" :style="`background:${f.bg};`">{{ f.icon }}</div>
            <div>
              <h3 style="font-size:.9375rem;font-weight:700;color:var(--gray-900);margin:0 0 .25rem;">{{ f.title }}</h3>
              <p style="font-size:.8125rem;color:var(--text-muted);margin:0;line-height:1.6;">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Metode CF -->
      <div class="sp-card about-section">
        <div class="section-badge" style="background:#f5f3ff;color:#5b21b6;">🧮 Metode Certainty Factor</div>
        <p style="color:var(--text-secondary);font-size:.9375rem;line-height:1.75;margin:.75rem 0;">
          Sistem ini menggunakan metode <strong style="color:var(--gray-900);">Certainty Factor (CF)</strong> untuk mengukur tingkat keyakinan terhadap suatu diagnosis berdasarkan gejala yang dipilih pengguna.
        </p>
        <div style="background:var(--primary-50);border-left:3px solid var(--primary);border-radius:0 8px 8px 0;padding:1rem 1.25rem;">
          <h4 style="font-size:.875rem;font-weight:700;color:var(--primary-700);margin:0 0 .5rem;">Cara Kerja:</h4>
          <ul style="color:var(--text-secondary);font-size:.875rem;padding-left:1.25rem;margin:0;line-height:1.8;">
            <li>User memilih gejala dan menentukan tingkat kepastian (CF User)</li>
            <li>Sistem menghitung CF untuk setiap kemungkinan penyakit</li>
            <li>CF dikombinasikan secara sequential untuk semua gejala</li>
            <li>Hasil diagnosis ditampilkan dengan persentase keyakinan</li>
          </ul>
        </div>
      </div>

      <!-- Integrasi WhatsApp -->
      <div class="sp-card about-section">
        <div class="section-badge" style="background:#f0fdf4;color:#15803d;">📱 Integrasi WhatsApp</div>
        <p style="color:var(--text-secondary);font-size:.9375rem;line-height:1.75;margin:.75rem 0;">
          Terintegrasi dengan <strong style="color:var(--gray-900);">Fonte API</strong> untuk komunikasi langsung melalui WhatsApp dengan pakar tanaman hias.
        </p>
        <div class="wa-grid">
          <div v-for="w in waFeatures" :key="w.title" class="wa-item">
            <span class="wa-icon">{{ w.icon }}</span>
            <div>
              <h4 style="font-size:.875rem;font-weight:700;color:var(--gray-900);margin:0 0 .25rem;">{{ w.title }}</h4>
              <p style="font-size:.8125rem;color:var(--text-muted);margin:0;line-height:1.6;">{{ w.desc }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Teknologi -->
      <div class="sp-card about-section">
        <div class="section-badge" style="background:var(--gray-100);color:var(--gray-700);">⚙️ Teknologi yang Digunakan</div>
        <div class="tech-grid">
          <div v-for="t in techs" :key="t.label" class="tech-item">
            <div class="tech-icon">{{ t.icon }}</div>
            <div style="font-size:.875rem;font-weight:700;color:var(--gray-900);">{{ t.label }}</div>
            <div style="font-size:.75rem;color:var(--text-muted);">{{ t.role }}</div>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div class="sp-card about-cta">
        <h2 style="font-size:1.375rem;font-weight:800;color:var(--gray-900);margin:0 0 .5rem;">Siap Memulai?</h2>
        <p style="color:var(--text-muted);font-size:.9375rem;margin:0 0 1.5rem;max-width:400px;">
          Daftar sekarang dan akses semua fitur sistem pakar. Gratis dan mudah!
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:.75rem;">
          <RouterLink v-if="!isAuthenticated" to="/register" class="sp-btn sp-btn-primary">Daftar Sekarang</RouterLink>
          <RouterLink v-if="isAuthenticated" to="/diagnosis" class="sp-btn sp-btn-primary">Mulai Diagnosis</RouterLink>
          <RouterLink to="/" class="sp-btn sp-btn-secondary">Kembali ke Home</RouterLink>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import logoImage from '../assets/logo-hydrangea.png'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const features = [
  { icon: '🔍', title: 'Diagnosis Otomatis', desc: 'Identifikasi penyakit tanaman hias dengan metode Certainty Factor yang akurat', bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)' },
  { icon: '📚', title: 'Modul Edukasi',     desc: 'Akses modul pembelajaran tentang perawatan tanaman hias dari para pakar', bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)' },
  { icon: '💬', title: 'Konsultasi Pakar',  desc: 'Konsultasi langsung dengan pakar melalui WhatsApp kapan saja', bg: 'linear-gradient(135deg,#ede9fe,#ddd6fe)' },
  { icon: '📊', title: 'Riwayat Diagnosis', desc: 'Simpan dan akses semua hasil diagnosis dengan laporan PDF', bg: 'linear-gradient(135deg,#ffedd5,#fed7aa)' },
]
const waFeatures = [
  { icon: '🔐', title: 'Verifikasi OTP',   desc: 'Kode OTP dikirim via WhatsApp menggunakan Fonte API' },
  { icon: '💬', title: 'Konsultasi Pakar', desc: 'Komunikasi langsung dengan pakar tanaman hias' },
  { icon: '📄', title: 'Laporan Diagnosis',desc: 'PDF diagnosis dikirim langsung ke WhatsApp' },
  { icon: '🔔', title: 'Notifikasi',       desc: 'Update dan notifikasi penting via WhatsApp' },
]
const techs = [
  { icon: '🟢', label: 'Laravel',   role: 'Backend API' },
  { icon: '🟡', label: 'Vue.js',    role: 'Frontend' },
  { icon: '🐍', label: 'Python',    role: 'Expert Engine' },
  { icon: '📱', label: 'Fonte API', role: 'WhatsApp' },
]
</script>

<style scoped>
a { text-decoration: none; }

.page-wrapper { min-height: 100vh; background: var(--bg-subtle); }

.about-hero {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 4.5rem 0 1.5rem;
}

.about-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.about-section { padding: 1.75rem 2rem; }

.section-badge {
  display: inline-block;
  padding: .375rem .875rem;
  border-radius: 9999px;
  font-size: .8125rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

/* Features */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: .25rem;
}
.feature-item {
  display: flex;
  align-items: flex-start;
  gap: .875rem;
  padding: 1rem;
  background: var(--bg-subtle);
  border-radius: 10px;
  border: 1px solid var(--border);
}
.feature-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem; flex-shrink: 0;
}

/* WhatsApp grid */
.wa-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: .875rem;
  margin-top: .5rem;
}
.wa-item {
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  padding: .875rem 1rem;
  background: var(--bg-subtle);
  border-radius: 8px;
  border: 1px solid var(--border);
}
.wa-icon {
  font-size: 1.375rem;
  flex-shrink: 0;
  margin-top: .125rem;
}

/* Tech grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: .875rem;
  margin-top: .75rem;
}
@media (max-width: 600px) {
  .tech-grid { grid-template-columns: repeat(2, 1fr); }
}
.tech-item {
  text-align: center;
  padding: 1.25rem 1rem;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  border-radius: 10px;
  transition: border-color .15s, box-shadow .15s;
}
.tech-item:hover {
  border-color: var(--primary-300);
  box-shadow: var(--shadow-sm);
}
.tech-icon {
  font-size: 1.75rem;
  margin-bottom: .5rem;
}

/* CTA */
.about-cta {
  padding: 2rem;
  background: var(--primary-50) !important;
  border-color: var(--primary-200) !important;
  text-align: left;
}
</style>
