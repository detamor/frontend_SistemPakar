import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const useEducationStore = defineStore('education', {
  state: () => ({
    modules: [],
    currentModule: null,
    bookmarks: [],
    loading: false,
    error: null
  }),

  actions: {
    // Get all modules
    async fetchModules(category = null, page = 1) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const params = { page }
        if (category) params.category = category

        const response = await axios.get(
          `${API_BASE_URL}/education`,
          {
            params,
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          this.modules = response.data.data
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Get module detail
    async fetchDetail(id) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(
          `${API_BASE_URL}/education/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          this.currentModule = response.data.data
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Bookmark module
    async bookmark(id) {
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(
          `${API_BASE_URL}/education/${id}/bookmark`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          // Update current module bookmark status
          if (this.currentModule && this.currentModule.id === id) {
            this.currentModule.is_bookmarked = true
          }
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    // Unbookmark module
    async unbookmark(id) {
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.delete(
          `${API_BASE_URL}/education/${id}/bookmark`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          // Update current module bookmark status
          if (this.currentModule && this.currentModule.id === id) {
            this.currentModule.is_bookmarked = false
          }
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      }
    },

    // Get bookmarks
    async fetchBookmarks() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.get(
          `${API_BASE_URL}/education/bookmarks/my`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          this.bookmarks = response.data.data
        }

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


