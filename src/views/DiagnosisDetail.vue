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
          <button @click="downloadPdf" class="btn-download" :disabled="downloading">
            {{ downloading ? 'Mengunduh...' : '📄 Download PDF' }}
          </button>
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
      <div v-if="diagnosis.disease" class="result-section">
        <h2>Hasil Diagnosis</h2>
        <div class="result-card">
          <div class="result-header">
            <h3>{{ diagnosis.disease.name }}</h3>
            <div class="cf-badge">
              <span class="cf-label">Tingkat Kepastian:</span>
              <span class="cf-value">{{ (diagnosis.certainty_value * 100).toFixed(1) }}%</span>
            </div>
          </div>

          <div class="cf-indicator">
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

          <div class="disease-info">
            <div v-if="diagnosis.disease.description" class="info-block">
              <h4>Deskripsi:</h4>
              <p>{{ diagnosis.disease.description }}</p>
            </div>

            <div v-if="diagnosis.disease.cause" class="info-block">
              <h4>Penyebab:</h4>
              <p>{{ diagnosis.disease.cause }}</p>
            </div>

            <div v-if="diagnosis.disease.solution" class="info-block">
              <h4>Solusi Penanganan:</h4>
              <p>{{ diagnosis.disease.solution }}</p>
            </div>

            <div v-if="diagnosis.disease.prevention" class="info-block">
              <h4>Pencegahan:</h4>
              <p>{{ diagnosis.disease.prevention }}</p>
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
      <div class="symptoms-section">
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
              CF User: {{ (symptom.pivot?.user_cf * 100 || 0).toFixed(0) }}%
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

      <!-- Actions -->
      <div class="actions-section">
        <router-link
          to="/consultation"
          class="btn-consult"
          :state="{ diagnosisId: diagnosis.id }"
        >
          💬 Konsultasi dengan Pakar
        </router-link>
        <router-link to="/diagnosis" class="btn-new">
          + Diagnosis Baru
        </router-link>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Diagnosis tidak ditemukan</p>
      <router-link to="/diagnosis/history" class="btn-primary">
        Kembali ke Riwayat
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDiagnosisStore } from '../stores/diagnosis'

const route = useRoute()
const router = useRouter()
const diagnosisStore = useDiagnosisStore()

const loading = ref(true)
const downloading = ref(false)

const diagnosis = computed(() => diagnosisStore.currentDiagnosis)

const loadDetail = async () => {
  loading.value = true
  try {
    await diagnosisStore.fetchDetail(route.params.id)
  } catch (error) {
    console.error('Error loading diagnosis detail:', error)
  } finally {
    loading.value = false
  }
}

const downloadPdf = async () => {
  downloading.value = true
  try {
    await diagnosisStore.downloadPdf(route.params.id)
  } catch (error) {
    alert('Gagal mengunduh PDF. Pastikan endpoint PDF sudah diimplementasikan.')
  } finally {
    downloading.value = false
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

.btn-download,
.btn-back {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-download {
  background: #28a745;
  color: white;
}

.btn-download:hover:not(:disabled) {
  background: #218838;
}

.btn-download:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-back {
  background: #6c757d;
  color: white;
}

.btn-back:hover {
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
</style>


