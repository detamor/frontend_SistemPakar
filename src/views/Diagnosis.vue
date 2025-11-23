<template>
  <div class="diagnosis-container">
    <div class="diagnosis-card">
      <h1>Diagnosis Penyakit Tanaman Hias</h1>
      <p class="subtitle">Pilih tanaman dan input gejala yang Anda amati</p>

      <form @submit.prevent="handleDiagnosis" v-if="!loading">
        <!-- Step 1: Pilih Tanaman -->
        <div class="form-section">
          <h2>1. Pilih Tanaman</h2>
          <div class="form-group">
            <label for="plant">Jenis Tanaman Hias</label>
            <select
              id="plant"
              v-model="form.plant_id"
              @change="onPlantChange"
              required
              :disabled="loading"
            >
              <option value="">-- Pilih Tanaman --</option>
              <option
                v-for="plant in plants"
                :key="plant.id"
                :value="plant.id"
              >
                {{ plant.name }}
              </option>
            </select>
          </div>
        </div>

        <!-- Step 2: Input Gejala -->
        <div class="form-section" v-if="form.plant_id && symptoms.length > 0">
          <h2>2. Input Gejala</h2>
          <p class="info-text">
            Pilih gejala yang Anda amati pada tanaman dan tentukan tingkat kepastian (0-100%)
          </p>

          <div class="symptoms-list">
            <div
              v-for="symptom in symptoms"
              :key="symptom.id"
              class="symptom-item"
            >
              <div class="symptom-header">
                <input
                  type="checkbox"
                  :id="`symptom-${symptom.id}`"
                  :value="symptom.id"
                  v-model="selectedSymptoms"
                  @change="onSymptomToggle(symptom.id)"
                />
                <label :for="`symptom-${symptom.id}`" class="symptom-label">
                  <strong>{{ symptom.code }}</strong> - {{ symptom.description }}
                </label>
              </div>
              
              <div v-if="isSymptomSelected(symptom.id)" class="symptom-cf">
                <CFSlider
                  v-model="symptomCFs[symptom.id]"
                  :label="`Tingkat Kepastian Gejala`"
                />
              </div>
            </div>
          </div>

          <div v-if="selectedSymptoms.length === 0" class="warning-message">
            Pilih minimal 1 gejala untuk melakukan diagnosis
          </div>
        </div>

        <!-- Step 3: Catatan (Optional) -->
        <div class="form-section" v-if="form.plant_id">
          <h2>3. Catatan (Opsional)</h2>
          <div class="form-group">
            <textarea
              v-model="form.user_notes"
              placeholder="Tambahkan catatan tambahan tentang kondisi tanaman..."
              rows="4"
              :disabled="loading"
            ></textarea>
          </div>
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading || selectedSymptoms.length === 0 || !form.plant_id"
          class="btn-primary"
        >
          {{ loading ? 'Memproses Diagnosis...' : 'Proses Diagnosis' }}
        </button>
      </form>

      <div v-if="loading && !form.plant_id" class="loading">
        Memuat data...
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useDiagnosisStore } from '../stores/diagnosis'
import CFSlider from '../components/CFSlider.vue'

const diagnosisStore = useDiagnosisStore()

const form = ref({
  plant_id: '',
  user_notes: ''
})

const selectedSymptoms = ref([])
const symptomCFs = ref({})
const loading = ref(false)
const error = ref(null)

const plants = ref([])
const symptoms = ref([])

// Load plants on mount
onMounted(async () => {
  loading.value = true
  try {
    await diagnosisStore.fetchPlants()
    plants.value = diagnosisStore.plants
  } catch (err) {
    error.value = 'Gagal memuat daftar tanaman'
  } finally {
    loading.value = false
  }
})

// Watch plant change
const onPlantChange = async () => {
  if (form.value.plant_id) {
    loading.value = true
    try {
      await diagnosisStore.fetchSymptoms(form.value.plant_id)
      symptoms.value = diagnosisStore.symptoms
      // Reset selected symptoms when plant changes
      selectedSymptoms.value = []
      symptomCFs.value = {}
    } catch (err) {
      error.value = 'Gagal memuat daftar gejala'
    } finally {
      loading.value = false
    }
  } else {
    symptoms.value = []
    selectedSymptoms.value = []
    symptomCFs.value = {}
  }
}

// Toggle symptom selection
const onSymptomToggle = (symptomId) => {
  if (selectedSymptoms.value.includes(symptomId)) {
    // Add default CF if not exists
    if (!symptomCFs.value[symptomId]) {
      symptomCFs.value[symptomId] = 0.5
    }
  } else {
    // Remove CF when unselected
    delete symptomCFs.value[symptomId]
  }
}

// Check if symptom is selected
const isSymptomSelected = (symptomId) => {
  return selectedSymptoms.value.includes(symptomId)
}

// Handle diagnosis
const handleDiagnosis = async () => {
  error.value = null
  loading.value = true

  // Prepare symptoms data
  const symptomsData = selectedSymptoms.value.map(symptomId => ({
    symptom_id: symptomId,
    user_cf: symptomCFs.value[symptomId] || 0.5
  }))

  const diagnosisData = {
    plant_id: parseInt(form.value.plant_id),
    symptoms: symptomsData,
    user_notes: form.value.user_notes || null
  }

  try {
    await diagnosisStore.diagnose(diagnosisData)
    // Redirect will be handled by store
  } catch (err) {
    error.value = err.response?.data?.message || 'Gagal melakukan diagnosis. Silakan coba lagi.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.diagnosis-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.diagnosis-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 2rem;
}

.subtitle {
  color: #666;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #eee;
}

.form-section:last-child {
  border-bottom: none;
}

.form-section h2 {
  font-size: 1.25rem;
  color: #333;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
}

.form-group select:disabled,
.form-group textarea:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.info-text {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

.symptoms-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.symptom-item {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.3s;
}

.symptom-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.symptom-header {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
}

.symptom-header input[type="checkbox"] {
  margin-top: 0.25rem;
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.symptom-label {
  flex: 1;
  cursor: pointer;
  color: #333;
  line-height: 1.5;
}

.symptom-label strong {
  color: #667eea;
}

.symptom-cf {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.warning-message {
  background: #fff3cd;
  color: #856404;
  padding: 1rem;
  border-radius: 6px;
  text-align: center;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 0.75rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  width: 100%;
  padding: 1rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 1.5rem;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>


