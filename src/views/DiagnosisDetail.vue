<template>
  <div style="background:var(--bg-page);min-height:100vh;">
    <!-- Page Header -->
    <div class="sp-page-header" style="padding:calc(64px + 1.75rem) 1.25rem 1.75rem;">
      <div class="page-container">
        <RouterLink to="/diagnosis/history" class="sp-btn sp-btn-secondary sp-btn-sm" style="margin-bottom:1rem;display:inline-flex;">
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
          Kembali
        </RouterLink>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:1rem;">
          <div>
            <h1 style="margin:0 0 .375rem;">Detail Diagnosis</h1>
            <p v-if="diagnosis" style="margin:0;font-size:.875rem;color:var(--text-muted);">
              {{ formatDate(diagnosis.created_at) }}
            </p>
          </div>
          <button v-if="diagnosis" @click="downloadPdf" class="sp-btn sp-btn-secondary sp-btn-sm" style="background:white;gap:.5rem;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Unduh PDF
          </button>
        </div>
      </div>
    </div>

    <div class="page-container" style="max-width:860px;padding-top:2rem;padding-bottom:3rem;">
      <!-- Loading -->
      <div v-if="loading" class="sp-card" style="padding:3rem;text-align:center;">
        <div class="sp-spinner" style="width:32px;height:32px;border-width:3px;margin:0 auto 1rem;"></div>
        <p style="color:var(--text-muted);">Memuat detail diagnosis...</p>
      </div>

      <div v-else-if="diagnosis" style="display:flex;flex-direction:column;gap:1.25rem;">

        <!-- Plant Info -->
        <div class="sp-card" style="padding:1.5rem;">
          <h2 class="section-title">
            <span class="section-icon section-icon--green">🌱</span>
            Informasi Tanaman
          </h2>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
            <div>
              <span class="info-label">Jenis Tanaman</span>
              <span class="info-value">{{ diagnosis.plant?.name || '-' }}</span>
            </div>
            <div>
              <span class="info-label">Nama Ilmiah</span>
              <span class="info-value" style="font-style:italic;">{{ diagnosis.plant?.scientific_name || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- Result -->
        <div v-if="diagnosis.disease || diagnosis.disease_id" class="sp-card" style="padding:1.5rem;">
          <h2 class="section-title">
            <span class="section-icon section-icon--blue">🔬</span>
            Hasil Diagnosis
          </h2>
          <div class="result-box">
            <div class="result-top">
              <div>
                <h3 class="result-disease">{{ diagnosis.disease?.name || 'Penyakit Tidak Diketahui' }}</h3>
                <div style="display:flex;align-items:center;gap:.5rem;margin-top:.375rem;">
                  <span class="cf-label">Tingkat Kepastian:</span>
                  <span class="cf-pct" :class="getCFClass(diagnosis.certainty_value)">
                    {{ (diagnosis.certainty_value * 100).toFixed(1) }}%
                  </span>
                  <span class="cf-badge" :class="getCFBadgeClass(diagnosis.certainty_value)">
                    {{ getCFLabel(diagnosis.certainty_value) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div style="margin:1rem 0;">
              <div class="cf-bar-track">
                <div class="cf-bar-fill" :class="getCFBarClass(diagnosis.certainty_value)" :style="{ width: (diagnosis.certainty_value * 100) + '%' }"></div>
              </div>
              <div class="cf-bar-labels">
                <span>Rendah</span><span>Sedang</span><span>Tinggi</span>
              </div>
            </div>

            <!-- Disease details -->
            <div class="disease-details">
              <div v-if="diagnosis.disease?.description" class="detail-row">
                <h4 class="detail-title">Deskripsi</h4>
                <p class="detail-text">{{ diagnosis.disease.description }}</p>
              </div>
              <div v-if="diagnosis.disease?.cause" class="detail-row">
                <h4 class="detail-title detail-title--amber">Penyebab</h4>
                <p class="detail-text">{{ diagnosis.disease.cause }}</p>
              </div>
              <div v-if="diagnosis.disease?.solution" class="detail-row">
                <h4 class="detail-title detail-title--green">Solusi Penanganan</h4>
                <p class="detail-text">{{ diagnosis.disease.solution }}</p>
              </div>
              <div v-if="diagnosis.disease?.prevention" class="detail-row">
                <h4 class="detail-title detail-title--blue">Pencegahan</h4>
                <p class="detail-text">{{ diagnosis.disease.prevention }}</p>
              </div>
            </div>

            <!-- Recommendation -->
            <div v-if="diagnosis.recommendation" class="recommendation-box">
              <h4 style="font-size:.875rem;font-weight:600;color:var(--gray-800);margin-bottom:.5rem;">📋 Rekomendasi Sistem</h4>
              <div class="recommendation-text" v-html="formatRecommendation(diagnosis.recommendation)"></div>
            </div>

            <div v-if="diagnosis.matched_symptoms_count" style="margin-top:.875rem;padding-top:.875rem;border-top:1px solid var(--border);font-size:.8125rem;color:var(--text-muted);">
              Gejala yang cocok: <strong style="color:var(--primary);">{{ diagnosis.matched_symptoms_count }} gejala</strong>
            </div>
          </div>
        </div>

        <!-- Relevant Maintenance Guides -->
        <div v-if="relevantModules.length > 0" class="sp-card" style="padding:1.5rem;background:linear-gradient(to bottom right, #f8fafc, #ffffff);">
          <h2 class="section-title">
            <span class="section-icon section-icon--green">📚</span>
            Optimalisasi Pemeliharaan {{ diagnosis.plant?.name }}
          </h2>
          <p class="text-xs text-slate-500 mb-4">Pelajari cara merawat tanaman Anda agar tidak terserang penyakit lagi:</p>
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:1rem;">
            <RouterLink 
              v-for="module in relevantModules" :key="module.id" 
              :to="'/education/' + module.id"
              class="relevant-card"
            >
              <img v-if="module.image" :src="module.image" class="relevant-img" />
              <div class="relevant-content">
                <span v-if="module.is_maintenance_guide" class="mini-badge">📋 Panduan</span>
                <h4 class="relevant-title">{{ module.title }}</h4>
                <p class="relevant-category">{{ module.category }}</p>
              </div>
            </RouterLink>
          </div>
        </div>

        <!-- Other Possibilities -->
        <div v-if="diagnosis.all_possibilities && diagnosis.all_possibilities.length > 1" class="sp-card" style="padding:1.5rem;">
          <h2 class="section-title">
            <span class="section-icon section-icon--amber">📊</span>
            Kemungkinan Penyakit Lain
          </h2>
          <div style="display:flex;flex-direction:column;gap:.625rem;">
            <div
              v-for="(poss, i) in diagnosis.all_possibilities.slice(1, 6)" :key="poss.disease_id"
              class="possibility-row"
            >
              <div class="poss-rank">#{{ i + 2 }}</div>
              <div style="flex:1;min-width:0;">
                <p class="poss-name">{{ poss.disease_name }}</p>
                <p v-if="poss.solution" class="poss-solution">{{ truncate(poss.solution, 80) }}</p>
              </div>
              <div style="display:flex;align-items:center;gap:.5rem;flex-shrink:0;">
                <span style="font-size:.8rem;color:var(--text-muted);">{{ poss.matched_count || 0 }} gejala</span>
                <span class="poss-pct">{{ (poss.certainty_value * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- No result -->
        <div v-if="!diagnosis.disease && !diagnosis.disease_id" class="sp-card" style="padding:2.5rem;text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:.75rem;">🔍</div>
          <p style="color:var(--text-muted);">Belum ada hasil diagnosis</p>
        </div>

        <!-- Symptoms used -->
        <div v-if="diagnosis.symptoms && diagnosis.symptoms.length > 0" class="sp-card" style="padding:1.5rem;">
          <h2 class="section-title">
            <span class="section-icon section-icon--cyan">🩺</span>
            Gejala yang Dipilih
          </h2>
          <div class="symptoms-used-grid">
            <div v-for="s in diagnosis.symptoms" :key="s.id" class="symptom-used-item">
              <span class="symptom-used-code">{{ s.code }}</span>
              <div style="flex:1;min-width:0;">
                <p class="symptom-used-desc">{{ s.description }}</p>
                <p class="symptom-used-cf">Keyakinan: {{ ((s.pivot?.user_cf || s.user_cf || 0) * 100).toFixed(0) }}%</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="sp-card" style="padding:1.5rem;">
          <h2 class="section-title">
            <span class="section-icon section-icon--gray">📝</span>
            Catatan Saya untuk Evaluasi Admin
          </h2>
          <p
            v-if="diagnosis.user_notes"
            style="font-size:.875rem;line-height:1.7;color:var(--text-muted);background:var(--bg-subtle);padding:.875rem;border-radius:var(--radius);margin:0;"
          >
            {{ diagnosis.user_notes }}
          </p>
          <p
            v-else
            style="font-size:.875rem;line-height:1.7;color:var(--text-faint);background:var(--bg-subtle);padding:.875rem;border-radius:var(--radius);margin:0;font-style:italic;"
          >
            Belum ada catatan evaluasi.
          </p>
          <div style="display:flex;justify-content:flex-end;margin-top:.75rem;">
            <button @click="openNotesModal" class="sp-btn sp-btn-secondary sp-btn-sm">
              {{ diagnosis.user_notes ? 'Ubah Catatan' : 'Tambah Catatan' }}
            </button>
          </div>
        </div>

        <!-- Feedback prompt -->
        <div v-if="!showFeedbackForm && !hasFeedback" class="sp-card" style="padding:1.5rem;text-align:center;">
          <h3 style="margin-bottom:.375rem;">Bagaimana hasil diagnosis ini?</h3>
          <p style="font-size:.875rem;color:var(--text-muted);margin-bottom:1.25rem;">Feedback Anda membantu meningkatkan kualitas sistem</p>
          <button @click="showFeedbackForm = true" class="sp-btn sp-btn-primary">Berikan Feedback</button>
        </div>

        <!-- Feedback Form -->
        <div v-if="showFeedbackForm && !hasFeedback" class="sp-card" style="padding:1.5rem;">
          <h3 style="margin-bottom:1.25rem;">Berikan Feedback</h3>
          <form @submit.prevent="submitFeedbackForm" style="display:flex;flex-direction:column;gap:1.25rem;">
            <div>
              <label class="sp-label">Rating <span style="color:#dc2626;">*</span></label>
              <div style="display:flex;gap:.625rem;flex-wrap:wrap;">
                <label
                  v-for="r in feedbackRatings" :key="r.value"
                  class="rating-option"
                  :class="{ 'rating-option--selected': feedbackForm.accuracy === r.value }"
                >
                  <input type="radio" :value="r.value" v-model="feedbackForm.accuracy" class="sr-only" required />
                  {{ r.icon }} {{ r.label }}
                </label>
              </div>
            </div>
            <div>
              <label for="fb-comment" class="sp-label">Komentar (Opsional)</label>
              <textarea id="fb-comment" v-model="feedbackForm.comment" placeholder="Bagikan pendapat Anda..." rows="3" class="glass-input" style="resize:vertical;" maxlength="1000"></textarea>
              <p style="font-size:.75rem;color:var(--text-faint);margin-top:.25rem;">{{ feedbackForm.comment?.length || 0 }}/1000</p>
            </div>
            <div v-if="feedbackError" class="sp-alert sp-alert-danger">{{ feedbackError }}</div>
            <div style="display:flex;gap:.625rem;justify-content:flex-end;">
              <button type="button" @click="cancelFeedback" :disabled="submittingFeedback" class="sp-btn sp-btn-secondary">Batal</button>
              <button type="submit" :disabled="submittingFeedback || !feedbackForm.accuracy" class="sp-btn sp-btn-primary">
                {{ submittingFeedback ? 'Mengirim...' : 'Kirim Feedback' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Feedback success -->
        <div v-if="hasFeedback && feedbackSuccess" class="sp-card animate-fade-in" style="padding:1.5rem;text-align:center;">
          <div style="font-size:2.5rem;margin-bottom:.75rem;">✅</div>
          <h3 style="margin-bottom:.375rem;">Terima kasih atas feedback Anda!</h3>
          <p style="font-size:.875rem;color:var(--text-muted);margin-bottom:1.25rem;">Feedback Anda membantu meningkatkan kualitas sistem diagnosis.</p>
          <div style="display:flex;gap:.625rem;justify-content:center;flex-wrap:wrap;">
            <button @click="openConsultationModal" class="sp-btn sp-btn-secondary">💬 Chat ke Pakar</button>
            <RouterLink to="/diagnosis" class="sp-btn sp-btn-primary">+ Diagnosis Baru</RouterLink>
            <RouterLink to="/diagnosis/history" class="sp-btn sp-btn-ghost">← Riwayat</RouterLink>
          </div>
        </div>

        <!-- Actions -->
        <div v-if="hasFeedback && !feedbackSuccess" style="display:flex;gap:.625rem;justify-content:center;flex-wrap:wrap;">
          <button @click="openConsultationModal" class="sp-btn sp-btn-secondary">💬 Chat ke Pakar</button>
          <RouterLink to="/diagnosis" class="sp-btn sp-btn-primary">+ Diagnosis Baru</RouterLink>
          <RouterLink to="/diagnosis/history" class="sp-btn sp-btn-ghost">← Riwayat</RouterLink>
        </div>
      </div>

      <!-- Error state -->
      <div v-else class="sp-card" style="padding:3rem;text-align:center;">
        <div style="font-size:2.5rem;margin-bottom:.75rem;">❌</div>
        <p style="color:var(--text-muted);margin-bottom:1.25rem;">Diagnosis tidak ditemukan</p>
        <RouterLink to="/diagnosis/history" class="sp-btn sp-btn-primary">Kembali ke Riwayat</RouterLink>
      </div>

      <!-- Consultation Modal -->
      <ConsultationWhatsAppModal :show="showConsultationModal" :diagnosis="diagnosis" @close="closeConsultationModal" @success="handleConsultationSuccess" />

      <!-- Notes Modal -->
      <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="showNotesModal" style="position:fixed;inset:0;z-index:500;display:flex;align-items:center;justify-content:center;padding:1.25rem;background:rgba(0,0,0,.45);" @click="closeNotesModal">
          <div class="sp-card" style="max-width:520px;width:100%;overflow:hidden;" @click.stop>
            <div style="display:flex;align-items:center;justify-content:space-between;padding:1.125rem 1.5rem;border-bottom:1px solid var(--border);">
              <h3 style="font-size:1.0625rem;margin:0;">Catatan Evaluasi untuk Admin</h3>
              <button @click="closeNotesModal" style="background:none;border:none;cursor:pointer;color:var(--text-muted);padding:4px;border-radius:6px;">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div style="padding:1.5rem;display:flex;flex-direction:column;gap:1rem;">
              <p style="margin:0;font-size:.8125rem;color:var(--text-muted);">
                Isi catatan jika ada gejala tambahan yang belum tersedia di daftar pilihan, agar admin dapat mengevaluasi dan menambahkan gejala baru.
              </p>
              <textarea
                v-model="notesForm.user_notes"
                placeholder="Tulis catatan tambahan Anda..."
                rows="4"
                class="glass-input"
                style="resize:vertical;"
                maxlength="1000"
              ></textarea>
              <p style="font-size:.75rem;color:var(--text-faint);margin-top:.25rem;">{{ notesForm.user_notes?.length || 0 }}/1000</p>
              <div v-if="notesError" class="sp-alert sp-alert-danger">{{ notesError }}</div>
            </div>
            <div style="display:flex;justify-content:space-between;gap:.625rem;padding:.875rem 1.5rem;border-top:1px solid var(--border);">
              <button
                v-if="hasExistingNotes"
                @click="deleteNotes"
                :disabled="deletingNotes || savingNotes"
                class="sp-btn sp-btn-danger"
              >
                {{ deletingNotes ? 'Menghapus...' : 'Hapus Catatan' }}
              </button>
              <div style="display:flex;gap:.625rem;margin-left:auto;">
                <button @click="closeNotesModal" class="sp-btn sp-btn-secondary">Batal</button>
                <button @click="saveNotes" :disabled="savingNotes || deletingNotes" class="sp-btn sp-btn-primary">
                  {{ savingNotes ? 'Menyimpan...' : 'Simpan Catatan' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDiagnosisStore } from '../stores/diagnosis'
import { useEducationStore } from '../stores/education'
import ConsultationWhatsAppModal from '../components/ConsultationWhatsAppModal.vue'

const route = useRoute()
const diagnosisStore = useDiagnosisStore()
const educationStore = useEducationStore()

const loading = ref(true)
const showConsultationModal = ref(false)
const hasFeedback = ref(false)
const showFeedbackForm = ref(false)
const submittingFeedback = ref(false)
const feedbackError = ref(null)
const feedbackSuccess = ref(false)
const feedbackForm = ref({ accuracy: null, comment: '' })
const relevantModules = ref([])
const showNotesModal = ref(false)
const notesForm = ref({ user_notes: '' })
const notesError = ref(null)
const savingNotes = ref(false)
const deletingNotes = ref(false)

const feedbackRatings = [
  { value: 'accurate',         label: 'Akurat',       icon: '😊' },
  { value: 'somewhat_accurate', label: 'Cukup Akurat', icon: '😐' },
  { value: 'inaccurate',       label: 'Tidak Akurat',  icon: '😞' },
]

const diagnosis = computed(() => {
  const d = diagnosisStore.currentDiagnosis
  if (!d) return null
  if (d.diagnosis) return { ...d.diagnosis, plant: d.plant, disease: d.disease, symptoms: d.symptoms, certainty_value: d.certainty_value, recommendation: d.recommendation, all_possibilities: d.all_possibilities, matched_symptoms_count: d.matched_symptoms_count }
  return d
})

const loadDetail = async () => {
  loading.value = true
  try {
    const res = await diagnosisStore.fetchDetail(route.params.id)
    if (res.success && res.data) {
      const d = res.data
      // Cek feedback bawaan dari eager load
      if (d.feedback) {
        hasFeedback.value = true
        feedbackForm.value.accuracy = d.feedback.accuracy
        feedbackForm.value.comment = d.feedback.comment || ''
      }
      
      // Ambil panduan pemeliharaan relevan
      const plantName = d.plant?.name
      if (plantName) {
        const eduRes = await educationStore.fetchModules(null, 1, plantName)
        if (eduRes.success && eduRes.data?.data) {
          relevantModules.value = eduRes.data.data.slice(0, 3)
        }
      }
    }
  } catch (e) { console.error('Error loading detail:', e) }
  finally { loading.value = false }
}

const downloadPdf = async () => {
  try { await diagnosisStore.downloadPdf(route.params.id) }
  catch (e) { alert('Gagal mengunduh PDF.') }
}

const formatDate = (d) => new Date(d).toLocaleDateString('id-ID', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit' })
const formatRecommendation = (t) => t ? t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>') : ''
const truncate = (s, n) => s && s.length > n ? s.slice(0, n) + '…' : (s || '')

const getCFLabel = (v) => v >= 0.7 ? 'Tinggi' : v >= 0.4 ? 'Sedang' : 'Rendah'
const getCFClass = (v) => v >= 0.7 ? 'cf-pct--high' : v >= 0.4 ? 'cf-pct--medium' : 'cf-pct--low'
const getCFBadgeClass = (v) => v >= 0.7 ? 'cf-badge--high' : v >= 0.4 ? 'cf-badge--medium' : 'cf-badge--low'
const getCFBarClass = (v) => v >= 0.7 ? 'sp-cf-bar-high' : v >= 0.4 ? 'sp-cf-bar-medium' : 'sp-cf-bar-low'

const openConsultationModal = () => { showConsultationModal.value = true }
const closeConsultationModal = () => { showConsultationModal.value = false }
const handleConsultationSuccess = () => { closeConsultationModal() }

const submitFeedbackForm = async () => {
  if (!feedbackForm.value.accuracy) { feedbackError.value = 'Pilih rating terlebih dahulu'; return }
  submittingFeedback.value = true; feedbackError.value = null
  try {
    await diagnosisStore.submitFeedback(route.params.id, feedbackForm.value.accuracy, feedbackForm.value.comment || null)
    hasFeedback.value = true; showFeedbackForm.value = false; feedbackSuccess.value = true
    setTimeout(() => { feedbackSuccess.value = false }, 5000)
  } catch (e) {
    feedbackError.value = e.response?.data?.message || 'Gagal mengirim feedback.'
  } finally { submittingFeedback.value = false }
}

const cancelFeedback = () => { showFeedbackForm.value = false; feedbackForm.value = { accuracy: null, comment: '' }; feedbackError.value = null }

const hasExistingNotes = computed(() => !!diagnosis.value?.user_notes)

const applyLocalNotesToStore = (notes) => {
  if (!diagnosisStore.currentDiagnosis) return

  if (diagnosisStore.currentDiagnosis.diagnosis) {
    diagnosisStore.currentDiagnosis.diagnosis.user_notes = notes
    return
  }

  diagnosisStore.currentDiagnosis.user_notes = notes
}

const normalizeNotes = (value) => {
  if (value === null || value === undefined) return ''
  return String(value).trim()
}

const openNotesModal = () => {
  notesForm.value.user_notes = diagnosis.value?.user_notes || ''
  notesError.value = null
  showNotesModal.value = true
}

const closeNotesModal = () => {
  showNotesModal.value = false
  notesForm.value = { user_notes: '' }
  notesError.value = null
}

const saveNotes = async () => {
  const cleaned = normalizeNotes(notesForm.value.user_notes)
  if (!cleaned) {
    notesError.value = 'Catatan tidak boleh kosong.'
    return
  }

  savingNotes.value = true
  notesError.value = null

  try {
    await diagnosisStore.updateDiagnosisNotes(route.params.id, cleaned)
    applyLocalNotesToStore(cleaned)
    closeNotesModal()
  } catch (e) {
    notesError.value = e.response?.data?.message || 'Gagal menyimpan catatan.'
  } finally {
    savingNotes.value = false
  }
}

const deleteNotes = async () => {
  deletingNotes.value = true
  notesError.value = null

  try {
    await diagnosisStore.deleteDiagnosisNotes(route.params.id)
    applyLocalNotesToStore(null)
    closeNotesModal()
  } catch (e) {
    notesError.value = e.response?.data?.message || 'Gagal menghapus catatan.'
  } finally {
    deletingNotes.value = false
  }
}

onMounted(() => { loadDetail() })
</script>

<style scoped>
a { text-decoration: none; }

.section-title { display: flex; align-items: center; gap: .625rem; font-size: 1rem; font-weight: 700; margin-bottom: 1.125rem; }
.section-icon { font-size: 1rem; }

.info-label { display: block; font-size: .75rem; font-weight: 600; color: var(--text-faint); text-transform: uppercase; letter-spacing: .05em; margin-bottom: .25rem; }
.info-value { font-size: .9375rem; color: var(--gray-800); font-weight: 500; }

/* Result box */
.result-box { background: var(--bg-subtle); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; }
.result-top { margin-bottom: .75rem; }
.result-disease { font-size: 1.25rem; font-weight: 700; color: var(--gray-900); margin: 0; }

.cf-label { font-size: .8125rem; color: var(--text-muted); }
.cf-pct { font-size: 1rem; font-weight: 700; }
.cf-pct--high   { color: #15803d; }
.cf-pct--medium { color: #c2410c; }
.cf-pct--low    { color: #b45309; }

.cf-badge { font-size: .7rem; font-weight: 700; padding: .2rem .5rem; border-radius: 9999px; }
.cf-badge--high   { background: #dcfce7; color: #15803d; }
.cf-badge--medium { background: #ffedd5; color: #c2410c; }
.cf-badge--low    { background: #fef9c3; color: #a16207; }

.cf-bar-track { height: 8px; background: var(--gray-200); border-radius: 9999px; overflow: hidden; }
.cf-bar-fill  { height: 100%; border-radius: 9999px; transition: width .6s ease; }
.cf-bar-labels { display: flex; justify-content: space-between; font-size: .7rem; color: var(--text-faint); margin-top: .25rem; }

/* Disease details */
.disease-details { display: flex; flex-direction: column; gap: .875rem; margin-top: 1rem; }
.detail-row  {}
.detail-title { font-size: .8125rem; font-weight: 700; color: var(--gray-700); margin-bottom: .25rem; }
.detail-title--amber { color: #b45309; }
.detail-title--green { color: #15803d; }
.detail-title--blue  { color: #1d4ed8; }
.detail-text { font-size: .875rem; color: var(--text-muted); line-height: 1.65; margin: 0; }

.recommendation-box {
  margin-top: 1rem; padding: 1rem;
  background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: var(--radius);
}
.recommendation-text { font-size: .875rem; color: #166534; line-height: 1.7; }

/* Possibilities */
.possibility-row { display: flex; align-items: center; gap: .875rem; padding: .75rem; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg-surface); }
.poss-rank { width: 32px; height: 32px; border-radius: var(--radius-sm); background: var(--bg-subtle); color: var(--text-muted); font-size: .8125rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.poss-name { font-size: .875rem; font-weight: 600; color: var(--gray-900); margin: 0 0 2px; }
.poss-solution { font-size: .775rem; color: var(--text-muted); margin: 0; }
.poss-pct { font-size: .8125rem; font-weight: 700; color: var(--primary); background: var(--primary-50); padding: .2rem .5rem; border-radius: 9999px; }

/* Symptoms used */
.symptoms-used-grid { display: grid; grid-template-columns: 1fr; gap: .5rem; }
@media (min-width: 640px) { .symptoms-used-grid { grid-template-columns: 1fr 1fr; } }
.symptom-used-item { display: flex; align-items: flex-start; gap: .625rem; padding: .625rem .75rem; background: var(--bg-subtle); border-radius: var(--radius-sm); }
.symptom-used-code { font-size: .7rem; font-weight: 700; color: var(--primary); font-family: monospace; flex-shrink: 0; margin-top: 2px; }
.symptom-used-desc { font-size: .8125rem; color: var(--gray-800); margin: 0 0 2px; }
.symptom-used-cf   { font-size: .75rem; color: var(--text-muted); margin: 0; }

/* Rating options */
.rating-option {
  display: inline-flex; align-items: center; gap: .375rem;
  padding: .5rem 1rem;
  border: 1.5px solid var(--border-strong);
  border-radius: var(--radius);
  font-size: .875rem; font-weight: 500;
  color: var(--gray-700);
  cursor: pointer;
  transition: all .15s;
  background: var(--bg-surface);
}
.rating-option:hover { border-color: var(--primary); background: var(--primary-50); color: var(--primary); }
.rating-option--selected { border-color: var(--primary); background: var(--primary-50); color: var(--primary); font-weight: 600; }

.relevant-card {
  display: flex; gap: .75rem; padding: .75rem; border: 1px solid var(--border);
  border-radius: var(--radius-sm); background: white; transition: all .2s;
}
.relevant-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: var(--shadow-sm); }
.relevant-img { width: 60px; height: 60px; border-radius: 6px; object-fit: cover; }
.relevant-content { flex: 1; min-width: 0; }
.relevant-title { font-size: .8125rem; font-weight: 700; color: var(--gray-900); margin: 0 0 2px; line-height: 1.4; }
.relevant-category { font-size: .7rem; color: var(--text-faint); margin: 0; }
.mini-badge { display: inline-block; font-size: .65rem; font-weight: 800; background: #fff7ed; color: #c2410c; padding: 1px 6px; border-radius: 4px; margin-bottom: 4px; border: 1px solid #ffedd5; }
</style>
