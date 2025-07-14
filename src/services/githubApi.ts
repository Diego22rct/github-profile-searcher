import axios from 'axios';

// Configuración base de Axios para la API de GitHub
const api = axios.create({
  baseURL: 'https://api.github.com',
  timeout: 10000,
});

// Tipos TypeScript para las respuestas de la API
export interface GitHubUser {
  id: number;
  login: string;
  avatar_url: string;
  html_url: string;
  name?: string;
  bio?: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  html_url: string;
  language: string | null;
}

export interface SearchUsersResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubUser[];
}

export interface ReadmeResponse {
  content: string;
  encoding: string;
}

/**
 * Servicio para interactuar con la API de GitHub
 */
export class GitHubApiService {
  /**
   * Buscar usuarios en GitHub
   * @param query - Término de búsqueda
   * @param page - Página de resultados (opcional)
   * @param perPage - Resultados por página (opcional)
   */
  static async searchUsers(query: string, page = 1, perPage = 10): Promise<SearchUsersResponse> {
    try {
      const response = await api.get<SearchUsersResponse>('/search/users', {
        params: {
          q: query,
          page,
          per_page: perPage,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw new Error('Error al buscar usuarios');
    }
  }

  /**
   * Obtener información detallada de un usuario
   * @param username - Nombre de usuario de GitHub
   */
  static async getUser(username: string): Promise<GitHubUser> {
    try {
      const response = await api.get<GitHubUser>(`/users/${username}`);
      return response.data;
    } catch (error) {
      console.error('Error getting user:', error);
      throw new Error('Error al obtener información del usuario');
    }
  }

  /**
   * Obtener los repositorios de un usuario
   * @param username - Nombre de usuario de GitHub
   */
  static async getUserRepositories(username: string): Promise<GitHubRepository[]> {
    try {
      const response = await api.get<GitHubRepository[]>(`/users/${username}/repos`, {
        params: {
          sort: 'stars',
          direction: 'desc',
          per_page: 100, // Obtenemos más repos para poder filtrar los top 3
        },
      });
      
      // Retornamos solo los 3 repositorios con más estrellas
      return response.data
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 3);
    } catch (error) {
      console.error('Error getting user repositories:', error);
      throw new Error('Error al obtener repositorios del usuario');
    }
  }  /**
   * Obtener el README del repositorio especial (username/username)
   * @param username - Nombre de usuario de GitHub
   */
  static async getUserReadme(username: string): Promise<string | null> {
    try {
      const response = await api.get<ReadmeResponse>(`/repos/${username}/${username}/readme`);
      
      // Limpiar el contenido base64 removiendo saltos de línea y espacios
      const cleanBase64 = response.data.content.replace(/\s/g, '');
      
      // Decodificar el contenido base64
      const content = atob(cleanBase64);
      return content;
    } catch (error) {
      // Si no existe el README especial, retornamos null
      console.warn(`No special README found for user ${username}`);
      return null;
    }
  }
}
