import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthStore } from './auth'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    loading: false,
    error: null
  }),

  actions: {
    // Update profile
    async updateProfile(data) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const formData = new FormData()
        
        formData.append('name', data.name || '')
        formData.append('email', data.email || '')
        formData.append('phone', data.phone || '')
        formData.append('bio', data.bio || '')
        if (data.photo) formData.append('photo', data.photo)

        const response = await axios.post(
          `${API_BASE_URL}/profile/update`,
          formData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        if (response.data.success) {
          // Update auth store user data
          const authStore = useAuthStore()
          authStore.user = response.data.data
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Change password
    async changePassword(data) {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.post(
          `${API_BASE_URL}/profile/change-password`,
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

    // Remove photo
    async removePhoto() {
      this.loading = true
      this.error = null

      try {
        const token = localStorage.getItem('auth_token')
        const response = await axios.delete(
          `${API_BASE_URL}/profile/photo`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        )

        if (response.data.success) {
          // Update auth store user data
          const authStore = useAuthStore()
          authStore.user = response.data.data
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


