import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

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
    error: null
  }),

  actions: {
    // ========== USER MANAGEMENT ==========
    async fetchUsers(params = {}) {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(`${API_BASE_URL}/admin/users`, {
          params,
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(`${API_BASE_URL}/admin/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(`${API_BASE_URL}/admin/users`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updateUser(id, data) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.put(`${API_BASE_URL}/admin/users/${id}`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deleteUser(id) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.delete(`${API_BASE_URL}/admin/users/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(`${API_BASE_URL}/admin/education`, {
          params,
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (response.data.success) {
          this.educationModules = response.data.data
        }
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async createEducationModule(data) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const formData = new FormData()
        Object.keys(data).forEach(key => {
          if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key])
          }
        })
        const response = await axios.post(`${API_BASE_URL}/admin/education`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updateEducationModule(id, data) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const formData = new FormData()
        Object.keys(data).forEach(key => {
          if (data[key] !== null && data[key] !== undefined) {
            formData.append(key, data[key])
          }
        })
        const response = await axios.post(`${API_BASE_URL}/admin/education/${id}`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deleteEducationModule(id) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.delete(`${API_BASE_URL}/admin/education/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(`${API_BASE_URL}/admin/plants`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(`${API_BASE_URL}/admin/plants`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updatePlant(id, data) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.put(`${API_BASE_URL}/admin/plants/${id}`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deletePlant(id) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.delete(`${API_BASE_URL}/admin/plants/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(`${API_BASE_URL}/admin/symptoms`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(`${API_BASE_URL}/admin/symptoms`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updateSymptom(id, data) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.put(`${API_BASE_URL}/admin/symptoms/${id}`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deleteSymptom(id) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.delete(`${API_BASE_URL}/admin/symptoms/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(`${API_BASE_URL}/admin/diseases`, {
          params,
          headers: { 'Authorization': `Bearer ${token}` }
        })
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
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(`${API_BASE_URL}/admin/diseases`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async updateDisease(id, data) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.put(`${API_BASE_URL}/admin/diseases/${id}`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    async deleteDisease(id) {
      this.error = null
      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.delete(`${API_BASE_URL}/admin/diseases/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    }
  }
})


