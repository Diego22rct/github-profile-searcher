<template>
  <div class="user-card">
    <div class="user-avatar">
      <img 
        :src="user.avatar_url" 
        :alt="`Avatar de ${user.login}`"
        class="avatar-image"
        @error="handleImageError"
      />
    </div>
    
    <div class="user-info">
      <h3 class="username">{{ user.login }}</h3>
      <p v-if="user.name" class="full-name">{{ user.name }}</p>
      <p v-if="user.bio" class="bio">{{ user.bio }}</p>
      
      <div class="user-stats">
        <div class="stat">
          <span class="stat-label">Repos:</span>
          <span class="stat-value">{{ user.public_repos || 0 }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Seguidores:</span>
          <span class="stat-value">{{ user.followers || 0 }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Siguiendo:</span>
          <span class="stat-value">{{ user.following || 0 }}</span>
        </div>
      </div>
    </div>
    
    <div class="user-actions">
      <button 
        @click="handleViewProfile"
        class="view-profile-btn"
        :disabled="loading"
      >
        <span v-if="loading" class="loading-spinner"></span>
        Ver Perfil
      </button>
      
      <a 
        :href="user.html_url" 
        target="_blank" 
        rel="noopener noreferrer"
        class="github-link"
      >
        Ver en GitHub ↗
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { GitHubUser } from '../services/githubApi';

export default defineComponent({
  name: 'UserCard',
  props: {
    user: {
      type: Object as () => GitHubUser,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['view-profile'],
  setup(props, { emit }) {
    // Estado para manejar errores de carga de imagen
    const imageError = ref(false);

    // Función para manejar errores en la carga de imagen
    const handleImageError = () => {
      imageError.value = true;
    };

    // Función para emitir evento de ver perfil
    const handleViewProfile = () => {
      emit('view-profile', props.user.login);
    };

    return {
      imageError,
      handleImageError,
      handleViewProfile,
    };
  },
});
</script>

<style scoped>
.user-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border-color: #4b5563;
}

.user-avatar {
  align-self: center;
}

.avatar-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 3px solid #3b82f6;
  object-fit: cover;
  transition: transform 0.2s;
}

.avatar-image:hover {
  transform: scale(1.05);
}

.user-info {
  text-align: center;
  flex: 1;
}

.username {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3b82f6;
  margin: 0 0 0.5rem 0;
}

.full-name {
  font-size: 1rem;
  font-weight: 600;
  color: #d1d5db;
  margin: 0 0 0.5rem 0;
}

.bio {
  font-size: 0.875rem;
  color: #9ca3af;
  margin: 0 0 1rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  gap: 0.5rem;
  margin-top: 1rem;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.stat-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
}

.user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.view-profile-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.1s;
}

.view-profile-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.view-profile-btn:active:not(:disabled) {
  transform: translateY(0);
}

.view-profile-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.github-link {
  display: block;
  text-align: center;
  padding: 0.5rem 1rem;
  color: #9ca3af;
  text-decoration: none;
  border: 1px solid #4b5563;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  transition: color 0.2s, border-color 0.2s;
}

.github-link:hover {
  color: #3b82f6;
  border-color: #3b82f6;
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

/* Responsive design */
@media (max-width: 640px) {
  .user-card {
    padding: 1rem;
  }
  
  .user-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .stat {
    flex-direction: row;
    justify-content: space-between;
  }
}
</style>
