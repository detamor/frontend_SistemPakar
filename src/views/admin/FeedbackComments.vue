<template>
  <div class="feedback-comments-page">
    <header class="edu-hero">
      <div class="hero-bg-leaf">🌿</div>
      <div class="hero-bg-leaf hero-bg-leaf--2">🍃</div>
      <div class="page-container header-flex-box">
        <div class="hero-text">
          <span class="hero-eyebrow">Admin Console</span>
          <h1 class="edu-title">Feedback Pengguna</h1>
          <p class="edu-sub">
            Evaluasi kualitas hasil diagnosis dan peningkatan basis pengetahuan sistem pakar.
          </p>
        </div>
        <div class="hero-side-info text-right">
          <div class="text-xs text-emerald-200 font-bold uppercase tracking-widest mb-1">Status Sistem</div>
          <div class="text-sm text-white font-medium">Terakhir diperbarui: {{ lastUpdate }}</div>
        </div>
      </div>
    </header>
    <main class="page-container admin-main-content">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left Column: Chart & Summary -->
        <div class="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-8">
          <div class="rounded-3xl border border-slate-100 bg-slate-50/50 p-6 sm:p-8 shadow-sm">
            <h3 class="card-header-title">
              <span class="indicator bg-amber"></span>
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
          <h3 class="card-header-title">
            <span class="indicator bg-emerald"></span>
            Komentar Feedback Pengguna
          </h3>
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
          <h3 class="card-header-title">
            <span class="indicator bg-indigo"></span>
            Catatan Evaluasi Diagnosis Pengguna
          </h3>
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
    </main>
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
  background-color: #f5f7f4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #1e3a2a;
}

/* --- Hero Section --- */
.edu-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #064e3b 0%, #166534 60%, #15803d 100%);
  padding: 3rem 1.5rem 4.5rem;
  color: white;
  margin-bottom: 0;
}

.hero-bg-leaf {
  position: absolute;
  font-size: 8rem; opacity: .08;
  top: -1rem; right: -1rem;
  transform: rotate(20deg);
  pointer-events: none;
}
.hero-bg-leaf--2 {
  font-size: 5rem;
  top: auto; bottom: -1.5rem; left: -1rem;
  transform: rotate(-30deg);
}

.page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.header-flex-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
}

@media (max-width: 768px) {
  .header-flex-box { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
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

.hero-eyebrow {
  display: inline-block;
  color: #a7f3c0;
  font-size: .8125rem;
  font-weight: 800;
  letter-spacing: .15em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.edu-title {
  font-family: 'DM Serif Display', serif;
  font-size: 2.75rem;
  font-weight: 400;
  color: #fff;
  line-height: 1.1;
  margin: 0;
}

.edu-sub {
  font-size: 1.0625rem;
  color: rgba(255,255,255,0.7);
  margin-top: 1rem;
  max-width: 600px;
}

.admin-main-content {
  padding: 2rem 1.5rem 6rem; /* Added top padding */
  margin-top: 0; /* Removed negative overlap for cleaner look */
  position: relative;
  z-index: 10;
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
.bg-indigo { background: #6366f1; }

.chart-wrap {
  max-width: 420px;
  margin: 0 auto;
}
</style>
