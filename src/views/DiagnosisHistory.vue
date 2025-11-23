<template>
  <div class="history-container">
    <div class="history-header">
      <h1>Riwayat Diagnosis</h1>
      <router-link to="/diagnosis" class="btn-new-diagnosis">
        + Diagnosis Baru
      </router-link>
    </div>

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
          </div>
        </div>

        <div v-else class="item-result">
          <span class="no-result">Belum ada hasil diagnosis</span>
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
            Download PDF
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDiagnosisStore } from '../stores/diagnosis'

const diagnosisStore = useDiagnosisStore()

const loading = ref(false)
const currentPage = ref(1)
const hasNextPage = ref(false)

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

onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.history-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.history-header h1 {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.btn-new-diagnosis {
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-new-diagnosis:hover {
  background: #5568d3;
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
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.3s;
}

.history-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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

.item-actions {
  display: flex;
  gap: 1rem;
}

.btn-view,
.btn-download {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.btn-view {
  background: #667eea;
  color: white;
}

.btn-view:hover {
  background: #5568d3;
}

.btn-download {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
}

.btn-download:hover:not(:disabled) {
  background: #f5f5f5;
}

.btn-download:disabled {
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
</style>


