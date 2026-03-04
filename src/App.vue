<script setup>
import { RouterView, RouterLink, useRoute } from 'vue-router'
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useAuthStore } from './stores/auth'
import logoImage from './assets/logo-hydrangea.png'

const authStore = useAuthStore()
const route = useRoute()

const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const getUserPhotoUrl = (photoPath) => {
  if (!photoPath) return null
  if (photoPath.startsWith('http')) return photoPath
  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/storage/${photoPath}`
}

const handleLogout = async () => {
  await authStore.logout()
  userDropdownOpen.value = false
}

const mobileMenuOpen = ref(false)
const userDropdownOpen = ref(false)
const showPrivacyPolicy = ref(false)
const showTerms = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
  document.body.style.overflow = mobileMenuOpen.value ? 'hidden' : ''
}
const closeMobileMenu = () => {
  mobileMenuOpen.value = false
  document.body.style.overflow = ''
}
const toggleUserDropdown = () => { userDropdownOpen.value = !userDropdownOpen.value }
const closeUserDropdown = () => { userDropdownOpen.value = false }
const handleMobileLogout = async () => { await handleLogout(); closeMobileMenu() }

const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.user-dropdown-container')
  if (dropdown && !dropdown.contains(event.target)) closeUserDropdown()
}

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    if (showPrivacyPolicy.value) { showPrivacyPolicy.value = false; return }
    if (showTerms.value) { showTerms.value = false; return }
    if (userDropdownOpen.value) { closeUserDropdown(); return }
    if (mobileMenuOpen.value) { closeMobileMenu(); return }
  }
}

const navLinks = computed(() => [
  { to: '/',                  label: 'Beranda',  show: true,               match: route.path === '/' },
  { to: '/diagnosis',         label: 'Diagnosis', show: isAuthenticated.value, match: route.path === '/diagnosis' },
  { to: '/diagnosis/history', label: 'Riwayat',  show: isAuthenticated.value, match: route.path === '/diagnosis/history' },
  { to: '/education',         label: 'Edukasi',  show: isAuthenticated.value, match: route.path === '/education' },
  { to: '/admin',             label: 'Admin',    show: isAdmin.value,       match: route.path.startsWith('/admin') },
  { to: '/about',             label: 'Tentang',  show: true,               match: route.path === '/about' },
])

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeydown)
})
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeydown)
  document.body.style.overflow = ''
})
watch(() => route.fullPath, () => { closeMobileMenu(); closeUserDropdown() })
</script>

<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Lewati ke konten utama</a>

    <!-- ===== NAVBAR ===== -->
    <header class="navbar" role="banner">
      <div class="navbar-inner page-container">
        <!-- Logo -->
        <RouterLink to="/" class="logo-link" @click="closeMobileMenu">
          <img :src="logoImage" alt="System Pakar" class="logo-img" />
          <div class="logo-text">
            <span class="logo-name">System Pakar</span>
            <span class="logo-sub">Tanaman Hias</span>
          </div>
        </RouterLink>

        <!-- Desktop Nav Links -->
        <nav class="desktop-nav" aria-label="Navigasi utama">
          <RouterLink
            v-for="link in navLinks.filter(l => l.show)"
            :key="link.to"
            :to="link.to"
            class="nav-link"
            :class="{ 'nav-link--active': link.match }"
          >{{ link.label }}</RouterLink>
        </nav>

        <!-- Desktop User Actions -->
        <div class="desktop-actions">
          <template v-if="!isAuthenticated">
            <RouterLink to="/login"    class="sp-btn sp-btn-ghost sp-btn-sm">Masuk</RouterLink>
            <RouterLink to="/register" class="sp-btn sp-btn-primary sp-btn-sm">Daftar</RouterLink>
          </template>
          <template v-else>
            <div class="user-dropdown-container" style="position:relative;">
              <button @click="toggleUserDropdown" :aria-expanded="userDropdownOpen" class="user-btn" aria-label="Menu pengguna">
                <div class="avatar">
                  <img v-if="user?.photo && getUserPhotoUrl(user.photo)" :src="getUserPhotoUrl(user.photo)" :alt="user?.name" style="width:100%;height:100%;object-fit:cover;" />
                  <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                </div>
                <span class="user-btn-name">{{ user?.name || 'Pengguna' }}</span>
                <svg width="14" height="14" :style="{ transform: userDropdownOpen ? 'rotate(180deg)' : '', transition: 'transform .15s' }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg>
              </button>

              <Transition enter-active-class="transition-all duration-150 ease-out" enter-from-class="opacity-0 translate-y-1 scale-95" enter-to-class="opacity-100 translate-y-0 scale-100" leave-active-class="transition-all duration-100 ease-in" leave-from-class="opacity-100 translate-y-0 scale-100" leave-to-class="opacity-0 translate-y-1 scale-95">
                <div v-if="userDropdownOpen" class="dropdown" role="menu">
                  <div class="dropdown-user">
                    <div class="avatar avatar--lg">
                      <img v-if="user?.photo && getUserPhotoUrl(user.photo)" :src="getUserPhotoUrl(user.photo)" :alt="user?.name" style="width:100%;height:100%;object-fit:cover;" />
                      <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
                    </div>
                    <div>
                      <p class="dropdown-user-name">{{ user?.name }}</p>
                      <p class="dropdown-user-email">{{ user?.email }}</p>
                    </div>
                  </div>
                  <div class="dropdown-divider"></div>
                  <RouterLink to="/profile" @click="closeUserDropdown" class="dropdown-item" role="menuitem">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Profil Saya
                  </RouterLink>
                  <RouterLink v-if="isAdmin" to="/admin" @click="closeUserDropdown" class="dropdown-item" role="menuitem">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    Admin Panel
                  </RouterLink>
                  <div class="dropdown-divider"></div>
                  <button @click="handleLogout" class="dropdown-item dropdown-item--danger" role="menuitem">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                    Keluar
                  </button>
                </div>
              </Transition>
            </div>
          </template>
        </div>

        <!-- Mobile Toggle -->
        <button @click="toggleMobileMenu" class="mobile-toggle" :aria-expanded="mobileMenuOpen" aria-label="Buka menu navigasi">
          <svg v-if="!mobileMenuOpen" width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
          <svg v-else width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition enter-active-class="transition-all duration-200 ease-out" enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition-all duration-150 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-2">
        <div v-if="mobileMenuOpen" class="mobile-menu" id="mobile-menu">
          <div v-if="isAuthenticated" class="mobile-user">
            <div class="avatar">
              <img v-if="user?.photo" :src="getUserPhotoUrl(user.photo)" :alt="user?.name" style="width:100%;height:100%;object-fit:cover;" />
              <span v-else>{{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}</span>
            </div>
            <div>
              <p style="font-weight:600;font-size:.9rem;">{{ user?.name }}</p>
              <p style="font-size:.8rem;color:var(--text-muted);">{{ user?.email }}</p>
            </div>
          </div>

          <nav style="display:flex;flex-direction:column;gap:2px;margin-bottom:1rem;">
            <RouterLink
              v-for="link in navLinks.filter(l => l.show)"
              :key="link.to"
              :to="link.to"
              @click="closeMobileMenu"
              class="mobile-nav-link"
              :class="{ 'mobile-nav-link--active': link.match }"
            >{{ link.label }}</RouterLink>
          </nav>

          <div class="mobile-actions">
            <template v-if="!isAuthenticated">
              <RouterLink to="/login"    @click="closeMobileMenu" class="sp-btn sp-btn-secondary" style="width:100%;justify-content:center;">Masuk</RouterLink>
              <RouterLink to="/register" @click="closeMobileMenu" class="sp-btn sp-btn-primary"   style="width:100%;justify-content:center;">Daftar Sekarang</RouterLink>
            </template>
            <template v-else>
              <RouterLink to="/profile"  @click="closeMobileMenu" class="sp-btn sp-btn-secondary" style="width:100%;justify-content:center;">Profil Saya</RouterLink>
              <button @click="handleMobileLogout" class="sp-btn sp-btn-danger" style="width:100%;justify-content:center;">Keluar</button>
            </template>
          </div>
        </div>
      </Transition>
    </header>

    <!-- ===== MAIN ===== -->
    <main id="main-content" role="main" style="padding-top:64px;min-height:calc(100vh - 64px);">
      <RouterView />
    </main>

    <!-- ===== FOOTER ===== -->
    <footer class="sp-footer" role="contentinfo">
      <div class="page-container">
        <div class="footer-grid">
          <div>
            <div style="display:flex;align-items:center;gap:.625rem;margin-bottom:.875rem;">
              <img :src="logoImage" alt="System Pakar" class="logo-img" />
              <strong style="font-size:.9375rem;color:var(--gray-900);">System Pakar</strong>
            </div>
            <p style="font-size:.875rem;color:var(--text-muted);line-height:1.65;max-width:260px;">
              Sistem pakar berbasis web untuk diagnosis penyakit tanaman hias dengan metode Certainty Factor.
            </p>
          </div>
          <div>
            <h4 class="footer-h">Menu</h4>
            <ul class="footer-list">
              <li><RouterLink to="/">Beranda</RouterLink></li>
              <li v-if="isAuthenticated"><RouterLink to="/diagnosis">Diagnosis</RouterLink></li>
              <li v-if="isAuthenticated"><RouterLink to="/education">Edukasi</RouterLink></li>
              <li><RouterLink to="/about">Tentang</RouterLink></li>
            </ul>
          </div>
          <div>
            <h4 class="footer-h">Informasi</h4>
            <ul class="footer-list">
              <li><a href="#" @click.prevent="showPrivacyPolicy = true">Kebijakan Privasi</a></li>
              <li><a href="#" @click.prevent="showTerms = true">Ketentuan Layanan</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© {{ new Date().getFullYear() }} System Pakar Tanaman Hias · Parongpong, Jawa Barat</p>
        </div>
      </div>
    </footer>

    <!-- Privacy Modal -->
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showPrivacyPolicy" class="modal-overlay" @click="showPrivacyPolicy = false">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="prv-title" @click.stop>
          <div class="modal-hdr">
            <h2 id="prv-title">Kebijakan Privasi</h2>
            <button @click="showPrivacyPolicy = false" class="modal-close" aria-label="Tutup">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <p><strong>Terakhir diperbarui:</strong> {{ new Date().toLocaleDateString('id-ID') }}</p>
            <p><strong>1. Informasi yang Dikumpulkan:</strong> Kami mengumpulkan data akun dan riwayat diagnosis untuk memberikan layanan yang optimal.</p>
            <p><strong>2. Penggunaan Data:</strong> Data digunakan untuk meningkatkan akurasi diagnosis dan pengalaman pengguna.</p>
            <p><strong>3. Keamanan:</strong> Kami menerapkan langkah keamanan standar untuk melindungi data Anda.</p>
            <p><strong>4. Kontak:</strong> Hubungi administrator sistem untuk pertanyaan terkait privasi.</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Terms Modal -->
    <Transition enter-active-class="transition-opacity duration-200" enter-from-class="opacity-0" enter-to-class="opacity-100" leave-active-class="transition-opacity duration-150" leave-from-class="opacity-100" leave-to-class="opacity-0">
      <div v-if="showTerms" class="modal-overlay" @click="showTerms = false">
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="trm-title" @click.stop>
          <div class="modal-hdr">
            <h2 id="trm-title">Ketentuan Layanan</h2>
            <button @click="showTerms = false" class="modal-close" aria-label="Tutup">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <p><strong>Terakhir diperbarui:</strong> {{ new Date().toLocaleDateString('id-ID') }}</p>
            <p><strong>1. Penerimaan:</strong> Dengan menggunakan System Pakar, Anda menyetujui ketentuan ini.</p>
            <p><strong>2. Penggunaan:</strong> Layanan ditujukan untuk diagnosis penyakit tanaman hias Bigleaf Hydrangea dan Rosa Tineke.</p>
            <p><strong>3. Batasan:</strong> Hasil diagnosis bersifat saran dan tidak menggantikan konsultasi dengan pakar pertanian profesional.</p>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
/* Navbar */
.navbar {
  position: fixed; top: 0; left: 0; right: 0; z-index: 100;
  height: 64px;
  background: rgba(255,255,255,.97);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.navbar-inner {
  height: 64px; display: flex; align-items: center;
  justify-content: space-between; gap: .75rem;
}

/* Logo */
.logo-link { display:flex; align-items:center; gap:.625rem; text-decoration:none; padding:.3rem .5rem; border-radius:8px; transition:background .15s; flex-shrink:0; }
.logo-link:hover { background: var(--bg-subtle); }
.logo-img  { width:34px; height:34px; border-radius:7px; object-fit:cover; border:1px solid var(--border); }
.logo-text { display:none; flex-direction:column; line-height:1; }
@media (min-width:480px) { .logo-text { display:flex; } }
.logo-name { font-weight:700; font-size:.9rem; color:var(--gray-900); }
.logo-sub  { font-size:.68rem; color:var(--text-muted); margin-top:1px; }

/* Desktop nav */
.desktop-nav { display:none; align-items:center; gap:2px; }
@media (min-width:768px) { .desktop-nav { display:flex; } }
.nav-link { padding:.4rem .875rem; font-size:.875rem; font-weight:500; color:var(--text-muted); border-radius:6px; text-decoration:none; transition:color .15s,background .15s; }
.nav-link:hover { color:var(--gray-900); background:var(--bg-subtle); }
.nav-link--active { color:var(--primary); background:var(--primary-50); font-weight:600; }

/* Desktop actions */
.desktop-actions { display:none; align-items:center; gap:.5rem; }
@media (min-width:768px) { .desktop-actions { display:flex; } }

/* User button */
.user-btn { display:flex; align-items:center; gap:.5rem; padding:.3rem .625rem; border:1.5px solid var(--border); border-radius:8px; background:var(--bg-surface); cursor:pointer; transition:border-color .15s,background .15s; font-family:inherit; }
.user-btn:hover { border-color:var(--border-strong); background:var(--bg-subtle); }
.user-btn-name { font-size:.875rem; font-weight:500; color:var(--gray-800); max-width:110px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:none; }
@media (min-width:1024px) { .user-btn-name { display:block; } }

/* Avatar */
.avatar { width:32px; height:32px; border-radius:50%; background:var(--primary-100); color:var(--primary-700); font-weight:700; font-size:.875rem; display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0; }
.avatar--lg { width:40px; height:40px; font-size:1rem; }

/* Dropdown */
.dropdown { position:absolute; right:0; top:calc(100% + 8px); width:230px; background:var(--bg-surface); border:1px solid var(--border); border-radius:var(--radius-lg); box-shadow:var(--shadow-lg); z-index:200; overflow:hidden; }
.dropdown-user { display:flex; align-items:center; gap:.75rem; padding:1rem 1rem .875rem; }
.dropdown-user-name  { font-weight:600; font-size:.875rem; color:var(--gray-900); }
.dropdown-user-email { font-size:.775rem; color:var(--text-muted); }
.dropdown-divider { height:1px; background:var(--border); }
.dropdown-item { display:flex; align-items:center; gap:.625rem; width:100%; padding:.625rem .875rem; font-size:.875rem; font-weight:500; color:var(--gray-700); background:transparent; border:none; border-radius:0; cursor:pointer; text-decoration:none; transition:background .12s,color .12s; font-family:inherit; text-align:left; }
.dropdown-item:hover { background:var(--bg-subtle); color:var(--gray-900); }
.dropdown-item--danger { color:#dc2626; }
.dropdown-item--danger:hover { background:#fef2f2; color:#b91c1c; }

/* Mobile toggle */
.mobile-toggle { display:flex; align-items:center; justify-content:center; width:38px; height:38px; border:1.5px solid var(--border); border-radius:8px; background:var(--bg-surface); cursor:pointer; color:var(--gray-700); transition:border-color .15s,background .15s; }
.mobile-toggle:hover { border-color:var(--border-strong); background:var(--bg-subtle); }
@media (min-width:768px) { .mobile-toggle { display:none; } }

/* Mobile menu */
.mobile-menu { position:absolute; top:100%; left:0; right:0; background:var(--bg-surface); border-bottom:1px solid var(--border); box-shadow:var(--shadow-md); padding:1rem 1.25rem 1.5rem; z-index:98; }
.mobile-user { display:flex; align-items:center; gap:.75rem; padding:.875rem; background:var(--bg-subtle); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:1rem; }
.mobile-nav-link { padding:.6875rem .875rem; font-size:.9375rem; font-weight:500; color:var(--text-muted); border-radius:var(--radius-sm); text-decoration:none; transition:color .15s,background .15s; }
.mobile-nav-link:hover { color:var(--gray-900); background:var(--bg-subtle); }
.mobile-nav-link--active { color:var(--primary); background:var(--primary-50); font-weight:600; }
.mobile-actions { display:flex; flex-direction:column; gap:.5rem; padding-top:1rem; border-top:1px solid var(--border); }

/* Footer */
.sp-footer { background:var(--bg-surface); border-top:1px solid var(--border); padding:2.5rem 0 2rem; }
.footer-grid { display:grid; grid-template-columns:1fr; gap:2rem; margin-bottom:2rem; }
@media (min-width:640px) { .footer-grid { grid-template-columns:2fr 1fr 1fr; } }
.footer-h { font-size:.875rem; font-weight:600; color:var(--gray-800); margin-bottom:.75rem; }
.footer-list { list-style:none; display:flex; flex-direction:column; gap:.5rem; }
.footer-list a { font-size:.875rem; color:var(--text-muted); text-decoration:none; transition:color .15s; }
.footer-list a:hover { color:var(--primary); }
.footer-bottom { border-top:1px solid var(--border); padding-top:1.25rem; }
.footer-bottom p { font-size:.8125rem; color:var(--text-faint); }

/* Modal */
.modal-overlay { position:fixed; inset:0; background:rgba(0,0,0,.45); z-index:500; display:flex; align-items:center; justify-content:center; padding:1.25rem; }
.modal-box { background:var(--bg-surface); border-radius:var(--radius-xl); box-shadow:var(--shadow-lg); max-width:520px; width:100%; max-height:90vh; overflow-y:auto; }
.modal-hdr { display:flex; align-items:center; justify-content:space-between; padding:1.125rem 1.5rem; border-bottom:1px solid var(--border); position:sticky; top:0; background:var(--bg-surface); }
.modal-hdr h2 { font-size:1.0625rem; margin:0; }
.modal-close { display:flex; align-items:center; justify-content:center; width:30px; height:30px; border:none; background:transparent; border-radius:6px; cursor:pointer; color:var(--text-muted); transition:background .15s,color .15s; }
.modal-close:hover { background:var(--bg-subtle); color:var(--gray-900); }
.modal-body { padding:1.5rem; display:flex; flex-direction:column; gap:.875rem; }
.modal-body p { font-size:.875rem; color:var(--text-muted); line-height:1.7; margin:0; }

/* Global link resets in nav/footer */
nav a, footer a { text-decoration: none; }
</style>
