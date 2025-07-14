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
  max-width: 700px;
  margin: 0 auto;
}

.search-form {
  margin-bottom: 1rem;
}

.search-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
  padding: 0.5rem;
  background: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.search-input-group:focus-within {
  border-color: rgba(59, 130, 246, 0.5);
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  font-size: 1rem;
  border: none;
  border-radius: 1rem;
  background: transparent;
  color: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.search-input:focus {
  outline: none;
}

.search-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.search-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
  min-width: 120px;
}

.search-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.search-button:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.search-button:hover:not(:disabled)::before {
  left: 100%;
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
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #fff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  margin-top: 1rem;
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(220, 38, 38, 0.1));
  backdrop-filter: blur(10px);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 1rem;
  color: #fca5a5;
  font-weight: 500;
  text-align: center;
  animation: slideInDown 0.3s ease-out;
}

@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 640px) {
  .search-input-group {
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
  }
  
  .search-input {
    padding: 1rem;
  }
  
  .search-button {
    justify-content: center;
    padding: 1rem;
  }
}
</style>
