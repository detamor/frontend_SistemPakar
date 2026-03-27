<template>
  <div class="admin-container">
    <div class="page-header">
      <div>
        <!-- Tombol Kembali -->
        <div class="mb-4">
          <router-link
            to="/"
            class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            <span>←</span>
            <span>Kembali ke Home</span>
          </router-link>
        </div>
        <h1>Tabel Certainty Factor Pakar</h1>
        <p class="subtitle">Kelola nilai CF untuk kombinasi Gejala x Penyakit</p>
      </div>
      <div class="header-actions">
        <div></div>
      </div>
    </div>

    <!-- Filter Tanaman -->
    <div class="filter-section">
      <div class="filter-section-stack">
        <label for="cf-plant-filter">Pilih tanaman</label>
        <select
          id="cf-plant-filter"
          v-model="selectedPlantId"
          @change="fetchMatrix"
          class="filter-select"
        >
          <option value="">Semua Tanaman</option>
          <option v-for="plant in plants" :key="plant.id" :value="plant.id">
            {{ plant.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading">
      Memuat tabel Certainty Factor...
    </div>

    <!-- Empty State: belum ada tanaman sama sekali -->
    <div v-else-if="matrixBlocks.length === 0" class="empty-state">
      <p>Belum ada tanaman di basis pengetahuan. Tambah tanaman terlebih dahulu, lalu penyakit dan gejala.</p>
      <div>
        <button @click="openDiseaseModal" class="btn-primary">
          Tambah Penyakit
        </button>
        <button @click="openSymptomModal" class="btn-primary">
          Tambah Gejala
        </button>
      </div>
    </div>

    <!-- Matrix Table: satu blok per tanaman saat "Semua Tanaman"; satu tabel saat tanaman dipilih -->
    <div v-else class="matrix-container">
      <div class="matrix-header">
        <h2>Tabel Certainty Factor (CF) Pakar</h2>
        <p v-if="cfFeedback" class="cf-feedback-banner" role="status">
          {{ cfFeedback }}
        </p>
        <p class="matrix-info">
          Tabel berikut menampilkan nilai Certainty Factor (CF) untuk setiap kombinasi gejala dan penyakit.
          Nilai CF berkisar dari 0.0 sampai 1.0.
          <template v-if="canEditCfMatrix">
            Klik pada sel untuk mengedit nilai CF.
          </template>
          <template v-else>
            <strong>Mode Semua Tanaman</strong> hanya untuk meninjau: nilai CF tidak dapat diubah di sini.
            Pilih <strong>satu tanaman</strong> pada dropdown di atas untuk mengisi atau mengubah CF.
          </template>
          <template v-if="!selectedPlantId">
            Setiap tanaman ditampilkan pada tabel terpisah di bawah.
          </template>
        </p>
      </div>

      <div
        v-for="block in matrixBlocks"
        :key="block.plant_id"
        class="cf-plant-block"
      >
        <h3 v-if="!selectedPlantId" class="cf-plant-block-title">
          {{ block.plant_name }}
        </h3>

        <div
          v-if="(!block.diseases || !block.diseases.length) && (!block.matrix || !block.matrix.length)"
          class="cf-block-empty"
        >
          <p>
            Belum ada penyakit dan gejala untuk tanaman
            <strong>{{ block.plant_name }}</strong>. Pilih tanaman di filter untuk menambah data.
          </p>
        </div>

        <template v-else>
          <div
            v-if="!block.diseases || !block.diseases.length"
            class="cf-block-warning"
          >
            <p>
              Belum ada penyakit untuk tanaman <strong>{{ block.plant_name }}</strong>.
              Gejala milik tanaman ini tetap ditampilkan di tabel. Tambah penyakit kembali untuk kolom CF.
            </p>
          </div>

          <div class="table-scroll-wrapper">
          <table class="cf-matrix-table">
            <thead>
              <tr>
                <th rowspan="1" class="sticky-col">No</th>
                <th rowspan="1" class="sticky-col">Kode Gejala</th>
                <th rowspan="1" class="sticky-col sticky-col-nama">Nama Gejala</th>
                <th v-for="disease in block.diseases" :key="disease.id" class="disease-header-cell">
                  {{ disease.code }}
                  <div class="disease-name">{{ disease.name }}</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="(!block.matrix || block.matrix.length === 0) && (block.diseases && block.diseases.length > 0)">
                <td class="sticky-col" style="text-align:center;">-</td>
                <td class="sticky-col" style="text-align:center;">-</td>
                <td class="sticky-col symptom-name">
                  Belum ada gejala. Silakan tambah gejala terlebih dahulu, lalu isi nilai CF.
                </td>
                <td v-for="d in block.diseases" :key="d.id" class="cf-cell" style="background:#fff;">
                  <span style="color:#94a3b8;font-size:.85rem;">-</span>
                </td>
              </tr>

              <tr
                v-else
                v-for="(row, rowIndex) in block.matrix"
                :key="`${block.plant_id}-${row.symptom_id}`"
              >
                <td class="sticky-col">{{ rowIndex + 1 }}</td>
                <td class="sticky-col">
                  <span class="code-badge">{{ row.symptom_code }}</span>
                </td>
                <td class="sticky-col symptom-name">{{ row.symptom_description }}</td>
                <td
                  v-for="diseaseCF in row.diseases"
                  :key="diseaseCF.disease_id"
                  class="cf-cell"
                  :class="{
                    'has-value': diseaseCF.certainty_factor > 0,
                    'cf-cell-readonly': !canEditCfMatrix
                  }"
                >
                  <input
                    v-if="canEditCfMatrix"
                    v-model.number="diseaseCF.certainty_factor"
                    type="number"
                    step="0.1"
                    min="0"
                    max="1"
                    placeholder="0.0"
                    class="cf-input-cell"
                    @focus="rememberCfBeforeEdit(row.symptom_id, diseaseCF.disease_id, diseaseCF)"
                    @blur="updateCFValue(row.symptom_id, diseaseCF.disease_id, diseaseCF)"
                  />
                  <span
                    v-else
                    class="cf-readonly-value"
                    title="Pilih satu tanaman di dropdown untuk mengubah nilai CF"
                  >{{ formatCfDisplay(diseaseCF.certainty_factor) }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        </template>
      </div>
      
      <!-- CRUD Penyakit -->
      <div v-if="!!selectedPlantId" class="symptom-crud-section">
        <div class="symptom-crud-header">
          <div>
            <h3 class="symptom-crud-title">CRUD Penyakit</h3>
            <p class="symptom-crud-subtitle">Edit dan hapus penyakit yang digunakan pada tabel Certainty Factor.</p>
          </div>
          <button type="button" @click="openDiseaseModal" class="btn-add symptom-crud-add-btn">
            + Tambah Penyakit
          </button>
        </div>

        <div v-if="diseasesLoading" class="loading">
          Memuat penyakit...
        </div>

        <div v-else-if="diseasesCrud.length === 0" class="empty-state">
          <p>Belum ada penyakit.</p>
          <button type="button" @click="openDiseaseModal" class="btn-primary">
            Tambah Penyakit
          </button>
        </div>

        <div v-else class="symptom-crud-table-wrap">
          <table class="symptom-crud-table">
            <thead>
              <tr>
                <th style="width: 120px;">Kode</th>
                <th>Nama</th>
                <th style="width: 180px;">Tanaman</th>
                <th style="width: 160px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="d in diseasesCrud" :key="d.id">
                <td><span class="code-badge">{{ d.code }}</span></td>
                <td>{{ d.name }}</td>
                <td>{{ d.plant?.name || '-' }}</td>
                <td>
                  <div class="symptom-crud-actions">
                    <button type="button" class="btn-mini btn-edit" @click="openDiseaseEdit(d)">
                      Edit
                    </button>
                    <button type="button" class="btn-mini btn-delete" @click="confirmDeleteDisease(d)">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- CRUD Gejala -->
      <div v-if="!!selectedPlantId" class="symptom-crud-section">
        <div class="symptom-crud-header">
          <div>
            <h3 class="symptom-crud-title">CRUD Gejala</h3>
            <p class="symptom-crud-subtitle">Edit dan hapus gejala yang digunakan pada tabel Certainty Factor.</p>
          </div>
          <button type="button" @click="openSymptomModal" class="btn-add symptom-crud-add-btn">
            + Tambah Gejala
          </button>
        </div>

        <div v-if="symptomsLoading" class="loading">
          Memuat gejala...
        </div>

        <div v-else-if="symptomsCrud.length === 0" class="empty-state">
          <p>Belum ada gejala.</p>
          <button type="button" @click="openSymptomModal" class="btn-primary">
            Tambah Gejala
          </button>
        </div>

        <div v-else class="symptom-crud-table-wrap">
          <table class="symptom-crud-table">
            <thead>
              <tr>
                <th style="width: 120px;">Kode</th>
                <th>Deskripsi</th>
                <th style="width: 180px;">Kategori</th>
                <th style="width: 160px;">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in symptomsCrud" :key="s.id">
                <td><span class="code-badge">{{ s.code }}</span></td>
                <td>{{ s.description }}</td>
                <td>{{ s.category || '-' }}</td>
                <td>
                  <div class="symptom-crud-actions">
                    <button type="button" class="btn-mini btn-edit" @click="openSymptomEdit(s)">
                      Edit
                    </button>
                    <button type="button" class="btn-mini btn-delete" @click="confirmDeleteSymptom(s)">
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Disease Modal -->
    <div v-if="showDiseaseModal" class="modal-overlay" @click="showDiseaseModal = false">
      <div class="modal-content large-modal" @click.stop>
        <div class="modal-header">
          <h2>{{ currentDisease ? 'Edit Penyakit' : 'Tambah Penyakit Baru' }}</h2>
          <button @click="closeDiseaseModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="saveDisease" class="form">
          <div class="form-row">
            <div class="form-group">
              <label>Nama Penyakit *</label>
              <input v-model="diseaseForm.name" type="text" required :disabled="saving" />
            </div>
            <div class="form-group">
              <label>Kode Penyakit *</label>
              <input v-model="diseaseForm.code" type="text" required :disabled="saving" />
              <small>Contoh: P01, P02, dll</small>
            </div>
          </div>

          <div class="form-group">
            <label>Tanaman *</label>
            <select v-model="diseaseForm.plant_id" :disabled="saving || !!selectedPlantId" required>
              <option value="">Pilih Tanaman</option>
              <option v-for="plant in plants" :key="plant.id" :value="plant.id">
                {{ plant.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Deskripsi</label>
            <textarea v-model="diseaseForm.description" rows="3" :disabled="saving"></textarea>
          </div>

          <div class="form-group">
            <label>Penyebab</label>
            <textarea v-model="diseaseForm.cause" rows="2" :disabled="saving"></textarea>
          </div>

          <div class="form-group">
            <label>Solusi</label>
            <textarea v-model="diseaseForm.solution" rows="3" :disabled="saving"></textarea>
          </div>

          <div class="form-group">
            <label>Pencegahan</label>
            <textarea v-model="diseaseForm.prevention" rows="2" :disabled="saving"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button type="button" @click="closeDiseaseModal" :disabled="saving" class="btn-cancel">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Add/Edit Symptom Modal -->
    <div v-if="showSymptomModal" class="modal-overlay" @click="showSymptomModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>{{ currentSymptom ? 'Edit Gejala' : 'Tambah Gejala Baru' }}</h2>
          <button @click="closeSymptomModal" class="btn-close">×</button>
        </div>

        <form @submit.prevent="saveSymptom" class="form">
          <p class="symptom-context">
            Tanaman dari filter: <strong>{{ selectedPlantName || '-' }}</strong>
          </p>
          <div class="form-row">
            <div class="form-group">
              <label>Kode Gejala *</label>
              <input v-model="symptomForm.code" type="text" required :disabled="saving" />
              <small>Contoh: G1, G2, dll</small>
            </div>
            <div class="form-group">
              <label>Kategori</label>
              <input
                v-model="symptomForm.category"
                type="text"
                :disabled="saving"
                placeholder="Opsional, contoh: daun, batang, atau teks lain"
              />
              <small>Kategori bebas (opsional); kosongkan bila tidak dipakai.</small>
            </div>
          </div>

          <div class="form-group">
            <label>Deskripsi Gejala *</label>
            <textarea v-model="symptomForm.description" rows="3" required :disabled="saving"></textarea>
          </div>

          <div class="form-actions">
            <button type="submit" :disabled="saving" class="btn-primary">
              {{ saving ? 'Menyimpan...' : 'Simpan' }}
            </button>
            <button type="button" @click="closeSymptomModal" :disabled="saving" class="btn-cancel">
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Symptom Modal -->
    <div
      v-if="showDeleteSymptomModal"
      class="modal-overlay"
      @click="showDeleteSymptomModal = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Hapus Gejala</h2>
          <button @click="showDeleteSymptomModal = false" class="btn-close">×</button>
        </div>

        <div class="delete-warning">
          <p>Apakah Anda yakin ingin menghapus gejala ini?</p>
          <p class="warning-text">Tindakan ini tidak dapat dibatalkan!</p>

          <div class="detail-item">
            <strong>Kode:</strong> {{ deleteSymptom?.code }}
          </div>
          <div class="detail-item">
            <strong>Deskripsi:</strong> {{ deleteSymptom?.description }}
          </div>
        </div>

        <div class="form-actions">
          <button
            type="button"
            :disabled="deletingSymptom"
            class="btn-delete-confirm"
            @click="deleteSymptomConfirm"
          >
            {{ deletingSymptom ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
          <button
            type="button"
            @click="showDeleteSymptomModal = false"
            :disabled="deletingSymptom"
            class="btn-cancel"
          >
            Batal
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Disease Modal -->
    <div
      v-if="showDeleteDiseaseModal"
      class="modal-overlay"
      @click="showDeleteDiseaseModal = false"
    >
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Hapus Penyakit</h2>
          <button @click="showDeleteDiseaseModal = false" class="btn-close">×</button>
        </div>

        <div class="delete-warning">
          <p>Apakah Anda yakin ingin menghapus penyakit ini?</p>
          <p class="warning-text">Tindakan ini tidak dapat dibatalkan!</p>

          <div class="detail-item">
            <strong>Kode:</strong> {{ deleteDisease?.code }}
          </div>
          <div class="detail-item">
            <strong>Nama:</strong> {{ deleteDisease?.name }}
          </div>
          <div class="detail-item">
            <strong>Tanaman:</strong> {{ deleteDisease?.plant?.name || deleteDisease?.plant_id || '-' }}
          </div>
        </div>

        <div class="form-actions">
          <button
            type="button"
            :disabled="deletingDisease"
            class="btn-delete-confirm"
            @click="deleteDiseaseConfirm"
          >
            {{ deletingDisease ? 'Menghapus...' : 'Ya, Hapus' }}
          </button>
          <button
            type="button"
            @click="showDeleteDiseaseModal = false"
            :disabled="deletingDisease"
            class="btn-cancel"
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

/** Satu entri per tanaman; saat filter tanaman aktif isinya satu blok. */
const matrixBlocks = ref([])
const plants = ref([])
const loading = ref(false)
const saving = ref(false)
const selectedPlantId = ref('')
const showDiseaseModal = ref(false)
const showSymptomModal = ref(false)
const currentDisease = ref(null)
const currentSymptom = ref(null)

const diseaseForm = ref({
  name: '',
  code: '',
  description: '',
  plant_id: '',
  cause: '',
  solution: '',
  prevention: ''
})

const symptomForm = ref({
  code: '',
  description: '',
  category: ''
})

const selectedPlantName = computed(() => {
  const id = selectedPlantId.value
  if (!id) return ''
  const found = plants.value.find(p => String(p.id) === String(id))
  return found?.name || ''
})

/** CF hanya boleh diubah jika filter menunjuk satu tanaman (bukan Semua Tanaman). */
const canEditCfMatrix = computed(() => !!selectedPlantId.value)

/** Pesan validasi CF (bukan alert) — tidak spam karena hanya satu banner + auto hilang. */
const cfFeedback = ref('')
let cfFeedbackTimer = null

function showCfFeedback (message) {
  cfFeedback.value = message
  if (cfFeedbackTimer) clearTimeout(cfFeedbackTimer)
  cfFeedbackTimer = setTimeout(() => {
    cfFeedback.value = ''
    cfFeedbackTimer = null
  }, 4500)
}

/** Nilai CF sebelum fokus sel ini — dipakai mengembalikan input jika tidak valid. */
const cfDraft = ref({ key: '', value: 0 })

function rememberCfBeforeEdit (symptomId, diseaseId, diseaseCF) {
  const v = diseaseCF?.certainty_factor
  const n = typeof v === 'number' ? v : parseFloat(v)
  cfDraft.value = {
    key: `${symptomId}-${diseaseId}`,
    value: Number.isNaN(n) ? 0 : n
  }
}

function formatCfDisplay (val) {
  if (val === null || val === undefined || val === '') return '0'
  const n = Number(val)
  if (Number.isNaN(n)) return String(val)
  return String(n)
}

const diseasesCrud = ref([])
const diseasesLoading = ref(false)

const showDeleteDiseaseModal = ref(false)
const deleteDisease = ref(null)
const deletingDisease = ref(false)

const symptomsCrud = ref([])
const symptomsLoading = ref(false)

const showDeleteSymptomModal = ref(false)
const deleteSymptom = ref(null)
const deletingSymptom = ref(false)

const getToken = () => localStorage.getItem('auth_token')

onMounted(() => {
  fetchPlants()
  fetchMatrix()
  fetchDiseasesCrud()
  fetchSymptomsCrud()
})

const fetchPlants = async () => {
  try {
    const response = await api.get(`${API_BASE_URL}/admin/plants`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    if (response.data.success) {
      plants.value = response.data.data
    }
  } catch (error) {
    console.error('Error fetching plants:', error)
  }
}

const fetchMatrix = async () => {
  loading.value = true
  try {
    const params = selectedPlantId.value ? { plant_id: selectedPlantId.value } : {}
    const response = await api.get(`${API_BASE_URL}/admin/cf-matrix`, {
      params,
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    
    if (response.data.success) {
      const d = response.data.data
      if (Array.isArray(d.blocks) && d.blocks.length > 0) {
        matrixBlocks.value = d.blocks.map((b) => ({
          plant_id: b.plant_id,
          plant_name: b.plant_name || '',
          diseases: Array.isArray(b.diseases) ? b.diseases : [],
          matrix: Array.isArray(b.matrix) ? b.matrix : [],
        }))
      } else if (Array.isArray(d.matrix) || Array.isArray(d.diseases)) {
        matrixBlocks.value = [
          {
            plant_id: selectedPlantId.value ? Number(selectedPlantId.value) : 0,
            plant_name: selectedPlantName.value || '',
            diseases: Array.isArray(d.diseases) ? d.diseases : [],
            matrix: Array.isArray(d.matrix) ? d.matrix : [],
          },
        ]
      } else {
        matrixBlocks.value = []
      }
      fetchDiseasesCrud()
      fetchSymptomsCrud()
    }
  } catch (error) {
    console.error('Error fetching matrix:', error)
    alert('Gagal memuat tabel Certainty Factor')
  } finally {
    loading.value = false
  }
}

const fetchSymptomsCrud = async () => {
  symptomsLoading.value = true
  try {
    // Tampilkan gejala yang relevan dengan tanaman (tanpa dropdown di modal)
    // Endpoint public sudah memfilter gejala berdasarkan relasi penyakit -> tanaman.
    if (!selectedPlantId.value) {
      symptomsCrud.value = []
      return
    }

    const response = await api.get(`${API_BASE_URL}/public/symptoms`, {
      params: { plant_id: selectedPlantId.value }
    })

    if (response.data.success) {
      const list = response.data.data || []
      symptomsCrud.value = Array.isArray(list)
        ? list.slice().sort((a, b) => String(a.code || '').localeCompare(String(b.code || '')))
        : []
    } else {
      symptomsCrud.value = []
    }
  } catch (error) {
    console.error('Error fetching symptoms for CF CRUD:', error)
    symptomsCrud.value = []
  } finally {
    symptomsLoading.value = false
  }
}

const fetchDiseasesCrud = async () => {
  diseasesLoading.value = true
  try {
    const params = selectedPlantId.value ? { plant_id: selectedPlantId.value } : {}
    const response = await api.get(`${API_BASE_URL}/admin/diseases`, {
      params,
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })

    if (response.data.success) {
      const list = response.data.data || []
      diseasesCrud.value = Array.isArray(list)
        ? list.slice().sort((a, b) => String(a.code || '').localeCompare(String(b.code || '')))
        : []
    } else {
      diseasesCrud.value = []
    }
  } catch (error) {
    console.error('Error fetching diseases for CF CRUD:', error)
    diseasesCrud.value = []
  } finally {
    diseasesLoading.value = false
  }
}

const updateCFValue = async (symptomId, diseaseId, diseaseCF) => {
  if (!diseaseCF) return

  const key = `${symptomId}-${diseaseId}`
  const raw = diseaseCF.certainty_factor

  if (raw === null || raw === undefined || raw === '') {
    diseaseCF.certainty_factor = cfDraft.value.key === key ? cfDraft.value.value : 0
    showCfFeedback('CF tidak boleh kosong. Nilai dikembalikan.')
    return
  }

  const cf = parseFloat(raw)
  if (Number.isNaN(cf) || cf < 0 || cf > 1) {
    diseaseCF.certainty_factor = cfDraft.value.key === key ? cfDraft.value.value : 0
    showCfFeedback('Nilai CF harus antara 0.0 dan 1.0. Nilai dikembalikan ke semula.')
    return
  }

  diseaseCF.certainty_factor = Math.round(cf * 100) / 100

  try {
    const response = await api.post(
      `${API_BASE_URL}/admin/cf-matrix/update`,
      {
        symptom_id: symptomId,
        disease_id: diseaseId,
        certainty_factor: diseaseCF.certainty_factor
      },
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (response.data.success) {
      cfDraft.value = { key, value: diseaseCF.certainty_factor }
    }
  } catch (error) {
    console.error('Error updating CF value:', error)
    showCfFeedback('Gagal menyimpan nilai CF. Tabel dimuat ulang.')
    fetchMatrix()
  }
}

const saveDisease = async () => {
  // Validasi form
  if (!diseaseForm.value.name || !diseaseForm.value.code || !diseaseForm.value.plant_id) {
    alert('Harap lengkapi field wajib (Nama, Kode, dan Tanaman)')
    return
  }

  saving.value = true
  try {
    const url = currentDisease.value
      ? `${API_BASE_URL}/admin/diseases/${currentDisease.value.id}`
      : `${API_BASE_URL}/admin/diseases`
    
    const method = currentDisease.value ? 'put' : 'post'
    const data = {
      name: diseaseForm.value.name.trim(),
      code: diseaseForm.value.code.trim(),
      description: diseaseForm.value.description?.trim() || null,
      plant_id: parseInt(diseaseForm.value.plant_id),
      cause: diseaseForm.value.cause?.trim() || null,
      solution: diseaseForm.value.solution?.trim() || null,
      prevention: diseaseForm.value.prevention?.trim() || null
    }
    
    const response = await axios[method](url, data, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert(response.data.message || 'Penyakit berhasil disimpan')
      closeDiseaseModal()
      fetchMatrix()
      fetchDiseasesCrud()
    }
  } catch (error) {
    console.error('Error saving disease:', error)
    let message = 'Gagal menyimpan penyakit'
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.values(errors).flat().join(', ')
      message = `Error: ${errorMessages}`
    } else if (error.response?.data?.message) {
      message = error.response.data.message
    }
    
    alert(message)
  } finally {
    saving.value = false
  }
}

const saveSymptom = async () => {
  const code = (symptomForm.value.code || '').trim()
  const description = (symptomForm.value.description || '').trim()
  const category = (symptomForm.value.category || '').trim() || null

  if (!code || !description) {
    alert('Kode dan Deskripsi Gejala wajib diisi.')
    return
  }

  saving.value = true
  try {
    const url = currentSymptom.value
      ? `${API_BASE_URL}/admin/symptoms/${currentSymptom.value.id}`
      : `${API_BASE_URL}/admin/symptoms`

    const method = currentSymptom.value ? 'put' : 'post'
    const data = {
      code,
      description,
      category,
      plant_id: selectedPlantId.value
        ? parseInt(String(selectedPlantId.value), 10)
        : null,
    }
    
    const response = await axios[method](url, data, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
        'Content-Type': 'application/json'
      }
    })

    if (response.data.success) {
      alert(response.data.message || 'Gejala berhasil disimpan')
      closeSymptomModal()
      fetchMatrix()
      fetchSymptomsCrud()
    }
  } catch (error) {
    console.error('Error saving symptom:', error)
    let message = 'Gagal menyimpan gejala'
    
    if (error.response?.data?.errors) {
      const errors = error.response.data.errors
      const errorMessages = Object.values(errors).flat().join(', ')
      message = `Error: ${errorMessages}`
    } else if (error.response?.data?.message) {
      message = error.response.data.message
    }
    
    alert(message)
  } finally {
    saving.value = false
  }
}

const ensurePlantSelected = () => {
  if (!selectedPlantId.value) {
    alert('Pilih tanaman terlebih dahulu pada filter sebelum menambah penyakit/gejala.')
    return false
  }
  return true
}

const openDiseaseModal = () => {
  if (!ensurePlantSelected()) return

  currentDisease.value = null
  diseaseForm.value = {
    name: '',
    code: '',
    description: '',
    plant_id: String(selectedPlantId.value),
    cause: '',
    solution: '',
    prevention: ''
  }
  showDiseaseModal.value = true
}

const openDiseaseEdit = async (disease) => {
  if (!disease) return

  const plantId = disease.plant_id || disease.plant?.id
  if (plantId) {
    // Pastikan filter CF mengikuti penyakit yang diedit (agar tabel CF relevan)
    selectedPlantId.value = String(plantId)
    await fetchMatrix()
  }

  currentDisease.value = disease

  diseaseForm.value = {
    name: disease.name || '',
    code: disease.code || '',
    description: disease.description || '',
    plant_id: disease.plant_id || disease.plant?.id || selectedPlantId.value,
    cause: disease.cause || '',
    solution: disease.solution || '',
    prevention: disease.prevention || ''
  }
  showDiseaseModal.value = true
}

const confirmDeleteDisease = (disease) => {
  deleteDisease.value = disease
  showDeleteDiseaseModal.value = true
}

const deleteDiseaseConfirm = async () => {
  if (!deleteDisease.value) return
  deletingDisease.value = true
  try {
    const response = await api.delete(
      `${API_BASE_URL}/admin/diseases/${deleteDisease.value.id}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }
    )

    if (response.data.success) {
      alert(response.data.message || 'Penyakit berhasil dihapus')
    } else {
      alert(response.data.message || 'Gagal menghapus penyakit')
    }
  } catch (error) {
    console.error('Error deleting disease:', error)
    alert('Gagal menghapus penyakit')
  } finally {
    deletingDisease.value = false
    showDeleteDiseaseModal.value = false
    deleteDisease.value = null
    fetchMatrix()
    fetchDiseasesCrud()
  }
}

const openSymptomModal = () => {
  if (!ensurePlantSelected()) return
  currentSymptom.value = null
  symptomForm.value = {
    code: '',
    description: '',
    category: ''
  }
  showSymptomModal.value = true
}

const openSymptomEdit = (symptom) => {
  if (!ensurePlantSelected()) return
  currentSymptom.value = symptom
  symptomForm.value = {
    code: symptom.code || '',
    description: symptom.description || '',
    category: symptom.category || ''
  }
  showSymptomModal.value = true
}

const confirmDeleteSymptom = (symptom) => {
  deleteSymptom.value = symptom
  showDeleteSymptomModal.value = true
}

const deleteSymptomConfirm = async () => {
  if (!deleteSymptom.value) return
  deletingSymptom.value = true
  try {
    const response = await api.delete(
      `${API_BASE_URL}/admin/symptoms/${deleteSymptom.value.id}`,
      {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }
    )

    if (response.data.success) {
      alert(response.data.message || 'Gejala berhasil dihapus')
    } else {
      alert(response.data.message || 'Gagal menghapus gejala')
    }
  } catch (error) {
    console.error('Error deleting symptom:', error)
    alert('Gagal menghapus gejala')
  } finally {
    deletingSymptom.value = false
    showDeleteSymptomModal.value = false
    deleteSymptom.value = null
    fetchMatrix()
    fetchSymptomsCrud()
  }
}

const closeDiseaseModal = () => {
  showDiseaseModal.value = false
  currentDisease.value = null
  diseaseForm.value = {
    name: '',
    code: '',
    description: '',
    plant_id: '',
    cause: '',
    solution: '',
    prevention: ''
  }
}

const closeSymptomModal = () => {
  showSymptomModal.value = false
  currentSymptom.value = null
  symptomForm.value = {
    code: '',
    description: '',
    category: ''
  }
}
</script>

<style scoped>
.admin-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #2c3e50;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-add {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
}

.btn-add:hover {
  background: #34495e;
}

.filter-section {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  width: 100%;
}

.filter-section-stack {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;
  max-width: 22rem;
  padding: 1rem 1.25rem 1.25rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.06);
}

.filter-section-stack label {
  font-weight: 600;
  color: #334155;
  font-size: 0.8125rem;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  text-align: center;
}

.filter-select {
  --select-chevron: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  padding: 0.7rem 2.65rem 0.7rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.9375rem;
  line-height: 1.4;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  background-color: #fff;
  color: #1e293b;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;
  appearance: none;
  -webkit-appearance: none;
  background-image: var(--select-chevron);
  background-repeat: no-repeat;
  background-position: right 0.65rem center;
  background-size: 1.15rem;
}

.filter-select:hover {
  border-color: #94a3b8;
}

.filter-select:focus {
  outline: none;
  border-color: #64748b;
  box-shadow:
    0 0 0 3px rgba(100, 116, 139, 0.18),
    0 1px 2px rgba(15, 23, 42, 0.05);
}

.matrix-container {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.matrix-header {
  margin-bottom: 1.5rem;
}

.matrix-header h2 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.cf-feedback-banner {
  margin: 0 0 0.75rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.875rem;
  line-height: 1.45;
  color: #92400e;
  background: #fffbeb;
  border: 1px solid #fcd34d;
  border-radius: 8px;
}

.matrix-info {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.6;
}

.cf-plant-block {
  margin-top: 2rem;
}

.cf-plant-block:first-of-type {
  margin-top: 0;
}

.cf-plant-block-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 0.75rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
}

.cf-block-empty {
  padding: 1.1rem 1.25rem;
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.5;
}

.cf-block-warning {
  padding: 0.9rem 1.1rem;
  margin-bottom: 0.75rem;
  background: #eff6ff;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  color: #1e3a5f;
  font-size: 0.9rem;
  line-height: 1.5;
}

.table-scroll-wrapper {
  overflow-x: auto;
  overflow-y: visible;
  max-width: 100%;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.cf-matrix-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  min-width: 800px;
}

.cf-matrix-table thead {
  background: #2c3e50;
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
}

.cf-matrix-table th {
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  border: 1px solid #34495e;
}

.disease-header-cell {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  min-width: 80px;
  max-width: 120px;
}

.disease-name {
  font-size: 0.75rem;
  font-weight: 400;
  margin-top: 0.5rem;
}

.sticky-col {
  position: sticky;
  background: white;
  z-index: 5;
}

.sticky-col:nth-child(1) {
  left: 0;
  background: #2c3e50;
  color: white;
  text-align: center;
  font-weight: 600;
}

.sticky-col:nth-child(2) {
  left: 60px;
  background: #34495e;
  color: white;
  text-align: center;
}

.sticky-col:nth-child(3) {
  left: 140px;
  background: #ecf0f1;
  font-weight: 500;
}

/* Kontras teks header & sel "Nama Gejala" (hindari teks putih di atas abu terang) */
.cf-matrix-table thead th.sticky-col-nama {
  background: #e2e8f0 !important;
  color: #0f172a !important;
  border-color: #cbd5e1;
}

.cf-matrix-table tbody td.sticky-col:nth-child(3),
.cf-matrix-table tbody td.symptom-name {
  color: #1e293b !important;
  background: #f8fafc !important;
}

.cf-matrix-table tbody tr {
  border-bottom: 1px solid #e0e0e0;
}

.cf-matrix-table tbody tr:hover {
  background: #f8f9fa;
}

.cf-matrix-table td {
  padding: 0.5rem;
  text-align: center;
  border: 1px solid #e0e0e0;
}

.symptom-name {
  text-align: left;
  padding-left: 1rem;
  font-size: 0.9rem;
  max-width: 250px;
}

.cf-cell {
  padding: 0.25rem;
  vertical-align: middle;
}

.cf-cell.has-value {
  background: #e8f5e9;
}

.cf-cell-readonly {
  background: #f1f5f9;
}

.cf-readonly-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  padding: 0.5rem 0.35rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: #fff;
  cursor: default;
  user-select: none;
}

.cf-input-cell {
  width: 70px;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
  font-size: 0.875rem;
  font-weight: 500;
}

.cf-input-cell:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.code-badge {
  background: #3498db;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 600;
  display: inline-block;
}

.loading, .empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.empty-state button {
  margin: 0.5rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.large-modal {
  max-width: 800px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  color: #2c3e50;
}

.btn-close {
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #999;
}

.btn-close:hover {
  color: #333;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #666;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.btn-primary {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover:not(:disabled) {
  background: #34495e;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-cancel:hover:not(:disabled) {
  background: #7f8c8d;
}

/* Symptom CRUD Section */
.symptom-crud-section {
  margin-top: 1.75rem;
  padding: 1.25rem;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
}

.symptom-crud-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.symptom-crud-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
  color: #2c3e50;
}

.symptom-crud-subtitle {
  margin: .25rem 0 0;
  font-size: 0.85rem;
  color: #666;
  line-height: 1.4;
}

.symptom-crud-add-btn {
  white-space: nowrap;
}

.symptom-crud-table-wrap {
  overflow-x: auto;
}

.symptom-crud-table {
  width: 100%;
  border-collapse: collapse;
}

.symptom-crud-table th {
  text-align: left;
  padding: 0.75rem;
  font-size: 0.85rem;
  background: #eef2f7;
  color: #334155;
  border: 1px solid #e5e7eb;
}

.symptom-crud-table td {
  padding: 0.75rem;
  font-size: 0.9rem;
  border: 1px solid #e5e7eb;
  vertical-align: top;
}

.symptom-crud-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-mini {
  padding: 0.35rem 0.65rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 700;
}

.btn-mini.btn-edit {
  background: #3498db;
  color: #fff;
}

.btn-mini.btn-delete {
  background: #e74c3c;
  color: #fff;
}

.btn-mini:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Delete Symptom Modal */
.delete-warning {
  margin-bottom: 1.25rem;
}

.delete-warning p {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
}

.warning-text {
  color: #e74c3c;
  font-weight: 800;
}

.detail-item {
  margin: 0.5rem 0;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  color: #2c3e50;
}

.btn-delete-confirm {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 800;
}

.btn-delete-confirm:hover:not(:disabled) {
  background: #c0392b;
}

.symptom-context {
  margin: 0 0 1rem 0;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
}
</style>