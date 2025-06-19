<template>
  <div class="profile-view">
    <!-- Header de navegación -->
    <div class="nav-header">
      <div class="container">
        <div class="nav-actions">
          <button @click="goBack" class="back-btn">
            ← Volver
          </button>
          
          <div class="nav-info">
            <span v-if="selectedUser" class="current-user">
              @{{ selectedUser.login }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="main-content">
      <div class="container">
        <!-- Estado de carga -->
        <div v-if="userLoading" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Cargando perfil de {{ username }}...</p>
        </div>

        <!-- Estado de error -->
        <div v-else-if="userError" class="error-state">
          <div class="error-icon">⚠️</div>
          <h2>Error al cargar el perfil</h2>
          <p>{{ userError }}</p>
          <div class="error-actions">
            <button @click="retryLoad" class="retry-btn">
              Intentar de nuevo
            </button>
            <button @click="goBack" class="back-error-btn">
              Volver atrás
            </button>
          </div>
        </div>

        <!-- Perfil del usuario -->
        <div v-else-if="selectedUser" class="profile-content">
          <!-- Información principal del usuario -->
          <div class="user-profile">
            <div class="user-header">
              <div class="user-avatar">
                <img 
                  :src="selectedUser.avatar_url" 
                  :alt="`Avatar de ${selectedUser.login}`"
                  class="avatar-image"
                />
              </div>
              
              <div class="user-info">
                <h1 class="username">{{ selectedUser.login }}</h1>
                <h2 v-if="selectedUser.name" class="full-name">{{ selectedUser.name }}</h2>
                <p v-if="selectedUser.bio" class="bio">{{ selectedUser.bio }}</p>
                
                <div class="user-stats">
                  <div class="stat">
                    <span class="stat-value">{{ selectedUser.public_repos || 0 }}</span>
                    <span class="stat-label">Repositorios</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ selectedUser.followers || 0 }}</span>
                    <span class="stat-label">Seguidores</span>
                  </div>
                  <div class="stat">
                    <span class="stat-value">{{ selectedUser.following || 0 }}</span>
                    <span class="stat-label">Siguiendo</span>
                  </div>
                </div>
                
                <div class="user-links">
                  <a 
                    :href="selectedUser.html_url" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    class="github-link"
                  >
                    Ver en GitHub ↗
                  </a>
                </div>
              </div>
            </div>

            <!-- README especial si existe -->
            <div v-if="userReadme" class="user-readme">
              <h3 class="readme-title">📄 README del perfil</h3>
              <div class="readme-content">
                <pre>{{ userReadme }}</pre>
              </div>
            </div>

            <!-- Repositorios destacados -->
            <div class="repositories-section">
              <RepoList :repositories="userRepositories" />
            </div>
          </div>
        </div>

        <!-- Estado cuando no hay usuario -->
        <div v-else class="no-user-state">
          <div class="no-user-icon">👤</div>
          <h2>Usuario no encontrado</h2>
          <p>No se pudo cargar la información del usuario "{{ username }}"</p>
          <button @click="goBack" class="back-btn">
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import { useRouter, useRoute } from 'vue-router';
import RepoList from '../components/RepoList.vue';
import { actions } from '../store';
import type { RootState } from '../store';

export default defineComponent({
  name: 'ProfileView',
  components: {
    RepoList,
  },
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore<RootState>();
    const router = useRouter();
    const route = useRoute();

    // Computadas para acceder al estado del store
    const selectedUser = computed(() => store.state.selectedUser);
    const userRepositories = computed(() => store.state.userRepositories);
    const userReadme = computed(() => store.state.userReadme);
    const userLoading = computed(() => store.state.userLoading);
    const userError = computed(() => store.state.userError);

    // Función para cargar el perfil del usuario
    const loadUserProfile = async (username: string) => {
      try {
        await store.dispatch(actions.LOAD_USER_PROFILE, username);
      } catch (error) {
        console.error('Error al cargar el perfil:', error);
      }
    };

    // Función para reintentar la carga
    const retryLoad = () => {
      loadUserProfile(props.username);
    };

    // Función para volver atrás
    const goBack = () => {
      // Si hay historial, volver atrás, sino ir a resultados o inicio
      if (window.history.length > 1) {
        router.go(-1);
      } else {
        // Si tenemos resultados de búsqueda, ir a resultados, sino a inicio
        const hasSearchResults = store.getters.hasSearchResults;
        router.push(hasSearchResults ? '/results' : '/');
      }
    };

    // Cargar el perfil cuando el componente se monta
    onMounted(() => {
      loadUserProfile(props.username);
    });

    // Recargar cuando cambia el username en la ruta
    watch(
      () => props.username,
      (newUsername) => {
        if (newUsername) {
          loadUserProfile(newUsername);
        }
      }
    );

    return {
      selectedUser,
      userRepositories,
      userReadme,
      userLoading,
      userError,
      retryLoad,
      goBack,
    };
  },
});
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background-color: #020917;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.nav-header {
  background-color: rgba(31, 41, 55, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #374151;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
}

.nav-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.back-btn, .back-error-btn {
  padding: 0.75rem 1rem;
  background-color: #374151;
  color: #d1d5db;
  border: 1px solid #4b5563;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.back-btn:hover, .back-error-btn:hover {
  background-color: #4b5563;
  color: #fff;
}

.nav-info {
  font-size: 1rem;
  color: #9ca3af;
}

.current-user {
  font-family: 'Courier New', monospace;
  color: #3b82f6;
  font-weight: 600;
}

.main-content {
  padding: 2rem 0;
}

/* Estados */
.loading-state, .error-state, .no-user-state {
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
.no-user-state .no-user-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: block;
}

.error-state h2,
.no-user-state h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
  color: #fff;
}

.error-state p,
.no-user-state p {
  font-size: 1.125rem;
  margin: 0 0 2rem 0;
  color: #9ca3af;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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

/* Perfil del usuario */
.profile-content {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.user-profile {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.user-header {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  align-items: start;
  padding: 2rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 1rem;
}

.user-avatar {
  grid-row: span 2;
}

.avatar-image {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  border: 4px solid #3b82f6;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.username {
  font-size: 2.5rem;
  font-weight: 800;
  color: #3b82f6;
  margin: 0;
  font-family: 'Courier New', monospace;
}

.full-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.bio {
  font-size: 1.125rem;
  color: #d1d5db;
  line-height: 1.6;
  margin: 0;
}

.user-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  font-size: 0.875rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
}

.user-links {
  margin-top: 1rem;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: #374151;
  color: #d1d5db;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.2s;
}

.github-link:hover {
  background-color: #4b5563;
  color: #3b82f6;
}

/* README */
.user-readme {
  padding: 2rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 1rem;
}

.readme-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1rem 0;
}

.readme-content {
  background-color: #111827;
  border: 1px solid #374151;
  border-radius: 0.5rem;
  padding: 1.5rem;
  overflow-x: auto;
}

.readme-content pre {
  color: #d1d5db;
  font-family: 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
}

/* Repositorios */
.repositories-section {
  padding: 2rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 1rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .user-header {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 1.5rem;
  }
  
  .user-avatar {
    grid-row: auto;
    justify-self: center;
  }
  
  .avatar-image {
    width: 120px;
    height: 120px;
  }
  
  .username {
    font-size: 2rem;
  }
  
  .full-name {
    font-size: 1.25rem;
  }
  
  .user-stats {
    justify-content: center;
    gap: 1.5rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 0 0.75rem;
  }
  
  .user-header,
  .user-readme,
  .repositories-section {
    padding: 1.5rem;
  }
  
  .username {
    font-size: 1.75rem;
  }
  
  .avatar-image {
    width: 100px;
    height: 100px;
  }
  
  .user-stats {
    gap: 1rem;
  }
  
  .stat-value {
    font-size: 1.25rem;
  }
  
  .readme-content {
    padding: 1rem;
  }
  
  .readme-content pre {
    font-size: 0.8rem;
  }
}
</style>
