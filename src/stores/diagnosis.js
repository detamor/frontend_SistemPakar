import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const useDiagnosisStore = defineStore('diagnosis', {
  state: () => ({
    plants: [],
    symptoms: [],
    currentDiagnosis: null,
    diagnosisHistory: [],
    loading: false,
    error: null
  }),

  actions: {
    // Get plants
    async fetchPlants() {
      this.loading = true
      this.error = null

      try {
        const response = await axios.get(`${API_BASE_URL}/public/plants`)
        if (response.data.success) {
          this.plants = response.data.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Get symptoms (optional: filter by plant_id)
    async fetchSymptoms(plantId = null) {
      this.loading = true
      this.error = null

      try {
        const params = plantId ? { plant_id: plantId } : {}
        const response = await axios.get(`${API_BASE_URL}/public/symptoms`, { params })
        if (response.data.success) {
          this.symptoms = response.data.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Process diagnosis
    async diagnose(data) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(
          `${API_BASE_URL}/diagnosis`,
          data,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        const payload = response.data || {}
        const body = payload.data || {}

        // Simpan payload jika tersedia agar UI bisa dipakai ulang.
        if (payload.success && body) {
          this.currentDiagnosis = body
        }

        // Beberapa response historis mengembalikan id di path berbeda.
        // Prioritaskan diagnosis_id explicit dari backend.
        let diagnosisId =
          payload?.diagnosis_id ??
          body?.diagnosis?.id ??
          body?.id ??
          body?.diagnosis_id ??
          null

        if (diagnosisId) {
          await router.push(`/diagnosis/${diagnosisId}`)
        }

        return response.data
      } catch (error) {
        // Kasus engine timeout/503: backend tetap sudah membuat diagnosis_id.
        // Redirect ke halaman detail supaya user tidak perlu submit ulang.
        const diagnosisIdFromError = error.response?.data?.diagnosis_id
        if (diagnosisIdFromError) {
          await router.push(`/diagnosis/${diagnosisIdFromError}`)
          return error.response.data
        }

        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Get diagnosis history
    async fetchHistory(page = 1) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(
          `${API_BASE_URL}/diagnosis/history`,
          {
            params: { page },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          this.diagnosisHistory = response.data.data
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Get diagnosis detail
    async fetchDetail(id) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(
          `${API_BASE_URL}/diagnosis/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          // Store data sesuai format dari backend
          // Backend mengembalikan: { success: true, data: { diagnosis, disease, plant, symptoms, certainty_value, recommendation, all_possibilities, matched_symptoms_count } }
          this.currentDiagnosis = response.data.data
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Download PDF
    async downloadPdf(id) {
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(
          `${API_BASE_URL}/diagnosis/${id}/pdf`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            responseType: 'blob'
          }
        )

        // Create blob and download
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `diagnosis-${id}.pdf`)
        document.body.appendChild(link)
        link.click()
        link.remove()

        return { success: true }
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    // Submit feedback
    async submitFeedback(diagnosisId, accuracy, comment = null) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(
          `${API_BASE_URL}/feedback`,
          {
            diagnosis_id: diagnosisId,
            accuracy: accuracy, // 'accurate', 'somewhat_accurate', 'inaccurate'
            comment: comment
          },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Get feedback for diagnosis
    async getFeedback(diagnosisId) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(
          `${API_BASE_URL}/feedback/diagnosis/${diagnosisId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        // Handle response - data bisa null jika belum ada feedback
        if (response.data.success) {
          return {
            success: true,
            data: response.data.data, // null jika belum ada
            has_feedback: response.data.has_feedback || false
          }
        }

        return response.data
      } catch (error) {
        // If 404, no feedback yet (untuk backward compatibility)
        if (error.response?.status === 404) {
          return { success: false, data: null, has_feedback: false }
        }
        // If 500 or other errors, log but return null (jangan throw error)
        if (error.response?.status === 500) {
          console.error('Error getting feedback:', error.response?.data)
          return { success: false, data: null, has_feedback: false, error: error.response?.data?.message }
        }
        // Untuk error lainnya, return success false tapi tidak throw
        console.error('Error getting feedback:', error)
        return { success: false, data: null, has_feedback: false, error: error.response?.data?.message || error.message }
      } finally {
        this.loading = false
      }
    },

    // Create / update user notes for diagnosis
    async updateDiagnosisNotes(diagnosisId, userNotes) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.put(
          `${API_BASE_URL}/diagnosis/${diagnosisId}/notes`,
          { user_notes: userNotes },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        )

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete user notes for diagnosis
    async deleteDiagnosisNotes(diagnosisId) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.delete(
          `${API_BASE_URL}/diagnosis/${diagnosisId}/notes`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    }
  }
})


