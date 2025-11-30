<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import SearchBar from './components/SearchBar.vue'
import WhatsAppButton from './components/WhatsAppButton.vue'
import logoImage from './assets/logo-hydrangea.png'

const authStore = useAuthStore()
const route = useRoute()

const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

// Get user photo URL
const getUserPhotoUrl = (photoPath) => {
  if (!photoPath) return null
  // Laravel storage path
  if (photoPath.startsWith('http')) {
    return photoPath
  }
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${photoPath}`
}

// Expert WhatsApp number from environment
const expertWhatsApp = computed(() => {
  return import.meta.env.VITE_EXPERT_WHATSAPP_NUMBER || '6281234567890'
})

const handleLogout = async () => {
  await authStore.logout()
  userDropdownOpen.value = false
}

// Mobile menu state
const mobileMenuOpen = ref(false)
const userDropdownOpen = ref(false)
const showPrivacyPolicy = ref(false)
const showTerms = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  if (mobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}

const toggleUserDropdown = () => {
  userDropdownOpen.value = !userDropdownOpen.value
}

const closeUserDropdown = () => {
  userDropdownOpen.value = false
}

const handleMobileLogout = async () => {
  await handleLogout()
  closeMobileMenu()
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.user-dropdown-container')
  if (dropdown && !dropdown.contains(event.target)) {
    closeUserDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.body.style.overflow = ''
})

watch(
  () => route.fullPath,
  () => {
    closeMobileMenu()
    closeUserDropdown()
  }
)
</script>

<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <!-- Navigation Bar - Mobile First Approach -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <!-- Mobile First: Padding kecil untuk mobile, bertambah untuk layar lebih besar -->
      <div class="w-full px-3 sm:px-4 md:px-6 lg:px-12 xl:px-16 2xl:px-20">
        <div class="flex items-center justify-between h-14 sm:h-16 max-w-7xl mx-auto">
          
          <!-- Logo/Brand - Mobile First -->
          <RouterLink 
            to="/" 
            class="flex items-center gap-2 sm:gap-3 shrink-0 group px-1 sm:px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            @click="closeMobileMenu"
          >
            <!-- Icon - Responsive Size -->
            <div class="w-9 h-9 sm:w-10 sm:h-10 md:w-11 md:h-11 bg-green-600 rounded-lg sm:rounded-xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-200 shadow-md shrink-0 overflow-hidden">
              <img :src="logoImage" alt="System Pakar" class="w-full h-full object-cover rounded-lg sm:rounded-xl" />
            </div>
            <!-- Text - Hidden di mobile kecil, muncul di tablet ke atas -->
            <div class="hidden sm:block min-w-0">
              <div class="text-sm sm:text-base md:text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors duration-200 leading-tight">
                System Pakar
              </div>
              <div class="text-xs text-gray-500 leading-tight mt-0.5">
                Tanaman Hias Expert
              </div>
            </div>
          </RouterLink>

          <!-- Search Bar - Desktop -->
          <div class="hidden lg:flex items-center flex-1 max-w-md mx-4">
            <SearchBar placeholder="Cari penyakit, artikel, atau tanaman..." />
          </div>

          <!-- Desktop Navigation Links - Mobile First: Hidden di mobile, tampil di desktop -->
          <div class="hidden lg:flex items-center gap-2 xl:gap-3">
            <RouterLink 
              to="/" 
              class="relative px-4 py-2.5 text-base font-medium text-gray-800 rounded-lg hover:text-green-700 hover:bg-green-50 transition-all duration-200"
              :class="route.path === '/' ? 'text-green-700 bg-green-50 font-semibold' : ''"
            >
              <span class="relative z-10">Home</span>
              <span 
                v-if="route.path === '/'"
                class="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
              ></span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAuthenticated" 
              to="/diagnosis" 
              class="relative px-4 py-2.5 text-base font-medium text-gray-800 rounded-lg hover:text-green-700 hover:bg-green-50 transition-all duration-200"
              :class="route.path === '/diagnosis' ? 'text-green-700 bg-green-50 font-semibold' : ''"
            >
              <span class="relative z-10">Diagnosis</span>
              <span 
                v-if="route.path === '/diagnosis'"
                class="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
              ></span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAuthenticated" 
              to="/diagnosis/history" 
              class="relative px-4 py-2.5 text-base font-medium text-gray-800 rounded-lg hover:text-green-700 hover:bg-green-50 transition-all duration-200"
              :class="route.path === '/diagnosis/history' ? 'text-green-700 bg-green-50 font-semibold' : ''"
            >
              <span class="relative z-10">Riwayat</span>
              <span 
                v-if="route.path === '/diagnosis/history'"
                class="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
              ></span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAuthenticated" 
              to="/education" 
              class="relative px-4 py-2.5 text-base font-medium text-gray-800 rounded-lg hover:text-green-700 hover:bg-green-50 transition-all duration-200"
              :class="route.path === '/education' ? 'text-green-700 bg-green-50 font-semibold' : ''"
            >
              <span class="relative z-10">Edukasi</span>
              <span 
                v-if="route.path === '/education'"
                class="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
              ></span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAuthenticated" 
              to="/consultation" 
              class="relative px-4 py-2.5 text-base font-medium text-gray-800 rounded-lg hover:text-green-700 hover:bg-green-50 transition-all duration-200"
              :class="route.path === '/consultation' ? 'text-green-700 bg-green-50 font-semibold' : ''"
            >
              <span class="relative z-10">Konsultasi</span>
              <span 
                v-if="route.path === '/consultation'"
                class="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
              ></span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAdmin" 
              to="/admin" 
              class="relative px-4 py-2.5 text-base font-medium text-gray-800 rounded-lg hover:text-green-700 hover:bg-green-50 transition-all duration-200"
              :class="route.path.startsWith('/admin') ? 'text-green-700 bg-green-50 font-semibold' : ''"
            >
              <span class="relative z-10">Admin</span>
              <span 
                v-if="route.path.startsWith('/admin')"
                class="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
              ></span>
            </RouterLink>
            
            <RouterLink 
              to="/about" 
              class="relative px-4 py-2.5 text-base font-medium text-gray-800 rounded-lg hover:text-green-700 hover:bg-green-50 transition-all duration-200"
              :class="route.path === '/about' ? 'text-green-700 bg-green-50 font-semibold' : ''"
            >
              <span class="relative z-10">Tentang</span>
              <span 
                v-if="route.path === '/about'"
                class="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-t-full"
              ></span>
            </RouterLink>
          </div>

          <!-- Desktop User Actions - Hanya tampil di desktop/laptop -->
          <div class="hidden lg:flex items-center gap-3 shrink-0">
            <template v-if="!isAuthenticated">
              <RouterLink 
                to="/login" 
                class="px-5 py-2.5 text-base font-semibold text-gray-800 hover:text-green-700 transition-colors duration-200 rounded-lg hover:bg-green-50"
              >
                Masuk
              </RouterLink>
              <RouterLink 
                to="/register" 
                class="px-5 py-2.5 text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:shadow-lg hover:bg-green-700 transition-all duration-200"
              >
                Daftar
              </RouterLink>
            </template>
            
            <template v-else>
              <!-- User Dropdown -->
              <div class="relative user-dropdown-container">
                <button 
                  @click="toggleUserDropdown"
                  class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 group"
                >
                  <div class="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-base shadow-md group-hover:shadow-lg transition-shadow duration-200 shrink-0 overflow-hidden">
                    <img 
                      v-if="user?.photo && getUserPhotoUrl(user.photo)" 
                      :src="getUserPhotoUrl(user.photo)" 
                      :alt="user?.name || 'User'"
                      class="w-full h-full object-cover"
                    />
                    <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                  </div>
                  <div class="flex flex-col text-left min-w-0 max-w-[140px]">
                    <span class="text-sm font-semibold text-gray-900 truncate leading-tight">
                      {{ user?.name || 'User' }}
                    </span>
                    <span v-if="isAdmin" class="text-xs text-green-700 font-medium leading-tight mt-0.5">Administrator</span>
                    <span v-else class="text-xs text-gray-600 leading-tight mt-0.5">Member</span>
                  </div>
                  <svg 
                    class="w-4 h-4 text-gray-400 transition-transform duration-200 shrink-0"
                    :class="userDropdownOpen ? 'rotate-180' : ''"
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                
                <!-- Dropdown Menu -->
                <Transition
                  enter-active-class="transition-all duration-200 ease-out"
                  enter-from-class="opacity-0 scale-95 -translate-y-2"
                  enter-to-class="opacity-100 scale-100 translate-y-0"
                  leave-active-class="transition-all duration-150 ease-in"
                  leave-from-class="opacity-100 scale-100 translate-y-0"
                  leave-to-class="opacity-0 scale-95 -translate-y-2"
                >
                  <div 
                    v-if="userDropdownOpen"
                    class="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                  >
                    <!-- User Info Header -->
                    <div class="p-4 bg-green-50 border-b border-green-200">
                      <div class="flex items-center gap-3">
                        <div class="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-lg shadow-md overflow-hidden">
                          <img 
                            v-if="user?.photo && getUserPhotoUrl(user.photo)" 
                            :src="getUserPhotoUrl(user.photo)" 
                            :alt="user?.name || 'User'"
                            class="w-full h-full object-cover"
                          />
                          <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                        </div>
                        <div class="flex-1 min-w-0">
                          <p class="text-base font-bold text-gray-900 truncate">
                            {{ user?.name || 'User' }}
                          </p>
                          <p class="text-sm text-gray-600 truncate">{{ user?.email || '' }}</p>
                          <span 
                            v-if="isAdmin" 
                            class="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-200 rounded-full"
                          >
                            Administrator
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Menu Items -->
                    <div class="py-2">
                      <RouterLink 
                        to="/profile" 
                        @click="closeUserDropdown"
                        class="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                      >
                        <div class="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors duration-200">
                          <svg class="w-5 h-5 text-gray-600 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                          </svg>
                        </div>
                        <span>Profil Saya</span>
                      </RouterLink>
                      
                      <RouterLink 
                        v-if="isAdmin"
                        to="/admin" 
                        @click="closeUserDropdown"
                        class="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 hover:bg-green-50 hover:text-green-700 transition-all duration-200 group"
                      >
                        <div class="w-9 h-9 rounded-lg bg-gray-100 group-hover:bg-green-100 flex items-center justify-center transition-colors duration-200">
                          <svg class="w-5 h-5 text-gray-600 group-hover:text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </div>
                        <span>Dashboard Admin</span>
                      </RouterLink>
                    </div>
                    
                    <div class="border-t border-gray-100 p-2">
                      <button 
                        @click="handleLogout" 
                        class="flex items-center gap-3 w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 group"
                      >
                        <div class="w-9 h-9 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors duration-200">
                          <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                          </svg>
                        </div>
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </template>
          </div>

          <!-- Mobile Menu Button - Mobile First: Tampil di mobile/tablet, hidden di desktop -->
          <button 
            @click="toggleMobileMenu" 
            class="lg:hidden p-2 sm:p-2.5 rounded-lg text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors duration-200"
            :aria-expanded="mobileMenuOpen"
            aria-label="Toggle menu"
          >
            <svg 
              class="w-6 h-6 transition-transform duration-300" 
              :class="mobileMenuOpen ? 'rotate-90' : ''"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                v-if="!mobileMenuOpen"
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
              <path 
                v-else
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu - Hanya tampil di mobile/tablet -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div 
          v-if="mobileMenuOpen" 
          class="lg:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
        >
          <div class="px-4 py-4 space-y-1">
            <!-- Mobile Search Bar -->
            <div class="mb-4">
              <SearchBar placeholder="Cari..." compact />
            </div>

            <!-- Mobile User Info -->
            <div v-if="isAuthenticated" class="mb-4 p-4 bg-green-50 rounded-xl border border-green-200">
              <div class="flex items-center gap-3">
                <div class="w-14 h-14 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-xl shadow-md overflow-hidden">
                  <img 
                    v-if="user?.photo && getUserPhotoUrl(user.photo)" 
                    :src="getUserPhotoUrl(user.photo)" 
                    :alt="user?.name || 'User'"
                    class="w-full h-full object-cover"
                  />
                  <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-base font-bold text-gray-900 truncate">{{ user?.name }}</p>
                  <p class="text-sm text-gray-600 truncate">{{ user?.email || '' }}</p>
                  <span 
                    v-if="isAdmin" 
                    class="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-green-700 bg-green-200 rounded-full"
                  >
                    Admin
                  </span>
                </div>
              </div>
            </div>

            <!-- Mobile Navigation Links -->
            <RouterLink 
              to="/" 
              class="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              :class="route.path === '/' ? 'bg-green-50 text-green-700 font-semibold' : ''"
              @click="closeMobileMenu"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="route.path === '/' ? 'bg-green-100' : 'bg-gray-100'">
                <span class="text-xl">🏠</span>
              </div>
              <span>Home</span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAuthenticated"
              to="/diagnosis" 
              class="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              :class="route.path === '/diagnosis' ? 'bg-green-50 text-green-700 font-semibold' : ''"
              @click="closeMobileMenu"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="route.path === '/diagnosis' ? 'bg-green-100' : 'bg-gray-100'">
                <span class="text-xl">🔍</span>
              </div>
              <span>Diagnosis</span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAuthenticated"
              to="/diagnosis/history" 
              class="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              :class="route.path === '/diagnosis/history' ? 'bg-green-50 text-green-700 font-semibold' : ''"
              @click="closeMobileMenu"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="route.path === '/diagnosis/history' ? 'bg-green-100' : 'bg-gray-100'">
                <span class="text-xl">📋</span>
              </div>
              <span>Riwayat</span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAuthenticated"
              to="/education" 
              class="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              :class="route.path === '/education' ? 'bg-green-50 text-green-700 font-semibold' : ''"
              @click="closeMobileMenu"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="route.path === '/education' ? 'bg-green-100' : 'bg-gray-100'">
                <span class="text-xl">📚</span>
              </div>
              <span>Edukasi</span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAuthenticated"
              to="/consultation" 
              class="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              :class="route.path === '/consultation' ? 'bg-green-50 text-green-700 font-semibold' : ''"
              @click="closeMobileMenu"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="route.path === '/consultation' ? 'bg-green-100' : 'bg-gray-100'">
                <span class="text-xl">💬</span>
              </div>
              <span>Konsultasi</span>
            </RouterLink>
            
            <RouterLink 
              v-if="isAdmin"
              to="/admin" 
              class="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              :class="route.path.startsWith('/admin') ? 'bg-green-50 text-green-700 font-semibold' : ''"
              @click="closeMobileMenu"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="route.path.startsWith('/admin') ? 'bg-green-100' : 'bg-gray-100'">
                <span class="text-xl">⚙️</span>
              </div>
              <span>Admin</span>
            </RouterLink>
            
            <RouterLink 
              to="/about" 
              class="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-800 rounded-lg hover:bg-green-50 hover:text-green-700 transition-all duration-200"
              :class="route.path === '/about' ? 'bg-green-50 text-green-700 font-semibold' : ''"
              @click="closeMobileMenu"
            >
              <div class="w-10 h-10 rounded-lg flex items-center justify-center" :class="route.path === '/about' ? 'bg-green-100' : 'bg-gray-100'">
                <span class="text-xl">ℹ️</span>
              </div>
              <span>Tentang</span>
            </RouterLink>

            <!-- Mobile Actions -->
            <div class="pt-4 mt-4 border-t border-gray-200 space-y-2">
              <template v-if="!isAuthenticated">
                <RouterLink 
                  to="/login" 
                  class="block w-full px-4 py-3 text-center text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-green-600 hover:text-green-600 transition-all duration-200"
                  @click="closeMobileMenu"
                >
                  Masuk
                </RouterLink>
                <RouterLink 
                  to="/register" 
                  class="block w-full px-4 py-3 text-center text-base font-semibold text-white bg-green-600 rounded-lg shadow-md hover:shadow-lg hover:bg-green-700 transition-all duration-200"
                  @click="closeMobileMenu"
                >
                  Daftar Sekarang
                </RouterLink>
              </template>
              <template v-else>
                <RouterLink 
                  to="/profile" 
                  class="block w-full px-4 py-3 text-center text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-green-50 hover:border-green-600 hover:text-green-600 transition-all duration-200"
                  @click="closeMobileMenu"
                >
                  Lihat Profil
                </RouterLink>
                <button 
                  @click="handleMobileLogout" 
                  class="block w-full px-4 py-3 text-center text-base font-semibold text-white bg-red-600 rounded-lg shadow-md hover:shadow-lg hover:bg-red-700 transition-all duration-200"
                >
                  Keluar
                </button>
              </template>
            </div>
          </div>
        </div>
      </Transition>
    </nav>

    <!-- Main Content with proper spacing for fixed navbar -->
    <main class="pt-14 sm:pt-16 min-h-screen">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t border-gray-200 mt-auto">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <!-- Brand Section -->
          <div class="space-y-3">
            <div class="flex items-center gap-2">
              <div class="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center shadow-sm overflow-hidden">
                <img :src="logoImage" alt="System Pakar" class="w-full h-full object-cover rounded-lg sm:rounded-xl" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">System Pakar</h3>
                <p class="text-xs text-gray-600">Tanaman Hias Expert</p>
              </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              Sistem pakar berbasis web untuk diagnosis penyakit tanaman hias dengan metode Certainty Factor.
            </p>
          </div>

          <!-- Quick Links -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Menu Utama</h4>
            <ul class="space-y-2">
              <li>
                <RouterLink to="/" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  Home
                </RouterLink>
              </li>
              <li v-if="isAuthenticated">
                <RouterLink to="/diagnosis" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  Diagnosis
                </RouterLink>
              </li>
              <li v-if="isAuthenticated">
                <RouterLink to="/education" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  Edukasi
                </RouterLink>
              </li>
              <li v-if="isAuthenticated">
                <RouterLink to="/consultation" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  Konsultasi
                </RouterLink>
              </li>
              <li>
                <RouterLink to="/about" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  Tentang
                </RouterLink>
              </li>
            </ul>
          </div>

          <!-- Contact Information -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Kontak</h4>
            <ul class="space-y-2.5">
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <a href="mailto:info@systempakar.com" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  info@systempakar.com
                </a>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
                <a :href="`https://wa.me/${expertWhatsApp}`" target="_blank" rel="noopener noreferrer" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  WhatsApp: {{ expertWhatsApp }}
                </a>
              </li>
              <li class="flex items-start gap-2">
                <svg class="w-4 h-4 text-green-600 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-sm text-gray-600">Indonesia</span>
              </li>
            </ul>
          </div>

          <!-- Legal & Information -->
          <div>
            <h4 class="text-sm font-semibold text-gray-900 mb-3">Legal & Informasi</h4>
            <ul class="space-y-2">
              <li>
                <a href="#privacy-policy" @click.prevent="showPrivacyPolicy = true" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a href="#terms" @click.prevent="showTerms = true" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  Ketentuan Layanan
                </a>
              </li>
              <li>
                <RouterLink to="/about" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  Tentang Kami
                </RouterLink>
              </li>
              <li>
                <a href="mailto:support@systempakar.com" class="text-sm text-gray-600 hover:text-green-700 transition-colors duration-200">
                  Bantuan & Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p class="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              © {{ new Date().getFullYear() }} System Pakar. All rights reserved.
            </p>
            <div class="flex items-center gap-3">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-green-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a 
                href="https://www.twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-green-600 transition-colors duration-200"
                aria-label="Twitter"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </a>
              <a 
                href="https://www.instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                class="text-gray-400 hover:text-green-600 transition-colors duration-200"
                aria-label="Instagram"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <!-- Privacy Policy Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showPrivacyPolicy" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click="showPrivacyPolicy = false"
      >
        <div 
          class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Kebijakan Privasi</h2>
            <button 
              @click="showPrivacyPolicy = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="px-6 py-4 text-sm text-gray-700 leading-relaxed space-y-4">
            <p><strong>Terakhir diperbarui:</strong> {{ new Date().toLocaleDateString('id-ID') }}</p>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">1. Informasi yang Kami Kumpulkan</h3>
              <p>Kami mengumpulkan informasi yang Anda berikan secara langsung saat menggunakan layanan kami, termasuk nama, email, dan informasi kontak lainnya.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">2. Penggunaan Informasi</h3>
              <p>Informasi yang kami kumpulkan digunakan untuk menyediakan, memelihara, dan meningkatkan layanan kami, serta untuk berkomunikasi dengan Anda.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">3. Perlindungan Data</h3>
              <p>Kami menggunakan langkah-langkah keamanan yang sesuai untuk melindungi informasi pribadi Anda dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">4. Cookie</h3>
              <p>Kami menggunakan cookie untuk meningkatkan pengalaman pengguna. Anda dapat mengatur browser untuk menolak cookie, namun hal ini dapat mempengaruhi fungsionalitas situs.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">5. Kontak</h3>
              <p>Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami di <a href="mailto:privacy@systempakar.com" class="text-green-600 hover:underline">privacy@systempakar.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Terms of Service Modal -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        v-if="showTerms" 
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click="showTerms = false"
      >
        <div 
          class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          @click.stop
        >
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
            <h2 class="text-xl font-bold text-gray-900">Ketentuan Layanan</h2>
            <button 
              @click="showTerms = false"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <div class="px-6 py-4 text-sm text-gray-700 leading-relaxed space-y-4">
            <p><strong>Terakhir diperbarui:</strong> {{ new Date().toLocaleDateString('id-ID') }}</p>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">1. Penerimaan Ketentuan</h3>
              <p>Dengan mengakses dan menggunakan System Pakar, Anda menerima dan setuju untuk terikat oleh ketentuan dan kondisi penggunaan ini.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">2. Penggunaan Layanan</h3>
              <p>Anda setuju untuk menggunakan layanan ini hanya untuk tujuan yang sah dan sesuai dengan ketentuan yang berlaku. Anda tidak diperbolehkan menggunakan layanan untuk tujuan ilegal atau melanggar hak orang lain.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">3. Akun Pengguna</h3>
              <p>Anda bertanggung jawab untuk menjaga kerahasiaan informasi akun Anda. Anda setuju untuk segera memberitahu kami tentang penggunaan yang tidak sah atas akun Anda.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">4. Batasan Tanggung Jawab</h3>
              <p>System Pakar disediakan "sebagaimana adanya". Kami tidak memberikan jaminan apapun mengenai keakuratan, kelengkapan, atau kegunaan informasi yang disediakan.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">5. Perubahan Ketentuan</h3>
              <p>Kami berhak mengubah ketentuan ini kapan saja. Perubahan akan diberitahukan melalui situs web atau email.</p>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">6. Kontak</h3>
              <p>Jika Anda memiliki pertanyaan tentang ketentuan layanan ini, silakan hubungi kami di <a href="mailto:legal@systempakar.com" class="text-green-600 hover:underline">legal@systempakar.com</a></p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Smooth scrolling behavior */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar for mobile menu */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #16a34a;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #15803d;
}
</style>
