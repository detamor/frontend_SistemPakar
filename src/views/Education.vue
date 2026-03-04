<template>
  <div class="page-wrapper">

    <!-- Header -->
    <section class="edu-hero">
      <div class="sp-container">
        <div class="edu-hero-inner">
          <div>
            <RouterLink to="/" class="sp-btn sp-btn-secondary sp-btn-sm" style="margin-bottom:1rem;display:inline-flex;">
              <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
              Kembali
            </RouterLink>
            <h1 class="edu-title">Modul Edukasi</h1>
            <p class="edu-sub">Pelajari cara merawat tanaman hias dari para pakar</p>
          </div>
          <RouterLink to="/education/bookmarks" class="sp-btn sp-btn-primary">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            Bookmark Saya
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Content -->
    <div class="sp-container edu-content">

      <!-- Category Filter -->
      <div class="cat-filter">
        <button v-for="cat in categoryStats" :key="cat.name"
          @click="selectedCategory = cat.name === 'Semua' ? null : cat.name"
          class="cat-btn"
          :class="{ 'cat-btn--active': (selectedCategory === null && cat.name === 'Semua') || selectedCategory === cat.name }">
          {{ cat.name }} <span class="cat-count">({{ cat.count }})</span>
        </button>
      </div>

      <!-- Search -->
      <div class="sp-card search-box">
        <div class="search-inner">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input v-model="searchQuery" @input="handleSearch" @keyup.enter="performSearch"
            type="text" placeholder="Cari modul edukasi..." class="glass-input search-input" />
          <button v-if="searchQuery" @click="clearSearch" class="search-clear">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div v-if="searchQuery" class="search-hint">
          Hasil untuk: <strong style="color:var(--primary);">"{{ searchQuery }}"</strong>
        </div>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <h2 class="toolbar-title">{{ searchQuery ? 'Hasil Pencarian' : 'Semua Modul' }}</h2>
        <div class="view-toggle">
          <button @click="viewMode = 'grid'" class="view-btn" :class="{ 'view-btn--active': viewMode === 'grid' }">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
          </button>
          <button @click="viewMode = 'list'" class="view-btn" :class="{ 'view-btn--active': viewMode === 'list' }">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading && modules.length === 0" class="sp-card empty-state">
        <div class="sp-spinner" style="margin:0 auto .75rem;width:28px;height:28px;border-width:3px;"></div>
        <p style="color:var(--text-muted);">Memuat modul edukasi...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="modules.length === 0" class="sp-card empty-state">
        <div style="font-size:3rem;margin-bottom:.75rem;opacity:.5;">{{ searchQuery ? '🔍' : '📚' }}</div>
        <p style="font-weight:700;color:var(--gray-900);margin:0 0 .25rem;">{{ searchQuery ? 'Tidak ada modul ditemukan' : 'Belum ada modul edukasi' }}</p>
        <p style="font-size:.875rem;color:var(--text-muted);margin:0;">{{ searchQuery ? 'Coba kata kunci lain' : 'Modul akan muncul di sini' }}</p>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="edu-grid">
        <div v-for="module in modules" :key="module.id" class="module-card">
          <div class="module-thumb" @click="goToDetail(module.id)">
            <img v-if="getThumbnailImage(module)" :src="getImageUrl(getThumbnailImage(module))" :alt="module.title" @error="handleImageError" class="module-thumb-img" />
            <div v-else class="module-thumb-placeholder">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <div class="module-thumb-overlay">Baca Selengkapnya →</div>
            <span v-if="module.category" class="module-cat-badge">{{ module.category }}</span>
            <span v-if="module.is_maintenance_guide" class="maintenance-badge" title="Panduan Pemeliharaan Terstruktur">📋 Panduan</span>
          </div>
          <div class="module-body">
            <h3 class="module-title-text" @click="goToDetail(module.id)">{{ module.title }}</h3>
            <p class="module-desc">{{ module.description || truncateText(module.content, 110) }}</p>
            <div class="module-meta">
              <span>⏱ {{ estimateReadingTime(module.content) }} min</span>
              <span>👁 {{ module.view_count || 0 }}</span>
            </div>
            <div class="module-actions">
              <button @click.stop="toggleBookmark(module)" class="bookmark-btn" :class="{ 'bookmark-btn--saved': module.is_bookmarked }">
                {{ module.is_bookmarked ? '★ Tersimpan' : '☆ Simpan' }}
              </button>
              <RouterLink :to="`/education/${module.id}`" class="sp-btn sp-btn-primary sp-btn-sm" style="margin-left:auto;">Baca →</RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="edu-list">
        <div v-for="module in modules" :key="module.id" class="module-list-item">
          <div class="module-list-thumb" @click="goToDetail(module.id)">
            <img v-if="getThumbnailImage(module)" :src="getImageUrl(getThumbnailImage(module))" :alt="module.title" @error="handleImageError" class="module-list-thumb-img" />
            <div v-else class="module-list-thumb-placeholder">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/></svg>
            </div>
          </div>
          <div class="module-list-body">
            <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:.5rem;">
              <h3 class="module-title-text" @click="goToDetail(module.id)" style="font-size:.9375rem;">{{ module.title }}</h3>
              <div style="display:flex;flex-direction:column;align-items:flex-end;gap:.25rem;">
                <span v-if="module.category" class="module-cat-badge" style="position:static;">{{ module.category }}</span>
                <span v-if="module.is_maintenance_guide" class="maintenance-badge" style="position:static;font-size:.625rem;padding:.15rem .45rem;">📋 Panduan</span>
              </div>
            </div>
            <p class="module-desc">{{ module.description || truncateText(module.content, 140) }}</p>
            <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:.5rem;">
              <div class="module-meta">
                <span>⏱ {{ estimateReadingTime(module.content) }} min</span>
                <span>👁 {{ module.view_count || 0 }}</span>
              </div>
              <div style="display:flex;gap:.5rem;">
                <button @click.stop="toggleBookmark(module)" class="bookmark-btn" :class="{ 'bookmark-btn--saved': module.is_bookmarked }">{{ module.is_bookmarked ? '★' : '☆' }}</button>
                <RouterLink :to="`/education/${module.id}`" class="sp-btn sp-btn-primary sp-btn-sm">Baca →</RouterLink>
              </div>
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

const router        = useRouter()
const educationStore = useEducationStore()

const selectedCategory = ref(null)
const currentPage      = ref(1)
const viewMode         = ref('grid')
const searchQuery      = ref('')
const searchTimeout    = ref(null)

const loading = computed(() => educationStore.loading)
const modules = computed(() => {
  let list = educationStore.modules?.data ? educationStore.modules.data : Array.isArray(educationStore.modules) ? educationStore.modules : []
  return list.map(m => ({ ...m, is_bookmarked: m.is_bookmarked || false }))
})

const allModules    = ref([])
const categoryStats = computed(() => {
  const stats = { 'Semua': allModules.value.length }
  allModules.value.forEach(m => { if (m.category) stats[m.category] = (stats[m.category] || 0) + 1 })
  return Object.entries(stats).map(([name, count]) => ({ name, count }))
})

const loadModules = async (page = 1) => {
  try { await educationStore.fetchModules(selectedCategory.value, page, searchQuery.value) }
  catch (err) { console.error(err) }
}
const handleSearch  = () => {
  if (searchTimeout.value) clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => { currentPage.value = 1; loadModules(1) }, 500)
}
const performSearch = () => { if (searchTimeout.value) clearTimeout(searchTimeout.value); currentPage.value = 1; loadModules(1) }
const clearSearch   = () => { searchQuery.value = ''; currentPage.value = 1; loadModules(1) }

const loadAllModules = async () => {
  try { const r = await educationStore.fetchModules(null, 1); if (r.data) allModules.value = r.data.data || [] }
  catch (e) {}
}

const goToDetail          = (id) => router.push(`/education/${id}`)
const truncateText        = (t, l) => !t ? '' : t.length <= l ? t : t.substring(0, l) + '...'
const estimateReadingTime = (c) => !c ? 0 : Math.ceil(c.length / 5 / 200) || 1

const toggleBookmark = async (module) => {
  try {
    if (module.is_bookmarked) { await educationStore.unbookmark(module.id); module.is_bookmarked = false }
    else                      { await educationStore.bookmark(module.id);   module.is_bookmarked = true  }
  } catch { alert('Gagal mengubah bookmark') }
}

const getThumbnailImage = (m) => {
  if (m.image) return m.image
  if (m.content_images?.length) return m.content_images[0]
  return null
}

const getImageUrl = (p) => {
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')
  const clean = p.startsWith('/') ? p.substring(1) : p
  return clean.startsWith('storage/') ? `${base}/${clean}` : `${base}/storage/${clean}`
}

const handleImageError = (e) => { e.target.style.display = 'none' }

watch(selectedCategory, () => { currentPage.value = 1; loadModules(1) })
watch(searchQuery, () => { if (!searchQuery.value) { currentPage.value = 1; loadModules(1) } })
onMounted(async () => { await loadAllModules(); loadModules() })
</script>

<style scoped>
a { text-decoration: none; }

.page-wrapper { min-height: 100vh; background: var(--bg-subtle); }

/* Hero */
.edu-hero {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 5rem 0 1.75rem;
}
.edu-hero-inner { display: flex; align-items: flex-end; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.edu-title { font-size: 1.625rem; font-weight: 800; color: var(--gray-900); margin: 0 0 .25rem; }
.edu-sub   { font-size: .9375rem; color: var(--text-muted); margin: 0; }

/* Content */
.edu-content { display: flex; flex-direction: column; gap: 1.25rem; padding-top: 1.75rem; padding-bottom: 4rem; }

/* Category filter */
.cat-filter { display: flex; flex-wrap: wrap; gap: .5rem; }
.cat-btn {
  padding: .375rem .875rem;
  border-radius: 9999px;
  font-size: .8125rem; font-weight: 500;
  border: 1px solid var(--border);
  background: #fff; color: var(--text-secondary);
  cursor: pointer; transition: all .15s;
}
.cat-btn:hover { border-color: var(--primary-300); color: var(--primary-700); }
.cat-btn--active { background: var(--primary-50); border-color: var(--primary-300); color: var(--primary-700); font-weight: 600; }
.cat-count { font-size: .75rem; opacity: .65; margin-left: .125rem; }

/* Search */
.search-box { padding: .875rem 1rem; }
.search-inner { position: relative; }
.search-icon {
  position: absolute; left: .875rem; top: 50%; transform: translateY(-50%);
  width: 18px; height: 18px; color: var(--gray-400); pointer-events: none;
}
.search-input { padding-left: 2.75rem !important; padding-right: 2.5rem !important; }
.search-clear {
  position: absolute; right: .875rem; top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--gray-400); display: flex; transition: color .15s;
}
.search-clear:hover { color: var(--gray-700); }
.search-hint { font-size: .8125rem; color: var(--text-muted); margin-top: .5rem; padding-left: .25rem; }

/* Toolbar */
.toolbar { display: flex; align-items: center; justify-content: space-between; }
.toolbar-title { font-size: 1.125rem; font-weight: 700; color: var(--gray-900); margin: 0; }
.view-toggle { display: flex; gap: .25rem; background: var(--gray-100); border-radius: 8px; padding: .25rem; }
.view-btn {
  width: 32px; height: 32px; border-radius: 6px; border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--gray-400); background: transparent; transition: all .15s;
}
.view-btn:hover { color: var(--gray-700); }
.view-btn--active { background: #fff; color: var(--primary); box-shadow: 0 1px 3px rgba(0,0,0,.1); }

/* Empty */
.empty-state { padding: 3rem; text-align: center; }

/* Grid */
.edu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.125rem;
}
.module-card {
  background: #fff; border: 1px solid var(--border);
  border-radius: 12px; overflow: hidden;
  transition: border-color .15s, box-shadow .15s;
}
.module-card:hover { border-color: var(--primary-300); box-shadow: var(--shadow-md); }

.module-thumb {
  position: relative; height: 160px; overflow: hidden;
  background: var(--gray-100); cursor: pointer;
}
.module-thumb-img { width: 100%; height: 100%; object-fit: cover; transition: transform .3s; }
.module-card:hover .module-thumb-img { transform: scale(1.04); }
.module-thumb-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: var(--gray-300);
}
.module-thumb-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.38);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: .875rem; font-weight: 600;
  opacity: 0; transition: opacity .2s;
}
.module-card:hover .module-thumb-overlay { opacity: 1; }
.module-cat-badge {
  position: absolute; top: .5rem; left: .5rem;
  background: rgba(22,163,74,.9); color: #fff;
  font-size: .6875rem; font-weight: 700;
  padding: .2rem .6rem; border-radius: 9999px;
  z-index: 10;
}
.maintenance-badge {
  position: absolute; top: .5rem; right: .5rem;
  background: rgba(245,158,11,.95); color: #fff;
  font-size: .6875rem; font-weight: 700;
  padding: .2rem .6rem; border-radius: 9999px;
  z-index: 10;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.module-body { padding: 1rem; display: flex; flex-direction: column; gap: .625rem; }
.module-title-text {
  font-size: .9375rem; font-weight: 700; color: var(--gray-900);
  margin: 0; cursor: pointer; transition: color .15s;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.module-title-text:hover { color: var(--primary); }
.module-desc {
  font-size: .8125rem; color: var(--text-muted); margin: 0; line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.module-meta { display: flex; gap: .875rem; font-size: .75rem; color: var(--gray-400); }
.module-actions {
  display: flex; align-items: center; gap: .5rem;
  padding-top: .625rem; border-top: 1px solid var(--border);
}

/* List */
.edu-list { display: flex; flex-direction: column; gap: .875rem; }
.module-list-item {
  background: #fff; border: 1px solid var(--border); border-radius: 12px;
  display: flex; gap: 1rem; padding: 1rem;
  transition: border-color .15s, box-shadow .15s;
}
.module-list-item:hover { border-color: var(--primary-300); box-shadow: var(--shadow-sm); }
.module-list-thumb {
  width: 120px; height: 84px; border-radius: 8px; overflow: hidden;
  background: var(--gray-100); flex-shrink: 0; cursor: pointer;
}
.module-list-thumb-img { width: 100%; height: 100%; object-fit: cover; }
.module-list-thumb-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: var(--gray-300);
}
.module-list-body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: .5rem; }

/* Bookmark */
.bookmark-btn {
  font-size: .8125rem; padding: .3rem .75rem;
  border-radius: 9999px; border: 1px solid var(--border);
  background: #fff; color: var(--text-muted); cursor: pointer; transition: all .15s;
}
.bookmark-btn:hover { border-color: var(--primary-300); color: var(--primary); }
.bookmark-btn--saved { background: var(--primary-50); border-color: var(--primary-300); color: var(--primary-700); }

@media (max-width: 640px) {
  .edu-hero-inner { flex-direction: column; align-items: flex-start; }
  .module-list-item { flex-direction: column; }
  .module-list-thumb { width: 100%; height: 140px; }
}
</style>
