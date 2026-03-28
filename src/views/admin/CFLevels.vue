<template>
  <div class="admin-container">
    <div class="page-header">
      <div>

        <h1>Manajemen Bobot Nilai CF</h1>
        <p class="subtitle">Kelola keterangan dan bobot nilai Certainty Factor</p>
      </div>
      <button @click="showAddModal = true" class="btn-add">
        + Tambah Bobot Nilai
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && cfLevels.length === 0" class="loading">
      Memuat data bobot nilai...
    </div>

    <!-- Empty State -->
    <div v-else-if="cfLevels.length === 0" class="empty-state">
      <p>Belum ada bobot nilai</p>
      <button @click="showAddModal = true" class="btn-primary">
        Tambah Bobot Nilai Pertama
      </button>
    </div>

    <!-- CF Levels Table -->
    <div v-else class="table-container">
      <p class="cf-levels-note">
        <span class="cf-levels-note-mark" aria-hidden="true">*</span>
        Jika pengguna tidak yakin, pengguna tidak perlu memilih gejala tersebut pada diagnosis. Hanya gejala yang dipilih yang memakai bobot CF; gejala yang tidak dipilih tidak masuk perhitungan, sesuai alur sistem.
      </p>
      <table class="cf-levels-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Keterangan</th>
            <th>Bobot Nilai</th>
            <th>Persentase</th>
            <th>Urutan</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(level, index) in cfLevels" :key="level.id">
            <td>{{ index + 1 }}</td>
            <td><strong>{{ level.label }}</strong></td>
            <td>
              <span class="value-badge">{{ level.value }}</span>
            </td>
            <td>{{ (parseFloat(level.value) * 100).toFixed(0) }}%</td>
            <td>{{ level.order }}</td>
            <td>
              <span :class="level.is_active ? 'status-active' : 'status-inactive'">
                {{ level.is_active ? 'Aktif' : 'Tidak Aktif' }}
              </span>
            </td>
            <td>
              <button @click="editCFLevel(level)" class="btn-edit-small">Edit</button>
              <button @click="confirmDelete(level)" class="btn-delete-small">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Edit Bobot Nilai' : 'Tambah Bobot Nilai Baru' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="saveCFLevel" class="form">
          <div class="form-group">
            <label>Keterangan *</label>
            <input v-model="form.label" type="text" required :disabled="saving" />
            <small>Contoh: Tidak Yakin, Sedikit Yakin, dll</small>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Bobot Nilai *</label>
              <input 
                v-model.number="form.value" 
                type="number" 
                step="0.1" 
                min="0" 
                max="1" 
                required 
                :disabled="saving" 
              />
              <small>Nilai antara 0.0 sampai 1.0</small>
            </div>
            <div class="form-group">
              <label>Urutan *</label>
              <input 
                v-model.number="form.order" 
                type="number" 
                min="1" 
                required 
                :disabled="saving" 
              />
              <small>Urutan tampilan harus unik — tidak boleh sama dengan level lain (1, 2, 3, …).</small>
            </div>
          </div>

          <div class="form-group">
            <label>
              <input 
                v-model="form.is_active" 
                type="checkbox" 
                :disabled="saving" 
              />
              Aktif
            </label>
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
          <h2>Hapus Bobot Nilai</h2>
          <button @click="showDeleteModal = false" class="btn-close">×</button>
        </div>

        <div class="delete-warning">
          <p>Apakah Anda yakin ingin menghapus bobot nilai ini?</p>
          <p class="warning-text">Tindakan ini tidak dapat dibatalkan!</p>
          <div class="detail-item">
            <strong>Keterangan:</strong> {{ deleteCFLevel?.label }}
          </div>
          <div class="detail-item">
            <strong>Bobot Nilai:</strong> {{ deleteCFLevel?.value }}
          </div>
        </div>

        <div class="form-actions">
          <button @click="deleteCFLevelConfirm" :disabled="deleting" class="btn-delete-confirm">
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
import api from '../../services/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const cfLevels = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const currentCFLevel = ref(null)
const deleteCFLevel = ref(null)

const form = ref({
  label: '',
  value: 0,
  order: 1,
  is_active: true
})

const getToken = () => localStorage.getItem('auth_token')

onMounted(() => {
  fetchCFLevels()
})

const fetchCFLevels = async () => {
  loading.value = true
  try {
    const response = await api.get(`${API_BASE_URL}/admin/cf-levels`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (response.data.success) {
      cfLevels.value = response.data.data.sort((a, b) => a.order - b.order)
    }
  } catch (error) {
    console.error('Error fetching CF levels:', error)
    alert('Gagal memuat data bobot nilai')
  } finally {
    loading.value = false
  }
}

const editCFLevel = (level) => {
  currentCFLevel.value = level
  form.value = {
    label: level.label,
    value: parseFloat(level.value),
    order: level.order,
    is_active: level.is_active
  }
  showEditModal.value = true
}

const confirmDelete = (level) => {
  deleteCFLevel.value = level
  showDeleteModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    label: '',
    value: 0,
    order: 1,
    is_active: true
  }
  currentCFLevel.value = null
}

const saveCFLevel = async () => {
  if (!form.value.label || form.value.value < 0 || form.value.value > 1) {
    alert('Harap lengkapi semua field dengan benar')
    return
  }

  const orderNum = parseInt(form.value.order, 10)
  if (Number.isNaN(orderNum) || orderNum < 1) {
    alert('Urutan harus bilangan bulat minimal 1')
    return
  }

  const dup = cfLevels.value.some((l) => {
    if (l.order !== orderNum) return false
    if (currentCFLevel.value && l.id === currentCFLevel.value.id) return false
    return true
  })
  if (dup) {
    alert('Urutan ini sudah dipakai. Pilih angka urut yang belum digunakan.')
    return
  }

  saving.value = true
  try {
    const url = currentCFLevel.value
      ? `${API_BASE_URL}/admin/cf-levels/${currentCFLevel.value.id}`
      : `${API_BASE_URL}/admin/cf-levels`
    
    const method = currentCFLevel.value ? 'put' : 'post'
    const data = {
      label: form.value.label.trim(),
      value: parseFloat(form.value.value),
      order: parseInt(form.value.order),
      is_active: form.value.is_active
    }
    
    const response = await api[method](url, data, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert(response.data.message || 'Bobot nilai berhasil disimpan')
      closeModal()
      fetchCFLevels()
    }
  } catch (error) {
    console.error('Error saving CF level:', error)
    let message = 'Gagal menyimpan bobot nilai'
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

const deleteCFLevelConfirm = async () => {
  deleting.value = true
  try {
    const response = await api.delete(
      `${API_BASE_URL}/admin/cf-levels/${deleteCFLevel.value.id}`,
      {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      }
    )

    if (response.data.success) {
      alert('Bobot nilai berhasil dihapus')
      showDeleteModal.value = false
      deleteCFLevel.value = null
      fetchCFLevels()
    }
  } catch (error) {
    console.error('Error deleting CF level:', error)
    alert('Gagal menghapus bobot nilai')
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

.table-container {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.cf-levels-note {
  margin: 0;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #5d6d7e;
  background: #f8f9fb;
  border-bottom: 1px solid #e8eaed;
}

.cf-levels-note-mark {
  color: #2c3e50;
  font-weight: 600;
  margin-right: 0.25rem;
}

.cf-levels-table {
  width: 100%;
  border-collapse: collapse;
}

.cf-levels-table thead {
  background: #2c3e50;
  color: white;
}

.cf-levels-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.cf-levels-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.cf-levels-table tbody tr:hover {
  background: #f8f9fa;
}

.value-badge {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-active {
  color: #27ae60;
  font-weight: 500;
}

.status-inactive {
  color: #e74c3c;
  font-weight: 500;
}

.btn-edit-small, .btn-delete-small {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-right: 0.5rem;
}

.btn-edit-small {
  background: #3498db;
  color: white;
}

.btn-edit-small:hover {
  background: #2980b9;
}

.btn-delete-small {
  background: #e74c3c;
  color: white;
}

.btn-delete-small:hover {
  background: #c0392b;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
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
</style>
