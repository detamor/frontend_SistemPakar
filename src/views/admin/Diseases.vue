<template>
  <div class="admin-container">
    <div class="page-header">
      <div>
        <!-- Tombol Kembali -->
        <div class="mb-4">
          <router-link
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            <span>←</span>
            <span>Kembali ke Home</span>
          </router-link>
        </div>
        <h1>Tabel Certainty Factor Pakar</h1>
        <p class="subtitle">Kelola nilai CF untuk kombinasi Gejala x Penyakit</p>
      </div>
      <div class="header-actions">
        <button @click="showDiseaseModal = true" class="btn-add">
          + Tambah Penyakit
        </button>
        <button @click="showSymptomModal = true" class="btn-add">
          + Tambah Gejala
        </button>
      </div>
    </div>

    <!-- Filter Tanaman -->
    <div class="filter-section">
      <label>Filter Tanaman:</label>
      <select v-model="selectedPlantId" @change="fetchMatrix" class="filter-select">
        <option value="">Semua Tanaman</option>
        <option v-for="plant in plants" :key="plant.id" :value="plant.id">
          {{ plant.name }}
        </option>
      </select>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      Memuat tabel Certainty Factor...
    </div>

    <!-- Empty State -->
    <div v-else-if="!matrixData || matrixData.length === 0" class="empty-state">
      <p>Belum ada data gejala atau penyakit</p>
      <div>
        <button @click="showDiseaseModal = true" class="btn-primary">
          Tambah Penyakit
        </button>
        <button @click="showSymptomModal = true" class="btn-primary">
          Tambah Gejala
        </button>
      </div>
    </div>

    <!-- Matrix Table -->
    <div v-else class="matrix-container">
      <div class="matrix-header">
        <h2>Tabel Certainty Factor (CF) Pakar</h2>
        <p class="matrix-info">
          Tabel berikut menampilkan nilai Certainty Factor (CF) untuk setiap kombinasi gejala dan penyakit.
          Nilai CF berkisar dari 0.0 sampai 1.0. Klik pada sel untuk mengedit nilai CF.
        </p>
      </div>

      <div class="table-scroll-wrapper">
        <table class="cf-matrix-table">
          <thead>
            <tr>
              <th rowspan="2" class="sticky-col">No</th>
              <th rowspan="2" class="sticky-col">Kode Gejala</th>
              <th rowspan="2" class="sticky-col">Nama Gejala</th>
              <th v-for="disease in diseases" :key="disease.id" class="disease-header-cell">
                {{ disease.code }}
                <div class="disease-name">{{ disease.name }}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in matrixData" :key="row.symptom_id">
              <td class="sticky-col">{{ rowIndex + 1 }}</td>
              <td class="sticky-col">
                <span class="code-badge">{{ row.symptom_code }}</span>
              </td>
              <td class="sticky-col symptom-name">{{ row.symptom_description }}</td>
              <td 
                v-for="(diseaseCF, diseaseIndex) in row.diseases" 
                :key="diseaseCF.disease_id"
                class="cf-cell"
                :class="{ 'has-value': diseaseCF.certainty_factor > 0 }"
              >
                <input
                  v-model.number="diseaseCF.certainty_factor"
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  placeholder="0.0"
                  class="cf-input-cell"
                  @change="updateCFValue(row.symptom_id, diseaseCF.disease_id, diseaseCF.certainty_factor)"
                  @blur="updateCFValue(row.symptom_id, diseaseCF.disease_id, diseaseCF.certainty_factor)"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Add/Edit Disease Modal -->
    <div v-if="showDiseaseModal" class="modal-overlay" @click="showDiseaseModal = false">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ currentDisease ? 'Edit Penyakit' : 'Tambah Penyakit Baru' }}</h2>
          <button @click="closeDiseaseModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="saveDisease" class="form">
          <div class="form-row">
            <div class="form-group">
              <label>Nama Penyakit *</label>
              <input v-model="diseaseForm.name" type="text" required :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Kode Penyakit *</label>
              <input v-model="diseaseForm.code" type="text" required :disabled="saving || currentDisease" />
              <small>Contoh: P01, P02, dll</small>
            </div>
          </div>

          <div class="form-group">
            <label>Tanaman</label>
            <select v-model="diseaseForm.plant_id" :disabled="saving">
              <option value="">Pilih Tanaman</option>
              <option v-for="plant in plants" :key="plant.id" :value="plant.id">
                {{ plant.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Deskripsi *</label>
            <textarea v-model="diseaseForm.description" rows="3" required :disabled="saving"></textarea>
          </div>

          <div class="form-group">
            <label>Penyebab</label>
            <textarea v-model="diseaseForm.cause" rows="2" :disabled="saving"></textarea>
          </div>

          <div class="form-group">
            <label>Solusi</label>
            <textarea v-model="diseaseForm.solution" rows="3" :disabled="saving"></textarea>
          </div>

          <div class="form-group">
            <label>Pencegahan</label>
            <textarea v-model="diseaseForm.prevention" rows="2" :disabled="saving"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button type="button" @click="closeDiseaseModal" :disabled="saving" class="btn-cancel">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Symptom Modal -->
    <div v-if="showSymptomModal" class="modal-overlay" @click="showSymptomModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ currentSymptom ? 'Edit Gejala' : 'Tambah Gejala Baru' }}</h2>
          <button @click="closeSymptomModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="saveSymptom" class="form">
          <div class="form-row">
            <div class="form-group">
              <label>Kode Gejala *</label>
              <input v-model="symptomForm.code" type="text" required :disabled="saving || currentSymptom" />
              <small>Contoh: G1, G2, dll</small>
            </div>
            <div class="form-group">
              <label>Kategori</label>
              <select v-model="symptomForm.category" :disabled="saving">
                <option value="">Pilih Kategori (opsional)</option>
                <option value="DAUN">DAUN</option>
                <option value="BATANG">BATANG</option>
                <option value="AKAR">AKAR</option>
                <option value="BUNGA">BUNGA</option>
                <option value="UMUM">UMUM</option>
              </select>
              <small>Pilih bagian tanaman yang terkena gejala</small>
            </div>
          </div>

          <div class="form-group">
            <label>Deskripsi Gejala *</label>
            <textarea v-model="symptomForm.description" rows="3" required :disabled="saving"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button type="button" @click="closeSymptomModal" :disabled="saving" class="btn-cancel">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const matrixData = ref([])
const diseases = ref([])
const plants = ref([])
const loading = ref(false)
const saving = ref(false)
const selectedPlantId = ref('')
const showDiseaseModal = ref(false)
const showSymptomModal = ref(false)
const currentDisease = ref(null)
const currentSymptom = ref(null)

const diseaseForm = ref({
  name: '',
  code: '',
  description: '',
  plant_id: '',
  cause: '',
  solution: '',
  prevention: ''
})

const symptomForm = ref({
  code: '',
  description: '',
  category: ''
})

const getToken = () => localStorage.getItem('auth_token')

onMounted(() => {
  fetchPlants()
  fetchMatrix()
})

const fetchPlants = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/plants`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (response.data.success) {
      plants.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching plants:', error)
  }
}

const fetchMatrix = async () => {
  loading.value = true
  try {
    const params = selectedPlantId.value ? { plant_id: selectedPlantId.value } : {}
    const response = await axios.get(`${API_BASE_URL}/admin/cf-matrix`, {
      params,
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    
    if (response.data.success) {
      matrixData.value = response.data.data.matrix
      diseases.value = response.data.data.diseases
    }
  } catch (error) {
    console.error('Error fetching matrix:', error)
    alert('Gagal memuat tabel Certainty Factor')
  } finally {
    loading.value = false
  }
}

const updateCFValue = async (symptomId, diseaseId, cfValue) => {
  if (cfValue === null || cfValue === undefined || cfValue === '') {
    return
  }

  const cf = parseFloat(cfValue)
  if (isNaN(cf) || cf < 0 || cf > 1) {
    alert('Nilai CF harus antara 0.0 dan 1.0')
    return
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/admin/cf-matrix/update`,
      {
        symptom_id: symptomId,
        disease_id: diseaseId,
        certainty_factor: cf
      },
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.success) {
      // Success, data sudah diupdate
      console.log('CF value updated successfully')
    }
  } catch (error) {
    console.error('Error updating CF value:', error)
    alert('Gagal menyimpan nilai CF')
    // Reload matrix to revert changes
    fetchMatrix()
  }
}

const saveDisease = async () => {
  // Validasi form
  if (!diseaseForm.value.name || !diseaseForm.value.code || !diseaseForm.value.description) {
    alert('Harap lengkapi semua field yang wajib diisi (Nama, Kode, Deskripsi)')
    return
  }

  saving.value = true
  try {
    const url = currentDisease.value
      ? `${API_BASE_URL}/admin/diseases/${currentDisease.value.id}`
      : `${API_BASE_URL}/admin/diseases`
    
    const method = currentDisease.value ? 'put' : 'post'
    const data = {
      name: diseaseForm.value.name.trim(),
      code: diseaseForm.value.code.trim(),
      description: diseaseForm.value.description.trim(),
      plant_id: diseaseForm.value.plant_id ? parseInt(diseaseForm.value.plant_id) : null,
      cause: diseaseForm.value.cause?.trim() || null,
      solution: diseaseForm.value.solution?.trim() || null,
      prevention: diseaseForm.value.prevention?.trim() || null
    }
    
    const response = await axios[method](url, data, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert(response.data.message || 'Penyakit berhasil disimpan')
      closeDiseaseModal()
      fetchMatrix()
    }
  } catch (error) {
    console.error('Error saving disease:', error)
    let message = 'Gagal menyimpan penyakit'
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.values(errors).flat().join(', ')
      message = `Error: ${errorMessages}`
    } else if (error.response?.data?.message) {
      message = error.response.data.message
    }
    
    alert(message)
  } finally {
    saving.value = false
  }
}

const saveSymptom = async () => {
  const code = (symptomForm.value.code || '').trim()
  const description = (symptomForm.value.description || '').trim()
  const category = (symptomForm.value.category || '').trim() || null

  if (!code || !description) {
    alert('Kode dan Deskripsi Gejala wajib diisi.')
    return
  }

  saving.value = true
  try {
    const url = currentSymptom.value
      ? `${API_BASE_URL}/admin/symptoms/${currentSymptom.value.id}`
      : `${API_BASE_URL}/admin/symptoms`

    const method = currentSymptom.value ? 'put' : 'post'
    const data = {
      code,
      description,
      category
    }
    
    const response = await axios[method](url, data, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert(response.data.message || 'Gejala berhasil disimpan')
      closeSymptomModal()
      fetchMatrix()
    }
  } catch (error) {
    console.error('Error saving symptom:', error)
    let message = 'Gagal menyimpan gejala'
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.values(errors).flat().join(', ')
      message = `Error: ${errorMessages}`
    } else if (error.response?.data?.message) {
      message = error.response.data.message
    }
    
    alert(message)
  } finally {
    saving.value = false
  }
}

const closeDiseaseModal = () => {
  showDiseaseModal.value = false
  currentDisease.value = null
  diseaseForm.value = {
    name: '',
    code: '',
    description: '',
    plant_id: '',
    cause: '',
    solution: '',
    prevention: ''
  }
}

const closeSymptomModal = () => {
  showSymptomModal.value = false
  currentSymptom.value = null
  symptomForm.value = {
    code: '',
    description: '',
    category: ''
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-add {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.btn-add:hover {
  background: #34495e;
}

.filter-section {
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.filter-section label {
  font-weight: 500;
  color: #2c3e50;
}

.filter-select {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  min-width: 200px;
}

.matrix-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.matrix-header {
  margin-bottom: 1.5rem;
}

.matrix-header h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.matrix-info {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

.table-scroll-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  max-width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.cf-matrix-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 800px;
}

.cf-matrix-table thead {
  background: #2c3e50;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.cf-matrix-table th {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid #34495e;
}

.disease-header-cell {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  min-width: 80px;
  max-width: 120px;
}

.disease-name {
  font-size: 0.75rem;
  font-weight: 400;
  margin-top: 0.5rem;
}

.sticky-col {
  position: sticky;
  background: white;
  z-index: 5;
}

.sticky-col:nth-child(1) {
  left: 0;
  background: #2c3e50;
  color: white;
  text-align: center;
  font-weight: 600;
}

.sticky-col:nth-child(2) {
  left: 60px;
  background: #34495e;
  color: white;
  text-align: center;
}

.sticky-col:nth-child(3) {
  left: 140px;
  background: #ecf0f1;
  font-weight: 500;
}

.cf-matrix-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
}

.cf-matrix-table tbody tr:hover {
  background: #f8f9fa;
}

.cf-matrix-table td {
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.symptom-name {
  text-align: left;
  padding-left: 1rem;
  font-size: 0.9rem;
  max-width: 250px;
}

.cf-cell {
  padding: 0.25rem;
  vertical-align: middle;
}

.cf-cell.has-value {
  background: #e8f5e9;
}

.cf-input-cell {
  width: 70px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.cf-input-cell:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.code-badge {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state button {
  margin: 0.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.large-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
}

.btn-close:hover {
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background: #34495e;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-cancel:hover:not(:disabled) {
  background: #7f8c8d;
}
</style>