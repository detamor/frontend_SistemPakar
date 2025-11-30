<template>
  <div class="history-page">
    <!-- Hero Section -->
    <div class="history-hero">
      <div class="container">
        <!-- Tombol Kembali -->
        <div class="mb-4">
          <router-link
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <span>←</span>
            <span>Kembali ke Home</span>
          </router-link>
        </div>
        <div class="hero-content">
          <div class="hero-icon">📋</div>
          <h1>Riwayat Diagnosis</h1>
          <p class="hero-subtitle">Lihat semua riwayat diagnosis yang telah Anda lakukan</p>
          <router-link to="/diagnosis" class="btn-new-diagnosis">
            <span class="btn-icon">+</span>
            Diagnosis Baru
          </router-link>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <div class="history-container">
        <div v-if="loading && diagnosisHistory.length === 0" class="loading">
          Memuat riwayat diagnosis...
        </div>

        <div v-else-if="diagnosisHistory.length === 0" class="empty-state">
          <p>Belum ada riwayat diagnosis</p>
          <router-link to="/diagnosis" class="btn-primary">
            Buat Diagnosis Pertama
          </router-link>
        </div>

        <div v-else class="history-list">
          <div
            v-for="diagnosis in diagnosisHistory"
            :key="diagnosis.id"
            class="history-item"
          >
            <div class="item-header">
              <div class="item-info">
                <h3>{{ diagnosis.plant?.name || 'Tanaman' }}</h3>
                <p class="item-date">
                  {{ formatDate(diagnosis.created_at) }}
                </p>
              </div>
              <div class="item-status">
                <span :class="['status-badge', getStatusClass(diagnosis.status)]">
                  {{ getStatusText(diagnosis.status) }}
                </span>
              </div>
            </div>

            <div v-if="diagnosis.disease" class="item-result">
              <div class="result-info">
                <span class="result-label">Hasil Diagnosis:</span>
                <span class="result-disease">{{ diagnosis.disease.name }}</span>
                <span class="result-cf">
                  ({{ (diagnosis.certainty_value * 100).toFixed(1) }}%)
                </span>
                <span v-if="diagnosis.matched_symptoms_count" class="result-matched">
                  • {{ diagnosis.matched_symptoms_count }} gejala match
                </span>
              </div>
              <!-- Recommendation Preview -->
              <div v-if="diagnosis.recommendation" class="recommendation-preview">
                <p class="recommendation-text">{{ getRecommendationPreview(diagnosis.recommendation) }}</p>
              </div>
            </div>

            <div v-else class="item-result">
              <span class="no-result">Belum ada hasil diagnosis</span>
              <p v-if="diagnosis.status === 'pending'" class="pending-note">
                Diagnosis sedang diproses. Pastikan Python engine running.
              </p>
            </div>

            <!-- Feedback Section -->
            <div v-if="diagnosis.disease" class="feedback-section">
              <div v-if="!diagnosisFeedbacks[diagnosis.id]" class="feedback-form">
                <h4 class="feedback-title">Bagaimana hasil diagnosis ini?</h4>
                <div class="feedback-rating">
                  <button
                    v-for="rating in feedbackRatings"
                    :key="rating.value"
                    @click="submitFeedback(diagnosis.id, rating.value)"
                    :disabled="submittingFeedback === diagnosis.id"
                    :class="['btn-rating', rating.class]"
                  >
                    <span class="rating-icon">{{ rating.icon }}</span>
                    <span>{{ rating.label }}</span>
                  </button>
                </div>
                <div v-if="submittingFeedback === diagnosis.id" class="feedback-loading">
                  <span class="loading-spinner"></span>
                  <span>Mengirim feedback...</span>
                </div>
              </div>
              <div v-else class="feedback-submitted">
                <div class="feedback-badge" :class="getFeedbackBadgeClass(diagnosisFeedbacks[diagnosis.id].accuracy)">
                  <span class="badge-icon">{{ getFeedbackIcon(diagnosisFeedbacks[diagnosis.id].accuracy) }}</span>
                  <span class="badge-text">{{ getFeedbackText(diagnosisFeedbacks[diagnosis.id].accuracy) }}</span>
                </div>
                <p v-if="diagnosisFeedbacks[diagnosis.id].comment" class="feedback-comment">
                  "{{ diagnosisFeedbacks[diagnosis.id].comment }}"
                </p>
                <button
                  @click="openFeedbackModal(diagnosis)"
                  class="btn-edit-feedback"
                >
                  Ubah Feedback
                </button>
              </div>
            </div>

            <div class="item-actions">
              <router-link
                :to="`/diagnosis/${diagnosis.id}`"
                class="btn-view"
              >
                Lihat Detail
              </router-link>
              <button
                @click="downloadPdf(diagnosis.id)"
                class="btn-download"
                :disabled="loading"
              >
                📄 Download PDF
              </button>
              <button
                @click="openConsultationModal(diagnosis)"
                class="btn-consultation"
                :disabled="loading"
              >
                💬 Konsultasi via WA
              </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="diagnosisHistory.length > 0" class="pagination">
          <button
            @click="loadPage(currentPage - 1)"
            :disabled="currentPage === 1 || loading"
            class="btn-pagination"
          >
            Previous
          </button>
          <span class="page-info">Halaman {{ currentPage }}</span>
          <button
            @click="loadPage(currentPage + 1)"
            :disabled="!hasNextPage || loading"
            class="btn-pagination"
          >
            Next
          </button>
        </div>
      </div>

      <!-- Consultation WhatsApp Modal -->
      <ConsultationWhatsAppModal
        :show="showConsultationModal"
        :diagnosis="selectedDiagnosis"
        @close="closeConsultationModal"
        @success="handleConsultationSuccess"
      />

      <!-- Feedback Modal -->
      <div v-if="showFeedbackModal" class="modal-overlay" @click="closeFeedbackModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Berikan Feedback</h3>
            <button @click="closeFeedbackModal" class="btn-close-modal">×</button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>Rating</label>
              <div class="rating-options">
                <label
                  v-for="rating in feedbackRatings"
                  :key="rating.value"
                  :class="['rating-option', { active: feedbackForm.accuracy === rating.value }]"
                >
                  <input
                    type="radio"
                    :value="rating.value"
                    v-model="feedbackForm.accuracy"
                  />
                  <span class="rating-icon">{{ rating.icon }}</span>
                  <span>{{ rating.label }}</span>
                </label>
              </div>
            </div>
            <div class="form-group">
              <label for="comment">Komentar (Opsional)</label>
              <textarea
                id="comment"
                v-model="feedbackForm.comment"
                placeholder="Bagikan pendapat kamu tentang hasil diagnosis ini..."
                rows="4"
                class="form-textarea"
              ></textarea>
            </div>
            <div v-if="feedbackError" class="error-message">
              {{ feedbackError }}
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeFeedbackModal" class="btn-cancel">Batal</button>
            <button @click="submitFeedbackForm" :disabled="submittingFeedback" class="btn-submit">
              {{ submittingFeedback ? 'Mengirim...' : 'Kirim Feedback' }}
            </button>
          </div>
        </div>
      </div>
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
const feedbackForm = ref({
  diagnosisId: null,
  accuracy: null,
  comment: ''
})
const feedbackError = ref(null)

const feedbackRatings = [
  { value: 'accurate', label: 'Akurat', icon: '😊', class: 'rating-accurate' },
  { value: 'somewhat_accurate', label: 'Cukup Akurat', icon: '😐', class: 'rating-somewhat' },
  { value: 'inaccurate', label: 'Tidak Akurat', icon: '😞', class: 'rating-inaccurate' }
]

const diagnosisHistory = computed(() => {
  if (diagnosisStore.diagnosisHistory?.data) {
    return diagnosisStore.diagnosisHistory.data
  }
  return []
})

const loadHistory = async (page = 1) => {
  loading.value = true
  try {
    const response = await diagnosisStore.fetchHistory(page)
    if (response.data) {
      currentPage.value = response.data.current_page || 1
      hasNextPage.value = !!response.data.next_page_url
      
      // Load feedback untuk setiap diagnosis
      if (response.data.data && Array.isArray(response.data.data)) {
        for (const diagnosis of response.data.data) {
          if (diagnosis.id && !diagnosisFeedbacks.value[diagnosis.id]) {
            try {
              const feedbackResponse = await diagnosisStore.getFeedback(diagnosis.id)
              if (feedbackResponse.success && feedbackResponse.data) {
                diagnosisFeedbacks.value[diagnosis.id] = feedbackResponse.data
              }
            } catch (error) {
              // No feedback yet, that's okay
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading history:', error)
  } finally {
    loading.value = false
  }
}

const loadPage = (page) => {
  if (page >= 1) {
    loadHistory(page)
  }
}

const downloadPdf = async (id) => {
  try {
    await diagnosisStore.downloadPdf(id)
  } catch (error) {
    alert('Gagal mengunduh PDF. Pastikan endpoint PDF sudah diimplementasikan.')
  }
}

const openConsultationModal = (diagnosis) => {
  selectedDiagnosis.value = diagnosis
  showConsultationModal.value = true
}

const closeConsultationModal = () => {
  showConsultationModal.value = false
  selectedDiagnosis.value = null
}

const handleConsultationSuccess = () => {
  // Reload history if needed
  loadHistory(currentPage.value)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusClass = (status) => {
  const classes = {
    pending: 'status-pending',
    completed: 'status-completed',
    consulted: 'status-consulted'
  }
  return classes[status] || 'status-pending'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Menunggu',
    completed: 'Selesai',
    consulted: 'Dikonsultasikan'
  }
  return texts[status] || status
}

/**
 * Get preview of recommendation (first 100 characters)
 */
const getRecommendationPreview = (recommendation) => {
  if (!recommendation) return ''
  // Remove markdown formatting for preview
  const text = recommendation.replace(/\*\*/g, '').replace(/\n/g, ' ')
  return text.length > 150 ? text.substring(0, 150) + '...' : text
}

/**
 * Submit feedback dengan rating cepat
 */
const submitFeedback = async (diagnosisId, accuracy) => {
  submittingFeedback.value = diagnosisId
  feedbackError.value = null
  
  try {
    await diagnosisStore.submitFeedback(diagnosisId, accuracy, null)
    
    // Update local feedback state
    diagnosisFeedbacks.value[diagnosisId] = {
      accuracy: accuracy,
      comment: null
    }
    
    // Show success message
    alert('Terima kasih atas feedback kamu!')
  } catch (error) {
    console.error('Error submitting feedback:', error)
    feedbackError.value = 'Gagal mengirim feedback. Silakan coba lagi.'
    alert('Gagal mengirim feedback. Silakan coba lagi.')
  } finally {
    submittingFeedback.value = null
  }
}

/**
 * Open feedback modal untuk edit feedback
 */
const openFeedbackModal = (diagnosis) => {
  const existingFeedback = diagnosisFeedbacks.value[diagnosis.id]
  feedbackForm.value = {
    diagnosisId: diagnosis.id,
    accuracy: existingFeedback?.accuracy || null,
    comment: existingFeedback?.comment || ''
  }
  showFeedbackModal.value = true
  feedbackError.value = null
}

/**
 * Close feedback modal
 */
const closeFeedbackModal = () => {
  showFeedbackModal.value = false
  feedbackForm.value = {
    diagnosisId: null,
    accuracy: null,
    comment: ''
  }
  feedbackError.value = null
}

/**
 * Submit feedback form (dari modal)
 */
const submitFeedbackForm = async () => {
  if (!feedbackForm.value.accuracy) {
    feedbackError.value = 'Pilih rating terlebih dahulu'
    return
  }
  
  submittingFeedback.value = feedbackForm.value.diagnosisId
  feedbackError.value = null
  
  try {
    await diagnosisStore.submitFeedback(
      feedbackForm.value.diagnosisId,
      feedbackForm.value.accuracy,
      feedbackForm.value.comment || null
    )
    
    // Update local feedback state
    diagnosisFeedbacks.value[feedbackForm.value.diagnosisId] = {
      accuracy: feedbackForm.value.accuracy,
      comment: feedbackForm.value.comment
    }
    
    closeFeedbackModal()
    alert('Feedback berhasil diperbarui!')
  } catch (error) {
    console.error('Error submitting feedback:', error)
    feedbackError.value = error.response?.data?.message || 'Gagal mengirim feedback. Silakan coba lagi.'
  } finally {
    submittingFeedback.value = null
  }
}

/**
 * Get feedback badge class
 */
const getFeedbackBadgeClass = (accuracy) => {
  const classes = {
    accurate: 'badge-accurate',
    somewhat_accurate: 'badge-somewhat',
    inaccurate: 'badge-inaccurate'
  }
  return classes[accuracy] || 'badge-accurate'
}

/**
 * Get feedback icon
 */
const getFeedbackIcon = (accuracy) => {
  const icons = {
    accurate: '😊',
    somewhat_accurate: '😐',
    inaccurate: '😞'
  }
  return icons[accuracy] || '😊'
}

/**
 * Get feedback text
 */
const getFeedbackText = (accuracy) => {
  const texts = {
    accurate: 'Akurat',
    somewhat_accurate: 'Cukup Akurat',
    inaccurate: 'Tidak Akurat'
  }
  return texts[accuracy] || 'Akurat'
}

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.history-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #f0fdf4 0%, #ffffff 100%);
}

.history-hero {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  color: white;
  padding: 3rem 1rem;
  margin-bottom: 2rem;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.hero-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hero-content h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: white;
}

.hero-subtitle {
  font-size: 1.125rem;
  opacity: 0.95;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.btn-new-diagnosis {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  color: #27ae60;
  padding: 0.875rem 1.75rem;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.btn-new-diagnosis:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.btn-icon {
  font-size: 1.25rem;
}

.history-container {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-item {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.history-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #27ae60;
  transform: translateY(-2px);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.item-info h3 {
  margin: 0 0 0.25rem 0;
  color: #333;
  font-size: 1.25rem;
}

.item-date {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-consulted {
  background: #d1ecf1;
  color: #0c5460;
}

.item-result {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.result-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.result-label {
  color: #666;
  font-weight: 500;
}

.result-disease {
  color: #333;
  font-weight: 600;
  font-size: 1.1rem;
}

.result-cf {
  color: #667eea;
  font-weight: 600;
}

.no-result {
  color: #666;
  font-style: italic;
}

.pending-note {
  margin-top: 0.5rem;
  color: #856404;
  font-size: 0.85rem;
  font-style: italic;
}

.result-matched {
  color: #ff9800;
  font-size: 0.9rem;
  font-weight: 500;
}

.recommendation-preview {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
}

.recommendation-text {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.item-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-view,
.btn-download,
.btn-consultation {
  padding: 0.625rem 1.25rem;
  border-radius: 8px;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-view {
  background: #27ae60;
  color: white;
  box-shadow: 0 2px 4px rgba(39, 174, 96, 0.2);
}

.btn-view:hover {
  background: #229954;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(39, 174, 96, 0.3);
}

.btn-download {
  background: white;
  color: #27ae60;
  border: 2px solid #27ae60;
}

.btn-download:hover:not(:disabled) {
  background: #f0fdf4;
  transform: translateY(-1px);
}

.btn-download:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-consultation {
  background: #25D366;
  color: white;
  box-shadow: 0 2px 4px rgba(37, 211, 102, 0.2);
}

.btn-consultation:hover:not(:disabled) {
  background: #20BA5A;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(37, 211, 102, 0.3);
}

.btn-consultation:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-pagination:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #667eea;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-weight: 500;
}

.btn-primary {
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #5568d3;
}

/* Feedback Section */
.feedback-section {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.feedback-form {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1rem;
}

.feedback-title {
  margin: 0 0 0.75rem 0;
  color: #333;
  font-size: 0.95rem;
  font-weight: 600;
}

.feedback-rating {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-rating {
  flex: 1;
  min-width: 100px;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-rating:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-rating:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.rating-accurate:hover:not(:disabled) {
  border-color: #27ae60;
  background: #d4edda;
  color: #155724;
}

.rating-somewhat:hover:not(:disabled) {
  border-color: #ffc107;
  background: #fff3cd;
  color: #856404;
}

.rating-inaccurate:hover:not(:disabled) {
  border-color: #dc3545;
  background: #f8d7da;
  color: #721c24;
}

.rating-icon {
  font-size: 1.25rem;
}

.feedback-loading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
  color: #666;
  font-size: 0.875rem;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #e5e7eb;
  border-top-color: #27ae60;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.feedback-submitted {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feedback-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  width: fit-content;
}

.badge-accurate {
  background: #d4edda;
  color: #155724;
}

.badge-somewhat {
  background: #fff3cd;
  color: #856404;
}

.badge-inaccurate {
  background: #f8d7da;
  color: #721c24;
}

.badge-icon {
  font-size: 1.1rem;
}

.feedback-comment {
  margin: 0;
  color: #666;
  font-size: 0.875rem;
  font-style: italic;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #27ae60;
}

.btn-edit-feedback {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
  background: white;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  width: fit-content;
}

.btn-edit-feedback:hover {
  background: #f8f9fa;
  border-color: #27ae60;
  color: #27ae60;
}

/* Feedback Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 700;
}

.btn-close-modal {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.btn-close-modal:hover {
  background: #f8f9fa;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.rating-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.rating-option:hover {
  border-color: #27ae60;
  background: #f0fdf4;
}

.rating-option.active {
  border-color: #27ae60;
  background: #d4edda;
}

.rating-option input[type="radio"] {
  margin: 0;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #27ae60;
}

.error-message {
  padding: 0.75rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-top: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: #f8f9fa;
  color: #666;
}

.btn-cancel:hover {
  background: #e5e7eb;
}

.btn-submit {
  background: #27ae60;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #229954;
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>


