<template>
  <div class="education-container">
    <div class="education-header">
      <h1>Modul Edukasi & Panduan</h1>
      <div class="header-actions">
        <router-link to="/education/bookmarks" class="btn-bookmarks">
          📑 Bookmark Saya
        </router-link>
      </div>
    </div>

    <!-- Filter Category -->
    <div class="filter-section">
      <div class="filter-buttons">
        <button
          @click="selectedCategory = null"
          :class="['filter-btn', { active: selectedCategory === null }]"
        >
          Semua
        </button>
        <button
          v-for="category in categories"
          :key="category"
          @click="selectedCategory = category"
          :class="['filter-btn', { active: selectedCategory === category }]"
        >
          {{ category }}
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading && modules.length === 0" class="loading">
      Memuat modul edukasi...
    </div>

    <!-- Empty State -->
    <div v-else-if="modules.length === 0" class="empty-state">
      <p>Belum ada modul edukasi</p>
    </div>

    <!-- Modules List -->
    <div v-else class="modules-grid">
      <div
        v-for="module in modules"
        :key="module.id"
        class="module-card"
        @click="goToDetail(module.id)"
      >
        <div v-if="module.image" class="module-image">
          <img :src="module.image" :alt="module.title" />
        </div>
        <div class="module-content">
          <div class="module-header">
            <h3>{{ module.title }}</h3>
            <span v-if="module.category" class="module-category">
              {{ module.category }}
            </span>
          </div>
          <p class="module-description">
            {{ truncateText(module.content, 150) }}
          </p>
          <div class="module-footer">
            <span class="module-views">
              👁️ {{ module.view_count || 0 }} views
            </span>
            <router-link
              :to="`/education/${module.id}`"
              class="btn-read-more"
              @click.stop
            >
              Baca Selengkapnya →
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="modules.length > 0" class="pagination">
      <button
        @click="loadPage(currentPage - 1)"
        :disabled="currentPage === 1 || loading"
        class="btn-pagination"
      >
        Previous
      </button>
      <span class="page-info">Halaman {{ currentPage }}</span>
      <button
        @click="loadPage(currentPage + 1)"
        :disabled="!hasNextPage || loading"
        class="btn-pagination"
      >
        Next
      </button>
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
const hasNextPage = ref(false)

const loading = computed(() => educationStore.loading)
const modules = computed(() => {
  if (educationStore.modules?.data) {
    return educationStore.modules.data
  }
  return []
})

const categories = computed(() => {
  const cats = new Set()
  modules.value.forEach(module => {
    if (module.category) {
      cats.add(module.category)
    }
  })
  return Array.from(cats)
})

const loadModules = async (page = 1) => {
  try {
    const response = await educationStore.fetchModules(selectedCategory.value, page)
    if (response.data) {
      currentPage.value = response.data.current_page || 1
      hasNextPage.value = !!response.data.next_page_url
    }
  } catch (error) {
    console.error('Error loading modules:', error)
  }
}

const loadPage = (page) => {
  if (page >= 1) {
    loadModules(page)
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

watch(selectedCategory, () => {
  currentPage.value = 1
  loadModules(1)
})

onMounted(() => {
  loadModules()
})
</script>

<style scoped>
.education-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.education-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.education-header h1 {
  margin: 0;
  color: #333;
  font-size: 2rem;
}

.btn-bookmarks {
  background: #667eea;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: background 0.3s;
}

.btn-bookmarks:hover {
  background: #5568d3;
}

.filter-section {
  margin-bottom: 2rem;
}

.filter-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 0.9rem;
}

.filter-btn:hover {
  border-color: #667eea;
  color: #667eea;
}

.filter-btn.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.modules-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.module-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.module-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.module-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f5f5f5;
}

.module-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.module-content {
  padding: 1.5rem;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.module-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.25rem;
  flex: 1;
}

.module-category {
  background: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.module-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.module-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.module-views {
  color: #999;
  font-size: 0.85rem;
}

.btn-read-more {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  transition: color 0.3s;
}

.btn-read-more:hover {
  color: #5568d3;
  text-decoration: underline;
}

.loading,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-pagination {
  padding: 0.5rem 1rem;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-pagination:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #667eea;
}

.btn-pagination:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-weight: 500;
}
</style>


