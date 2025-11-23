<template>
  <div class="detail-container">
    <div v-if="loading" class="loading">
      Memuat modul edukasi...
    </div>

    <div v-else-if="module" class="detail-card">
      <!-- Header -->
      <div class="detail-header">
        <div>
          <router-link to="/education" class="btn-back">← Kembali</router-link>
          <h1>{{ module.title }}</h1>
          <div class="module-meta">
            <span v-if="module.category" class="module-category">
              {{ module.category }}
            </span>
            <span class="module-views">👁️ {{ module.view_count || 0 }} views</span>
          </div>
        </div>
        <div class="header-actions">
          <button
            @click="toggleBookmark"
            :class="['btn-bookmark', { active: module.is_bookmarked }]"
            :disabled="bookmarking"
          >
            {{ module.is_bookmarked ? '📑 Bookmarked' : '📑 Bookmark' }}
          </button>
        </div>
      </div>

      <!-- Image -->
      <div v-if="module.image" class="module-image">
        <img :src="module.image" :alt="module.title" />
      </div>

      <!-- Content -->
      <div class="module-content">
        <div class="content-text" v-html="formatContent(module.content)"></div>
      </div>

      <!-- Related Modules -->
      <div class="related-section">
        <h2>Modul Lainnya</h2>
        <router-link to="/education" class="btn-view-all">
          Lihat Semua Modul →
        </router-link>
      </div>
    </div>

    <div v-else class="error-state">
      <p>Modul tidak ditemukan</p>
      <router-link to="/education" class="btn-primary">
        Kembali ke Daftar Modul
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEducationStore } from '../stores/education'

const route = useRoute()
const router = useRouter()
const educationStore = useEducationStore()

const bookmarking = ref(false)

const loading = computed(() => educationStore.loading)
const module = computed(() => educationStore.currentModule)

const loadDetail = async () => {
  try {
    await educationStore.fetchDetail(route.params.id)
  } catch (error) {
    console.error('Error loading module detail:', error)
  }
}

const toggleBookmark = async () => {
  if (!module.value) return

  bookmarking.value = true
  try {
    if (module.value.is_bookmarked) {
      await educationStore.unbookmark(module.value.id)
    } else {
      await educationStore.bookmark(module.value.id)
    }
  } catch (error) {
    alert('Gagal mengubah bookmark')
  } finally {
    bookmarking.value = false
  }
}

const formatContent = (content) => {
  if (!content) return ''
  // Convert newlines to <br> for display
  return content.replace(/\n/g, '<br>')
}

onMounted(() => {
  loadDetail()
})
</script>

<style scoped>
.detail-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.detail-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.detail-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
}

.btn-back {
  color: #667eea;
  text-decoration: none;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  display: inline-block;
  transition: color 0.3s;
}

.btn-back:hover {
  color: #5568d3;
}

.detail-header h1 {
  margin: 0.5rem 0;
  color: #333;
  font-size: 2rem;
}

.module-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.5rem;
}

.module-category {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 500;
}

.module-views {
  color: #666;
  font-size: 0.9rem;
}

.header-actions {
  margin-top: 1rem;
}

.btn-bookmark {
  padding: 0.75rem 1.5rem;
  background: white;
  border: 2px solid #667eea;
  color: #667eea;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-bookmark:hover:not(:disabled) {
  background: #f5f5f5;
}

.btn-bookmark.active {
  background: #667eea;
  color: white;
}

.btn-bookmark:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.module-image {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 8px;
  margin-bottom: 2rem;
  background: #f5f5f5;
}

.module-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.module-content {
  margin-bottom: 2rem;
}

.content-text {
  color: #333;
  line-height: 1.8;
  font-size: 1rem;
}

.content-text :deep(p) {
  margin-bottom: 1rem;
}

.content-text :deep(h2) {
  color: #333;
  margin-top: 2rem;
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.content-text :deep(h3) {
  color: #667eea;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 1.25rem;
}

.content-text :deep(ul),
.content-text :deep(ol) {
  margin-left: 2rem;
  margin-bottom: 1rem;
}

.content-text :deep(li) {
  margin-bottom: 0.5rem;
}

.related-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.related-section h2 {
  margin: 0;
  color: #333;
  font-size: 1.5rem;
}

.btn-view-all {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
}

.btn-view-all:hover {
  color: #5568d3;
  text-decoration: underline;
}

.loading,
.error-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error-state p {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.btn-primary {
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  transition: background 0.3s;
}

.btn-primary:hover {
  background: #5568d3;
}
</style>


