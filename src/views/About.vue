<template>
  <div class="page-wrapper">

    <!-- Hero -->
    <section class="about-hero">
      <div class="hero-bg-orb orb-1"></div>
      <div class="hero-bg-orb orb-2"></div>
      <div class="sp-container hero-inner">
        <RouterLink to="/" class="back-btn">
          <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Kembali
        </RouterLink>

        <div class="hero-identity">
          <div class="hero-logo-wrap">
            <img :src="logoImage" alt="System Pakar" class="hero-logo" />
            <div class="hero-logo-glow"></div>
          </div>
          <div>
            <div class="hero-eyebrow">🌿 Sistem Pakar Tanaman Hias</div>
            <h1 class="hero-title">Tentang<br><span class="hero-title-accent">System Pakar</span></h1>
          </div>
        </div>

        <p class="hero-desc">
          Sistem pakar berbasis web untuk diagnosis penyakit tanaman hias menggunakan metode
          <strong>Certainty Factor</strong> dan integrasi WhatsApp — dibuat bersama pakar lokal Parongpong.
        </p>

        <div class="hero-tags">
          <span class="hero-tag">🧮 Certainty Factor</span>
          <span class="hero-tag">🔗 Forward Chaining</span>
          <span class="hero-tag">📱 WhatsApp API</span>
          <span class="hero-tag">🌹 Mawar Holland</span>
        </div>
      </div>
    </section>

    <!-- Content -->
    <div class="sp-container about-content">

      <!-- Deskripsi -->
      <div class="card card-about">
        <div class="card-label" style="--lc:#16a34a;--lb:#f0fdf4;">🌱 Tentang Sistem</div>
        <div class="about-desc-grid">
          <p>
            <strong>System Pakar</strong> adalah sistem berbasis web yang dirancang khusus untuk membantu petani,
            penghobi, dan pelaku usaha dalam mengidentifikasi penyakit tanaman hias serta mendapatkan solusi
            perawatan yang tepat.
          </p>
          <p>
            Sistem ini mengintegrasikan pengetahuan pakar lokal dengan teknologi modern menggunakan metode
            <span class="text-accent">Certainty Factor</span> dan <span class="text-accent">Forward Chaining</span>
            — meniru cara berpikir pakar sesungguhnya.
          </p>
          <p>
            Dengan lebih dari <strong>tiga puluh tahun pengalaman</strong> praktis dari pakar budidaya tanaman hias
            di kawasan Parongpong, setiap rekomendasi mencerminkan kearifan lokal yang telah teruji.
          </p>
        </div>
      </div>

      <!-- Mawar Holland Carrousel -->
      <div class="card card-rose">
        <div class="rose-hero-banner">
          <div class="rose-banner-content">
            <div class="card-label" style="--lc:#be123c;--lb:#fff1f2;">🌹 Bunga Mawar Holland Carrousel</div>
            <p class="rose-intro">
              <strong>Mawar Holland Carrousel</strong> adalah varietas mawar (<em>Rosa</em> sp.) unggulan dari kelompok
              <span class="badge-rose">Hybrid Tea</span> yang dikembangkan oleh pemulia Belanda. Kelopaknya yang tebal,
              tangkainya yang panjang dan kokoh, serta tampilannya yang elegan menjadikannya primadona sebagai tanaman
              hias pot maupun bunga potong komersial.
            </p>
          </div>
          <div class="rose-banner-deco">🌹</div>
        </div>

        <!-- Karakteristik -->
        <h3 class="section-sub-title">🔬 Karakteristik Tanaman</h3>
        <div class="char-grid">
          <div v-for="c in roseChars" :key="c.label" class="char-item">
            <div class="char-icon-wrap">{{ c.icon }}</div>
            <div>
              <div class="char-label">{{ c.label }}</div>
              <div class="char-val">{{ c.value }}</div>
            </div>
          </div>
        </div>


      </div>

      <!-- Metode CF -->
      <div class="card card-cf">
        <div class="card-label" style="--lc:#6d28d9;--lb:#f5f3ff;">🧮 Metode Certainty Factor</div>
        <div class="cf-layout">
          <div class="cf-text">
            <p>
              Sistem menggunakan metode <strong>Certainty Factor (CF)</strong> untuk mengukur tingkat keyakinan
              terhadap suatu diagnosis berdasarkan gejala yang dipilih pengguna.
            </p>
          </div>
          <div class="cf-steps">
            <div v-for="(step, i) in cfSteps" :key="i" class="cf-step">
              <div class="cf-step-num">{{ i + 1 }}</div>
              <div class="cf-step-text">{{ step }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Integrasi WA + Teknologi side by side -->
      <div class="two-col-grid">

        <div class="card">
          <div class="card-label" style="--lc:#15803d;--lb:#f0fdf4;">📱 Integrasi WhatsApp</div>
          <p class="card-sub-text">Terintegrasi dengan <strong>Fonte API</strong> untuk komunikasi langsung melalui WhatsApp dengan pakar tanaman hias.</p>
          <div class="wa-list">
            <div v-for="w in waFeatures" :key="w.title" class="wa-row">
              <span class="wa-row-icon">{{ w.icon }}</span>
              <div>
                <div class="wa-row-title">{{ w.title }}</div>
                <div class="wa-row-desc">{{ w.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-label" style="--lc:#374151;--lb:#f3f4f6;">⚙️ Teknologi</div>
          <p class="card-sub-text">Stack teknologi modern yang mendukung kinerja dan keandalan sistem.</p>
          <div class="tech-grid">
            <div v-for="t in techs" :key="t.label" class="tech-card">
              <div class="tech-emoji">{{ t.icon }}</div>
              <div class="tech-name">{{ t.label }}</div>
              <div class="tech-role">{{ t.role }}</div>
            </div>
          </div>
        </div>

      </div>

      <!-- CTA -->
      <div class="card card-cta">
        <div class="cta-deco">🌿</div>
        <h2 class="cta-title">Siap Memulai?</h2>
        <p class="cta-sub">Daftar sekarang dan akses semua fitur sistem pakar. Gratis dan mudah!</p>
        <div class="cta-actions">
          <RouterLink v-if="!isAuthenticated" to="/register" class="btn btn-primary">
            Daftar Sekarang
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </RouterLink>
          <RouterLink v-if="isAuthenticated" to="/diagnosis" class="btn btn-primary">
            Mulai Diagnosis
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
          </RouterLink>
          <RouterLink to="/" class="btn btn-ghost">Kembali ke Home</RouterLink>
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

const cfSteps = [
  'User memilih gejala dan menentukan tingkat kepastian (CF User)',
  'Sistem menghitung CF untuk setiap kemungkinan penyakit',
  'CF dikombinasikan secara sequential untuk semua gejala',
  'Hasil diagnosis ditampilkan dengan persentase keyakinan',
]

const waFeatures = [
  { icon: '🔐', title: 'Verifikasi OTP',    desc: 'Kode OTP dikirim via WhatsApp menggunakan Fonte API' },
  { icon: '💬', title: 'Konsultasi Pakar',  desc: 'Komunikasi langsung dengan pakar tanaman hias' },
  { icon: '📄', title: 'Laporan Diagnosis', desc: 'PDF diagnosis dikirim langsung ke WhatsApp' },
  { icon: '🔔', title: 'Notifikasi',        desc: 'Update dan notifikasi penting via WhatsApp' },
]

const techs = [
  { icon: '🟢', label: 'Laravel',   role: 'Backend API' },
  { icon: '🟡', label: 'Vue.js',    role: 'Frontend' },
  { icon: '🐍', label: 'Python',    role: 'Expert Engine' },
  { icon: '📱', label: 'Fonte API', role: 'WhatsApp' },
]

const roseChars = [
  { icon: '🌿', label: 'Klasifikasi',     value: 'Hybrid Tea (Rosa sp.)' },
  { icon: '🎨', label: 'Warna Bunga',     value: 'Putih-merah muda gradasi (bicolor)' },
  { icon: '🌸', label: 'Jumlah Kelopak',  value: '26–40 helai per bunga' },
  { icon: '📏', label: 'Tinggi Tanaman',  value: '55–75 cm (lebih di lahan terbuka)' },
  { icon: '🌱', label: 'Tangkai',         value: 'Panjang, kokoh; minim duri — ideal bunga potong' },
  { icon: '⭐', label: 'Keunggulan',      value: 'Kelopak tebal, tahan pasca-panen, berbunga berulang' },
]

</script>

<style scoped>
/* ── Reset & Base ── */
a { text-decoration: none; }

.page-wrapper {
  min-height: 100vh;
  background: #f6f8f5;
  font-family: 'Segoe UI', system-ui, sans-serif;
}

/* ── Container ── */
.sp-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* ═══════════════════════════════
   HERO
═══════════════════════════════ */
.about-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #ffffff 0%, #f0fdf4 60%, #fdf2f8 100%);
  border-bottom: 1px solid #e2e8e0;
  padding: 5rem 0 2.5rem;
}

.hero-bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: .35;
  pointer-events: none;
}
.orb-1 {
  width: 340px; height: 340px;
  background: radial-gradient(circle, #bbf7d0, transparent);
  top: -80px; right: -60px;
}
.orb-2 {
  width: 260px; height: 260px;
  background: radial-gradient(circle, #fce7f3, transparent);
  bottom: -60px; left: -40px;
}

.hero-inner { position: relative; z-index: 1; }

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  font-size: .8125rem;
  font-weight: 600;
  color: #6b7280;
  padding: .375rem .75rem;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: #fff;
  margin-bottom: 1.75rem;
  transition: border-color .15s, color .15s, box-shadow .15s;
}
.back-btn:hover {
  color: #16a34a;
  border-color: #86efac;
  box-shadow: 0 2px 8px rgba(22,163,74,.1);
}

.hero-identity {
  display: flex;
  align-items: center;
  gap: 1.125rem;
  margin-bottom: 1rem;
}

.hero-logo-wrap {
  position: relative;
  flex-shrink: 0;
}
.hero-logo {
  width: 52px; height: 52px;
  border-radius: 14px;
  border: 1px solid #d1d5db;
  object-fit: cover;
  position: relative;
  z-index: 1;
}
.hero-logo-glow {
  position: absolute;
  inset: -4px;
  border-radius: 18px;
  background: linear-gradient(135deg, #86efac, #f9a8d4);
  opacity: .5;
  filter: blur(6px);
  z-index: 0;
}

.hero-eyebrow {
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: #16a34a;
  margin-bottom: .25rem;
}
.hero-title {
  font-size: 2rem;
  font-weight: 900;
  line-height: 1.15;
  color: #111827;
  margin: 0;
  letter-spacing: -.02em;
}
.hero-title-accent {
  background: linear-gradient(135deg, #16a34a, #15803d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  color: #6b7280;
  font-size: .9375rem;
  line-height: 1.75;
  max-width: 560px;
  margin: 0 0 1.25rem;
}
.hero-desc strong { color: #374151; }

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}
.hero-tag {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  font-size: .75rem;
  font-weight: 600;
  padding: .3rem .75rem;
  border-radius: 9999px;
  background: #fff;
  border: 1px solid #d1fae5;
  color: #15803d;
  letter-spacing: .01em;
}

/* ═══════════════════════════════
   LAYOUT
═══════════════════════════════ */
.about-content {
  display: flex;
  flex-direction: column;
  gap: 1.125rem;
  padding-top: 2rem;
  padding-bottom: 5rem;
}

/* ═══════════════════════════════
   CARD BASE
═══════════════════════════════ */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.75rem 2rem;
  box-shadow: 0 1px 3px rgba(0,0,0,.05), 0 4px 16px rgba(0,0,0,.03);
}

/* Card label (pill badge) */
.card-label {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  padding: .375rem .875rem;
  border-radius: 9999px;
  font-size: .8rem;
  font-weight: 700;
  letter-spacing: .015em;
  background: var(--lb);
  color: var(--lc);
  margin-bottom: 1.125rem;
}

/* ═══════════════════════════════
   ABOUT DESCRIPTION
═══════════════════════════════ */
.about-desc-grid {
  display: flex;
  flex-direction: column;
  gap: .75rem;
}
.about-desc-grid p {
  color: #4b5563;
  font-size: .9375rem;
  line-height: 1.8;
  margin: 0;
}
.about-desc-grid strong { color: #111827; }
.text-accent { color: #16a34a; font-weight: 600; }

/* ═══════════════════════════════
   ROSE SECTION
═══════════════════════════════ */
.card-rose { padding: 0; overflow: hidden; }
.card-rose > * { padding-left: 2rem; padding-right: 2rem; }

.rose-hero-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: linear-gradient(135deg, #fff1f2 0%, #fce7f3 100%);
  border-bottom: 1px solid #fecdd3;
  padding: 1.75rem 2rem !important;
}
.rose-intro {
  color: #374151;
  font-size: .9rem;
  line-height: 1.75;
  margin: .5rem 0 0;
  max-width: 520px;
}
.rose-intro strong { color: #9f1239; }
.rose-banner-deco {
  font-size: 4rem;
  line-height: 1;
  flex-shrink: 0;
  opacity: .7;
  filter: drop-shadow(0 4px 12px rgba(190,18,60,.2));
}

.badge-rose {
  display: inline-block;
  padding: .15rem .5rem;
  background: #fff1f2;
  border: 1px solid #fda4af;
  color: #be123c;
  border-radius: 6px;
  font-size: .8rem;
  font-weight: 700;
}

.section-sub-title {
  font-size: .9375rem;
  font-weight: 800;
  color: #111827;
  margin: 1.75rem 0 .875rem;
  letter-spacing: -.01em;
}
.section-note {
  font-size: .8125rem;
  color: #9ca3af;
  margin: -.5rem 0 1rem;
}

/* Karakteristik */
.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: .625rem;
}
.char-item {
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  padding: .875rem 1rem;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  transition: border-color .15s;
}
.char-item:hover { border-color: #d1fae5; }
.char-icon-wrap { font-size: 1.25rem; flex-shrink: 0; margin-top: .05rem; line-height: 1; }
.char-label { font-size: .7rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .04em; margin-bottom: .2rem; }
.char-val   { font-size: .84rem; color: #1f2937; font-weight: 500; line-height: 1.5; }

/* Care cards */
.care-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: .75rem;
}
.care-card {
  padding: 1.125rem;
  background: #fafafa;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  transition: border-color .15s, box-shadow .15s, transform .15s;
}
.care-card:hover {
  border-color: #bbf7d0;
  box-shadow: 0 4px 16px rgba(22,163,74,.07);
  transform: translateY(-2px);
}
.care-icon-wrap {
  width: 40px; height: 40px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.15rem;
  margin-bottom: .625rem;
}
.care-title { font-size: .875rem; font-weight: 700; color: #1f2937; margin-bottom: .375rem; }
.care-desc  { font-size: .8rem; color: #6b7280; line-height: 1.6; margin: 0; }

/* Disease list */
.disease-list { display: flex; flex-direction: column; gap: .625rem; }
.disease-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color .15s;
}
.disease-card:hover { border-color: #d1d5db; }
.disease-title-row {
  display: flex;
  align-items: center;
  gap: .625rem;
  padding: .625rem 1rem;
  background: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
}
.disease-dot  { width: 9px; height: 9px; border-radius: 50%; flex-shrink: 0; }
.disease-name { font-size: .875rem; font-weight: 700; color: #111827; }
.disease-cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
}
@media (max-width: 560px) {
  .disease-cols { grid-template-columns: 1fr; }
  .disease-col + .disease-col { border-left: none !important; border-top: 1px solid #f3f4f6; }
}
.disease-col { padding: .75rem 1rem; }
.disease-col + .disease-col { border-left: 1px solid #f3f4f6; }
.disease-col-label { font-size: .7rem; font-weight: 700; color: #9ca3af; text-transform: uppercase; letter-spacing: .04em; margin-bottom: .3rem; }
.disease-col-text  { font-size: .82rem; color: #4b5563; line-height: 1.65; margin: 0; }

/* Fun fact */
.funfact {
  display: flex;
  align-items: flex-start;
  gap: .875rem;
  margin: 1.75rem 0 1.75rem;
  padding: 1rem 1.25rem;
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 12px;
}
.funfact-icon { font-size: 1.375rem; flex-shrink: 0; line-height: 1.5; }
.funfact p { margin: 0; font-size: .8125rem; color: #4b5563; line-height: 1.75; }
.funfact strong { color: #92400e; }

/* ═══════════════════════════════
   FEATURES
═══════════════════════════════ */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: .875rem;
}
.feature-card {
  padding: 1.25rem;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 14px;
  transition: border-color .15s, box-shadow .15s, transform .15s;
}
.feature-card:hover {
  border-color: #d1fae5;
  box-shadow: 0 6px 20px rgba(22,163,74,.08);
  transform: translateY(-2px);
}
.feature-icon-wrap {
  width: 44px; height: 44px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.25rem;
  margin-bottom: .75rem;
}
.feature-title { font-size: .9rem; font-weight: 700; color: #1f2937; margin: 0 0 .375rem; }
.feature-desc  { font-size: .8rem; color: #6b7280; line-height: 1.6; margin: 0; }

/* ═══════════════════════════════
   CF STEPS
═══════════════════════════════ */
.card-cf {}
.cf-layout {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 1.5rem;
  align-items: start;
}
@media (max-width: 620px) { .cf-layout { grid-template-columns: 1fr; } }
.cf-text p { color: #4b5563; font-size: .9375rem; line-height: 1.8; margin: 0; }
.cf-text strong { color: #111827; }

.cf-steps { display: flex; flex-direction: column; gap: .625rem; }
.cf-step {
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  padding: .75rem 1rem;
  background: #f5f3ff;
  border: 1px solid #ede9fe;
  border-radius: 10px;
}
.cf-step-num {
  width: 24px; height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: #fff;
  font-size: .75rem;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.cf-step-text { font-size: .84rem; color: #374151; line-height: 1.6; }

/* ═══════════════════════════════
   TWO-COL GRID
═══════════════════════════════ */
.two-col-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.125rem;
  align-items: start;
}
@media (max-width: 640px) { .two-col-grid { grid-template-columns: 1fr; } }

.card-sub-text { font-size: .875rem; color: #6b7280; line-height: 1.7; margin: 0 0 1rem; }
.card-sub-text strong { color: #111827; }

/* WA list */
.wa-list { display: flex; flex-direction: column; gap: .625rem; }
.wa-row {
  display: flex;
  align-items: flex-start;
  gap: .75rem;
  padding: .75rem;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 10px;
}
.wa-row-icon { font-size: 1.25rem; flex-shrink: 0; margin-top: .05rem; }
.wa-row-title { font-size: .85rem; font-weight: 700; color: #1f2937; margin-bottom: .15rem; }
.wa-row-desc  { font-size: .78rem; color: #6b7280; line-height: 1.5; }

/* Tech grid */
.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: .625rem;
}
.tech-card {
  text-align: center;
  padding: 1.125rem .75rem;
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 12px;
  transition: border-color .15s, box-shadow .15s, transform .15s;
}
.tech-card:hover {
  border-color: #d1d5db;
  box-shadow: 0 4px 12px rgba(0,0,0,.06);
  transform: translateY(-2px);
}
.tech-emoji { font-size: 1.625rem; margin-bottom: .375rem; }
.tech-name  { font-size: .875rem; font-weight: 700; color: #1f2937; }
.tech-role  { font-size: .75rem; color: #9ca3af; margin-top: .15rem; }

/* ═══════════════════════════════
   CTA
═══════════════════════════════ */
.card-cta {
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 60%, #fdf2f8 100%) !important;
  border-color: #bbf7d0 !important;
  position: relative;
  overflow: hidden;
  text-align: left;
}
.cta-deco {
  position: absolute;
  top: -20px; right: -10px;
  font-size: 6rem;
  opacity: .08;
  line-height: 1;
  pointer-events: none;
}
.cta-title {
  font-size: 1.375rem;
  font-weight: 900;
  color: #111827;
  margin: 0 0 .5rem;
  letter-spacing: -.02em;
}
.cta-sub {
  color: #6b7280;
  font-size: .9375rem;
  margin: 0 0 1.5rem;
  max-width: 360px;
  line-height: 1.6;
}
.cta-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .625rem 1.25rem;
  border-radius: 10px;
  font-size: .875rem;
  font-weight: 700;
  border: 1.5px solid transparent;
  cursor: pointer;
  transition: all .15s;
  letter-spacing: .01em;
}
.btn-primary {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: #fff;
  border-color: #15803d;
  box-shadow: 0 2px 8px rgba(22,163,74,.25);
}
.btn-primary:hover {
  background: linear-gradient(135deg, #15803d, #14532d);
  box-shadow: 0 4px 14px rgba(22,163,74,.35);
  transform: translateY(-1px);
}
.btn-ghost {
  background: #fff;
  color: #374151;
  border-color: #d1d5db;
}
.btn-ghost:hover {
  border-color: #9ca3af;
  background: #f9fafb;
}
</style>