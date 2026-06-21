import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '@/utils/config';
import { 
  Project, 
  Post, 
  ContactPayload,
  UploadResult,
  ApiListResponse, 
  ApiResponse, 
  ApiError,
  ProjectImage,
  PostImage,
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

  private generateUUID(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        config.headers['x-correlation-id'] = this.generateUUID();
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

  /**
   * Contacto
   */
  async sendContact(payload: ContactPayload): Promise<ApiResponse<null>> {
    const { data } = await this.client.post<ApiResponse<null>>('/contact', payload);
    return data;
  }

  /**
   * Subir archivo (imagen)
   */
  async uploadImage(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await this.client.post<ApiResponse<UploadResult>>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  }

  /**
   * Imágenes de proyectos
   */
  async addProjectImage(projectId: string, imageUrl: string): Promise<ProjectImage> {
    const { data } = await this.client.post<ApiResponse<ProjectImage>>(`/projects/${projectId}/images`, { imageUrl });
    return data.data;
  }

  async deleteProjectImage(imageId: string): Promise<void> {
    await this.client.delete(`/projects/images/${imageId}`);
  }

  /**
   * Imágenes de posts
   */
  async addPostImage(postId: string, imageUrl: string): Promise<PostImage> {
    const { data } = await this.client.post<ApiResponse<PostImage>>(`/posts/${postId}/images`, { imageUrl });
    return data.data;
  }

  async deletePostImage(imageId: string): Promise<void> {
    await this.client.delete(`/posts/images/${imageId}`);
  }
}

export const api = new ApiClient();
