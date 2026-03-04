import { defineStore } from 'pinia'
import axios from 'axios'
import router from '../router'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.role === 'admin',
    isUser: (state) => state.user?.role === 'user'
  },

  actions: {
    // Set token dan user
    setAuth(token, user) {
      this.token = token
      this.user = user
      localStorage.setItem('auth_token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    // Clear auth
    clearAuth() {
      this.token = null
      this.user = null
      localStorage.removeItem('auth_token')
      delete axios.defaults.headers.common['Authorization']
    },

    // Register - Step 1: Request OTP via Email
    async register(data) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, data)
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Register - Step 2: Verify OTP via Email
    async verifyOtp(email, otpCode) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/verify-otp`, {
          email: email,
          otp_code: otpCode
        })

        if (response.data.success) {
          this.setAuth(response.data.data.token, response.data.data.user)
          router.push('/')
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Login
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password
        })

        if (response.data.success) {
          this.setAuth(response.data.data.token, response.data.data.user)
          
          // Redirect berdasarkan role
          if (response.data.data.user.role === 'admin') {
            router.push('/admin')
          } else {
            router.push('/')
          }
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Logout
    async logout() {
      this.loading = true

      try {
        if (this.token) {
          await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
            headers: {
              'Authorization': `Bearer ${this.token}`
            }
          })
        }
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.clearAuth()
        router.push('/login')
        this.loading = false
      }
    },

    // Request Password Reset OTP via Email
    async requestPasswordReset(email) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/password/reset`, {
          email: email
        })
        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Reset Password dengan OTP
    async resetPassword(email, otpCode, password, passwordConfirmation) {
      this.loading = true
      this.error = null

      try {
        const response = await axios.post(`${API_BASE_URL}/auth/password/verify`, {
          email: email,
          otp_code: otpCode,
          password: password,
          password_confirmation: passwordConfirmation
        })

        if (response.data.success) {
          router.push('/login')
        }

        return response.data
      } catch (error) {
        this.error = error.response?.data || error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    // Get current user
    async fetchUser() {
      if (!this.token) return

      try {
        const response = await axios.get(`${API_BASE_URL}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        })

        if (response.data.success) {
          this.user = response.data.data
        }
      } catch (error) {
        // Token invalid, clear auth
        if (error.response?.status === 401) {
          this.clearAuth()
          router.push('/login')
        }
      }
    },

    // Initialize auth from localStorage
    initAuth() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        // Fetch user in background, don't wait
        this.fetchUser().catch(() => {
          // If fetch fails, token might be invalid, clear it
          this.clearAuth()
        })
      }
    }
  }
})
