import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './index.css';

// Crear la aplicación Vue
const app = createApp(App);

// Usar el router y el store
app.use(router);
app.use(store);

// Montar la aplicación
app.mount('#root');
