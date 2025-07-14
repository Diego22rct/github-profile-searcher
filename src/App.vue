<template>
  <div id="app">
    <!-- Router view con transiciones suaves -->
    <router-view v-slot="{ Component, route }">
      <transition :name="getTransitionName(route)" mode="out-in">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
    
    <!-- Footer opcional -->
    <footer class="app-footer">
      <div class="footer-content">
        <p>&copy; {{ currentYear }} GitHub Profile Searcher - Hecho con Vue.js y ❤️ por @Diego22rct</p>
        <p class="footer-note">
          Datos proporcionados por la 
          <a href="https://docs.github.com/en/rest" target="_blank" rel="noopener noreferrer">
            API de GitHub
          </a>
        </p>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { RouteLocationNormalized } from 'vue-router';

export default defineComponent({
  name: 'App',
  setup() {
    // Año actual dinámico
    const currentYear = computed(() => new Date().getFullYear());

    // Función para determinar el tipo de transición basado en la ruta
    const getTransitionName = (route: RouteLocationNormalized) => {
      // Transiciones específicas según la navegación
      if (route.name === 'Home') return 'slide-right';
      if (route.name === 'Results') return 'slide-left';
      if (route.name === 'Profile') return 'slide-up';
      return 'fade';
    };

    return {
      currentYear,
      getTransitionName,
    };
  },
});
</script>

<style>
/* Estilos globales */
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  color: #fff;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  background-image: linear-gradient(to bottom, #020917, #101725);
  min-height: 100vh;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Estilos del footer */
.app-footer {
  margin-top: auto;
  background-color: rgba(31, 41, 55, 0.5);
  border-top: 1px solid #374151;
  padding: 2rem 1rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  color: #9ca3af;
}

.footer-content p {
  margin: 0.5rem 0;
  font-size: 0.875rem;
}

.footer-note a {
  color: #3b82f6;
  text-decoration: none;
  transition: color 0.2s;
}

.footer-note a:hover {
  color: #60a5fa;
  text-decoration: underline;
}

/* Utilidades globales */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Transiciones de página */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active, .slide-left-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}
.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0;
}

.slide-right-enter-active, .slide-right-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0;
}
.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.slide-up-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Animaciones globales mejoradas */
@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px);
  }
  to { 
    opacity: 1; 
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from { 
    transform: translateY(30px); 
    opacity: 0; 
  }
  to { 
    transform: translateY(0); 
    opacity: 1; 
  }
}

@keyframes pulse {
  0%, 100% { 
    transform: scale(1); 
  }
  50% { 
    transform: scale(1.05); 
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Responsive utilities */
@media (max-width: 640px) {
  .app-footer {
    padding: 1.5rem 0.75rem;
  }
}
</style>
