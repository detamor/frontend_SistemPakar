<template>
  <div class="diagnosis-detail-page">
    
    <!-- Page Header (Unified Hero Style) -->
    <header class="edu-hero">
      <div class="hero-bg-leaf">🌿</div>
      <div class="hero-bg-leaf hero-bg-leaf--2">🍃</div>
      <div class="page-container">
        
        <div class="edu-hero-inner header-flex-box">
          <div class="hero-text">
            <span class="hero-eyebrow">Diagnosis Insight</span>
            <h1 class="edu-title">Detail Diagnosis</h1>
            <p v-if="diagnosis" class="edu-sub">
              Selesai pada {{ formatDate(diagnosis.created_at) }} <span class="sub-sep">|</span> ID #{{ diagnosis.id }}
            </p>
          </div>

          <div class="hero-side-actions">
            <button v-if="diagnosis" @click="downloadPdf" class="hero-action-btn pdf-btn">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
              </svg>
              <span>Unduh PDF</span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="page-container detail-main-content">
      
      <!-- Loading -->
      <div v-if="loading" class="sp-card loading-card">
        <div class="sp-spinner"></div>
        <p>Memuat detail diagnosis...</p>
      </div>

      <div v-else-if="diagnosis" class="diagnosis-content-grid">

        <!-- Tanpa hipotesis: pending / tidak ada kecocokan aturan -->
        <div
          v-if="diagnosis && topTierDiagnoses.length === 0"
          class="sp-card no-disease-result-card"
        >
          <header class="card-head">
            <span class="head-icon icon-amber">⚠️</span>
            <h2 class="head-title">
              {{ diagnosis.status === 'pending' ? 'Hasil Belum Siap' : 'Tidak Ada Hipotesis Penyakit' }}
            </h2>
          </header>
          <div class="no-disease-body">
            <template v-if="diagnosis.status === 'pending'">
              <p class="no-disease-lead">
                Diagnosis ini masih diproses oleh mesin sistem pakar. Jika halaman ini tidak berubah setelah beberapa saat,
                pastikan layanan Python engine berjalan lalu muat ulang halaman.
              </p>
            </template>
            <template v-else-if="diagnosis.status === 'completed'">
              <p class="no-disease-lead">
                <strong>Tidak ada penyakit dalam basis pengetahuan yang cocok</strong> dengan gejala yang Anda pilih untuk tanaman ini,
                sehingga tidak ada nilai CF yang dihitung.
              </p>
              <p class="no-disease-detail">
                Persentase pada daftar gejala adalah tingkat keyakinan <em>Anda</em> per gejala, bukan hasil diagnosis akhir.
                Coba tambahkan atau ubah gejala, atau konsultasikan dengan pakar.
              </p>
              <p v-if="diagnosis.recommendation" class="no-disease-rec" v-html="formatRecommendation(diagnosis.recommendation)"></p>
            </template>
            <template v-else>
              <p class="no-disease-lead">
                Hasil diagnosis utama belum tersedia. Periksa status diagnosis atau coba buka ulang halaman ini.
              </p>
            </template>
          </div>
        </div>

        <!-- Hasil utama: satu hipotesis atau lebih dari satu hipotesis dengan CF tertinggi sama -->
        <div v-else-if="diagnosis && topTierDiagnoses.length > 0" class="main-results-column">
          <div v-if="hasTieAtTop" class="tie-top-banner sp-card">
            <span class="tie-top-icon">⚖️</span>
            <div>
              <strong>Lebih dari satu hipotesis tertinggi dengan CF yang sama</strong>
              <p class="tie-top-text">
                Beberapa penyakit berbagi nilai CF tertinggi yang sama. Tiap hipotesis ditampilkan lengkap di bawah: bilah keyakinan, deskripsi, solusi, dan pencegahan.
              </p>
            </div>
          </div>

          <div v-if="isLowConfidence" class="sp-card cf-threshold-warning cf-threshold-warning--standalone" role="alert">
            <strong>Peringatan: keyakinan di bawah 50%</strong>
            <p>
              Nilai CF hipotesis utama masuk kategori <em>diagnosis lemah</em>. Hasil tetap ditampilkan lengkap beserta peringkat lain;
              gunakan sebagai acuan awal dan pertimbangkan gejala tambahan atau konsultasi pakar.
            </p>
          </div>

          <div
            v-for="(tier, tierIdx) in topTierDiagnoses"
            :key="'tier-' + tier.id"
            class="sp-card result-main-card"
            :class="{ 'result-main-card--tied': hasTieAtTop }"
          >
            <header class="card-head">
              <span class="head-icon icon-blue">🔬</span>
              <div class="head-title-wrap">
                <h2 class="head-title">
                  <template v-if="hasTieAtTop">Hipotesis utama ({{ tierIdx + 1 }}/{{ topTierDiagnoses.length }})</template>
                  <template v-else>Hasil Diagnosis Utama</template>
                </h2>
                <p v-if="hasTieAtTop" class="head-sub">{{ tier.name }}</p>
              </div>
            </header>

            <div class="result-display-box">
              <div class="result-header">
                <h3 class="disease-name-highlight">{{ tier.name || 'Penyakit Tidak Diketahui' }}</h3>
                <div class="certainty-indicator">
                  <span class="cf-label">Keyakinan:</span>
                  <span class="cf-pct" :class="getCFClass(tier.certainty_value)">
                    {{ (certaintyNum(tier.certainty_value) * 100).toFixed(1) }}%
                  </span>
                  <span class="cf-badge-v2" :class="getCFBadgeClass(tier.certainty_value)">
                    {{ getCFLabel(tier.certainty_value) }}
                  </span>
                </div>
              </div>

              <div class="cf-progress-container">
                <div class="cf-bar-track">
                  <div
                    class="cf-bar-fill"
                    :class="getCFBarClass(tier.certainty_value)"
                    :style="{ width: Math.min(100, certaintyNum(tier.certainty_value) * 100) + '%' }"
                  >
                    <div class="bar-glow"></div>
                  </div>
                </div>
                <div class="cf-bar-labels">
                  <span>Rendah</span><span>Sedang</span><span>Tinggi</span>
                </div>
              </div>

              <div class="disease-info-details">
                <div v-if="tier.description" class="info-block">
                  <h4 class="block-title">Deskripsi</h4>
                  <p class="block-text">{{ tier.description }}</p>
                </div>
                <div v-if="tier.cause" class="info-block">
                  <h4 class="block-title accent-amber">Penyebab</h4>
                  <p class="block-text">{{ tier.cause }}</p>
                </div>
                <div v-if="tier.solution" class="info-block">
                  <h4 class="block-title accent-green">Solusi Penanganan</h4>
                  <p class="block-text">{{ tier.solution }}</p>
                </div>
                <div v-if="tier.prevention" class="info-block">
                  <h4 class="block-title accent-blue">Pencegahan Efektif</h4>
                  <p class="block-text">{{ tier.prevention }}</p>
                </div>
              </div>

              <div v-if="tier.matched_symptoms_count" class="match-stat">
                <span class="dot"></span> Berdasarkan pencocokan <strong>{{ tier.matched_symptoms_count }} gejala</strong> spesifik.
              </div>
            </div>
          </div>

          <div v-if="diagnosis.recommendation" class="sp-card premium-recommendation full-width-rec">
            <header class="rec-head">
              <span class="rec-icon">📋</span>
              <h4>Rekomendasi Pintar</h4>
            </header>
            <div class="rec-body" v-html="formatRecommendation(diagnosis.recommendation)"></div>
          </div>
        </div>

        <!-- Sidebar Grid -->
        <div class="details-sidebar">
          
          <!-- Plant Card -->
          <div class="sp-card sidebar-card info-item-card">
            <header class="card-head mini">
              <span class="head-icon icon-green">🌱</span>
              <h2 class="head-title">Tanaman</h2>
            </header>
            <div class="compact-info-grid">
              <div class="info-row">
                <span class="row-label">Jenis</span>
                <span class="row-val">{{ diagnosis.plant?.name || '-' }}</span>
              </div>
              <div class="info-row">
                <span class="row-label">Spesies</span>
                <span class="row-val italic">{{ diagnosis.plant?.scientific_name || '-' }}</span>
              </div>
            </div>
          </div>

          <!-- Relevant Education (Up-selling knowledge) -->
          <div v-if="diagnosis?.plant?.id" class="sp-card sidebar-card relevant-knowledge">
            <header class="card-head mini">
              <span class="head-icon icon-amber">📚</span>
              <h2 class="head-title">Modul Rekomendasi</h2>
            </header>
            <p class="sidebar-help-text">Arahkan ke edukasi sesuai tanaman diagnosis:</p>
            <div class="mini-modules-list">
              <RouterLink
                :to="{ path: '/education', query: { plant_id: String(diagnosis.plant.id) } }"
                class="mini-module-link"
              >
                <div class="module-info">
                  <h4 class="module-title">Optimalisasi {{ diagnosis.plant?.name || 'Tanaman' }}</h4>
                  <span class="module-cat">{{ recommendedEducationSubtext }}</span>
                </div>
              </RouterLink>
            </div>
          </div>

          <!-- Symptoms Used -->
          <div v-if="diagnosis.symptoms && diagnosis.symptoms.length > 0" class="sp-card sidebar-card history-symptoms">
            <header class="card-head mini">
              <span class="head-icon icon-cyan">🩺</span>
              <h2 class="head-title">Gejala Terdeteksi</h2>
            </header>
            <div class="symptom-tag-cloud">
              <div v-for="s in diagnosis.symptoms" :key="s.id" class="symptom-pill">
                <span class="s-code">{{ s.code }}</span>
                <span class="s-desc">{{ s.description }}</span>
                <span class="s-cf">{{ ((s.pivot?.user_cf || s.user_cf || 0) * 100).toFixed(0) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Peringkat semua hipotesis (termasuk CF di bawah 50%) -->
        <div
          v-if="diagnosis.all_possibilities && diagnosis.all_possibilities.length > 0"
          class="sp-card other-possibilities-card full-width"
        >
          <header class="card-head">
            <span class="head-icon icon-amber">📊</span>
            <h2 class="head-title">Peringkat hipotesis (nilai CF hasil perhitungan)</h2>
          </header>
          <p class="possibilities-intro">
            Daftar diurutkan dari CF tertinggi. Angka di bawah 50% tetap ditampilkan sebagai informasi terkait, bukan sebagai “penyakit terkonfirmasi”.
          </p>
          <div class="possibilities-table">
            <div
              v-for="(poss, i) in diagnosis.all_possibilities"
              :key="poss.disease_id + '-' + i"
              class="poss-row"
              :class="{ 'is-primary': isTopTierPossibility(poss), 'cf-under-half': certaintyNum(poss.certainty_value) < 0.5 }"
            >
              <div class="rank">
                #{{ possibilityRanks[i] }}
                <span v-if="isTopTierPossibility(poss)" class="rank-tag">{{ hasTieAtTop ? 'CF tertinggi sama' : 'Utama' }}</span>
              </div>
              <div class="info">
                <h4 class="name">{{ poss.disease_name }}</h4>
                <p v-if="poss.solution" class="sol">{{ truncate(poss.solution, 120) }}</p>
              </div>
              <div class="metrics">
                <span v-if="certaintyNum(poss.certainty_value) < 0.5" class="warn-chip">Di bawah 50%</span>
                <span class="count">{{ poss.matched_count || 0 }} gejala cocok</span>
                <span class="v-pct">{{ (certaintyNum(poss.certainty_value) * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Card -->
        <div class="sp-card notes-card full-width">
          <header class="card-head">
            <span class="head-icon icon-gray">📝</span>
            <h2 class="head-title">Catatan & Evaluasi</h2>
          </header>
          <div class="notes-content">
            <p v-if="diagnosis.user_notes" class="user-note-text">
              "{{ diagnosis.user_notes }}"
            </p>
            <p v-else class="empty-note-text">Belum ada catatan evaluasi untuk diagnosis ini.</p>
            <button @click="openNotesModal" class="btn-note-edit">
              {{ diagnosis.user_notes ? 'Ubah Catatan' : 'Tambah Catatan Baru' }}
            </button>
          </div>
        </div>

        <!-- Feedback Section (Enhanced) -->
        <div v-if="!hasFeedback" class="feedback-activation-box full-width">
          <div v-if="!showFeedbackForm" class="feedback-prompt-card">
            <div class="prompt-icon">💡</div>
            <div class="prompt-text">
              <h3>Bantu Kami Meningkatkan Akurasi</h3>
              <p>Berikan feedback singkat tentang hasil diagnosis ini untuk pengembangan sistem pakar.</p>
            </div>
            <button @click="showFeedbackForm = true" class="btn-feedback-start">Berikan Feedback</button>
          </div>

          <div v-else class="sp-card feedback-form-card">
            <h3 class="form-title">Berikan Feedback Anda</h3>
            <form @submit.prevent="submitFeedbackForm" class="feedback-actual-form">
              <div class="form-group">
                <label class="form-label">Bagaimana Akurasi Hasil Diagnosis? <span class="required">*</span></label>
                <div class="rating-grid">
                  <label v-for="r in feedbackRatings" :key="r.value" class="rating-v2" :class="{ 'selected': feedbackForm.accuracy === r.value }">
                    <input type="radio" :value="r.value" v-model="feedbackForm.accuracy" class="sr-only" required />
                    <span class="r-icon">{{ r.icon }}</span>
                    <span class="r-label">{{ r.label }}</span>
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Komentar Tambahan (Opsional)</label>
                <textarea v-model="feedbackForm.comment" placeholder="Ceritakan pengalaman Anda menggunakan sistem ini..." rows="3" class="modern-textarea"></textarea>
              </div>
              <div v-if="feedbackError" class="error-msg">{{ feedbackError }}</div>
              <div class="form-actions">
                <button type="button" @click="cancelFeedback" :disabled="submittingFeedback" class="btn-cancel">Batal</button>
                <button type="submit" :disabled="submittingFeedback || !feedbackForm.accuracy" class="btn-submit-fb">
                  {{ submittingFeedback ? 'Mengirim...' : 'Kirim Sekarang' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Post Feedback Actions -->
        <div v-if="hasFeedback" class="post-feedback-box full-width">
          <div v-if="feedbackSuccess" class="success-banner animate-bounce-in">
            <span class="success-icon">✨</span>
            <div class="success-msg">
              <h3>Terima Kasih!</h3>
              <p>Feedback Anda telah kami terima dan akan digunakan untuk kalibrasi sistem.</p>
            </div>
          </div>
          <div class="final-actions-grid">
            <button @click="openConsultationModal" class="btn-consult">
              <span class="icon">💬</span> Konsultasi Pakar
            </button>
            <RouterLink to="/diagnosis" class="btn-new-diagnosis">
              <span class="icon">+</span> Diagnosis Baru
            </RouterLink>
          </div>
        </div>

      </div>

      <!-- Not Found -->
      <div v-else class="sp-card empty-state-card">
        <div class="empty-icon">📂</div>
        <h3>Data Tidak Ditemukan</h3>
        <p>Mohon maaf, detail diagnosis yang Anda cari tidak tersedia atau telah dihapus.</p>
      </div>

    </main>

    <!-- Modals -->
    <ConsultationWhatsAppModal :show="showConsultationModal" :diagnosis="diagnosis" @close="closeConsultationModal" @success="handleConsultationSuccess" />

    <Transition name="fade">
      <div v-if="showNotesModal" class="modal-overlay" @click="closeNotesModal">
        <div class="modal-card sp-card" @click.stop>
          <header class="modal-head">
            <h3>Catatan Diagnosis</h3>
            <button @click="closeNotesModal" class="btn-close">×</button>
          </header>
          <div class="modal-body">
            <p class="modal-hint">Catatan Anda membantu admin mengevaluasi akurasi sistem di masa mendatang.</p>
            <textarea v-model="notesForm.user_notes" placeholder="Tuliskan catatan Anda di sini..." rows="5" class="modern-textarea"></textarea>
            <div v-if="notesError" class="error-msg">{{ notesError }}</div>
          </div>
          <footer class="modal-foot">
            <button v-if="hasExistingNotes" @click="deleteNotes" :disabled="deletingNotes" class="btn-danger-text">Hapus Catatan</button>
            <div class="foot-right">
              <button @click="closeNotesModal" class="btn-cancel">Batal</button>
              <button @click="saveNotes" :disabled="savingNotes" class="btn-save">{{ savingNotes ? 'Menyimpan...' : 'Simpan' }}</button>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDiagnosisStore } from '../stores/diagnosis'
import { useEducationStore } from '../stores/education'
import ConsultationWhatsAppModal from '../components/ConsultationWhatsAppModal.vue'
import { sanitizeRecommendationWording } from '../utils/recommendationText'

const route = useRoute()
const diagnosisStore = useDiagnosisStore()
const educationStore = useEducationStore()

const loading = ref(true)
const showConsultationModal = ref(false)
const hasFeedback = ref(false)
const showFeedbackForm = ref(false)
const submittingFeedback = ref(false)
const feedbackError = ref(null)
const feedbackSuccess = ref(false)
const feedbackForm = ref({ accuracy: null, comment: '' })
const recommendedModuleCount = ref(null)
const showNotesModal = ref(false)
const notesForm = ref({ user_notes: '' })
const notesError = ref(null)
const savingNotes = ref(false)
const deletingNotes = ref(false)

const feedbackRatings = [
  { value: 'accurate',         label: 'Akurat',       icon: '😊' },
  { value: 'somewhat_accurate', label: 'Cukup Akurat', icon: '😐' },
  { value: 'inaccurate',       label: 'Tidak Akurat',  icon: '😞' },
]

const diagnosis = computed(() => {
  const d = diagnosisStore.currentDiagnosis
  if (!d) return null
  if (d.diagnosis) {
    return {
      ...d.diagnosis,
      plant: d.plant,
      disease: d.disease,
      symptoms: d.symptoms,
      certainty_value: d.certainty_value,
      recommendation: d.recommendation,
      all_possibilities: d.all_possibilities,
      matched_symptoms_count: d.matched_symptoms_count,
      tied_diseases: d.tied_diseases
    }
  }
  return d
})

/** CF dari API bisa string desimal */
const certaintyNum = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

const topTierDiagnoses = computed(() => {
  const d = diagnosis.value
  if (!d) return []
  if (Array.isArray(d.tied_diseases) && d.tied_diseases.length > 0) {
    return d.tied_diseases.map((t) => ({
      id: t.id,
      name: t.name,
      code: t.code,
      description: t.description || '',
      cause: t.cause || '',
      solution: t.solution || '',
      prevention: t.prevention || '',
      certainty_value: certaintyNum(t.certainty_value),
      matched_symptoms_count: t.matched_symptoms_count ?? 0
    }))
  }
  if (d.disease?.id) {
    const dis = d.disease
    return [{
      id: dis.id,
      name: dis.name,
      code: dis.code,
      description: dis.description || '',
      cause: dis.cause || '',
      solution: dis.solution || '',
      prevention: dis.prevention || '',
      certainty_value: certaintyNum(d.certainty_value),
      matched_symptoms_count: d.matched_symptoms_count ?? 0
    }]
  }
  return []
})

const hasTieAtTop = computed(() => topTierDiagnoses.value.length > 1)

const isTopTierPossibility = (poss) => {
  const arr = diagnosis.value?.all_possibilities
  if (!arr?.length) return false
  const maxCf = Math.max(...arr.map((r) => certaintyNum(r.certainty_value)))
  return Math.abs(certaintyNum(poss.certainty_value) - maxCf) < 0.0001
}

const possibilityRanks = computed(() => {
  const arr = diagnosis.value?.all_possibilities || []
  const ranks = []
  let lastCf = null
  let currentRank = 0
  const eps = 1e-4
  for (let i = 0; i < arr.length; i++) {
    const cf = certaintyNum(arr[i]?.certainty_value)
    if (lastCf === null || Math.abs(cf - lastCf) > eps) {
      currentRank = i + 1
      lastCf = cf
    }
    ranks[i] = currentRank
  }
  return ranks
})

const recommendedEducationSubtext = computed(() => {
  const plantName = diagnosis.value?.plant?.name
  if (typeof plantName !== 'string' || plantName.trim() === '') return 'Pilih tanaman untuk melihat edukasi'
  if (recommendedModuleCount.value === null) return 'Memuat modul...'
  if (recommendedModuleCount.value <= 0) return `Belum ada modul untuk ${plantName}`
  return `${recommendedModuleCount.value} modul untuk ${plantName}`
})

const loadDetail = async () => {
  loading.value = true
  try {
    const res = await diagnosisStore.fetchDetail(route.params.id)
    if (res.success && res.data) {
      const d = res.data
      if (d.feedback) {
        hasFeedback.value = true
        feedbackForm.value.accuracy = d.feedback.accuracy
        feedbackForm.value.comment = d.feedback.comment || ''
      }
      
      const plantId = d.plant?.id
      if (plantId) {
        const eduRes = await educationStore.fetchModules({ plantId, page: 1, includeGeneral: false })
        if (eduRes.success && eduRes.data?.data) {
          const total = eduRes.data?.total
          recommendedModuleCount.value = typeof total === 'number' ? total : (eduRes.data.data?.length || 0)
        }
      }
    }
  } catch (e) { console.error('Error loading detail:', e) }
  finally { loading.value = false }
}

const downloadPdf = async () => {
  try { await diagnosisStore.downloadPdf(route.params.id) }
  catch (e) { alert('Gagal mengunduh PDF.') }
}

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })
const formatRecommendation = (t) => {
  if (!t) return ''
  const cleaned = sanitizeRecommendationWording(t)
  return cleaned.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>')
}
const truncate = (s, n) => s && s.length > n ? s.slice(0, n) + '…' : (s || '')

const isLowConfidence = computed(() => {
  const tiers = topTierDiagnoses.value
  if (!tiers.length) return false
  return certaintyNum(tiers[0].certainty_value) < 0.5
})

const getCFLabel = (v) => {
  const x = certaintyNum(v)
  return x >= 0.7 ? 'Kepastian Tinggi' : x >= 0.5 ? 'Kepastian Sedang' : x >= 0.4 ? 'Cukup Rendah' : 'Kepastian Rendah'
}
const getCFClass = (v) => {
  const x = certaintyNum(v)
  return x >= 0.7 ? 'pct-high' : x >= 0.5 ? 'pct-medium' : x >= 0.4 ? 'pct-medium' : 'pct-low'
}
const getCFBadgeClass = (v) => {
  const x = certaintyNum(v)
  return x >= 0.7 ? 'badge-high' : x >= 0.5 ? 'badge-medium' : 'badge-low'
}
const getCFBarClass = (v) => {
  const x = certaintyNum(v)
  return x >= 0.7 ? 'bar-high' : x >= 0.5 ? 'bar-medium' : 'bar-low'
}

const openConsultationModal = () => { showConsultationModal.value = true }
const closeConsultationModal = () => { showConsultationModal.value = false }
const handleConsultationSuccess = () => { closeConsultationModal() }

const submitFeedbackForm = async () => {
  if (!feedbackForm.value.accuracy) { feedbackError.value = 'Pilih rating terlebih dahulu'; return }
  submittingFeedback.value = true; feedbackError.value = null
  try {
    await diagnosisStore.submitFeedback(route.params.id, feedbackForm.value.accuracy, feedbackForm.value.comment || null)
    hasFeedback.value = true; showFeedbackForm.value = false; feedbackSuccess.value = true
    setTimeout(() => { feedbackSuccess.value = false }, 5000)
  } catch (e) {
    feedbackError.value = e.response?.data?.message || 'Gagal mengirim feedback.'
  } finally { submittingFeedback.value = false }
}

const cancelFeedback = () => { showFeedbackForm.value = false; feedbackForm.value = { accuracy: null, comment: '' }; feedbackError.value = null }

const hasExistingNotes = computed(() => !!diagnosis.value?.user_notes)

const applyLocalNotesToStore = (notes) => {
  if (!diagnosisStore.currentDiagnosis) return
  if (diagnosisStore.currentDiagnosis.diagnosis) {
    diagnosisStore.currentDiagnosis.diagnosis.user_notes = notes
    return
  }
  diagnosisStore.currentDiagnosis.user_notes = notes
}

const openNotesModal = () => {
  notesForm.value.user_notes = diagnosis.value?.user_notes || ''
  notesError.value = null
  showNotesModal.value = true
}

const closeNotesModal = () => { showNotesModal.value = false; notesError.value = null }

const saveNotes = async () => {
  const cleaned = notesForm.value.user_notes?.trim()
  if (!cleaned) { notesError.value = 'Catatan tidak boleh kosong.'; return }
  savingNotes.value = true; notesError.value = null
  try {
    await diagnosisStore.updateDiagnosisNotes(route.params.id, cleaned)
    applyLocalNotesToStore(cleaned)
    closeNotesModal()
  } catch (e) {
    notesError.value = e.response?.data?.message || 'Gagal menyimpan catatan.'
  } finally { savingNotes.value = false }
}

const deleteNotes = async () => {
  deletingNotes.value = true; notesError.value = null
  try {
    await diagnosisStore.deleteDiagnosisNotes(route.params.id)
    applyLocalNotesToStore(null)
    closeNotesModal()
  } catch (e) {
    notesError.value = e.response?.data?.message || 'Gagal menghapus catatan.'
  } finally { deletingNotes.value = false }
}

onMounted(() => { loadDetail() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700;800;900&display=swap');

.diagnosis-detail-page {
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
  padding: 3rem 1.5rem 4.5rem; /* Reduced padding */
  color: white;
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
  max-width: 1100px;
  margin: 0 auto;
}

.header-flex-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 2rem;
  width: 100%;
}

@media (max-width: 640px) {
  .header-flex-box {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
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

.hero-action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: #ffffff;
  color: #166534;
  border: none;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
}
.hero-action-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.15); }

.hero-eyebrow {
  display: inline-block;
  color: #a7f3c0;
  font-size: .875rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
}

.edu-title {
  font-family: 'DM Serif Display', serif;
  font-size: 2.5rem; /* Reduced font size */
  font-weight: 400;
  line-height:1; margin: 0;
}

.edu-sub {
  font-size: 1.125rem;
  color: rgba(255,255,255,0.7);
  margin-top: 1.25rem;
}
.sub-sep { margin: 0 0.5rem; opacity: 0.5; }

/* --- Main Layout --- */
.detail-main-content {
  padding: 0 1.5rem 6rem;
  margin-top: -2.5rem; /* Adjusted overlap */
  position: relative;
  z-index: 10;
}

.diagnosis-content-grid {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 1.5rem;
  align-items: start;
}

@media (max-width: 1024px) {
  .diagnosis-content-grid { grid-template-columns: 1fr; }
}

.main-results-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-width: 0;
}
.main-results-column .result-main-card { margin-bottom: 0; }
.tie-top-banner {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  padding: 1.25rem 1.5rem !important;
  border: 1.5px solid #fde68a !important;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%) !important;
  box-shadow: 0 4px 16px rgba(180, 83, 9, 0.06) !important;
}
.tie-top-banner strong { color: #92400e; font-size: 1rem; display: block; }
.tie-top-icon { font-size: 1.75rem; line-height: 1; flex-shrink: 0; }
.tie-top-text { font-size: 0.875rem; color: #78350f; margin: 0.35rem 0 0; line-height: 1.55; }
.head-title-wrap { flex: 1; min-width: 0; }
.head-title-wrap .head-title { margin: 0; }
.head-sub { font-size: 0.875rem; font-weight: 600; color: #6a8a72; margin: 0.35rem 0 0; }
.main-results-column .result-main-card .card-head { align-items: flex-start; }
.result-main-card--tied { border-top: 4px solid #fbbf24; }
.main-results-column .full-width-rec.premium-recommendation { margin-top: 0 !important; }

.full-width { grid-column: 1 / -1; }

.sp-card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px rgba(30,58,42,0.04);
  border: 1.5px solid #edf2ed;
}

.card-head { display: flex; align-items: center; gap: 0.875rem; margin-bottom: 2rem; }
.card-head.mini { margin-bottom: 1.25rem; }
.head-icon { font-size: 1.5rem; }
.head-title { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #1a3a2a; margin: 0; }

.icon-blue { color: #1e3a8a; }
.icon-green { color: #14532d; }
.icon-amber { color: #92400e; }
.icon-cyan { color: #0e7490; }
.icon-gray { color: #4b5563; }

/* --- Tanpa hasil utama (ambang CF / pending) --- */
.no-disease-result-card {
  border: 1.5px solid #fde68a;
  background: linear-gradient(180deg, #fffbeb 0%, #ffffff 55%);
}
.no-disease-body { padding-right: 0.25rem; }
.no-disease-lead {
  font-size: 1rem;
  line-height: 1.75;
  color: #1e3a2a;
  margin: 0 0 1rem;
}
.no-disease-detail {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #4b6a55;
  margin: 0 0 1rem;
}
.no-disease-rec {
  font-size: 0.9375rem;
  line-height: 1.75;
  color: #334e3d;
  margin: 0;
  padding: 1rem 1.25rem;
  background: #f8faf9;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
}

.cf-threshold-warning {
  background: linear-gradient(135deg, #fffbeb, #fef3c7);
  border: 1.5px solid #f59e0b;
  border-radius: 16px;
  padding: 1.125rem 1.25rem;
  margin-bottom: 1.5rem;
  color: #78350f;
}
.cf-threshold-warning strong {
  display: block;
  font-size: 0.9375rem;
  margin-bottom: 0.5rem;
}
.cf-threshold-warning p {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.65;
}
.cf-threshold-warning--standalone { margin-bottom: 0; }

/* --- Result Display --- */
.result-display-box {
  background: #f8faf9;
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid #edf2ed;
}

.disease-name-highlight {
  font-size: 2.25rem;
  font-weight: 800;
  color: #1a3a2a;
  margin: 0 0 1rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.certainty-indicator { display: flex; align-items: center; gap: 0.75rem; }
.cf-label { font-size: 0.875rem; color: #6a8a72; font-weight: 500; }
.cf-pct { font-size: 1.25rem; font-weight: 900; }
.pct-high { color: #15803d; }
.pct-medium { color: #b45309; }
.pct-low { color: #991b1b; }

.cf-badge-v2 {
  font-size: 0.75rem; font-weight: 800; padding: 0.25rem 0.75rem; border-radius: 99px; text-transform: uppercase;
}
.badge-high { background: #dcfce7; color: #15803d; }
.badge-medium { background: #ffedd5; color: #9a3412; }
.badge-low { background: #fef2f2; color: #991b1b; }

/* Progress Bar */
.cf-progress-container { margin: 2rem 0; }
.cf-bar-track { height: 12px; background: #e2e8f0; border-radius: 99px; overflow: hidden; position: relative; }
.cf-bar-fill { height: 100%; border-radius: 99px; position: relative; transition: width 1s cubic-bezier(0.4, 0, 0.2, 1); }
.bar-glow { position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent); animation: sweep 2s infinite; }
.bar-high { background: linear-gradient(90deg, #10b981, #059669); }
.bar-medium { background: linear-gradient(90deg, #fbbf24, #d97706); }
.bar-low { background: linear-gradient(90deg, #f87171, #dc2626); }

@keyframes sweep { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }

.cf-bar-labels { display: flex; justify-content: space-between; font-size: 0.7rem; color: #adbcaa; font-weight: 800; text-transform: uppercase; margin-top: 0.625rem; }

/* Info blocks */
.disease-info-details { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-top: 2.5rem; }
@media (max-width: 640px) { .disease-info-details { grid-template-columns: 1fr; } }

.info-block { margin-bottom: 0.5rem; }
.block-title { font-size: 0.8125rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.625rem; color: #6a8a72; }
.accent-amber { color: #d97706; }
.accent-green { color: #059669; }
.accent-blue { color: #2563eb; }
.block-text { font-size: 0.9375rem; line-height: 1.7; color: #4b6a55; margin: 0; }

/* Recommendation */
.premium-recommendation {
  margin-top: 3rem; background: #fff; border: 1.5px solid #dcfce7; border-radius: 18px; padding: 1.75rem; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.05);
}
.rec-head { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
.rec-icon { font-size: 1.25rem; }
.rec-head h4 { font-size: 1rem; font-weight: 800; color: #14532d; margin: 0; }
.rec-body { font-size: 0.9375rem; line-height: 1.8; color: #334e3d; }

.match-stat { font-size: 0.75rem; color: #adbcaa; margin-top: 1.5rem; display: flex; align-items: center; gap: 0.5rem; }
.match-stat .dot { width: 6px; height: 6px; background: #3a7a50; border-radius: 50%; display: inline-block; }

/* Sidebar items */
.sidebar-card { padding: 1.75rem; margin-bottom: 1.5rem; }
.compact-info-grid { display: flex; flex-direction: column; gap: 1rem; }
.info-row { display: flex; flex-direction: column; }
.row-label { font-size: 0.7rem; font-weight: 800; color: #adbcaa; text-transform: uppercase; margin-bottom: 2px; }
.row-val { font-size: 1rem; font-weight: 700; color: #1a3a2a; }
.row-val.italic { font-style: italic; font-weight: 500; font-size: 0.875rem; color: #6a8a72; }

.sidebar-help-text { font-size: 0.8125rem; color: #6a8a72; margin-bottom: 1.25rem; }
.mini-modules-list { display: flex; flex-direction: column; gap: 1rem; }
.mini-module-link { display: flex; align-items: center; gap: 0.875rem; text-decoration: none; padding: 0.75rem; border-radius: 14px; background: #f8faf9; border: 1px solid transparent; transition: all 0.2s; }
.mini-module-link:hover { background: #fff; border-color: #3a7a50; transform: translateX(5px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.module-thumb { width: 50px; height: 50px; border-radius: 10px; object-fit: cover; }
.module-info { flex: 1; min-width: 0; }
.module-title { font-size: 0.8125rem; font-weight: 800; color: #1a3a2a; margin: 0 0 2px; line-height: 1.3; }
.module-cat { font-size: 0.625rem; font-weight: 700; color: #adbcaa; text-transform: uppercase; }

.symptom-tag-cloud { display: flex; flex-wrap: wrap; gap: 0.625rem; }
.symptom-pill { background: #f8fafc; border: 1px solid #e2e8f0; padding: 0.5rem 0.875rem; border-radius: 12px; display: flex; align-items: center; gap: 0.625rem; }
.s-code { font-size: 0.625rem; font-weight: 900; font-family: monospace; color: #0e7490; background: #e0f2fe; padding: 2px 4px; border-radius: 4px; }
.s-desc { font-size: 0.8125rem; color: #1e293b; font-weight: 600; }
.s-cf { font-size: 0.75rem; color: #64748b; font-weight: 800; margin-left: auto; }

/* Possibilities full width */
.possibilities-intro {
  font-size: 0.875rem;
  line-height: 1.65;
  color: #64748b;
  margin: -0.5rem 0 1.25rem;
}
.possibilities-table { display: flex; flex-direction: column; gap: 0.875rem; }
.poss-row { display: flex; align-items: center; gap: 1.25rem; padding: 1.25rem; background: #f8fafc; border-radius: 18px; border: 1px solid #edf2f7; }
.poss-row.is-primary { border-color: #86efac; background: linear-gradient(135deg, #f0fdf4, #f8fafc); }
.poss-row.cf-under-half { border-left: 4px solid #f59e0b; }
.rank-tag {
  font-size: 0.5625rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #15803d;
  background: #dcfce7;
  padding: 2px 6px;
  border-radius: 6px;
}
.warn-chip {
  font-size: 0.625rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #b45309;
  background: #ffedd5;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
}
.rank {
  min-width: 48px;
  padding: 0.35rem 0.25rem;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.875rem;
  font-weight: 900;
  color: #94a3b8;
  border: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.poss-row .info { flex: 1; min-width: 0; }
.poss-row .name { font-size: 1.125rem; font-weight: 800; color: #1e293b; margin: 0 0 4px; }
.poss-row .sol { font-size: 0.8125rem; color: #64748b; line-height: 1.5; margin: 0; }
.metrics { display: flex; align-items: center; gap: 1rem; flex-shrink: 0; }
.count { font-size: 0.75rem; font-weight: 800; color: #adbcaa; text-transform: uppercase; }
.v-pct { font-size: 1rem; font-weight: 900; color: #2563eb; background: #eff6ff; padding: 0.375rem 0.75rem; border-radius: 10px; }

/* Notes */
.notes-content { display: flex; flex-direction: column; align-items: flex-start; gap: 1.25rem; }
.user-note-text { font-size: 1.125rem; font-style: italic; color: #4b6a55; line-height: 1.8; margin: 0; position: relative; padding-left: 1.5rem; }
.user-note-text::before { content: '“'; position: absolute; left: 0; top: 0; font-size: 3rem; font-family: serif; color: #dcfce7; line-height: 1; }
.empty-note-text { font-size: 0.9375rem; color: #adbcaa; font-style: italic; margin: 0; }
.btn-note-edit { background: #f8faf9; border: 1.5px solid #edf2ed; border-radius: 12px; padding: 0.625rem 1.25rem; font-size: 0.875rem; font-weight: 800; color: #3a7a50; cursor: pointer; transition: all 0.2s; }
.btn-note-edit:hover { background: #3a7a50; color: #fff; border-color: #3a7a50; }

/* Feedback activation box */
.feedback-activation-box { margin-top: 1rem; }
.feedback-prompt-card { background: linear-gradient(135deg, #1e3a2a, #2d5a3d); border-radius: 24px; padding: 2.5rem; display: flex; align-items: center; gap: 2rem; color: white; }
.prompt-icon { font-size: 3.5rem; }
.prompt-text { flex: 1; min-width: 0; }
.prompt-text h3 { font-family: 'DM Serif Display', serif; font-size: 1.75rem; margin: 0 0 0.5rem; }
.prompt-text p { font-size: 1rem; color: rgba(255,255,255,0.8); margin: 0; }
.btn-feedback-start { background: #fff; color: #1e3a2a; border: none; padding: 1rem 2rem; border-radius: 14px; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.2s; white-space: nowrap; }
.btn-feedback-start:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(0,0,0,0.2); }

.feedback-actual-form { display: flex; flex-direction: column; gap: 2rem; padding-top: 1.5rem; }
.form-group { display: flex; flex-direction: column; gap: 0.875rem; }
.form-label { font-size: 0.875rem; font-weight: 800; color: #1e3a2a; }
.required { color: #dc2626; }

.rating-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.rating-v2 { background: #f8faf9; border: 1.5px solid #edf2ed; border-radius: 18px; padding: 1.25rem; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; cursor: pointer; transition: all 0.2s; }
.rating-v2:hover { border-color: #10b981; transform: translateY(-2px); }
.rating-v2.selected { border-color: #10b981; background: #f0fdf4; box-shadow: 0 8px 15px rgba(16, 185, 129, 0.1); }
.rating-v2 .r-icon { font-size: 1.75rem; }
.rating-v2 .r-label { font-size: 0.8125rem; font-weight: 800; color: #1e3a2a; }

.modern-textarea { background: #f8faf9; border: 1.5px solid #edf2ed; border-radius: 16px; padding: 1.25rem; font-family: inherit; font-size: 0.9375rem; width: 100%; transition: all 0.2s; resize: vertical; }
.modern-textarea:focus { outline: none; border-color: #10b981; background: #fff; }

.form-actions { display: flex; justify-content: flex-end; gap: 1rem; }
.btn-cancel { background: none; border: none; font-size: 0.875rem; font-weight: 800; color: #6a8a72; cursor: pointer; padding: 0.75rem 1.5rem; }
.btn-submit-fb { background: #10b981; color: #fff; border: none; padding: 0.875rem 2rem; border-radius: 14px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
.btn-submit-fb:hover:not(:disabled) { background: #059669; transform: translateY(-2px); }

/* Final actions */
.post-feedback-box { margin-top: 2rem; display: flex; flex-direction: column; gap: 2rem; }
.success-banner { background: #f0fdf4; border: 1.5px solid #dcfce7; padding: 1.75rem; border-radius: 20px; display: flex; align-items: center; gap: 1.5rem; }
.success-icon { font-size: 2.5rem; }
.success-msg h3 { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #14532d; margin: 0 0 0.25rem; }
.success-msg p { margin: 0; color: #4b6a55; }

.final-actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
@media (max-width: 768px) { .final-actions-grid { grid-template-columns: 1fr; } }

.btn-consult, .btn-new-diagnosis, .btn-go-history { text-align: center; text-decoration: none; padding: 1.125rem; border-radius: 18px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 0.75rem; border: none; }
.btn-consult { background: #fff; color: #1e293b; border: 1.5px solid #e2e8f0; }
.btn-consult:hover { border-color: #3b82f6; color: #2563eb; }
.btn-new-diagnosis { background: #1e3a2a; color: #fff; }
.btn-new-diagnosis:hover { background: #166534; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
.btn-go-history { background: #f8faf9; color: #4b6a55; border: 1.5px solid #edf2ed; }
.btn-go-history:hover { background: #fff; border-color: #3a7a50; }

/* Modal styles */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.modal-card { max-width: 500px; width: 100%; animation: slide-up 0.3s cubic-bezier(0.4, 0, 0.2, 1); padding: 0 !important; overflow: hidden; }
@keyframes slide-up { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

.modal-head { background: #f8faf9; padding: 1.5rem; border-bottom: 1.5px solid #edf2ed; display: flex; justify-content: space-between; align-items: center; }
.modal-head h3 { font-family: 'DM Serif Display', serif; font-size: 1.375rem; margin: 0; color: #1e3a2a; }
.btn-close { background: none; border: none; font-size: 1.75rem; color: #adbcaa; cursor: pointer; }
.modal-body { padding: 2rem; }
.modal-hint { font-size: 0.8125rem; color: #6a8a72; margin-bottom: 1.5rem; line-height: 1.6; }
.modal-foot { padding: 1.5rem 2rem; background: #f8faf9; border-top: 1.5px solid #edf2ed; display: flex; justify-content: space-between; align-items: center; }
.btn-danger-text { background: none; border: none; color: #ef4444; font-weight: 800; font-size: 0.875rem; cursor: pointer; }
.foot-right { display: flex; gap: 0.75rem; }
.btn-save { background: #1a3a2a; color: #fff; border: none; padding: 0.75rem 1.5rem; border-radius: 12px; font-weight: 800; cursor: pointer; }

/* States */
.loading-card { text-align: center; padding: 5rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.sp-spinner { width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid #10b981; border-radius: 50%; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.empty-state-card { text-align: center; padding: 6rem; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
.empty-icon { font-size: 4rem; }
.btn-go-history-alt { text-decoration: none; background: #1e3a2a; color: #fff; padding: 1rem 2rem; border-radius: 14px; font-weight: 800; }

.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
