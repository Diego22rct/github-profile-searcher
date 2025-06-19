import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ResultsView from '../views/ResultsView.vue';
import ProfileView from '../views/ProfileView.vue';

// Definición de las rutas de la aplicación
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      title: 'GitHub Profile Searcher - Inicio',
    },
  },
  {
    path: '/results',
    name: 'Results',
    component: ResultsView,
    meta: {
      title: 'Resultados de búsqueda - GitHub Profile Searcher',
    },
  },
  {
    path: '/profile/:username',
    name: 'Profile',
    component: ProfileView,
    props: true, // Permite pasar el parámetro username como prop al componente
    meta: {
      title: 'Perfil de usuario - GitHub Profile Searcher',
    },
  },
  {
    // Ruta para manejar 404 (páginas no encontradas)
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/',
  },
];

// Crear el router con historial HTML5
const router = createRouter({
  history: createWebHistory(),
  routes,  // Scroll behavior para mejorar la experiencia de usuario
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

// Guard de navegación para actualizar el título de la página
router.beforeEach((to, _from, next) => {
  // Actualizar el título de la página basado en la meta información
  if (to.meta && to.meta.title) {
    document.title = to.meta.title as string;
  } else {
    document.title = 'GitHub Profile Searcher';
  }
  
  next();
});

export default router;
