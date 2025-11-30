<template>
  <div class="relative search-bar-container">
    <!-- Search Input -->
    <div class="relative">
      <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </div>
      <input
        type="text"
        v-model="searchQuery"
        @input="handleSearch"
        @focus="showResults = true"
        @blur="handleBlur"
        :placeholder="placeholder"
        :class="[
          'w-full pl-12 pr-10 text-base text-gray-800 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200',
          compact ? 'py-2' : 'py-2.5'
        ]"
      />
      <button
        v-if="searchQuery"
        @click="clearSearch"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Search Results Dropdown -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95 -translate-y-2"
      enter-to-class="opacity-100 scale-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100 translate-y-0"
      leave-to-class="opacity-0 scale-95 -translate-y-2"
    >
      <div
        v-if="showResults && (searchResults.length > 0 || searchQuery.length > 0)"
        class="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto"
        @mousedown.prevent
      >
        <!-- Loading State -->
        <div v-if="loading" class="p-4 text-center text-gray-600">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <p class="mt-2 text-sm">Mencari...</p>
        </div>

        <!-- No Results -->
        <div v-else-if="searchQuery && searchResults.length === 0" class="p-4 text-center text-gray-600">
          <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p class="text-sm font-medium">Tidak ada hasil ditemukan</p>
          <p class="text-xs text-gray-500 mt-1">Coba kata kunci lain</p>
        </div>

        <!-- Search Results -->
        <div v-else-if="searchResults.length > 0" class="py-2">
          <!-- Quick Actions -->
          <div v-if="quickActions.length > 0" class="px-4 py-2 border-b border-gray-100">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Aksi Cepat</p>
            <div class="space-y-1">
              <button
                v-for="action in quickActions"
                :key="action.label"
                @click="handleQuickAction(action)"
                class="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors text-left"
              >
                <span class="text-lg">{{ action.icon }}</span>
                <span>{{ action.label }}</span>
              </button>
            </div>
          </div>

          <!-- Results by Category -->
          <div v-for="(category, index) in groupedResults" :key="index" class="px-4 py-2">
            <p class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{{ category.title }}</p>
            <div class="space-y-1">
              <router-link
                v-for="item in category.items"
                :key="item.id"
                :to="item.route"
                @click="handleResultClick"
                class="flex items-center gap-3 px-3 py-2 text-sm text-gray-800 hover:bg-green-50 hover:text-green-700 rounded-lg transition-colors group"
              >
                <span class="text-lg">{{ item.icon }}</span>
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate">{{ item.title }}</p>
                  <p v-if="item.description" class="text-xs text-gray-500 truncate">{{ item.description }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400 group-hover:text-green-700 opacity-0 group-hover:opacity-100 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEducationStore } from '../stores/education'
import { useDiagnosisStore } from '../stores/diagnosis'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Cari penyakit, artikel, atau tanaman...'
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const educationStore = useEducationStore()
const diagnosisStore = useDiagnosisStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const showResults = ref(false)
const loading = ref(false)
const searchResults = ref([])
const preloading = ref(false)

// Quick actions based on search query
const quickActions = computed(() => {
  if (!searchQuery.value || searchQuery.value.length < 2) return []
  
  const query = searchQuery.value.toLowerCase()
  const actions = []
  
  if (query.includes('diagnosis') || query.includes('diagnosa')) {
    actions.push({
      label: 'Mulai Diagnosis',
      icon: '🔍',
      route: '/diagnosis'
    })
  }
  
  if (query.includes('edukasi') || query.includes('artikel') || query.includes('belajar')) {
    actions.push({
      label: 'Lihat Modul Edukasi',
      icon: '📚',
      route: '/education'
    })
  }
  
  if (query.includes('konsultasi') || query.includes('tanya')) {
    actions.push({
      label: 'Konsultasi dengan Pakar',
      icon: '💬',
      route: '/consultation'
    })
  }
  
  return actions
})

// Group results by category
const groupedResults = computed(() => {
  const groups = {}
  
  searchResults.value.forEach(item => {
    if (!groups[item.category]) {
      groups[item.category] = []
    }
    groups[item.category].push(item)
  })
  
  return Object.keys(groups).map(category => ({
    title: category,
    items: groups[category]
  }))
})

const getEducationModules = () => {
  if (!educationStore.modules) return []
  if (Array.isArray(educationStore.modules)) return educationStore.modules
  if (Array.isArray(educationStore.modules.data)) return educationStore.modules.data
  return []
}

const preloadData = async () => {
  if (preloading.value) return
  const needsPlants = diagnosisStore.plants.length === 0
  const moduleList = getEducationModules()
  const needsModules = authStore.isAuthenticated && moduleList.length === 0

  if (!needsPlants && !needsModules) return

  preloading.value = true
  try {
    const promises = []
    if (needsPlants) {
      promises.push(diagnosisStore.fetchPlants().catch(() => {}))
    }
    if (needsModules) {
      promises.push(educationStore.fetchModules().catch(() => {}))
    }
    await Promise.all(promises)
  } finally {
    preloading.value = false
  }
}

onMounted(() => {
  preloadData()
})

// Handle search input
const handleSearch = async () => {
  if (!searchQuery.value || searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  
  loading.value = true
  showResults.value = true
  
  try {
    // Simulate search - in real implementation, this would call API
    const results = await performSearch(searchQuery.value)
    searchResults.value = results
  } catch (error) {
    console.error('Search error:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// Perform search across different data sources
const performSearch = async (query) => {
  const results = []
  const lowerQuery = query.toLowerCase()
  
  // Search in education modules (if available)
  try {
    const modules = getEducationModules()
    if (modules.length > 0) {
      modules.forEach(module => {
        if (
          module.title?.toLowerCase().includes(lowerQuery) ||
          module.content?.toLowerCase().includes(lowerQuery) ||
          module.category?.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            id: `edu-${module.id}`,
            title: module.title,
            description: module.category,
            category: 'Modul Edukasi',
            icon: '📚',
            route: `/education/${module.id}`
          })
        }
      })
    }
  } catch (error) {
    console.error('Education search error:', error)
  }
  
  // Search in plants (if available)
  try {
    if (diagnosisStore.plants && diagnosisStore.plants.length > 0) {
      diagnosisStore.plants.forEach(plant => {
        if (
          plant.name?.toLowerCase().includes(lowerQuery) ||
          plant.scientific_name?.toLowerCase().includes(lowerQuery)
        ) {
          results.push({
            id: `plant-${plant.id}`,
            title: plant.name,
            description: plant.scientific_name || 'Tanaman Hias',
            category: 'Tanaman',
            icon: '🌱',
            route: `/diagnosis?plant=${plant.id}`
          })
        }
      })
    }
  } catch (error) {
    console.error('Plant search error:', error)
  }
  
  // Limit results
  return results.slice(0, 10)
}

// Handle blur with delay to allow click
const handleBlur = () => {
  setTimeout(() => {
    showResults.value = false
  }, 200)
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
  searchResults.value = []
  showResults.value = false
}

// Handle quick action click
const handleQuickAction = (action) => {
  router.push(action.route)
  clearSearch()
}

// Handle result click
const handleResultClick = () => {
  clearSearch()
}

// Watch for route changes to close search
watch(() => router.currentRoute.value.path, () => {
  clearSearch()
})

watch(
  () => authStore.isAuthenticated,
  (isLoggedIn) => {
    if (isLoggedIn) {
      preloadData()
    }
  }
)
</script>

<style scoped>
.search-bar-container {
  position: relative;
}

/* Custom scrollbar for results */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 0 0 12px 12px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #27ae60;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #229954;
}
</style>

