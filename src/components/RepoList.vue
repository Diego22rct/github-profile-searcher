<template>
  <div class="repo-list">
    <h3 class="repo-list-title">
      🌟 Top 3 Repositorios con más estrellas
    </h3>
    
    <div v-if="repositories.length === 0" class="no-repos">
      <p>No se encontraron repositorios públicos.</p>
    </div>
    
    <div v-else class="repos-grid">
      <div 
        v-for="repo in repositories" 
        :key="repo.id"
        class="repo-card"
      >
        <div class="repo-header">
          <h4 class="repo-name">
            <a 
              :href="repo.html_url" 
              target="_blank" 
              rel="noopener noreferrer"
              class="repo-link"
            >
              {{ repo.name }}
              <span class="external-link">↗</span>
            </a>
          </h4>
          
          <div class="repo-stats">
            <div class="stat">
              <span class="star-icon">⭐</span>
              <span class="star-count">{{ formatStarCount(repo.stargazers_count) }}</span>
            </div>
            
            <div v-if="repo.language" class="language">
              <span class="language-dot" :style="{ backgroundColor: getLanguageColor(repo.language) }"></span>
              {{ repo.language }}
            </div>
          </div>
        </div>
        
        <div class="repo-content">
          <p v-if="repo.description" class="repo-description">
            {{ repo.description }}
          </p>
          <p v-else class="no-description">
            Sin descripción disponible
          </p>
        </div>
        
        <div class="repo-footer">
          <span class="repo-full-name">{{ repo.full_name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { GitHubRepository } from '../services/githubApi';

export default defineComponent({
  name: 'RepoList',
  props: {
    repositories: {
      type: Array as () => GitHubRepository[],
      required: true,
    },
  },
  setup() {
    // Función para formatear el número de estrellas
    const formatStarCount = (count: number): string => {
      if (count >= 1000000) {
        return `${(count / 1000000).toFixed(1)}M`;
      } else if (count >= 1000) {
        return `${(count / 1000).toFixed(1)}k`;
      }
      return count.toString();
    };

    // Función para obtener el color asociado a un lenguaje de programación
    const getLanguageColor = (language: string): string => {
      const languageColors: { [key: string]: string } = {
        JavaScript: '#f1e05a',
        TypeScript: '#2b7489',
        Python: '#3572A5',
        Java: '#b07219',
        'C++': '#f34b7d',
        'C#': '#239120',
        PHP: '#4F5D95',
        Ruby: '#701516',
        Go: '#00ADD8',
        Rust: '#dea584',
        Swift: '#ffac45',
        Kotlin: '#F18E33',
        Dart: '#00B4AB',
        Vue: '#4FC08D',
        React: '#61DAFB',
        HTML: '#e34c26',
        CSS: '#1572B6',
        Shell: '#89e051',
        PowerShell: '#012456',
        Dockerfile: '#384d54',
        Makefile: '#427819',
      };
      
      return languageColors[language] || '#6b7280';
    };

    return {
      formatStarCount,
      getLanguageColor,
    };
  },
});
</script>

<style scoped>
.repo-list {
  width: 100%;
}

.repo-list-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1.5rem 0;
  text-align: center;
}

.no-repos {
  text-align: center;
  padding: 2rem;
  color: #9ca3af;
  font-style: italic;
}

.repos-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.repo-card {
  padding: 1.5rem;
  background-color: #1f2937;
  border: 1px solid #374151;
  border-radius: 0.75rem;
  transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
}

.repo-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  border-color: #4b5563;
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.repo-name {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
  flex: 1;
}

.repo-link {
  color: #3b82f6;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  transition: color 0.2s;
}

.repo-link:hover {
  color: #60a5fa;
  text-decoration: underline;
}

.external-link {
  font-size: 0.875rem;
  opacity: 0.7;
}

.repo-stats {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.stat {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: #fbbf24;
  font-weight: 600;
}

.star-icon {
  font-size: 1rem;
}

.star-count {
  color: #fff;
}

.language {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  color: #d1d5db;
  font-weight: 500;
}

.language-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.repo-content {
  margin-bottom: 1rem;
}

.repo-description {
  color: #d1d5db;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.no-description {
  color: #6b7280;
  font-size: 0.875rem;
  font-style: italic;
  margin: 0;
}

.repo-footer {
  border-top: 1px solid #374151;
  padding-top: 0.75rem;
}

.repo-full-name {
  font-size: 0.75rem;
  color: #9ca3af;
  font-family: 'Courier New', monospace;
}

/* Responsive design */
@media (max-width: 768px) {
  .repos-grid {
    grid-template-columns: 1fr;
  }
  
  .repo-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .repo-stats {
    flex-direction: row;
    gap: 1rem;
    align-items: center;
  }
}

@media (max-width: 640px) {
  .repo-card {
    padding: 1rem;
  }
  
  .repo-list-title {
    font-size: 1.25rem;
  }
}
</style>
