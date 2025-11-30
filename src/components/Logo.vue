<template>
  <img 
    :src="logoPath" 
    :alt="alt || 'System Pakar Logo'"
    :class="[
      'object-contain rounded-lg',
      sizeClass
    ]"
  />
</template>

<script setup>
import { computed } from 'vue'
import logoImage from '../assets/logo-hydrangea.png'

const props = defineProps({
  size: {
    type: String,
    default: 'md', // xs, sm, md, lg, xl
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl', 'custom'].includes(value)
  },
  customSize: {
    type: String,
    default: null
  },
  alt: {
    type: String,
    default: 'System Pakar Logo'
  }
})

const logoPath = computed(() => logoImage)

const sizeClass = computed(() => {
  if (props.customSize) {
    return props.customSize
  }
  
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  return sizes[props.size] || sizes.md
})
</script>

