<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section - Mobile-first design -->
    <div class="bg-linear-to-r from-green-600 to-green-700 text-white pt-20 pb-10 md:pt-24 md:pb-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Tombol Kembali -->
        <div class="mb-4">
          <router-link
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm font-medium"
          >
            <span>←</span>
            <span>Kembali ke Home</span>
          </router-link>
        </div>
        <div class="text-center max-w-4xl mx-auto">
          <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Diagnosis Penyakit Tanaman Hias
          </h1>
          <p class="text-base sm:text-lg md:text-xl text-green-50 leading-relaxed px-2">
            Pilih tanaman dan gejala untuk mendapatkan diagnosis berbasis metode Certainty Factor. Diagnosis cepat untuk membantu menentukan perawatan tanaman hias kamu.
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content - Mobile-first responsive layout -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
      <div class="bg-white rounded-xl p-8 md:p-10 lg:p-12 shadow-md">
        <!-- Error Message -->
        <div v-if="error" class="mb-6">
          <ErrorMessage
            :message="error"
            title="Gagal Memuat Data"
            dismissible
            @dismiss="error = null"
          />
        </div>

        <form @submit.prevent="handleDiagnosis" class="grid grid-cols-1 gap-8">
          <!-- Step 1: Pilih Tanaman -->
          <div class="grid grid-cols-1 gap-6 pb-8 border-b border-gray-200 last:border-b-0">
            <!-- Header -->
            <div class="flex items-start gap-5">
              <div class="w-14 h-14 bg-green-600 text-white rounded-lg flex items-center justify-center text-xl font-bold shrink-0">
                1
              </div>
              <div class="min-w-0">
                <h2 class="text-2xl md:text-3xl text-gray-900 mb-2 font-bold">
                  Pilih Tanaman
                </h2>
                <p class="text-base md:text-lg text-gray-600 leading-relaxed">
                  Pilih jenis tanaman hias yang ingin didiagnosis
                </p>
              </div>
            </div>
            <!-- Form -->
            <div class="grid grid-cols-1 gap-4">
              <label for="plant" class="flex items-center gap-3 text-gray-900 font-semibold text-lg">
                <img :src="logoImage" alt="Tanaman" class="w-8 h-8 object-contain rounded-lg" />
                <span>Jenis Tanaman Hias</span>
              </label>
              <select
                id="plant"
                v-model="form.plant_id"
                @change="onPlantChange"
                required
                :disabled="processing"
                class="w-full py-4 px-5 border-2 border-gray-300 rounded-lg text-lg font-medium bg-white text-gray-900 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">-- Pilih Tanaman --</option>
                <option
                  v-for="plant in plants"
                  :key="plant.id"
                  :value="plant.id"
                >
                  {{ plant.name }} <span v-if="plant.scientific_name">({{ plant.scientific_name }})</span>
                </option>
              </select>
            </div>
          </div>

          <!-- Step 2: Input Gejala dengan Dropdown -->
          <div class="grid grid-cols-1 gap-6 pb-8 border-b border-gray-200" v-if="form.plant_id">
            <div v-if="symptoms.length > 0" class="grid grid-cols-1 gap-6">
              <!-- Header -->
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-green-600 text-white rounded-lg flex items-center justify-center text-xl font-bold shrink-0">
                  2
                </div>
                <div class="min-w-0">
                  <h2 class="text-2xl md:text-3xl text-gray-900 mb-2 font-bold">
                    Pilih Gejala
                  </h2>
                  <p class="text-base md:text-lg text-gray-600 leading-relaxed">
                    Pilih satu atau lebih gejala yang muncul pada tanaman.
                  </p>
                </div>
              </div>

              <!-- Container Gejala yang Ditemukan -->
              <div class="grid grid-cols-1 gap-5">
                <label for="symptoms" class="flex items-center gap-3 text-gray-900 font-semibold text-lg">
                  <span class="text-2xl">🔬</span>
                  <span>Gejala yang Ditemukan</span>
                </label>
                
                <!-- Penjelasan singkat -->
                <p class="text-base text-gray-600 leading-relaxed">
                  Klik checkbox untuk memilih gejala, lalu pilih tingkat kepastian yang muncul di sampingnya.
                </p>
                
                <!-- Container terpadu - SATU TAMPILAN, DROPDOWN CF MUNCUL DI SAMPING SAAT DIKLIK -->
                <div class="border-2 border-gray-300 rounded-lg bg-white p-6">
                  <div class="max-h-[450px] overflow-y-auto space-y-3">
                    <div
                      v-for="symptom in symptoms"
                      :key="symptom.id"
                      class="flex items-center gap-4 p-3 rounded-lg transition-colors"
                      :class="selectedSymptoms.includes(symptom.id) ? 'bg-green-50' : 'hover:bg-gray-50'"
                    >
                      <!-- Checkbox untuk memilih gejala -->
                      <input
                        type="checkbox"
                        :id="`symptom-${symptom.id}`"
                        :value="symptom.id"
                        v-model="selectedSymptoms"
                        :disabled="processing"
                        class="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                      
                      <!-- Nama Gejala -->
                      <label
                        :for="`symptom-${symptom.id}`"
                        class="flex-1 text-base font-medium text-gray-900 cursor-pointer"
                        >
                          {{ symptom.code }} - {{ symptom.description }}
                      </label>

                      <!-- Dropdown CF - MUNCUL SAAT GEJALA DIPILIH -->
                            <select
                        v-if="selectedSymptoms.includes(symptom.id)"
                        v-model="symptomCFs[symptom.id]"
                        class="w-auto min-w-[240px] py-2.5 px-4 border border-gray-300 rounded-lg text-base font-medium bg-white text-gray-900 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 hover:border-green-400 transition-colors"
                              required
                        :disabled="processing || cfLevels.length === 0"
                        @click.stop
                            >
                        <option value="" v-if="cfLevels.length === 0">Memuat tingkat kepastian...</option>
                        <option value="" v-else>-- Pilih Tingkat Kepastian --</option>
                              <option
                                v-for="level in cfLevels"
                                :key="level.id"
                                :value="level.value"
                              >
                                {{ level.label }} ({{ (parseFloat(level.value) * 100).toFixed(0) }}%)
                              </option>
                            </select>
                          </div>
                        </div>
                  
                  <!-- Indikator ringan -->
                  <div v-if="selectedSymptoms.length > 0" class="mt-4 pt-4 border-t border-gray-200 text-base text-gray-700">
                    <span class="font-semibold">{{ selectedSymptoms.length }} gejala dipilih</span>
                  </div>
                </div>
              </div>

              <div v-if="selectedSymptoms.length === 0" class="flex items-start gap-4 bg-amber-50 text-amber-900 p-5 rounded-lg border-l-4 border-amber-500">
                <svg class="w-6 h-6 shrink-0 text-amber-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <p class="text-base leading-relaxed">
                  <span class="font-semibold">Perhatian:</span> Pilih minimal 1 gejala untuk melakukan diagnosis
                </p>
              </div>
            </div>
            
            <div v-else class="text-center py-12 px-4">
              <div class="text-5xl mb-4 opacity-50">🌿</div>
              <p class="text-base text-gray-700">Tidak ada gejala tersedia untuk tanaman ini.</p>
            </div>
          </div>

          <!-- Step 3: Catatan (Optional) -->
          <div class="grid grid-cols-1 gap-6 pb-6" v-if="form.plant_id">
            <!-- Header -->
            <div class="flex items-start gap-5">
              <div class="w-14 h-14 bg-green-600 text-white rounded-lg flex items-center justify-center text-xl font-bold shrink-0">
                3
              </div>
              <div class="min-w-0">
                <h2 class="text-2xl md:text-3xl text-gray-900 mb-2 font-bold">
                  Catatan Tambahan
                </h2>
                <p class="text-base md:text-lg text-gray-600 leading-relaxed">
                  Tambahkan informasi tambahan tentang kondisi tanaman (opsional)
                </p>
              </div>
            </div>
            <!-- Form -->
            <div class="grid grid-cols-1 gap-4">
              <label for="notes" class="flex items-center gap-3 text-gray-900 font-semibold text-lg">
                <span class="text-2xl">📝</span>
                <span>Catatan</span>
              </label>
              <textarea
                id="notes"
                v-model="form.user_notes"
                placeholder="Contoh: Tanaman sudah 2 minggu tidak tumbuh, kondisi lingkungan cukup lembab..."
                rows="6"
                :disabled="processing"
                class="w-full py-4 px-5 border-2 border-gray-300 rounded-lg text-lg font-medium resize-y leading-relaxed text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
              ></textarea>
              <p class="text-base text-gray-600 leading-relaxed">
                Informasi tambahan ini akan membantu sistem memberikan diagnosis yang lebih akurat dan tepat.
              </p>
            </div>
          </div>

          <!-- Validation Errors -->
          <div v-if="validationErrors.length > 0" class="mt-6">
            <ErrorMessage
              :errors="validationErrors"
              title="Periksa Form Anda"
              variant="warning"
            />
          </div>

          <!-- Submit Error -->
          <div v-if="submitError" class="mt-6">
            <ErrorMessage
              :message="submitError"
              title="Gagal Memproses Diagnosis"
              dismissible
              @dismiss="submitError = null"
            />
          </div>

          <!-- Submit Button -->
          <div class="grid grid-cols-1 gap-5 mt-10 pt-8 border-t border-gray-200">
            <div class="bg-green-50 border-l-4 border-green-600 p-5 rounded-r-lg">
              <p class="text-base text-gray-700 leading-relaxed">
                <span class="font-semibold text-gray-900">Siap untuk diagnosis?</span> Pastikan kamu telah memilih tanaman dan minimal 1 gejala dengan tingkat kepastian yang sudah ditentukan.
              </p>
            </div>
            <button
              type="submit"
              :disabled="processing || selectedSymptoms.length === 0 || !form.plant_id"
              class="w-full py-5 px-8 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg text-lg font-semibold cursor-pointer transition-colors duration-200 inline-flex items-center justify-center gap-3 hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
            >
              <LoadingSpinner v-if="processing" size="sm" />
              <span>{{ processing ? 'Memproses Diagnosis...' : 'Proses Diagnosis' }}</span>
            </button>
            <p class="text-base text-center text-gray-600 leading-relaxed">
              Proses diagnosis akan memakan waktu beberapa detik. Mohon tunggu...
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useDiagnosisStore } from '../stores/diagnosis'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import ErrorMessage from '../components/ErrorMessage.vue'
import { getSpecificErrorMessage } from '../utils/errorHandler'
import { validateDiagnosisForm } from '../utils/validation'
import axios from 'axios'
import logoImage from '../assets/logo-hydrangea.png'

// ============================================
// STORE & API CONFIG
// ============================================
const diagnosisStore = useDiagnosisStore()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

// ============================================
// REACTIVE STATE
// ============================================
const form = ref({
  plant_id: '',
  user_notes: ''
})

const selectedSymptoms = ref([])
const symptomCFs = ref({})
const processing = ref(false)
const error = ref(null)
const submitError = ref(null)
const validationErrors = ref([])

const plants = ref([])
const symptoms = ref([])
const cfLevels = ref([])

// ============================================
// COMPUTED PROPERTIES
// ============================================
const defaultCFLevel = computed(() => {
  return cfLevels.value.find(l => l.value === 0.6) || cfLevels.value[2] || { value: 0.6 }
})

const isFormValid = computed(() => {
  return form.value.plant_id && 
         selectedSymptoms.value.length > 0 && 
         selectedSymptoms.value.every(id => symptomCFs.value[id])
})

/**
 * Filter gejala yang belum dipilih untuk ditampilkan di dropdown
 */
const availableSymptoms = computed(() => {
  return symptoms.value.filter(symptom => !selectedSymptoms.value.includes(symptom.id))
})

// ============================================
// HELPER FUNCTIONS
// ============================================
/**
 * Get symptom name by ID
 */
const getSymptomName = (symptomId) => {
  const symptom = symptoms.value.find(s => s.id === symptomId)
  return symptom ? `${symptom.code} - ${symptom.description}` : `Gejala #${symptomId}`
}

/**
 * Clear all errors
 */
const clearErrors = () => {
  error.value = null
  submitError.value = null
  validationErrors.value = []
}

/**
 * Reset form data
 */
const resetForm = () => {
  selectedSymptoms.value = []
  symptomCFs.value = {}
  clearErrors()
}

// ============================================
// API FUNCTIONS
// ============================================
/**
 * Load CF Levels from API
 */
const fetchCFLevels = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/public/cf-levels`)
    console.log('CF Levels API Response:', response.data)
    
    if (response.data.success && response.data.data) {
      cfLevels.value = response.data.data
        .filter(level => level.is_active !== false)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
      
      console.log('CF Levels loaded:', cfLevels.value)
      
      // Jika tidak ada data, gunakan fallback
      if (cfLevels.value.length === 0) {
        console.warn('No CF levels data from API, using fallback')
        throw new Error('No CF levels data')
      }
    } else {
      console.warn('Invalid response format, using fallback')
      throw new Error('Invalid response format')
    }
  } catch (err) {
    console.error('Error fetching CF levels:', err)
    // Fallback to default values
    cfLevels.value = [
      { id: 1, label: 'Tidak Yakin', value: 0.0, order: 1 },
      { id: 2, label: 'Sedikit Yakin', value: 0.4, order: 2 },
      { id: 3, label: 'Cukup Yakin', value: 0.6, order: 3 },
      { id: 4, label: 'Yakin', value: 0.8, order: 4 },
      { id: 5, label: 'Sangat Yakin', value: 1.0, order: 5 }
    ]
    console.log('Using fallback CF levels:', cfLevels.value)
  }
}

/**
 * Load plants from store
 */
const loadPlants = async () => {
  try {
    await diagnosisStore.fetchPlants()
    plants.value = diagnosisStore.plants
    if (plants.value.length === 0) {
      error.value = 'Tidak ada tanaman tersedia. Silakan hubungi administrator.'
    }
  } catch (err) {
    error.value = getSpecificErrorMessage(err)
    console.error('Error loading plants:', err)
  }
}

/**
 * Load symptoms for selected plant
 */
const loadSymptoms = async (plantId) => {
  try {
    await diagnosisStore.fetchSymptoms(plantId)
    symptoms.value = diagnosisStore.symptoms
    resetForm()
  } catch (err) {
    error.value = getSpecificErrorMessage(err)
    console.error('Error loading symptoms:', err)
  }
}

// ============================================
// WATCHERS
// ============================================
/**
 * Watch selectedSymptoms - Auto initialize CF values
 */
watch(selectedSymptoms, (newSymptoms, oldSymptoms) => {
  // Initialize CF for newly selected symptoms
  newSymptoms.forEach(symptomId => {
    if (!symptomCFs.value[symptomId]) {
      symptomCFs.value[symptomId] = defaultCFLevel.value.value
    }
  })
  
  // Remove CF for unselected symptoms
  const oldSet = new Set(oldSymptoms || [])
  Object.keys(symptomCFs.value).forEach(symptomIdStr => {
    const symptomId = parseInt(symptomIdStr)
    if (!newSymptoms.includes(symptomId)) {
      delete symptomCFs.value[symptomId]
    }
  })
}, { deep: true })

/**
 * Watch plant_id change - Load symptoms
 */
watch(() => form.value.plant_id, async (newPlantId) => {
  if (newPlantId) {
    clearErrors()
    await loadSymptoms(newPlantId)
  } else {
    symptoms.value = []
    resetForm()
  }
})

// ============================================
// VALIDATION
// ============================================
/**
 * Validate form and set validation errors
 */
const validateForm = () => {
  validationErrors.value = validateDiagnosisForm(
    form.value,
    selectedSymptoms.value,
    symptomCFs.value
  )
  return validationErrors.value.length === 0
}

// ============================================
// EVENT HANDLERS
// ============================================
/**
 * Handle plant selection change
 */
const onPlantChange = () => {
  // Watcher akan handle loading symptoms
  // Function ini tetap ada untuk @change event
}

/**
 * Handle diagnosis submission
 */
const handleDiagnosis = async () => {
  clearErrors()
  
  if (!validateForm()) {
    return
  }

  processing.value = true

  try {
    const symptomsData = selectedSymptoms.value.map(symptomId => ({
      symptom_id: symptomId,
      user_cf: parseFloat(symptomCFs.value[symptomId]) || 0.5
    }))

    const diagnosisData = {
      plant_id: parseInt(form.value.plant_id),
      symptoms: symptomsData,
      user_notes: form.value.user_notes || null
    }

    await diagnosisStore.diagnose(diagnosisData)
    // Redirect handled by store
  } catch (err) {
    submitError.value = getSpecificErrorMessage(err)
    console.error('Diagnosis error:', err)
  } finally {
    processing.value = false
  }
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  clearErrors()
  await Promise.all([
    loadPlants(),
    fetchCFLevels()
  ])
})
</script>

<style scoped>
/* Custom styles untuk multiple select option yang terpilih */
select[multiple] option:checked {
  background: #27ae60 linear-gradient(0deg, #27ae60 0%, #27ae60 100%);
  color: white;
}
</style>
