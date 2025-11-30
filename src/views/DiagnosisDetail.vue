<template>
  <div class="detail-container">
    <div v-if="loading" class="loading">
      Memuat detail diagnosis...
    </div>

    <div v-else-if="diagnosis" class="detail-card">
      <!-- Header -->
      <div class="detail-header">
        <div>
          <h1>Detail Diagnosis</h1>
          <p class="detail-date">
            {{ formatDate(diagnosis.created_at) }}
          </p>
        </div>
        <div class="header-actions">
          <router-link to="/diagnosis/history" class="btn-back">
            ← Kembali
          </router-link>
        </div>
      </div>

      <!-- Plant Info -->
      <div class="info-section">
        <h2>Informasi Tanaman</h2>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">Jenis Tanaman:</span>
            <span class="info-value">{{ diagnosis.plant?.name || '-' }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">Nama Ilmiah:</span>
            <span class="info-value">{{ diagnosis.plant?.scientific_name || '-' }}</span>
          </div>
        </div>
      </div>

      <!-- Diagnosis Result -->
      <div v-if="diagnosis.disease || diagnosis.disease_id" class="result-section">
        <h2>Hasil Diagnosis</h2>
        <div class="result-card">
          <div class="result-header">
            <h3>{{ diagnosis.disease?.name || 'Penyakit Tidak Diketahui' }}</h3>
            <div class="cf-badge" v-if="diagnosis.certainty_value !== null && diagnosis.certainty_value !== undefined">
              <span class="cf-label">Tingkat Kepastian:</span>
              <span class="cf-value">{{ (diagnosis.certainty_value * 100).toFixed(1) }}%</span>
            </div>
          </div>

          <div v-if="diagnosis.certainty_value !== null && diagnosis.certainty_value !== undefined" class="cf-indicator">
            <div class="cf-bar">
              <div
                class="cf-fill"
                :style="{ width: (diagnosis.certainty_value * 100) + '%' }"
                :class="getCFClass(diagnosis.certainty_value)"
              ></div>
            </div>
            <div class="cf-labels">
              <span>Rendah</span>
              <span>Sedang</span>
              <span>Tinggi</span>
            </div>
          </div>

          <!-- Recommendation dari Python Engine -->
          <div v-if="diagnosis.recommendation" class="recommendation-block">
            <h4>📋 Rekomendasi Sistem:</h4>
            <div class="recommendation-content" v-html="formatRecommendation(diagnosis.recommendation)"></div>
          </div>

          <div class="disease-info">
            <div v-if="diagnosis.disease?.description" class="info-block">
              <h4>Deskripsi:</h4>
              <p>{{ diagnosis.disease.description }}</p>
            </div>

            <div v-if="diagnosis.disease?.cause" class="info-block">
              <h4>Penyebab:</h4>
              <p>{{ diagnosis.disease.cause }}</p>
            </div>

            <div v-if="diagnosis.disease?.solution" class="info-block">
              <h4>Solusi Penanganan:</h4>
              <p>{{ diagnosis.disease.solution }}</p>
            </div>

            <div v-if="diagnosis.disease?.prevention" class="info-block">
              <h4>Pencegahan:</h4>
              <p>{{ diagnosis.disease.prevention }}</p>
            </div>
          </div>

          <!-- Matched Symptoms Count -->
          <div v-if="diagnosis.matched_symptoms_count" class="matched-info">
            <p class="matched-text">
              <span class="matched-label">Gejala yang Match:</span>
              <span class="matched-value">{{ diagnosis.matched_symptoms_count }} gejala</span>
            </p>
          </div>
        </div>
      </div>

      <!-- All Possibilities (Kemungkinan Penyakit Lain) -->
      <div v-if="diagnosis.all_possibilities && diagnosis.all_possibilities.length > 1" class="possibilities-section">
        <h2>Kemungkinan Penyakit Lain</h2>
        <div class="possibilities-list">
          <div
            v-for="(possibility, index) in diagnosis.all_possibilities.slice(1, 6)"
            :key="possibility.disease_id"
            class="possibility-item"
          >
            <div class="possibility-header">
              <span class="possibility-rank">#{{ index + 2 }}</span>
              <h4>{{ possibility.disease_name }}</h4>
              <span class="possibility-cf">{{ (possibility.certainty_value * 100).toFixed(2) }}%</span>
            </div>
            <div class="possibility-details">
              <p class="possibility-matched">
                Match: {{ possibility.matched_count || 0 }} gejala
              </p>
              <div v-if="possibility.solution" class="possibility-solution">
                <strong>Solusi:</strong> {{ possibility.solution }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="result-section">
        <div class="no-result">
          <p>Belum ada hasil diagnosis</p>
        </div>
      </div>

      <!-- Symptoms -->
      <div class="symptoms-section" v-if="diagnosis.symptoms && diagnosis.symptoms.length > 0">
        <h2>Gejala yang Dipilih</h2>
        <div class="symptoms-list">
          <div
            v-for="symptom in diagnosis.symptoms"
            :key="symptom.id"
            class="symptom-item"
          >
            <div class="symptom-code">{{ symptom.code }}</div>
            <div class="symptom-desc">{{ symptom.description }}</div>
            <div class="symptom-cf">
              CF User: {{ ((symptom.pivot?.user_cf || symptom.user_cf || 0) * 100).toFixed(0) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- User Notes -->
      <div v-if="diagnosis.user_notes" class="notes-section">
        <h2>Catatan</h2>
        <div class="notes-content">
          {{ diagnosis.user_notes }}
        </div>
      </div>

      <!-- Feedback Section -->
      <div v-if="!showFeedbackForm && !hasFeedback" class="feedback-section">
        <div class="feedback-prompt">
          <h3>Bagaimana hasil diagnosis ini?</h3>
          <p class="feedback-question">Berikan feedback untuk membantu kami meningkatkan kualitas diagnosis</p>
          <button
            @click="showFeedbackForm = true"
            class="btn-give-feedback"
          >
            📝 Berikan Feedback
          </button>
        </div>
      </div>

      <!-- Feedback Form -->
      <div v-if="showFeedbackForm && !hasFeedback" class="feedback-form-section">
        <div class="feedback-form-card">
          <h3>Berikan Feedback</h3>
          <form @submit.prevent="submitFeedbackForm" class="feedback-form">
            <div class="form-group">
              <label class="form-label">Rating <span class="required">*</span></label>
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
                    required
                  />
                  <span class="rating-icon">{{ rating.icon }}</span>
                  <span class="rating-label">{{ rating.label }}</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label for="feedback-comment" class="form-label">Komentar (Opsional)</label>
              <textarea
                id="feedback-comment"
                v-model="feedbackForm.comment"
                placeholder="Bagikan pendapat kamu tentang hasil diagnosis ini..."
                rows="4"
                class="form-textarea"
                maxlength="1000"
              ></textarea>
              <p class="char-count">{{ feedbackForm.comment?.length || 0 }}/1000 karakter</p>
            </div>

            <div v-if="feedbackError" class="error-message">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
              </svg>
              <span>{{ feedbackError }}</span>
            </div>

            <div class="form-actions">
              <button
                type="button"
                @click="cancelFeedback"
                class="btn-cancel"
                :disabled="submittingFeedback"
              >
                Batal
              </button>
              <button
                type="submit"
                class="btn-submit"
                :disabled="submittingFeedback || !feedbackForm.accuracy"
              >
                <span v-if="submittingFeedback" class="loading-spinner-small"></span>
                <span>{{ submittingFeedback ? 'Mengirim...' : 'Kirim Feedback' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Feedback Submitted Success -->
      <div v-if="hasFeedback && feedbackSuccess" class="feedback-success">
        <div class="success-card">
          <div class="success-icon">✓</div>
          <h3>Terima kasih atas feedback Anda!</h3>
          <p>Feedback kamu sangat membantu untuk meningkatkan kualitas sistem diagnosis.</p>
          <div class="success-actions">
        <button
          @click="openConsultationModal"
          class="btn-consult"
        >
          💬 Chat ke Pakar
        </button>
        <router-link to="/diagnosis" class="btn-new">
          + Diagnosis Baru
            </router-link>
            <router-link to="/diagnosis/history" class="btn-back-history">
              ← Kembali ke Riwayat
            </router-link>
          </div>
        </div>
      </div>

      <!-- Actions - Jika sudah ada feedback sebelumnya -->
      <div v-if="hasFeedback && !feedbackSuccess" class="actions-section">
        <button
          @click="openConsultationModal"
          class="btn-consult"
        >
          💬 Chat ke Pakar
        </button>
        <router-link to="/diagnosis" class="btn-new">
          + Diagnosis Baru
        </router-link>
        <router-link to="/diagnosis/history" class="btn-back-history">
          ← Kembali ke Riwayat
        </router-link>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Diagnosis tidak ditemukan</p>
      <router-link to="/diagnosis/history" class="btn-primary">
        Kembali ke Riwayat
      </router-link>
    </div>

    <!-- Consultation WhatsApp Modal -->
    <ConsultationWhatsAppModal
      :show="showConsultationModal"
      :diagnosis="diagnosis"
      @close="closeConsultationModal"
      @success="handleConsultationSuccess"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiagnosisStore } from '../stores/diagnosis'
import ConsultationWhatsAppModal from '../components/ConsultationWhatsAppModal.vue'

const route = useRoute()
const router = useRouter()
const diagnosisStore = useDiagnosisStore()

// Reactive state
const loading = ref(true)
const showConsultationModal = ref(false)
const hasFeedback = ref(false)
const feedbackValue = ref(null)
const showFeedbackForm = ref(false)
const submittingFeedback = ref(false)
const feedbackError = ref(null)
const feedbackSuccess = ref(false)

const feedbackForm = ref({
  accuracy: null, // 'accurate', 'somewhat_accurate', 'inaccurate'
  comment: ''
})

const feedbackRatings = [
  { value: 'accurate', label: 'Akurat', icon: '😊' },
  { value: 'somewhat_accurate', label: 'Cukup Akurat', icon: '😐' },
  { value: 'inaccurate', label: 'Tidak Akurat', icon: '😞' }
]

// Get diagnosis from store, handle both direct data and nested data structure
const diagnosis = computed(() => {
  const storeData = diagnosisStore.currentDiagnosis
  if (!storeData) return null
  
  // Handle nested structure from backend response
  if (storeData.diagnosis) {
    return {
      ...storeData.diagnosis,
      plant: storeData.plant,
      disease: storeData.disease,
      symptoms: storeData.symptoms,
      certainty_value: storeData.certainty_value,
      recommendation: storeData.recommendation,
      all_possibilities: storeData.all_possibilities,
      matched_symptoms_count: storeData.matched_symptoms_count
    }
  }
  
  // Direct structure
  return storeData
})

const loadDetail = async () => {
  loading.value = true
  try {
    await diagnosisStore.fetchDetail(route.params.id)
    
    // Check if feedback already exists
    try {
      const feedbackResponse = await diagnosisStore.getFeedback(route.params.id)
      if (feedbackResponse.success && feedbackResponse.data) {
        hasFeedback.value = true
        feedbackValue.value = feedbackResponse.data.accuracy
        feedbackForm.value.accuracy = feedbackResponse.data.accuracy
        feedbackForm.value.comment = feedbackResponse.data.comment || ''
      }
    } catch (error) {
      // No feedback yet, that's okay
      console.log('No feedback found for this diagnosis')
    }
  } catch (error) {
    console.error('Error loading diagnosis detail:', error)
  } finally {
    loading.value = false
  }
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

const getCFClass = (cf) => {
  if (cf >= 0.7) return 'cf-high'
  if (cf >= 0.4) return 'cf-medium'
  return 'cf-low'
}

/**
 * Format recommendation text (handle markdown-like formatting)
 */
const formatRecommendation = (text) => {
  if (!text) return ''
  // Convert **text** to <strong>text</strong>
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
}

const openConsultationModal = () => {
  showConsultationModal.value = true
}

const closeConsultationModal = () => {
  showConsultationModal.value = false
}

const handleConsultationSuccess = () => {
  // Optionally reload detail or show success message
  closeConsultationModal()
}

/**
 * Submit feedback form
 */
const submitFeedbackForm = async () => {
  // Validasi
  if (!feedbackForm.value.accuracy) {
    feedbackError.value = 'Pilih rating terlebih dahulu'
    return
  }

  if (feedbackForm.value.comment && feedbackForm.value.comment.length > 1000) {
    feedbackError.value = 'Komentar maksimal 1000 karakter'
    return
  }

  submittingFeedback.value = true
  feedbackError.value = null

  try {
    await diagnosisStore.submitFeedback(
      route.params.id,
      feedbackForm.value.accuracy,
      feedbackForm.value.comment || null
    )
    
    // Success
    hasFeedback.value = true
    feedbackValue.value = feedbackForm.value.accuracy
    showFeedbackForm.value = false
    feedbackSuccess.value = true
    
    // Auto hide success message after 5 seconds
    setTimeout(() => {
      feedbackSuccess.value = false
    }, 5000)
  } catch (error) {
    console.error('Error submitting feedback:', error)
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = []
      for (const field in errors) {
        errorMessages.push(...errors[field])
      }
      feedbackError.value = errorMessages.join(', ')
    } else {
      feedbackError.value = error.response?.data?.message || 'Gagal mengirim feedback. Silakan coba lagi.'
    }
  } finally {
    submittingFeedback.value = false
  }
}

/**
 * Cancel feedback form
 */
const cancelFeedback = () => {
  showFeedbackForm.value = false
  feedbackForm.value = {
    accuracy: null,
    comment: ''
  }
  feedbackError.value = null
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.detail-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
}

.detail-header h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
}

.detail-date {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-back {
  background: #6c757d;
  color: white;
}

.btn-back:hover {
  background: #5a6268;
}

.btn-back-history {
  padding: 0.75rem 1.5rem;
  background: #6c757d;
  color: white;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-back-history:hover {
  background: #5a6268;
}

.info-section,
.result-section,
.symptoms-section,
.notes-section {
  margin-bottom: 2rem;
}

.info-section h2,
.result-section h2,
.symptoms-section h2,
.notes-section h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  color: #666;
  font-size: 0.9rem;
}

.info-value {
  color: #333;
  font-weight: 500;
}

.result-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  border-left: 4px solid #667eea;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.result-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.cf-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.cf-label {
  color: #666;
  font-size: 0.9rem;
}

.cf-value {
  color: #667eea;
  font-weight: bold;
  font-size: 1.1rem;
}

.cf-indicator {
  margin: 1.5rem 0;
}

.cf-bar {
  width: 100%;
  height: 30px;
  background: #e0e0e0;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.cf-fill {
  height: 100%;
  transition: width 0.5s;
  border-radius: 15px;
}

.cf-low {
  background: #ffc107;
}

.cf-medium {
  background: #ff9800;
}

.cf-high {
  background: #28a745;
}

.cf-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: #666;
}

.disease-info {
  margin-top: 1.5rem;
}

.info-block {
  margin-bottom: 1.5rem;
}

.info-block h4 {
  color: #667eea;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.info-block p {
  color: #333;
  line-height: 1.6;
  margin: 0;
}

.symptoms-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.symptom-item {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 1rem;
  border-left: 3px solid #667eea;
}

.symptom-code {
  font-weight: bold;
  color: #667eea;
  margin-bottom: 0.25rem;
}

.symptom-desc {
  color: #333;
  margin-bottom: 0.5rem;
}

.symptom-cf {
  color: #666;
  font-size: 0.85rem;
}

.notes-content {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 6px;
  color: #333;
  line-height: 1.6;
}

/* Feedback Section */
.feedback-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.feedback-prompt {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  border: 2px solid #86efac;
}

.feedback-prompt h3 {
  margin: 0 0 0.5rem 0;
  color: #166534;
  font-size: 1.5rem;
  font-weight: 700;
}

.feedback-question {
  margin: 0 0 1.5rem 0;
  color: #15803d;
  font-size: 1rem;
  line-height: 1.6;
}

.btn-give-feedback {
  padding: 0.875rem 2rem;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
}

.btn-give-feedback:hover {
  background: #229954;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
}

/* Feedback Form */
.feedback-form-section {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.feedback-form-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.feedback-form-card h3 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
  font-weight: 700;
}

.feedback-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-label {
  color: #333;
  font-weight: 600;
  font-size: 0.95rem;
}

.required {
  color: #dc3545;
}

.rating-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.rating-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: white;
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
  cursor: pointer;
}

.rating-icon {
  font-size: 1.5rem;
}

.rating-label {
  font-weight: 500;
  color: #333;
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
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #27ae60;
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

.char-count {
  margin: 0;
  font-size: 0.85rem;
  color: #666;
  text-align: right;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: #f8d7da;
  color: #721c24;
  border-radius: 8px;
  font-size: 0.9rem;
  border-left: 4px solid #dc3545;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 0.5rem;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-cancel {
  background: #f8f9fa;
  color: #666;
}

.btn-cancel:hover:not(:disabled) {
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

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Feedback Success */
.feedback-success {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.success-card {
  background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
  border-radius: 12px;
  padding: 2.5rem;
  text-align: center;
  border: 2px solid #27ae60;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #27ae60;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.success-card h3 {
  margin: 0 0 0.75rem 0;
  color: #155724;
  font-size: 1.5rem;
  font-weight: 700;
}

.success-card p {
  margin: 0 0 1.5rem 0;
  color: #155724;
  font-size: 1rem;
  line-height: 1.6;
}

.success-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.actions-section {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
}

.btn-consult,
.btn-new {
  flex: 1;
  padding: 1rem;
  border-radius: 6px;
  text-decoration: none;
  text-align: center;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-consult {
  background: #25D366;
  color: white;
}

.btn-consult:hover {
  background: #20BA5A;
}

.btn-new {
  background: #667eea;
  color: white;
}

.btn-new:hover {
  background: #5568d3;
}

.loading,
.error-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error-state p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
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

.no-result {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.recommendation-block {
  margin-top: 1.5rem;
  padding: 1.5rem;
  background: #e8f5e9;
  border-radius: 8px;
  border-left: 4px solid #4caf50;
}

.recommendation-block h4 {
  color: #2e7d32;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  font-weight: 600;
}

.recommendation-content {
  color: #333;
  line-height: 1.8;
  white-space: pre-wrap;
}

.recommendation-content :deep(strong) {
  color: #1b5e20;
  font-weight: 600;
}

.matched-info {
  margin-top: 1rem;
  padding: 0.75rem 1rem;
  background: #fff3e0;
  border-radius: 6px;
  border-left: 3px solid #ff9800;
}

.matched-text {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.matched-label {
  color: #666;
  font-weight: 500;
}

.matched-value {
  color: #e65100;
  font-weight: 600;
}

.possibilities-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #f5f5f5;
  border-radius: 12px;
}

.possibilities-section h2 {
  color: #333;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
}

.possibilities-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.possibility-item {
  background: white;
  border-radius: 8px;
  padding: 1.25rem;
  border-left: 4px solid #9e9e9e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.possibility-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.possibility-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.possibility-rank {
  background: #9e9e9e;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
}

.possibility-header h4 {
  flex: 1;
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.possibility-cf {
  color: #9e9e9e;
  font-weight: 600;
  font-size: 0.9rem;
}

.possibility-details {
  font-size: 0.9rem;
  color: #666;
}

.possibility-matched {
  margin: 0.5rem 0;
  color: #666;
}

.possibility-solution {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e0e0e0;
  color: #555;
  line-height: 1.5;
}

.possibility-solution strong {
  color: #333;
}
</style>


