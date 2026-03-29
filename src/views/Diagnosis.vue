<template>
  <div class="diagnosis-page">
    <!-- Page Header (Unified Hero Style) -->
    <header class="edu-hero">
      <div class="hero-bg-leaf">🌿</div>
      <div class="hero-bg-leaf hero-bg-leaf--2">🍃</div>
      <div class="page-container">
        <div class="edu-hero-inner">
          <div class="hero-text">
            <span class="hero-eyebrow">Smart Diagnosis</span>
            <h1 class="edu-title">Diagnosis Penyakit</h1>
            <p class="edu-sub">Pilih tanaman dan gejala yang terlihat untuk mendapatkan diagnosis.</p>
          </div>
        </div>
      </div>
    </header>

    <!-- Form Section -->
    <div class="page-container" style="padding-bottom:5rem;max-width:860px;margin-top:-2.5rem;position:relative;z-index:20;">
      <form @submit.prevent="handleDiagnosis" class="diagnosis-form">

        <!-- Error global -->
        <div v-if="error" class="sp-alert sp-alert-danger animate-fade-in" role="alert" style="margin-bottom:1.5rem;">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {{ error }}
        </div>

        <!-- Step 1: Pilih Tanaman -->
        <div class="form-section sp-card">
          <div class="step-header">
            <div class="step-num">1</div>
            <div>
              <h2 class="step-title">Pilih Tanaman</h2>
              <p class="step-subtitle">Pilih jenis tanaman hias yang ingin didiagnosis</p>
            </div>
          </div>

          <div class="plants-grid">
            <button
              v-for="plant in plants" :key="plant.id"
              type="button"
              class="plant-card"
              :class="{ 'plant-card--selected': form.plant_id == plant.id }"
              @click="selectPlant(plant.id)"
              :disabled="processing"
            >
              <div class="plant-img-wrap">
                <img v-if="plant.image" :src="getImageUrl(plant.image)" :alt="plant.name" @error="handleImageError" class="plant-img" />
                <div v-else class="plant-img-fallback">
                  <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                </div>
              </div>
              <div class="plant-info">
                <p class="plant-name">{{ plant.name }}</p>
                <p v-if="plant.scientific_name" class="plant-sci">{{ plant.scientific_name }}</p>
              </div>
              <div v-if="form.plant_id == plant.id" class="plant-check">
                <svg width="12" height="12" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              </div>
            </button>
          </div>
        </div>

        <!-- Step 2: Pilih Gejala -->
        <div v-if="form.plant_id" class="form-section sp-card animate-fade-in">
          <div class="step-header">
            <div class="step-num">2</div>
            <div>
              <h2 class="step-title">Pilih Gejala</h2>
              <p class="step-subtitle">Centang gejala yang Anda amati, lalu tentukan tingkat keyakinan</p>
            </div>
          </div>

          <div v-if="symptoms.length > 0" class="symptoms-list">
            <div
              v-for="symptom in symptoms" :key="symptom.id"
              class="symptom-row"
              :class="{ 'symptom-row--selected': selectedSymptoms.includes(symptom.id) }"
              @click="toggleSymptom(symptom.id)"
            >
              <input
                type="checkbox"
                :id="`sym-${symptom.id}`"
                :value="symptom.id"
                v-model="selectedSymptoms"
                :disabled="processing"
                class="symptom-check"
                @click.stop
              />
              <label :for="`sym-${symptom.id}`" class="symptom-label" @click.stop>
                <span class="symptom-code">{{ symptom.code }}</span>
                {{ symptom.description }}
              </label>
              <select
                v-if="selectedSymptoms.includes(symptom.id)"
                v-model="symptomCFs[symptom.id]"
                class="glass-select symptom-cf-select"
                :disabled="processing || cfLevels.length === 0"
                @click.stop
                required
              >
                <option value="">-- Tingkat Keyakinan --</option>
                <option v-for="level in cfLevels" :key="level.id" :value="level.value">
                  {{ level.label }} ({{ (parseFloat(level.value) * 100).toFixed(0) }}%)
                </option>
              </select>
            </div>

            <div v-if="selectedSymptoms.length > 0" class="symptom-count">
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              {{ selectedSymptoms.length }} gejala dipilih
            </div>
          </div>

          <div v-else class="symptoms-empty">
            <p>Tidak ada gejala tersedia untuk tanaman ini.</p>
          </div>

          <div v-if="symptoms.length > 0 && selectedSymptoms.length === 0" class="sp-alert sp-alert-warning" style="margin-top:1rem;">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            Pilih minimal 1 gejala untuk melakukan diagnosis
          </div>
        </div>

        <!-- Step 3: Catatan -->
        <div v-if="form.plant_id" class="form-section sp-card animate-fade-in">
          <div class="step-header">
            <div class="step-num">3</div>
            <div>
              <h2 class="step-title">Catatan Tambahan <span style="font-weight:400;color:var(--text-muted);font-size:.875rem;">(opsional)</span></h2>
              <p class="step-subtitle">Isi jika gejala yang Anda alami belum ada di daftar pilihan.</p>
            </div>
          </div>
          <textarea
            id="notes"
            v-model="form.user_notes"
            placeholder="Contoh: Daun tampak bercak putih halus di bagian bawah yang belum ada di daftar."
            rows="3"
            :disabled="processing"
            class="glass-input"
            style="resize:vertical;"
          ></textarea>
        </div>

        <!-- Validation errors -->
        <div v-if="validationErrors.length > 0" class="sp-alert sp-alert-warning animate-fade-in">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <ul style="margin:0;padding-left:1rem;">
            <li v-for="(err, i) in validationErrors" :key="i" style="font-size:.875rem;">{{ err }}</li>
          </ul>
        </div>

        <div v-if="submitError" class="sp-alert sp-alert-danger animate-fade-in">
          <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <div>
            <p style="font-weight:600;margin-bottom:.25rem;">Gagal Memproses Diagnosis</p>
            <p style="margin:0;font-size:.875rem;">{{ submitError }}</p>
          </div>
          <button @click="submitError = null" style="margin-left:auto;background:none;border:none;cursor:pointer;color:inherit;padding:0;">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Submit -->
        <div v-if="form.plant_id" class="sp-card form-section submit-section animate-fade-in">
          <div class="submit-row">
            <button
              type="submit"
              :disabled="processing || selectedSymptoms.length === 0 || !form.plant_id"
              class="sp-btn sp-btn-primary sp-btn-lg submit-btn"
            >
              <span v-if="processing" class="sp-spinner" style="width:18px;height:18px;border-width:2px;border-color:rgba(255,255,255,.4);border-top-color:#fff;margin-right:.5rem;"></span>
              {{ processing ? 'Memproses Diagnosis...' : 'Proses Diagnosis' }}
            </button>
            <span v-if="selectedSymptoms.length > 0" style="font-size:.875rem;color:var(--text-muted);">{{ selectedSymptoms.length }} gejala dipilih</span>
          </div>
          <p style="font-size:.8rem;color:var(--text-faint);margin-top:.875rem;text-align:center;">
            Proses diagnosis memakan waktu beberapa detik. Hipotesis penyakit diurutkan menurut nilai CF;
            jika CF utama di bawah <strong>50%</strong>, sistem menampilkan <strong>peringatan diagnosis lemah</strong> namun hasil tetap lengkap.
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useDiagnosisStore } from '../stores/diagnosis'
import { getSpecificErrorMessage } from '../utils/errorHandler'
import { validateDiagnosisForm } from '../utils/validation'
import axios from 'axios'

const diagnosisStore = useDiagnosisStore()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

const form = ref({ plant_id: '', user_notes: '' })
const selectedSymptoms = ref([])
const symptomCFs = ref({})
const processing = ref(false)
const error = ref(null)
const submitError = ref(null)
const validationErrors = ref([])
const plants = ref([])
const symptoms = ref([])
const cfLevels = ref([])

const defaultCFLevel = computed(() => cfLevels.value.find(l => l.value === 0.6) || cfLevels.value[2] || { value: 0.6 })

const clearErrors  = () => { error.value = null; submitError.value = null; validationErrors.value = [] }
const resetForm    = () => { selectedSymptoms.value = []; symptomCFs.value = {}; clearErrors() }
const selectPlant  = (id) => { if (!processing.value) form.value.plant_id = id.toString() }
const toggleSymptom = (id) => {
  if (processing.value) return
  const idx = selectedSymptoms.value.indexOf(id)
  if (idx > -1) selectedSymptoms.value.splice(idx, 1)
  else selectedSymptoms.value.push(id)
}

const fetchCFLevels = async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}/public/cf-levels`)
    if (res.data.success && res.data.data) {
      cfLevels.value = res.data.data.filter(l => l.is_active !== false).sort((a,b) => (a.order||0)-(b.order||0))
      if (!cfLevels.value.length) throw new Error('empty')
    } else throw new Error('invalid')
  } catch {
    cfLevels.value = [
      { id:1, label:'Tidak Yakin',   value: 0.0, order:1 },
      { id:2, label:'Sedikit Yakin', value: 0.4, order:2 },
      { id:3, label:'Cukup Yakin',   value: 0.6, order:3 },
      { id:4, label:'Yakin',         value: 0.8, order:4 },
      { id:5, label:'Sangat Yakin',  value: 1.0, order:5 },
    ]
  }
}

const loadPlants = async () => {
  try { await diagnosisStore.fetchPlants(); plants.value = diagnosisStore.plants; if (!plants.value.length) error.value = 'Tidak ada tanaman tersedia.' }
  catch (err) { error.value = getSpecificErrorMessage(err) }
}

const loadSymptoms = async (plantId) => {
  try { await diagnosisStore.fetchSymptoms(plantId); symptoms.value = diagnosisStore.symptoms; resetForm() }
  catch (err) { error.value = getSpecificErrorMessage(err) }
}

watch(selectedSymptoms, (newS) => {
  newS.forEach(id => { if (!symptomCFs.value[id]) symptomCFs.value[id] = defaultCFLevel.value.value })
  Object.keys(symptomCFs.value).forEach(k => { if (!newS.includes(parseInt(k))) delete symptomCFs.value[k] })
}, { deep: true })

watch(() => form.value.plant_id, async (id) => {
  if (id) { clearErrors(); await loadSymptoms(id) } else { symptoms.value = []; resetForm() }
})

const validateForm = () => {
  validationErrors.value = validateDiagnosisForm(form.value, selectedSymptoms.value, symptomCFs.value)
  return !validationErrors.value.length
}

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) {
    if (path.includes('localhost') && !path.includes('localhost:')) return path.replace('localhost', 'localhost:8000')
    return path
  }
  const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
  const apiHost = apiBase.replace(/\/api\/?$/, '')
  return path.startsWith('/') ? `${apiHost}${path}` : `${apiHost}/${path}`
}

const handleImageError = (e) => {
  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="120" height="80"%3E%3Crect fill="%23f3f4f6" width="120" height="80"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="10" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3ETidak ada gambar%3C/text%3E%3C/svg%3E'
}

const handleDiagnosis = async () => {
  clearErrors()
  if (!validateForm()) return
  processing.value = true
  try {
    const normalizedNotes = normalizeUserNotes(form.value.user_notes)
    const symptomsData = selectedSymptoms.value.map(id => ({ symptom_id: id, user_cf: parseFloat(symptomCFs.value[id]) || 0.5 }))
    await diagnosisStore.diagnose({
      plant_id: parseInt(form.value.plant_id),
      symptoms: symptomsData,
      user_notes: normalizedNotes
    })
  } catch (err) { submitError.value = getSpecificErrorMessage(err) }
  finally { processing.value = false }
}

const normalizeUserNotes = (value) => {
  if (value === null || value === undefined) return null
  const cleaned = String(value).trim()
  return cleaned.length ? cleaned : null
}

onMounted(async () => { clearErrors(); await Promise.all([loadPlants(), fetchCFLevels()]) })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&display=swap');

.diagnosis-page {
  background-color: #f5f7f4;
  min-height: 100vh;
  font-family: 'DM Sans', sans-serif;
  color: #1e3a2a;
}

/* --- Hero Section (Education Theme) --- */
.edu-hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a3a2a 0%, #2d5a3d 60%, #3a7a50 100%);
  padding: 4rem 1.5rem 3.5rem;
  color: white;
}

.hero-bg-leaf {
  position: absolute;
  font-size: 8rem;
  opacity: .08;
  top: -1rem; right: -1rem;
  transform: rotate(20deg);
  pointer-events: none;
  user-select: none;
}
.hero-bg-leaf--2 {
  font-size: 5rem;
  top: auto; bottom: -1.5rem; left: -1rem; right: auto;
  transform: rotate(-30deg);
}

.page-container {
  max-width: 1100px;
  margin: 0 auto;
}

.edu-hero-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
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
  font-size: 2.75rem;
  font-weight: 400;
  color: #fff;
  margin: 0 0 .5rem;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.edu-sub {
  font-size: 1rem;
  color: rgba(255,255,255,.75);
  margin: 0;
}

.diagnosis-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-section   { padding: 1.75rem 1.5rem; }

/* Step header */
.step-header { display: flex; align-items: flex-start; gap: 1rem; margin-bottom: 1.75rem; }
.step-num {
  width: 34px; height: 34px; border-radius: 50%;
  background: #1a3a2a; color: #fff;
  font-weight: 700; font-size: 1rem;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(26, 58, 42, 0.2);
}
.step-title { font-size: 1.125rem; font-weight: 700; color: #1e3a2a; margin: 0 0 .25rem; }
.step-subtitle { font-size: .875rem; color: #6a8a72; margin: 0; }

/* Plants grid */
.plants-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}
@media (min-width: 480px) { .plants-grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 768px) { .plants-grid { grid-template-columns: repeat(4, 1fr); } }

.plant-card {
  position: relative;
  display: flex; flex-direction: column;
  border: 1.5px solid #edf2ed;
  border-radius: 16px;
  background: white;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: left;
  padding: 0;
  overflow: hidden;
  font-family: inherit;
  box-shadow: 0 2px 4px rgba(30, 58, 42, 0.04);
}
.plant-card:hover {
  border-color: #3a7a50;
  box-shadow: 0 8px 16px rgba(30, 58, 42, 0.08);
  transform: translateY(-2px);
}
.plant-card--selected {
  border-color: #1a3a2a !important;
  background: #f0fdf4 !important;
  box-shadow: 0 8px 16px rgba(26, 58, 42, 0.1) !important;
}
.plant-card:disabled { opacity: .6; cursor: not-allowed; }

.plant-img-wrap {
  width: 100%;
  aspect-ratio: 16/10;
  min-height: 140px;
  overflow: hidden;
  background: #e8f0e8;
  position: relative;
}
.plant-img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.plant-card:hover .plant-img { transform: scale(1.08); }

.plant-info { padding: .875rem; flex: 1; }
.plant-name { font-size: .9375rem; font-weight: 700; color: #1e3a2a; margin-bottom: 2px; }
.plant-sci  { font-size: .75rem; color: #6a8a72; font-style: italic; margin: 0; }

.plant-check {
  position: absolute; top: .625rem; right: .625rem;
  width: 24px; height: 24px; border-radius: 50%;
  background: #1a3a2a; color: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}

/* Symptoms */
.symptoms-list  { display: flex; flex-direction: column; gap: 0.25rem; max-height: 480px; overflow-y: auto; padding-right: .5rem; }
.symptoms-list::-webkit-scrollbar { width: 6px; }
.symptoms-list::-webkit-scrollbar-thumb { background: #d9e4d4; border-radius: 10px; }

.symptom-row {
  display: flex; align-items: center; flex-wrap: wrap; gap: .75rem;
  padding: .875rem;
  border: 1.5px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.symptom-row:hover { background: #f8faf9; border-color: #edf2ed; }
.symptom-row--selected { background: #f0fdf4; border-color: #d9e4d4; }

.symptom-check { width: 18px; height: 18px; accent-color: #1a3a2a; cursor: pointer; flex-shrink: 0; }
.symptom-label { flex: 1; font-size: .9375rem; color: #334e3d; cursor: pointer; min-width: 0; }
.symptom-code  { font-size: .8rem; font-weight: 700; color: #3a7a50; background: #e8f0e8; padding: 1px 6px; border-radius: 4px; margin-right: .5rem; }

.symptom-cf-select {
  width: auto !important;
  min-width: 220px;
  padding: .5rem 2.25rem .5rem .875rem !important;
  font-size: .875rem !important;
  background-color: white !important;
  border: 1.5px solid #d9e4d4 !important;
  border-radius: 10px !important;
  outline: none;
}
.symptom-cf-select:focus { border-color: #3a7a50; }

.symptom-count {
  display: flex; align-items: center; gap: .5rem;
  margin-top: 1rem; padding-top: 1rem;
  border-top: 1px solid #edf2ed;
  font-size: .875rem; font-weight: 700; color: #1a3a2a;
}

.symptoms-empty { text-align: center; padding: 3rem; color: #6a8a72; background: #f8faf9; border-radius: 16px; border: 1.5px dashed #d9e4d4; }

/* Submit */
.submit-section { background: #f0fdf4; border-color: #dcfce7; }
.submit-row { display: flex; align-items: center; gap: 1.25rem; flex-wrap: wrap; }
.submit-btn { flex: 1; min-width: 240px; }

/* Animations */
.animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>