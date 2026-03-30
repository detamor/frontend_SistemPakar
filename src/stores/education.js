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
    applyBookmarkStatusToModules(bookmarkedIds) {
      if (this.modules?.data && Array.isArray(this.modules.data)) {
        this.modules.data = this.modules.data.map((module) => ({
          ...module,
          is_bookmarked: bookmarkedIds.has(module.id)
        }))
      } else if (Array.isArray(this.modules)) {
        this.modules = this.modules.map((module) => ({
          ...module,
          is_bookmarked: bookmarkedIds.has(module.id)
        }))
      }
    },

    async syncBookmarksToModules() {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      try {
        const bookmarksResponse = await axios.get(
          `${API_BASE_URL}/education/bookmarks/my`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (bookmarksResponse.data.success) {
          const bookmarkedIds = new Set(
            (bookmarksResponse.data.data || []).map((b) => b.educational_module_id)
          )
          this.applyBookmarkStatusToModules(bookmarkedIds)
        }
      } catch (bookmarkError) {
        console.warn('Failed to sync bookmarks:', bookmarkError)
      }
    },

    // Get all modules
    async fetchModules(options = {}) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const params = { page: options.page || 1 }
        if (options.plantId) params.plant_id = options.plantId
        if (options.includeGeneral === false) params.include_general = 0
        if (options.search && String(options.search).trim()) params.search = String(options.search).trim()

        const response = await axios.get(
          `${API_BASE_URL}/education`,
          {
            params,
            headers: token ? { 'Authorization': `Bearer ${token}` } : undefined
          }
        )

        if (response.data.success) {
          const modules = response.data.data

          this.modules = modules
          await this.syncBookmarksToModules()
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
          this.currentModule.is_bookmarked = !!response.data.is_bookmarked
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
          await this.syncBookmarksToModules()
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
          await this.syncBookmarksToModules()
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
