# 🔍 GitHub Profile Searcher

[![Vue.js](https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vue.js&logoColor=4FC08D)](https://vuejs.org/)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=fff)](https://axios-http.com/)
[![GitHub API](https://img.shields.io/badge/GitHub%20API-181717?style=for-the-badge&logo=github&logoColor=white)](https://docs.github.com/en/rest)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**GitHub Profile Searcher** es una aplicación web construida con Vue.js que permite buscar usuarios en GitHub, explorar sus perfiles y ver sus repositorios más populares. Este proyecto fue desarrollado como parte de una entrevista técnica para demostrar habilidades con Vue, Vuex, Vue Router, Axios y consumo de APIs REST.

## 🚀 Características

- Búsqueda de usuarios de GitHub mediante la API pública de GitHub.
- Listado de resultados con avatar, nombre y enlace al perfil.
- Navegación hacia la vista de detalles del usuario.
- Visualización del `README.md` (si existe) del repositorio personal.
- Visualización de los 3 repositorios con más estrellas del usuario.
- UI simple, responsive y fácil de navegar.

## 🖼️ Capturas de pantalla

> Próximamente...

## 🛠️ Tecnologías utilizadas

- [Vue.js](https://vuejs.org/)
- [Vuex](https://vuex.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios](https://axios-http.com/)
- [Babel](https://babeljs.io/)
- [GitHub REST API](https://docs.github.com/en/rest)

## 📦 Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/Diego22rct/github-profile-searcher.git
cd github-profile-searcher
```

2. Instala las dependencias:

```bash
npm install
```

3. Ejecuta la app en desarrollo:

```bash
npm run dev
```

4. Abre tu navegador y visita:  
`http://localhost:8080`

## 🧪 Scripts disponibles

| Script         | Descripción                          |
|----------------|--------------------------------------|
| `npm run serve`| Inicia el servidor de desarrollo     |
| `npm run build`| Compila la aplicación para producción|
| `npm run lint` | Ejecuta linter sobre el código       |

## 📁 Estructura del proyecto

```
src/
├── components/
│   ├── SearchBar.vue
│   ├── UserCard.vue
│   └── RepoList.vue
├── views/
│   ├── HomeView.vue
│   ├── ResultsView.vue
│   └── ProfileView.vue
├── services/
│   └── githubApi.js
├── store/
│   └── index.js
├── router/
│   └── index.js
└── App.vue
```

## 🔒 API Rate Limit

> La API pública de GitHub tiene un límite de **60 solicitudes por hora** sin autenticación. Considera usar un token personal si necesitas aumentar el límite para pruebas.

## 📄 Licencia

Este proyecto se entrega como código abierto con fines educativos y de entrevista. Puedes usarlo y adaptarlo libremente.

---

### 👨‍💻 Autor

Desarrollado con ❤️ por [@Diego22rct](https://github.com/Diego22rct)