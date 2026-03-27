import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('../views/ResetPassword.vue'),
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/diagnosis',
    name: 'Diagnosis',
    component: () => import('../views/Diagnosis.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/diagnosis/history',
    name: 'DiagnosisHistory',
    component: () => import('../views/DiagnosisHistory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/diagnosis/:id',
    name: 'DiagnosisDetail',
    component: () => import('../views/DiagnosisDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/education',
    name: 'Education',
    component: () => import('../views/Education.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/education/bookmarks',
    name: 'EducationBookmarks',
    component: () => import('../views/EducationBookmarks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/education/:id',
    name: 'EducationDetail',
    component: () => import('../views/EducationDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/consultation',
    name: 'Consultation',
    component: () => import('../views/Consultation.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  // Admin Routes
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/education',
    name: 'AdminEducationalModules',
    component: () => import('../views/admin/EducationalModules.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/users',
    name: 'AdminUsers',
    component: () => import('../views/admin/Users.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/plants',
    name: 'AdminPlants',
    component: () => import('../views/admin/Plants.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/diseases',
    name: 'AdminDiseases',
    component: () => import('../views/admin/Diseases.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/cf-levels',
    name: 'AdminCFLevels',
    component: () => import('../views/admin/CFLevels.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/admin/feedback-comments',
    name: 'AdminFeedbackComments',
    component: () => import('../views/admin/FeedbackComments.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Initialize auth jika belum
  if (!authStore.user && authStore.token) {
    await authStore.fetchUser()
  }

  // Check if route requires auth
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires admin
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next({ name: 'Home' })
    return
  }

  // Check if route is guest only (login, register, etc)
  if (to.meta.guestOnly && authStore.isAuthenticated) {
    // Redirect admin to admin panel, user to home
    if (authStore.isAdmin) {
      next({ name: 'AdminDashboard' })
    } else {
      next({ name: 'Home' })
    }
    return
  }

  next()
})

export default router



