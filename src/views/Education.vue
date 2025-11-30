<template>
  <div class="education-container">
    <!-- Header Section -->
    <div class="education-header">
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
        <h1>Modul Edukasi</h1>
        <p class="header-subtitle">Pelajari cara merawat tanaman hias dengan modul edukasi yang lengkap</p>
      </div>
      <div class="header-actions">
        <router-link to="/education/bookmarks" class="btn-bookmarks">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
          </svg>
          <span>Bookmark Saya</span>
        </router-link>
      </div>
    </div>

    <!-- Select Category Section -->
    <div class="category-section">
      <h2 class="section-title">Pilih Kategori</h2>
      <div class="category-grid">
        <div
          v-for="cat in categoryStats"
          :key="cat.name"
          class="category-card"
          @click="selectedCategory = cat.name === 'Semua' ? null : cat.name"
          :class="{ active: (selectedCategory === null && cat.name === 'Semua') || selectedCategory === cat.name }"
        >
          <div class="category-icon">📚</div>
          <div class="category-info">
            <h3>{{ cat.name }}</h3>
            <p>{{ cat.count }} modul</p>
          </div>
        </div>
      </div>
    </div>

    <!-- All Education Content Section -->
    <div class="content-section">
      <div class="section-header">
        <h2 class="section-title">Semua Modul Edukasi</h2>
        <div class="view-toggle">
          <button 
            @click="viewMode = 'grid'" 
            :class="['view-btn', { active: viewMode === 'grid' }]"
            title="Tampilan Grid"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
            </svg>
          </button>
          <button 
            @click="viewMode = 'list'" 
            :class="['view-btn', { active: viewMode === 'list' }]"
            title="Tampilan Daftar"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading && modules.length === 0" class="loading">
        <div class="loading-spinner"></div>
        <p>Memuat modul edukasi...</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="modules.length === 0" class="empty-state">
        <div class="empty-icon">📚</div>
        <p>Belum ada modul edukasi</p>
        <p class="empty-subtitle">Modul edukasi akan muncul di sini</p>
      </div>

      <!-- Modules Grid View -->
      <div v-else-if="viewMode === 'grid'" class="modules-grid">
        <div
          v-for="module in modules"
          :key="module.id"
          class="module-card-grid"
        >
          <!-- Thumbnail -->
          <div class="module-thumbnail" @click="goToDetail(module.id)">
            <img 
              v-if="module.image" 
              :src="module.image" 
              :alt="module.title"
              @error="handleImageError"
            />
            <div v-else class="module-thumbnail-placeholder">
              <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div class="module-overlay">
              <span class="overlay-text">Baca Selengkapnya</span>
            </div>
            <span v-if="module.category" class="module-category-badge">
              {{ module.category }}
            </span>
          </div>

          <!-- Content -->
          <div class="module-content">
            <h3 class="module-title" @click="goToDetail(module.id)">{{ module.title }}</h3>
            <p class="module-description">
              {{ module.description || truncateText(module.content, 120) }}
            </p>
            
            <!-- Meta Info -->
            <div class="module-meta">
              <span class="meta-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ estimateReadingTime(module.content) }} menit
              </span>
              <span class="meta-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                {{ module.view_count || 0 }} views
              </span>
            </div>

            <!-- Actions -->
            <div class="module-actions">
              <button 
                @click.stop="toggleBookmark(module)"
                :class="['btn-bookmark', { active: module.is_bookmarked }]"
                :title="module.is_bookmarked ? 'Hapus dari bookmark' : 'Tambah ke bookmark'"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="module.is_bookmarked ? 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z' : 'M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z'"></path>
                </svg>
                <span>{{ module.is_bookmarked ? 'Tersimpan' : 'Simpan' }}</span>
              </button>
              <button 
                @click.stop="downloadModule(module)"
                class="btn-download"
                title="Download Modul"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Download</span>
              </button>
              <router-link 
                :to="`/education/${module.id}`"
                class="btn-read"
              >
                Baca
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Modules List View -->
      <div v-else class="modules-list">
        <div
          v-for="module in modules"
          :key="module.id"
          class="module-card-list"
        >
          <div class="module-thumbnail-list" @click="goToDetail(module.id)">
            <img 
              v-if="module.image" 
              :src="module.image" 
              :alt="module.title"
              @error="handleImageError"
            />
            <div v-else class="module-thumbnail-placeholder">
              <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
          </div>
          <div class="module-info-list">
            <div class="module-header-list">
              <h3 @click="goToDetail(module.id)">{{ module.title }}</h3>
              <span v-if="module.category" class="module-category">
                {{ module.category }}
              </span>
            </div>
            <p class="module-description">
              {{ module.description || truncateText(module.content, 150) }}
            </p>
            <div class="module-meta-list">
              <span class="meta-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ estimateReadingTime(module.content) }} menit
              </span>
              <span class="meta-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                {{ module.view_count || 0 }} views
              </span>
            </div>
            <div class="module-actions-list">
              <button 
                @click.stop="toggleBookmark(module)"
                :class="['btn-bookmark', { active: module.is_bookmarked }]"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>
                {{ module.is_bookmarked ? 'Tersimpan' : 'Simpan' }}
              </button>
              <button 
                @click.stop="downloadModule(module)"
                class="btn-download"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                Download
              </button>
              <router-link 
                :to="`/education/${module.id}`"
                class="btn-read"
              >
                Baca Selengkapnya
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEducationStore } from '../stores/education'

const router = useRouter()
const educationStore = useEducationStore()

const selectedCategory = ref(null)
const currentPage = ref(1)
const viewMode = ref('grid') // 'grid' or 'list'

const loading = computed(() => educationStore.loading)
const modules = computed(() => {
  let moduleList = []
  if (educationStore.modules?.data) {
    moduleList = educationStore.modules.data
  } else if (Array.isArray(educationStore.modules)) {
    moduleList = educationStore.modules
  }
  
  // Add is_bookmarked property if not present
  return moduleList.map(module => ({
    ...module,
    is_bookmarked: module.is_bookmarked || false
  }))
})

// Get all modules untuk menghitung kategori
const allModules = ref([])

const categoryStats = computed(() => {
  const stats = {
    'Semua': allModules.value.length
  }
  
  allModules.value.forEach(module => {
    if (module.category) {
      stats[module.category] = (stats[module.category] || 0) + 1
    }
  })
  
  return Object.entries(stats).map(([name, count]) => ({ name, count }))
})

const loadModules = async (page = 1) => {
  try {
    await educationStore.fetchModules(selectedCategory.value, page)
  } catch (error) {
    console.error('Error loading modules:', error)
  }
}

const loadAllModules = async () => {
  try {
    const response = await educationStore.fetchModules(null, 1)
    if (response.data) {
      // Ambil semua data tanpa filter untuk statistik kategori
      allModules.value = response.data.data || []
    }
  } catch (error) {
    console.error('Error loading all modules:', error)
  }
}

const goToDetail = (id) => {
  router.push(`/education/${id}`)
}

const truncateText = (text, length) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const estimateReadingTime = (content) => {
  if (!content) return 0
  // Estimasi: 200 kata per menit, rata-rata 5 karakter per kata
  const words = content.length / 5
  const minutes = Math.ceil(words / 200)
  return minutes || 1
}

const toggleBookmark = async (module) => {
  try {
    if (module.is_bookmarked) {
      await educationStore.unbookmark(module.id)
      module.is_bookmarked = false
    } else {
      await educationStore.bookmark(module.id)
      module.is_bookmarked = true
    }
  } catch (error) {
    console.error('Error toggling bookmark:', error)
    alert('Gagal mengubah bookmark')
  }
}

const downloadModule = (module) => {
  try {
    // Create content for download
    const content = `
MODUL EDUKASI: ${module.title}
${module.category ? `Kategori: ${module.category}` : ''}
${module.description ? `\nDeskripsi:\n${module.description}` : ''}

${module.content || ''}

---
Sumber: System Pakar - Tanaman Hias Expert
Diunduh pada: ${new Date().toLocaleString('id-ID')}
    `.trim()

    // Create blob and download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${module.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error downloading module:', error)
    alert('Gagal mengunduh modul')
  }
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  if (event.target.parentElement) {
    event.target.parentElement.querySelector('.module-thumbnail-placeholder')?.classList.remove('hidden')
  }
}

watch(selectedCategory, () => {
  currentPage.value = 1
  loadModules(1)
})

onMounted(async () => {
  await loadAllModules()
  loadModules()
})
</script>

<style scoped>
.education-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Header Section */
.education-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 3rem;
  gap: 2rem;
}

.education-header h1 {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

.btn-bookmarks {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #16a34a;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(22, 163, 74, 0.2);
}

.btn-bookmarks:hover {
  background: #15803d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(22, 163, 74, 0.3);
}

/* Category Section */
.category-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.75rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
}

.category-card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 0.75rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.category-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
  border-color: #16a34a;
}

.category-card.active {
  border-color: #16a34a;
  background: #f0fdf4;
}

.category-icon {
  font-size: 2.5rem;
}

.category-info h3 {
  margin: 0 0 0.25rem 0;
  color: #1f2937;
  font-size: 1.1rem;
  font-weight: 600;
}

.category-info p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

/* Content Section */
.content-section {
  margin-top: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: #f3f4f6;
  padding: 0.25rem;
  border-radius: 0.5rem;
}

.view-btn {
  padding: 0.5rem;
  border: none;
  background: transparent;
  border-radius: 0.375rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.view-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.view-btn.active {
  background: #16a34a;
  color: white;
}

/* Grid View */
.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.module-card-grid {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.module-card-grid:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  transform: translateY(-4px);
  border-color: #16a34a;
}

.module-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
  cursor: pointer;
}

.module-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.module-card-grid:hover .module-thumbnail img {
  transform: scale(1.05);
}

.module-thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.module-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.module-card-grid:hover .module-overlay {
  opacity: 1;
}

.overlay-text {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.module-category-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: #16a34a;
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.module-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.module-title {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1.4;
}

.module-title:hover {
  color: #16a34a;
}

.module-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  flex: 1;
}

.module-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: #9ca3af;
  font-size: 0.875rem;
}

.module-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-bookmark,
.btn-download,
.btn-read {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
  text-decoration: none;
  flex: 1;
  justify-content: center;
}

.btn-bookmark {
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
}

.btn-bookmark:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.btn-bookmark.active {
  background: #fef3c7;
  color: #d97706;
  border-color: #fbbf24;
}

.btn-download {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #bfdbfe;
}

.btn-download:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.btn-read {
  background: #16a34a;
  color: white;
  border: 1px solid #16a34a;
}

.btn-read:hover {
  background: #15803d;
  border-color: #15803d;
}

/* List View */
.modules-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.module-card-list {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  transition: all 0.3s;
}

.module-card-list:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border-color: #16a34a;
}

.module-thumbnail-list {
  width: 200px;
  height: 150px;
  border-radius: 0.75rem;
  overflow: hidden;
  background: #f3f4f6;
  flex-shrink: 0;
  cursor: pointer;
}

.module-thumbnail-list img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.module-info-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.module-header-list {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.module-header-list h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
}

.module-header-list h3:hover {
  color: #16a34a;
}

.module-category {
  background: #dbeafe;
  color: #1e40af;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.module-meta-list {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.module-actions-list {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.module-actions-list .btn-bookmark,
.module-actions-list .btn-download,
.module-actions-list .btn-read {
  flex: 0 1 auto;
  min-width: auto;
}

/* Loading & Empty States */
.loading {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e5e7eb;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state p {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.empty-subtitle {
  color: #9ca3af;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .education-container {
    padding: 1rem;
  }

  .education-header {
    flex-direction: column;
  }

  .education-header h1 {
    font-size: 2rem;
  }

  .modules-grid {
    grid-template-columns: 1fr;
  }

  .module-card-list {
    flex-direction: column;
  }

  .module-thumbnail-list {
    width: 100%;
    height: 200px;
  }

  .module-actions {
    flex-direction: column;
  }

  .btn-bookmark,
  .btn-download,
  .btn-read {
    width: 100%;
  }
}
</style>
