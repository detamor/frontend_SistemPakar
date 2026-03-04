<template>
  <div class="admin-dashboard">
    <!-- Tombol Kembali -->
    <div class="mb-6 flex justify-between items-center">
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
      >
        <span>←</span>
        <span>Kembali ke Home</span>
      </router-link>
      <div class="text-xs text-slate-400 font-medium">
        Terakhir diperbarui: {{ lastUpdate }}
      </div>
    </div>
    
    <div class="flex items-center gap-3 mb-8">
      <div class="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
        <svg class="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
      </div>
      <div>
        <h1 class="text-2xl font-black text-slate-800 m-0">Dashboard Admin</h1>
        <p class="text-slate-500 text-sm m-0">Insight & Analitik Sistem Pakar</p>
      </div>
    </div>
    
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">👤</div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Users</p>
            <p class="text-2xl font-black text-slate-800">{{ quickStats.totalUsers || 0 }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">🩺</div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
            <p class="text-2xl font-black text-slate-800">{{ quickStats.totalDiagnoses || 0 }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">📚</div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Modul Edukasi</p>
            <p class="text-2xl font-black text-slate-800">{{ quickStats.totalModules || 0 }}</p>
          </div>
        </div>
      </div>
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">💬</div>
          <div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Konsultasi</p>
            <p class="text-2xl font-black text-slate-800">{{ quickStats.totalConsultations || 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Top Diseases Chart -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Sebaran Penyakit Paling Sering Terdeteksi
        </h3>
        <div class="h-64 flex items-center justify-center">
          <Bar v-if="diseaseChartData.labels.length" :data="diseaseChartData" :options="chartOptions" />
          <div v-else class="text-slate-300 text-xs italic">Menunggu data diagnosis...</div>
        </div>
      </div>

      <!-- Feedback Distribution -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
          <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
          Tingkat Kepuasan / Akurasi Sistem
        </h3>
        <div class="h-64 flex items-center justify-center">
          <Doughnut v-if="feedbackChartData.labels.length" :data="feedbackChartData" :options="chartOptions" />
          <div v-else class="text-slate-300 text-xs italic">Belum ada feedback terkumpul</div>
        </div>
      </div>
    </div>

    <!-- Quick Links -->
    <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200/50">
      <h2 class="text-lg font-bold text-slate-800 mb-6">Navigasi Manajemen</h2>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <router-link to="/admin/users" class="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Users</p>
        </router-link>
        <router-link to="/admin/education" class="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">📚</div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Edukasi</p>
        </router-link>
        <router-link to="/admin/plants" class="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🌿</div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Tanaman</p>
        </router-link>
        <router-link to="/admin/symptoms" class="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🔍</div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Gejala</p>
        </router-link>
        <router-link to="/admin/diseases" class="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🦠</div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Penyakit</p>
        </router-link>
        <router-link to="/admin/cf-levels" class="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Bobot CF</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { Bar, Doughnut } from 'vue-chartjs'
import { 
  Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,
  ArcElement
} from 'chart.js'

// Register ChartJS components
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

const adminStore = useAdminStore()
const quickStats = computed(() => adminStore.quickStats)
const lastUpdate = ref(new Date().toLocaleTimeString('id-ID'))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: { beginAtZero: true, grid: { display: false } },
    x: { grid: { display: false } }
  }
}

const diseaseChartData = computed(() => {
  const top = adminStore.topDiseases || []
  return {
    labels: top.map(d => d.disease?.name || 'Unknown'),
    datasets: [{
      label: 'Deteksi',
      data: top.map(d => d.total),
      backgroundColor: '#10b981',
      borderRadius: 8
    }]
  }
})

const feedbackChartData = computed(() => {
  const dist = adminStore.feedbackDistribution || []
  return {
    labels: dist.map(f => `Rating ${f.rating}`),
    datasets: [{
      data: dist.map(f => f.total),
      backgroundColor: ['#10b981', '#fbbf24', '#f87171', '#60a5fa', '#a78bfa'],
      hoverOffset: 4
    }]
  }
})

onMounted(async () => {
  try {
    await Promise.all([
      adminStore.fetchQuickStats(),
      adminStore.fetchDiagnosisStats()
    ])
  } catch (err) {
    console.error('Gagal memuat statistik dashboard', err)
  }
})
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-subtle);
  min-height: 100vh;
}
</style>


