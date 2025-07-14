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
  gap: 1.5rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8));
  backdrop-filter: blur(20px);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 1.5rem;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.user-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
}

.user-card:hover::before {
  opacity: 1;
}

.user-avatar {
  align-self: center;
}

.avatar-image {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 3px solid transparent;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6) padding-box,
              linear-gradient(135deg, #3b82f6, #8b5cf6) border-box;
  object-fit: cover;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.2);
}

.avatar-image:hover {
  transform: scale(1.1);
  box-shadow: 0 15px 35px rgba(59, 130, 246, 0.3);
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
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.stat-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
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
  padding: 1rem 1.5rem;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  border: none;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
  position: relative;
  overflow: hidden;
}

.view-profile-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.view-profile-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
}

.view-profile-btn:hover:not(:disabled)::before {
  left: 100%;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: #9ca3af;
  text-decoration: none;
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  background: rgba(59, 130, 246, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.github-link:hover {
  color: #3b82f6;
  border-color: rgba(59, 130, 246, 0.4);
  background: rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
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
