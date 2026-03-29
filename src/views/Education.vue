<template>
  <div class="page-wrapper">

    <!-- Hero -->
    <section class="edu-hero">
      <div class="hero-bg-leaf">🌿</div>
      <div class="hero-bg-leaf hero-bg-leaf--2">🍃</div>
      <div class="page-container">
        <div class="edu-hero-inner">
          <div class="hero-text">
            <span class="hero-eyebrow">Pusat Pengetahuan</span>
            <h1 class="edu-title">Modul Edukasi</h1>
            <p class="edu-sub">Pelajari cara merawat tanaman hias dari para pakar</p>
          </div>
          <RouterLink to="/education/bookmarks" class="bookmark-hero-btn">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
            </svg>
            Bookmark Saya
          </RouterLink>
        </div>
      </div>
    </section>

    <div class="page-container edu-content">

      <!-- Search Bar -->
      <div class="search-wrap">
        <div class="search-field">
          <svg class="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            v-model="searchQuery"
            @input="handleSearch"
            @keyup.enter="performSearch"
            type="text"
            placeholder="Cari modul edukasi..."
            class="search-input"
          />
          <button v-if="searchQuery" @click="clearSearch" class="search-clear">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Plant Filter -->
      <div class="plant-filter">
        <label class="plant-filter-label">Filter Tanaman</label>
        <select v-model="selectedPlantId" class="plant-filter-select">
          <option value="">Semua Edukasi</option>
          <option v-for="p in plants" :key="p.id" :value="String(p.id)">{{ p.name }}</option>
        </select>
      </div>

      <!-- Toolbar -->
      <div class="toolbar">
        <p class="result-label">
          <template v-if="searchQuery">
            Hasil untuk <em>"{{ searchQuery }}"</em> · <strong>{{ modules.length }}</strong> modul
          </template>
          <template v-else>
            <strong>{{ modules.length }}</strong> modul tersedia
          </template>
        </p>
        <div class="view-toggle">
          <button @click="viewMode = 'grid'" class="view-btn" :class="{ 'view-btn--on': viewMode === 'grid' }" title="Grid">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
            </svg>
          </button>
          <button @click="viewMode = 'list'" class="view-btn" :class="{ 'view-btn--on': viewMode === 'list' }" title="List">
            <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading && modules.length === 0" class="state-box">
        <div class="spinner"></div>
        <p>Memuat modul...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="modules.length === 0" class="state-box">
        <div class="state-icon">{{ searchQuery ? '🔍' : '📚' }}</div>
        <p class="state-title">{{ searchQuery ? 'Modul tidak ditemukan' : 'Belum ada modul' }}</p>
        <p class="state-sub">{{ searchQuery ? 'Coba kata kunci lain' : 'Modul akan muncul di sini' }}</p>
      </div>

      <!-- ── GRID VIEW ── -->
      <div v-else-if="viewMode === 'grid'" class="edu-grid">
        <div v-for="module in modules" :key="module.id" class="mcard" @click="goToDetail(module.id)">
          <div class="mcard-img">
            <img v-if="getThumbnailImage(module)" :src="getImageUrl(getThumbnailImage(module))" :alt="module.title" @error="handleImageError" />
            <div v-else class="mcard-img-placeholder">
              <svg width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span v-if="module.is_maintenance_guide" class="guide-badge">📋 Panduan</span>
            <div class="mcard-hover-layer">Baca Selengkapnya →</div>
          </div>
          <div class="mcard-body">
            <h3 class="mcard-title">{{ module.title }}</h3>
            <p class="mcard-desc">{{ truncateText(module.content, 100) }}</p>
            <div class="mcard-footer" @click.stop>
              <button @click="toggleBookmark(module)" class="bm-btn" :class="{ 'bm-btn--saved': module.is_bookmarked }">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
                {{ module.is_bookmarked ? 'Tersimpan' : 'Simpan' }}
              </button>
              <RouterLink :to="`/education/${module.id}`" class="read-btn">Baca →</RouterLink>
            </div>
          </div>
        </div>
      </div>

      <!-- ── LIST VIEW ── -->
      <div v-else class="edu-list">
        <div v-for="module in modules" :key="module.id" class="mrow">
          <div class="mrow-img" @click="goToDetail(module.id)">
            <img v-if="getThumbnailImage(module)" :src="getImageUrl(getThumbnailImage(module))" :alt="module.title" @error="handleImageError" />
            <div v-else class="mrow-img-placeholder">
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253"/>
              </svg>
            </div>
          </div>
          <div class="mrow-body">
            <div class="mrow-top">
              <h3 class="mcard-title" @click="goToDetail(module.id)">{{ module.title }}</h3>
              <span v-if="module.is_maintenance_guide" class="guide-badge guide-badge--inline">📋 Panduan</span>
            </div>
            <p class="mcard-desc">{{ truncateText(module.content, 140) }}</p>
            <div class="mcard-footer">
              <button @click.stop="toggleBookmark(module)" class="bm-btn" :class="{ 'bm-btn--saved': module.is_bookmarked }">
                <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                </svg>
                {{ module.is_bookmarked ? 'Tersimpan' : 'Simpan' }}
              </button>
              <RouterLink :to="`/education/${module.id}`" class="read-btn">Baca →</RouterLink>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useEducationStore } from '../stores/education'
import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const router         = useRouter()
const route          = useRoute()
const educationStore = useEducationStore()
const authStore      = useAuthStore()

const currentPage      = ref(1)
const viewMode         = ref('grid')
const searchQuery      = ref('')
const searchTimeout    = ref(null)
const plants           = ref([])
const selectedPlantId  = ref('')

const loading = computed(() => educationStore.loading)
const modules = computed(() => {
  const raw = educationStore.modules
  if (raw?.data) return Array.isArray(raw.data) ? raw.data : []
  return Array.isArray(raw) ? raw : []
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const loadModules = async (page = 1) => {
  try {
    const plantId = selectedPlantId.value ? parseInt(selectedPlantId.value, 10) : null
    await educationStore.fetchModules({
      plantId,
      page,
      search: searchQuery.value
    })
  } catch (err) {
    console.error(err)
  }
}

const handleSearch  = () => {
  clearTimeout(searchTimeout.value)
  searchTimeout.value = setTimeout(() => { currentPage.value = 1; loadModules(1) }, 500)
}
const performSearch = () => { clearTimeout(searchTimeout.value); currentPage.value = 1; loadModules(1) }
const clearSearch   = () => { searchQuery.value = ''; currentPage.value = 1; loadModules(1) }

const loadPlants = async () => {
  try {
    const r = await axios.get(`${API_BASE_URL}/public/plants`)
    plants.value = r?.data?.data || r?.data || []
  } catch {
    plants.value = []
  }
}

const goToDetail   = (id) => router.push(`/education/${id}`)
const truncateText = (t, l) => !t ? '' : t.length <= l ? t : t.substring(0, l) + '...'

const toggleBookmark = async (module) => {
  if (!authStore.isAuthenticated) {
    router.push({ name: 'Login', query: { redirect: route.fullPath } })
    return
  }
  try {
    if (module.is_bookmarked) { await educationStore.unbookmark(module.id); module.is_bookmarked = false }
    else                      { await educationStore.bookmark(module.id);   module.is_bookmarked = true  }
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal mengubah bookmark')
  }
}

const getThumbnailImage = (m) => m.image || m.content_images?.[0] || null

const getImageUrl = (p) => {
  if (!p) return ''
  if (p.startsWith('http://') || p.startsWith('https://')) return p
  const base  = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace('/api', '')
  const clean = p.startsWith('/') ? p.substring(1) : p
  return clean.startsWith('storage/') ? `${base}/${clean}` : `${base}/storage/${clean}`
}

const handleImageError = (e) => { e.target.style.display = 'none' }

watch(selectedPlantId, () => { currentPage.value = 1; loadModules(1) })
watch(searchQuery,      () => { if (!searchQuery.value) { currentPage.value = 1; loadModules(1) } })

onMounted(async () => {
  await loadPlants()
  const queryPlantId = route.query?.plant_id
  if (typeof queryPlantId === 'string' && queryPlantId.trim() !== '') {
    selectedPlantId.value = queryPlantId.trim()
  }
  loadModules()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');

/* ─── Reset ─── */
a { text-decoration: none; }
* { box-sizing: border-box; }

/* ─── Root ─── */
.page-wrapper {
  min-height: 100vh;
  background: #f5f7f4;
  font-family: 'DM Sans', sans-serif;
}

/* ─── Hero ─── */
.edu-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 60%, #3a7a50 100%);
  margin-top: -64px;
  padding: calc(3rem + 64px) 0 2.75rem;
}
.hero-bg-leaf {
  position: absolute;
  font-size: 9rem;
  opacity: .07;
  top: -1.5rem; right: -1rem;
  transform: rotate(20deg);
  pointer-events: none;
  user-select: none;
}
.hero-bg-leaf--2 {
  font-size: 6rem;
  top: auto; bottom: -2rem; left: -1rem; right: auto;
  transform: rotate(-30deg);
}
.page-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.5rem;
}
.edu-hero-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}
.hero-eyebrow {
  display: inline-block;
  background: rgba(255,255,255,.15);
  color: #a7f3c0;
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
  padding: .25rem .75rem;
  border-radius: 999px;
  margin-bottom: .75rem;
}
.edu-title {
  font-family: 'DM Serif Display', serif;
  font-size: 2.25rem;
  font-weight: 400;
  color: #fff;
  margin: 0 0 .375rem;
  line-height: 1.15;
}
.edu-sub {
  font-size: .9375rem;
  color: rgba(255,255,255,.65);
  margin: 0;
}
.bookmark-hero-btn {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .625rem 1.25rem;
  background: rgba(255,255,255,.12);
  border: 1.5px solid rgba(255,255,255,.25);
  color: #fff;
  border-radius: 10px;
  font-size: .875rem;
  font-weight: 600;
  white-space: nowrap;
  transition: background .18s, border-color .18s;
}
.bookmark-hero-btn:hover {
  background: rgba(255,255,255,.22);
  border-color: rgba(255,255,255,.5);
}

/* ─── Content area ─── */
.edu-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 1.75rem;
  padding-bottom: 5rem;
}

/* ─── Search ─── */
.search-wrap { position: relative; }
.search-field {
  position: relative;
  background: #fff;
  border: 1.5px solid #d9e4d4;
  border-radius: 12px;
  display: flex;
  align-items: center;
  transition: border-color .18s, box-shadow .18s;
}
.search-field:focus-within {
  border-color: #3a7a50;
  box-shadow: 0 0 0 3px rgba(58,122,80,.1);
}
.search-icon {
  position: absolute;
  left: 1rem;
  width: 18px; height: 18px;
  color: #9aad9a;
  pointer-events: none;
}
.search-input {
  width: 100%;
  padding: .8rem 2.75rem .8rem 3rem;
  border: none;
  background: transparent;
  font-family: 'DM Sans', sans-serif;
  font-size: .9375rem;
  color: #1e3a2a;
  outline: none;
}
.search-input::placeholder { color: #a8bca8; }
.search-clear {
  position: absolute;
  right: 1rem;
  background: none;
  border: none;
  cursor: pointer;
  color: #9aad9a;
  display: flex;
  transition: color .15s;
}
.search-clear:hover { color: #3a7a50; }

.plant-filter {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .75rem;
  background: #fff;
  border: 1.5px solid #d9e4d4;
  border-radius: 14px;
  padding: .75rem 1rem;
}
.plant-filter-label {
  font-size: .8125rem;
  font-weight: 800;
  color: #1e3a2a;
  white-space: nowrap;
}
.plant-filter-select {
  flex: 1;
  max-width: 420px;
  padding: .65rem .85rem;
  border-radius: 12px;
  border: 1.5px solid #d9e4d4;
  background: #f7fbf7;
  color: #1e3a2a;
  font-weight: 700;
  outline: none;
}
.plant-filter-select:focus {
  border-color: #3a7a50;
  box-shadow: 0 0 0 3px rgba(58,122,80,.12);
}

/* ─── Category pills ─── */
.cat-scroll {
  display: flex;
  flex-wrap: wrap;
  gap: .5rem;
}
.cat-pill {
  display: inline-flex;
  align-items: center;
  gap: .375rem;
  padding: .4rem 1rem;
  border-radius: 999px;
  font-size: .8125rem;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  border: 1.5px solid #d9e4d4;
  background: #fff;
  color: #5a7a62;
  cursor: pointer;
  transition: all .15s;
}
.cat-pill:hover { border-color: #3a7a50; color: #1e3a2a; }
.cat-pill--active {
  background: #1a3a2a;
  border-color: #1a3a2a;
  color: #fff;
}
.cat-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
  opacity: .5;
}
.cat-pill--active .cat-dot { opacity: 1; background: #7debb0; }
.cat-badge {
  font-size: .7rem;
  opacity: .65;
  margin-left: .125rem;
}

/* ─── Toolbar ─── */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: .5rem;
}
.result-label {
  font-size: .875rem;
  color: #6a8a72;
  margin: 0;
}
.result-label strong { color: #1e3a2a; }
.result-label em { font-style: italic; color: #3a7a50; }
.view-toggle {
  display: flex;
  gap: .25rem;
  background: #e8f0e8;
  border-radius: 8px;
  padding: .25rem;
}
.view-btn {
  width: 32px; height: 32px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9aad9a;
  background: transparent;
  transition: all .15s;
}
.view-btn:hover { color: #3a7a50; }
.view-btn--on { background: #fff; color: #1a3a2a; box-shadow: 0 1px 3px rgba(0,0,0,.1); }

/* ─── States ─── */
.state-box {
  background: #fff;
  border: 1.5px solid #d9e4d4;
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  color: #6a8a72;
}
.state-icon { font-size: 3rem; margin-bottom: .75rem; }
.state-title { font-weight: 700; color: #1e3a2a; margin: 0 0 .25rem; }
.state-sub { font-size: .875rem; margin: 0; }
.spinner {
  width: 28px; height: 28px;
  border: 3px solid #d9e4d4;
  border-top-color: #3a7a50;
  border-radius: 50%;
  animation: spin .7s linear infinite;
  margin: 0 auto .75rem;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ─── Grid View ─── */
.edu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(268px, 1fr));
  gap: 1.125rem;
}
.mcard {
  background: #fff;
  border: 1.5px solid #d9e4d4;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: border-color .2s, box-shadow .2s, transform .2s;
}
.mcard:hover {
  border-color: #3a7a50;
  box-shadow: 0 8px 24px rgba(30,58,42,.1);
  transform: translateY(-2px);
}
.mcard-img {
  position: relative;
  height: 158px;
  background: #e8f0e8;
  overflow: hidden;
}
.mcard-img img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .35s;
}
.mcard:hover .mcard-img img { transform: scale(1.05); }
.mcard-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: #b0cbb0;
}
.mcard-hover-layer {
  position: absolute; inset: 0;
  background: rgba(26,58,42,.45);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: .875rem; font-weight: 600;
  opacity: 0;
  transition: opacity .2s;
}
.mcard:hover .mcard-hover-layer { opacity: 1; }
.guide-badge {
  position: absolute;
  top: .625rem; right: .625rem;
  background: rgba(245,158,11,.95);
  color: #fff;
  font-size: .6875rem; font-weight: 700;
  padding: .2rem .6rem;
  border-radius: 999px;
  z-index: 2;
}
.guide-badge--inline {
  position: static;
  flex-shrink: 0;
}
.mcard-body {
  padding: 1.125rem;
  display: flex;
  flex-direction: column;
  gap: .625rem;
}
.mcard-title {
  font-size: .9375rem;
  font-weight: 700;
  color: #1e3a2a;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.45;
  transition: color .15s;
}
.mcard:hover .mcard-title,
.mcard-title:hover { color: #3a7a50; }
.mcard-desc {
  font-size: .8125rem;
  color: #6a8a72;
  margin: 0;
  line-height: 1.65;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.mcard-footer {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding-top: .75rem;
  border-top: 1px solid #edf2ed;
  margin-top: auto;
}

/* ─── Bookmark + Read button ─── */
.bm-btn {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  padding: .35rem .85rem;
  border-radius: 999px;
  border: 1.5px solid #d9e4d4;
  background: #fff;
  color: #6a8a72;
  font-size: .8rem;
  font-weight: 500;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  transition: all .15s;
}
.bm-btn:hover { border-color: #3a7a50; color: #3a7a50; }
.bm-btn--saved { background: #e8f5ee; border-color: #6abf88; color: #1a6a3a; }
.read-btn {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  padding: .4rem 1rem;
  background: #1a3a2a;
  color: #fff;
  border-radius: 8px;
  font-size: .8125rem;
  font-weight: 600;
  transition: background .15s;
  white-space: nowrap;
}
.read-btn:hover { background: #3a7a50; }

/* ─── List View ─── */
.edu-list { display: flex; flex-direction: column; gap: .875rem; }
.mrow {
  background: #fff;
  border: 1.5px solid #d9e4d4;
  border-radius: 14px;
  display: flex;
  gap: 1.125rem;
  padding: 1.125rem;
  transition: border-color .2s, box-shadow .2s;
}
.mrow:hover {
  border-color: #3a7a50;
  box-shadow: 0 4px 14px rgba(30,58,42,.08);
}
.mrow-img {
  width: 116px; height: 82px;
  border-radius: 10px;
  overflow: hidden;
  background: #e8f0e8;
  flex-shrink: 0;
  cursor: pointer;
}
.mrow-img img { width: 100%; height: 100%; object-fit: cover; }
.mrow-img-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: #b0cbb0;
}
.mrow-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: .45rem;
}
.mrow-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: .5rem;
}

/* ─── Responsive ─── */
@media (max-width: 640px) {
  .edu-hero { padding: calc(2rem + 64px) 0 1.75rem; }
  .edu-title { font-size: 1.75rem; }
  .edu-hero-inner { flex-direction: column; align-items: flex-start; }
  .mrow { flex-direction: column; }
  .mrow-img { width: 100%; height: 140px; }
}
</style>
