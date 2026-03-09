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
        <h1>Manajemen Gejala</h1>
        <p class="subtitle">Kelola gejala penyakit</p>
      </div>
      <button @click="showAddModal = true" class="btn-add">
        + Tambah Gejala
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && symptoms.length === 0" class="loading">
      Memuat data gejala...
    </div>

    <!-- Empty State -->
    <div v-else-if="symptoms.length === 0" class="empty-state">
      <p>Belum ada gejala</p>
      <button @click="showAddModal = true" class="btn-primary">
        Tambah Gejala Pertama
      </button>
    </div>

    <!-- Symptoms List -->
    <div v-else class="list-container">
      <div v-for="symptom in symptoms" :key="symptom.id" class="card">
        <div class="card-header">
          <h3>{{ symptom.code }}</h3>
          <span v-if="symptom.category" class="category">
            {{ symptom.category }}
          </span>
        </div>
        <p class="card-description">{{ symptom.description }}</p>
        <div class="card-actions">
          <button @click="editSymptom(symptom)" class="btn-edit">Edit</button>
          <button @click="confirmDelete(symptom)" class="btn-delete">Hapus</button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Edit Gejala' : 'Tambah Gejala Baru' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="saveSymptom" class="form">
          <div class="form-group">
            <label>Kode Gejala *</label>
            <input v-model="form.code" type="text" required :disabled="saving" />
            <small>Contoh: G01, G02, dll</small>
          </div>

          <div class="form-group">
            <label>Deskripsi Gejala *</label>
            <textarea v-model="form.description" rows="4" required :disabled="saving"></textarea>
          </div>

          <div class="form-group">
            <label>Kategori</label>
            <input v-model="form.category" type="text" :disabled="saving" />
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
          <h2>Hapus Gejala</h2>
          <button @click="showDeleteModal = false" class="btn-close">×</button>
        </div>

        <div class="delete-warning">
          <p>Apakah Anda yakin ingin menghapus gejala ini?</p>
          <p class="warning-text">Tindakan ini tidak dapat dibatalkan!</p>
          <div class="detail-item">
            <strong>Kode:</strong> {{ deleteSymptom?.code }}
          </div>
          <div class="detail-item">
            <strong>Deskripsi:</strong> {{ deleteSymptom?.description }}
          </div>
        </div>

        <div class="form-actions">
          <button @click="deleteSymptomConfirm" :disabled="deleting" class="btn-delete-confirm">
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

const symptoms = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const currentSymptom = ref(null)
const deleteSymptom = ref(null)

const form = ref({
  code: '',
  description: '',
  category: ''
})

const getToken = () => localStorage.getItem('auth_token')

onMounted(() => {
  fetchSymptoms()
})

const fetchSymptoms = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/symptoms`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (response.data.success) {
      symptoms.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching symptoms:', error)
    alert('Gagal memuat data gejala')
  } finally {
    loading.value = false
  }
}

const editSymptom = (symptom) => {
  currentSymptom.value = symptom
  form.value = {
    code: symptom.code,
    description: symptom.description,
    category: symptom.category || ''
  }
  showEditModal.value = true
}

const confirmDelete = (symptom) => {
  deleteSymptom.value = symptom
  showDeleteModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    code: '',
    description: '',
    category: ''
  }
  currentSymptom.value = null
}

const saveSymptom = async () => {
  const code = (form.value.code || '').trim()
  const description = (form.value.description || '').trim()
  const category = (form.value.category || '').trim() || null

  if (!code || !description) {
    alert('Kode dan Deskripsi Gejala wajib diisi.')
    return
  }

  saving.value = true
  try {
    const url = showEditModal.value
      ? `${API_BASE_URL}/admin/symptoms/${currentSymptom.value.id}`
      : `${API_BASE_URL}/admin/symptoms`

    const method = showEditModal.value ? 'put' : 'post'
    const payload = {
      code,
      description,
      category: category || null
    }

    const response = await axios[method](url, payload, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert('Gejala berhasil disimpan')
      closeModal()
      fetchSymptoms()
    }
  } catch (error) {
    console.error('Error saving symptom:', error)
    let message = error.response?.data?.message || 'Gagal menyimpan gejala'
    if (error.response?.data?.errors) {
      const err = error.response.data.errors
      const parts = Object.entries(err).map(([k, v]) => Array.isArray(v) ? v.join(', ') : v)
      message = parts.join('\n')
    }
    alert(message)
  } finally {
    saving.value = false
  }
}

const deleteSymptomConfirm = async () => {
  deleting.value = true
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/symptoms/${deleteSymptom.value.id}`,
      {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      }
    )

    if (response.data.success) {
      alert('Gejala berhasil dihapus')
      showDeleteModal.value = false
      deleteSymptom.value = null
      fetchSymptoms()
    }
  } catch (error) {
    console.error('Error deleting symptom:', error)
    alert('Gagal menghapus gejala')
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

.category {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
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


