<template>
  <div class="feedback-comments-page">
    <div class="mb-6 flex justify-between items-center">
      <router-link
        to="/admin"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
      >
        <span>←</span>
        <span>Kembali ke Dashboard</span>
      </router-link>
      <div class="text-xs text-slate-400 font-medium">
        Terakhir diperbarui: {{ lastUpdate }}
      </div>
    </div>

    <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <h1 class="text-xl font-black text-slate-800 mb-1">Komentar Feedback Pengguna</h1>
      <p class="text-sm text-slate-500 mb-5">
        Kumpulan komentar terbaru dari pengguna untuk evaluasi kualitas hasil diagnosis.
      </p>

      <div class="mb-6 flex justify-center">
        <div class="bg-white rounded-2xl border border-slate-100 w-full max-w-2xl">
          <h3 class="text-sm font-bold text-slate-700 px-4 pt-4 mb-4 flex items-center gap-2">
            <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
            Tingkat Kepuasan / Akurasi Sistem
          </h3>
          <div class="h-64 flex items-center justify-center chart-wrap px-4">
            <Doughnut v-if="feedbackChartData.labels.length" :data="feedbackChartData" :options="chartOptions" />
            <div v-else class="text-slate-300 text-xs italic">Belum ada feedback terkumpul</div>
          </div>
          <div v-if="feedbackSummary.length" class="mt-4 border-t border-slate-100 p-4 space-y-2">
            <p class="text-xs text-slate-500 font-semibold">Total feedback: {{ totalFeedbackCount }}</p>
            <div
              v-for="item in feedbackSummary"
              :key="item.key"
              class="rounded-xl border px-4 py-3 transition-colors overflow-hidden"
              :class="feedbackItemClass(item.key)"
            >
              <div class="grid grid-cols-[1fr_auto] items-center gap-3">
                <div>
                  <div class="text-sm font-semibold text-slate-700 mb-1">
                    <span>{{ item.icon }} {{ item.label }}</span>
                  </div>
                  <p class="text-xs text-slate-500 mt-1 mb-0">{{ item.description }}</p>
                </div>
                <span class="text-xl font-black text-slate-800 tabular-nums leading-none self-center mr-2">
                  {{ item.total }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-sm text-slate-400 italic">Memuat komentar feedback...</div>

      <div v-else-if="recentFeedbacks.length" class="space-y-3">
        <div
          v-for="item in recentFeedbacks"
          :key="item.id"
          class="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
        >
          <div class="flex items-center justify-between gap-3 mb-2 flex-wrap">
            <div class="text-sm font-semibold text-slate-800">
              {{ item.user_name }}
              <span class="text-xs font-medium text-slate-500">
                • {{ item.plant_name || 'Tanaman' }}{{ item.disease_name ? ` / ${item.disease_name}` : '' }}
              </span>
            </div>
            <span class="text-[11px] font-semibold rounded-full px-2.5 py-1 border" :class="feedbackBadgeClass(item.accuracy)">
              {{ feedbackText(item.accuracy) }}
            </span>
          </div>
          <p class="text-sm text-slate-600 leading-relaxed m-0">"{{ truncateComment(item.comment) }}"</p>
          <p class="text-[11px] text-slate-400 mt-2 mb-0">{{ formatFeedbackDate(item.created_at) }}</p>
        </div>
      </div>

      <div v-else class="text-slate-400 text-sm italic">
        Belum ada komentar feedback dari pengguna.
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAdminStore } from '../../stores/admin'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)

const adminStore = useAdminStore()
const loading = ref(false)
const lastUpdate = ref(new Date().toLocaleTimeString('id-ID'))
const recentFeedbacks = computed(() => adminStore.recentFeedbacks || [])
const feedbackDistribution = computed(() => adminStore.feedbackDistribution || [])

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  }
}

const feedbackChartData = computed(() => {
  const feedbackLabelMap = {
    accurate: '😊 Akurat',
    somewhat_accurate: '😐 Cukup Akurat',
    inaccurate: '😞 Tidak Akurat'
  }

  return {
    labels: feedbackDistribution.value.map((f) => feedbackLabelMap[f.accuracy] || f.accuracy),
    datasets: [{
      data: feedbackDistribution.value.map((f) => f.total),
      backgroundColor: ['#10b981', '#fbbf24', '#f87171'],
      hoverOffset: 4
    }]
  }
})

const feedbackSummary = computed(() => {
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

  return feedbackDistribution.value.map((item) => {
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
      total: Number(item.total || 0)
    }
  })
})

const totalFeedbackCount = computed(() => {
  return feedbackDistribution.value.reduce((sum, item) => sum + Number(item.total || 0), 0)
})

const feedbackItemClass = (key) => {
  if (key === 'accurate') return 'border-emerald-100 bg-emerald-50/60'
  if (key === 'somewhat_accurate') return 'border-amber-100 bg-amber-50/60'
  if (key === 'inaccurate') return 'border-rose-100 bg-rose-50/60'
  return 'border-slate-100 bg-slate-50'
}

const feedbackText = (accuracy) => {
  if (accuracy === 'accurate') return 'Akurat'
  if (accuracy === 'somewhat_accurate') return 'Cukup Akurat'
  if (accuracy === 'inaccurate') return 'Tidak Akurat'
  return 'Lainnya'
}

const feedbackBadgeClass = (accuracy) => {
  if (accuracy === 'accurate') return 'border-emerald-200 text-emerald-700 bg-emerald-50'
  if (accuracy === 'somewhat_accurate') return 'border-amber-200 text-amber-700 bg-amber-50'
  if (accuracy === 'inaccurate') return 'border-rose-200 text-rose-700 bg-rose-50'
  return 'border-slate-200 text-slate-700 bg-slate-50'
}

const truncateComment = (comment) => {
  if (!comment) return '-'
  return comment.length > 400 ? `${comment.slice(0, 400)}...` : comment
}

const formatFeedbackDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(async () => {
  loading.value = true
  try {
    await adminStore.fetchDiagnosisStats()
    lastUpdate.value = new Date().toLocaleTimeString('id-ID')
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.feedback-comments-page {
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
