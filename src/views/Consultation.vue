<template>
  <div class="consultation-container">
    <div class="consultation-card">
      <h1>Konsultasi dengan Pakar</h1>
      <p class="subtitle">
        Jika diagnosis otomatis masih diragukan atau Anda membutuhkan penjelasan lebih lanjut,
        silakan konsultasi langsung dengan pakar tanaman hias via WhatsApp.
      </p>

      <!-- Form Konsultasi -->
      <form @submit.prevent="handleConsultation" v-if="!loading">
        <!-- Diagnosis Reference (Optional) -->
        <div class="form-section" v-if="diagnosisId">
          <h2>Referensi Diagnosis</h2>
          <div class="info-box">
            <p>
              Konsultasi ini terkait dengan diagnosis ID: <strong>{{ diagnosisId }}</strong>
            </p>
            <p class="info-note">
              Pakar akan melihat hasil diagnosis sebelumnya untuk memberikan konsultasi yang lebih tepat.
            </p>
          </div>
        </div>

        <!-- Message -->
        <div class="form-section">
          <h2>Pesan Konsultasi</h2>
          <div class="form-group">
            <label for="message">Jelaskan pertanyaan atau masalah Anda</label>
            <textarea
              id="message"
              v-model="form.message"
              rows="8"
              placeholder="Contoh: Tanaman saya sudah 2 minggu tidak tumbuh, daun mulai menguning. Apakah ini normal atau ada masalah?"
              required
              :disabled="loading"
              maxlength="1000"
            ></textarea>
            <div class="char-count">
              {{ form.message.length }}/1000 karakter
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="info-section">
          <h3>📋 Informasi Penting:</h3>
          <ul>
            <li>Pakar akan menghubungi Anda via WhatsApp</li>
            <li>Pastikan nomor WhatsApp Anda sudah terdaftar dan aktif</li>
            <li>Respon dari pakar biasanya dalam 1-2 jam kerja</li>
            <li>Jika diagnosis ID disertakan, pakar akan melihat hasil diagnosis sebelumnya</li>
          </ul>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          {{ success }}
        </div>

        <button type="submit" :disabled="loading || !form.message.trim()" class="btn-primary">
          {{ loading ? 'Mengirim...' : 'Kirim Konsultasi' }}
        </button>
      </form>

      <div v-if="loading && !form.message" class="loading">
        Memproses...
      </div>
    </div>

    <!-- Riwayat Konsultasi -->
    <div class="history-section">
      <h2>Riwayat Konsultasi</h2>
      <div v-if="consultations.length === 0" class="empty-state">
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConsultationStore } from '../stores/consultation'

const route = useRoute()
const consultationStore = useConsultationStore()

const form = ref({
  diagnosis_id: null,
  message: ''
})

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

const handleConsultation = async () => {
  error.value = null
  success.value = null
  loading.value = true

  const consultationData = {
    message: form.value.message,
    diagnosis_id: diagnosisId.value ? parseInt(diagnosisId.value) : null
  }

  try {
    const response = await consultationStore.create(consultationData)
    if (response.success) {
      success.value = response.message || 'Konsultasi berhasil dikirim! Pakar akan menghubungi Anda via WhatsApp.'
      form.value.message = ''
      // Reload consultations
      await consultationStore.fetchConsultations()
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal mengirim konsultasi. Silakan coba lagi.'
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
.consultation-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.consultation-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.char-count {
  text-align: right;
  color: #999;
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.info-box {
  background: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.info-box p {
  margin: 0.5rem 0;
  color: #333;
}

.info-note {
  font-size: 0.9rem;
  color: #666;
  font-style: italic;
}

.info-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.info-section h3 {
  margin: 0 0 1rem 0;
  color: #333;
  font-size: 1.1rem;
}

.info-section ul {
  margin: 0;
  padding-left: 1.5rem;
  color: #666;
  line-height: 1.8;
}

.info-section li {
  margin-bottom: 0.5rem;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.success-message {
  background: #efe;
  color: #3c3;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: #25D366;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background: #20BA5A;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.history-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.history-section h2 {
  margin: 0 0 1.5rem 0;
  color: #333;
  font-size: 1.5rem;
}

.consultations-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.consultation-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.3s;
}

.consultation-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.status-progress {
  background: #d1ecf1;
  color: #0c5460;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.consultation-message,
.consultation-response,
.consultation-diagnosis {
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
}

.consultation-message strong,
.consultation-response strong,
.consultation-diagnosis strong {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
}

.consultation-message p,
.consultation-response p,
.consultation-diagnosis p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}
</style>


