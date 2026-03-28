<template>
  <div class="admin-dashboard-page">
    <!-- Page Header (Unified Hero Style) -->
    <header class="edu-hero">
      <div class="hero-bg-leaf">🌿</div>
      <div class="hero-bg-leaf hero-bg-leaf--2">🍃</div>
      <div class="page-container">
        <div class="edu-hero-inner">
          <div class="hero-text">
            <span class="hero-eyebrow">Admin Control Center</span>
            <h1 class="edu-title">Dashboard Admin</h1>
            <p class="edu-sub">Insight & Analitik Sistem Pakar <span class="last-update">| Terakhir diperbarui: {{ lastUpdate }}</span></p>
          </div>
        </div>
      </div>
    </header>

    <!-- Dashboard Content -->
    <div class="page-container dashboard-main-content">
      
      <!-- Navigasi Manajemen (Quick Links) -->
      <section class="dashboard-section">
        <div class="section-card quick-links-card">
          <h2 class="section-title">Navigasi Manajemen</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <router-link to="/admin/users" class="nav-item-card">
              <div class="nav-icon">👥</div>
              <p class="nav-label">Users</p>
            </router-link>
            <router-link to="/admin/education" class="nav-item-card">
              <div class="nav-icon">📚</div>
              <p class="nav-label">Edukasi</p>
            </router-link>
            <router-link to="/admin/plants" class="nav-item-card">
              <div class="nav-icon">🌿</div>
              <p class="nav-label">Tanaman</p>
            </router-link>
            <router-link to="/admin/diseases" class="nav-item-card complex-icon">
              <div class="nav-icon-group">
                <span>📊</span><span>🦠</span><span>🔍</span>
              </div>
              <p class="nav-label">Table CF</p>
              <p class="nav-sub">Penyakit & Gejala</p>
            </router-link>
            <router-link to="/admin/cf-levels" class="nav-item-card">
              <div class="nav-icon">📊</div>
              <p class="nav-label">Bobot CF</p>
            </router-link>
            <router-link to="/admin/feedback-comments" class="nav-item-card">
              <div class="nav-icon">🗒️</div>
              <p class="nav-label">Feedback</p>
            </router-link>
          </div>
        </div>
      </section>

      <!-- Stats Grid -->
      <div class="stats-overview-grid">
        
        <!-- Ringkasan Sistem -->
        <section class="dashboard-section chart-section">
          <div class="section-card">
            <h3 class="card-header-title">
              <span class="indicator bg-emerald"></span>
              Ringkasan Sistem
            </h3>
            <div class="system-stats-grid">
              <div v-for="stat in systemStats" :key="stat.label" class="stat-box">
                <span class="stat-value text-emerald">{{ stat.num }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>
            <div class="stats-divider"></div>
            <div class="total-diagnosis-box">
              <div class="diagnosis-icon">🩺</div>
              <p class="diagnosis-value text-emerald">{{ quickStats.totalDiagnoses || 0 }}</p>
              <p class="diagnosis-label">Total Diagnosis</p>
            </div>
          </div>
        </section>

        <!-- Akurasi & Feedback -->
        <section class="dashboard-section chart-section">
          <div class="section-card">
            <h3 class="card-header-title">
              <span class="indicator bg-amber"></span>
              Kepuasan & Akurasi Sistem
            </h3>
            <div class="chart-container">
              <Doughnut v-if="feedbackChartData.labels.length" :data="feedbackChartData" :options="chartOptions" />
              <div v-else class="empty-chart-msg">Belum ada feedback terkumpul</div>
            </div>
            
            <div v-if="feedbackSummary.length" class="feedback-summary-list">
              <p class="total-feedback-text">Total Feedback: {{ totalFeedbackCount }}</p>
              <div v-for="item in feedbackSummary" :key="item.key" 
                class="feedback-item-card" :class="item.key">
                <div class="feedback-content">
                  <div class="feedback-info">
                    <div class="feedback-label-row">
                      <span class="feedback-icon">{{ item.icon }}</span>
                      <span class="feedback-name">{{ item.label }}</span>
                    </div>
                    <p class="feedback-desc">{{ item.description }}</p>
                  </div>
                  <div class="feedback-count">{{ item.total }}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import { useAdminStore } from '../../stores/admin'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const adminStore = useAdminStore()
const quickStats = computed(() => adminStore.quickStats)
const lastUpdate = ref(new Date().toLocaleTimeString('id-ID'))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  }
}

const systemStats = ref([
  { num: '0', label: 'Jenis Tanaman' },
  { num: '0', label: 'Penyakit' },
  { num: '0', label: 'Gejala' },
  { num: '0', label: 'Aturan Bobot CF' }
])

async function fetchSystemSummary () {
  try {
    const response = await api.get('/public/stats/summary')
    if (response.data?.success) {
      const d = response.data.data || {}
      systemStats.value = [
        { num: String(d.plants ?? 0), label: 'Jenis Tanaman' },
        { num: String(d.diseases ?? 0), label: 'Penyakit' },
        { num: String(d.symptoms ?? 0), label: 'Gejala' },
        { num: String(d.rules ?? 0), label: 'Aturan Bobot CF' }
      ]
    }
  } catch (e) {
    console.error('Gagal memuat ringkasan sistem:', e)
  }
}

const feedbackChartData = computed(() => {
  const dist = adminStore.feedbackDistribution || []
  const feedbackLabelMap = {
    accurate: '😊 Akurat',
    somewhat_accurate: '😐 Cukup Akurat',
    inaccurate: '😞 Tidak Akurat'
  }

  return {
    labels: dist.map(f => feedbackLabelMap[f.accuracy] || f.accuracy),
    datasets: [{
      data: dist.map(f => f.total),
      backgroundColor: ['#10b981', '#fbbf24', '#f87171'],
      hoverOffset: 4
    }]
  }
})

const feedbackSummary = computed(() => {
  const dist = adminStore.feedbackDistribution || []

  const meta = {
    accurate: {
      icon: '😊',
      label: 'Akurat',
      description: 'Diagnosis sesuai dengan kondisi tanaman.'
    },
    somewhat_accurate: {
      icon: '😐',
      label: 'Cukup Akurat',
      description: 'Hasil membantu, masih ada perbaikan.'
    },
    inaccurate: {
      icon: '😞',
      label: 'Tidak Akurat',
      description: 'Hasil belum sesuai, perlu evaluasi.'
    }
  }

  return dist.map((item) => {
    const count = Number(item.total || 0)
    const detail = meta[item.accuracy] || {
      icon: '📌',
      label: item.accuracy,
      description: 'Kategori feedback.'
    }

    return {
      key: item.accuracy,
      icon: detail.icon,
      label: detail.label,
      description: detail.description,
      total: count
    }
  })
})

const totalFeedbackCount = computed(() => {
  const dist = adminStore.feedbackDistribution || []
  return dist.reduce((sum, item) => sum + Number(item.total || 0), 0)
})

onMounted(async () => {
  try {
    await Promise.all([
      adminStore.fetchQuickStats(),
      adminStore.fetchDiagnosisStats(),
      fetchSystemSummary()
    ])
  } catch (err) {
    console.error('Gagal memuat statistik dashboard', err)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

.admin-dashboard-page {
  width: 100%;
  min-height: 100vh;
  background-color: #f5f7f4;
  font-family: 'DM Sans', sans-serif;
  color: #1e3a2a;
}

/* --- Hero Section --- */
.edu-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #064e3b 0%, #166534 60%, #15803d 100%);
  padding: 4rem 1.5rem 3.5rem;
  color: white;
}

.hero-bg-leaf {
  position: absolute;
  font-size: 8rem;
  opacity: .08;
  top: -1rem; right: -1rem;
  transform: rotate(20deg);
  pointer-events: none;
  user-select: none;
}
.hero-bg-leaf--2 {
  font-size: 5rem;
  top: auto; bottom: -1.5rem; left: -1rem; right: auto;
  transform: rotate(-30deg);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.hero-eyebrow {
  display: inline-block;
  background: rgba(255,255,255,.12);
  color: #a7f3c0;
  font-size: .75rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  padding: .3rem .875rem;
  border-radius: 999px;
  margin-bottom: .875rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.edu-title {
  font-family: 'DM Serif Display', serif;
  font-size: 2.75rem;
  font-weight: 400;
  color: #fff;
  margin: 0 0 .5rem;
  line-height: 1.1;
}

.edu-sub {
  font-size: 1rem;
  color: rgba(255,255,255,.7);
  margin: 0;
}

.last-update { opacity: 0.7; font-size: 0.875rem; font-weight: 500; margin-left: 0.5rem; }

/* --- Main Layout --- */
.dashboard-main-content {
  padding: 0 1.5rem 5rem;
  margin-top: -2.5rem;
  position: relative;
  z-index: 20;
}

.dashboard-section { margin-bottom: 2rem; }

.section-card {
  background: white;
  border-radius: 24px;
  padding: 2rem;
  box-shadow: 0 4px 25px rgba(30, 58, 42, 0.05);
  border: 1.5px solid #edf2ed;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 800;
  color: #1e3a2a;
  margin-bottom: 1.75rem;
  letter-spacing: -0.01em;
}

/* --- Quick Links --- */
.nav-item-card {
  background: #f8faf9;
  padding: 1.25rem 1rem;
  border-radius: 20px;
  border: 1.5px solid transparent;
  text-align: center;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.nav-item-card:hover {
  background: white;
  border-color: #3a7a50;
  box-shadow: 0 12px 24px rgba(30, 58, 42, 0.08);
  transform: translateY(-4px);
}

.nav-icon { font-size: 1.75rem; margin-bottom: 0.625rem; transition: transform 0.3s; }
.nav-item-card:hover .nav-icon { transform: scale(1.15) rotate(5deg); }

.nav-label { font-size: 0.75rem; font-weight: 800; color: #4b6a55; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }
.nav-sub { font-size: 0.625rem; font-weight: 500; color: #adbcaa; margin-top: 2px; }

.nav-icon-group { display: flex; gap: 2px; font-size: 1.125rem; margin-bottom: 0.625rem; }

/* --- Stats and Charts --- */
.stats-overview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .stats-overview-grid { grid-template-columns: 1fr; }
}

.card-header-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.875rem;
  font-weight: 800;
  color: #4b6a55;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 2rem;
}

.indicator { width: 10px; height: 10px; border-radius: 50%; }
.bg-emerald { background: #10b981; }
.bg-amber { background: #f59e0b; }

.system-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.stat-box {
  background: #f0fdf4;
  padding: 1.75rem 1rem;
  border-radius: 18px;
  border: 1.5px solid #dcfce7;
  text-align: center;
  transition: background 0.2s;
}

.stat-box:hover { background: #dcfce7; }

.stat-value { display: block; font-size: 2rem; font-weight: 900; margin-bottom: 0.25rem; }
.text-emerald { color: #059669; }

.stat-label { font-size: 0.75rem; font-weight: 700; color: #6a8a72; text-transform: uppercase; }

.stats-divider { height: 1.5px; background: #edf2ed; margin: 2rem 0; }

.total-diagnosis-box {
  background: #f0fdf4;
  border: 1.5px solid #dcfce7;
  border-radius: 20px;
  padding: 1.75rem;
  text-align: center;
  transition: all 0.2s;
}
.total-diagnosis-box:hover { transform: scale(1.02); background: #dcfce7; }

.diagnosis-icon { font-size: 1.5rem; margin-bottom: 0.5rem; display: block; }
.diagnosis-value { font-size: 2.5rem; font-weight: 900; line-height: 1; margin: 0 0 0.5rem; }
.diagnosis-label { font-size: 0.875rem; font-weight: 800; color: #4b6a55; text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }

/* --- Feedback Distribution --- */
.chart-container {
  height: 240px;
  max-width: 320px;
  margin: 0 auto 2.5rem;
  position: relative;
}

.empty-chart-msg {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  color: #adbcaa;
  font-style: italic;
}

.feedback-summary-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-top: 1.5px solid #edf2ed;
  padding-top: 1.75rem;
}

.total-feedback-text {
  font-size: 0.75rem;
  font-weight: 800;
  color: #4b6a55;
  text-transform: uppercase;
  margin-bottom: 0.25rem;
  padding-left: 0.5rem;
}

.feedback-item-card {
  padding: 1.125rem;
  border-radius: 18px;
  border: 1.5px solid transparent;
}

.feedback-item-card.accurate { background: #f0fdf4; border-color: #dcfce7; }
.feedback-item-card.somewhat_accurate { background: #fffbeb; border-color: #fef3c7; }
.feedback-item-card.inaccurate { background: #fef2f2; border-color: #fee2e2; }

.feedback-content { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.feedback-label-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
.feedback-icon { font-size: 1.25rem; }
.feedback-name { font-size: 0.9375rem; font-weight: 800; color: #1e3a2a; }
.feedback-desc { font-size: 0.75rem; color: #6a8a72; margin: 0; line-height: 1.4; max-width: 200px; }
.feedback-count { font-size: 1.75rem; font-weight: 900; color: #1e3a2a; }
</style>
