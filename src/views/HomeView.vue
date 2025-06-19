<template>
  <div class="home-view">
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          <span class="github-logo">🐙</span>
          GitHub Profile Searcher
        </h1>
        <p class="hero-subtitle">
          Descubre y explora perfiles de desarrolladores en GitHub
        </p>
        <p class="hero-description">
          Busca usuarios, revisa sus repositorios más populares y conoce más sobre la comunidad de desarrolladores.
        </p>
      </div>
    </div>

    <div class="search-section">
      <SearchBar
        :loading="searchLoading"
        :error="searchError"
        @search="handleSearch"
      />
      
      <!-- Mostrar sugerencias de búsqueda -->
      <div class="search-suggestions">
        <p class="suggestions-title">Prueba buscar:</p>
        <div class="suggestions-list">
          <button 
            v-for="suggestion in searchSuggestions" 
            :key="suggestion"
            @click="handleSuggestionClick(suggestion)"
            class="suggestion-btn"
            :disabled="searchLoading"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>
    </div>

    <!-- Información adicional -->
    <div class="info-section">
      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon">🔍</div>
          <h3>Búsqueda Avanzada</h3>
          <p>Busca usuarios por nombre, organización o cualquier palabra clave relacionada.</p>
        </div>
        
        <div class="info-card">
          <div class="info-icon">📊</div>
          <h3>Estadísticas Detalladas</h3>
          <p>Ve información completa del perfil incluyendo repositorios, seguidores y contribuciones.</p>
        </div>
        
        <div class="info-card">
          <div class="info-icon">⭐</div>
          <h3>Top Repositorios</h3>
          <p>Descubre los proyectos más populares de cada desarrollador ordenados por estrellas.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SearchBar from '../components/SearchBar.vue';
import { actions } from '../store';
import type { RootState } from '../store';

export default defineComponent({
  name: 'HomeView',
  components: {
    SearchBar,
  },
  setup() {
    const store = useStore<RootState>();
    const router = useRouter();

    // Computadas para acceder al estado del store
    const searchLoading = computed(() => store.state.searchLoading);
    const searchError = computed(() => store.state.searchError);    // Sugerencias de búsqueda para ayudar al usuario
    const searchSuggestions = [
      'Diego22rct',
      'microsoft',
      'facebook',
      'google',
      'torvalds',
      'gaearon',
      'sindresorhus',
      'octocat',
      'defunkt',
    ];

    // Función para manejar la búsqueda
    const handleSearch = async (query: string) => {
      try {
        // Ejecutar la búsqueda en el store
        await store.dispatch(actions.SEARCH_USERS, query);
        
        // Si la búsqueda fue exitosa, navegar a la página de resultados
        if (!store.state.searchError) {
          router.push('/results');
        }
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      }
    };

    // Función para manejar clics en sugerencias
    const handleSuggestionClick = (suggestion: string) => {
      if (!searchLoading.value) {
        handleSearch(suggestion);
      }
    };

    return {
      searchLoading,
      searchError,
      searchSuggestions,
      handleSearch,
      handleSuggestionClick,
    };
  },
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.hero-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
}

.hero-content {
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.2;
}

.github-logo {
  display: inline-block;
  margin-right: 0.5rem;
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 600;
  color: #d1d5db;
  margin: 0 0 1rem 0;
}

.hero-description {
  font-size: 1.125rem;
  color: #9ca3af;
  margin: 0 0 2rem 0;
  line-height: 1.6;
}

.search-section {
  padding: 2rem 1rem;
  background-color: rgba(31, 41, 55, 0.5);
  backdrop-filter: blur(10px);
}

.search-suggestions {
  text-align: center;
  margin-top: 2rem;
}

.suggestions-title {
  font-size: 1rem;
  color: #9ca3af;
  margin: 0 0 1rem 0;
}

.suggestions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.suggestion-btn {
  padding: 0.5rem 1rem;
  background-color: #374151;
  color: #d1d5db;
  border: 1px solid #4b5563;
  border-radius: 2rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-btn:hover:not(:disabled) {
  background-color: #4b5563;
  border-color: #6b7280;
  transform: translateY(-1px);
}

.suggestion-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.info-section {
  padding: 4rem 1rem;
}

.info-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.info-card {
  text-align: center;
  padding: 2rem;
  background-color: rgba(31, 41, 55, 0.5);
  border: 1px solid #374151;
  border-radius: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.info-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.info-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.info-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1rem 0;
}

.info-card p {
  color: #9ca3af;
  line-height: 1.6;
  margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .github-logo {
    font-size: 2rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-description {
    font-size: 1rem;
  }
  
  .info-cards {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .info-card {
    padding: 1.5rem;
  }
}

@media (max-width: 640px) {
  .hero-title {
    font-size: 2rem;
  }
  
  .github-logo {
    font-size: 1.5rem;
    margin-right: 0.25rem;
  }
  
  .suggestions-list {
    gap: 0.375rem;
  }
  
  .suggestion-btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
  }
}
</style>
