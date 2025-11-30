<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="base-card__header">
      <slot name="header"></slot>
    </div>
    <div class="base-card__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" class="base-card__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default', // default, outlined, elevated
    validator: (value) => ['default', 'outlined', 'elevated'].includes(value)
  },
  hover: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  }
})

const cardClasses = computed(() => {
  return [
    'base-card',
    `base-card--${props.variant}`,
    {
      'base-card--hover': props.hover,
      'base-card--clickable': props.clickable
    }
  ]
})
</script>

<style scoped>
.base-card {
  background-color: var(--bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-base);
}

.base-card--default {
  box-shadow: var(--shadow-sm);
}

.base-card--outlined {
  border: 1px solid var(--border-color);
  box-shadow: none;
}

.base-card--elevated {
  box-shadow: var(--shadow-lg);
}

.base-card--hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.base-card--clickable {
  cursor: pointer;
}

.base-card__header {
  padding: var(--spacing-6);
  border-bottom: 1px solid var(--border-color-light);
}

.base-card__body {
  padding: var(--spacing-6);
}

.base-card__footer {
  padding: var(--spacing-6);
  border-top: 1px solid var(--border-color-light);
  background-color: var(--bg-secondary);
}
</style>


