<template>
  <div class="home-view">
    <!-- Fondo animado con partículas -->
    <div class="animated-background">
      <div class="particle" v-for="n in 20" :key="n" :style="getParticleStyle(n)"></div>
    </div>
    
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-badge">
          <span class="badge-text">✨ Explora GitHub como nunca antes</span>
        </div>
        
        <h1 class="hero-title">
          <span class="github-logo">🐙</span>
          <span class="title-text">GitHub Profile</span>
          <span class="title-highlight">Searcher</span>
        </h1>
        
        <p class="hero-subtitle">
          Descubre, explora y conecta con desarrolladores de todo el mundo
        </p>
        
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-number">1M+</span>
            <span class="stat-label">Desarrolladores</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">∞</span>
            <span class="stat-label">Repositorios</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">24/7</span>
            <span class="stat-label">Disponible</span>
          </div>
        </div>
      </div>
    </div>

    <div class="search-section">
      <div class="search-container">
        <h2 class="search-title">Comienza tu búsqueda</h2>
        <SearchBar
          :loading="searchLoading"
          :error="searchError"
          @search="handleSearch"
        />
        
        <!-- Sugerencias mejoradas -->
        <div class="search-suggestions">
          <p class="suggestions-title">Perfiles populares:</p>
          <div class="suggestions-grid">
            <button 
              v-for="(suggestion, index) in searchSuggestions" 
              :key="suggestion"
              @click="handleSuggestionClick(suggestion)"
              class="suggestion-chip"
              :disabled="searchLoading"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <span class="chip-icon">👤</span>
              {{ suggestion }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sección de características mejorada -->
    <div class="features-section">
      <div class="features-header">
        <h2 class="features-title">¿Por qué elegir GitHub Profile Searcher?</h2>
        <p class="features-subtitle">Herramientas poderosas para explorar el ecosistema de GitHub</p>
      </div>
      
      <div class="features-grid">
        <div class="feature-card" v-for="(feature, index) in features" :key="index">
          <div class="feature-icon" :style="{ background: feature.gradient }">
            {{ feature.icon }}
          </div>
          <h3 class="feature-title">{{ feature.title }}</h3>
          <p class="feature-description">{{ feature.description }}</p>
          <div class="feature-highlight"></div>
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
    ];

    // Características de la aplicación
    const features = [
      {
        icon: '🔍',
        title: 'Búsqueda Inteligente',
        description: 'Encuentra desarrolladores por nombre, organización o tecnología con resultados instantáneos.',
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      },
      {
        icon: '📊',
        title: 'Analytics Completos',
        description: 'Estadísticas detalladas de repositorios, seguidores, contribuciones y actividad.',
        gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
      },
      {
        icon: '⭐',
        title: 'Top Repositorios',
        description: 'Descubre los proyectos más populares ordenados por estrellas y relevancia.',
        gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
      },
      {
        icon: '📱',
        title: 'Responsive Design',
        description: 'Experiencia perfecta en cualquier dispositivo, desde móvil hasta desktop.',
        gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
      },
      {
        icon: '🚀',
        title: 'Rendimiento Óptimo',
        description: 'Carga rápida con lazy loading y optimizaciones avanzadas de performance.',
        gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
      },
      {
        icon: '🔒',
        title: 'Seguro y Confiable',
        description: 'Integración oficial con GitHub API, sin almacenamiento de datos personales.',
        gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
      }
    ];

    // Función para generar estilos de partículas animadas
    const getParticleStyle = (index: number) => {
      const size = Math.random() * 4 + 2;
      const duration = Math.random() * 20 + 10;
      const delay = Math.random() * 5;
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${x}%`,
        top: `${y}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      };
    };

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
      features,
      getParticleStyle,
      handleSearch,
      handleSuggestionClick,
    };
  },
});
</script>

<style scoped>
.home-view {
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
}

/* Fondo animado con partículas */
.animated-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
}

.particle {
  position: absolute;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6);
  border-radius: 50%;
  opacity: 0.1;
  animation: float-particle infinite linear;
}

@keyframes float-particle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 0.1;
  }
  90% {
    opacity: 0.1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

/* Sección Hero */
.hero-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem;
  text-align: center;
  background: radial-gradient(ellipse at center, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
  animation: fadeInUp 1s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-badge {
  display: inline-block;
  margin-bottom: 2rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 50px;
  backdrop-filter: blur(10px);
  animation: pulse 2s infinite;
}

.badge-text {
  font-size: 0.875rem;
  font-weight: 600;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  margin: 0 0 2rem 0;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.github-logo {
  display: inline-block;
  margin-right: 1rem;
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  50% { 
    transform: translateY(-15px) rotate(5deg); 
  }
}

.title-text {
  background: linear-gradient(135deg, #fff 0%, #e5e7eb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.title-highlight {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #06b6d4 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
  margin-top: 0.5rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  font-weight: 500;
  color: #9ca3af;
  margin: 0 0 3rem 0;
  line-height: 1.6;
}

.hero-stats {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-top: 0.25rem;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, #374151, transparent);
}

/* Sección de búsqueda */
.search-section {
  padding: 4rem 1rem;
  background: linear-gradient(135deg, rgba(31, 41, 55, 0.8), rgba(17, 24, 39, 0.8));
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(59, 130, 246, 0.1);
}

.search-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.search-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 2rem 0;
}

.search-suggestions {
  margin-top: 3rem;
}

.suggestions-title {
  font-size: 1rem;
  color: #9ca3af;
  margin: 0 0 1.5rem 0;
  font-weight: 500;
}

.suggestions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  justify-content: center;
}

.suggestion-chip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 50px;
  color: #e5e7eb;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  animation: slideInUp 0.6s ease-out both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestion-chip:hover:not(:disabled) {
  background: rgba(59, 130, 246, 0.2);
  border-color: rgba(59, 130, 246, 0.4);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(59, 130, 246, 0.2);
}

.chip-icon {
  font-size: 1rem;
}

.suggestion-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sección de características */
.features-section {
  padding: 6rem 1rem;
  background: linear-gradient(135deg, #020917 0%, #0f172a 100%);
}

.features-header {
  text-align: center;
  margin-bottom: 4rem;
}

.features-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #fff 0%, #e5e7eb 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.features-subtitle {
  font-size: 1.125rem;
  color: #9ca3af;
  margin: 0;
  font-weight: 400;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  position: relative;
  padding: 2.5rem;
  background: rgba(31, 41, 55, 0.5);
  border: 1px solid rgba(59, 130, 246, 0.1);
  border-radius: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.feature-card::before {
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

.feature-card:hover {
  transform: translateY(-8px);
  border-color: rgba(59, 130, 246, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  width: 60px;
  height: 60px;
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  overflow: hidden;
}

.feature-icon::before {
  content: '';
  position: absolute;
  inset: 0;
  background: inherit;
  opacity: 0.1;
  border-radius: inherit;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #fff;
  margin: 0 0 1rem 0;
}

.feature-description {
  color: #9ca3af;
  line-height: 1.6;
  margin: 0;
  font-size: 0.95rem;
}

.feature-highlight {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), transparent);
  transform: scaleX(0);
  transition: transform 0.3s;
}

.feature-card:hover .feature-highlight {
  transform: scaleX(1);
}

/* Responsive design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .github-logo {
    font-size: 2.5rem;
    margin-right: 0.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-stats {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .stat-divider {
    width: 40px;
    height: 1px;
    transform: rotate(90deg);
  }
  
  .search-title {
    font-size: 1.5rem;
  }
  
  .features-title {
    font-size: 2rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .feature-card {
    padding: 2rem;
  }
}

@media (max-width: 640px) {
  .hero-section {
    padding: 2rem 1rem;
  }
  
  .hero-title {
    font-size: 2rem;
  }
  
  .github-logo {
    font-size: 2rem;
  }
  
  .hero-badge {
    padding: 0.5rem 1rem;
  }
  
  .badge-text {
    font-size: 0.8rem;
  }
  
  .suggestions-grid {
    gap: 0.5rem;
  }
  
  .suggestion-chip {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
  
  .features-section {
    padding: 4rem 1rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
