<template>
  <div class="bookmarks-container">
    <div class="bookmarks-header">
      <div>
        <router-link to="/education" class="btn-back">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span>Kembali ke Modul Edukasi</span>
        </router-link>
        <h1>Bookmark Saya</h1>
        <p class="header-subtitle">Modul edukasi yang telah Anda simpan untuk dibaca nanti</p>
      </div>
    </div>

    <div v-if="loading && bookmarks.length === 0" class="loading">
      <div class="loading-spinner"></div>
      <p>Memuat bookmark...</p>
    </div>

    <div v-else-if="bookmarks.length === 0" class="empty-state">
      <div class="empty-icon">📑</div>
      <h2>Belum Ada Bookmark</h2>
      <p class="empty-subtitle">Anda belum menyimpan modul edukasi ke bookmark</p>
      <router-link to="/education" class="btn-primary">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>
        <span>Jelajahi Modul Edukasi</span>
      </router-link>
    </div>

    <div v-else class="bookmarks-content">
      <div class="bookmarks-stats">
        <p>Total <strong>{{ bookmarks.length }}</strong> modul tersimpan</p>
      </div>
      
      <div class="bookmarks-grid">
        <div
          v-for="bookmark in bookmarks"
          :key="bookmark.id"
          class="bookmark-card"
        >
          <!-- Thumbnail -->
          <div class="bookmark-thumbnail" @click="goToDetail(bookmark.educational_module.id)">
            <img 
              v-if="bookmark.educational_module.image" 
              :src="bookmark.educational_module.image" 
              :alt="bookmark.educational_module.title"
              @error="handleImageError"
            />
            <div v-else class="thumbnail-placeholder">
              <svg class="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <div class="bookmark-overlay">
              <span>Baca Selengkapnya</span>
            </div>
            <span v-if="bookmark.educational_module.category" class="category-badge">
              {{ bookmark.educational_module.category }}
            </span>
            <div class="bookmark-indicator">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
              </svg>
            </div>
          </div>

          <!-- Content -->
          <div class="bookmark-content">
            <h3 @click="goToDetail(bookmark.educational_module.id)">
              {{ bookmark.educational_module.title }}
            </h3>
            <p class="bookmark-description">
              {{ bookmark.educational_module.description || truncateText(bookmark.educational_module.content, 120) }}
            </p>
            
            <div class="bookmark-meta">
              <span class="meta-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                {{ formatDate(bookmark.created_at) }}
              </span>
              <span class="meta-item">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                {{ estimateReadingTime(bookmark.educational_module.content) }} menit
              </span>
            </div>

            <div class="bookmark-actions">
              <router-link
                :to="`/education/${bookmark.educational_module.id}`"
                class="btn-read"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span>Baca</span>
              </router-link>
              <button
                @click.stop="downloadModule(bookmark.educational_module)"
                class="btn-download"
                title="Download Modul"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
                <span>Download</span>
              </button>
              <button
                @click.stop="removeBookmark(bookmark.educational_module.id)"
                class="btn-remove"
                :disabled="removing"
                title="Hapus dari Bookmark"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                <span>Hapus</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useEducationStore } from '../stores/education'

const router = useRouter()
const educationStore = useEducationStore()

const removing = ref(false)

const loading = computed(() => educationStore.loading)
const bookmarks = computed(() => educationStore.bookmarks)

const loadBookmarks = async () => {
  try {
    await educationStore.fetchBookmarks()
  } catch (error) {
    console.error('Error loading bookmarks:', error)
  }
}

const goToDetail = (id) => {
  router.push(`/education/${id}`)
}

const removeBookmark = async (id) => {
  if (!confirm('Hapus modul ini dari bookmark?')) return

  removing.value = true
  try {
    await educationStore.unbookmark(id)
    // Reload bookmarks
    await loadBookmarks()
  } catch (error) {
    console.error('Error removing bookmark:', error)
    alert('Gagal menghapus bookmark')
  } finally {
    removing.value = false
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

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleImageError = (event) => {
  event.target.style.display = 'none'
  if (event.target.parentElement) {
    event.target.parentElement.querySelector('.thumbnail-placeholder')?.classList.remove('hidden')
  }
}

onMounted(() => {
  loadBookmarks()
})
</script>

<style scoped>
.bookmarks-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

/* Header */
.bookmarks-header {
  margin-bottom: 3rem;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #16a34a;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 1rem;
  transition: all 0.2s;
}

.btn-back:hover {
  color: #15803d;
  gap: 0.75rem;
}

.bookmarks-header h1 {
  margin: 0.5rem 0 0.5rem 0;
  color: #1f2937;
  font-size: 2.5rem;
  font-weight: 700;
}

.header-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
  margin: 0;
}

/* Stats */
.bookmarks-stats {
  margin-bottom: 1.5rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.bookmarks-stats strong {
  color: #16a34a;
  font-weight: 700;
}

/* Grid */
.bookmarks-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.bookmark-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
}

.bookmark-card:hover {
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  transform: translateY(-4px);
  border-color: #16a34a;
}

/* Thumbnail */
.bookmark-thumbnail {
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
  cursor: pointer;
}

.bookmark-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.bookmark-card:hover .bookmark-thumbnail img {
  transform: scale(1.05);
}

.thumbnail-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
}

.bookmark-overlay {
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

.bookmark-card:hover .bookmark-overlay {
  opacity: 1;
}

.bookmark-overlay span {
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
}

.category-badge {
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

.bookmark-indicator {
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background: #fef3c7;
  color: #d97706;
  padding: 0.5rem;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Content */
.bookmark-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.bookmark-content h3 {
  margin: 0 0 0.75rem 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
  line-height: 1.4;
}

.bookmark-content h3:hover {
  color: #16a34a;
}

.bookmark-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.95rem;
  flex: 1;
}

.bookmark-meta {
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

/* Actions */
.bookmark-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-read,
.btn-download,
.btn-remove {
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

.btn-read {
  background: #16a34a;
  color: white;
  border: 1px solid #16a34a;
}

.btn-read:hover {
  background: #15803d;
  border-color: #15803d;
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

.btn-remove {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-remove:hover:not(:disabled) {
  background: #fee2e2;
  color: #b91c1c;
}

.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

.empty-state h2 {
  margin: 0.5rem 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 700;
}

.empty-subtitle {
  color: #9ca3af;
  font-size: 0.95rem;
  margin-bottom: 2rem;
}

.btn-primary {
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

.btn-primary:hover {
  background: #15803d;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(22, 163, 74, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .bookmarks-container {
    padding: 1rem;
  }

  .bookmarks-header h1 {
    font-size: 2rem;
  }

  .bookmarks-grid {
    grid-template-columns: 1fr;
  }

  .bookmark-actions {
    flex-direction: column;
  }

  .btn-read,
  .btn-download,
  .btn-remove {
    width: 100%;
  }
}
</style>


