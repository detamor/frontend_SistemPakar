<template>
  <div class="bookmarks-container">
    <div class="bookmarks-header">
      <router-link to="/education" class="btn-back">← Kembali</router-link>
      <h1>Bookmark Saya</h1>
    </div>

    <div v-if="loading && bookmarks.length === 0" class="loading">
      Memuat bookmark...
    </div>

    <div v-else-if="bookmarks.length === 0" class="empty-state">
      <p>Belum ada modul yang di-bookmark</p>
      <router-link to="/education" class="btn-primary">
        Jelajahi Modul Edukasi
      </router-link>
    </div>

    <div v-else class="bookmarks-list">
      <div
        v-for="bookmark in bookmarks"
        :key="bookmark.id"
        class="bookmark-item"
      >
        <div class="item-content" @click="goToDetail(bookmark.educational_module.id)">
          <div v-if="bookmark.educational_module.image" class="item-image">
            <img :src="bookmark.educational_module.image" :alt="bookmark.educational_module.title" />
          </div>
          <div class="item-info">
            <h3>{{ bookmark.educational_module.title }}</h3>
            <p class="item-category">{{ bookmark.educational_module.category }}</p>
            <p class="item-description">
              {{ truncateText(bookmark.educational_module.content, 200) }}
            </p>
            <div class="item-meta">
              <span class="item-date">
                Ditambahkan: {{ formatDate(bookmark.created_at) }}
              </span>
            </div>
          </div>
        </div>
        <div class="item-actions">
          <router-link
            :to="`/education/${bookmark.educational_module.id}`"
            class="btn-view"
          >
            Baca
          </router-link>
          <button
            @click="removeBookmark(bookmark.educational_module.id)"
            class="btn-remove"
            :disabled="loading"
          >
            Hapus
          </button>
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
  if (!confirm('Hapus dari bookmark?')) return

  try {
    await educationStore.unbookmark(id)
    // Reload bookmarks
    await loadBookmarks()
  } catch (error) {
    alert('Gagal menghapus bookmark')
  }
}

const truncateText = (text, length) => {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

onMounted(() => {
  loadBookmarks()
})
</script>

<style scoped>
.bookmarks-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.bookmarks-header {
  margin-bottom: 2rem;
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

.bookmarks-header h1 {
  margin: 0.5rem 0 0 0;
  color: #333;
  font-size: 2rem;
}

.bookmarks-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bookmark-item {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  transition: box-shadow 0.3s;
}

.bookmark-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.item-content {
  flex: 1;
  display: flex;
  gap: 1.5rem;
  cursor: pointer;
}

.item-image {
  width: 150px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  background: #f5f5f5;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
}

.item-info h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.item-category {
  color: #667eea;
  font-size: 0.85rem;
  font-weight: 500;
  margin: 0 0 0.75rem 0;
}

.item-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 0.75rem;
}

.item-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #999;
}

.item-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  justify-content: center;
}

.btn-view,
.btn-remove {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  text-align: center;
}

.btn-view {
  background: #667eea;
  color: white;
}

.btn-view:hover {
  background: #5568d3;
}

.btn-remove {
  background: white;
  color: #e74c3c;
  border: 1px solid #e74c3c;
}

.btn-remove:hover:not(:disabled) {
  background: #fee;
}

.btn-remove:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state p {
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


