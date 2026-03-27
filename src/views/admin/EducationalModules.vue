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
        
        <!-- Thumbnail Image -->
        <div v-if="module.image" class="module-thumbnail-preview">
          <img :src="module.image" :alt="module.title" />
        </div>
        
        <p class="module-description">
          {{ module.description || 'Tidak ada deskripsi' }}
        </p>
        <p class="module-content-preview">
          {{ truncateText(module.content, 100) }}
        </p>
        
        <!-- Content Images Preview -->
        <div v-if="module.content_images && module.content_images.length > 0" class="content-images-preview">
          <span class="images-label">Gambar Konten ({{ module.content_images.length }})</span>
          <div class="images-preview-grid">
            <div
              v-for="(image, index) in module.content_images.slice(0, 3)"
              :key="index"
              class="preview-image-item"
            >
              <img :src="image" :alt="`Gambar ${index + 1}`" />
            </div>
            <div v-if="module.content_images.length > 3" class="preview-image-more">
              +{{ module.content_images.length - 3 }}
            </div>
          </div>
        </div>
        
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

            <div class="form-group pb-4 border-b border-slate-100 mb-4">
              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.is_maintenance_guide"
                  type="checkbox"
                  class="w-4 h-4 text-emerald-600 rounded"
                />
                <span class="font-bold text-emerald-700">Aktifkan sebagai Panduan Pemeliharaan Terstruktur</span>
              </label>
              <p class="text-[10px] text-slate-500 mt-1 italic pl-6">
                * Jika diaktifkan, modul akan menampilkan dashboard kebutuhan vital (Air, Cahaya, dll) dan langkah-langkah terstruktur.
              </p>
            </div>

            <!-- Maintenance Specific Fields -->
            <div v-if="form.is_maintenance_guide" class="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 mb-6 space-y-4 animate-fade-in">
              <h4 class="text-sm font-bold text-emerald-800 flex items-center gap-2 mb-2">
                <span>📋 Data Kebutuhan Vital</span>
              </h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="form-group">
                  <label class="text-xs">Info Penyiraman</label>
                  <input v-model="form.watering_info" type="text" placeholder="Contoh: 2x seminggu" class="!py-1.5 !text-sm" />
                </div>
                <div class="form-group">
                  <label class="text-xs">Info Cahaya</label>
                  <input v-model="form.light_info" type="text" placeholder="Contoh: Matahari Pagi" class="!py-1.5 !text-sm" />
                </div>
                <div class="form-group">
                  <label class="text-xs">Info Kelembapan</label>
                  <input v-model="form.humidity_info" type="text" placeholder="Contoh: Tinggi (70%)" class="!py-1.5 !text-sm" />
                </div>
                <div class="form-group">
                  <label class="text-xs">Tingkat Kesulitan</label>
                  <select v-model="form.difficulty" class="!py-1.5 !text-sm">
                    <option value="Mudah">Mudah</option>
                    <option value="Sedang">Sedang</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>
              </div>

              <!-- Maintenance Steps -->
              <div class="mt-4">
                <div class="flex items-center justify-between mb-2">
                  <label class="text-xs font-bold text-emerald-800">Langkah-langkah Pemeliharaan</label>
                  <button type="button" @click="addStep" class="text-[10px] bg-emerald-600 text-white px-2 py-1 rounded"> + Tambah Langkah</button>
                </div>
                <div class="space-y-3">
                  <div v-for="(step, index) in form.maintenance_steps_json" :key="index" class="bg-white p-3 rounded border border-emerald-100 relative group">
                    <button type="button" @click="removeStep(index)" class="absolute -top-2 -right-2 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    <div class="flex gap-2 items-center mb-1">
                      <span class="text-[10px] font-bold bg-emerald-100 text-emerald-700 w-5 h-5 flex items-center justify-center rounded">{{ index + 1 }}</span>
                      <input v-model="step.title" type="text" placeholder="Judul Langkah (misal: Penyiraman)" class="!py-1 !text-xs !border-none !bg-slate-50 font-bold" />
                    </div>
                    <textarea v-model="step.description" rows="1" placeholder="Deskripsi detail langkah..." class="!py-1 !text-[11px] !border-none !bg-slate-50"></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div class="form-group">
              <label for="content">Konten Edukasi *</label>
              <textarea
                id="content"
                v-model="form.content"
                placeholder="Tulis konten edukasi lengkap di sini"
                rows="6"
                required
                :disabled="saving"
              ></textarea>
            </div>

            <div class="form-group">
              <label>Gambar Konten</label>
              <p class="form-help">Upload gambar untuk ditampilkan di dalam konten modul</p>
              
              <!-- Upload Button -->
              <div class="upload-section">
                <input
                  ref="imageInput"
                  type="file"
                  accept="image/*"
                  multiple
                  @change="handleImageUpload"
                  style="display: none"
                />
                <button
                  type="button"
                  @click="$refs.imageInput.click()"
                  class="btn-upload"
                  :disabled="saving || uploading"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  {{ uploading ? 'Mengupload...' : 'Upload Gambar' }}
                </button>
              </div>

              <!-- Image Preview -->
              <div v-if="form.content_images && form.content_images.length > 0" class="images-preview">
                <div
                  v-for="(image, index) in form.content_images"
                  :key="index"
                  class="image-preview-item"
                >
                  <img :src="getImageUrl(image)" :alt="`Gambar ${index + 1}`" />
                  <button
                    type="button"
                    @click="removeImage(index)"
                    class="btn-remove-image"
                    :disabled="saving"
                    title="Hapus gambar"
                  >
                    ×
                  </button>
                </div>
              </div>
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
  content: '',
  content_images: [],
  is_maintenance_guide: false,
  watering_info: '',
  light_info: '',
  humidity_info: '',
  difficulty: 'Mudah',
  maintenance_steps_json: []
})

const addStep = () => {
  form.value.maintenance_steps_json.push({
    step: form.value.maintenance_steps_json.length + 1,
    title: '',
    description: ''
  })
}

const removeStep = (index) => {
  form.value.maintenance_steps_json.splice(index, 1)
  // Re-index steps
  form.value.maintenance_steps_json.forEach((s, idx) => s.step = idx + 1)
}

const uploading = ref(false)
const imageInput = ref(null)

onMounted(() => {
  fetchModules()
})

const fetchModules = async () => {
  loading.value = true
  try {
    const response = await adminStore.fetchEducationModules()
    if (response.success) {
      modules.value = adminStore.educationModules
    }
  } catch (error) {
    console.error('Error fetching modules:', error)
    alert('Gagal memuat modul edukasi')
  } finally {
    loading.value = false
  }
}

const editModule = async (module) => {
  // Fetch full module data to ensure we have all fields including content_images
  try {
    const response = await adminStore.fetchEducationModule(module.id)
    
    if (response.success) {
      const fullModule = response.data
      currentModule.value = fullModule
      form.value = {
        title: fullModule.title,
        category: fullModule.category || '',
        description: fullModule.description || '',
        content: fullModule.content,
        content_images: fullModule.content_images || [],
        is_maintenance_guide: fullModule.is_maintenance_guide || false,
        watering_info: fullModule.watering_info || '',
        light_info: fullModule.light_info || '',
        humidity_info: fullModule.humidity_info || '',
        difficulty: fullModule.difficulty || 'Mudah',
        maintenance_steps_json: fullModule.maintenance_steps_json || []
      }
      showEditModal.value = true
    } else {
      // Fallback to passed module data
      currentModule.value = module
      form.value = {
        title: module.title,
        category: module.category || '',
        description: module.description || '',
        content: module.content,
        content_images: module.content_images || [],
        is_maintenance_guide: module.is_maintenance_guide || false,
        watering_info: module.watering_info || '',
        light_info: module.light_info || '',
        humidity_info: module.humidity_info || '',
        difficulty: module.difficulty || 'Mudah',
        maintenance_steps_json: module.maintenance_steps_json || []
      }
      showEditModal.value = true
    }
  } catch (error) {
    console.error('Error fetching module detail:', error)
    // Fallback to passed module data
    currentModule.value = module
    form.value = {
      title: module.title,
      category: module.category || '',
      description: module.description || '',
      content: module.content,
      content_images: module.content_images || [],
      is_maintenance_guide: module.is_maintenance_guide || false,
      watering_info: module.watering_info || '',
      light_info: module.light_info || '',
      humidity_info: module.humidity_info || '',
      difficulty: module.difficulty || 'Mudah',
      maintenance_steps_json: module.maintenance_steps_json || []
    }
    showEditModal.value = true
  }
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
    content: '',
    content_images: [],
    is_maintenance_guide: false,
    watering_info: '',
    light_info: '',
    humidity_info: '',
    difficulty: 'Mudah',
    maintenance_steps_json: []
  }
  currentModule.value = null
}

const handleImageUpload = async (event) => {
  const files = Array.from(event.target.files)
  if (files.length === 0) return

  uploading.value = true
  try {
    const uploadPromises = files.map(async (file) => {
      const response = await adminStore.uploadEducationImage(file)
      if (response.success) {
        return response.data.path
      }
      throw new Error('Upload failed')
    })

    const uploadedPaths = await Promise.all(uploadPromises)
    form.value.content_images = [...(form.value.content_images || []), ...uploadedPaths]
    
    // Reset input
    if (imageInput.value) {
      imageInput.value.value = ''
    }
  } catch (error) {
    console.error('Error uploading images:', error)
    alert('Gagal mengupload gambar: ' + (error.response?.data?.message || error.message))
  } finally {
    uploading.value = false
  }
}

const removeImage = (index) => {
  form.value.content_images.splice(index, 1)
}

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  
  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }
  
  // Extract base URL from API_BASE_URL (remove /api if exists)
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const baseUrl = API_BASE_URL.replace('/api', '')
  
  // Remove leading slash if exists
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
  
  // If path already contains 'storage/', use as is, otherwise add it
  if (cleanPath.startsWith('storage/')) {
    return `${baseUrl}/${cleanPath}`
  }
  
  return `${baseUrl}/storage/${cleanPath}`
}

const saveModule = async () => {
  saving.value = true
  try {
    const response = showEditModal.value
      ? await adminStore.updateEducationModule(currentModule.value.id, form.value)
      : await adminStore.createEducationModule(form.value)

    if (response.success) {
      alert(response.message || 'Modul berhasil disimpan')
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
    const response = await adminStore.deleteEducationModule(deleteModule.value.id)
    if (response.success) {
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

.module-thumbnail-preview {
  width: 100%;
  max-height: 200px;
  overflow: hidden;
  border-radius: 6px;
  margin-bottom: 1rem;
  background: #f5f5f5;
}

.module-thumbnail-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content-images-preview {
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.images-label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
  margin-bottom: 0.5rem;
}

.images-preview-grid {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.preview-image-item {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #ddd;
  flex-shrink: 0;
}

.preview-image-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-image-more {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  background: #e0e0e0;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #666;
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

.form-help {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.upload-section {
  margin-bottom: 1rem;
}

.btn-upload {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #f0f0f0;
  border: 2px dashed #ccc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  color: #333;
  transition: all 0.3s;
}

.btn-upload:hover:not(:disabled) {
  background: #e0e0e0;
  border-color: #999;
}

.btn-upload:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.images-preview {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-preview-item {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  background: #f5f5f5;
  border: 1px solid #ddd;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 28px;
  height: 28px;
  background: rgba(231, 76, 60, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.2rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove-image:hover:not(:disabled) {
  background: rgba(192, 57, 43, 1);
  transform: scale(1.1);
}

.btn-remove-image:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>


