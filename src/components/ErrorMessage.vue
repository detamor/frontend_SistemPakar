<template>
  <div v-if="message" :class="errorClasses" role="alert">
    <div class="error-icon">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
    </div>
    <div class="error-content">
      <p class="error-title">{{ title || 'Terjadi Kesalahan' }}</p>
      <p class="error-message">{{ message }}</p>
      <ul v-if="errors && errors.length > 0" class="error-list">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>
    <button v-if="dismissible" @click="$emit('dismiss')" class="error-close" aria-label="Tutup">
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  errors: {
    type: Array,
    default: () => []
  },
  variant: {
    type: String,
    default: 'error', // error, warning, info
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  dismissible: {
    type: Boolean,
    default: false
  }
})

defineEmits(['dismiss'])

const errorClasses = computed(() => {
  return [
    'error-message-container',
    `error-message-container--${props.variant}`
  ]
})
</script>

<style scoped>
.error-message-container {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 0.5rem;
  border-left: 4px solid;
  margin-bottom: 1rem;
  animation: slideIn 0.3s ease-out;
}

.error-message-container--error {
  background-color: #fef2f2;
  border-color: #ef4444;
  color: #991b1b;
}

.error-message-container--warning {
  background-color: #fffbeb;
  border-color: #f59e0b;
  color: #92400e;
}

.error-message-container--info {
  background-color: #eff6ff;
  border-color: #3b82f6;
  color: #1e40af;
}

.error-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 0.125rem;
}

.error-content {
  flex: 1;
  min-width: 0;
}

.error-title {
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
}

.error-message {
  font-size: 0.875rem;
  margin: 0;
  line-height: 1.5;
}

.error-list {
  margin: 0.5rem 0 0 0;
  padding-left: 1.25rem;
  list-style-type: disc;
}

.error-list li {
  font-size: 0.875rem;
  margin: 0.25rem 0;
  line-height: 1.5;
}

.error-close {
  flex-shrink: 0;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  color: currentColor;
  opacity: 0.7;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-close:hover {
  opacity: 1;
}

.error-close svg {
  width: 16px;
  height: 16px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

