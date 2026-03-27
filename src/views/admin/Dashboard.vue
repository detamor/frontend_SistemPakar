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
    
    <!-- Quick Links -->
    <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200/50 mb-8">
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
        <router-link to="/admin/diseases" class="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center">
          <div class="mb-2 group-hover:scale-110 transition-transform flex items-center justify-center gap-1">
            <span class="text-[1.15rem]">📊</span>
            <span class="text-[1.15rem]">🦠</span>
            <span class="text-[1.15rem]">🔍</span>
          </div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Table CF</p>
          <p class="text-[10px] font-semibold text-slate-500 mt-1">CRUD penyakit dan gejala</p>
        </router-link>
        <router-link to="/admin/cf-levels" class="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">📊</div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Bobot CF</p>
        </router-link>
        <router-link to="/admin/feedback-comments" class="group bg-white p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-center">
          <div class="text-2xl mb-2 group-hover:scale-110 transition-transform">🗒️</div>
          <p class="text-[11px] font-bold text-slate-600 uppercase tracking-tight">Feedback</p>
        </router-link>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Ringkasan basis pengetahuan (dari database) -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="text-sm font-bold text-slate-700 mb-5 flex items-center gap-2">
          <span class="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Ringkasan Sistem
        </h3>
        <div class="flex justify-center mb-5">
          <div class="grid grid-cols-2 gap-3 w-full max-w-[560px]">
            <div
              v-for="stat in systemStats"
              :key="stat.label"
              class="w-full h-32 flex flex-col items-center justify-center text-center p-2 rounded-md bg-slate-50 border border-slate-200"
            >
              <span class="block text-2xl font-black text-emerald-600 leading-none mb-1">{{ stat.num }}</span>
              <span class="text-[11px] font-semibold text-slate-500">{{ stat.label }}</span>
            </div>
          </div>
        </div>
        <div class="h-px bg-slate-100 my-5"></div>
        <div class="flex justify-center mt-6">
          <div class="w-44 h-44 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center text-center">
            <div class="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-3">🩺</div>
            <p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Jumlah Diagnosis</p>
            <p class="text-3xl font-black text-slate-800 leading-none">{{ quickStats.totalDiagnoses || 0 }}</p>
          </div>
        </div>
      </div>

      <!-- Feedback Distribution -->
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h3 class="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
          <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
          Tingkat Kepuasan / Akurasi Sistem
        </h3>
        <div class="h-64 flex items-center justify-center chart-wrap">
          <Doughnut v-if="feedbackChartData.labels.length" :data="feedbackChartData" :options="chartOptions" />
          <div v-else class="text-slate-300 text-xs italic">Belum ada feedback terkumpul</div>
        </div>
        <div v-if="feedbackSummary.length" class="mt-5 border-t border-slate-100 pt-4 space-y-2">
          <p class="text-xs text-slate-500 font-semibold">
            Total feedback: {{ totalFeedbackCount }}
          </p>
          <div
            v-for="item in feedbackSummary"
            :key="item.key"
            class="rounded-xl border px-4 py-3 transition-colors"
            :class="feedbackItemClass(item.key)"
          >
            <div class="grid grid-cols-[1fr_auto] items-center gap-3">
              <div>
                <div class="text-sm font-semibold text-slate-700 mb-1">
                  <span>{{ item.icon }} {{ item.label }}</span>
                </div>
                <p class="text-xs text-slate-500 mt-1">{{ item.description }}</p>
              </div>
              <span class="text-xl font-black text-slate-800 tabular-nums leading-none self-center mr-2">
                {{ item.total }}
              </span>
            </div>
          </div>
        </div>
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
      description: 'Pengguna menilai hasil diagnosis sudah sesuai.'
    },
    somewhat_accurate: {
      icon: '😐',
      label: 'Cukup Akurat',
      description: 'Hasil cukup membantu, tetapi masih perlu perbaikan.'
    },
    inaccurate: {
      icon: '😞',
      label: 'Tidak Akurat',
      description: 'Hasil belum sesuai dan perlu evaluasi basis pengetahuan.'
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

const feedbackItemClass = (key) => {
  if (key === 'accurate') return 'border-emerald-100 bg-emerald-50/60'
  if (key === 'somewhat_accurate') return 'border-amber-100 bg-amber-50/60'
  if (key === 'inaccurate') return 'border-rose-100 bg-rose-50/60'
  return 'border-slate-100 bg-slate-50'
}

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
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background: var(--bg-subtle);
  min-height: 100vh;
}

.chart-wrap {
  max-width: 420px;
  margin: 0 auto;
}
</style>


