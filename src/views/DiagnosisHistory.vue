<template>
  <div class="diagnosis-history-page">
    <!-- Page Header (Education Style) -->
    <header class="edu-hero">
      <div class="hero-bg-leaf">🌿</div>
      <div class="hero-bg-leaf hero-bg-leaf--2">🍃</div>
      <div class="page-container">
        <div class="edu-hero-inner">
          <div class="hero-text">
            <span class="hero-eyebrow">Rekam Medis</span>
            <h1 class="edu-title">Riwayat Diagnosis</h1>
            <p class="edu-sub">Pantau dan kelola hasil diagnosis kesehatan tanaman Anda</p>
          </div>
          <RouterLink to="/diagnosis" class="hero-action-btn">
            <span class="btn-icon" style="font-size: 1.25rem; font-weight: 700; line-height: 1;">+</span>
            <span>Diagnosis Baru</span>
          </RouterLink>
        </div>
      </div>
    </header> 

    <!-- Toast notification -->
    <Transition name="toast">
      <div v-if="toastMsg" class="custom-toast" :class="toastType">
        <div class="toast-indicator"></div>
        <div class="toast-body">
          <span class="toast-icon">{{ toastType === 'success' ? '✅' : '⚠️' }}</span>
          <span class="toast-text">{{ toastMsg }}</span>
        </div>
      </div>
    </Transition>

    <!-- Main Content -->
    <main class="history-main">
      <div class="history-container">
        
        <!-- Loading State -->
        <div v-if="loading && diagnosisHistory.length === 0" class="state-container loading-state">
          <div class="modern-loader">
            <div class="loader-circle"></div>
            <div class="loader-circle"></div>
            <div class="loader-circle"></div>
          </div>
          <p>Menyelaraskan riwayat diagnosis...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="diagnosisHistory.length === 0" class="state-container empty-state">
          <div class="empty-illustration">
            <div class="illu-circle"></div>
            <span class="illu-emoji">🌿</span>
          </div>
          <h2 class="empty-title">Belum ada riwayat</h2>
          <p class="empty-desc">Mulai perjalanan sehat tanaman Anda dengan melakukan diagnosis pertama hari ini.</p>
          <router-link to="/diagnosis" class="cta-btn">Buat Diagnosis Pertama</router-link>
        </div>

        <!-- History List (Premium Design) -->
        <TransitionGroup name="list" tag="div" v-else class="history-list">
          <article v-for="diagnosis in diagnosisHistory" :key="diagnosis.id" class="diagnosis-card-v2">
            <!-- Card Header -->
            <div class="card-header">
              <div class="plant-info">
                <div class="plant-avatar">
                  {{ (diagnosis.plant?.name || 'T')[0].toUpperCase() }}
                </div>
                <div class="plant-meta">
                  <h3 class="plant-name">{{ diagnosis.plant?.name || 'Tanaman' }}</h3>
                  <time class="diagnosis-date">{{ formatDate(diagnosis.created_at) }}</time>
                </div>
              </div>
              <div class="status-wrapper">
                <span class="status-badge-v2" :class="diagnosis.status">
                  <span class="dot"></span>
                  {{ getStatusText(diagnosis.status) }}
                </span>
              </div>
            </div>

            <!-- Result Highlight -->
            <div v-if="diagnosis.disease" class="result-highlight">
              <div class="result-top">
                <div class="result-label">Hasil Diagnosis:</div>
                <div class="certainty-score" :class="{ 'high': diagnosis.certainty_value >= 0.7 }">
                  {{ (diagnosis.certainty_value * 100).toFixed(0) }}% <small>pasti</small>
                </div>
              </div>
              <h4 class="disease-name">{{ diagnosis.disease.name }}</h4>
              <div v-if="diagnosis.matched_symptoms_count" class="symptoms-count">
                Terdeteksi melalui <span>{{ diagnosis.matched_symptoms_count }}</span> gejala yang cocok
              </div>
              <p v-if="diagnosis.recommendation" class="result-preview">
                {{ getRecommendationPreview(diagnosis.recommendation) }}
              </p>
            </div>
            
            <div v-else class="result-placeholder" :class="{ 'is-pending': diagnosis.status === 'pending' }">
              <span class="placeholder-icon">{{ diagnosis.status === 'pending' ? '⏳' : '🔍' }}</span>
              <p v-if="diagnosis.status === 'pending'">Sedang dianalisis oleh sistem...</p>
              <p v-else-if="diagnosis.status === 'completed'">
                Tidak ada hipotesis penyakit yang cocok dengan gejala pada basis pengetahuan.
              </p>
              <p v-else>Belum ada hasil diagnosis yang tersedia.</p>
            </div>

            <!-- Interaction Panels -->
            <div class="interaction-grid">
              <!-- Evaluation Notes -->
              <div class="interaction-panel notes-area">
                <div class="panel-header">
                  <span class="panel-icon">📝</span>
                  <span class="panel-title">Catatan Gejala Tambahan</span>
                  <button @click="openNotesModal(diagnosis)" class="panel-action-btn" :disabled="savingNotes === diagnosis.id || deletingNotes === diagnosis.id">
                    {{ diagnosis.user_notes ? 'Ubah' : 'Tambah' }}
                  </button>
                </div>
                <div class="panel-body">
                  <p v-if="diagnosis.user_notes" class="note-text">{{ diagnosis.user_notes }}</p>
                  <p v-else class="note-placeholder">Berikan info tambahan untuk admin...</p>
                </div>
              </div>

              <!-- Feedback Section -->
              <div v-if="diagnosis.disease" class="interaction-panel feedback-area">
                <div v-if="!diagnosisFeedbacks[diagnosis.id]" class="feedback-input">
                  <div class="panel-header">
                    <span class="panel-icon">⭐</span>
                    <span class="panel-title">Beri Penilaian Hasil</span>
                  </div>
                  <div class="feedback-quick-options">
                    <button v-for="rating in feedbackRatings" :key="rating.value" 
                      @click="submitFeedback(diagnosis.id, rating.value)"
                      :disabled="submittingFeedback === diagnosis.id"
                      class="fb-circle-btn" :title="rating.label">
                      {{ rating.icon }}
                    </button>
                  </div>
                </div>
                <div v-else class="feedback-display">
                  <div class="panel-header">
                    <span class="panel-icon">🙌</span>
                    <span class="panel-title">Tanggapan Anda</span>
                    <button @click="openFeedbackModal(diagnosis)" class="panel-action-btn">Ubah</button>
                  </div>
                  <div class="fb-badge-compact" :class="diagnosisFeedbacks[diagnosis.id].accuracy">
                    {{ getFeedbackIcon(diagnosisFeedbacks[diagnosis.id].accuracy) }}
                    {{ getFeedbackText(diagnosisFeedbacks[diagnosis.id].accuracy) }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Footer -->
            <div class="card-footer">
              <RouterLink :to="`/diagnosis/${diagnosis.id}`" class="footer-btn btn-primary-alt">
                <span>Detail</span>
                <span class="icon">→</span>
              </RouterLink>
              <button @click="downloadPdf(diagnosis.id)" :disabled="loading" class="footer-btn btn-outline">
                <span>PDF</span>
                <span class="icon">📄</span>
              </button>
              <button @click="openConsultationModal(diagnosis)" :disabled="loading" class="footer-btn btn-outline">
                <span>WhatsApp</span>
                <span class="icon">💬</span>
              </button>
            </div>
          </article>
        </TransitionGroup>

        <!-- Pagination -->
        <nav v-if="diagnosisHistory.length > 0" class="pagination-container-v2">
          <button @click="loadPage(currentPage - 1)" :disabled="currentPage === 1 || loading" class="nav-page-btn prev">
            <span class="icon">←</span>
            <span>Kembali</span>
          </button>
          <div class="page-indicator">
            Halaman <strong>{{ currentPage }}</strong>
          </div>
          <button @click="loadPage(currentPage + 1)" :disabled="!hasNextPage || loading" class="nav-page-btn next">
            <span>Lanjut</span>
            <span class="icon">→</span>
          </button>
        </nav>
      </div>

      <!-- Consultation Modal -->
      <ConsultationWhatsAppModal :show="showConsultationModal" :diagnosis="selectedDiagnosis" @close="closeConsultationModal" @success="handleConsultationSuccess" />

      <!-- Feedback Modal -->
      <Transition name="modal-fade">
        <div v-if="showFeedbackModal" class="modern-modal-overlay" @click="closeFeedbackModal">
          <div class="modern-modal-card" @click.stop>
            <div class="modal-header-v2">
              <h3>Ubah Feedback</h3>
              <button @click="closeFeedbackModal" class="close-modal-btn">✕</button>
            </div>
            <div class="modal-body-v2">
              <div class="form-group">
                <label class="form-label">Bagaimana menurut Anda?</label>
                <div class="rating-selector-v2">
                  <label v-for="rating in feedbackRatings" :key="rating.value" 
                    class="rating-opt-v2" :class="{ selected: feedbackForm.accuracy === rating.value }">
                    <input type="radio" :value="rating.value" v-model="feedbackForm.accuracy" class="hidden-radio" />
                    <span class="opt-emoji">{{ rating.icon }}</span>
                    <span class="opt-label">{{ rating.label }}</span>
                  </label>
                </div>
              </div>
              <div class="form-group">
                <label for="comment" class="form-label">Komentar Tambahan</label>
                <textarea id="comment" v-model="feedbackForm.comment" placeholder="Ada saran atau masukan?" rows="3" class="modern-textarea"></textarea>
              </div>
              <div v-if="feedbackError" class="modal-alert error">{{ feedbackError }}</div>
            </div>
            <div class="modal-footer-v2">
              <button @click="closeFeedbackModal" class="modal-btn-secondary">Batal</button>
              <button @click="submitFeedbackForm" :disabled="submittingFeedback" class="modal-btn-primary">
                {{ submittingFeedback ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Notes Modal -->
      <Transition name="modal-fade">
        <div v-if="showNotesModal" class="modern-modal-overlay" @click="closeNotesModal">
          <div class="modern-modal-card" @click.stop>
            <div class="modal-header-v2">
              <h3>Catatan Gejala</h3>
              <button @click="closeNotesModal" class="close-modal-btn">✕</button>
            </div>
            <div class="modal-body-v2">
              <div class="info-bubble">
                Info tambahan ini membantu admin mengevaluasi akurasi sistem, terutama untuk gejala yang belum tersedia di daftar.
              </div>
              <div class="form-group mt-4">
                <textarea
                  v-model="notesForm.user_notes"
                  placeholder="Contoh: Muncul bintik hitam kecil di sekitar tepi daun..."
                  rows="5"
                  class="modern-textarea large"
                ></textarea>
              </div>
              <div v-if="notesError" class="modal-alert error">{{ notesError }}</div>
            </div>
            <div class="modal-footer-v2">
              <button v-if="notesForm.hasExisting" @click="deleteNotes" :disabled="deletingNotes === notesForm.diagnosisId || savingNotes === notesForm.diagnosisId" class="modal-btn-danger">
                Hapus
              </button>
              <div class="footer-actions-right">
                <button @click="closeNotesModal" class="modal-btn-secondary">Batal</button>
                <button @click="saveNotes" :disabled="savingNotes === notesForm.diagnosisId || deletingNotes === notesForm.diagnosisId" class="modal-btn-primary">
                  {{ savingNotes === notesForm.diagnosisId ? 'Menyimpan...' : 'Simpan' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDiagnosisStore } from '../stores/diagnosis'
import ConsultationWhatsAppModal from '../components/ConsultationWhatsAppModal.vue'
import { sanitizeRecommendationWording } from '../utils/recommendationText'

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
const showNotesModal = ref(false)
const notesForm = ref({ diagnosisId: null, user_notes: '', hasExisting: false })
const notesError = ref(null)
const savingNotes = ref(null)
const deletingNotes = ref(null)

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

const getRecommendationPreview = (rec) => {
  if (!rec) return ''
  const text = sanitizeRecommendationWording(rec).replace(/\*\*/g, '').replace(/\n/g, ' ')
  return text.length > 150 ? text.substring(0, 150) + '...' : text
}

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

const openNotesModal = (diagnosis) => {
  notesForm.value = {
    diagnosisId: diagnosis.id,
    user_notes: diagnosis.user_notes || '',
    hasExisting: !!diagnosis.user_notes
  }
  notesError.value = null
  showNotesModal.value = true
}

const closeNotesModal = () => {
  showNotesModal.value = false
  notesForm.value = { diagnosisId: null, user_notes: '', hasExisting: false }
  notesError.value = null
}

const normalizeNotes = (value) => {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

const saveNotes = async () => {
  const diagnosisId = notesForm.value.diagnosisId
  const normalized = normalizeNotes(notesForm.value.user_notes)

  if (!diagnosisId) return
  if (!normalized) {
    notesError.value = 'Catatan tidak boleh kosong.'
    return
  }

  savingNotes.value = diagnosisId
  try {
    await diagnosisStore.updateDiagnosisNotes(diagnosisId, normalized)
    const target = diagnosisHistory.value.find(d => d.id === diagnosisId)
    if (target) target.user_notes = normalized
    showToast('Catatan evaluasi berhasil disimpan!')
    closeNotesModal()
  } catch (error) {
    notesError.value = error.response?.data?.message || 'Gagal menyimpan catatan.'
  } finally {
    savingNotes.value = null
  }
}

const deleteNotes = async () => {
  const diagnosisId = notesForm.value.diagnosisId
  if (!diagnosisId) return

  deletingNotes.value = diagnosisId
  try {
    await diagnosisStore.deleteDiagnosisNotes(diagnosisId)
    const target = diagnosisHistory.value.find(d => d.id === diagnosisId)
    if (target) target.user_notes = null
    showToast('Catatan evaluasi berhasil dihapus!')
    closeNotesModal()
  } catch (error) {
    notesError.value = error.response?.data?.message || 'Gagal menghapus catatan.'
  } finally {
    deletingNotes.value = null
  }
}

const getFeedbackIcon = (accuracy) => ({ accurate: '😊', somewhat_accurate: '😐', inaccurate: '😞' }[accuracy] || '😊')
const getFeedbackText = (accuracy) => ({ accurate: 'Akurat', somewhat_accurate: 'Cukup Akurat', inaccurate: 'Tidak Akurat' }[accuracy] || 'Akurat')

onMounted(() => { loadHistory() })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');

.diagnosis-history-page {
  background-color: #f5f7f4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #1e3a2a;
}

/* --- Hero Section (Education Theme) --- */
.edu-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 60%, #3a7a50 100%);
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
  max-width: 1100px;
  margin: 0 auto;
}

.edu-hero-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.hero-eyebrow {
  display: inline-block;
  background: rgba(255,255,255,.15);
  color: #a7f3c0;
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: .25rem .75rem;
  border-radius: 999px;
  margin-bottom: .75rem;
}

.edu-title {
  font-family: 'DM Serif Display', serif;
  font-size: 2.75rem;
  font-weight: 400;
  color: #fff;
  margin: 0 0 .5rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.edu-sub {
  font-size: 1rem;
  color: rgba(255,255,255,.75);
  margin: 0;
}

.hero-action-btn {
  display: inline-flex;
  align-items: center;
  gap: .625rem;
  padding: .75rem 1.5rem;
  background: rgba(255,255,255,.12);
  border: 1.5px solid rgba(255,255,255,.25);
  color: #fff;
  border-radius: 12px;
  font-size: .9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all .2s ease;
}

.hero-action-btn:hover {
  background: rgba(255,255,255,.22);
  border-color: rgba(255,255,255,.5);
  transform: translateY(-2px);
}

/* --- Main Content --- */
.history-main {
  max-width: 860px;
  margin: -2.5rem auto 0;
  padding: 0 1.5rem 5rem;
  position: relative;
  z-index: 10;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

/* --- Card Design --- */
.diagnosis-card-v2 {
  background: white;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  border: 1.5px solid #edf2ed;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.diagnosis-card-v2:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(30, 58, 42, 0.08);
  border-color: #3a7a50;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.plant-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.plant-avatar {
  width: 48px;
  height: 48px;
  background: #f0fdf4;
  color: #1a6a3a;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  font-weight: 800;
  font-size: 1.5rem;
  border: 1px solid #dcfce7;
}

.plant-name {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  color: #1e3a2a;
}

.diagnosis-date {
  font-size: 0.8125rem;
  color: #6a8a72;
}

/* --- Badges --- */
.status-badge-v2 {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.875rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.status-badge-v2.pending { background: #fffbeb; color: #b45309; }
.status-badge-v2.completed { background: #f0fdf4; color: #166534; }
.status-badge-v2.consulted { background: #f0f9ff; color: #075985; }

.status-badge-v2 .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* --- Result Highlight --- */
.result-highlight {
  background: #f8fafc;
  border-radius: 16px;
  padding: 1.25rem;
  border: 1px solid #edf2f7;
  margin-bottom: 1.25rem;
}

.result-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.result-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.certainty-score {
  font-size: 1rem;
  font-weight: 800;
  color: #f59e0b;
}

.certainty-score.high { color: #10b981; }

.certainty-score small {
  font-size: 0.7rem;
  opacity: 0.8;
}

.disease-name {
  font-size: 1.25rem;
  font-weight: 800;
  margin: 0 0 0.5rem;
  color: #1a3a2a;
}

.symptoms-count {
  font-size: 0.8125rem;
  color: #6a8a72;
  margin-bottom: 0.75rem;
}

.symptoms-count span {
  font-weight: 700;
  color: #1e3a2a;
}

.result-preview {
  font-size: 0.875rem;
  line-height: 1.6;
  color: #4b6a55;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.result-placeholder {
  background: #f8fbf9;
  border: 1.5px dashed #d9e4d4;
  border-radius: 16px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1.25rem;
  color: #6a8a72;
}

.result-placeholder.is-pending {
  background: #fffdf5;
  border-style: solid;
  border-color: #fef3c7;
  color: #b45309;
}

.placeholder-icon {
  font-size: 1.5rem;
  display: block;
  margin-bottom: 0.5rem;
}

/* --- Interaction Panels --- */
.interaction-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

@media (max-width: 640px) {
  .interaction-grid { grid-template-columns: 1fr; }
}

.interaction-panel {
  background: #fff;
  border: 1.5px solid #edf2ed;
  border-radius: 12px;
  padding: 1rem;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.panel-icon { font-size: 1rem; }

.panel-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #9aad9a;
  text-transform: uppercase;
  flex: 1;
}

.panel-action-btn {
  background: #f1f5f1;
  border: none;
  font-size: 0.7rem;
  font-weight: 700;
  color: #4b6a55;
  padding: 0.3rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.panel-action-btn:hover { background: #e2e8e2; color: #1e3a2a; }

.note-text {
  font-size: 0.8125rem;
  color: #334e3d;
  margin: 0;
  line-height: 1.5;
}

.note-placeholder {
  font-size: 0.8125rem;
  color: #adbcaa;
  font-style: italic;
  margin: 0;
}

/* --- Feedback Styling --- */
.feedback-quick-options {
  display: flex;
  gap: 0.625rem;
}

.fb-circle-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  border: 1.5px solid #edf2ed;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.fb-circle-btn:hover {
  transform: scale(1.15) rotate(5deg);
  border-color: #3a7a50;
  background: #f0fdf4;
}

.fb-badge-compact {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.3rem 0.625rem;
  border-radius: 8px;
}

.fb-badge-compact.accurate { color: #059669; background: #ecfdf5; }
.fb-badge-compact.somewhat_accurate { color: #d97706; background: #fffbeb; }
.fb-badge-compact.inaccurate { color: #dc2626; background: #fef2f2; }

/* --- Footer Buttons --- */
.card-footer {
  display: flex;
  gap: 0.75rem;
  padding-top: 1.25rem;
  border-top: 1px solid #edf2ed;
}

.footer-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem;
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1.5px solid transparent;
}

.btn-primary-alt {
  background: #1a3a2a;
  color: white;
  text-decoration: none;
}

.btn-primary-alt:hover { background: #2d5a3d; transform: scale(1.02); }

.btn-outline {
  background: white;
  border-color: #d9e4d4;
  color: #4b6a55;
}

.btn-outline:hover {
  border-color: #3a7a50;
  color: #3a7a50;
  background: #f0fdf4;
}

/* --- Pagination --- */
.pagination-container-v2 {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3.5rem;
}

.nav-page-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 1px solid #d9e4d4;
  background: white;
  font-weight: 700;
  font-size: 0.875rem;
  color: #4b6a55;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.nav-page-btn:not(:disabled):hover {
  border-color: #1a3a2a;
  color: #1a3a2a;
  background: #f5f7f4;
}

.nav-page-btn:disabled { opacity: 0.4; cursor: not-allowed; }

.page-indicator { font-size: 0.875rem; color: #6a8a72; }
.page-indicator strong { color: #1e3a2a; font-size: 1rem; }

/* --- Transitions --- */
.list-enter-active, .list-leave-active { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateY(24px); }

/* --- Loading State --- */
.state-container {
  padding: 4.5rem 1.5rem;
  text-align: center;
  background: white;
  border-radius: 24px;
  border: 1.5px solid #edf2ed;
}

.modern-loader {
  display: flex;
  justify-content: center;
  gap: 0.625rem;
  margin-bottom: 1.5rem;
}

.loader-circle {
  width: 14px;
  height: 14px;
  background: #3a7a50;
  border-radius: 50%;
  animation: loader-bounce 0.6s infinite alternate;
}

.loader-circle:nth-child(2) { animation-delay: 0.15s; }
.loader-circle:nth-child(3) { animation-delay: 0.3s; }

@keyframes loader-bounce {
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(-12px); opacity: 0.3; }
}

/* --- Empty State --- */
.empty-illustration {
  position: relative;
  width: 90px;
  height: 90px;
  margin: 0 auto 1.5rem;
}

.illu-circle {
  position: absolute;
  inset: 0;
  background: #dcfce7;
  border-radius: 50%;
  animation: pulse-green 2.5s infinite;
}

.illu-emoji {
  position: relative;
  font-size: 3.5rem;
  line-height: 90px;
}

@keyframes pulse-green {
  0% { transform: scale(1); opacity: 0.6; }
  70% { transform: scale(1.5); opacity: 0; }
  100% { transform: scale(1); opacity: 0; }
}

.empty-title { font-family: 'DM Serif Display', serif; font-size: 1.75rem; color: #1a3a2a; margin-bottom: 0.75rem; }
.empty-desc { color: #6a8a72; max-width: 340px; margin: 0 auto 2.5rem; line-height: 1.6; }

.cta-btn {
  background: #1a3a2a;
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 14px;
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
  box-shadow: 0 4px 12px rgba(26, 58, 42, 0.2);
}

.cta-btn:hover { background: #2d5a3d; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(26, 58, 42, 0.3); }

/* --- Modals --- */
.modern-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  z-index: 1100;
}

.modern-modal-card {
  background: white;
  width: 100%;
  max-width: 520px;
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
  animation: modal-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes modal-pop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-header-v2 {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header-v2 h3 { font-family: 'DM Serif Display', serif; font-size: 1.5rem; color: #1a3a2a; margin: 0; }

.close-modal-btn {
  background: #f1f5f1;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6a8a72;
  transition: all 0.2s;
}

.close-modal-btn:hover { background: #1a3a2a; color: white; }

.modal-body-v2 { padding: 2rem; }

.form-group { margin-bottom: 1.5rem; }
.form-label { display: block; font-size: 0.9375rem; font-weight: 700; color: #1e3a2a; margin-bottom: 0.75rem; }

.modern-textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  border-radius: 14px;
  border: 1.5px solid #d9e4d4;
  font-family: inherit;
  font-size: 0.9375rem;
  transition: all 0.2s;
  background: #fdfdfd;
}

.modern-textarea:focus { outline: none; border-color: #3a7a50; box-shadow: 0 0 0 4px rgba(58, 122, 80, 0.1); background: white; }

.rating-selector-v2 { display: flex; gap: 0.75rem; }
.rating-opt-v2 {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.5rem;
  border-radius: 16px;
  border: 1.5px solid #edf2ed;
  cursor: pointer;
  transition: all 0.2s ease;
}

.rating-opt-v2.selected { border-color: #3a7a50; background: #f0fdf4; }
.opt-emoji { font-size: 1.75rem; margin-bottom: 0.5rem; }
.opt-label { font-size: 0.75rem; font-weight: 700; color: #6a8a72; text-align: center; }
.rating-opt-v2.selected .opt-label { color: #1a6a3a; }

.modal-footer-v2 {
  padding: 1.25rem 2rem;
  background: #f8faf9;
  display: flex;
  justify-content: flex-end;
  gap: 0.875rem;
  border-top: 1px solid #edf2ed;
}

.modal-btn-primary {
  background: #1a3a2a;
  color: white;
  border: none;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.modal-btn-primary:hover { background: #2d5a3d; }
.modal-btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

.modal-btn-secondary {
  background: white;
  border: 1.5px solid #d9e4d4;
  color: #4b6a55;
  padding: 0.875rem 1.5rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.modal-btn-secondary:hover { border-color: #1a3a2a; color: #1a3a2a; }

.modal-btn-danger {
  background: #fef2f2;
  color: #dc2626;
  border: 1.5px solid #fee2e2;
  padding: 0.875rem 1.25rem;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}
.modal-btn-danger:hover { background: #fee2e2; border-color: #fecaca; }

.footer-actions-right { display: flex; gap: 0.875rem; margin-left: auto; }

.hidden-radio { display: none; }

.info-bubble {
  background: #ecfdf5;
  color: #065f46;
  padding: 1.25rem;
  border-radius: 14px;
  font-size: 0.875rem;
  line-height: 1.6;
  border-left: 4px solid #10b981;
}

.modal-alert {
  padding: 1rem;
  border-radius: 10px;
  font-size: 0.875rem;
  margin-top: 1rem;
}
.modal-alert.error { background: #fef2f2; color: #991b1b; border: 1px solid #fee2e2; }

/* Toast Notification */
.custom-toast {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 10000;
  background: white;
  border-radius: 18px;
  box-shadow: 0 25px 40px -10px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  display: flex;
  width: 340px;
}

.toast-indicator { width: 8px; background: #3a7a50; }
.custom-toast.error .toast-indicator { background: #dc2626; }

.toast-body { padding: 1.25rem; display: flex; align-items: center; gap: 1rem; }
.toast-icon { font-size: 1.5rem; }
.toast-text { font-size: 0.9375rem; font-weight: 700; color: #1a3a2a; }

.toast-enter-active, .toast-leave-active { transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
.toast-enter-from { opacity: 0; transform: translateX(100px); }
.toast-leave-to { opacity: 0; transform: scale(0.95); transform-origin: right bottom; }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
</style>