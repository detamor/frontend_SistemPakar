<template>
  <div class="about-page">
    
    <!-- Decorative Green Top Banner (Ramping) -->
    <header class="edu-hero decorative-banner">
      <div class="hero-bg-leaf">🌿</div>
      <div class="hero-bg-leaf hero-bg-leaf--2">🍃</div>
      <div class="page-container">
        <RouterLink to="/" class="modern-back-btn">
          <span class="back-icon">←</span>
          <span>Beranda</span>
        </RouterLink>
      </div>
    </header>

    <!-- Main Content -->
    <main class="page-container about-content-v2 main-positioning">
      
      <!-- Moved Hero Content (Now Below Green Banner) -->
      <section class="hero-content-wrapper">
        <div class="hero-glass-box light-box">
          <span class="hero-eyebrow dark">Sistem Pakar Tanaman Hias</span>
          <div class="hero-brand">
            <div class="brand-logo-wrap">
              <img :src="logoImage" alt="Logo" class="brand-logo" />
              <div class="logo-aura dark"></div>
            </div>
            <h1 class="edu-title dark-text">Tentang<br>System Pakar</h1>
          </div>
          <p class="edu-sub dark-text">
            Solusi cerdas diagnosis penyakit tanaman hias berbasis Certainty Factor <br>
            yang terintegrasi dengan pakar lokal dan teknologi WhatsApp.
          </p>
          <div class="hero-tags-v2">
            <span class="tag-v2 dark">🧮 Certainty Factor</span>
            <span class="tag-v2 dark">🔗 Forward Chaining</span>
            <span class="tag-v2 dark">📱 WhatsApp API</span>
            <span class="tag-v2 dark">🌹 Mawar Holland</span>
          </div>
        </div>
      </section>

      <!-- Deskripsi -->
      <section class="info-card">
        <header class="card-head">
          <span class="head-icon">🌱</span>
          <h2 class="head-title">Mengenal Sistem</h2>
        </header>
        <div class="card-body about-text-grid">
          <p>
            <strong>System Pakar</strong> adalah sistem berbasis web yang dirancang khusus untuk membantu petani,
            penghobi, dan pelaku usaha dalam mengidentifikasi penyakit tanaman hias serta mendapatkan solusi
            perawatan yang tepat secara instan.
          </p>
          <p>
            Sistem ini mengintegrasikan pengetahuan pakar lokal dengan teknologi modern menggunakan metode
            <span class="text-accent-v2">Certainty Factor</span> — meniru cara berpikir pakar sesungguhnya dalam menangani ketidakpastian data gejala.
          </p>
          <p>
            Dibangun dengan riset mendalam di kawasan <strong>Parongpong</strong>, setiap rekomendasi diagnosis
            mencerminkan kearifan lokal yang telah teruji efektivitasnya selama bertahun-tahun.
          </p>
        </div>
      </section>

      <!-- Mawar Holland Feature -->
      <section class="info-card feature-rose">
        <div class="rose-layout">
          <div class="rose-info">
            <header class="card-head">
              <span class="head-icon">🌹</span>
              <h2 class="head-title">Fokus: Mawar Holland Carrousel</h2>
            </header>
            <p class="rose-summary">
              Varietas unggulan <strong>Hybrid Tea</strong> dengan kelopak tebal berkelir gradasi (bicolor) putih-merah muda. 
              Tangkainya yang kokoh menjadikannya primadona bunga potong internasional.
            </p>
            <div class="rose-specs">
              <div v-for="c in roseChars" :key="c.label" class="spec-item">
                <span class="spec-icon">{{ c.icon }}</span>
                <div class="spec-content">
                  <span class="spec-label">{{ c.label }}</span>
                  <span class="spec-val">{{ c.value }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="rose-visual-deco">🌹</div>
        </div>
      </section>

      <!-- Metode & Keunggulan Side-by-Side -->
      <div class="content-dual-grid">
        <!-- Metode CF -->
        <section class="info-card">
          <header class="card-head">
            <span class="head-icon">🧮</span>
            <h2 class="head-title">Metode Perhitungan</h2>
          </header>
          <p class="section-desc">Menggunakan <strong>Certainty Factor (CF)</strong> untuk mengolah keyakinan diagnosis:</p>
          <ol class="step-list">
            <li v-for="(step, i) in cfSteps" :key="i" class="step-li">
              <span class="step-num">{{ i + 1 }}</span>
              <p>{{ step }}</p>
            </li>
          </ol>
        </section>

        <!-- WhatsApp Features -->
        <section class="info-card">
          <header class="card-head">
            <span class="head-icon">📱</span>
            <h2 class="head-title">Integrasi WhatsApp</h2>
          </header>
          <p class="section-desc">Memanfaatkan <strong>Fonte API</strong> untuk pengalaman yang lebih personal:</p>
          <ul class="feature-stack">
            <li v-for="w in waFeatures" :key="w.title" class="feat-li">
              <span class="feat-icon">{{ w.icon }}</span>
              <div class="feat-text">
                <span class="feat-title">{{ w.title }}</span>
                <span class="feat-desc">{{ w.desc }}</span>
              </div>
            </li>
          </ul>
        </section>
      </div>

      <!-- Tech Stack -->
      <section class="info-card tech-stack-section">
        <header class="card-head">
          <span class="head-icon">⚙️</span>
          <h2 class="head-title">Teknologi Di Balik Sistem</h2>
        </header>
        <div class="tech-box-grid">
          <div v-for="t in techs" :key="t.label" class="tech-box">
            <span class="tech-emoji">{{ t.icon }}</span>
            <div class="tech-info">
              <span class="tech-name">{{ t.label }}</span>
              <span class="tech-role">{{ t.role }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="final-cta">
        <div class="cta-inner">
          <h2 class="cta-h2">Mulailah Perjalanan Tanaman Sehat Anda</h2>
          <p class="cta-p">Sistem kami siap membantu Anda 24/7 untuk menjaga keindahan pekarangan Anda.</p>
          <div class="cta-btns">
            <RouterLink v-if="!isAuthenticated" to="/register" class="cta-btn-main">Daftar Akun Baru</RouterLink>
            <RouterLink v-if="isAuthenticated" to="/diagnosis" class="cta-btn-main">Mulai Diagnosis</RouterLink>
            <RouterLink to="/" class="cta-btn-alt">Tentang Beranda</RouterLink>
          </div>
        </div>
        <div class="cta-leaf-deco">🍃</div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import logoImage from '../assets/logo-hydrangea.png'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const cfSteps = [
  'User menentukan tingkat kepastian gejala (CF User)',
  'Sistem menghitung CF berdasarkan Rule Base Pakar',
  'CF dikombinasikan secara beruntun (Sequential CF)',
  'Output diagnosis tampil dalam persentase keyakinan'
]

const waFeatures = [
  { icon: '🔐', title: 'Verifikasi OTP',    desc: 'Keamanan akun lebih terjaga' },
  { icon: '💬', title: 'Konsultasi Pakar',  desc: 'Langsung terhubung dengan ahlinya' },
  { icon: '📄', title: 'Laporan Luring',    desc: 'Simpan hasil diagnosis ke HP Anda' },
  { icon: '🔔', title: 'Notifikasi',        desc: 'Update info penyakit terbaru' },
]

const techs = [
  { icon: '🟢', label: 'Laravel',   role: 'Backend API' },
  { icon: '🟡', label: 'Vue.js',    role: 'Frontend UI' },
  { icon: '🐍', label: 'Python',    role: 'Expert Logic' },
  { icon: '📱', label: 'Fonte API', role: 'WhatsApp Hub' },
]

const roseChars = [
  { icon: '🌿', label: 'Klasifikasi',     value: 'Hybrid Tea (Rosa sp.)' },
  { icon: '🎨', label: 'Warna Bunga',     value: 'Bicolor Gradasi' },
  { icon: '🌸', label: 'Mahkota',         value: '26–40 Kelopak tebal' },
  { icon: '📏', label: 'Optimal',         value: '55–75 cm' },
  { icon: '🌱', label: 'Karakter',        value: 'Tangkai kokoh, duri minim' },
  { icon: '⭐', label: 'Keunggulan',      value: 'Sangat tahan pecah peraga' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

.about-page {
  background-color: #f5f7f4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #1e3a2a;
}

/* --- Decorative Top Banner --- */
.edu-hero.decorative-banner {
  height: 180px;
  padding: 2.5rem 1.5rem;
  background: linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 60%, #3a7a50 100%);
  position: relative;
  overflow: hidden;
  color: white;
}

.hero-bg-leaf {
  position: absolute;
  font-size: 8rem; opacity: .06;
  top: -1rem; right: -1rem;
  transform: rotate(20deg);
  pointer-events: none;
}
.hero-bg-leaf--2 {
  font-size: 5rem;
  top: auto; bottom: -1rem; left: -1rem;
  transform: rotate(-30deg);
}

.page-container {
  max-width: 1100px;
  margin: 0 auto;
}

.modern-back-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  color: #fff;
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s;
}
.modern-back-btn:hover { background: rgba(255,255,255,0.2); transform: translateX(-4px); }

/* --- Hero Content Structure (Now below banner) --- */
.main-positioning {
  padding: 0 1.5rem 8rem;
  margin-top: -4.5rem; /* Better overlap balance */
  position: relative;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.hero-content-wrapper {
  margin-bottom: 0rem; /* Handled by main gap */
}

.hero-glass-box.light-box {
  background: white;
  padding: 3.5rem 2.5rem;
  border-radius: 32px;
  box-shadow: 0 15px 50px rgba(30,58,42,0.08);
  border: 1.5px solid #edf2ed;
  max-width: 100%;
}

.hero-eyebrow.dark {
  color: #3a7a50;
  font-size: .875rem;
  font-weight: 800;
  letter-spacing: .1em;
  text-transform: uppercase;
  margin-bottom: 0.875rem;
  display: block;
}

.hero-brand {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.brand-logo-wrap { position: relative; width: 68px; height: 68px; flex-shrink: 0; }
.brand-logo { width: 100%; height: 100%; border-radius: 18px; position: relative; z-index: 2; object-fit: cover; }
.logo-aura.dark { position: absolute; inset: -4px; background: #3a7a50; filter: blur(12px); opacity: 0.15; border-radius: 24px; }

.edu-title.dark-text {
  font-family: 'DM Serif Display', serif;
  font-size: 3.25rem;
  font-weight: 400;
  line-height: 1.1;
  margin: 0;
  color: #1a3a2a;
}

.edu-sub.dark-text {
  font-size: 1.125rem;
  color: #4b6a55;
  margin: 1.5rem 0 2rem;
  max-width: 720px;
  line-height: 1.7;
}

/* --- Tags --- */
.hero-tags-v2 {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}
.tag-v2.dark {
  background: #f0fdf4;
  border: 1px solid #d9e4d4;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.8125rem;
  font-weight: 700;
  color: #1a3a2a;
}

/* --- Layout Content --- */
.info-card {
  background: white;
  border-radius: 32px;
  padding: 3.5rem 2.5rem;
  box-shadow: 0 4px 20px rgba(30,58,42,0.04);
  border: 1.5px solid #edf2ed;
}

.card-head {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  margin-bottom: 1.5rem;
}
.head-icon { font-size: 1.5rem; }
.head-title {
  font-family: 'DM Serif Display', serif;
  font-size: 1.75rem;
  color: #1a3a2a;
  margin: 0;
}

.about-text-grid {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
}
.about-text-grid p {
  font-size: 1.0625rem;
  line-height: 1.8;
  color: #4b6a55;
  margin: 0;
}
.text-accent-v2 { color: #1a3a2a; font-weight: 700; }

/* --- Rose Section --- */
.rose-layout {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 3rem;
  align-items: center;
}
@media (max-width: 768px) { .rose-layout { grid-template-columns: 1fr; } .rose-visual-deco { display: none; } }

.rose-summary {
  font-size: 1rem;
  line-height: 1.7;
  color: #4b6a55;
  margin-bottom: 2rem;
}

.rose-specs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (max-width: 540px) { .rose-specs { grid-template-columns: 1fr; } }

.spec-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: #f8fbf9;
  border-radius: 16px;
  border: 1px solid #edf2ed;
}
.spec-icon { font-size: 1.25rem; }
.spec-label { display: block; font-size: 0.7rem; font-weight: 800; color: #a3b0a7; text-transform: uppercase; margin-bottom: 2px; }
.spec-val { font-size: 0.875rem; font-weight: 700; color: #1e3a2a; }

.rose-visual-deco {
  font-size: 8rem;
  opacity: .1;
  filter: grayscale(1);
}

/* --- Dual Grid --- */
.content-dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}
@media (max-width: 768px) { .content-dual-grid { grid-template-columns: 1fr; } }

.section-desc { font-size: 0.9375rem; color: #6a8a72; margin-bottom: 1.5rem; }

.step-list { display: flex; flex-direction: column; gap: 0.875rem; padding: 0; list-style: none; }
.step-li {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
  background: #fdfdfd;
  border: 1px solid #edf2ed;
  border-radius: 12px;
}
.step-num {
  width: 24px; height: 24px; border-radius: 50%; background: #1a3a2a; color: #fff;
  font-size: 0.75rem; font-weight: 800; display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.step-li p { font-size: 0.875rem; margin: 0; color: #334e3d; font-weight: 500; }

.feature-stack { display: flex; flex-direction: column; gap: 0.875rem; padding: 0; list-style: none; }
.feat-li {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #edf2f7;
}
.feat-icon { font-size: 1.125rem; }
.feat-title { display: block; font-size: 0.9375rem; font-weight: 800; color: #1e293b; margin-bottom: 2px; }
.feat-desc { font-size: 0.8125rem; color: #64748b; }

/* --- Tech Section --- */
.tech-box-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.tech-box {
  display: flex;
  align-items: center;
  gap: 1.125rem;
  padding: 1.25rem;
  background: #f8fbf9;
  border-radius: 16px;
  border: 1.5px solid #edf2ed;
}
.tech-emoji { font-size: 2rem; }
.tech-name { display: block; font-size: 1rem; font-weight: 800; color: #1a3a2a; }
.tech-role { font-size: 0.8125rem; color: #6a8a72; }

/* --- CTA --- */
.final-cta {
  background: linear-gradient(135deg, #1a3a2a, #2d5a3d);
  border-radius: 32px;
  padding: 4rem 3rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}
.cta-inner { position: relative; z-index: 2; }
.cta-h2 { font-family: 'DM Serif Display', serif; font-size: 2.25rem; margin-bottom: 1rem; }
.cta-p { font-size: 1.125rem; opacity: 0.85; margin-bottom: 2.5rem; max-width: 500px; margin-inline: auto; }
.cta-btns { display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap; }

.cta-btn-main {
  background: #fff;
  color: #1a3a2a;
  padding: 1.125rem 2.5rem;
  border-radius: 14px;
  font-weight: 800;
  text-decoration: none;
  transition: all 0.2s;
}
.cta-btn-main:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }

.cta-btn-alt {
  background: rgba(255,255,255,0.1);
  color: #fff;
  padding: 1.125rem 2rem;
  border-radius: 14px;
  font-weight: 800;
  border: 1px solid rgba(255,255,255,0.2);
  text-decoration: none;
}

.cta-leaf-deco { position: absolute; bottom: -2.5rem; right: -1rem; font-size: 9rem; opacity: 0.1; transform: rotate(-15deg); }
</style>