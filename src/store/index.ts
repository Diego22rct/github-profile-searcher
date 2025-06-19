import { createStore } from 'vuex';
import { GitHubUser, GitHubRepository, GitHubApiService } from '../services/githubApi';

// Definición del estado de la aplicación
export interface RootState {
  // Estado de búsqueda
  searchQuery: string;
  searchResults: GitHubUser[];
  searchLoading: boolean;
  searchError: string | null;
  
  // Estado del usuario seleccionado
  selectedUser: GitHubUser | null;
  userRepositories: GitHubRepository[];
  userReadme: string | null;
  userLoading: boolean;
  userError: string | null;
}

// Tipos de mutaciones
export const mutations = {
  // Mutaciones de búsqueda
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
  SET_SEARCH_ERROR: 'SET_SEARCH_ERROR',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  
  // Mutaciones del usuario
  SET_SELECTED_USER: 'SET_SELECTED_USER',
  SET_USER_REPOSITORIES: 'SET_USER_REPOSITORIES',
  SET_USER_README: 'SET_USER_README',
  SET_USER_LOADING: 'SET_USER_LOADING',
  SET_USER_ERROR: 'SET_USER_ERROR',
  CLEAR_USER_DATA: 'CLEAR_USER_DATA',
};

// Tipos de acciones
export const actions = {
  SEARCH_USERS: 'SEARCH_USERS',
  LOAD_USER_PROFILE: 'LOAD_USER_PROFILE',
  CLEAR_SEARCH_RESULTS: 'CLEAR_SEARCH_RESULTS',
  CLEAR_USER_PROFILE: 'CLEAR_USER_PROFILE',
};

export default createStore({
  state: (): RootState => ({
    // Estado inicial de búsqueda
    searchQuery: '',
    searchResults: [],
    searchLoading: false,
    searchError: null,
    
    // Estado inicial del usuario
    selectedUser: null,
    userRepositories: [],
    userReadme: null,
    userLoading: false,
    userError: null,
  }),

  mutations: {
    // Mutaciones de búsqueda
    [mutations.SET_SEARCH_QUERY](state: RootState, query: string) {
      state.searchQuery = query;
    },
    
    [mutations.SET_SEARCH_RESULTS](state: RootState, results: GitHubUser[]) {
      state.searchResults = results;
    },
    
    [mutations.SET_SEARCH_LOADING](state: RootState, loading: boolean) {
      state.searchLoading = loading;
    },
    
    [mutations.SET_SEARCH_ERROR](state: RootState, error: string | null) {
      state.searchError = error;
    },
    
    [mutations.CLEAR_SEARCH](state: RootState) {
      state.searchQuery = '';
      state.searchResults = [];
      state.searchLoading = false;
      state.searchError = null;
    },

    // Mutaciones del usuario
    [mutations.SET_SELECTED_USER](state: RootState, user: GitHubUser | null) {
      state.selectedUser = user;
    },
    
    [mutations.SET_USER_REPOSITORIES](state: RootState, repositories: GitHubRepository[]) {
      state.userRepositories = repositories;
    },
    
    [mutations.SET_USER_README](state: RootState, readme: string | null) {
      state.userReadme = readme;
    },
    
    [mutations.SET_USER_LOADING](state: RootState, loading: boolean) {
      state.userLoading = loading;
    },
    
    [mutations.SET_USER_ERROR](state: RootState, error: string | null) {
      state.userError = error;
    },
    
    [mutations.CLEAR_USER_DATA](state: RootState) {
      state.selectedUser = null;
      state.userRepositories = [];
      state.userReadme = null;
      state.userLoading = false;
      state.userError = null;
    },
  },

  actions: {
    /**
     * Buscar usuarios en GitHub
     */
    async [actions.SEARCH_USERS]({ commit }: any, query: string) {
      if (!query.trim()) {
        commit(mutations.SET_SEARCH_ERROR, 'Por favor ingresa un término de búsqueda');
        return;
      }

      commit(mutations.SET_SEARCH_LOADING, true);
      commit(mutations.SET_SEARCH_ERROR, null);

      try {
        const response = await GitHubApiService.searchUsers(query.trim());
        commit(mutations.SET_SEARCH_QUERY, query.trim());
        commit(mutations.SET_SEARCH_RESULTS, response.items);
      } catch (error) {
        commit(mutations.SET_SEARCH_ERROR, error instanceof Error ? error.message : 'Error desconocido');
        commit(mutations.SET_SEARCH_RESULTS, []);
      } finally {
        commit(mutations.SET_SEARCH_LOADING, false);
      }
    },

    /**
     * Cargar el perfil completo de un usuario
     */
    async [actions.LOAD_USER_PROFILE]({ commit }: any, username: string) {
      commit(mutations.SET_USER_LOADING, true);
      commit(mutations.SET_USER_ERROR, null);

      try {
        // Cargar información del usuario, repositorios y README en paralelo
        const [user, repositories, readme] = await Promise.all([
          GitHubApiService.getUser(username),
          GitHubApiService.getUserRepositories(username),
          GitHubApiService.getUserReadme(username),
        ]);

        commit(mutations.SET_SELECTED_USER, user);
        commit(mutations.SET_USER_REPOSITORIES, repositories);
        commit(mutations.SET_USER_README, readme);
      } catch (error) {
        commit(mutations.SET_USER_ERROR, error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        commit(mutations.SET_USER_LOADING, false);
      }
    },

    /**
     * Limpiar resultados de búsqueda
     */
    [actions.CLEAR_SEARCH_RESULTS]({ commit }: any) {
      commit(mutations.CLEAR_SEARCH);
    },

    /**
     * Limpiar datos del usuario
     */
    [actions.CLEAR_USER_PROFILE]({ commit }: any) {
      commit(mutations.CLEAR_USER_DATA);
    },
  },

  getters: {
    // Getters para acceder al estado de manera reactiva
    hasSearchResults: (state: RootState) => state.searchResults.length > 0,
    hasSelectedUser: (state: RootState) => state.selectedUser !== null,
    topRepositories: (state: RootState) => state.userRepositories.slice(0, 3),
  },
});
