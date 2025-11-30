<template>
  <div class="admin-dashboard">
    <!-- Tombol Kembali -->
    <div class="mb-6">
      <router-link
        to="/"
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
      >
        <span>←</span>
        <span>Kembali ke Home</span>
      </router-link>
    </div>
    <h1>Dashboard Admin</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-value">{{ stats.totalUsers || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3>Total Diagnosis</h3>
        <p class="stat-value">{{ stats.totalDiagnoses || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3>Modul Edukasi</h3>
        <p class="stat-value">{{ stats.totalModules || 0 }}</p>
      </div>
      <div class="stat-card">
        <h3>Konsultasi</h3>
        <p class="stat-value">{{ stats.totalConsultations || 0 }}</p>
      </div>
    </div>

    <div class="quick-links">
      <h2>Quick Links</h2>
      <div class="links-grid">
        <router-link to="/admin/users" class="link-card">
          <h3>👥 Manajemen User</h3>
          <p>Kelola pengguna sistem</p>
        </router-link>
        <router-link to="/admin/education" class="link-card">
          <h3>📚 Modul Edukasi</h3>
          <p>Kelola modul pembelajaran</p>
        </router-link>
        <router-link to="/admin/plants" class="link-card">
          <h3 class="flex items-center gap-2">
            <img :src="logoImage" alt="Tanaman" class="w-5 h-5 object-contain rounded-md" />
            <span>Tanaman</span>
          </h3>
          <p>Kelola data tanaman</p>
        </router-link>
        <router-link to="/admin/symptoms" class="link-card">
          <h3>🔍 Gejala</h3>
          <p>Kelola gejala penyakit</p>
        </router-link>
        <router-link to="/admin/diseases" class="link-card">
          <h3>🦠 Penyakit</h3>
          <p>Kelola penyakit & CF</p>
        </router-link>
        <router-link to="/admin/cf-levels" class="link-card">
          <h3>📊 Bobot Nilai CF</h3>
          <p>Kelola keterangan & bobot nilai</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAdminStore } from '../../stores/admin'
import logoImage from '../../assets/logo-hydrangea.png'

const adminStore = useAdminStore()
const stats = ref({
  totalUsers: 0,
  totalDiagnoses: 0,
  totalModules: 0,
  totalConsultations: 0
})

const loadStats = async () => {
  // Load basic stats
  try {
    const [usersRes, modulesRes] = await Promise.all([
      adminStore.fetchUsers({ per_page: 1 }),
      adminStore.fetchEducationModules({ per_page: 1 })
    ])
    
    stats.value.totalUsers = usersRes.data?.total || 0
    stats.value.totalModules = modulesRes.data?.total || 0
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.admin-dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
}

.stat-value {
  margin: 0;
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
}

.quick-links {
  margin-top: 3rem;
}

.quick-links h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.link-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.link-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.link-card h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
}

.link-card p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}
</style>


