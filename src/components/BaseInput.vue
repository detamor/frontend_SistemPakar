<template>
  <div class="base-input-wrapper">
    <label v-if="label" :for="inputId" class="base-input-label">
      {{ label }}
      <span v-if="required" class="base-input-required">*</span>
    </label>
    <div class="base-input-container">
      <span v-if="prefixIcon" class="base-input-prefix">{{ prefixIcon }}</span>
      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :class="inputClasses"
        @input="$emit('update:modelValue', $event.target.value)"
        @blur="$emit('blur', $event)"
        @focus="$emit('focus', $event)"
      />
      <span v-if="suffixIcon" class="base-input-suffix">{{ suffixIcon }}</span>
    </div>
    <p v-if="error" class="base-input-error">{{ error }}</p>
    <p v-if="hint && !error" class="base-input-hint">{{ hint }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  required: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: ''
  },
  hint: {
    type: String,
    default: ''
  },
  prefixIcon: {
    type: String,
    default: ''
  },
  suffixIcon: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

defineEmits(['update:modelValue', 'blur', 'focus'])

const inputId = computed(() => `input-${Math.random().toString(36).substr(2, 9)}`)

const inputClasses = computed(() => {
  return [
    'base-input',
    `base-input--${props.size}`,
    {
      'base-input--error': props.error,
      'base-input--disabled': props.disabled,
      'base-input--with-prefix': props.prefixIcon,
      'base-input--with-suffix': props.suffixIcon
    }
  ]
})
</script>

<style scoped>
.base-input-wrapper {
  width: 100%;
  margin-bottom: var(--spacing-4);
}

.base-input-label {
  display: block;
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
  font-size: var(--font-size-sm);
}

.base-input-required {
  color: var(--color-danger);
  margin-left: var(--spacing-1);
}

.base-input-container {
  position: relative;
  display: flex;
  align-items: center;
}

.base-input {
  width: 100%;
  font-family: var(--font-primary);
  font-size: var(--font-size-base);
  color: var(--text-primary);
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  outline: none;
}

.base-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

.base-input--error {
  border-color: var(--color-danger);
}

.base-input--error:focus {
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.base-input--disabled {
  background-color: var(--bg-secondary);
  cursor: not-allowed;
  opacity: 0.6;
}

.base-input--sm {
  padding: var(--spacing-2) var(--spacing-3);
  font-size: var(--font-size-sm);
}

.base-input--md {
  padding: var(--spacing-3) var(--spacing-4);
  font-size: var(--font-size-base);
}

.base-input--lg {
  padding: var(--spacing-4) var(--spacing-5);
  font-size: var(--font-size-lg);
}

.base-input--with-prefix {
  padding-left: var(--spacing-10);
}

.base-input--with-suffix {
  padding-right: var(--spacing-10);
}

.base-input-prefix,
.base-input-suffix {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  font-size: var(--font-size-lg);
  pointer-events: none;
}

.base-input-prefix {
  left: var(--spacing-3);
}

.base-input-suffix {
  right: var(--spacing-3);
}

.base-input-error {
  margin-top: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--color-danger);
}

.base-input-hint {
  margin-top: var(--spacing-1);
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}
</style>


