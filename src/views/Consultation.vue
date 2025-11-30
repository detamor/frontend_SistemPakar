<template>
  <div class="consultation-page">
    <!-- Hero Section -->
    <div class="consultation-hero">
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
          <div class="hero-icon">💬</div>
          <h1>Konsultasi dengan Pakar</h1>
          <p class="hero-subtitle">
            Jika diagnosis otomatis masih diragukan atau Anda membutuhkan penjelasan lebih lanjut,
            silakan konsultasi langsung dengan pakar tanaman hias via WhatsApp.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container">
      <div class="consultation-card">
        <!-- Form Konsultasi -->
        <form @submit.prevent="handleConsultation" v-if="!loading">
          <!-- Diagnosis Reference (Optional) -->
          <div class="form-section" v-if="diagnosisId">
            <div class="section-header">
              <div class="step-number">📋</div>
              <div>
                <h2>Referensi Diagnosis</h2>
                <p class="section-description">Konsultasi ini terkait dengan diagnosis sebelumnya</p>
              </div>
            </div>
            <div class="info-box">
              <p>
                Diagnosis ID: <strong>{{ diagnosisId }}</strong>
              </p>
              <p class="info-note">
                Pakar akan melihat hasil diagnosis sebelumnya untuk memberikan konsultasi yang lebih tepat.
              </p>
            </div>
          </div>

          <!-- Message -->
          <div class="form-section">
            <div class="section-header">
              <div class="step-number">1</div>
              <div>
                <h2>Pesan Konsultasi</h2>
                <p class="section-description">Jelaskan pertanyaan atau masalah Anda</p>
              </div>
            </div>
            <div class="form-group">
              <label for="message" class="form-label">
                <span class="label-icon">💬</span>
                Pesan
              </label>
              <textarea
                id="message"
                v-model="form.message"
                rows="6"
                placeholder="Contoh: Tanaman saya sudah 2 minggu tidak tumbuh, daun mulai menguning. Apakah ini normal atau ada masalah?"
                required
                :disabled="loading"
                maxlength="1000"
                class="form-textarea"
              ></textarea>
              <div class="char-count">
                {{ form.message.length }}/1000 karakter
              </div>
            </div>
          </div>

          <!-- PDF Attachment Section -->
          <div class="form-section">
            <div class="section-header">
              <div class="step-number">2</div>
              <div>
                <h2>Lampirkan File PDF Hasil Diagnosis (Opsional)</h2>
                <p class="section-description">
                  Upload file PDF hasil diagnosis yang telah Anda download untuk dilampirkan ke chat WhatsApp pakar
                </p>
              </div>
            </div>

            <!-- Upload PDF Manual -->
            <div class="form-group">
              <label for="pdfFile" class="form-label">
                <span class="label-icon">📎</span>
                Upload File PDF Hasil Diagnosis
              </label>
              <div class="file-upload-area" :class="{ 'has-file': pdfFile, 'dragover': isDragging }"
                   @dragover.prevent="isDragging = true"
                   @dragleave.prevent="isDragging = false"
                   @drop.prevent="handleFileDrop"
                   @click="() => pdfFileInput?.click()">
                <input
                  type="file"
                  id="pdfFile"
                  ref="pdfFileInput"
                  accept=".pdf"
                  @change="handleFileSelect"
                  class="file-input"
                  :disabled="loading"
                />
                <div v-if="!pdfFile" class="upload-placeholder">
                  <div class="upload-icon">📄</div>
                  <p class="upload-text">
                    <strong>Klik untuk memilih file PDF</strong> atau drag & drop file PDF di sini
                  </p>
                  <p class="upload-hint">Format: PDF | Maksimal: 10MB</p>
                  <div class="upload-instructions">
                    <p class="instruction-title">📋 Cara mendapatkan file PDF:</p>
                    <ol class="instruction-steps">
                      <li>Buka halaman <router-link to="/diagnosis/history" class="instruction-link">Riwayat Diagnosis</router-link></li>
                      <li>Klik tombol "📄 Download PDF" pada diagnosis yang ingin dikonsultasikan</li>
                      <li>File PDF akan terdownload ke komputer Anda</li>
                      <li>Upload file PDF tersebut di sini untuk dilampirkan ke chat WhatsApp pakar</li>
                    </ol>
                  </div>
                </div>
                <div v-else class="file-preview">
                  <div class="file-info">
                    <div class="file-icon">📄</div>
                    <div class="file-details">
                      <p class="file-name">{{ pdfFile.name }}</p>
                      <p class="file-size">{{ formatFileSize(pdfFile.size) }}</p>
                    </div>
                    <button
                      type="button"
                      @click.stop="removeFile"
                      class="remove-file-btn"
                      :disabled="loading"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
              <p v-if="pdfFile" class="form-hint success-hint">
                ✓ File PDF siap dilampirkan. PDF ini akan dikirim ke pakar via WhatsApp bersama dengan pesan chat Anda.
              </p>
              <p v-else class="form-hint">
                💡 File PDF hasil diagnosis akan dilampirkan ke chat WhatsApp pakar untuk membantu pakar memahami kondisi tanaman Anda
              </p>
            </div>
          </div>

          <!-- Info Section -->
          <div class="info-section">
            <h3>📋 Informasi Penting:</h3>
            <ul>
              <li>Pakar akan menghubungi Anda via WhatsApp</li>
              <li>Pastikan nomor WhatsApp Anda sudah terdaftar dan aktif</li>
              <li>Respon dari pakar biasanya dalam 1-2 jam kerja</li>
              <li>Jika diagnosis ID disertakan, pakar akan melihat hasil diagnosis sebelumnya</li>
              <li>Upload file PDF hasil diagnosis yang telah Anda download untuk dilampirkan ke chat</li>
              <li>PDF akan membantu pakar memahami kondisi tanaman dan memberikan konsultasi yang lebih tepat</li>
            </ul>
          </div>

          <div v-if="error" class="error-message">
            {{ error }}
          </div>

          <div v-if="success" class="success-message">
            {{ success }}
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="loading || !form.message.trim()" class="btn-primary btn-submit">
              <LoadingSpinner v-if="loading" size="sm" />
              <span v-else class="btn-icon">📤</span>
              <span>{{ loading ? 'Mengirim...' : 'Kirim Konsultasi' }}</span>
            </button>
          </div>
        </form>

        <div v-if="loading && !form.message" class="loading">
          <LoadingSpinner size="lg" message="Memproses..." />
        </div>
      </div>

      <!-- Riwayat Konsultasi -->
      <div class="history-card">
        <h2>Riwayat Konsultasi</h2>
        <div v-if="consultations.length === 0" class="empty-state">
          <div class="empty-icon">📭</div>
          <p>Belum ada konsultasi</p>
        </div>
        <div v-else class="consultations-list">
          <div
            v-for="consultation in consultations"
            :key="consultation.id"
            class="consultation-item"
          >
            <div class="consultation-header">
              <div class="consultation-info">
                <span class="consultation-date">
                  {{ formatDate(consultation.created_at) }}
                </span>
                <span :class="['status-badge', getStatusClass(consultation.status)]">
                  {{ getStatusText(consultation.status) }}
                </span>
              </div>
            </div>
            <div class="consultation-message">
              <strong>Pesan Anda:</strong>
              <p>{{ consultation.message }}</p>
            </div>
            <div v-if="consultation.pdf_path" class="consultation-pdf">
              <strong>📎 PDF Terlampir:</strong>
              <p class="pdf-info">File PDF sudah diupload dan akan dikirim ke pakar</p>
            </div>
            <div v-if="consultation.expert_response" class="consultation-response">
              <strong>Respon Pakar:</strong>
              <p>{{ consultation.expert_response }}</p>
            </div>
            <div v-if="consultation.diagnosis" class="consultation-diagnosis">
              <strong>Diagnosis Terkait:</strong>
              <p>{{ consultation.diagnosis.plant?.name }} - {{ consultation.diagnosis.disease?.name || 'Belum ada hasil' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConsultationStore } from '../stores/consultation'
import { useDiagnosisStore } from '../stores/diagnosis'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const route = useRoute()
const consultationStore = useConsultationStore()
const diagnosisStore = useDiagnosisStore()

const form = ref({
  diagnosis_id: null,
  message: ''
})

const pdfFile = ref(null)
const pdfFileInput = ref(null)
const isDragging = ref(false)
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const diagnosisId = computed(() => {
  return route.query.diagnosisId || route.state?.diagnosisId || null
})

const consultations = computed(() => {
  if (consultationStore.consultations?.data) {
    return consultationStore.consultations.data
  }
  return []
})

// Removed onDiagnosisSelect - tidak digunakan lagi karena fokus ke upload manual

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      error.value = 'File harus berformat PDF'
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      error.value = 'Ukuran file maksimal 10MB'
      return
    }
    pdfFile.value = file
    error.value = null
    success.value = null
  }
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    if (file.type !== 'application/pdf') {
      error.value = 'File harus berformat PDF'
      return
    }
    if (file.size > 10 * 1024 * 1024) {
      error.value = 'Ukuran file maksimal 10MB'
      return
    }
    pdfFile.value = file
    error.value = null
    success.value = null
  }
}

const removeFile = () => {
  pdfFile.value = null
  if (pdfFileInput.value) {
    pdfFileInput.value.value = ''
  }
  // Don't clear selectedDiagnosisId when removing manual file
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleConsultation = async () => {
  error.value = null
  success.value = null
  loading.value = true

  try {
    // Step 1: Create consultation
    const consultationData = {
      message: form.value.message,
      diagnosis_id: diagnosisId.value ? parseInt(diagnosisId.value) : null
    }

    const createResponse = await consultationStore.create(consultationData)
    
    if (!createResponse.success) {
      throw new Error(createResponse.message || 'Gagal membuat konsultasi')
    }

    const consultationId = createResponse.data.id

    // Step 2: Upload PDF manual jika ada
    if (pdfFile.value) {
      try {
        await consultationStore.uploadPdf(consultationId, pdfFile.value)
        console.log('PDF berhasil diupload')
      } catch (uploadError) {
        console.error('PDF upload error:', uploadError)
        // Continue even if PDF upload fails
        error.value = 'Konsultasi berhasil dibuat, namun upload PDF gagal: ' + (uploadError.response?.data?.message || uploadError.message)
      }
    }

    // Step 3: Send to WhatsApp dengan PDF
    try {
      await consultationStore.sendWhatsApp(consultationId, form.value.message)
      if (pdfFile.value) {
        success.value = 'Konsultasi dan file PDF berhasil dikirim ke pakar via WhatsApp! Pakar akan menghubungi Anda.'
      } else {
        success.value = 'Konsultasi berhasil dikirim! Pakar akan menghubungi Anda via WhatsApp.'
      }
    } catch (whatsappError) {
      console.error('WhatsApp send error:', whatsappError)
      success.value = 'Konsultasi berhasil dibuat. Namun pengiriman ke WhatsApp gagal. Silakan hubungi pakar secara manual.'
    }

    // Reset form
    form.value.message = ''
    form.value.diagnosis_id = null
    pdfFile.value = null
    if (pdfFileInput.value) {
      pdfFileInput.value.value = ''
    }

    // Reload consultations
    await consultationStore.fetchConsultations()
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Gagal mengirim konsultasi. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}

const formatDateShort = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Removed downloadPdfFromDiagnosis and loadAvailableDiagnoses - tidak digunakan lagi

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
    in_progress: 'status-progress',
    completed: 'status-completed'
  }
  return classes[status] || 'status-pending'
}

const getStatusText = (status) => {
  const texts = {
    pending: 'Menunggu',
    in_progress: 'Sedang Diproses',
    completed: 'Selesai'
  }
  return texts[status] || status
}

onMounted(async () => {
  // Set diagnosis_id if from query/state
  if (diagnosisId.value) {
    form.value.diagnosis_id = parseInt(diagnosisId.value)
  }

  // Load consultations
  try {
    await consultationStore.fetchConsultations()
  } catch (error) {
    console.error('Error loading consultations:', error)
  }
})
</script>

<style scoped>
.consultation-page {
  min-height: 100vh;
  background: linear-gradient(to bottom, #e0f2fe 0%, #ffffff 100%);
}

.consultation-hero {
  background: linear-gradient(135deg, #25D366 0%, #20BA5A 100%);
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
}

.consultation-card,
.history-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
}

.form-section:last-of-type {
  border-bottom: none;
}

.section-header {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.step-number {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #25D366 0%, #20BA5A 100%);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
}

.section-header h2 {
  font-size: 1.5rem;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.section-description {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  color: #374151;
  font-weight: 600;
  font-size: 1rem;
}

.label-icon {
  font-size: 1.25rem;
}

.form-textarea {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: all 0.3s ease;
  box-sizing: border-box;
  line-height: 1.6;
}

.form-textarea:focus {
  outline: none;
  border-color: #25D366;
  box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.1);
}

.form-textarea:disabled {
  background: #f9fafb;
  cursor: not-allowed;
  opacity: 0.6;
}

.char-count {
  text-align: right;
  color: #9ca3af;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.file-upload-area {
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  background: #f9fafb;
  cursor: pointer;
}

.file-upload-area:hover {
  border-color: #25D366;
  background: #f0fdf4;
}

.file-upload-area.dragover {
  border-color: #25D366;
  background: #dcfce7;
  border-style: solid;
}

.file-upload-area.has-file {
  border-color: #25D366;
  background: #f0fdf4;
  border-style: solid;
}

.file-input {
  display: none;
}

.upload-placeholder {
  pointer-events: none;
}

.upload-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.upload-text {
  font-size: 1rem;
  color: #374151;
  margin-bottom: 0.5rem;
}

.upload-hint {
  font-size: 0.875rem;
  color: #6b7280;
}

.upload-tip {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 500;
  padding: 0.5rem;
  background: #eff6ff;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.file-preview {
  pointer-events: none;
}

.file-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.file-icon {
  font-size: 2.5rem;
}

.file-details {
  flex: 1;
  text-align: left;
}

.file-name {
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.25rem 0;
}

.file-size {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}

.remove-file-btn {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.remove-file-btn:hover:not(:disabled) {
  background: #dc2626;
  transform: scale(1.1);
}

.remove-file-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.diagnosis-select-wrapper {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.diagnosis-select-wrapper .form-select {
  flex: 1;
}

.btn-download-pdf {
  padding: 0.875rem 1.25rem;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.btn-download-pdf:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-download-pdf:active:not(:disabled) {
  transform: translateY(0);
}

.btn-download-pdf:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.7;
}

.form-hint {
  margin-top: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

.success-hint {
  color: #059669;
  font-weight: 500;
}

.upload-tip {
  margin-top: 0.75rem;
  font-size: 0.875rem;
  color: #3b82f6;
  font-weight: 500;
  padding: 0.5rem;
  background: #eff6ff;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.upload-instructions {
  margin-top: 1.5rem;
  padding: 1rem;
  background: #f0f9ff;
  border-radius: 12px;
  border: 1px solid #bae6fd;
  text-align: left;
}

.instruction-title {
  font-weight: 700;
  color: #0369a1;
  margin: 0 0 0.75rem 0;
  font-size: 0.95rem;
}

.instruction-steps {
  margin: 0;
  padding-left: 1.5rem;
  color: #0c4a6e;
  line-height: 1.8;
}

.instruction-steps li {
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.instruction-link {
  color: #0284c7;
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.2s;
}

.instruction-link:hover {
  color: #0369a1;
}

.divider {
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  text-align: center;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider-text {
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 600;
}

.info-box {
  background: linear-gradient(to right, #dbeafe 0%, #e0f2fe 100%);
  border-left: 4px solid #3b82f6;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1rem;
}

.info-box p {
  margin: 0.5rem 0;
  color: #1e40af;
}

.info-note {
  font-size: 0.9rem;
  color: #1e40af;
  font-style: italic;
  opacity: 0.9;
}

.info-section {
  background: linear-gradient(to bottom, #fef3c7 0%, #ffffff 100%);
  padding: 1.5rem;
  border-radius: 16px;
  margin-bottom: 2rem;
  border: 2px solid #fde68a;
}

.info-section h3 {
  margin: 0 0 1rem 0;
  color: #92400e;
  font-size: 1.1rem;
  font-weight: 700;
}

.info-section ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #78350f;
  line-height: 1.8;
}

.info-section li {
  margin-bottom: 0.5rem;
}

.error-message {
  background: #fee2e2;
  color: #991b1b;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border-left: 4px solid #dc2626;
}

.success-message {
  background: #d1fae5;
  color: #065f46;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  border-left: 4px solid #10b981;
}

.form-actions {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 2px solid #f0f0f0;
}

.btn-primary {
  width: 100%;
  padding: 1.125rem 2rem;
  background: linear-gradient(135deg, #25D366 0%, #20BA5A 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.125rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(37, 211, 102, 0.5);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
  opacity: 0.7;
}

.btn-icon {
  font-size: 1.25rem;
}

.loading {
  text-align: center;
  padding: 3rem;
}

.history-card h2 {
  margin: 0 0 1.5rem 0;
  color: #1f2937;
  font-size: 1.75rem;
  font-weight: 700;
}

.consultations-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.consultation-item {
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  background: white;
}

.consultation-item:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  border-color: #25D366;
}

.consultation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.consultation-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.consultation-date {
  color: #6b7280;
  font-size: 0.9rem;
}

.status-badge {
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.status-pending {
  background: #fef3c7;
  color: #92400e;
}

.status-progress {
  background: #dbeafe;
  color: #1e40af;
}

.status-completed {
  background: #d1fae5;
  color: #065f46;
}

.consultation-message,
.consultation-response,
.consultation-diagnosis,
.consultation-pdf {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 12px;
}

.consultation-message strong,
.consultation-response strong,
.consultation-diagnosis strong,
.consultation-pdf strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #1f2937;
  font-size: 0.95rem;
}

.consultation-message p,
.consultation-response p,
.consultation-diagnosis p,
.consultation-pdf p {
  margin: 0;
  color: #4b5563;
  line-height: 1.6;
}

.pdf-info {
  font-size: 0.875rem;
  color: #059669;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Responsive */
@media (max-width: 768px) {
  .consultation-hero {
    padding: 2rem 1rem;
  }

  .hero-content h1 {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .consultation-card,
  .history-card {
    padding: 1.5rem;
    border-radius: 16px;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
  }

  .step-number {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }

  .diagnosis-select-wrapper {
    flex-direction: column;
  }

  .btn-download-pdf {
    width: 100%;
    justify-content: center;
  }
}
</style>
