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

    <div class="mb-10">
      <h1 class="text-3xl font-black text-slate-800 mb-2">Komentar Feedback Pengguna</h1>
      <p class="text-slate-500 font-medium max-w-3xl">
        Kumpulan komentar terbaru dari pengguna untuk evaluasi kualitas hasil diagnosis dan peningkatan berkelanjutan basis pengetahuan sistem pakar.
      </p>
    </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-6">
        
        <!-- Left Column: Chart & Summary -->
        <div class="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8">
          <div class="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 sm:p-8 shadow-sm">
            <h3 class="text-sm font-bold text-slate-700 mb-6 flex items-center gap-2">
              <span class="w-2 h-2 bg-amber-500 rounded-full"></span>
              Tingkat Kepuasan / Akurasi Sistem
            </h3>
            <div class="h-64 flex items-center justify-center chart-wrap">
              <Doughnut v-if="feedbackChartData.labels.length" :data="feedbackChartData" :options="chartOptions" />
              <div v-else class="text-slate-300 text-xs italic">Belum ada feedback terkumpul</div>
            </div>
            <div v-if="feedbackSummary.length" class="mt-8 flex flex-col gap-3">
              <p class="text-[10.5px] text-slate-500 font-bold px-2 mb-0.5 uppercase tracking-wider">
                Total Feedback: {{ totalFeedbackCount }}
              </p>
              <div
                v-for="item in feedbackSummary"
                :key="item.key"
                class="rounded-xl border transition-colors shadow-sm bg-white"
                :class="feedbackItemClass(item.key)"
                style="padding: 11px 15px;"
              >
                <div class="flex items-center justify-between gap-4">
                  <div class="flex-1">
                    <div class="text-[12px] font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                      <span class="text-[14px]">{{ item.icon }}</span> 
                      <span>{{ item.label }}</span>
                    </div>
                    <p class="text-[11px] text-slate-500 leading-snug max-w-[92%] m-0">{{ item.description }}</p>
                  </div>
                  <div class="text-[1.35rem] font-black text-slate-700 tabular-nums self-center" style="margin-left: 8px; margin-right: 2px;">
                    {{ item.total }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: Comments & Evaluation -->
        <div class="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
          <div v-if="loading" class="text-sm text-slate-400 italic">Memuat komentar feedback...</div>

          <template v-else>
            <!-- Section 1: Feedback -->
        <div class="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
            Komentar Feedback Pengguna
          </h2>
          <div v-if="feedbackCommentItems.length" class="space-y-5">
            <div
              v-for="item in feedbackCommentItems"
              :key="`feedback-${item.id}`"
              class="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 shadow-sm hover:border-emerald-200 hover:shadow-md transition-all"
            >
              <div class="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap mb-4">
                <div class="flex-1">
                  <div class="text-[14px] font-bold text-slate-800 mb-1">
                    {{ item.user_name }}
                  </div>
                  <div class="text-[11.5px] font-medium text-slate-500 flex items-center gap-1.5 flex-wrap mt-1">
                    <span class="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded-md">Tanaman</span>
                    <span>{{ item.plant_name || 'Tidak diketahui' }}</span>
                    <span v-if="item.disease_name" class="text-slate-300">•</span>
                    <span v-if="item.disease_name">{{ item.disease_name }}</span>
                  </div>
                </div>
                <span class="text-[11px] font-bold rounded-full px-3 py-1.5 border shadow-sm shrink-0 whitespace-nowrap" :class="feedbackBadgeClass(item.accuracy)">
                  {{ feedbackText(item.accuracy) }}
                </span>
              </div>
              <div class="bg-white rounded-xl p-4 sm:p-5 border border-slate-100 shadow-sm mb-4">
                <p class="text-[13.5px] text-slate-600 leading-relaxed italic m-0">
                  "{{ getDisplayText(item.comment, `feedback-${item.id}`) }}"
                </p>
                <button
                  v-if="isLongText(item.comment, 220)"
                  @click="toggleExpand(`feedback-${item.id}`)"
                  class="mt-3 text-[12px] font-bold text-emerald-600 hover:text-emerald-700"
                  type="button"
                >
                  {{ isExpanded(`feedback-${item.id}`) ? 'Tampilkan lebih sedikit' : 'Lihat selengkapnya' }}
                </button>
              </div>
              <p class="text-[11px] font-bold text-slate-400 m-0 flex items-center gap-1.5">
                <span class="text-xs">🕒</span> {{ formatFeedbackDate(item.created_at) }}
              </p>
            </div>
          </div>
          <p v-else class="text-slate-400 text-sm italic m-0">Belum ada komentar feedback dari pengguna.</p>
        </div>

        <!-- Section 2: Evaluation Notes -->
        <div class="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 shadow-sm">
          <h2 class="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
            <span class="w-2.5 h-2.5 bg-indigo-500 rounded-full"></span>
            Catatan Evaluasi Diagnosis Pengguna
          </h2>
          <div v-if="evaluationNoteItems.length" class="space-y-5">
            <div
              v-for="item in evaluationNoteItems"
              :key="`notes-${item.id}`"
              class="rounded-2xl border border-slate-100 bg-indigo-50/30 p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
            >
              <div class="flex items-start justify-between gap-4 flex-wrap sm:flex-nowrap mb-4">
                <div class="flex-1">
                  <div class="text-[14px] font-bold text-slate-800 mb-1">
                    {{ item.user_name }}
                  </div>
                  <div class="text-[11.5px] font-medium text-slate-500 flex items-center gap-1.5 flex-wrap mt-1">
                    <span class="text-indigo-700 font-bold bg-indigo-100 px-2 py-0.5 rounded-md">Tanaman</span>
                    <span>{{ item.plant_name || 'Tidak diketahui' }}</span>
                    <span v-if="item.disease_name" class="text-slate-300">•</span>
                    <span v-if="item.disease_name">{{ item.disease_name }}</span>
                  </div>
                </div>
              </div>
              <div class="bg-white rounded-xl p-4 sm:p-5 border border-indigo-100/60 shadow-sm mb-4">
                <p class="text-[13.5px] text-slate-600 leading-relaxed italic m-0">
                  "{{ getDisplayText(item.user_notes, `notes-${item.id}`) }}"
                </p>
                <button
                  v-if="isLongText(item.user_notes, 220)"
                  @click="toggleExpand(`notes-${item.id}`)"
                  class="mt-3 text-[12px] font-bold text-indigo-600 hover:text-indigo-700"
                  type="button"
                >
                  {{ isExpanded(`notes-${item.id}`) ? 'Tampilkan lebih sedikit' : 'Lihat selengkapnya' }}
                </button>
              </div>
              <p class="text-[11px] font-bold text-slate-400 m-0 flex items-center gap-1.5">
                <span class="text-xs">🕒</span> {{ formatFeedbackDate(item.created_at) }}
              </p>
            </div>
          </div>
          <p v-else class="text-slate-400 text-sm italic m-0">Belum ada catatan evaluasi dari pengguna.</p>
        </div>
      </template>
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
const expandedItems = ref({})
const recentFeedbacks = computed(() => adminStore.recentFeedbacks || [])
const recentEvaluationNotes = computed(() => adminStore.recentEvaluationNotes || [])
const feedbackDistribution = computed(() => adminStore.feedbackDistribution || [])
const feedbackCommentItems = computed(() =>
  recentFeedbacks.value.filter((item) => item?.comment && String(item.comment).trim().length > 0)
)
const evaluationNoteItems = computed(() =>
  recentEvaluationNotes.value.filter((item) => item?.user_notes && String(item.user_notes).trim().length > 0)
)

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

const truncateComment = (comment, limit = 400) => {
  if (!comment) return '-'
  return comment.length > limit ? `${comment.slice(0, limit)}...` : comment
}

const isExpanded = (key) => !!expandedItems.value[key]

const toggleExpand = (key) => {
  expandedItems.value[key] = !expandedItems.value[key]
}

const isLongText = (text, limit = 220) => {
  if (!text) return false
  return String(text).length > limit
}

const getDisplayText = (text, key, limit = 220) => {
  if (!text) return '-'
  return isExpanded(key) ? String(text) : truncateComment(String(text), limit)
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
  width: 100%;
  margin: 0;
  padding: 2rem 4rem;
  background: var(--bg-subtle);
  min-height: 100vh;
}

.chart-wrap {
  max-width: 420px;
  margin: 0 auto;
}
</style>
