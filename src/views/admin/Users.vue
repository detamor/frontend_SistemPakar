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
        <h1>Manajemen User</h1>
        <p class="subtitle">Kelola pengguna sistem</p>
      </div>
      <button @click="showAddModal = true" class="btn-add">
        + Tambah User
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading && users.length === 0" class="loading">
      Memuat data user...
    </div>

    <!-- Empty State -->
    <div v-else-if="users.length === 0" class="empty-state">
      <p>Belum ada user</p>
      <button @click="showAddModal = true" class="btn-primary">
        Tambah User Pertama
      </button>
    </div>

    <!-- Users List -->
    <div v-else class="table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>WhatsApp</th>
            <th>Role</th>
            <th>Verified</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.whatsapp_number || '-' }}</td>
            <td>
              <span :class="['badge', user.role === 'admin' ? 'badge-admin' : 'badge-user']">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span :class="['badge', user.is_verified ? 'badge-success' : 'badge-warning']">
                {{ user.is_verified ? 'Ya' : 'Tidak' }}
              </span>
            </td>
            <td>
              <button @click="editUser(user)" class="btn-edit">Edit</button>
              <button @click="confirmDelete(user)" class="btn-delete">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ showEditModal ? 'Edit User' : 'Tambah User Baru' }}</h2>
          <button @click="closeModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="saveUser" class="form">
          <div class="form-group">
            <label>Nama *</label>
            <input v-model="form.name" type="text" required :disabled="saving" />
          </div>

          <div class="form-group">
            <label>Email *</label>
            <input v-model="form.email" type="email" required :disabled="saving" />
          </div>

          <div class="form-group">
            <label>Password {{ showEditModal ? '(kosongkan jika tidak diubah)' : '*' }}</label>
            <input v-model="form.password" type="password" :required="!showEditModal" :disabled="saving" />
          </div>

          <div class="form-group">
            <label>Nomor WhatsApp</label>
            <input v-model="form.whatsapp_number" type="tel" :disabled="saving" />
          </div>

          <div class="form-group">
            <label>Role *</label>
            <select v-model="form.role" required :disabled="saving">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="form-group" v-if="showEditModal">
            <label>
              <input v-model="form.is_verified" type="checkbox" :disabled="saving" />
              Verified
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
          <h2>Hapus User</h2>
          <button @click="showDeleteModal = false" class="btn-close">×</button>
        </div>

        <div class="delete-warning">
          <p>Apakah Anda yakin ingin menghapus user ini?</p>
          <p class="warning-text">Tindakan ini tidak dapat dibatalkan!</p>
          <div class="detail-item">
            <strong>Nama:</strong> {{ deleteUser?.name }}
          </div>
          <div class="detail-item">
            <strong>Email:</strong> {{ deleteUser?.email }}
          </div>
        </div>

        <div class="form-actions">
          <button @click="deleteUserConfirm" :disabled="deleting" class="btn-delete-confirm">
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

const users = ref([])
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const currentUser = ref(null)
const deleteUser = ref(null)

const form = ref({
  name: '',
  email: '',
  password: '',
  whatsapp_number: '',
  role: 'user',
  is_verified: false
})

const getToken = () => localStorage.getItem('auth_token')

onMounted(() => {
  fetchUsers()
})

const fetchUsers = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/admin/users`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (response.data.success) {
      users.value = response.data.data.data || response.data.data
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    alert('Gagal memuat data user')
  } finally {
    loading.value = false
  }
}

const editUser = (user) => {
  currentUser.value = user
  form.value = {
    name: user.name,
    email: user.email,
    password: '',
    whatsapp_number: user.whatsapp_number || '',
    role: user.role,
    is_verified: user.is_verified || false
  }
  showEditModal.value = true
}

const confirmDelete = (user) => {
  deleteUser.value = user
  showDeleteModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    name: '',
    email: '',
    password: '',
    whatsapp_number: '',
    role: 'user',
    is_verified: false
  }
  currentUser.value = null
}

const saveUser = async () => {
  saving.value = true
  try {
    const url = showEditModal.value
      ? `${API_BASE_URL}/admin/users/${currentUser.value.id}`
      : `${API_BASE_URL}/admin/users`
    
    const method = showEditModal.value ? 'put' : 'post'
    const data = { ...form.value }
    
    // Jika edit dan password kosong, hapus dari data
    if (showEditModal.value && !data.password) {
      delete data.password
    }
    
    const response = await axios[method](url, data, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert(response.data.message || 'User berhasil disimpan')
      closeModal()
      fetchUsers()
    }
  } catch (error) {
    console.error('Error saving user:', error)
    const message = error.response?.data?.message || 'Gagal menyimpan user'
    alert(message)
  } finally {
    saving.value = false
  }
}

const deleteUserConfirm = async () => {
  deleting.value = true
  try {
    const response = await axios.delete(
      `${API_BASE_URL}/admin/users/${deleteUser.value.id}`,
      {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      }
    )

    if (response.data.success) {
      alert('User berhasil dihapus')
      showDeleteModal.value = false
      deleteUser.value = null
      fetchUsers()
    }
  } catch (error) {
    console.error('Error deleting user:', error)
    const message = error.response?.data?.message || 'Gagal menghapus user'
    alert(message)
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

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  background: #f8f9fa;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
}

.data-table td {
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-admin {
  background: #f39c12;
  color: white;
}

.badge-user {
  background: #3498db;
  color: white;
}

.badge-success {
  background: #27ae60;
  color: white;
}

.badge-warning {
  background: #e67e22;
  color: white;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-right: 0.5rem;
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
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
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


