<template>
  <div class="bm-page">

    <!-- Header -->
    <section class="bm-hero">
      <div class="page-container">
        <div class="bm-hero-inner">
          <div>
            <router-link to="/education" class="bm-back-link">
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Kembali ke Modul Edukasi
            </router-link>
            <h1 class="bm-title">Bookmark Saya</h1>
            <p class="bm-sub">Modul edukasi yang telah Anda simpan</p>
          </div>
          <router-link to="/education" class="sp-btn sp-btn-primary bm-explore-btn-header">
            📚 Jelajahi Modul Edukasi
          </router-link>
        </div>
      </div>
    </section>

    <!-- Content -->
    <div class="page-container bm-content">

      <!-- Loading -->
      <div v-if="loading && bookmarks.length === 0" class="sp-card bm-empty">
        <div class="sp-spinner" style="margin:0 auto .75rem;width:28px;height:28px;border-width:3px;"></div>
        <p style="color:var(--text-muted);">Memuat bookmark...</p>
      </div>

      <!-- Empty -->
      <div v-else-if="bookmarks.length === 0" class="sp-card bm-empty">
        <div class="bm-empty-icon">📑</div>
        <h2 class="bm-empty-title">Belum Ada Bookmark</h2>
        <p class="bm-empty-sub">Simpan modul edukasi favorit untuk dibaca nanti</p>
      </div>

      <!-- List -->
      <div v-else class="bm-list-section">
        <p class="bm-count">
          Total <span class="bm-count-num">{{ bookmarks.length }}</span> modul tersimpan
        </p>

        <div class="bm-grid">
          <div v-for="bookmark in bookmarks" :key="bookmark.id" class="bm-card">
            <!-- Thumbnail -->
            <div class="bm-thumb" @click="goToDetail(bookmark.educational_module.id)">
              <img
                v-if="bookmark.educational_module.image"
                :src="bookmark.educational_module.image"
                :alt="bookmark.educational_module.title"
                @error="handleImageError"
                class="bm-thumb-img"
              />
              <div v-else class="bm-thumb-placeholder">
                <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                </svg>
              </div>
              <div class="bm-thumb-overlay">Baca Selengkapnya →</div>
              <span class="bm-category-badge">
                {{ bookmark.educational_module.plant?.name || 'UMUM' }}
              </span>
              <span class="bm-star-badge">★</span>
            </div>

            <!-- Body -->
            <div class="bm-card-body">
              <h3
                class="bm-card-title"
                @click="goToDetail(bookmark.educational_module.id)"
              >{{ bookmark.educational_module.title }}</h3>
              <p class="bm-card-desc">{{ truncateText(bookmark.educational_module.content, 120) }}</p>
              <div class="bm-card-meta">
                <span>📅 {{ formatDate(bookmark.created_at) }}</span>
              </div>
              <div class="bm-card-actions">
                <router-link :to="`/education/${bookmark.educational_module.id}`" class="sp-btn sp-btn-primary sp-btn-sm">
                  Baca
                </router-link>
                <button
                  type="button"
                  @click.stop="removeBookmark(bookmark.educational_module.id)"
                  :disabled="removingId === bookmark.educational_module.id"
                  class="bm-remove-btn"
                  :aria-busy="removingId === bookmark.educational_module.id"
                >
                  <span aria-hidden="true">★</span>
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
const removingId = ref(null)
const loading = computed(() => educationStore.loading)
const bookmarks = computed(() => educationStore.bookmarks)

const loadBookmarks = async () => {
  try { await educationStore.fetchBookmarks() }
  catch (error) { console.error('Error:', error) }
}
const goToDetail = (id) => { router.push(`/education/${id}`) }

const removeBookmark = async (id) => {
  if (!confirm('Hapus modul ini dari bookmark?')) return
  removingId.value = id
  try {
    await educationStore.unbookmark(id)
    await loadBookmarks()
  } catch (error) {
    alert(error.response?.data?.message || 'Gagal menghapus bookmark')
  } finally {
    removingId.value = null
  }
}

const truncateText = (text, length) =>
  text ? (text.length <= length ? text : text.substring(0, length) + '...') : ''

const formatDate = (dateString) =>
  new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })

const handleImageError = (event) => { event.target.style.display = 'none' }

onMounted(() => { loadBookmarks() })
</script>

<style scoped>
a { text-decoration: none; }

/* ── Page ── */
.bm-page {
  min-height: 100vh;
  background: var(--bg-subtle);
}

/* ── Hero ── */
.bm-hero {
  background: #fff;
  border-bottom: 1px solid var(--border);
  padding: 1.5rem 0;
}
.bm-hero-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.bm-explore-btn-header {
  margin-bottom: 2px;
}
.bm-back-link {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  font-size: .8125rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: .625rem;
  transition: color .15s;
}
.bm-back-link:hover { color: var(--primary); }
.bm-title {
  font-size: 1.625rem;
  font-weight: 800;
  color: var(--gray-900);
  margin: 0 0 .25rem;
}
.bm-sub {
  font-size: .9375rem;
  color: var(--text-muted);
  margin: 0;
}

/* ── Content ── */
.bm-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 1.75rem;
  padding-bottom: 4rem;
}

/* ── Empty / Loading ── */
.bm-empty {
  padding: 3rem;
  text-align: center;
}
.bm-empty-icon { font-size: 3rem; margin-bottom: .75rem; opacity: .5; }
.bm-empty-title { font-size: 1.125rem; font-weight: 700; color: var(--gray-900); margin: 0 0 .375rem; }
.bm-empty-sub   { font-size: .875rem; color: var(--text-muted); margin: 0 0 1.25rem; }

/* ── Count ── */
.bm-count {
  font-size: .875rem;
  color: var(--text-muted);
  margin: 0;
}
.bm-count-num {
  color: var(--primary);
  font-weight: 700;
}

/* ── Grid ── */
.bm-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.125rem;
}

/* ── Card ── */
.bm-card {
  background: #fff;
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: border-color .15s, box-shadow .15s;
}
.bm-card:hover {
  border-color: var(--primary-300);
  box-shadow: var(--shadow-md);
}

/* Thumbnail */
.bm-thumb {
  position: relative;
  height: 160px;
  overflow: hidden;
  background: var(--gray-100);
  cursor: pointer;
}
.bm-thumb-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform .3s;
}
.bm-card:hover .bm-thumb-img { transform: scale(1.04); }
.bm-thumb-placeholder {
  width: 100%; height: 100%;
  display: flex; align-items: center; justify-content: center;
  color: var(--gray-300);
}
.bm-thumb-overlay {
  position: absolute; inset: 0;
  background: rgba(0,0,0,.38);
  display: flex; align-items: center; justify-content: center;
  color: #fff; font-size: .875rem; font-weight: 600;
  opacity: 0; transition: opacity .2s;
}
.bm-card:hover .bm-thumb-overlay { opacity: 1; }

.bm-category-badge {
  position: absolute; top: .5rem; left: .5rem;
  background: rgba(255,255,255,.92);
  color: var(--primary-700);
  font-size: .6875rem; font-weight: 700;
  padding: .2rem .6rem; border-radius: 9999px;
  border: 1px solid var(--primary-200);
}
.bm-star-badge {
  position: absolute; top: .5rem; right: .5rem;
  width: 26px; height: 26px; border-radius: 9999px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(251,191,36,.2);
  color: #f59e0b;
  font-size: .8125rem;
}

/* Body */
.bm-card-body {
  padding: 1rem;
  display: flex; flex-direction: column; gap: .5rem;
}
.bm-card-title {
  font-size: .9375rem; font-weight: 700; color: var(--gray-900);
  margin: 0; cursor: pointer; transition: color .15s;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.bm-card-title:hover { color: var(--primary); }
.bm-card-desc {
  font-size: .8125rem; color: var(--text-muted); margin: 0; line-height: 1.6;
  display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.bm-card-meta {
  font-size: .75rem; color: var(--gray-400);
  display: flex; gap: .75rem;
}
.bm-card-actions {
  display: flex; align-items: center; justify-content: space-between; gap: .5rem;
  padding-top: .625rem; border-top: 1px solid var(--border);
}

/* Remove button */
.bm-remove-btn {
  display: inline-flex;
  align-items: center;
  gap: .35rem;
  font-size: .8125rem;
  font-weight: 600;
  padding: .375rem .875rem;
  border-radius: 9999px;
  border: 1px solid #16a34a;
  background: rgba(220,252,231,.85);
  color: #166534;
  cursor: pointer;
  transition: background .15s, border-color .15s, opacity .15s;
}
.bm-remove-btn:hover:not(:disabled) {
  background: rgba(187,247,208,.95);
  border-color: #15803d;
  color: #14532d;
}
.bm-remove-btn:disabled {
  opacity: .65;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 640px) {
  .bm-grid {
    grid-template-columns: 1fr;
  }
  .bm-hero-inner {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .bm-explore-btn-header {
    width: 100%;
    justify-content: center;
  }
}
</style>
