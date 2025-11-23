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

        if (response.data.success) {
          this.currentDiagnosis = response.data.data
          // Redirect ke detail diagnosis
          router.push(`/diagnosis/${response.data.data.diagnosis.id}`)
        }

        return response.data
      } catch (error) {
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
    }
  }
})


