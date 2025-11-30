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
        <h1>Manajemen Tanaman</h1>
        <p class="subtitle">Kelola data tanaman</p>
      </div>
      <button @click="showAddModal = true" class="btn-add">
        + Tambah Tanaman
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && plants.length === 0" class="loading">
      Memuat data tanaman...
    </div>

    <!-- Empty State -->
    <div v-else-if="plants.length === 0" class="empty-state">
      <p>Belum ada tanaman</p>
      <button @click="showAddModal = true" class="btn-primary">
        Tambah Tanaman Pertama
      </button>
    </div>

    <!-- Plants List -->
    <div v-else class="list-container">
      <div v-for="plant in plants" :key="plant.id" class="card">
        <div class="card-header">
          <h3>{{ plant.name }}</h3>
          <span v-if="plant.scientific_name" class="scientific-name">
            {{ plant.scientific_name }}
          </span>
        </div>
        <p class="card-description">{{ plant.description || 'Tidak ada deskripsi' }}</p>
        <div class="card-actions">
          <button @click="editPlant(plant)" class="btn-edit">Edit</button>
          <button @click="confirmDelete(plant)" class="btn-delete">Hapus</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Edit Tanaman' : 'Tambah Tanaman Baru' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="savePlant" class="form">
          <div class="form-group">
            <label>Nama Tanaman *</label>
            <input v-model="form.name" type="text" required :disabled="saving" />
          </div>

          <div class="form-group">
            <label>Nama Ilmiah</label>
            <input v-model="form.scientific_name" type="text" :disabled="saving" />
          </div>

          <div class="form-group">
            <label>Deskripsi</label>
            <textarea v-model="form.description" rows="4" :disabled="saving"></textarea>
          </div>

          <div class="form-group">
            <label>Panduan Perawatan</label>
            <textarea v-model="form.care_guide" rows="6" :disabled="saving"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button type="button" @click="closeModal" :disabled="saving" class="btn-cancel">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Hapus Tanaman</h2>
          <button @click="showDeleteModal = false" class="btn-close">×</button>
        </div>

        <div class="delete-warning">
          <p>Apakah Anda yakin ingin menghapus tanaman ini?</p>
          <p class="warning-text">Tindakan ini tidak dapat dibatalkan!</p>
          <div class="detail-item">
            <strong>Nama:</strong> {{ deletePlant?.name }}
          </div>
        </div>

        <div class="form-actions">
          <button @click="deletePlantConfirm" :disabled="deleting" class="btn-delete-confirm">
            {{ deleting ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
          <button @click="showDeleteModal = false" :disabled="deleting" class="btn-cancel">
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const plants = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const currentPlant = ref(null)
const deletePlant = ref(null)

const form = ref({
  name: '',
  scientific_name: '',
  description: '',
  care_guide: ''
})

const getToken = () => localStorage.getItem('auth_token')

onMounted(() => {
  fetchPlants()
})

const fetchPlants = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/plants`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (response.data.success) {
      plants.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching plants:', error)
    alert('Gagal memuat data tanaman')
  } finally {
    loading.value = false
  }
}

const editPlant = (plant) => {
  currentPlant.value = plant
  form.value = {
    name: plant.name,
    scientific_name: plant.scientific_name || '',
    description: plant.description || '',
    care_guide: plant.care_guide || ''
  }
  showEditModal.value = true
}

const confirmDelete = (plant) => {
  deletePlant.value = plant
  showDeleteModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    name: '',
    scientific_name: '',
    description: '',
    care_guide: ''
  }
  currentPlant.value = null
}

const savePlant = async () => {
  saving.value = true
  try {
    const url = showEditModal.value
      ? `${API_BASE_URL}/admin/plants/${currentPlant.value.id}`
      : `${API_BASE_URL}/admin/plants`
    
    const method = showEditModal.value ? 'put' : 'post'
    
    const response = await axios[method](url, form.value, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert('Tanaman berhasil disimpan')
      closeModal()
      fetchPlants()
    }
  } catch (error) {
    console.error('Error saving plant:', error)
    const message = error.response?.data?.message || 'Gagal menyimpan tanaman'
    alert(message)
  } finally {
    saving.value = false
  }
}

const deletePlantConfirm = async () => {
  deleting.value = true
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/plants/${deletePlant.value.id}`,
      {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      }
    )

    if (response.data.success) {
      alert('Tanaman berhasil dihapus')
      showDeleteModal.value = false
      deletePlant.value = null
      fetchPlants()
    }
  } catch (error) {
    console.error('Error deleting plant:', error)
    alert('Gagal menghapus tanaman')
  } finally {
    deleting.value = false
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 1200px;
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

.list-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.scientific-name {
  font-style: italic;
  color: #666;
  font-size: 0.9rem;
}

.card-description {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
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
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
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

.delete-warning {
  margin-bottom: 1.5rem;
}

.delete-warning p {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.warning-text {
  color: #e74c3c;
  font-weight: 600;
}

.detail-item {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.btn-delete-confirm {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-delete-confirm:hover:not(:disabled) {
  background: #c0392b;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.btn-primary {
  margin-top: 1rem;
}
</style>


