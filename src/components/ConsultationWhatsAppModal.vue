<template>
  <BaseModal
    :show="show"
    :title="'Konsultasi via WhatsApp'"
    :subtitle="'Kirim hasil diagnosis dan penjelasan masalah ke pakar'"
    :closable="true"
    size="lg"
    @close="$emit('close')"
  >
    <template #default>
      <form @submit.prevent="handleSubmit" id="consultation-form">
        <!-- Diagnosis Info -->
        <div v-if="diagnosis" class="diagnosis-info">
          <h3 class="info-title">📋 Informasi Diagnosis</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Tanaman:</span>
              <span class="info-value">{{ diagnosis.plant?.name || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Hasil:</span>
              <span class="info-value">{{ diagnosis.disease?.name || 'Belum ada hasil' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Tingkat Kepastian:</span>
              <span class="info-value">{{ diagnosis.certainty_value ? (diagnosis.certainty_value * 100).toFixed(1) + '%' : '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="form-group">
          <label for="consultation-message" class="form-label">
            Jelaskan masalah atau pertanyaan Anda
            <span class="required">*</span>
          </label>
          <textarea
            id="consultation-message"
            v-model="form.message"
            rows="6"
            placeholder="Contoh: Saya kurang puas dengan hasil diagnosis karena tanaman saya menunjukkan gejala yang berbeda. Mohon bantuannya untuk penanganan yang lebih tepat..."
            required
            :disabled="loading"
            maxlength="1000"
            class="form-textarea"
          ></textarea>
          <div class="char-count">
            {{ form.message.length }}/1000 karakter
          </div>
        </div>



        <!-- Error Message -->
        <ErrorMessage
          v-if="error"
          :message="error"
          title="Gagal Mengirim"
          dismissible
          @dismiss="error = null"
        />

        <!-- Success Message -->
        <div v-if="success" class="success-message">
          <svg class="success-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p>{{ success }}</p>
        </div>
      </form>
    </template>

    <template #footer>
      <button
        type="button"
        @click="$emit('close')"
        class="btn-secondary"
        :disabled="loading"
      >
        Batal
      </button>
      <button
        type="submit"
        form="consultation-form"
        class="btn-primary"
        :disabled="loading || !form.message.trim()"
      >
        <LoadingSpinner v-if="loading" size="sm" />
        <span v-else>💬</span>
        <span>{{ loading ? 'Mengirim...' : 'Kirim Otomatis via Sistem' }}</span>
      </button>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import BaseModal from './BaseModal.vue'
import ErrorMessage from './ErrorMessage.vue'
import LoadingSpinner from './LoadingSpinner.vue'
import { useConsultationStore } from '../stores/consultation'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  diagnosis: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'success'])

const consultationStore = useConsultationStore()

const form = ref({
  message: ''
})

const loading = ref(false)
const error = ref(null)
const success = ref(null)


// Reset form when modal closes
watch(() => props.show, (newVal) => {
  if (!newVal) {
    form.value = { message: '' }
    error.value = null
    success.value = null
  } else if (props.diagnosis) {
    // Pre-fill message with diagnosis info
    form.value.message = `Halo Pakar,\n\nSaya ingin berkonsultasi tentang hasil diagnosis berikut:\n\nTanaman: ${props.diagnosis.plant?.name || '-'}\nHasil Diagnosis: ${props.diagnosis.disease?.name || 'Belum ada hasil'}\nTingkat Kepastian: ${props.diagnosis.certainty_value ? (props.diagnosis.certainty_value * 100).toFixed(1) + '%' : '-'}\n\n`
  }
})



const handleSubmit = async () => {
  error.value = null
  success.value = null
  loading.value = true

  try {
    // Step 1: Create consultation record
    const consultationData = {
      message: form.value.message,
      diagnosis_id: props.diagnosis?.id || null
    }

    const createResponse = await consultationStore.create(consultationData)
    
    if (!createResponse.success) {
      throw new Error(createResponse.message || 'Gagal membuat konsultasi')
    }

    const consultationId = createResponse.data.id


    // Step 3: Send to WhatsApp dengan PDF
    try {
      const waRes = await consultationStore.sendWhatsApp(consultationId, form.value.message)
      const waUrl = waRes?.whatsapp_url
      if (waUrl) {
        window.open(waUrl, '_blank', 'noopener,noreferrer')
        success.value = 'WhatsApp siap dibuka. Jika pesan/PDF tidak terkirim otomatis, kirim manual lewat WhatsApp.'
      } else {
        success.value = 'Konsultasi berhasil diproses. Silakan hubungi pakar via WhatsApp.'
      }
    } catch (whatsappError) {
      console.error('WhatsApp send error:', whatsappError)
      success.value = 'Konsultasi berhasil dibuat. Namun pengiriman ke WhatsApp gagal. Silakan hubungi pakar secara manual.'
    }

    setTimeout(() => {
      emit('success')
      emit('close')
    }, 3000)
  } catch (err) {
    console.error('Consultation error:', err)
    error.value = err.response?.data?.message || err.message || 'Gagal mengirim konsultasi. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.diagnosis-info {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
}

.info-title {
  font-size: 1rem;
  font-weight: 600;
  color: #0369a1;
  margin: 0 0 0.75rem 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.75rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  color: #64748b;
  font-weight: 500;
}

.info-value {
  font-size: 0.875rem;
  color: #1e293b;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.required {
  color: #ef4444;
  margin-left: 0.25rem;
}

.form-textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-textarea:focus {
  outline: none;
  border-color: #25D366;
  box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.1);
}

.form-textarea:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
}

.char-count {
  text-align: right;
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: #374151;
}

.checkbox-input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.hint {
  color: #6b7280;
  font-size: 0.75rem;
  font-style: italic;
}

.manual-option {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #e5e7eb;
}

.divider span {
  padding: 0 1rem;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-manual {
  width: 100%;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9375rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-manual:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.btn-manual:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.manual-hint {
  margin-top: 0.75rem;
  font-size: 0.8125rem;
  color: #6b7280;
  text-align: center;
  line-height: 1.5;
}

.info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 0.5rem;
  padding: 1rem;
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-content strong {
  display: block;
  color: #0369a1;
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
}

.info-content .hint {
  margin: 0;
  color: #64748b;
  font-size: 0.8125rem;
  line-height: 1.5;
}

.success-message {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #d1fae5;
  color: #065f46;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #10b981;
}

.success-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.success-message p {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background: #e5e7eb;
}

.btn-secondary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #25D366;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: #20BA5A;
  transform: translateY(-1px);
  box-shadow: 0 6px 12px rgba(37, 211, 102, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}


</style>




