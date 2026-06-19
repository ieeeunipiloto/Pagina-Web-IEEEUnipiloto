import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '@/utils/config';
import { 
  Project, 
  Post, 
  ApiListResponse, 
  ApiResponse, 
  ApiError 
} from '@/types';

/**
 * Cliente HTTP configurado con interceptors para manejo de errores
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Agregar correlation ID
        config.headers['x-correlation-id'] = crypto.randomUUID();
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          // Error del servidor
          console.error('API Error:', {
            status: error.response.status,
            message: error.response.data?.error,
            correlationId: error.response.data?.correlationId,
          });
        } else if (error.request) {
          // Error de red
          console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Proyectos
   */
  async getProjects(): Promise<Project[]> {
    const { data } = await this.client.get<ApiListResponse<Project>>('/projects');
    return data.data;
  }

  async getProjectById(id: string): Promise<Project> {
    const { data } = await this.client.get<ApiResponse<Project>>(`/projects/${id}`);
    return data.data;
  }

  async createProject(project: Partial<Project>): Promise<Project> {
    const { data } = await this.client.post<ApiResponse<Project>>('/projects', project);
    return data.data;
  }

  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const { data } = await this.client.put<ApiResponse<Project>>(`/projects/${id}`, project);
    return data.data;
  }

  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  /**
   * Posts (Eventos/Blog)
   */
  async getPosts(): Promise<Post[]> {
    const { data } = await this.client.get<ApiListResponse<Post>>('/posts');
    return data.data;
  }

  async getPostById(id: string): Promise<Post> {
    const { data } = await this.client.get<ApiResponse<Post>>(`/posts/${id}`);
    return data.data;
  }

  async createPost(post: Partial<Post>): Promise<Post> {
    const { data } = await this.client.post<ApiResponse<Post>>('/posts', post);
    return data.data;
  }

  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const { data } = await this.client.put<ApiResponse<Post>>(`/posts/${id}`, post);
    return data.data;
  }

  async deletePost(id: string): Promise<void> {
    await this.client.delete(`/posts/${id}`);
  }
}

export const api = new ApiClient();
