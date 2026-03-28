import { defineStore } from 'pinia'
import api from '../services/api'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    // Users
    users: [],
    currentUser: null,

    // Education Modules
    educationModules: [],
    currentModule: null,

    // Knowledge Base
    plants: [],
    symptoms: [],
    diseases: [],
    currentPlant: null,
    currentSymptom: null,
    currentDisease: null,

    loading: false,
    error: null,

    // Stats
    quickStats: {
      totalUsers: 0,
      totalDiagnoses: 0,
      totalModules: 0,
      totalFeedbackComments: 0
    },
    topDiseases: [],
    monthlyTrend: [],
    feedbackDistribution: [],
    recentFeedbacks: [],
    recentEvaluationNotes: []
  }),

  actions: {
    // ========== DASHBOARD STATS ==========
    async fetchQuickStats() {
      try {
        const response = await api.get('/admin/stats/quick')
        if (response.data.success) {
          this.quickStats = response.data.data
        }
        return response.data
      } catch (error) {
        console.error('Error fetching quick stats:', error)
        throw error
      }
    },

    async fetchDiagnosisStats() {
      try {
        const response = await api.get('/admin/stats/diagnosis')
        if (response.data.success) {
          this.topDiseases = response.data.data.topDiseases
          this.monthlyTrend = response.data.data.monthlyTrend
          this.feedbackDistribution = response.data.data.feedbackStats
          const commentsPayload =
            response.data.data.recentFeedbacks ||
            response.data.data.feedbackComments ||
            []
          const notesPayload = response.data.data.recentEvaluationNotes || []

          this.recentFeedbacks = commentsPayload.filter(
            (item) => item?.comment && String(item.comment).trim().length > 0
          )
          this.recentEvaluationNotes = notesPayload.filter(
            (item) => item?.user_notes && String(item.user_notes).trim().length > 0
          )
        }
        return response.data
      } catch (error) {
        console.error('Error fetching diagnosis stats:', error)
        throw error
      }
    },
    // ========== USER MANAGEMENT ==========
    async fetchUsers(params = {}) {
      this.loading = true
      this.error = null
      try {
        const response = await api.get('/admin/users', { params })
        if (response.data.success) {
          this.users = response.data.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchUser(id) {
      this.loading = true
      try {
        const response = await api.get(`/admin/users/${id}`)
        if (response.data.success) {
          this.currentUser = response.data.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createUser(data) {
      this.error = null
      try {
        const response = await api.post('/admin/users', data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updateUser(id, data) {
      this.error = null
      try {
        const response = await api.put(`/admin/users/${id}`, data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deleteUser(id) {
      this.error = null
      try {
        const response = await api.delete(`/admin/users/${id}`)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    // ========== EDUCATION MODULES ==========
    async fetchEducationModules(params = {}) {
      this.loading = true
      try {
        const response = await api.get('/admin/education', { params })
        if (response.data.success) {
          this.educationModules = response.data.data.data || response.data.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchEducationModule(id) {
      this.error = null
      try {
        const response = await api.get(`/admin/education/${id}`)
        if (response.data.success) {
          this.currentModule = response.data.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async uploadEducationImage(file) {
      this.error = null
      try {
        const formData = new FormData()
        formData.append('image', file)

        // Biarkan browser set multipart boundary otomatis.
        const response = await api.post('/admin/education/upload-image', formData)

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async createEducationModule(data) {
      this.error = null
      try {
        const response = await api.post('/admin/education', data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updateEducationModule(id, data) {
      this.error = null
      try {
        const response = await api.put(`/admin/education/${id}`, data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deleteEducationModule(id) {
      this.error = null
      try {
        const response = await api.delete(`/admin/education/${id}`)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    // ========== PLANTS ==========
    async fetchPlants() {
      this.loading = true
      try {
        const response = await api.get('/admin/plants')
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

    async createPlant(data) {
      this.error = null
      try {
        const response = await api.post('/admin/plants', data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updatePlant(id, data) {
      this.error = null
      try {
        const response = await api.put(`/admin/plants/${id}`, data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deletePlant(id) {
      this.error = null
      try {
        const response = await api.delete(`/admin/plants/${id}`)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    // ========== SYMPTOMS ==========
    async fetchSymptoms() {
      this.loading = true
      try {
        const response = await api.get('/admin/symptoms')
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

    async createSymptom(data) {
      this.error = null
      try {
        const response = await api.post('/admin/symptoms', data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updateSymptom(id, data) {
      this.error = null
      try {
        const response = await api.put(`/admin/symptoms/${id}`, data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deleteSymptom(id) {
      this.error = null
      try {
        const response = await api.delete(`/admin/symptoms/${id}`)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    // ========== DISEASES ==========
    async fetchDiseases(params = {}) {
      this.loading = true
      try {
        const response = await api.get('/admin/diseases', { params })
        if (response.data.success) {
          this.diseases = response.data.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createDisease(data) {
      this.error = null
      try {
        const response = await api.post('/admin/diseases', data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updateDisease(id, data) {
      this.error = null
      try {
        const response = await api.put(`/admin/diseases/${id}`, data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deleteDisease(id) {
      this.error = null
      try {
        const response = await api.delete(`/admin/diseases/${id}`)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    }
  }
})


