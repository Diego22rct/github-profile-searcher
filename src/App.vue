<template>
  <div id="app">
    <!-- Router view para mostrar las diferentes páginas -->
    <router-view />
    
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

export default defineComponent({
  name: 'App',
  setup() {
    // Año actual dinámico
    const currentYear = computed(() => new Date().getFullYear());

    return {
      currentYear,
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

/* Animaciones globales */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

/* Responsive utilities */
@media (max-width: 640px) {
  .app-footer {
    padding: 1.5rem 0.75rem;
  }
}
</style>
