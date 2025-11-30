<template>
  <div class="home-page pt-16">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-green-50 via-green-100 to-blue-50 overflow-hidden min-h-[75vh] flex items-center justify-center">
      <!-- Decorative Background Elements -->
      <div class="absolute inset-0 -z-10 overflow-hidden">
        <div class="absolute top-0 right-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-30"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
      </div>
      
      <!-- Background Image -->
      <div class="absolute inset-0 -z-10 opacity-10">
        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-full">
          <img :src="logoImage" alt="System Pakar Background" class="w-full h-full object-contain" />
        </div>
      </div>
      
      <div class="w-full py-16 md:py-20 flex justify-center relative z-10">
        <div class="w-full max-w-5xl px-4 sm:px-6 lg:px-8">
          <!-- Hero Content with Image -->
          <div class="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <!-- Left: Text Content -->
            <div class="flex-1 text-center lg:text-left">
              <!-- Badge -->
              <div class="inline-flex items-center gap-2 bg-white text-green-700 px-4 py-2.5 rounded-full text-sm font-semibold mb-6 shadow-md">
                <span>Sistem Pakar untuk Tanaman Hias</span>
              </div>
          
              <!-- Main Heading -->
              <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Diagnosis Penyakit Tanaman Hias
                <span class="block text-green-600 mt-2">dengan Akurat & Cepat</span>
              </h1>
              
              <!-- Subtitle -->
              <p class="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Sistem pakar berbasis web untuk membantu kamu mengidentifikasi penyakit tanaman hias dan mendapatkan solusi perawatan yang tepat.
              </p>
              
              <!-- CTA Buttons -->
              <div class="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start items-center mb-8">
                <router-link
                  v-if="!isAuthenticated"
                  to="/register"
                  class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 whitespace-nowrap shadow-md hover:shadow-lg"
                >
                  <span>Mulai Sekarang</span>
                </router-link>
                <router-link
                  v-if="!isAuthenticated"
                  to="/login"
                  class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-green-700 text-base font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors duration-200 whitespace-nowrap shadow-md"
                >
                  <span>Masuk</span>
                </router-link>
                <router-link
                  v-if="isAuthenticated"
                  to="/diagnosis"
                  class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white text-base font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 whitespace-nowrap shadow-md hover:shadow-lg"
                >
                  <span>Mulai Diagnosis</span>
                </router-link>
                <router-link
                  v-if="isAuthenticated"
                  to="/education"
                  class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-green-700 text-base font-semibold rounded-lg border-2 border-green-600 hover:bg-green-50 transition-colors duration-200 whitespace-nowrap shadow-md"
                >
                  <span>Pelajari Lebih Lanjut</span>
                </router-link>
              </div>
              
              <!-- Trust Indicators -->
              <div class="flex flex-wrap justify-center lg:justify-start items-center gap-6 text-sm md:text-base">
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="font-medium text-gray-700">Gratis</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="font-medium text-gray-700">Hasil Instan</span>
                </div>
                <div class="flex items-center gap-2">
                  <svg class="w-5 h-5 text-green-600 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="font-medium text-gray-700">Akurat</span>
                </div>
              </div>
            </div>
            
            <!-- Right: Image -->
            <div class="flex-1 flex justify-center lg:justify-end">
              <div class="relative w-full max-w-md lg:max-w-lg">
                <div class="relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-2xl border-4 border-green-200">
                  <img 
                    :src="logoImage" 
                    alt="System Pakar - Tanaman Hias" 
                    class="w-full h-auto object-contain rounded-xl"
                  />
                  <div class="absolute -bottom-4 -right-4 w-24 h-24 bg-green-500 rounded-full blur-2xl opacity-30 -z-10"></div>
                  <div class="absolute -top-4 -left-4 w-32 h-32 bg-blue-500 rounded-full blur-2xl opacity-20 -z-10"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 md:mb-16">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Fitur Unggulan
          </h2>
          <p class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Solusi lengkap untuk perawatan dan diagnosis tanaman hias kamu
          </p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          <!-- Feature 1: Diagnosis -->
          <div class="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-7 hover:border-green-400 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div class="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-5 shadow-sm">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Diagnosis Cepat & Akurat</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 grow">
              Identifikasi penyakit tanaman hias dengan metode Certainty Factor. Input gejala yang kamu amati dan dapatkan diagnosis beserta solusi dalam hitungan detik.
            </p>
            <router-link
              v-if="isAuthenticated"
              to="/diagnosis"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 mt-auto shadow-sm"
            >
              Coba Sekarang
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
          
          <!-- Feature 2: Education -->
          <div class="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-7 hover:border-green-400 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div class="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-5 shadow-sm">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Modul Edukasi</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 grow">
              Akses berbagai modul pembelajaran tentang perawatan tanaman hias, tips dan trik, serta panduan praktis untuk menjaga kesehatan tanaman kamu.
            </p>
            <router-link
              v-if="isAuthenticated"
              to="/education"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 mt-auto shadow-sm"
            >
              Pelajari Lebih Lanjut
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
          
          <!-- Feature 3: Consultation -->
          <div class="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-7 hover:border-green-400 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div class="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-5 shadow-sm">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Konsultasi Pakar</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 grow">
              Butuh bantuan lebih lanjut? Konsultasikan langsung dengan pakar tanaman hias melalui WhatsApp untuk mendapatkan solusi yang lebih spesifik.
            </p>
            <router-link
              v-if="isAuthenticated"
              to="/consultation"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200 mt-auto shadow-sm"
            >
              Konsultasi Sekarang
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
          
          <!-- Feature 4: History -->
          <div class="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-7 hover:border-green-400 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div class="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-5 shadow-sm">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Riwayat Diagnosis</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 grow">
              Simpan dan akses kembali semua hasil diagnosis kamu. Download laporan dalam format PDF untuk referensi di masa depan.
            </p>
            <router-link
              v-if="isAuthenticated"
              to="/diagnosis/history"
              class="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-green-600 text-sm font-semibold hover:text-green-700 transition-colors duration-200 mt-auto"
            >
              Lihat Riwayat
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </router-link>
          </div>
          
          <!-- Feature 5: Certainty Factor -->
          <div class="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-7 hover:border-green-400 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div class="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center mb-5 shadow-sm">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Metode Certainty Factor</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed grow">
              Menggunakan algoritma Certainty Factor yang telah teruji untuk memberikan tingkat keyakinan diagnosis yang akurat dan dapat diandalkan.
            </p>
          </div>
          
          <!-- Feature 6: Easy to Use -->
          <div class="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-7 hover:border-green-400 hover:shadow-md transition-all duration-300 flex flex-col h-full">
            <div class="w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-5 shadow-sm">
              <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Kemudahan Penggunaan</h3>
            <p class="text-sm sm:text-base text-gray-600 leading-relaxed grow">
              Tampilan sederhana dan intuitif. Kamu bisa melakukan diagnosis tanpa perlu keahlian teknis, cukup pilih tanaman dan gejala yang muncul.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="py-16 md:py-20 bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12 md:mb-16">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Cara Kerja
          </h2>
          <p class="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tiga langkah sederhana untuk mendapatkan diagnosis yang akurat
          </p>
        </div>
        
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            <!-- Step 1 -->
            <div class="text-center">
              <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg">
                1
              </div>
              <div class="bg-white rounded-xl p-6 md:p-7 shadow-md border border-gray-100">
                <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Pilih Tanaman</h3>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Pilih jenis tanaman hias yang ingin kamu diagnosis dari daftar yang tersedia.
                </p>
              </div>
            </div>
            
            <!-- Step 2 -->
            <div class="text-center">
              <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg">
                2
              </div>
              <div class="bg-white rounded-xl p-6 md:p-7 shadow-md border border-gray-100">
                <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Input Gejala</h3>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Pilih gejala yang kamu amati dan tentukan tingkat kepastian untuk setiap gejala.
                </p>
              </div>
            </div>
            
            <!-- Step 3 -->
            <div class="text-center">
              <div class="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg">
                3
              </div>
              <div class="bg-white rounded-xl p-6 md:p-7 shadow-md border border-gray-100">
                <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-3">Dapatkan Hasil</h3>
                <p class="text-sm sm:text-base text-gray-600 leading-relaxed">
                  Sistem akan menganalisis dan memberikan diagnosis beserta solusi perawatan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 md:py-20 bg-green-600 text-white relative overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
      </div>
      
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <h2 class="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
            Siap Memulai Diagnosis Tanaman Hias?
          </h2>
          <p class="text-base md:text-lg mb-8 opacity-95 leading-relaxed">
            Daftar sekarang dan dapatkan akses ke semua fitur sistem pakar. Gratis dan mudah digunakan!
          </p>
          <div class="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <router-link
              v-if="!isAuthenticated"
              to="/register"
              class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-green-600 text-base font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
            >
              <span>Daftar Sekarang</span>
            </router-link>
            <router-link
              v-if="isAuthenticated"
              to="/diagnosis"
              class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-green-600 text-base font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-200 whitespace-nowrap"
            >
              <span>Mulai Diagnosis</span>
            </router-link>
            <router-link
              to="/about"
              class="inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent text-white text-base font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-green-600 transition-colors duration-200 whitespace-nowrap"
            >
              <span>Pelajari Lebih Lanjut</span>
            </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import logoImage from '../assets/logo-hydrangea.png'

const authStore = useAuthStore()
const isAuthenticated = computed(() => authStore.isAuthenticated)
</script>

<style scoped>
/* Smooth scrolling */
.home-page {
  scroll-behavior: smooth;
}

/* Ensure hero content is perfectly centered */
.home-page section:first-child > div > div {
  display: block;
  margin-left: auto !important;
  margin-right: auto !important;
  text-align: center;
}
</style>
