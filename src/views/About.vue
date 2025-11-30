<template>
  <div class="min-h-screen bg-gray-50 pt-20">
    <!-- Hero Section -->
    <section class="bg-gradient-to-br from-green-600 to-green-700 text-white py-16 md:py-20 relative overflow-hidden">
      <!-- Decorative Elements -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="max-w-3xl mx-auto text-center">
          <div class="inline-flex items-center gap-3 mb-6">
            <img :src="logoImage" alt="System Pakar" class="w-12 h-12 sm:w-16 sm:h-16 object-contain rounded-xl" />
            <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold">Tentang System Pakar</h1>
          </div>
          <p class="text-lg md:text-xl text-green-50 leading-relaxed">
            Sistem pakar berbasis web untuk diagnosis penyakit tanaman hias dengan integrasi WhatsApp menggunakan Fonte API
          </p>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-16 md:py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto space-y-12">
          
          <!-- Deskripsi Sistem -->
          <div class="bg-white rounded-xl shadow-md p-8 md:p-10 border-2 border-gray-200">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🌱</span>
              </div>
              <span>Tentang Sistem</span>
            </h2>
            <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                <strong>System Pakar</strong> adalah sistem berbasis web yang dirancang khusus untuk membantu petani, penghobi, dan pelaku usaha dalam mengidentifikasi penyakit tanaman hias serta mendapatkan solusi perawatan yang tepat.
              </p>
              <p>
                Sistem ini mengintegrasikan pengetahuan pakar lokal dengan teknologi modern untuk memberikan diagnosis yang akurat menggunakan metode <strong>Certainty Factor</strong> dan <strong>Forward Chaining</strong>.
              </p>
              <p>
                Dengan lebih dari tiga puluh tahun pengalaman praktis dari pakar budidaya tanaman hias di kawasan Parongpong, sistem ini dirancang untuk meniru cara berpikir pakar dalam mendiagnosis penyakit tanaman hias.
              </p>
            </div>
          </div>

          <!-- Fitur Utama -->
          <div class="bg-white rounded-xl shadow-md p-8 md:p-10 border-2 border-gray-200">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <span class="text-2xl">✨</span>
              </div>
              <span>Fitur Utama</span>
            </h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex items-start gap-4 p-5 bg-green-50 rounded-xl border border-green-200 hover:shadow-md transition-shadow duration-200">
                <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <span class="text-white text-xl">🔍</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Diagnosis Otomatis</h3>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Identifikasi penyakit tanaman hias secara otomatis dengan metode Certainty Factor
                  </p>
                </div>
              </div>
              
              <div class="flex items-start gap-4 p-5 bg-blue-50 rounded-xl border border-blue-200 hover:shadow-md transition-shadow duration-200">
                <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <span class="text-white text-xl">📚</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Modul Edukasi</h3>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Akses berbagai modul pembelajaran tentang perawatan tanaman hias
                  </p>
                </div>
              </div>
              
              <div class="flex items-start gap-4 p-5 bg-purple-50 rounded-xl border border-purple-200 hover:shadow-md transition-shadow duration-200">
                <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <span class="text-white text-xl">💬</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Konsultasi Pakar</h3>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Konsultasi langsung dengan pakar melalui WhatsApp menggunakan Fonte API
                  </p>
                </div>
              </div>
              
              <div class="flex items-start gap-4 p-5 bg-orange-50 rounded-xl border border-orange-200 hover:shadow-md transition-shadow duration-200">
                <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                  <span class="text-white text-xl">📊</span>
                </div>
                <div>
                  <h3 class="font-bold text-gray-900 mb-2">Riwayat Diagnosis</h3>
                  <p class="text-sm text-gray-600 leading-relaxed">
                    Simpan dan akses kembali semua hasil diagnosis dengan laporan PDF
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Metode Certainty Factor -->
          <div class="bg-white rounded-xl shadow-md p-8 md:p-10 border-2 border-gray-200">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">🧮</span>
              </div>
              <span>Metode Certainty Factor</span>
            </h2>
            <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                Sistem ini menggunakan metode <strong>Certainty Factor (CF)</strong> untuk mengukur tingkat keyakinan terhadap diagnosis yang dihasilkan. Metode ini telah terbukti efektif dalam sistem pakar pertanian dan medis.
              </p>
              <div class="bg-gray-50 rounded-lg p-6 border-l-4 border-green-600">
                <h4 class="font-bold text-gray-900 mb-2">Cara Kerja:</h4>
                <ul class="list-disc list-inside space-y-2 text-gray-700">
                  <li>User memilih gejala yang diamati dan menentukan tingkat kepastian (CF User)</li>
                  <li>Sistem menghitung CF untuk setiap kemungkinan penyakit</li>
                  <li>CF dikombinasikan untuk gejala yang sama pada penyakit yang sama</li>
                  <li>Hasil diagnosis ditampilkan dengan persentase keyakinan</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Integrasi WhatsApp dengan Fonte API -->
          <div class="bg-white rounded-xl shadow-md p-8 md:p-10 border-2 border-gray-200">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <span class="text-2xl">📱</span>
              </div>
              <span>Integrasi WhatsApp dengan Fonte API</span>
            </h2>
            <div class="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-4">
              <p>
                Sistem ini terintegrasi dengan <strong>Fonte API</strong> untuk memungkinkan komunikasi langsung melalui WhatsApp. Integrasi ini memungkinkan:
              </p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
                <div class="bg-green-50 rounded-xl p-6 border-2 border-green-200 hover:shadow-md transition-shadow duration-200">
                  <h4 class="font-bold text-green-900 mb-3 flex items-center gap-2 text-lg">
                    <span class="text-xl">🔐</span>
                    <span>Verifikasi OTP</span>
                  </h4>
                  <p class="text-sm text-gray-700 leading-relaxed">
                    Kode OTP untuk verifikasi akun dikirim otomatis melalui WhatsApp menggunakan Fonte API
                  </p>
                </div>
                
                <div class="bg-blue-50 rounded-xl p-6 border-2 border-blue-200 hover:shadow-md transition-shadow duration-200">
                  <h4 class="font-bold text-blue-900 mb-3 flex items-center gap-2 text-lg">
                    <span class="text-xl">💬</span>
                    <span>Konsultasi Pakar</span>
                  </h4>
                  <p class="text-sm text-gray-700 leading-relaxed">
                    Komunikasi langsung dengan pakar tanaman hias melalui WhatsApp untuk konsultasi lebih lanjut
                  </p>
                </div>
                
                <div class="bg-purple-50 rounded-xl p-6 border-2 border-purple-200 hover:shadow-md transition-shadow duration-200">
                  <h4 class="font-bold text-purple-900 mb-3 flex items-center gap-2 text-lg">
                    <span class="text-xl">📄</span>
                    <span>Laporan Diagnosis</span>
                  </h4>
                  <p class="text-sm text-gray-700 leading-relaxed">
                    Hasil diagnosis dalam format PDF dapat dikirim langsung ke WhatsApp menggunakan Fonte API
                  </p>
                </div>
                
                <div class="bg-orange-50 rounded-xl p-6 border-2 border-orange-200 hover:shadow-md transition-shadow duration-200">
                  <h4 class="font-bold text-orange-900 mb-3 flex items-center gap-2 text-lg">
                    <span class="text-xl">🔔</span>
                    <span>Notifikasi</span>
                  </h4>
                  <p class="text-sm text-gray-700 leading-relaxed">
                    Notifikasi penting dan update sistem dikirim melalui WhatsApp untuk memastikan pengguna selalu terinformasi
                  </p>
                </div>
              </div>
              <div class="bg-gray-50 rounded-lg p-6 border-l-4 border-green-600 mt-6">
                <p class="text-sm text-gray-700">
                  <strong>Fonte API</strong> adalah layanan API untuk mengirim pesan WhatsApp secara otomatis. Sistem ini menggunakan Fonte API untuk memastikan komunikasi yang cepat, andal, dan terintegrasi dengan baik.
                </p>
              </div>
            </div>
          </div>

          <!-- Teknologi yang Digunakan -->
          <div class="bg-white rounded-xl shadow-md p-8 md:p-10 border-2 border-gray-200">
            <h2 class="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
              <div class="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                <span class="text-2xl">⚙️</span>
              </div>
              <span>Teknologi yang Digunakan</span>
            </h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-5">
              <div class="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-xl border-2 border-red-200 hover:shadow-md transition-shadow duration-200">
                <div class="text-3xl mb-3">🟢</div>
                <div class="font-bold text-gray-900 text-lg">Laravel</div>
                <div class="text-xs text-gray-600 mt-2">Backend API</div>
              </div>
              <div class="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200 hover:shadow-md transition-shadow duration-200">
                <div class="text-3xl mb-3">🟡</div>
                <div class="font-bold text-gray-900 text-lg">Vue.js</div>
                <div class="text-xs text-gray-600 mt-2">Frontend</div>
              </div>
              <div class="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-200 hover:shadow-md transition-shadow duration-200">
                <div class="text-3xl mb-3">🐍</div>
                <div class="font-bold text-gray-900 text-lg">Python</div>
                <div class="text-xs text-gray-600 mt-2">Expert Engine</div>
              </div>
              <div class="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200 hover:shadow-md transition-shadow duration-200">
                <div class="text-3xl mb-3">📱</div>
                <div class="font-bold text-gray-900 text-lg">Fonte API</div>
                <div class="text-xs text-gray-600 mt-2">WhatsApp</div>
              </div>
            </div>
          </div>

          <!-- CTA Section -->
          <div class="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg p-8 md:p-10 text-white text-center relative overflow-hidden">
            <!-- Decorative Elements -->
            <div class="absolute inset-0 opacity-10">
              <div class="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
              <div class="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            </div>
            <div class="relative z-10">
              <h2 class="text-2xl md:text-3xl font-bold mb-4">Siap Memulai?</h2>
              <p class="text-lg text-green-50 mb-8 max-w-2xl mx-auto leading-relaxed">
                Daftar sekarang dan dapatkan akses ke semua fitur sistem pakar. Gratis dan mudah digunakan!
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <router-link
                  v-if="!isAuthenticated"
                  to="/register"
                  class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Daftar Sekarang
                </router-link>
                <router-link
                  v-if="isAuthenticated"
                  to="/diagnosis"
                  class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Mulai Diagnosis
                </router-link>
                <router-link
                  to="/"
                  class="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-green-600 transition-all duration-200"
                >
                  Kembali ke Home
                </router-link>
              </div>
            </div>
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
.prose h4 {
  margin-top: 0;
  margin-bottom: 0.5rem;
}

.prose ul {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.prose p {
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
