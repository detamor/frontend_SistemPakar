<template>
  <a
    :href="whatsappUrl"
    target="_blank"
    rel="noopener noreferrer"
    :class="buttonClasses"
    class="whatsapp-button"
  >
    <svg class="whatsapp-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.977 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .96 4.534.96 10.082c0 1.792.413 3.476 1.14 4.996L0 24l9.068-2.37a11.722 11.722 0 005.58 1.414h.005c6.554 0 11.89-5.335 11.89-11.888 0-3.176-1.24-6.165-3.495-8.411"/>
    </svg>
    <span class="whatsapp-text">{{ text }}</span>
  </a>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  phone: {
    type: String,
    required: true
  },
  message: {
    type: String,
    default: ''
  },
  text: {
    type: String,
    default: 'Chat WhatsApp'
  },
  variant: {
    type: String,
    default: 'primary', // primary, floating, outline
    validator: (value) => ['primary', 'floating', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'md', // sm, md, lg
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

const whatsappUrl = computed(() => {
  // Format nomor: hapus semua karakter non-digit, pastikan dimulai dengan 62
  let phoneNumber = props.phone.replace(/\D/g, '')
  if (phoneNumber.startsWith('0')) {
    phoneNumber = '62' + phoneNumber.substring(1)
  } else if (!phoneNumber.startsWith('62')) {
    phoneNumber = '62' + phoneNumber
  }
  
  const encodedMessage = encodeURIComponent(props.message || 'Halo, saya ingin berkonsultasi tentang tanaman hias.')
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
})

const buttonClasses = computed(() => {
  return [
    `whatsapp-button--${props.variant}`,
    `whatsapp-button--${props.size}`
  ]
})
</script>

<style scoped>
.whatsapp-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

.whatsapp-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Variants */
.whatsapp-button--primary {
  background-color: #25D366;
  color: white;
  box-shadow: 0 4px 6px rgba(37, 211, 102, 0.3);
}

.whatsapp-button--primary:hover {
  background-color: #20BA5A;
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(37, 211, 102, 0.4);
}

.whatsapp-button--floating {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: #25D366;
  color: white;
  box-shadow: 0 8px 16px rgba(37, 211, 102, 0.4);
  z-index: 1000;
  padding: 0;
  justify-content: center;
}

.whatsapp-button--floating:hover {
  background-color: #20BA5A;
  transform: scale(1.1);
  box-shadow: 0 12px 24px rgba(37, 211, 102, 0.5);
}

.whatsapp-button--floating .whatsapp-icon {
  width: 32px;
  height: 32px;
}

.whatsapp-button--floating .whatsapp-text {
  display: none;
}

.whatsapp-button--outline {
  background-color: transparent;
  color: #25D366;
  border: 2px solid #25D366;
}

.whatsapp-button--outline:hover {
  background-color: #25D366;
  color: white;
}

/* Sizes */
.whatsapp-button--sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.whatsapp-button--sm .whatsapp-icon {
  width: 16px;
  height: 16px;
}

.whatsapp-button--md {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.whatsapp-button--lg {
  padding: 1rem 2rem;
  font-size: 1.125rem;
}

.whatsapp-button--lg .whatsapp-icon {
  width: 24px;
  height: 24px;
}
</style>

