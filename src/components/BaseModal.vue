<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="show" class="base-modal-overlay" @click="handleOverlayClick">
        <div class="base-modal-container" :class="containerClasses" @click.stop>
          <div class="base-modal-header">
            <h3 v-if="title" class="base-modal-title">{{ title }}</h3>
            <p v-if="subtitle" class="base-modal-subtitle">{{ subtitle }}</p>
            <button v-if="closable" class="base-modal-close" @click="$emit('close')">
              ×
            </button>
          </div>
          <div class="base-modal-body">
            <slot></slot>
          </div>
          <div v-if="$slots.footer" class="base-modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  closable: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg, xl
    validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
  },
  closeOnOverlay: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['close'])

const containerClasses = computed(() => {
  return `base-modal-container--${props.size}`
})

const handleOverlayClick = () => {
  if (props.closeOnOverlay) {
    emit('close')
  }
}
</script>

<style scoped>
.base-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-overlay);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--z-modal);
  padding: var(--spacing-4);
  overflow-y: auto;
}

.base-modal-container {
  background-color: var(--bg-primary);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.base-modal-container--sm {
  max-width: 400px;
}

.base-modal-container--md {
  max-width: 600px;
}

.base-modal-container--lg {
  max-width: 800px;
}

.base-modal-container--xl {
  max-width: 1200px;
}

.base-modal-header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border-color-light);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
  position: relative;
}

.base-modal-title {
  margin: 0;
  font-size: var(--font-size-2xl);
  color: var(--text-primary);
}

.base-modal-subtitle {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.base-modal-close {
  position: absolute;
  top: var(--spacing-6);
  right: var(--spacing-6);
  background: none;
  border: none;
  font-size: var(--font-size-4xl);
  color: var(--text-secondary);
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.base-modal-close:hover {
  background-color: var(--bg-secondary);
  color: var(--text-primary);
}

.base-modal-body {
  padding: var(--spacing-6);
  overflow-y: auto;
  flex: 1;
}

.base-modal-footer {
  padding: var(--spacing-6);
  border-top: 1px solid var(--border-color-light);
  background-color: var(--bg-secondary);
  display: flex;
  gap: var(--spacing-3);
  justify-content: flex-end;
}

/* Transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity var(--transition-base);
}

.modal-enter-active .base-modal-container,
.modal-leave-active .base-modal-container {
  transition: transform var(--transition-base);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .base-modal-container,
.modal-leave-to .base-modal-container {
  transform: translateY(-20px) scale(0.95);
}
</style>


