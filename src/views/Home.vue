<template>
  <div>
    <!-- Hero -->
    <section class="hero-section">
      <div class="page-container">
        <div class="hero-grid">
          <div class="hero-content animate-fade-in">
            <div class="hero-badge">
              <span class="badge-dot"></span>
              Sistem Pakar Tanaman Hias
            </div>
            <h1 class="hero-title">
              Diagnosis Penyakit<br>
              <span class="hero-title-accent">Tanaman Hias</span>
            </h1>
            <p class="hero-desc">
              Sistem pakar berbasis web untuk membantu mengidentifikasi penyakit tanaman hias
              dan mendapatkan solusi perawatan yang tepat menggunakan metode Certainty Factor.
            </p>
            <div class="hero-actions">
              <RouterLink v-if="!isAuthenticated" to="/register" class="sp-btn sp-btn-primary sp-btn-lg">
                Mulai Sekarang
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </RouterLink>
              <RouterLink v-if="!isAuthenticated" to="/login" class="sp-btn sp-btn-secondary sp-btn-lg">Masuk</RouterLink>
              <RouterLink v-if="isAuthenticated" to="/diagnosis" class="sp-btn sp-btn-primary sp-btn-lg">
                Mulai Diagnosis
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
              </RouterLink>
              <RouterLink v-if="isAuthenticated" to="/education" class="sp-btn sp-btn-secondary sp-btn-lg">Modul Edukasi</RouterLink>
            </div>
            <div class="hero-tags">
              <span class="hero-tag">✓ Gratis</span>
              <span class="hero-tag">✓ Hasil Instan</span>
              <span class="hero-tag">✓ Metode CF</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="section-alt">
      <div class="page-container">
        <div class="section-header">
          <h2>Fitur Utama</h2>
          <p>Solusi lengkap untuk perawatan dan diagnosis tanaman hias</p>
        </div>
        <div class="features-grid">
          <div v-for="(feat, i) in features" :key="i" class="feature-card sp-card animate-fade-in-up" :class="`delay-${(i+1)*100}`">
            <div class="feature-icon" :style="{ background: feat.bg }">
              <svg width="22" height="22" :fill="feat.iconFill" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="feat.icon" />
              </svg>
            </div>
            <h3 class="feature-title">{{ feat.title }}</h3>
            <p class="feature-desc">{{ feat.desc }}</p>
            <RouterLink v-if="feat.link && isAuthenticated" :to="feat.link" class="feature-link">
              {{ feat.linkText }}
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="section-white">
      <div class="page-container">
        <div class="section-header">
          <h2>Cara Penggunaan</h2>
          <p>Tiga langkah mudah untuk mendapatkan hasil diagnosis</p>
        </div>
        <div class="steps-grid">
          <div v-for="(step, i) in steps" :key="i" class="step-item animate-fade-in-up" :class="`delay-${(i+1)*100}`">
            <div class="step-number">{{ i + 1 }}</div>
            <div class="sp-card" style="padding:1.5rem;">
              <h3 style="font-size:1.0625rem;margin-bottom:.5rem;">{{ step.title }}</h3>
              <p style="font-size:.875rem;margin:0;">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-cta" v-if="!isAuthenticated">
      <div class="page-container">
        <div class="cta-box">
          <h2 style="margin-bottom:.75rem;">Siap Mencoba?</h2>
          <p style="max-width:480px;margin:0 auto 1.75rem;">Daftar gratis dan mulai diagnosis tanaman hias Anda dalam hitungan menit.</p>
          <div style="display:flex;gap:.75rem;justify-content:center;flex-wrap:wrap;">
            <RouterLink to="/register" class="sp-btn sp-btn-primary sp-btn-lg">Daftar Gratis</RouterLink>
            <RouterLink to="/about" class="sp-btn sp-btn-secondary sp-btn-lg">Pelajari Lebih Lanjut</RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)

const features = [
  {
    title: 'Diagnosis Cepat',
    desc: 'Identifikasi penyakit tanaman hias menggunakan algoritma Certainty Factor. Hasil diagnosis instan beserta solusi penanganan.',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    bg: '#f0fdf4', iconFill: 'none',
    link: '/diagnosis', linkText: 'Coba Sekarang'
  },
  {
    title: 'Modul Edukasi',
    desc: 'Akses berbagai modul pembelajaran tentang perawatan tanaman hias, tips, dan panduan praktis dari para pakar.',
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
    bg: '#eff6ff', iconFill: 'none',
    link: '/education', linkText: 'Lihat Modul'
  },
  {
    title: 'Konsultasi Pakar',
    desc: 'Hubungi pakar tanaman hias langsung melalui WhatsApp untuk konsultasi lebih mendalam tentang kondisi tanaman Anda.',
    icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z',
    bg: '#f0fdf4', iconFill: 'none',
    link: '/consultation', linkText: 'Konsultasi'
  },
  {
    title: 'Riwayat Diagnosis',
    desc: 'Simpan dan akses semua riwayat diagnosis. Download laporan PDF untuk catatan dan referensi.',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    bg: '#fffbeb', iconFill: 'none',
    link: '/diagnosis/history', linkText: 'Lihat Riwayat'
  },
  {
    title: 'Certainty Factor',
    desc: 'Menggunakan algoritma CF yang terstandarisasi untuk menghasilkan tingkat keyakinan diagnosis yang akurat dan terukur.',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
    bg: '#f5f3ff', iconFill: 'none'
  },
  {
    title: 'Mudah Digunakan',
    desc: 'Antarmuka yang sederhana dan intuitif. Pilih tanaman, centang gejala yang terlihat, dan dapatkan hasil diagnosis.',
    icon: 'M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    bg: '#fef2f2', iconFill: 'none'
  },
]

const steps = [
  { title: 'Pilih Tanaman', desc: 'Pilih jenis tanaman hias yang ingin didiagnosis dari daftar yang tersedia.' },
  { title: 'Input Gejala', desc: 'Centang gejala yang Anda amati dan tentukan tingkat keyakinan untuk setiap gejala.' },
  { title: 'Dapatkan Hasil', desc: 'Sistem menganalisis dan memberikan diagnosis penyakit beserta solusi perawatan.' },
]
</script>

<style scoped>
a { text-decoration: none; }

/* Hero */
.hero-section {
  padding: 3.5rem 0 3rem;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
}
.hero-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}
.hero-content { display: flex; flex-direction: column; gap: 1.25rem; max-width: 640px; }

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .35rem .875rem;
  background: var(--primary-50);
  color: var(--primary-700);
  border: 1px solid var(--primary-200);
  border-radius: 9999px;
  font-size: .8125rem;
  font-weight: 600;
  width: fit-content;
}
.badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--primary);
  flex-shrink: 0;
}

.hero-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 800;
  line-height: 1.2;
  color: var(--gray-900);
  letter-spacing: -.025em;
  margin: 0;
}
.hero-title-accent { color: var(--primary); }

.hero-desc {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 500px;
  margin: 0;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: .75rem;
}
.hero-tag {
  font-size: .8125rem;
  font-weight: 500;
  color: var(--text-muted);
}

/* Sections */
.section-alt   { padding: 4rem 0; background: var(--bg-subtle); }
.section-white { padding: 4rem 0; background: var(--bg-surface); }
.section-cta   { padding: 4rem 0; background: var(--primary-50); border-top: 1px solid var(--primary-200); }

.section-header { text-align: center; margin-bottom: 2.5rem; }
.section-header h2 { margin-bottom: .5rem; }
.section-header p  { font-size: 1rem; color: var(--text-muted); margin: 0; }

/* Features */
.features-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}
@media (min-width: 640px)  { .features-grid { grid-template-columns: 1fr 1fr; } }
@media (min-width: 1024px) { .features-grid { grid-template-columns: repeat(3, 1fr); } }

.feature-card { padding: 1.5rem; display: flex; flex-direction: column; }
.feature-icon {
  width: 44px; height: 44px;
  border-radius: var(--radius);
  display: flex; align-items: center; justify-content: center;
  flex-shrink:0;
  margin-bottom: 1rem;
  color: var(--primary);
}
.feature-title { font-size: 1rem; font-weight: 600; color: var(--gray-900); margin-bottom: .375rem; }
.feature-desc  { font-size: .875rem; color: var(--text-muted); line-height: 1.65; flex: 1; margin: 0; }
.feature-link  { display: inline-flex; align-items: center; gap: .3rem; margin-top: 1rem; font-size: .8125rem; font-weight: 600; color: var(--primary); text-decoration: none; transition: color .15s; }
.feature-link:hover { color: var(--primary-dark); }

/* Steps */
.steps-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  max-width: 760px;
  margin: 0 auto;
}
@media (min-width: 640px) { .steps-grid { grid-template-columns: repeat(3, 1fr); } }

.step-item { display: flex; flex-direction: column; gap: .75rem; }
.step-number {
  width: 42px; height: 42px;
  border-radius: 50%;
  background: var(--primary);
  color: #fff;
  font-weight: 800;
  font-size: 1.125rem;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto;
}

/* CTA */
.cta-box { text-align: center; max-width: 600px; margin: 0 auto; }
</style>
