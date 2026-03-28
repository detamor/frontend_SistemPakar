<template>
  <div class="edu-page">

    <!-- Sticky Top Bar -->
    <div class="top-bar">
      <router-link to="/education" class="back-btn">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Kembali
      </router-link>
      <span class="top-bar-title" v-if="module">{{ module.title }}</span>
    </div>

    <div class="page-body">

      <!-- Loading -->
      <div v-if="loading" class="state-center">
        <div class="spinner"></div>
        <p>Memuat modul...</p>
      </div>

      <!-- Error -->
      <div v-else-if="!module" class="state-center">
        <div class="state-icon">📭</div>
        <p class="state-label">Modul tidak ditemukan</p>
        <router-link to="/education" class="btn-primary">Kembali ke Daftar</router-link>
      </div>

      <!-- Content -->
      <div v-else class="content-layout">

        <!-- LEFT: Main Column -->
        <div class="main-col">

          <!-- Hero Card -->
          <div class="hero-card">
            <div class="hero-top">
              <div>
                <div class="tag-row" v-if="module.is_maintenance_guide || maintenanceTags.length">
                  <span v-if="module.is_maintenance_guide" class="badge-guide">Panduan Pemeliharaan</span>
                  <span v-for="tag in maintenanceTags" :key="tag" class="badge-tag">{{ tag }}</span>
                </div>
                <h1 class="module-title">{{ module.title }}</h1>
              </div>
              <button
                @click="toggleBookmark"
                :disabled="bookmarking"
                class="bookmark-btn"
                :class="{ saved: module.is_bookmarked }"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" :fill="module.is_bookmarked ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/>
                </svg>
                {{ module.is_bookmarked ? 'Tersimpan' : 'Simpan' }}
              </button>
            </div>
          </div>

          <!-- Thumbnail -->
          <div v-if="module.image" class="thumb-card">
            <img :src="getImageUrl(module.image)" :alt="module.title" @error="handleImageError" class="thumb-img" />
          </div>

          <!-- Maintenance Steps -->
          <div v-if="module.is_maintenance_guide && module.maintenance_steps_json" class="section-card">
            <div class="section-head">
              <div class="section-icon green">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                </svg>
              </div>
              <h2 class="section-title">Langkah Pemeliharaan</h2>
            </div>

            <div class="steps-list">
              <div
                v-for="(step, i) in module.maintenance_steps_json"
                :key="step.step"
                class="step-item"
              >
                <div class="step-left">
                  <div class="step-num">{{ step.step }}</div>
                  <div v-if="i < module.maintenance_steps_json.length - 1" class="step-line"></div>
                </div>
                <div class="step-body">
                  <h4 class="step-title">{{ step.title }}</h4>
                  <p class="step-desc">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="section-card">
            <div class="section-head" v-if="module.is_maintenance_guide">
              <div class="section-icon gray">
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h2 class="section-title">Informasi Tambahan</h2>
            </div>
            <div class="rich-content" v-html="formatContent(module.content)"></div>

            <!-- Content Images -->
            <div v-if="module.content_images?.length" class="img-grid">
              <div v-for="(img, i) in module.content_images" :key="i" class="img-thumb">
                <img :src="getImageUrl(img)" :alt="`Gambar ${i+1}`" @error="handleImageError" />
              </div>
            </div>
          </div>

          <!-- Related Footer -->
          <div class="related-row">
            <span class="related-label">Modul Lainnya</span>
            <router-link to="/education" class="view-all-link">Lihat Semua →</router-link>
          </div>

        </div>



      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEducationStore } from '../stores/education'

const route = useRoute()
const educationStore = useEducationStore()
const bookmarking = ref(false)
const loading = computed(() => educationStore.loading)
const module = computed(() => educationStore.currentModule)

const parseHashTags = (text) => {
  if (!text) return []
  const matches = String(text).match(/#[a-zA-Z0-9_-]+/g) || []
  const seen = new Set()
  return matches.filter(t => { const k = t.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true })
}

const maintenanceTags = computed(() => {
  if (!module.value?.is_maintenance_guide) return []
  if (Array.isArray(module.value.vital_tags_json) && module.value.vital_tags_json.length) {
    const n = parseHashTags(module.value.vital_tags_json.join(' '))
    if (n.length) return n
  }
  const combined = [module.value.watering_info, module.value.light_info, module.value.humidity_info, module.value.difficulty].filter(Boolean).join(' ')
  const tags = parseHashTags(combined)
  if (tags.length) return tags
  const inferred = []
  if (module.value.watering_info) inferred.push('#penyiraman')
  if (module.value.light_info) inferred.push('#cahaya')
  if (module.value.humidity_info) inferred.push('#kelembapan')
  if (module.value.difficulty) inferred.push('#kesulitan')
  return inferred
})

const loadDetail = async () => {
  try { await educationStore.fetchDetail(route.params.id) }
  catch (e) { console.error(e) }
}

const toggleBookmark = async () => {
  if (!module.value) return
  bookmarking.value = true
  try {
    if (module.value.is_bookmarked) await educationStore.unbookmark(module.value.id)
    else await educationStore.bookmark(module.value.id)
  } catch (e) {
    alert(e.response?.data?.message || 'Gagal mengubah bookmark')
  } finally { bookmarking.value = false }
}

const formatContent = (content) => content ? content.replace(/\n/g, '<br>') : ''

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    if (imagePath.includes('localhost/storage') && !imagePath.includes('localhost:8000'))
      return imagePath.replace('localhost/storage', 'localhost:8000/storage')
    return imagePath
  }
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
  let baseUrl = API_BASE_URL.replace('/api', '')
  if (baseUrl.includes('localhost') && !baseUrl.includes('localhost:')) baseUrl = baseUrl.replace('localhost', 'localhost:8000')
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
  return cleanPath.startsWith('storage/') ? `${baseUrl}/${cleanPath}` : `${baseUrl}/storage/${cleanPath}`
}

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f1f5f9" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="13" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E'
}

onMounted(() => { loadDetail() })
</script>

<style scoped>
/* ─── Base ─── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.edu-page {
  min-height: 100vh;
  background: #f8fafc;
  font-family: 'DM Sans', 'Figtree', system-ui, sans-serif;
  color: #1e293b;
}

/* ─── Top Bar ─── */
.top-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 24px;
  height: 56px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  transition: background 0.15s, color 0.15s;
  white-space: nowrap;
}
.back-btn:hover { background: #f1f5f9; color: #0f172a; }

.top-bar-title {
  font-size: 14px;
  font-weight: 600;
  color: #0f172a;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  opacity: 0.7;
}

/* ─── Page Body ─── */
.page-body {
  max-width: 1100px;
  margin: 0 auto;
  padding: 32px 24px 64px;
}

/* ─── Layout ─── */
.content-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  align-items: start;
}

@media (max-width: 768px) {
  .page-body { padding: 20px 16px 48px; }
}

/* ─── Cards ─── */
.hero-card,
.section-card,
.thumb-card,
.sidebar-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  margin-bottom: 16px;
}

.hero-card { padding: 28px 28px 24px; }
.section-card { padding: 24px 28px; }
.thumb-card { overflow: hidden; }
.sidebar-card { padding: 20px; margin-bottom: 16px; }

/* ─── Hero ─── */
.hero-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}

.badge-guide {
  font-size: 11px;
  font-weight: 700;
  color: #92400e;
  background: #fef3c7;
  border: 1px solid #fcd34d;
  border-radius: 20px;
  padding: 3px 10px;
}

.badge-tag {
  font-size: 11px;
  font-weight: 600;
  color: #065f46;
  background: #d1fae5;
  border: 1px solid #6ee7b7;
  border-radius: 20px;
  padding: 3px 10px;
}

.module-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  font-weight: 700;
  color: #0f172a;
  line-height: 1.25;
  letter-spacing: -0.02em;
}

/* ─── Bookmark Button ─── */
.bookmark-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1.5px solid #cbd5e1;
  background: #ffffff;
  color: #475569;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  flex-shrink: 0;
}
.bookmark-btn:hover:not(:disabled) {
  border-color: #22c55e;
  color: #16a34a;
  background: #f0fdf4;
}
.bookmark-btn.saved {
  border-color: #22c55e;
  background: #f0fdf4;
  color: #16a34a;
}
.bookmark-btn:disabled { opacity: 0.55; cursor: not-allowed; }

/* ─── Thumbnail ─── */
.thumb-img {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  display: block;
}

/* ─── Section Head ─── */
.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
}

.section-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.section-icon.green { background: #dcfce7; color: #16a34a; }
.section-icon.gray  { background: #f1f5f9; color: #64748b; }

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

/* ─── Steps ─── */
.steps-list { display: flex; flex-direction: column; }

.step-item {
  display: flex;
  gap: 16px;
  padding-bottom: 20px;
}
.step-item:last-child { padding-bottom: 0; }

.step-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
}

.step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #22c55e;
  color: white;
  font-size: 12px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step-line {
  width: 2px;
  flex: 1;
  min-height: 20px;
  background: #e2e8f0;
  margin-top: 6px;
}

.step-body {
  padding-top: 3px;
  padding-bottom: 8px;
}
.step-title {
  font-size: 13.5px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 4px;
}
.step-desc {
  font-size: 13px;
  color: #64748b;
  line-height: 1.6;
}

/* ─── Rich Content ─── */
.rich-content {
  font-size: 14px;
  line-height: 1.75;
  color: #334155;
}
.rich-content :deep(p)      { margin-bottom: 10px; }
.rich-content :deep(h2)     { font-size: 1.1rem; font-weight: 700; color: #0f172a; margin: 20px 0 8px; }
.rich-content :deep(h3)     { font-size: 1rem; font-weight: 600; color: #1e293b; margin: 16px 0 6px; }
.rich-content :deep(ul),
.rich-content :deep(ol)     { margin-left: 20px; margin-bottom: 10px; }
.rich-content :deep(li)     { margin-bottom: 4px; }
.rich-content :deep(strong) { color: #0f172a; }

/* ─── Content Images ─── */
.img-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 20px;
}
.img-thumb {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.img-thumb img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  display: block;
  transition: transform 0.2s;
}
.img-thumb img:hover { transform: scale(1.03); }

/* ─── Related Row ─── */
.related-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 4px;
}
.related-label { font-size: 15px; font-weight: 700; color: #0f172a; }
.view-all-link  { font-size: 13px; font-weight: 600; color: #16a34a; text-decoration: none; }
.view-all-link:hover { text-decoration: underline; }



/* ─── States ─── */
.state-center {
  text-align: center;
  padding: 80px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}
.state-icon  { font-size: 40px; }
.state-label { color: #64748b; font-size: 15px; }

.spinner {
  width: 28px; height: 28px;
  border: 3px solid #e2e8f0;
  border-top-color: #22c55e;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-bottom: 8px;
}
@keyframes spin { to { transform: rotate(360deg); } }

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  padding: 9px 18px;
  border-radius: 10px;
  background: #22c55e;
  color: white;
  text-decoration: none;
  transition: background 0.15s;
}
.btn-primary:hover { background: #16a34a; }
</style>