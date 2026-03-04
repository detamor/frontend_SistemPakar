<template>
  <div style="background:var(--bg-page);min-height:100vh;">
    <!-- Page Header -->
    <div class="sp-page-header" style="padding:calc(64px + 1.75rem) 1.25rem 1.75rem;">
      <div class="page-container" style="max-width:860px;">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem;">
          <div>
            <h1 style="margin:0 0 .25rem;">Riwayat Diagnosis</h1>
            <p style="margin:0;font-size:.9rem;">Semua riwayat diagnosis yang telah Anda lakukan</p>
          </div>
          <RouterLink to="/diagnosis" class="sp-btn sp-btn-primary">
            + Diagnosis Baru
          </RouterLink>
        </div>
      </div>
    </div>

    <!-- Toast / inline notification -->
    <div v-if="toastMsg" class="sp-alert" :class="toastType === 'success' ? 'sp-alert-success' : 'sp-alert-danger'"
      style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;max-width:320px;box-shadow:var(--shadow-lg);">
      {{ toastMsg }}
    </div>

    <!-- Main Content -->
    <div class="page-container" style="max-width:860px;padding-top:2rem;padding-bottom:3rem;">
      <div class="sp-card" style="padding:1.5rem;">
        <!-- Loading -->
        <div v-if="loading && diagnosisHistory.length === 0" class="text-center py-12 text-slate-400">
          <div class="loading-spinner mx-auto mb-4" style="width:32px;height:32px;border-width:4px;"></div>
          <p>Memuat riwayat diagnosis...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="diagnosisHistory.length === 0" class="text-center py-12 space-y-4">
          <div class="text-5xl opacity-50">📝</div>
          <p class="text-slate-400">Belum ada riwayat diagnosis</p>
          <router-link to="/diagnosis" class="glass-btn glass-btn-primary inline-flex">Buat Diagnosis Pertama</router-link>
        </div>

        <!-- History List -->
        <div v-else style="display:flex;flex-direction:column;gap:.875rem;">
          <div v-for="diagnosis in diagnosisHistory" :key="diagnosis.id"
            style="border:1px solid var(--border);border-radius:var(--radius);padding:1.25rem;background:var(--bg-surface);"
          >
            <!-- Header Row -->
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:.75rem;margin-bottom:.875rem;">
              <div>
                <h3 style="font-size:1rem;font-weight:700;color:var(--gray-900);margin:0 0 2px;">{{ diagnosis.plant?.name || 'Tanaman' }}</h3>
                <p style="font-size:.775rem;color:var(--text-muted);margin:0;">{{ formatDate(diagnosis.created_at) }}</p>
              </div>
              <span class="sp-badge"
                :class="{
                  'sp-badge-amber': diagnosis.status === 'pending',
                  'sp-badge-green': diagnosis.status === 'completed',
                  'sp-badge-blue':  diagnosis.status === 'consulted',
                }">{{ getStatusText(diagnosis.status) }}
              </span>
            </div>
            <!-- Result -->
            <div v-if="diagnosis.disease"
              style="padding:.75rem;border-radius:var(--radius-sm);background:var(--bg-subtle);border:1px solid var(--border);margin-bottom:.875rem;"
            >
              <div style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;font-size:.875rem;">
                <span style="color:var(--text-muted);">Hasil:</span>
                <strong style="color:var(--gray-900);">{{ diagnosis.disease.name }}</strong>
                <span style="color:var(--primary);font-weight:700;">({{ (diagnosis.certainty_value * 100).toFixed(1) }}%)</span>
                <span v-if="diagnosis.matched_symptoms_count" style="font-size:.775rem;color:var(--text-muted);">• {{ diagnosis.matched_symptoms_count }} gejala cocok</span>
              </div>
              <p v-if="diagnosis.recommendation" style="font-size:.775rem;color:var(--text-muted);margin-top:.375rem;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">{{ getRecommendationPreview(diagnosis.recommendation) }}</p>
            </div>
            <div v-else style="padding:.75rem;border-radius:var(--radius-sm);background:var(--bg-subtle);margin-bottom:.875rem;font-size:.875rem;color:var(--text-muted);">
              Belum ada hasil diagnosis
              <span v-if="diagnosis.status === 'pending'" style="color:#b45309;"> — Sedang diproses...</span>
            </div>

            <!-- Feedback -->
            <div v-if="diagnosis.disease" class="mb-3">
              <div v-if="!diagnosisFeedbacks[diagnosis.id]" style="display:flex;align-items:center;gap:.5rem;flex-wrap:wrap;">
                <span style="font-size:.775rem;color:var(--text-muted);">Feedback:</span>
                <button v-for="rating in feedbackRatings" :key="rating.value" @click="submitFeedback(diagnosis.id, rating.value)"
                  :disabled="submittingFeedback === diagnosis.id"
                  class="fb-btn"
                  :class="'fb-btn--' + rating.value.replace('_','-')">
                  {{ rating.icon }} {{ rating.label }}
                </button>
              </div>
              <div v-else style="display:flex;align-items:center;gap:.5rem;font-size:.8125rem;">
                <span class="sp-badge" :class="{
                    'sp-badge-green': diagnosisFeedbacks[diagnosis.id].accuracy === 'accurate',
                    'sp-badge-amber': diagnosisFeedbacks[diagnosis.id].accuracy === 'somewhat_accurate',
                    'sp-badge-red':   diagnosisFeedbacks[diagnosis.id].accuracy === 'inaccurate',
                  }">
                  {{ getFeedbackIcon(diagnosisFeedbacks[diagnosis.id].accuracy) }} {{ getFeedbackText(diagnosisFeedbacks[diagnosis.id].accuracy) }}
                </span>
                <button @click="openFeedbackModal(diagnosis)" style="background:none;border:none;cursor:pointer;color:var(--primary);font-size:.8125rem;text-decoration:underline;">Ubah</button>
              </div>
            </div>

            <!-- Actions -->
            <div style="display:flex;gap:.5rem;flex-wrap:wrap;padding-top:.875rem;border-top:1px solid var(--border);margin-top:.875rem;">
              <RouterLink :to="`/diagnosis/${diagnosis.id}`" class="sp-btn sp-btn-primary sp-btn-sm">Lihat Detail</RouterLink>
              <button @click="downloadPdf(diagnosis.id)" :disabled="loading" class="sp-btn sp-btn-secondary sp-btn-sm">📄 Unduh PDF</button>
              <button @click="openConsultationModal(diagnosis)" :disabled="loading" class="sp-btn sp-btn-secondary sp-btn-sm">💬 Konsultasi WA</button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="diagnosisHistory.length > 0" style="display:flex;justify-content:center;align-items:center;gap:1rem;margin-top:1.5rem;">
          <button @click="loadPage(currentPage - 1)" :disabled="currentPage === 1 || loading" class="sp-btn sp-btn-secondary sp-btn-sm">← Sebelumnya</button>
          <span style="font-size:.875rem;color:var(--text-muted);font-weight:500;">Halaman {{ currentPage }}</span>
          <button @click="loadPage(currentPage + 1)" :disabled="!hasNextPage || loading" class="sp-btn sp-btn-secondary sp-btn-sm">Selanjutnya →</button>
        </div>
      </div>

      <!-- Consultation Modal -->
      <ConsultationWhatsAppModal :show="showConsultationModal" :diagnosis="selectedDiagnosis" @close="closeConsultationModal" @success="handleConsultationSuccess" />

      <!-- Feedback Modal -->
      <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showFeedbackModal" style="position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;padding:1.25rem;background:rgba(0,0,0,.45);" @click="closeFeedbackModal">
          <div class="sp-card" style="max-width:460px;width:100%;overflow:hidden;" @click.stop>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:1.125rem 1.5rem;border-bottom:1px solid var(--border);">
              <h3 style="font-size:1.0625rem;margin:0;">Ubah Feedback</h3>
              <button @click="closeFeedbackModal" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;border-radius:6px;">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div style="padding:1.5rem;display:flex;flex-direction:column;gap:1.125rem;">
              <div>
                <label class="sp-label" style="margin-bottom:.625rem;">Rating</label>
                <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
                  <label v-for="rating in feedbackRatings" :key="rating.value" class="fb-modal-option" :class="{ 'fb-modal-option--sel': feedbackForm.accuracy === rating.value }">
                    <input type="radio" :value="rating.value" v-model="feedbackForm.accuracy" class="sr-only" />
                    {{ rating.icon }} {{ rating.label }}
                  </label>
                </div>
              </div>
              <div>
                <label for="comment" class="sp-label">Komentar (Opsional)</label>
                <textarea id="comment" v-model="feedbackForm.comment" placeholder="Bagikan pendapat Anda..." rows="3" class="glass-input" style="resize:vertical;"></textarea>
              </div>
              <div v-if="feedbackError" class="sp-alert sp-alert-danger">{{ feedbackError }}</div>
            </div>
            <div style="display:flex;justify-content:flex-end;gap:.625rem;padding:.875rem 1.5rem;border-top:1px solid var(--border);">
              <button @click="closeFeedbackModal" class="sp-btn sp-btn-secondary">Batal</button>
              <button @click="submitFeedbackForm" :disabled="submittingFeedback" class="sp-btn sp-btn-primary">
                {{ submittingFeedback ? 'Mengirim...' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDiagnosisStore } from '../stores/diagnosis'
import ConsultationWhatsAppModal from '../components/ConsultationWhatsAppModal.vue'

const diagnosisStore = useDiagnosisStore()
const loading = ref(false)
const currentPage = ref(1)
const hasNextPage = ref(false)
const showConsultationModal = ref(false)
const selectedDiagnosis = ref(null)
const diagnosisFeedbacks = ref({})
const submittingFeedback = ref(null)
const showFeedbackModal = ref(false)
const feedbackForm = ref({ diagnosisId: null, accuracy: null, comment: '' })
const feedbackError = ref(null)

const feedbackRatings = [
  { value: 'accurate', label: 'Akurat', icon: '😊', class: 'rating-accurate' },
  { value: 'somewhat_accurate', label: 'Cukup Akurat', icon: '😐', class: 'rating-somewhat' },
  { value: 'inaccurate', label: 'Tidak Akurat', icon: '😞', class: 'rating-inaccurate' }
]

const diagnosisHistory = computed(() => diagnosisStore.diagnosisHistory?.data ? diagnosisStore.diagnosisHistory.data : [])

const loadHistory = async (page = 1) => {
  loading.value = true
  try {
    const response = await diagnosisStore.fetchHistory(page)
    if (response.data && response.data.data) {
      currentPage.value = response.data.current_page || 1
      hasNextPage.value = !!response.data.next_page_url
      
      // Ambil feedback yang sudah di-eager load dari backend
      response.data.data.forEach(d => {
        if (d.feedback) {
          diagnosisFeedbacks.value[d.id] = d.feedback
        }
      })
    }
  } catch (error) { console.error('Error loading history:', error) }
  finally { loading.value = false }
}

const loadPage = (page) => { if (page >= 1) loadHistory(page) }
const downloadPdf = async (id) => { try { await diagnosisStore.downloadPdf(id) } catch (error) { alert('Gagal mengunduh PDF.') } }
const openConsultationModal = (d) => { selectedDiagnosis.value = d; showConsultationModal.value = true }
const closeConsultationModal = () => { showConsultationModal.value = false; selectedDiagnosis.value = null }
const handleConsultationSuccess = () => { loadHistory(currentPage.value) }
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
const getStatusText = (status) => ({ pending: 'Menunggu', completed: 'Selesai', consulted: 'Dikonsultasikan' }[status] || status)
const getRecommendationPreview = (rec) => { if (!rec) return ''; const text = rec.replace(/\*\*/g, '').replace(/\n/g, ' '); return text.length > 150 ? text.substring(0, 150) + '...' : text }

const toastMsg  = ref(null)
const toastType = ref('success')
const showToast = (msg, type = 'success') => {
  toastMsg.value = msg; toastType.value = type
  setTimeout(() => { toastMsg.value = null }, 3000)
}

const submitFeedback = async (diagnosisId, accuracy) => {
  submittingFeedback.value = diagnosisId
  try {
    await diagnosisStore.submitFeedback(diagnosisId, accuracy, null)
    diagnosisFeedbacks.value[diagnosisId] = { accuracy, comment: null }
    showToast('Terima kasih atas feedback Anda!')
  } catch { showToast('Gagal mengirim feedback.', 'error') }
  finally { submittingFeedback.value = null }
}

const openFeedbackModal = (diagnosis) => {
  const existing = diagnosisFeedbacks.value[diagnosis.id]
  feedbackForm.value = { diagnosisId: diagnosis.id, accuracy: existing?.accuracy || null, comment: existing?.comment || '' }
  showFeedbackModal.value = true; feedbackError.value = null
}
const closeFeedbackModal = () => { showFeedbackModal.value = false; feedbackForm.value = { diagnosisId: null, accuracy: null, comment: '' }; feedbackError.value = null }

const submitFeedbackForm = async () => {
  if (!feedbackForm.value.accuracy) { feedbackError.value = 'Pilih rating terlebih dahulu'; return }
  submittingFeedback.value = feedbackForm.value.diagnosisId
  try {
    await diagnosisStore.submitFeedback(feedbackForm.value.diagnosisId, feedbackForm.value.accuracy, feedbackForm.value.comment || null)
    diagnosisFeedbacks.value[feedbackForm.value.diagnosisId] = { accuracy: feedbackForm.value.accuracy, comment: feedbackForm.value.comment }
    closeFeedbackModal(); showToast('Feedback berhasil diperbarui!')
  } catch (error) { feedbackError.value = error.response?.data?.message || 'Gagal mengirim feedback.' }
  finally { submittingFeedback.value = null }
}

const getFeedbackIcon = (accuracy) => ({ accurate: '😊', somewhat_accurate: '😐', inaccurate: '😞' }[accuracy] || '😊')
const getFeedbackText = (accuracy) => ({ accurate: 'Akurat', somewhat_accurate: 'Cukup Akurat', inaccurate: 'Tidak Akurat' }[accuracy] || 'Akurat')

onMounted(() => { loadHistory() })
</script>

<style scoped>
a { text-decoration: none !important; }

.fb-btn { padding: .35rem .75rem; font-size: .775rem; font-weight: 600; border-radius: 9999px; border: 1.5px solid var(--border-strong); background: var(--bg-surface); cursor: pointer; transition: all .15s; font-family: inherit; }
.fb-btn--accurate:hover          { border-color: #16a34a; background: #f0fdf4; color: #15803d; }
.fb-btn--somewhat-accurate:hover { border-color: #d97706; background: #fffbeb; color: #92400e; }
.fb-btn--inaccurate:hover        { border-color: #dc2626; background: #fef2f2; color: #991b1b; }

.fb-modal-option { display:inline-flex;align-items:center;gap:.35rem;padding:.5rem .875rem;font-size:.875rem;font-weight:500;border:1.5px solid var(--border-strong);border-radius:var(--radius);cursor:pointer;transition:all .15s;background:var(--bg-surface);color:var(--gray-700); }
.fb-modal-option:hover { border-color:var(--primary);background:var(--primary-50);color:var(--primary); }
.fb-modal-option--sel  { border-color:var(--primary);background:var(--primary-50);color:var(--primary);font-weight:600; }
</style>
