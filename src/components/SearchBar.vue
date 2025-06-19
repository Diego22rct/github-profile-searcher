<template>
  <div class="search-bar">
    <form @submit.prevent="handleSubmit" class="search-form">
      <div class="search-input-group">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Buscar usuario de GitHub..."
          class="search-input"
          :disabled="loading"
          ref="searchInput"
        />
        <button
          type="submit"
          class="search-button"
          :disabled="loading || !searchQuery.trim()"
        >
          <span v-if="loading" class="loading-spinner"></span>
          <span v-else>🔍</span>
          {{ loading ? 'Buscando...' : 'Buscar' }}
        </button>
      </div>
    </form>
    
    <!-- Mostrar error si existe -->
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'SearchBar',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    error: {
      type: String,
      default: null,
    },
    initialValue: {
      type: String,
      default: '',
    },
  },
  emits: ['search'],
  setup(props, { emit }) {
    // Estado reactivo del componente
    const searchQuery = ref(props.initialValue);
    const searchInput = ref<HTMLInputElement | null>(null);

    // Función para manejar el envío del formulario
    const handleSubmit = () => {
      const query = searchQuery.value.trim();
      if (query) {
        emit('search', query);
      }
    };

    // Enfocar el input al montar el componente
    onMounted(() => {
      if (searchInput.value) {
        searchInput.value.focus();
      }
    });

    return {
      searchQuery,
      searchInput,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
.search-bar {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.search-form {
  margin-bottom: 1rem;
}

.search-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: stretch;
}

.search-input {
  flex: 1;
  padding: 1rem;
  font-size: 1rem;
  border: 2px solid #374151;
  border-radius: 0.5rem;
  background-color: #1f2937;
  color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-input::placeholder {
  color: #9ca3af;
}

.search-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background-color: #3b82f6;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.search-button:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.search-button:active:not(:disabled) {
  transform: translateY(0);
}

.search-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  padding: 1rem;
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.5rem;
  color: #dc2626;
  font-weight: 500;
  text-align: center;
}

/* Responsive design */
@media (max-width: 640px) {
  .search-input-group {
    flex-direction: column;
  }
  
  .search-button {
    justify-content: center;
  }
}
</style>
