<template>
  <div class="min-h-screen">
    <!-- Header -->
    <section aria-label="Bookmark modul edukasi" class="pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14 relative overflow-hidden">
      <div class="absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute top-10 right-20 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl animate-float"></div>
      </div>
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <router-link to="/education" class="glass-btn glass-btn-secondary !text-xs mb-4 inline-flex">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali ke Modul Edukasi
        </router-link>
        <h1 class="text-3xl sm:text-4xl font-bold text-white">Bookmark Saya</h1>
        <p class="text-sm text-slate-400 mt-1">Modul edukasi yang telah Anda simpan</p>
      </div>
    </section>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
      <!-- Loading -->
      <div v-if="loading && bookmarks.length === 0" class="glass-card-strong p-12 text-center">
        <div class="loading-spinner mx-auto mb-4" style="width:32px;height:32px;border-width:4px;"></div>
        <p class="text-slate-400">Memuat bookmark...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="bookmarks.length === 0" class="glass-card-strong p-12 text-center">
        <div class="text-5xl mb-4 opacity-50">📑</div>
        <h2 class="text-xl font-bold text-white mb-2">Belum Ada Bookmark</h2>
        <p class="text-sm text-slate-400 mb-5">Simpan modul edukasi favorit untuk dibaca nanti</p>
        <router-link to="/education" class="glass-btn glass-btn-primary !text-sm">📚 Jelajahi Modul Edukasi</router-link>
      </div>

      <!-- Content -->
      <div v-else class="space-y-6">
        <p class="text-sm text-slate-400">Total <span class="text-emerald-400 font-semibold">{{ bookmarks.length }}</span> modul tersimpan</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div v-for="bookmark in bookmarks" :key="bookmark.id"
            class="glass-card overflow-hidden group transition-all duration-300 hover:border-emerald-500/30">
            <!-- Thumbnail -->
            <div class="relative w-full h-44 overflow-hidden cursor-pointer" style="background: rgba(255,255,255,0.03);" @click="goToDetail(bookmark.educational_module.id)">
              <img v-if="bookmark.educational_module.image" :src="bookmark.educational_module.image" :alt="bookmark.educational_module.title" @error="handleImageError"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-600">
                <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span class="text-white text-sm font-medium">Baca Selengkapnya</span>
              </div>
              <span v-if="bookmark.educational_module.category" class="absolute top-2 left-2 glass-badge !text-xs">{{ bookmark.educational_module.category }}</span>
              <span class="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs" style="background: rgba(251,191,36,0.2); color: #fbbf24;">★</span>
            </div>
            <!-- Content -->
            <div class="p-4 space-y-3">
              <h3 class="text-sm font-bold text-white cursor-pointer hover:text-emerald-300 transition-colors line-clamp-2" @click="goToDetail(bookmark.educational_module.id)">{{ bookmark.educational_module.title }}</h3>
              <p class="text-xs text-slate-400 line-clamp-2">{{ bookmark.educational_module.description || truncateText(bookmark.educational_module.content, 120) }}</p>
              <div class="flex items-center gap-3 text-xs text-slate-500">
                <span>📅 {{ formatDate(bookmark.created_at) }}</span>
                <span>⏱ {{ estimateReadingTime(bookmark.educational_module.content) }} min</span>
              </div>
              <div class="flex items-center gap-2 pt-2 border-t border-white/5">
                <router-link :to="`/education/${bookmark.educational_module.id}`" class="glass-btn glass-btn-primary !text-xs !py-1.5 !px-3">Baca</router-link>
                <button @click.stop="downloadModule(bookmark.educational_module)" class="glass-btn glass-btn-secondary !text-xs !py-1.5 !px-3">Download</button>
                <button @click.stop="removeBookmark(bookmark.educational_module.id)" :disabled="removing"
                  class="glass-btn !text-xs !py-1.5 !px-3 ml-auto" style="background:rgba(239,68,68,0.15); color:#fca5a5; border:1px solid rgba(239,68,68,0.3);">
                  Hapus
                </button>
              </div>
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

const loadBookmarks = async () => { try { await educationStore.fetchBookmarks() } catch (error) { console.error('Error:', error) } }
const goToDetail = (id) => { router.push(`/education/${id}`) }

const removeBookmark = async (id) => {
  if (!confirm('Hapus modul ini dari bookmark?')) return
  removing.value = true
  try { await educationStore.unbookmark(id); await loadBookmarks() }
  catch (error) { alert('Gagal menghapus bookmark') }
  finally { removing.value = false }
}

const downloadModule = (module) => {
  try {
    const content = `MODUL EDUKASI: ${module.title}\n${module.category ? `Kategori: ${module.category}` : ''}\n${module.description ? `\nDeskripsi:\n${module.description}` : ''}\n\n${module.content || ''}\n\n---\nSumber: System Pakar - Tanaman Hias Expert\nDiunduh pada: ${new Date().toLocaleString('id-ID')}`.trim()
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a'); link.href = url; link.download = `${module.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url)
  } catch (error) { alert('Gagal mengunduh modul') }
}

const truncateText = (text, length) => text ? (text.length <= length ? text : text.substring(0, length) + '...') : ''
const estimateReadingTime = (content) => content ? (Math.ceil(content.length / 5 / 200) || 1) : 0
const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })
const handleImageError = (event) => { event.target.style.display = 'none' }

onMounted(() => { loadBookmarks() })
</script>

<style scoped>
a { text-decoration: none !important; }
</style>
