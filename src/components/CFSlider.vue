<template>
  <div class="cf-slider">
    <div class="cf-header">
      <label class="cf-label">{{ label }}</label>
      <span class="cf-value">{{ (modelValue * 100).toFixed(0) }}%</span>
    </div>
    <input
      type="range"
      :min="0"
      :max="1"
      :step="0.01"
      :value="modelValue"
      @input="updateValue"
      class="slider"
      :disabled="disabled"
    />
    <div class="cf-labels">
      <span>Tidak Yakin (0%)</span>
      <span>Yakin (100%)</span>
    </div>
  </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
  modelValue: {
    type: Number,
    required: true,
    default: 0.5
  },
  label: {
    type: String,
    default: 'Tingkat Kepastian'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const updateValue = (event) => {
  const value = parseFloat(event.target.value)
  emit('update:modelValue', value)
}
</script>

<style scoped>
.cf-slider {
  margin-bottom: 1.5rem;
}

.cf-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.cf-label {
  font-weight: 500;
  color: #333;
}

.cf-value {
  font-weight: bold;
  color: #667eea;
  font-size: 1.1rem;
}

.slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  background: #e0e0e0;
  outline: none;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  transition: background 0.3s;
}

.slider::-webkit-slider-thumb:hover {
  background: #5568d3;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #667eea;
  cursor: pointer;
  border: none;
  transition: background 0.3s;
}

.slider::-moz-range-thumb:hover {
  background: #5568d3;
}

.slider:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cf-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 0.25rem;
  font-size: 0.85rem;
  color: #666;
}
</style>


