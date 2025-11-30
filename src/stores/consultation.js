import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const useConsultationStore = defineStore('consultation', {
  state: () => ({
    consultations: [],
    loading: false,
    error: null
  }),

  actions: {
    // Create consultation
    async create(data) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(
          `${API_BASE_URL}/consultation`,
          data,
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

    // Get consultations
    async fetchConsultations(page = 1) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(
          `${API_BASE_URL}/consultation`,
          {
            params: { page },
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          this.consultations = response.data.data
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Upload PDF untuk konsultasi
    async uploadPdf(consultationId, pdfFile) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const formData = new FormData()
        formData.append('consultation_id', consultationId)
        formData.append('pdf_file', pdfFile)

        const response = await axios.post(
          `${API_BASE_URL}/consultation/upload-pdf`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
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

    // Send consultation to WhatsApp dengan PDF
    async sendWhatsApp(consultationId, message = null) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(
          `${API_BASE_URL}/consultation/whatsapp`,
          {
            consultation_id: consultationId,
            message: message
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
    }
  }
})


