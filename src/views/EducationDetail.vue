<template>
  <div class="min-h-screen">
    <!-- Header -->
    <section aria-label="Detail modul edukasi" class="pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14 relative overflow-hidden">
      <div class="absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute top-10 left-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
      </div>
      <div class="max-w-3xl mx-auto px-4">
        <router-link to="/education" class="glass-btn glass-btn-secondary !text-xs mb-4 inline-flex">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali
        </router-link>
      </div>
    </section>

    <div class="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
      <!-- Loading -->
      <div v-if="loading" class="glass-card-strong p-12 text-center">
        <div class="loading-spinner mx-auto mb-4" style="width:32px;height:32px;border-width:4px;"></div>
        <p class="text-slate-400">Memuat modul edukasi...</p>
      </div>

      <div v-else-if="module" class="space-y-6">
        <!-- Title Card -->
        <div class="glass-card-strong p-6 sm:p-8">
          <div class="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 class="text-2xl sm:text-3xl font-bold text-white mb-3">{{ module.title }}</h1>
              <div class="flex items-center gap-3 flex-wrap">
                <span v-if="module.is_maintenance_guide" class="guide-badge">✦ Panduan</span>
              </div>
              <div v-if="maintenanceTags.length" class="vital-tags-row">
                <span
                  v-for="tag in maintenanceTags"
                  :key="tag"
                  class="vital-tag-box"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
            <button @click="toggleBookmark" :disabled="bookmarking"
              class="bookmark-star-btn !text-xs shrink-0"
              :class="{ 'bookmark-star-btn--saved': module.is_bookmarked }">
              {{ module.is_bookmarked ? '★ Tersimpan' : '☆ Simpan' }}
            </button>
          </div>
        </div>

        <!-- Thumbnail -->
        <div v-if="module.image" class="glass-card overflow-hidden">
          <img :src="getImageUrl(module.image)" :alt="module.title" @error="handleImageError" class="w-full max-h-96 object-cover" />
        </div>

        <!-- Maintenance Steps (Structured Optimization) -->
        <div v-if="module.is_maintenance_guide && module.maintenance_steps_json" class="glass-card-strong p-6 sm:p-8 animate-fade-in">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
            </div>
            <h2 class="text-xl font-bold text-white">Langkah Pemeliharaan Optimal</h2>
          </div>
          
          <div class="space-y-6">
            <div v-for="step in module.maintenance_steps_json" :key="step.step" class="relative pl-10">
              <!-- Step Indicator -->
              <div class="absolute left-0 top-0 w-7 h-7 rounded-full bg-emerald-500 border-4 border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-900 z-10">
                {{ step.step }}
              </div>
              <!-- Connector Line -->
              <div v-if="step.step < module.maintenance_steps_json.length" class="absolute left-[13px] top-7 w-[2px] h-full bg-slate-800"></div>
              
              <div class="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                <h4 class="font-bold text-emerald-400 mb-1 text-sm">{{ step.title }}</h4>
                <p class="text-slate-400 text-xs leading-relaxed">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="glass-card-strong p-6 sm:p-8">
          <div class="flex items-center gap-3 mb-6" v-if="module.is_maintenance_guide">
            <div class="w-8 h-8 rounded-lg bg-slate-500/10 flex items-center justify-center">
              <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h2 class="text-xl font-bold text-white">Detail & Informasi Tambahan</h2>
          </div>
          
          <div class="text-black leading-relaxed text-sm content-area" v-html="formatContent(module.content)"></div>

          <!-- Content Images -->
          <div v-if="module.content_images && module.content_images.length > 0" class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="(imagePath, index) in module.content_images" :key="index"
              class="glass-card overflow-hidden">
              <img :src="getImageUrl(imagePath)" :alt="`Gambar ${index + 1}`" @error="handleImageError" @load="handleImageLoad"
                class="w-full h-auto min-h-48 object-contain hover:scale-105 transition-transform duration-300 cursor-pointer" />
            </div>
          </div>
        </div>

        <!-- Related -->
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-bold text-white">Modul Lainnya</h2>
          <router-link to="/education" class="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">Lihat Semua →</router-link>
        </div>
      </div>

      <!-- Error -->
      <div v-else class="glass-card-strong p-12 text-center">
        <div class="text-4xl mb-3 opacity-50">❌</div>
        <p class="text-slate-400 mb-4">Modul tidak ditemukan</p>
        <router-link to="/education" class="glass-btn glass-btn-primary !text-sm">Kembali ke Daftar Modul</router-link>
      </div>
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

const parseHashTags = (text) => {
  if (!text) return []
  const matches = String(text).match(/#[a-zA-Z0-9_-]+/g) || []
  const unique = []
  const seen = new Set()
  for (const tag of matches) {
    const key = tag.toLowerCase()
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(tag)
    }
  }
  return unique
}

const maintenanceTags = computed(() => {
  if (!module.value?.is_maintenance_guide) return []

  if (Array.isArray(module.value.vital_tags_json) && module.value.vital_tags_json.length) {
    const normalized = parseHashTags(module.value.vital_tags_json.join(' '))
    if (normalized.length) return normalized
  }

  const combined = [
    module.value.watering_info,
    module.value.light_info,
    module.value.humidity_info,
    module.value.difficulty
  ]
    .filter(Boolean)
    .join(' ')

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
  try {
    await educationStore.fetchDetail(route.params.id)
  } catch (error) { console.error('Error loading module detail:', error) }
}

const toggleBookmark = async () => {
  if (!module.value) return
  bookmarking.value = true
  try {
    if (module.value.is_bookmarked) await educationStore.unbookmark(module.value.id)
    else await educationStore.bookmark(module.value.id)
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal mengubah bookmark')
  }
  finally { bookmarking.value = false }
}

const formatContent = (content) => content ? content.replace(/\n/g, '<br>') : ''

const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    if (imagePath.includes('localhost/storage') && !imagePath.includes('localhost:8000')) return imagePath.replace('localhost/storage', 'localhost:8000/storage')
    return imagePath
  }
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
  let baseUrl = API_BASE_URL.replace('/api', '')
  if (baseUrl.includes('localhost') && !baseUrl.includes('localhost:')) baseUrl = baseUrl.replace('localhost', 'localhost:8000')
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath
  return cleanPath.startsWith('storage/') ? `${baseUrl}/${cleanPath}` : `${baseUrl}/storage/${cleanPath}`
}

const handleImageError = (event) => { event.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%231a1a2e" width="400" height="300"/%3E%3Ctext fill="%236b7280" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGambar tidak tersedia%3C/text%3E%3C/svg%3E' }
const handleImageLoad = () => {}

onMounted(() => { loadDetail() })
</script>

<style scoped>
a { text-decoration: none !important; }
.content-area :deep(p) { margin-bottom: 0.75rem; color: #000; }
.content-area :deep(h2) { color: #111827; margin-top: 1.5rem; margin-bottom: 0.75rem; font-size: 1.25rem; font-weight: 700; }
.content-area :deep(h3) { color: #111827; margin-top: 1rem; margin-bottom: 0.5rem; font-size: 1.1rem; font-weight: 600; }
.content-area :deep(ul), .content-area :deep(ol) { margin-left: 1.5rem; margin-bottom: 0.75rem; }
.content-area :deep(li) { margin-bottom: 0.375rem; color: #000; }
.content-area :deep(strong) { color: #000; }

.bookmark-star-btn {
  font-size: .8125rem;
  padding: .45rem .9rem;
  border-radius: 9999px;
  border: 1px solid rgba(148, 163, 184, .45);
  background: rgba(255,255,255,.6);
  color: #475569;
  cursor: pointer;
  transition: all .15s ease;
}
.bookmark-star-btn:hover:not(:disabled) {
  border-color: #60a5fa;
  color: #1d4ed8;
  background: rgba(239, 246, 255, .85);
}
.bookmark-star-btn:disabled {
  opacity: .6;
  cursor: not-allowed;
}
.bookmark-star-btn--saved {
  border-color: #16a34a;
  color: #166534;
  background: rgba(220, 252, 231, .85);
}

.guide-badge {
  display: inline-flex;
  align-items: center;
  gap: .25rem;
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .01em;
  color: #b45309;
  background: linear-gradient(135deg, #ffedd5, #fef3c7);
  border: 1px solid #fdba74;
  border-radius: 9999px;
  padding: .2rem .55rem;
}

.vital-tags-row {
  margin-top: .9rem;
  display: flex;
  flex-wrap: wrap;
  gap: .55rem;
}

.vital-tag-box {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  min-width: 52px;
  font-size: .86rem;
  font-weight: 700;
  color: #065f46;
  background: rgba(209, 250, 229, .85);
  border: 1px solid rgba(16, 185, 129, .35);
  border-radius: .7rem;
  padding: .4rem .75rem;
}
</style>
