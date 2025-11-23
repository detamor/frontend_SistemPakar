<script setup>
import { RouterView, RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()

const user = computed(() => authStore.user)
const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<template>
  <div id="app">
    <nav>
      <div class="nav-brand">
        <RouterLink to="/">System Pakar</RouterLink>
      </div>
      <div class="nav-links">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/diagnosis">Diagnosis</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/diagnosis/history">Riwayat</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/education">Edukasi</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/consultation">Konsultasi</RouterLink>
        <RouterLink v-if="isAdmin" to="/admin">Admin</RouterLink>
        <RouterLink v-if="isAuthenticated" to="/whatsapp">WhatsApp</RouterLink>
        <RouterLink to="/about">About</RouterLink>
        
        <template v-if="!isAuthenticated">
          <RouterLink to="/login" class="btn-login">Login</RouterLink>
          <RouterLink to="/register" class="btn-register">Daftar</RouterLink>
        </template>
        
        <template v-else>
          <div class="user-menu">
            <router-link to="/profile" class="user-name">{{ user?.name }}</router-link>
            <span v-if="isAdmin" class="badge-admin">Admin</span>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </div>
        </template>
      </div>
    </nav>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  min-height: 100vh;
}

nav {
  background: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.nav-brand a {
  font-size: 1.25rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1rem;
}

nav a {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

nav a:hover,
nav a.router-link-active {
  background: #34495e;
}

.btn-login,
.btn-register {
  padding: 0.5rem 1.5rem;
  border-radius: 6px;
}

.btn-login {
  background: transparent;
  border: 1px solid white;
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.1);
}

.btn-register {
  background: #667eea;
}

.btn-register:hover {
  background: #5568d3;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
}

.user-name {
  color: white;
  font-weight: 500;
  text-decoration: none;
  transition: opacity 0.3s;
}

.user-name:hover {
  opacity: 0.8;
}

.badge-admin {
  background: #f39c12;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: bold;
}

.btn-logout {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c0392b;
}

main {
  padding: 2rem;
}
</style>
