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
        <div v-if="plant.image" class="card-image">
          <img :src="getImageUrl(plant.image)" :alt="plant.name" @error="handleImageError" />
        </div>
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

          <div class="form-group">
            <label>Gambar Tanaman</label>
            <input
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              :disabled="saving"
              class="file-input"
            />
            <div v-if="form.imagePreview || (currentPlant && currentPlant.image)" class="image-preview">
              <img
                :src="form.imagePreview || getImageUrl(currentPlant?.image)"
                alt="Preview"
                @error="handleImageError"
              />
              <button
                v-if="form.imagePreview"
                type="button"
                @click="removeImagePreview"
                class="btn-remove-image"
              >
                × Hapus
              </button>
            </div>
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
  care_guide: '',
  image: null,
  imagePreview: null
})

const getToken = () => localStorage.getItem('auth_token')

onMounted(() => {
  fetchPlants()
})

const fetchPlants = async () => {
  loading.value = true
  try {
    console.log('Fetching plants...')
    const response = await axios.get(`${API_BASE_URL}/admin/plants`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (response.data.success) {
      console.log('Plants fetched:', response.data.data)
      console.log('Plants with images:', response.data.data.map(p => ({ id: p.id, name: p.name, image: p.image })))
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
  console.log('Editing plant:', plant)
  currentPlant.value = plant
  form.value = {
    name: plant.name,
    scientific_name: plant.scientific_name || '',
    description: plant.description || '',
    care_guide: plant.care_guide || '',
    image: null, // New image file (if user selects one)
    imagePreview: null // Preview of new image
  }
  // Note: currentPlant.image will be used for preview if no new image is selected
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
    care_guide: '',
    image: null,
    imagePreview: null
  }
  currentPlant.value = null
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  console.log('File selected:', file)
  if (file) {
    console.log('File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    })
    form.value.image = file
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      form.value.imagePreview = e.target.result
      console.log('Image preview created')
    }
    reader.onerror = (e) => {
      console.error('Error reading file:', e)
    }
    reader.readAsDataURL(file)
  } else {
    console.warn('No file selected')
  }
}

const removeImagePreview = () => {
  form.value.image = null
  form.value.imagePreview = null
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http')) return imagePath
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  // Fix localhost port issue
  if (imagePath.includes('localhost') && !imagePath.includes('localhost:')) {
    return imagePath.replace('localhost', 'localhost:8000')
  }
  return imagePath.startsWith('/') ? `${apiUrl}${imagePath}` : `${apiUrl}/${imagePath}`
}

const handleImageError = (event) => {
  event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E'
}

const savePlant = async () => {
  saving.value = true
  
  console.log('=== Starting savePlant ===')
  console.log('Form data:', {
    name: form.value.name,
    scientific_name: form.value.scientific_name,
    description: form.value.description,
    care_guide: form.value.care_guide,
    hasImage: !!form.value.image,
    imageType: form.value.image?.type,
    imageName: form.value.image?.name,
    imageSize: form.value.image?.size
  })
  
  try {
    const url = showEditModal.value
      ? `${API_BASE_URL}/admin/plants/${currentPlant.value.id}`
      : `${API_BASE_URL}/admin/plants`
    
    // Use POST for file uploads, even for updates (Laravel doesn't support file uploads with PUT)
    const method = 'post'
    console.log('Request URL:', url)
    console.log('Request method:', method)
    console.log('Is update:', showEditModal.value)
    
    // Create FormData for file upload
    const formData = new FormData()
    
    // For PUT requests, add _method spoofing
    if (showEditModal.value) {
      formData.append('_method', 'PUT')
    }
    
    formData.append('name', form.value.name)
    if (form.value.scientific_name) formData.append('scientific_name', form.value.scientific_name)
    if (form.value.description) formData.append('description', form.value.description)
    if (form.value.care_guide) formData.append('care_guide', form.value.care_guide)
    
    // Handle image upload
    if (form.value.image) {
      console.log('Appending image to FormData:', {
        name: form.value.image.name,
        type: form.value.image.type,
        size: form.value.image.size
      })
      formData.append('image', form.value.image)
    } else {
      console.log('No image to upload')
    }
    
    // Log FormData contents (for debugging)
    console.log('FormData entries:')
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ', pair[1] instanceof File ? `File(${pair[1].name}, ${pair[1].size} bytes)` : pair[1])
    }
    
    console.log('Sending request...')
    const response = await axios.post(url, formData, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
        // Don't set Content-Type manually - axios will set it automatically for FormData
        // with the correct boundary
      }
    })

    console.log('Response received:', response.data)
    
    if (response.data.success) {
      console.log('✅ Plant saved successfully!')
      console.log('Plant data:', response.data.data)
      alert('Tanaman berhasil disimpan')
      closeModal()
      fetchPlants()
    } else {
      console.error('❌ Save failed:', response.data)
      alert('Gagal menyimpan tanaman: ' + (response.data.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('❌ Error saving plant:', error)
    console.error('Error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    })
    
    let message = 'Gagal menyimpan tanaman'
    
    if (error.response?.data) {
      if (error.response.data.message) {
        message = error.response.data.message
      } else if (error.response.data.errors) {
        const errors = error.response.data.errors
        const errorMessages = Object.keys(errors).map(key => {
          return `${key}: ${errors[key].join(', ')}`
        }).join('\n')
        message = `Validasi gagal:\n${errorMessages}`
      }
    } else if (error.message) {
      message = error.message
    }
    
    console.error('Final error message:', message)
    alert(message)
  } finally {
    saving.value = false
    console.log('=== savePlant completed ===')
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

.card-image {
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

.file-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.image-preview {
  margin-top: 1rem;
  position: relative;
}

.image-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

.btn-remove-image {
  margin-top: 0.5rem;
  padding: 0.5rem 1rem;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-remove-image:hover {
  background: #c0392b;
}
</style>


