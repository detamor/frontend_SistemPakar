<template>
  <div class="rw-root">

    <!-- ── Background ── -->
    <div class="rw-bg">
      <div class="rw-bg__orb rw-bg__orb--a"></div>
      <div class="rw-bg__orb rw-bg__orb--b"></div>
      <div class="rw-bg__grid"></div>
    </div>

    <!-- ── Header ── -->
    <header class="rw-header">
      <div class="rw-wrap">
        <div class="rw-header__inner">
          <div>
            <div class="rw-eyebrow">
              <span class="rw-eyebrow__pip"></span>
              <span>Sistem Pakar Tanaman</span>
            </div>
            <h1 class="rw-header__title">Riwayat Diagnosis</h1>
            <p class="rw-header__sub">Pantau dan kelola semua hasil diagnosis tanaman Anda</p>
          </div>
          <RouterLink to="/diagnosis" class="rw-btn-cta">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
            Diagnosis Baru
          </RouterLink>
        </div>
      </div>
    </header>

    <!-- ── Toast ── -->
    <Transition name="toast-slide">
      <div v-if="toastMsg" class="rw-toast" :class="toastType === 'success' ? 'rw-toast--ok' : 'rw-toast--err'">
        <div class="rw-toast__icon-wrap">
          <svg v-if="toastType === 'success'" width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M2.5 7l3 3 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <svg v-else width="14" height="14" fill="none" viewBox="0 0 14 14"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
        </div>
        <span>{{ toastMsg }}</span>
      </div>
    </Transition>

    <!-- ── Main ── -->
    <main class="rw-wrap rw-main">

      <!-- Loading -->
      <div v-if="loading && diagnosisHistory.length === 0" class="rw-state">
        <div class="rw-loader">
          <div class="rw-loader__leaf">🌿</div>
          <div class="rw-loader__bar"><div class="rw-loader__fill"></div></div>
        </div>
        <p class="rw-state__label">Memuat riwayat diagnosis…</p>
      </div>

      <!-- Empty -->
      <div v-else-if="diagnosisHistory.length === 0" class="rw-empty">
        <div class="rw-empty__art">
          <div class="rw-empty__circle">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <path d="M24 8C24 8 14 17 14 26C14 31.523 18.477 36 24 36C29.523 36 34 31.523 34 26C34 17 24 8 24 8Z" fill="#c8e6c0" stroke="#6aa84f" stroke-width="1.5"/>
              <path d="M24 13C24 13 19 19 19 25" stroke="#4a7c3a" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>
          <div class="rw-empty__rings">
            <div class="rw-empty__ring rw-empty__ring--1"></div>
            <div class="rw-empty__ring rw-empty__ring--2"></div>
          </div>
        </div>
        <h2 class="rw-empty__title">Belum ada riwayat</h2>
        <p class="rw-empty__text">Mulai diagnosis pertama Anda untuk memantau kesehatan tanaman secara berkala.</p>
        <RouterLink to="/diagnosis" class="rw-btn-cta">Mulai Diagnosis Sekarang</RouterLink>
      </div>

      <!-- ── History List ── -->
      <div v-else class="rw-list">

        <!-- Stats Bar -->
        <div class="rw-stats">
          <div class="rw-stat">
            <span class="rw-stat__num">{{ diagnosisHistory.length }}</span>
            <span class="rw-stat__label">Total Diagnosis</span>
          </div>
          <div class="rw-stat__sep"></div>
          <div class="rw-stat">
            <span class="rw-stat__num rw-stat__num--green">{{ diagnosisHistory.filter(d => d.status === 'completed').length }}</span>
            <span class="rw-stat__label">Selesai</span>
          </div>
          <div class="rw-stat__sep"></div>
          <div class="rw-stat">
            <span class="rw-stat__num rw-stat__num--amber">{{ diagnosisHistory.filter(d => d.status === 'pending').length }}</span>
            <span class="rw-stat__label">Menunggu</span>
          </div>
        </div>

        <!-- Cards -->
        <article
          v-for="(diagnosis, i) in diagnosisHistory"
          :key="diagnosis.id"
          class="rw-card"
          :style="`--delay:${i * 55}ms`"
        >
          <!-- Accent bar (left) -->
          <div class="rw-card__accent" :class="`rw-accent--${diagnosis.status}`"></div>

          <!-- Card body -->
          <div class="rw-card__body">

            <!-- ── Row 1: Header ── -->
            <div class="rw-card__header">
              <div class="rw-card__plant-row">
                <div class="rw-plant-badge">
                  <span>🌿</span>
                </div>
                <div class="rw-card__meta">
                  <h3 class="rw-card__name">{{ diagnosis.plant?.name || 'Tanaman' }}</h3>
                  <time class="rw-card__time">{{ formatDate(diagnosis.created_at) }}</time>
                </div>
              </div>
              <span class="rw-status-pill" :class="`rw-status--${diagnosis.status}`">
                <span class="rw-status__dot"></span>
                {{ getStatusText(diagnosis.status) }}
              </span>
            </div>

            <!-- ── Row 2: Disease Result ── -->
            <div v-if="diagnosis.disease" class="rw-result-box">
              <div class="rw-result-box__top">
                <div class="rw-result-box__left">
                  <p class="rw-result-box__eyebrow">Penyakit Terdeteksi</p>
                  <p class="rw-result-box__name">{{ diagnosis.disease.name }}</p>
                </div>
                <div class="rw-certainty-ring">
                  <svg width="52" height="52" viewBox="0 0 52 52">
                    <circle cx="26" cy="26" r="20" fill="none" stroke="var(--sage-100)" stroke-width="4"/>
                    <circle
                      cx="26" cy="26" r="20" fill="none" stroke="var(--sage-500)" stroke-width="4"
                      stroke-linecap="round"
                      :stroke-dasharray="`${(diagnosis.certainty_value * 125.66).toFixed(1)} 125.66`"
                      stroke-dashoffset="31.4"
                      style="transform:rotate(-90deg);transform-origin:center;transition:stroke-dasharray .8s"
                    />
                    <text x="26" y="31" text-anchor="middle" font-size="10" font-weight="600" fill="var(--sage-700)" font-family="inherit">
                      {{ (diagnosis.certainty_value * 100).toFixed(0) }}%
                    </text>
                  </svg>
                </div>
              </div>
              <div v-if="diagnosis.matched_symptoms_count" class="rw-result-box__tags">
                <span class="rw-tag rw-tag--green">
                  <svg width="10" height="10" fill="none" viewBox="0 0 10 10"><path d="M2 5l2 2 4-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                  {{ diagnosis.matched_symptoms_count }} gejala cocok
                </span>
              </div>
              <p v-if="diagnosis.recommendation" class="rw-result-box__rec">{{ getRecommendationPreview(diagnosis.recommendation) }}</p>
            </div>

            <!-- No result -->
            <div v-else class="rw-no-result">
              <span v-if="diagnosis.status === 'pending'" class="rw-pulse-dot"></span>
              <span>{{ diagnosis.status === 'pending' ? 'Sedang diproses…' : 'Belum ada hasil diagnosis' }}</span>
            </div>

            <!-- ── Row 3: Notes ── -->
            <div class="rw-panel rw-panel--notes">
              <div class="rw-panel__head">
                <div class="rw-panel__label">
                  <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M2 1.5A.5.5 0 012.5 1h7a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H4.5L2 12V1.5z" stroke="currentColor" stroke-width="1"/></svg>
                  Catatan Evaluasi
                </div>
                <button
                  @click="openNotesModal(diagnosis)"
                  class="rw-ghost-btn"
                  :disabled="savingNotes === diagnosis.id || deletingNotes === diagnosis.id"
                >{{ diagnosis.user_notes ? 'Ubah' : '+ Tambah' }}</button>
              </div>
              <p v-if="diagnosis.user_notes" class="rw-panel__text">{{ diagnosis.user_notes }}</p>
              <p v-else class="rw-panel__empty">Belum ada catatan tambahan.</p>
            </div>

            <!-- ── Row 4: Feedback ── -->
            <div v-if="diagnosis.disease" class="rw-panel rw-panel--feedback">
              <!-- Not yet given -->
              <template v-if="!diagnosisFeedbacks[diagnosis.id]">
                <div class="rw-panel__head">
                  <div class="rw-panel__label">
                    <svg width="12" height="12" fill="none" viewBox="0 0 12 12"><path d="M6 1l1.3 2.7 3 .4-2.2 2.1.5 3L6 7.8l-2.6 1.4.5-3L1.7 4.1l3-.4L6 1z" stroke="currentColor" stroke-width="1"/></svg>
                    Seberapa akurat hasilnya?
                  </div>
                </div>
                <div class="rw-fb-row">
                  <button v-for="r in feedbackRatings" :key="r.value"
                    @click="submitFeedback(diagnosis.id, r.value)"
                    :disabled="submittingFeedback === diagnosis.id"
                    class="rw-fb-chip" :class="`rw-fb-chip--${r.cssKey}`">
                    {{ r.icon }} {{ r.label }}
                  </button>
                </div>
              </template>

              <!-- Given -->
              <template v-else>
                <div class="rw-fb-given">
                  <div class="rw-fb-given__left">
                    <span class="rw-panel__label">Penilaian Anda</span>
                    <span class="rw-fb-badge" :class="`rw-fb-badge--${diagnosisFeedbacks[diagnosis.id].accuracy}`">
                      {{ getFeedbackIcon(diagnosisFeedbacks[diagnosis.id].accuracy) }}
                      {{ getFeedbackText(diagnosisFeedbacks[diagnosis.id].accuracy) }}
                    </span>
                  </div>
                  <button @click="openFeedbackModal(diagnosis)" class="rw-ghost-btn">Ubah</button>
                </div>
              </template>
            </div>

            <!-- ── Row 5: Actions ── -->
            <div class="rw-card__actions">
              <RouterLink :to="`/diagnosis/${diagnosis.id}`" class="rw-action-primary">
                Lihat Detail
                <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M2.5 6.5h8M6.5 2.5l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </RouterLink>
              <button @click="downloadPdf(diagnosis.id)" :disabled="loading" class="rw-action-ghost">
                <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M6.5 1.5v7M3.5 5.5l3 3 3-3M2 10.5h9" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
                Unduh PDF
              </button>
              <button @click="openConsultationModal(diagnosis)" :disabled="loading" class="rw-action-ghost">
                <svg width="13" height="13" fill="none" viewBox="0 0 13 13"><path d="M11 6.5A4.5 4.5 0 016.5 11H2l1.5-2A4.5 4.5 0 016.5 2a4.5 4.5 0 014.5 4.5z" stroke="currentColor" stroke-width="1.2"/></svg>
                Konsultasi WA
              </button>
            </div>

          </div><!-- /card body -->
        </article>

        <!-- Pagination -->
        <div class="rw-pagination">
          <button @click="loadPage(currentPage - 1)" :disabled="currentPage === 1 || loading" class="rw-page-btn">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M10 12L6 8l4-4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <div class="rw-page-info">
            <span class="rw-page-info__num">{{ currentPage }}</span>
            <span class="rw-page-info__label">dari halaman</span>
          </div>
          <button @click="loadPage(currentPage + 1)" :disabled="!hasNextPage || loading" class="rw-page-btn">
            <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M6 4l4 4-4 4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

      </div>
    </main>

    <!-- ── Consultation Modal ── -->
    <ConsultationWhatsAppModal :show="showConsultationModal" :diagnosis="selectedDiagnosis" @close="closeConsultationModal" @success="handleConsultationSuccess"/>

    <!-- ── Feedback Modal ── -->
    <Transition name="rw-modal">
      <div v-if="showFeedbackModal" class="rw-overlay" @click.self="closeFeedbackModal">
        <div class="rw-modal">
          <div class="rw-modal__head">
            <h3 class="rw-modal__title">Ubah Penilaian</h3>
            <button @click="closeFeedbackModal" class="rw-modal__close">
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="rw-modal__body">
            <div class="rw-field">
              <label class="rw-field__label">Rating Akurasi</label>
              <div class="rw-fb-row rw-fb-row--lg">
                <label v-for="r in feedbackRatings" :key="r.value"
                  class="rw-fb-chip rw-fb-chip--modal" :class="[`rw-fb-chip--${r.cssKey}`, { 'is-sel': feedbackForm.accuracy === r.value }]">
                  <input type="radio" :value="r.value" v-model="feedbackForm.accuracy" class="sr-only"/>
                  {{ r.icon }} {{ r.label }}
                </label>
              </div>
            </div>
            <div class="rw-field">
              <label class="rw-field__label">Komentar <span class="rw-field__opt">(opsional)</span></label>
              <textarea v-model="feedbackForm.comment" placeholder="Bagikan pendapat Anda…" rows="3" class="rw-textarea"></textarea>
            </div>
            <div v-if="feedbackError" class="rw-alert-err">{{ feedbackError }}</div>
          </div>
          <div class="rw-modal__foot">
            <button @click="closeFeedbackModal" class="rw-action-ghost">Batal</button>
            <button @click="submitFeedbackForm" :disabled="!!submittingFeedback" class="rw-action-primary">
              {{ submittingFeedback ? 'Menyimpan…' : 'Simpan Penilaian' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ── Notes Modal ── -->
    <Transition name="rw-modal">
      <div v-if="showNotesModal" class="rw-overlay" @click.self="closeNotesModal">
        <div class="rw-modal">
          <div class="rw-modal__head">
            <h3 class="rw-modal__title">Catatan Evaluasi Admin</h3>
            <button @click="closeNotesModal" class="rw-modal__close">
              <svg width="16" height="16" fill="none" viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>
            </button>
          </div>
          <div class="rw-modal__body">
            <p class="rw-modal__hint">Isi catatan jika ada gejala yang belum tersedia di daftar, agar admin dapat mengevaluasi dan menambahkan gejala baru.</p>
            <textarea v-model="notesForm.user_notes" placeholder="Contoh: Daun tampak bercak putih halus di bagian bawah…" rows="4" class="rw-textarea"></textarea>
            <div v-if="notesError" class="rw-alert-err">{{ notesError }}</div>
          </div>
          <div class="rw-modal__foot">
            <button v-if="notesForm.hasExisting" @click="deleteNotes"
              :disabled="deletingNotes === notesForm.diagnosisId || savingNotes === notesForm.diagnosisId"
              class="rw-action-danger">
              {{ deletingNotes === notesForm.diagnosisId ? 'Menghapus…' : 'Hapus' }}
            </button>
            <div style="display:flex;gap:.5rem;margin-left:auto;">
              <button @click="closeNotesModal" class="rw-action-ghost">Batal</button>
              <button @click="saveNotes"
                :disabled="savingNotes === notesForm.diagnosisId || deletingNotes === notesForm.diagnosisId"
                class="rw-action-primary">
                {{ savingNotes === notesForm.diagnosisId ? 'Menyimpan…' : 'Simpan' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useDiagnosisStore } from '../stores/diagnosis'
import ConsultationWhatsAppModal from '../components/ConsultationWhatsAppModal.vue'

const diagnosisStore = useDiagnosisStore()
const loading = ref(false)
const currentPage = ref(1)
const hasNextPage = ref(false)
const showConsultationModal = ref(false)
const selectedDiagnosis = ref(null)
const diagnosisFeedbacks = ref({})
const submittingFeedback = ref(null)
const showFeedbackModal = ref(false)
const feedbackForm = ref({ diagnosisId: null, accuracy: null, comment: '' })
const feedbackError = ref(null)
const showNotesModal = ref(false)
const notesForm = ref({ diagnosisId: null, user_notes: '', hasExisting: false })
const notesError = ref(null)
const savingNotes = ref(null)
const deletingNotes = ref(null)
const toastMsg = ref(null)
const toastType = ref('success')

const feedbackRatings = [
  { value: 'accurate',          label: 'Akurat',        icon: '😊', cssKey: 'good'   },
  { value: 'somewhat_accurate', label: 'Cukup Akurat',  icon: '😐', cssKey: 'fair'   },
  { value: 'inaccurate',        label: 'Tidak Akurat',  icon: '😞', cssKey: 'poor'   },
]

const diagnosisHistory = computed(() =>
  diagnosisStore.diagnosisHistory?.data ?? []
)

const loadHistory = async (page = 1) => {
  loading.value = true
  try {
    const res = await diagnosisStore.fetchHistory(page)
    if (res.data?.data) {
      currentPage.value = res.data.current_page ?? 1
      hasNextPage.value = !!res.data.next_page_url
      res.data.data.forEach(d => { if (d.feedback) diagnosisFeedbacks.value[d.id] = d.feedback })
    }
  } catch (e) { console.error(e) }
  finally { loading.value = false }
}

const loadPage = p => { if (p >= 1) loadHistory(p) }
const downloadPdf = async id => { try { await diagnosisStore.downloadPdf(id) } catch { alert('Gagal mengunduh PDF.') } }
const openConsultationModal = d => { selectedDiagnosis.value = d; showConsultationModal.value = true }
const closeConsultationModal = () => { showConsultationModal.value = false; selectedDiagnosis.value = null }
const handleConsultationSuccess = () => loadHistory(currentPage.value)
const formatDate = s => new Date(s).toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })
const getStatusText = s => ({ pending:'Menunggu', completed:'Selesai', consulted:'Dikonsultasikan' }[s] ?? s)
const getRecommendationPreview = r => { if (!r) return ''; const t = r.replace(/\*\*/g,'').replace(/\n/g,' '); return t.length > 140 ? t.slice(0,140)+'…' : t }
const getFeedbackIcon = a => ({ accurate:'😊', somewhat_accurate:'😐', inaccurate:'😞' }[a] ?? '😊')
const getFeedbackText = a => ({ accurate:'Akurat', somewhat_accurate:'Cukup Akurat', inaccurate:'Tidak Akurat' }[a] ?? a)
const showToast = (msg, type = 'success') => { toastMsg.value = msg; toastType.value = type; setTimeout(() => toastMsg.value = null, 3200) }

const submitFeedback = async (diagnosisId, accuracy) => {
  submittingFeedback.value = diagnosisId
  try { await diagnosisStore.submitFeedback(diagnosisId, accuracy, null); diagnosisFeedbacks.value[diagnosisId] = { accuracy, comment: null }; showToast('Terima kasih atas penilaian Anda!') }
  catch { showToast('Gagal mengirim penilaian.', 'error') }
  finally { submittingFeedback.value = null }
}
const openFeedbackModal = d => { const ex = diagnosisFeedbacks.value[d.id]; feedbackForm.value = { diagnosisId: d.id, accuracy: ex?.accuracy ?? null, comment: ex?.comment ?? '' }; feedbackError.value = null; showFeedbackModal.value = true }
const closeFeedbackModal = () => { showFeedbackModal.value = false; feedbackForm.value = { diagnosisId: null, accuracy: null, comment: '' }; feedbackError.value = null }
const submitFeedbackForm = async () => {
  if (!feedbackForm.value.accuracy) { feedbackError.value = 'Pilih rating terlebih dahulu'; return }
  submittingFeedback.value = feedbackForm.value.diagnosisId
  try { await diagnosisStore.submitFeedback(feedbackForm.value.diagnosisId, feedbackForm.value.accuracy, feedbackForm.value.comment || null); diagnosisFeedbacks.value[feedbackForm.value.diagnosisId] = { accuracy: feedbackForm.value.accuracy, comment: feedbackForm.value.comment }; closeFeedbackModal(); showToast('Penilaian berhasil diperbarui!') }
  catch (err) { feedbackError.value = err.response?.data?.message ?? 'Gagal mengirim penilaian.' }
  finally { submittingFeedback.value = null }
}
const openNotesModal = d => { notesForm.value = { diagnosisId: d.id, user_notes: d.user_notes ?? '', hasExisting: !!d.user_notes }; notesError.value = null; showNotesModal.value = true }
const closeNotesModal = () => { showNotesModal.value = false; notesForm.value = { diagnosisId: null, user_notes: '', hasExisting: false }; notesError.value = null }
const saveNotes = async () => {
  const id = notesForm.value.diagnosisId; const text = String(notesForm.value.user_notes ?? '').trim()
  if (!id) return; if (!text) { notesError.value = 'Catatan tidak boleh kosong.'; return }
  savingNotes.value = id
  try { await diagnosisStore.updateDiagnosisNotes(id, text); const t = diagnosisHistory.value.find(d => d.id === id); if (t) t.user_notes = text; showToast('Catatan berhasil disimpan!'); closeNotesModal() }
  catch (err) { notesError.value = err.response?.data?.message ?? 'Gagal menyimpan catatan.' }
  finally { savingNotes.value = null }
}
const deleteNotes = async () => {
  const id = notesForm.value.diagnosisId; if (!id) return
  deletingNotes.value = id
  try { await diagnosisStore.deleteDiagnosisNotes(id); const t = diagnosisHistory.value.find(d => d.id === id); if (t) t.user_notes = null; showToast('Catatan berhasil dihapus!'); closeNotesModal() }
  catch (err) { notesError.value = err.response?.data?.message ?? 'Gagal menghapus catatan.' }
  finally { deletingNotes.value = null }
}

onMounted(() => loadHistory())
</script>

<style scoped>
/* ──────────────────────────────────────────────────────────
   TOKENS
────────────────────────────────────────────────────────── */
:root {
  --sage-50:  #f3f8f1;
  --sage-100: #dff0d8;
  --sage-200: #b9dba9;
  --sage-300: #8cc47a;
  --sage-400: #62a94e;
  --sage-500: #4a8e38;
  --sage-600: #39712c;
  --sage-700: #2b5721;
  --sage-800: #1e3f17;
  --sage-900: #122910;
  --amber-100: #fef3c7; --amber-600: #d97706; --amber-700: #b45309;
  --blue-100: #dbeafe;  --blue-600: #2563eb;  --blue-700: #1d4ed8;
  --red-100: #fee2e2;   --red-600: #dc2626;
  --text-1: #111b0e;
  --text-2: #3d5238;
  --text-3: #6b7f65;
  --text-4: #9aad93;
  --border: rgba(74,142,56,.15);
  --border-md: rgba(74,142,56,.25);
  --border-strong: rgba(74,142,56,.4);
  --bg-page: #f2f6f0;
  --bg-card: #ffffff;
  --bg-surface: #f8faf6;
  --r: 16px;
  --r-sm: 10px;
  --r-xs: 7px;
  --shadow-card: 0 1px 0 rgba(74,142,56,.06), 0 4px 20px rgba(0,0,0,.05), 0 1px 3px rgba(0,0,0,.04);
  --shadow-card-hover: 0 2px 0 rgba(74,142,56,.08), 0 8px 32px rgba(0,0,0,.09), 0 2px 6px rgba(0,0,0,.06);
  --shadow-modal: 0 20px 60px rgba(0,0,0,.18), 0 4px 16px rgba(0,0,0,.1);
}

/* ──────────────────────────────────────────────────────────
   RESET / ROOT
────────────────────────────────────────────────────────── */
.rw-root {
  min-height: 100vh;
  background: var(--bg-page);
  font-family: 'Inter', 'DM Sans', system-ui, sans-serif;
  color: var(--text-1);
  position: relative;
  overflow-x: hidden;
}
a { text-decoration: none !important; }
* { box-sizing: border-box; }

/* ──────────────────────────────────────────────────────────
   BACKGROUND
────────────────────────────────────────────────────────── */
.rw-bg { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.rw-bg__orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: .18;
}
.rw-bg__orb--a {
  width: 700px; height: 600px;
  top: -250px; right: -200px;
  background: radial-gradient(circle at 40% 40%, #8cc47a, #4a8e38, transparent);
}
.rw-bg__orb--b {
  width: 500px; height: 500px;
  bottom: -100px; left: -150px;
  background: radial-gradient(circle, #b9dba9, transparent);
}
.rw-bg__grid {
  position: absolute; inset: 0;
  background-image: linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  opacity: .4;
}

/* ──────────────────────────────────────────────────────────
   WRAP
────────────────────────────────────────────────────────── */
.rw-wrap {
  max-width: 840px;
  margin: 0 auto;
  padding: 0 1.25rem;
  position: relative;
  z-index: 1;
}

/* ──────────────────────────────────────────────────────────
   HEADER
────────────────────────────────────────────────────────── */
.rw-header {
  padding: 3.25rem 1.25rem 2.5rem;
  position: relative;
  z-index: 1;
}
.rw-header__inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.rw-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .1em;
  text-transform: uppercase;
  color: var(--sage-500);
  margin-bottom: .75rem;
}
.rw-eyebrow__pip {
  display: block;
  width: 7px; height: 7px;
  background: var(--sage-400);
  border-radius: 50%;
  box-shadow: 0 0 0 3px var(--sage-100);
}
.rw-header__title {
  font-size: 2.5rem;
  font-weight: 800;
  letter-spacing: -.04em;
  line-height: 1.1;
  color: var(--text-1);
  margin: 0 0 .45rem;
  background: linear-gradient(135deg, var(--text-1) 0%, var(--sage-700) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.rw-header__sub {
  font-size: .9375rem;
  color: var(--text-3);
  margin: 0;
}

/* ──────────────────────────────────────────────────────────
   CTA BUTTON
────────────────────────────────────────────────────────── */
.rw-btn-cta {
  display: inline-flex;
  align-items: center;
  gap: .5rem;
  padding: .7rem 1.35rem;
  background: linear-gradient(135deg, var(--sage-500) 0%, var(--sage-700) 100%);
  color: #fff;
  border-radius: 100px;
  font-size: .875rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: transform .14s, box-shadow .14s, filter .14s;
  box-shadow: 0 4px 16px rgba(57,113,44,.35), 0 1px 4px rgba(57,113,44,.25);
  white-space: nowrap;
  font-family: inherit;
}
.rw-btn-cta:hover { transform: translateY(-2px); filter: brightness(1.05); box-shadow: 0 6px 24px rgba(57,113,44,.4), 0 2px 6px rgba(57,113,44,.3); }
.rw-btn-cta:active { transform: translateY(0); }

/* ──────────────────────────────────────────────────────────
   TOAST
────────────────────────────────────────────────────────── */
.rw-toast {
  position: fixed;
  bottom: 2rem; right: 2rem;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: .65rem;
  padding: .75rem 1.1rem;
  border-radius: 100px;
  font-size: .8125rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 24px rgba(0,0,0,.14);
}
.rw-toast--ok { background: rgba(255,255,255,.96); border: 1.5px solid var(--sage-200); color: var(--sage-700); }
.rw-toast--err { background: rgba(255,255,255,.96); border: 1.5px solid #fca5a5; color: #b91c1c; }
.rw-toast__icon-wrap {
  width: 22px; height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.rw-toast--ok .rw-toast__icon-wrap { background: var(--sage-100); color: var(--sage-700); }
.rw-toast--err .rw-toast__icon-wrap { background: #fee2e2; color: #b91c1c; }

.toast-slide-enter-active, .toast-slide-leave-active { transition: all .22s cubic-bezier(.34,1.56,.64,1); }
.toast-slide-enter-from, .toast-slide-leave-to { opacity: 0; transform: translateY(12px) scale(.95); }

/* ──────────────────────────────────────────────────────────
   MAIN
────────────────────────────────────────────────────────── */
.rw-main { padding-bottom: 5rem; }

/* ──────────────────────────────────────────────────────────
   STATE (loading / empty)
────────────────────────────────────────────────────────── */
.rw-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; padding: 6rem 2rem; text-align: center; }
.rw-state__label { font-size: .9rem; color: var(--text-3); }

.rw-loader { display: flex; flex-direction: column; align-items: center; gap: .75rem; }
.rw-loader__leaf { font-size: 2rem; animation: leafBounce 1.2s ease-in-out infinite; }
@keyframes leafBounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
.rw-loader__bar { width: 120px; height: 3px; background: var(--sage-100); border-radius: 99px; overflow: hidden; }
.rw-loader__fill { height: 100%; background: linear-gradient(90deg, var(--sage-400), var(--sage-600)); border-radius: 99px; animation: barFlow 1.5s ease-in-out infinite; }
@keyframes barFlow { 0%{width:0%;margin-left:0} 50%{width:80%;margin-left:10%} 100%{width:0%;margin-left:100%} }

.rw-empty { display: flex; flex-direction: column; align-items: center; gap: 1.25rem; padding: 5rem 2rem; text-align: center; }
.rw-empty__art { position: relative; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; }
.rw-empty__circle { width: 72px; height: 72px; background: linear-gradient(135deg, var(--sage-50), var(--sage-100)); border: 1.5px solid var(--sage-200); border-radius: 50%; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; }
.rw-empty__ring { position: absolute; border-radius: 50%; border: 1px solid var(--sage-200); animation: ripple 3s ease-out infinite; }
.rw-empty__ring--1 { inset: -14px; animation-delay: 0s; }
.rw-empty__ring--2 { inset: -28px; animation-delay: .8s; }
@keyframes ripple { 0%{opacity:.8;transform:scale(.85)} 100%{opacity:0;transform:scale(1)} }
.rw-empty__title { font-size: 1.25rem; font-weight: 700; color: var(--text-1); margin: 0; }
.rw-empty__text { font-size: .9rem; color: var(--text-3); max-width: 340px; line-height: 1.65; margin: 0; }

/* ──────────────────────────────────────────────────────────
   STATS BAR
────────────────────────────────────────────────────────── */
.rw-stats {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: .875rem 1.25rem;
  margin-bottom: 1.25rem;
  box-shadow: var(--shadow-card);
}
.rw-stat { display: flex; flex-direction: column; align-items: center; gap: 1px; }
.rw-stat__num { font-size: 1.375rem; font-weight: 800; color: var(--text-1); line-height: 1; }
.rw-stat__num--green { color: var(--sage-600); }
.rw-stat__num--amber { color: var(--amber-600); }
.rw-stat__label { font-size: .7rem; font-weight: 600; color: var(--text-4); text-transform: uppercase; letter-spacing: .06em; }
.rw-stat__sep { width: 1px; height: 30px; background: var(--border); }

/* ──────────────────────────────────────────────────────────
   LIST
────────────────────────────────────────────────────────── */
.rw-list { display: flex; flex-direction: column; gap: 1rem; }

/* ──────────────────────────────────────────────────────────
   CARD
────────────────────────────────────────────────────────── */
.rw-card {
  display: flex;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--r);
  box-shadow: var(--shadow-card);
  overflow: hidden;
  animation: slideUp .4s both cubic-bezier(.22,.68,0,1.2);
  animation-delay: var(--delay, 0ms);
  transition: box-shadow .2s, transform .2s, border-color .2s;
}
.rw-card:hover { box-shadow: var(--shadow-card-hover); transform: translateY(-2px); border-color: var(--border-md); }

@keyframes slideUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }

/* Accent bar */
.rw-card__accent {
  width: 4px;
  flex-shrink: 0;
}
.rw-accent--pending   { background: linear-gradient(180deg, #f59e0b, #d97706); }
.rw-accent--completed { background: linear-gradient(180deg, var(--sage-400), var(--sage-600)); }
.rw-accent--consulted { background: linear-gradient(180deg, #60a5fa, #2563eb); }

/* Card body */
.rw-card__body {
  flex: 1;
  padding: 1.25rem 1.375rem 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Card header */
.rw-card__header { display: flex; align-items: center; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
.rw-card__plant-row { display: flex; align-items: center; gap: .875rem; }
.rw-plant-badge {
  width: 44px; height: 44px;
  background: linear-gradient(135deg, var(--sage-50), var(--sage-100));
  border: 1.5px solid var(--sage-200);
  border-radius: var(--r-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  flex-shrink: 0;
  box-shadow: 0 2px 6px rgba(74,142,56,.1);
}
.rw-card__name { font-size: .9375rem; font-weight: 700; color: var(--text-1); margin: 0 0 2px; }
.rw-card__time { font-size: .75rem; color: var(--text-4); font-weight: 500; display: block; }

/* Status pill */
.rw-status-pill {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .3rem .8rem;
  border-radius: 100px;
  font-size: .72rem;
  font-weight: 700;
  letter-spacing: .03em;
  white-space: nowrap;
}
.rw-status-pill .rw-status__dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  display: block;
}
.rw-status--pending   { background: var(--amber-100); color: var(--amber-700); border: 1px solid rgba(217,119,6,.2); }
.rw-status--pending .rw-status__dot   { background: var(--amber-600); animation: dotPulse 1.4s ease-in-out infinite; }
.rw-status--completed { background: var(--sage-50); color: var(--sage-700); border: 1px solid var(--sage-200); }
.rw-status--completed .rw-status__dot { background: var(--sage-500); }
.rw-status--consulted { background: var(--blue-100); color: var(--blue-700); border: 1px solid rgba(37,99,235,.2); }
.rw-status--consulted .rw-status__dot { background: var(--blue-600); }
@keyframes dotPulse { 0%,100%{opacity:1} 50%{opacity:.4} }

/* ──────────────────────────────────────────────────────────
   RESULT BOX
────────────────────────────────────────────────────────── */
.rw-result-box {
  background: linear-gradient(135deg, var(--sage-50) 0%, rgba(185,219,169,.15) 100%);
  border: 1px solid var(--sage-200);
  border-radius: var(--r-sm);
  padding: 1rem 1.125rem;
}
.rw-result-box__top { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; margin-bottom: .625rem; }
.rw-result-box__eyebrow { font-size: .7rem; font-weight: 700; text-transform: uppercase; letter-spacing: .08em; color: var(--text-3); margin: 0 0 4px; }
.rw-result-box__name { font-size: 1.0625rem; font-weight: 800; color: var(--text-1); margin: 0; line-height: 1.3; }
.rw-result-box__tags { display: flex; gap: .4rem; flex-wrap: wrap; margin-bottom: .5rem; }
.rw-result-box__rec { font-size: .8125rem; color: var(--text-3); line-height: 1.65; margin: 0; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.rw-certainty-ring { flex-shrink: 0; }

/* Tag chips */
.rw-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: .22rem .55rem;
  border-radius: 100px;
  font-size: .7rem;
  font-weight: 700;
}
.rw-tag--green { background: var(--sage-100); color: var(--sage-700); border: 1px solid var(--sage-200); }

.rw-no-result {
  display: flex;
  align-items: center;
  gap: .6rem;
  font-size: .875rem;
  color: var(--text-3);
  padding: .875rem 1rem;
  background: var(--bg-surface);
  border: 1px dashed var(--border-md);
  border-radius: var(--r-sm);
}
.rw-pulse-dot {
  width: 8px; height: 8px;
  background: #f59e0b;
  border-radius: 50%;
  flex-shrink: 0;
  animation: dotPulse 1.2s ease-in-out infinite;
}

/* ──────────────────────────────────────────────────────────
   PANELS (notes / feedback)
────────────────────────────────────────────────────────── */
.rw-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border);
  border-radius: var(--r-sm);
  padding: .75rem 1rem;
}
.rw-panel__head { display: flex; align-items: center; justify-content: space-between; gap: .5rem; margin-bottom: .45rem; }
.rw-panel__label {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  font-size: .72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: .07em;
  color: var(--text-3);
}
.rw-panel__text { font-size: .8125rem; color: var(--text-2); line-height: 1.65; margin: 0; }
.rw-panel__empty { font-size: .8rem; color: var(--text-4); font-style: italic; margin: 0; }

.rw-ghost-btn {
  background: transparent;
  border: 1.5px solid var(--border-md);
  color: var(--sage-600);
  border-radius: 100px;
  padding: .28rem .7rem;
  font-size: .72rem;
  font-weight: 700;
  cursor: pointer;
  transition: all .15s;
  font-family: inherit;
  letter-spacing: .02em;
}
.rw-ghost-btn:hover { border-color: var(--sage-500); background: var(--sage-50); }
.rw-ghost-btn:disabled { opacity: .45; cursor: not-allowed; }

/* ──────────────────────────────────────────────────────────
   FEEDBACK CHIPS
────────────────────────────────────────────────────────── */
.rw-fb-row { display: flex; gap: .45rem; flex-wrap: wrap; }
.rw-fb-row--lg { gap: .5rem; }

.rw-fb-chip {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  padding: .38rem .8rem;
  font-size: .775rem;
  font-weight: 600;
  border: 1.5px solid var(--border-md);
  border-radius: 100px;
  background: var(--bg-card);
  cursor: pointer;
  transition: all .15s;
  font-family: inherit;
  color: var(--text-2);
}
.rw-fb-chip:hover { border-color: var(--sage-400); background: var(--sage-50); color: var(--sage-700); }
.rw-fb-chip:disabled { opacity: .5; cursor: not-allowed; }

/* modal variant */
.rw-fb-chip--modal { cursor: pointer; }
.rw-fb-chip--modal.is-sel { border-color: var(--sage-500); background: var(--sage-50); color: var(--sage-700); box-shadow: 0 0 0 3px rgba(74,142,56,.1); }

/* Hover overrides per type */
.rw-fb-chip--good:hover, .rw-fb-chip--good.is-sel { border-color: var(--sage-500); background: var(--sage-50); color: var(--sage-700); }
.rw-fb-chip--fair:hover, .rw-fb-chip--fair.is-sel { border-color: var(--amber-600); background: var(--amber-100); color: var(--amber-700); }
.rw-fb-chip--poor:hover, .rw-fb-chip--poor.is-sel { border-color: #f87171; background: var(--red-100); color: #991b1b; }

.rw-fb-given { display: flex; align-items: center; justify-content: space-between; gap: .75rem; flex-wrap: wrap; }
.rw-fb-given__left { display: flex; align-items: center; gap: .6rem; flex-wrap: wrap; }

.rw-fb-badge {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  padding: .28rem .7rem;
  border-radius: 100px;
  font-size: .775rem;
  font-weight: 700;
  border: 1.5px solid transparent;
}
.rw-fb-badge--accurate        { background: var(--sage-50); border-color: var(--sage-200); color: var(--sage-700); }
.rw-fb-badge--somewhat_accurate { background: var(--amber-100); border-color: rgba(217,119,6,.3); color: var(--amber-700); }
.rw-fb-badge--inaccurate      { background: var(--red-100); border-color: rgba(220,38,38,.2); color: #991b1b; }

/* ──────────────────────────────────────────────────────────
   CARD ACTIONS
────────────────────────────────────────────────────────── */
.rw-card__actions {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
}
.rw-action-primary {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .525rem 1.05rem;
  font-size: .8125rem;
  font-weight: 700;
  border-radius: 100px;
  background: linear-gradient(135deg, var(--sage-500), var(--sage-700));
  border: none;
  color: #fff;
  cursor: pointer;
  font-family: inherit;
  transition: transform .12s, box-shadow .12s, filter .12s;
  box-shadow: 0 2px 10px rgba(57,113,44,.3);
  text-decoration: none !important;
}
.rw-action-primary:hover { transform: translateY(-1px); filter: brightness(1.08); box-shadow: 0 4px 16px rgba(57,113,44,.35); }
.rw-action-primary:active { transform: none; }
.rw-action-primary:disabled { opacity: .5; cursor: not-allowed; transform: none; }

.rw-action-ghost {
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  padding: .5rem .95rem;
  font-size: .8125rem;
  font-weight: 600;
  border-radius: 100px;
  border: 1.5px solid var(--border-md);
  background: var(--bg-card);
  color: var(--text-2);
  cursor: pointer;
  font-family: inherit;
  transition: all .15s;
}
.rw-action-ghost:hover { border-color: var(--sage-400); background: var(--sage-50); color: var(--sage-700); }
.rw-action-ghost:disabled { opacity: .45; cursor: not-allowed; }

.rw-action-danger {
  display: inline-flex; align-items: center; gap: .4rem;
  padding: .5rem .95rem; font-size: .8125rem; font-weight: 600;
  border-radius: 100px; border: 1.5px solid rgba(220,38,38,.25);
  background: var(--red-100); color: var(--red-600);
  cursor: pointer; font-family: inherit; transition: all .15s;
}
.rw-action-danger:hover { background: #fecaca; border-color: rgba(220,38,38,.4); }
.rw-action-danger:disabled { opacity: .45; cursor: not-allowed; }

/* ──────────────────────────────────────────────────────────
   PAGINATION
────────────────────────────────────────────────────────── */
.rw-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}
.rw-page-btn {
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1.5px solid var(--border-md);
  background: var(--bg-card);
  color: var(--text-2);
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all .15s;
  box-shadow: 0 1px 4px rgba(0,0,0,.04);
}
.rw-page-btn:hover:not(:disabled) { border-color: var(--sage-400); background: var(--sage-50); color: var(--sage-700); box-shadow: 0 2px 8px rgba(74,142,56,.15); }
.rw-page-btn:disabled { opacity: .3; cursor: not-allowed; }
.rw-page-info { text-align: center; }
.rw-page-info__num { display: block; font-size: 1.125rem; font-weight: 800; color: var(--text-1); line-height: 1; }
.rw-page-info__label { font-size: .7rem; color: var(--text-4); font-weight: 600; text-transform: uppercase; letter-spacing: .06em; }

/* ──────────────────────────────────────────────────────────
   MODAL / OVERLAY
────────────────────────────────────────────────────────── */
.rw-overlay {
  position: fixed; inset: 0; z-index: 500;
  background: rgba(10,20,8,.5);
  backdrop-filter: blur(6px);
  display: flex; align-items: center; justify-content: center;
  padding: 1.25rem;
}
.rw-modal {
  background: var(--bg-card);
  border: 1px solid var(--border-md);
  border-radius: 20px;
  width: 100%; max-width: 480px;
  box-shadow: var(--shadow-modal);
  overflow: hidden;
}
.rw-modal__head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.125rem 1.5rem;
  border-bottom: 1px solid var(--border);
  background: linear-gradient(135deg, var(--sage-50), var(--bg-card));
}
.rw-modal__title { font-size: 1.0625rem; font-weight: 800; color: var(--text-1); margin: 0; }
.rw-modal__close {
  width: 32px; height: 32px;
  border: 1.5px solid var(--border-md);
  background: var(--bg-card);
  border-radius: 50%;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: var(--text-3);
  transition: all .15s;
}
.rw-modal__close:hover { border-color: var(--sage-400); background: var(--sage-50); color: var(--text-1); }
.rw-modal__body { padding: 1.5rem; display: flex; flex-direction: column; gap: 1.125rem; }
.rw-modal__hint { font-size: .8125rem; color: var(--text-3); line-height: 1.65; margin: 0; background: var(--sage-50); border: 1px solid var(--sage-200); border-radius: var(--r-xs); padding: .625rem .875rem; }
.rw-modal__foot {
  display: flex; align-items: center; gap: .5rem;
  padding: .875rem 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--bg-surface);
}

.rw-modal-enter-active, .rw-modal-leave-active { transition: opacity .2s; }
.rw-modal-enter-active .rw-modal, .rw-modal-leave-active .rw-modal { transition: transform .22s cubic-bezier(.34,1.56,.64,1), opacity .2s; }
.rw-modal-enter-from, .rw-modal-leave-to { opacity: 0; }
.rw-modal-enter-from .rw-modal, .rw-modal-leave-to .rw-modal { transform: scale(.94) translateY(12px); opacity: 0; }

/* ──────────────────────────────────────────────────────────
   FORM ELEMENTS
────────────────────────────────────────────────────────── */
.rw-field { display: flex; flex-direction: column; gap: .45rem; }
.rw-field__label { font-size: .8125rem; font-weight: 700; color: var(--text-2); }
.rw-field__opt { font-weight: 400; color: var(--text-4); }
.rw-textarea {
  width: 100%; padding: .75rem .875rem;
  border: 1.5px solid var(--border-md);
  border-radius: var(--r-xs);
  background: var(--bg-card);
  font-size: .875rem; color: var(--text-1);
  font-family: inherit; resize: vertical;
  transition: border-color .15s, box-shadow .15s;
}
.rw-textarea:focus { outline: none; border-color: var(--sage-400); box-shadow: 0 0 0 4px rgba(74,142,56,.1); }
.rw-textarea::placeholder { color: var(--text-4); }
.rw-alert-err { background: var(--red-100); border: 1.5px solid rgba(220,38,38,.2); color: #991b1b; border-radius: var(--r-xs); padding: .6rem .875rem; font-size: .8125rem; font-weight: 600; }
.sr-only { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; }
</style>