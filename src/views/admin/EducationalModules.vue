<template>
  <div class="admin-education-container">
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
        <h1>Modul Edukasi Perawatan Tanaman</h1>
        <p class="subtitle">Kelola modul edukasi tentang cara merawat tanaman</p>
      </div>
      <button @click="showAddModal = true" class="btn-add">
        + Tambah Modul
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && modules.length === 0" class="loading">
      Memuat modul edukasi...
    </div>

    <!-- Empty State -->
    <div v-else-if="modules.length === 0" class="empty-state">
      <p>Belum ada modul edukasi</p>
      <button @click="showAddModal = true" class="btn-primary">
        Tambah Modul Pertama
      </button>
    </div>

    <!-- Modules List -->
    <div v-else class="modules-list">
      <div
        v-for="module in modules"
        :key="module.id"
        class="module-card"
      >
        <div class="module-header">
          <h3>{{ module.title }}</h3>
          <span v-if="module.category" class="module-category">
            {{ module.category }}
          </span>
        </div>
        <p class="module-description">
          {{ module.description || 'Tidak ada deskripsi' }}
        </p>
        <p class="module-content-preview">
          {{ truncateText(module.content, 100) }}
        </p>
        <div class="module-actions">
          <button @click="editModule(module)" class="btn-edit">
            Edit
          </button>
          <button @click="confirmDelete(module)" class="btn-delete">
            Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Edit Modul Edukasi' : 'Tambah Modul Edukasi Baru' }}</h2>
          <p class="modal-subtitle">
            {{ showEditModal ? 'Perbarui informasi modul edukasi perawatan tanaman' : 'Isi form di bawah untuk menambah modul edukasi perawatan tanaman' }}
          </p>
          <button @click="closeModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="saveModule" class="module-form">
          <div class="form-section">
            <h3>Informasi Modul</h3>
            <div v-if="showEditModal" class="module-id">
              ID: {{ currentModule.id }}
            </div>

            <div class="form-group">
              <label for="title">Judul Modul *</label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                placeholder="Contoh: Cara Memangkas Tanaman"
                required
                :disabled="saving"
              />
            </div>

            <div class="form-group">
              <label for="category">Kategori *</label>
              <input
                id="category"
                v-model="form.category"
                type="text"
                placeholder="Contoh: Perawatan Dasar"
                required
                :disabled="saving"
              />
            </div>

            <div class="form-group">
              <label for="description">Deskripsi Singkat *</label>
              <textarea
                id="description"
                v-model="form.description"
                placeholder="Deskripsi singkat tentang modul ini"
                rows="3"
                required
                :disabled="saving"
              ></textarea>
            </div>

            <div class="form-group">
              <label for="content">Konten Edukasi *</label>
              <textarea
                id="content"
                v-model="form.content"
                placeholder="Tulis konten edukasi lengkap di sini"
                rows="10"
                required
                :disabled="saving"
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="saving" class="btn-save">
              {{ saving ? 'Menyimpan...' : (showEditModal ? 'Simpan Perubahan' : 'Simpan Modul') }}
            </button>
            <button type="button" @click="closeModal" :disabled="saving" class="btn-cancel">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content delete-modal" @click.stop>
        <div class="modal-header">
          <h2>Hapus Modul Edukasi</h2>
          <p class="modal-subtitle">Konfirmasi penghapusan modul edukasi</p>
        </div>

        <div class="delete-warning">
          <div class="warning-icon">⚠️</div>
          <div>
            <h3>Apakah Anda yakin ingin menghapus modul ini?</h3>
            <p>Tindakan ini tidak dapat dibatalkan. Modul yang dihapus tidak dapat dikembalikan.</p>
          </div>
        </div>

        <div class="module-details">
          <h4>Detail Modul yang Akan Dihapus:</h4>
          <div class="detail-item">
            <span class="detail-label">Judul:</span>
            <span class="detail-value">{{ deleteModule.title }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Kategori:</span>
            <span class="detail-value">{{ deleteModule.category }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Deskripsi:</span>
            <span class="detail-value">{{ deleteModule.description }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Konten:</span>
            <span class="detail-value">{{ truncateText(deleteModule.content, 100) }}</span>
          </div>
        </div>

        <div class="form-actions">
          <button @click="deleteModuleConfirm" :disabled="deleting" class="btn-delete-confirm">
            {{ deleting ? 'Menghapus...' : 'Ya, Hapus Modul' }}
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
import { useAdminStore } from '../../stores/admin'
import axios from 'axios'

const adminStore = useAdminStore()

const modules = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const currentModule = ref(null)
const deleteModule = ref(null)

const form = ref({
  title: '',
  category: '',
  description: '',
  content: ''
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

onMounted(() => {
  fetchModules()
})

const fetchModules = async () => {
  loading.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const response = await axios.get(`${API_BASE_URL}/admin/education`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (response.data.success) {
      modules.value = response.data.data.data || response.data.data
    }
  } catch (error) {
    console.error('Error fetching modules:', error)
    alert('Gagal memuat modul edukasi')
  } finally {
    loading.value = false
  }
}

const editModule = (module) => {
  currentModule.value = module
  form.value = {
    title: module.title,
    category: module.category || '',
    description: module.description || '',
    content: module.content
  }
  showEditModal.value = true
}

const confirmDelete = (module) => {
  deleteModule.value = module
  showDeleteModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    title: '',
    category: '',
    description: '',
    content: ''
  }
  currentModule.value = null
}

const saveModule = async () => {
  saving.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const url = showEditModal.value
      ? `${API_BASE_URL}/admin/education/${currentModule.value.id}`
      : `${API_BASE_URL}/admin/education`
    
    const method = showEditModal.value ? 'put' : 'post'
    
    const response = await axios[method](url, form.value, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert(response.data.message || 'Modul berhasil disimpan')
      closeModal()
      fetchModules()
    }
  } catch (error) {
    console.error('Error saving module:', error)
    const message = error.response?.data?.message || 'Gagal menyimpan modul'
    alert(message)
  } finally {
    saving.value = false
  }
}

const deleteModuleConfirm = async () => {
  deleting.value = true
  try {
    const token = localStorage.getItem('auth_token')
    const response = await axios.delete(
      `${API_BASE_URL}/admin/education/${deleteModule.value.id}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    )

    if (response.data.success) {
      alert('Modul berhasil dihapus')
      showDeleteModal.value = false
      deleteModule.value = null
      fetchModules()
    }
  } catch (error) {
    console.error('Error deleting module:', error)
    alert('Gagal menghapus modul')
  } finally {
    deleting.value = false
  }
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped>
.admin-education-container {
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

.modules-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.module-header h3 {
  font-size: 1.25rem;
  color: #2c3e50;
  margin: 0;
}

.module-category {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #666;
}

.module-description {
  color: #555;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.module-content-preview {
  color: #666;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.module-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

.btn-edit,
.btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background: #f0f0f0;
  color: #333;
}

.btn-edit:hover {
  background: #e0e0e0;
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
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  position: relative;
}

.modal-header {
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.modal-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.btn-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
}

.btn-close:hover {
  color: #333;
}

.form-section {
  margin-bottom: 1.5rem;
}

.form-section h3 {
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: #2c3e50;
}

.module-id {
  text-align: right;
  color: #999;
  font-size: 0.85rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-save {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-save:hover:not(:disabled) {
  background: #34495e;
}

.btn-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: white;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-cancel:hover:not(:disabled) {
  background: #f5f5f5;
}

.delete-modal {
  max-width: 600px;
}

.delete-warning {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.warning-icon {
  font-size: 2rem;
}

.delete-warning h3 {
  margin: 0 0 0.5rem 0;
  color: #856404;
}

.delete-warning p {
  margin: 0;
  color: #856404;
}

.module-details {
  margin-bottom: 1.5rem;
}

.module-details h4 {
  margin-bottom: 1rem;
  color: #333;
}

.detail-item {
  display: flex;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.detail-label {
  font-weight: 500;
  color: #666;
  min-width: 100px;
}

.detail-value {
  color: #333;
  flex: 1;
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

.btn-delete-confirm:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state button {
  margin-top: 1rem;
}
</style>


