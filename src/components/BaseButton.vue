<template>
  <button
    :type="type"
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="button-loader"></span>
    <span v-else-if="icon" class="button-icon">{{ icon }}</span>
    <slot></slot>
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary', // primary, secondary, success, danger, warning, outline, ghost
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning', 'outline', 'ghost'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  type: {
    type: String,
    default: 'button'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])

const buttonClasses = computed(() => {
  return [
    'base-button',
    `base-button--${props.variant}`,
    `base-button--${props.size}`,
    {
      'base-button--full-width': props.fullWidth,
      'base-button--loading': props.loading
    }
  ]
})
</script>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-2);
  font-family: var(--font-primary);
  font-weight: var(--font-weight-medium);
  border: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  text-decoration: none;
}

.base-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.base-button--sm {
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
}

.base-button--md {
  padding: var(--spacing-3) var(--spacing-6);
  font-size: var(--font-size-base);
}

.base-button--lg {
  padding: var(--spacing-4) var(--spacing-8);
  font-size: var(--font-size-lg);
}

.base-button--full-width {
  width: 100%;
}

/* Variants */
.base-button--primary {
  background-color: var(--color-primary);
  color: var(--text-white);
}

.base-button--primary:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--secondary {
  background-color: var(--color-secondary);
  color: var(--text-white);
}

.base-button--secondary:hover:not(:disabled) {
  background-color: var(--color-secondary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--success {
  background-color: var(--color-success);
  color: var(--text-white);
}

.base-button--success:hover:not(:disabled) {
  background-color: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--danger {
  background-color: var(--color-danger);
  color: var(--text-white);
}

.base-button--danger:hover:not(:disabled) {
  background-color: #c0392b;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--warning {
  background-color: var(--color-warning);
  color: var(--text-white);
}

.base-button--warning:hover:not(:disabled) {
  background-color: var(--color-accent-dark);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.base-button--outline {
  background-color: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.base-button--outline:hover:not(:disabled) {
  background-color: var(--color-primary);
  color: var(--text-white);
}

.base-button--ghost {
  background-color: transparent;
  color: var(--text-primary);
}

.base-button--ghost:hover:not(:disabled) {
  background-color: var(--bg-secondary);
}

/* Loading */
.base-button--loading {
  pointer-events: none;
}

.button-loader {
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.button-icon {
  font-size: 1.2em;
}
</style>


