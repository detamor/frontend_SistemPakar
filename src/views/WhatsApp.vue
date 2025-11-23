<template>
  <div class="whatsapp">
    <h1>WhatsApp Integration</h1>
    <div class="form-container">
      <form @submit.prevent="sendMessage">
        <div class="form-group">
          <label for="phone">Nomor Telepon:</label>
          <input
            id="phone"
            v-model="form.phone_number"
            type="text"
            placeholder="6281234567890"
            required
          />
        </div>
        <div class="form-group">
          <label for="message">Pesan:</label>
          <textarea
            id="message"
            v-model="form.message"
            rows="5"
            placeholder="Masukkan pesan..."
            required
          ></textarea>
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Mengirim...' : 'Kirim Pesan' }}
        </button>
      </form>
      
      <div v-if="response" class="response">
        <h3>Response:</h3>
        <pre>{{ JSON.stringify(response, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useWhatsAppStore } from '../stores/whatsapp'

const whatsappStore = useWhatsAppStore()

const form = ref({
  phone_number: '',
  message: ''
})

const loading = ref(false)
const response = ref(null)

const sendMessage = async () => {
  loading.value = true
  response.value = null
  
  try {
    const result = await whatsappStore.sendMessage({
      phone_number: form.value.phone_number,
      message: form.value.message
    })
    response.value = result
    
    if (result.success) {
      form.value.phone_number = ''
      form.value.message = ''
    }
  } catch (error) {
    response.value = {
      success: false,
      error: error.message
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.whatsapp {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.form-container {
  background: #f5f5f5;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

button {
  background: #25D366;
  color: white;
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
}

button:hover:not(:disabled) {
  background: #20BA5A;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.response {
  margin-top: 2rem;
  padding: 1rem;
  background: white;
  border-radius: 4px;
}

.response pre {
  background: #f5f5f5;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}
</style>



