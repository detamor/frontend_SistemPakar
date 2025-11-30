<template>
  <div :class="containerClasses">
    <div class="spinner" :class="spinnerClasses">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
    </div>
    <p v-if="message" class="spinner-message">{{ message }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  message: {
    type: String,
    default: ''
  },
  fullScreen: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  }
})

const containerClasses = computed(() => {
  return [
    'loading-spinner-container',
    {
      'loading-spinner-container--fullscreen': props.fullScreen,
      'loading-spinner-container--overlay': props.overlay
    }
  ]
})

const spinnerClasses = computed(() => {
  return `spinner--${props.size}`
})
</script>

<style scoped>
.loading-spinner-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.loading-spinner-container--fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 9999;
}

.loading-spinner-container--overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 100;
}

.spinner {
  position: relative;
  display: inline-block;
}

.spinner-ring {
  position: absolute;
  border: 3px solid transparent;
  border-top-color: #27ae60;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.spinner-ring:nth-child(2) {
  animation-delay: 0.2s;
  border-top-color: #2ecc71;
}

.spinner-ring:nth-child(3) {
  animation-delay: 0.4s;
  border-top-color: #58d68d;
}

/* Sizes */
.spinner--sm {
  width: 24px;
  height: 24px;
}

.spinner--sm .spinner-ring {
  width: 24px;
  height: 24px;
  border-width: 2px;
}

.spinner--md {
  width: 40px;
  height: 40px;
}

.spinner--md .spinner-ring {
  width: 40px;
  height: 40px;
  border-width: 3px;
}

.spinner--lg {
  width: 64px;
  height: 64px;
}

.spinner--lg .spinner-ring {
  width: 64px;
  height: 64px;
  border-width: 4px;
}

.spinner--xl {
  width: 80px;
  height: 80px;
}

.spinner--xl .spinner-ring {
  width: 80px;
  height: 80px;
  border-width: 5px;
}

.spinner-message {
  color: #4b5563;
  font-size: 0.875rem;
  font-weight: 500;
  margin: 0;
  text-align: center;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>

