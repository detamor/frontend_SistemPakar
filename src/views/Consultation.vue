<template>
  <div class="min-h-screen">
    <!-- Hero -->
    <section aria-label="Konsultasi dengan pakar" class="pt-28 sm:pt-32 md:pt-36 pb-10 sm:pb-14 text-center relative overflow-hidden">
      <div class="absolute inset-0 -z-10" aria-hidden="true">
        <div class="absolute top-10 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-float"></div>
      </div>
      <div class="max-w-3xl mx-auto px-4">
        <router-link to="/" class="glass-btn glass-btn-secondary !text-xs mb-4 inline-flex">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          Kembali
        </router-link>
        <div class="text-4xl mb-3">💬</div>
        <h1 class="text-3xl sm:text-4xl font-bold text-white mb-2">Konsultasi dengan Pakar</h1>
        <p class="text-sm text-slate-400 leading-relaxed max-w-xl mx-auto">
          Konsultasi langsung dengan pakar tanaman hias via WhatsApp
        </p>
      </div>
    </section>

    <div class="max-w-2xl mx-auto px-4 sm:px-6 pb-16 space-y-6">
      <!-- Form Card -->
      <div class="glass-card-strong p-6 sm:p-8">
        <form @submit.prevent="handleConsultation" v-if="!loading || form.message">
          <!-- Diagnosis Reference -->
          <div v-if="diagnosisId" class="mb-6 glass-card p-4" style="border-left: 3px solid rgba(16,185,129,0.5);">
            <p class="text-sm text-slate-300">Diagnosis ID: <strong class="text-emerald-400">{{ diagnosisId }}</strong></p>
            <p class="text-xs text-slate-500 mt-1">Pakar akan melihat hasil diagnosis sebelumnya</p>
          </div>

          <!-- Step 1: Message -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style="background: linear-gradient(135deg,#10b981,#059669);">1</span>
              <div>
                <h2 class="text-sm font-bold text-white">Pesan Konsultasi</h2>
                <p class="text-xs text-slate-500">Jelaskan pertanyaan atau masalah Anda</p>
              </div>
            </div>
            <textarea id="message" v-model="form.message" rows="5"
              placeholder="Contoh: Tanaman saya sudah 2 minggu tidak tumbuh, daun mulai menguning..."
              required :disabled="loading" maxlength="1000" class="glass-input !rounded-lg"></textarea>
            <p class="text-xs text-slate-500 mt-1 text-right">{{ form.message.length }}/1000</p>
          </div>

          <!-- Step 2: PDF Upload -->
          <div class="mb-6">
            <div class="flex items-center gap-3 mb-4">
              <span class="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0" style="background: linear-gradient(135deg,#10b981,#059669);">2</span>
              <div>
                <h2 class="text-sm font-bold text-white">File PDF (Opsional)</h2>
                <p class="text-xs text-slate-500">Lampirkan PDF hasil diagnosis</p>
              </div>
            </div>
            <div class="glass-card p-5 text-center cursor-pointer hover:border-emerald-500/30 transition-all"
              :class="{ '!border-emerald-500/40': isDragging }"
              @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
              @drop.prevent="handleFileDrop" @click="() => pdfFileInput?.click()">
              <input type="file" id="pdfFile" ref="pdfFileInput" accept=".pdf" @change="handleFileSelect" class="hidden" :disabled="loading" />
              <div v-if="!pdfFile">
                <div class="text-3xl mb-2 opacity-50">📄</div>
                <p class="text-sm text-slate-300 font-medium">Klik atau drag & drop PDF</p>
                <p class="text-xs text-slate-500 mt-1">Format: PDF | Maks: 10MB</p>
              </div>
              <div v-else class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-2 min-w-0">
                  <span class="text-xl">📄</span>
                  <div class="min-w-0">
                    <p class="text-sm text-white font-medium truncate">{{ pdfFile.name }}</p>
                    <p class="text-xs text-slate-500">{{ formatFileSize(pdfFile.size) }}</p>
                  </div>
                </div>
                <button type="button" @click.stop="removeFile" class="text-red-400 hover:text-red-300 text-lg shrink-0">✕</button>
              </div>
            </div>
            <p v-if="pdfFile" class="text-xs text-emerald-400 mt-2">✓ File PDF siap dilampirkan</p>
            <p v-else class="text-xs text-slate-500 mt-2">💡 PDF akan dikirim ke pakar via WhatsApp</p>
          </div>

          <!-- Info -->
          <div class="glass-card p-4 mb-5 !text-xs text-slate-400 space-y-1">
            <h3 class="text-emerald-400 font-bold text-xs mb-2">📋 Informasi Penting:</h3>
            <p>• Pakar akan menghubungi via WhatsApp (1-2 jam kerja)</p>
            <p>• Pastikan nomor WhatsApp Anda aktif</p>
            <p>• PDF membantu pakar memahami kondisi tanaman</p>
          </div>

          <div v-if="error" class="alert alert-danger !text-sm mb-4">{{ error }}</div>
          <div v-if="success" class="alert alert-success !text-sm mb-4">{{ success }}</div>

          <button type="submit" :disabled="loading || !form.message.trim()" class="glass-btn glass-btn-primary w-full !py-3">
            <span v-if="loading" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            {{ loading ? 'Mengirim...' : '📤 Kirim Konsultasi' }}
          </button>
        </form>

        <div v-if="loading && !form.message" class="text-center py-8">
          <div class="loading-spinner mx-auto mb-3" style="width:32px;height:32px;border-width:4px;"></div>
          <p class="text-slate-400 text-sm">Memproses...</p>
        </div>
      </div>

      <!-- History -->
      <div class="glass-card-strong p-6 sm:p-8">
        <h2 class="text-lg font-bold text-white mb-4">Riwayat Konsultasi</h2>
        <div v-if="consultations.length === 0" class="text-center py-6">
          <div class="text-3xl mb-2 opacity-50">📭</div>
          <p class="text-sm text-slate-400">Belum ada konsultasi</p>
        </div>
        <div v-else class="space-y-4">
          <div v-for="c in consultations" :key="c.id" class="glass-card p-4 space-y-2">
            <div class="flex items-center justify-between gap-2 flex-wrap">
              <span class="text-xs text-slate-500">{{ formatDate(c.created_at) }}</span>
              <span class="glass-badge !text-xs"
                :class="{ '!bg-emerald-500/15 !text-emerald-300 !border-emerald-500/30': c.status === 'responded',
                           '!bg-amber-500/15 !text-amber-300 !border-amber-500/30': c.status === 'pending' }">
                {{ getStatusText(c.status) }}
              </span>
            </div>
            <div><span class="text-xs text-slate-500">Pesan:</span><p class="text-sm text-slate-300 mt-0.5">{{ c.message }}</p></div>
            <div v-if="c.pdf_path" class="text-xs text-emerald-400">📎 PDF Terlampir</div>
            <div v-if="c.expert_response" class="p-3 rounded-lg" style="background: rgba(16,185,129,0.06); border: 1px solid rgba(16,185,129,0.15);">
              <span class="text-xs text-emerald-400 font-bold">Respon Pakar:</span>
              <p class="text-sm text-slate-300 mt-0.5">{{ c.expert_response }}</p>
            </div>
            <div v-if="c.diagnosis" class="text-xs text-slate-500">
              Diagnosis: {{ c.diagnosis.plant?.name }} - {{ c.diagnosis.disease?.name || 'Belum ada hasil' }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useConsultationStore } from '../stores/consultation'
import { useDiagnosisStore } from '../stores/diagnosis'

const route = useRoute()
const consultationStore = useConsultationStore()
const diagnosisStore = useDiagnosisStore()

const form = ref({ diagnosis_id: null, message: '' })
const pdfFile = ref(null)
const pdfFileInput = ref(null)
const isDragging = ref(false)
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const diagnosisId = computed(() => route.query.diagnosisId || route.state?.diagnosisId || null)
const consultations = computed(() => consultationStore.consultations?.data || [])

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.type !== 'application/pdf') { error.value = 'File harus berformat PDF'; return }
    if (file.size > 10 * 1024 * 1024) { error.value = 'Ukuran file maksimal 10MB'; return }
    pdfFile.value = file; error.value = null; success.value = null
  }
}

const handleFileDrop = (event) => {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  if (file) {
    if (file.type !== 'application/pdf') { error.value = 'File harus berformat PDF'; return }
    if (file.size > 10 * 1024 * 1024) { error.value = 'Ukuran file maksimal 10MB'; return }
    pdfFile.value = file; error.value = null; success.value = null
  }
}

const removeFile = () => { pdfFile.value = null; if (pdfFileInput.value) pdfFileInput.value.value = '' }
const formatFileSize = (bytes) => { if (bytes === 0) return '0 Bytes'; const k = 1024, sizes = ['Bytes', 'KB', 'MB']; const i = Math.floor(Math.log(bytes) / Math.log(k)); return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i] }

const handleConsultation = async () => {
  error.value = null; success.value = null; loading.value = true
  try {
    const consultationData = { message: form.value.message, diagnosis_id: diagnosisId.value ? parseInt(diagnosisId.value) : null }
    const createResponse = await consultationStore.create(consultationData)
    if (!createResponse.success) throw new Error(createResponse.message || 'Gagal membuat konsultasi')
    const consultationId = createResponse.data.id
    if (pdfFile.value) {
      try { await consultationStore.uploadPdf(consultationId, pdfFile.value) }
      catch (uploadError) { console.error('PDF upload error:', uploadError) }
    }
    // Send WhatsApp
    try { await consultationStore.sendWhatsApp(consultationId) }
    catch (waError) { console.error('WhatsApp error:', waError) }
    success.value = 'Konsultasi berhasil dikirim! Pakar akan menghubungi Anda via WhatsApp.'
    form.value.message = ''; pdfFile.value = null
    if (pdfFileInput.value) pdfFileInput.value.value = ''
    await consultationStore.fetchConsultations()
  } catch (err) {
    error.value = err.response?.data?.message || err.message || 'Gagal mengirim konsultasi'
  } finally { loading.value = false }
}

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })

const getStatusText = (status) => {
  const map = { pending: 'Menunggu', responded: 'Direspon', closed: 'Selesai' }
  return map[status] || status
}

onMounted(async () => {
  if (diagnosisId.value) form.value.diagnosis_id = parseInt(diagnosisId.value)
  try { await consultationStore.fetchConsultations() } catch (e) { console.error(e) }
})
</script>

<style scoped>
a { text-decoration: none !important; }
</style>
