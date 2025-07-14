<template>
  <div class="results-view">
    <!-- Header con nueva búsqueda -->
    <div class="search-header">
      <div class="container">
        <div class="search-controls">
          <router-link to="/" class="back-btn">
            ← Volver al inicio
          </router-link>
          
          <div class="search-bar-wrapper">
            <SearchBar
              :loading="searchLoading"
              :error="searchError"
              :initial-value="searchQuery"
              @search="handleNewSearch"
            />
          </div>
          
          <button 
            v-if="hasSearchResults"
            @click="clearResults"
            class="clear-btn"
            :disabled="searchLoading"
          >
            Limpiar resultados
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <div class="container">
        <!-- Estado de carga -->
        <div v-if="searchLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Buscando usuarios...</p>
        </div>

        <!-- Estado de error -->
        <div v-else-if="searchError" class="error-state">
          <div class="error-icon">⚠️</div>
          <h3>Error en la búsqueda</h3>
          <p>{{ searchError }}</p>
          <button @click="retrySearch" class="retry-btn">
            Intentar de nuevo
          </button>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="!hasSearchResults && searchQuery" class="no-results-state">
          <div class="no-results-icon">🔍</div>
          <h3>No se encontraron resultados</h3>
          <p>No encontramos usuarios que coincidan con "{{ searchQuery }}"</p>
          <div class="suggestions">
            <p>Prueba con:</p>
            <ul>
              <li>Verificar la ortografía</li>
              <li>Usar términos más generales</li>
              <li>Buscar por organización o proyecto</li>
            </ul>
          </div>
        </div>

        <!-- Resultados -->
        <div v-else-if="hasSearchResults" class="results-content">
          <div class="results-header">
            <div class="results-badge">
              <span class="badge-icon">🎯</span>
              <span class="badge-text">Resultados encontrados</span>
            </div>
            <h2 class="results-count">
              {{ searchResults.length }} usuario{{ searchResults.length !== 1 ? 's' : '' }} encontrado{{ searchResults.length !== 1 ? 's' : '' }}
            </h2>
          </div>
          
          <div class="results-grid">
            <UserCard
              v-for="(user, index) in searchResults"
              :key="user.id"
              :user="user"
              :loading="userLoading"
              :style="{ animationDelay: `${index * 0.1}s` }"
              class="user-card-animated"
              @view-profile="handleViewProfile"
            />
          </div>
        </div>

        <!-- Estado inicial (sin búsqueda) -->
        <div v-else class="initial-state">
          <div class="initial-icon">🐙</div>
          <h3>¡Comienza tu búsqueda!</h3>
          <p>Usa la barra de búsqueda para encontrar usuarios de GitHub</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SearchBar from '../components/SearchBar.vue';
import UserCard from '../components/UserCard.vue';
import { actions } from '../store';
import type { RootState } from '../store';

export default defineComponent({
  name: 'ResultsView',
  components: {
    SearchBar,
    UserCard,
  },
  setup() {
    const store = useStore<RootState>();
    const router = useRouter();

    // Computadas para acceder al estado del store
    const searchQuery = computed(() => store.state.searchQuery);
    const searchResults = computed(() => store.state.searchResults);
    const searchLoading = computed(() => store.state.searchLoading);
    const searchError = computed(() => store.state.searchError);
    const userLoading = computed(() => store.state.userLoading);
    const hasSearchResults = computed(() => store.getters.hasSearchResults);

    // Función para manejar nueva búsqueda
    const handleNewSearch = async (query: string) => {
      try {
        await store.dispatch(actions.SEARCH_USERS, query);
      } catch (error) {
        console.error('Error en la búsqueda:', error);
      }
    };

    // Función para ver el perfil de un usuario
    const handleViewProfile = async (username: string) => {
      try {
        // Limpiar datos anteriores del usuario
        await store.dispatch(actions.CLEAR_USER_PROFILE);
        
        // Navegar al perfil del usuario
        router.push(`/profile/${username}`);
      } catch (error) {
        console.error('Error al navegar al perfil:', error);
      }
    };

    // Función para limpiar los resultados
    const clearResults = () => {
      store.dispatch(actions.CLEAR_SEARCH_RESULTS);
    };

    // Función para reintentar la búsqueda
    const retrySearch = () => {
      if (searchQuery.value) {
        handleNewSearch(searchQuery.value);
      }
    };

    // Verificar si hay datos de búsqueda al montar el componente
    onMounted(() => {
      // Si no hay query de búsqueda pero estamos en la página de resultados,
      // redirigir al inicio
      if (!searchQuery.value && !searchLoading.value) {
        router.push('/');
      }
    });

    return {
      searchQuery,
      searchResults,
      searchLoading,
      searchError,
      userLoading,
      hasSearchResults,
      handleNewSearch,
      handleViewProfile,
      clearResults,
      retrySearch,
    };
  },
});
</script>

<style scoped>
.results-view {
  min-height: 100vh;
  background-color: #020917;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.search-header {
  background-color: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #374151;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: space-between;
}

.search-bar-wrapper {
  flex: 1;
  max-width: 400px;
}

.back-btn, .clear-btn {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.back-btn {
  background-color: #374151;
  color: #d1d5db;
  border: 1px solid #4b5563;
}

.back-btn:hover {
  background-color: #4b5563;
  color: #fff;
}

.clear-btn {
  background-color: #dc2626;
  color: #fff;
}

.clear-btn:hover:not(:disabled) {
  background-color: #b91c1c;
}

.clear-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.main-content {
  padding: 2rem 0;
}

/* Estados */
.loading-state, .error-state, .no-results-state, .initial-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #d1d5db;
}

.loading-state .loading-spinner {
  width: 64px;
  height: 64px;
  border: 4px solid #374151;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state .error-icon,
.no-results-state .no-results-icon,
.initial-state .initial-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.error-state h3,
.no-results-state h3,
.initial-state h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #fff;
}

.error-state p,
.no-results-state p,
.initial-state p {
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
  color: #9ca3af;
}

.retry-btn {
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-btn:hover {
  background-color: #2563eb;
}

.suggestions {
  max-width: 400px;
  margin: 0 auto;
  text-align: left;
}

.suggestions p {
  color: #d1d5db;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.suggestions ul {
  color: #9ca3af;
  line-height: 1.6;
}

.suggestions li {
  margin-bottom: 0.25rem;
}

/* Resultados */
.results-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.results-header {
  margin-bottom: 3rem;
  text-align: center;
}

.results-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(59, 130, 246, 0.2));
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 50px;
  backdrop-filter: blur(10px);
}

.badge-icon {
  font-size: 1rem;
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 600;
  background: linear-gradient(135deg, #22c55e, #3b82f6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.results-count {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.5rem;
}

.user-card-animated {
  animation: slideInUp 0.6s ease-out both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive design */
@media (max-width: 768px) {
  .search-controls {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;
  }
  
  .search-bar-wrapper {
    max-width: none;
  }
  
  .back-btn, .clear-btn {
    text-align: center;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

@media (max-width: 640px) {
  .search-header {
    padding: 0.75rem 0;
  }
  
  .container {
    padding: 0 0.75rem;
  }
  
  .search-controls {
    gap: 0.5rem;
  }
  
  .back-btn, .clear-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  .loading-state, .error-state, .no-results-state, .initial-state {
    padding: 2rem 1rem;
  }
}
</style>
