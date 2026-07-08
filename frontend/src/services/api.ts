/**
 * services/api.ts — Cliente HTTP para comunicación con el backend REST.
 *
 * Proporciona una capa de abstracción sobre Axios con:
 * - Inyección automática de Correlation ID para trazabilidad.
 * - Interceptors de request/response para logging y manejo de errores.
 * - Métodos tipados para cada endpoint de la API.
 *
 * Principios aplicados:
 * - Centralización: todos los llamados a la API pasan por aquí.
 * - Tipado fuerte: cada método declara tipos de entrada y salida.
 * - Resiliencia: logs estructurados para debugging.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { config } from '@/utils/config';
import { 
  Project, 
  Post, 
  Member,
  ContactPayload,
  UploadResult,
  ApiListResponse, 
  ApiResponse, 
  ApiError,
  ProjectImage,
  PostImage,
} from '@/types';

/**
 * ApiClient — Clase singleton que encapsula la instancia de Axios.
 *
 * Patrón: Cliente HTTP con configuración predefinida e interceptors.
 * Métodos organizados por recurso: Projects, Posts, Contact, Upload, Images.
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    /**
     * Creación de la instancia Axios con configuración base:
     * - baseURL: URL de la API (proxy de Vite en desarrollo).
     * - timeout: 15 segundos máximo por petición.
     * - Content-Type: JSON por defecto (se sobrescribe en uploads).
     */
    this.client = axios.create({
      baseURL: config.apiUrl,
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  /**
   * Genera un UUID v4 para correlation ID.
   * Usa crypto.randomUUID() si está disponible (navegadores modernos),
   * o un fallback manual en caso contrario.
   */
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

  /**
   * Configura interceptors de Axios para:
   * - Request: inyectar header x-correlation-id en cada petición.
   * - Response: loguear errores del servidor y errores de red.
   */
  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        config.headers['x-correlation-id'] = this.generateUUID();
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response) {
          console.error('API Error:', {
            status: error.response.status,
            message: error.response.data?.error,
            correlationId: error.response.data?.correlationId,
          });
        } else if (error.request) {
          console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
      }
    );
  }

  // ──────────────────────────────────────────────
  // PROYECTOS (CRUD + Imágenes)
  // ──────────────────────────────────────────────

  /** GET /api/projects — Obtener todos los proyectos */
  async getProjects(): Promise<Project[]> {
    const { data } = await this.client.get<ApiListResponse<Project>>('/projects');
    return data.data;
  }

  /** GET /api/projects/:id — Obtener proyecto por UUID */
  async getProjectById(id: string): Promise<Project> {
    const { data } = await this.client.get<ApiResponse<Project>>(`/projects/${id}`);
    return data.data;
  }

  /** POST /api/projects — Crear un nuevo proyecto */
  async createProject(project: Partial<Project>): Promise<Project> {
    const { data } = await this.client.post<ApiResponse<Project>>('/projects', project);
    return data.data;
  }

  /** PUT /api/projects/:id — Actualizar proyecto existente */
  async updateProject(id: string, project: Partial<Project>): Promise<Project> {
    const { data } = await this.client.put<ApiResponse<Project>>(`/projects/${id}`, project);
    return data.data;
  }

  /** DELETE /api/projects/:id — Eliminar proyecto */
  async deleteProject(id: string): Promise<void> {
    await this.client.delete(`/projects/${id}`);
  }

  // ──────────────────────────────────────────────
  // POSTS / EVENTOS (CRUD + Imágenes)
  // ──────────────────────────────────────────────

  /** GET /api/posts — Obtener todos los posts/eventos */
  async getPosts(): Promise<Post[]> {
    const { data } = await this.client.get<ApiListResponse<Post>>('/posts');
    return data.data;
  }

  /** GET /api/posts/:id — Obtener post por UUID */
  async getPostById(id: string): Promise<Post> {
    const { data } = await this.client.get<ApiResponse<Post>>(`/posts/${id}`);
    return data.data;
  }

  /** POST /api/posts — Crear nuevo post/evento */
  async createPost(post: Partial<Post>): Promise<Post> {
    const { data } = await this.client.post<ApiResponse<Post>>('/posts', post);
    return data.data;
  }

  /** PUT /api/posts/:id — Actualizar post existente */
  async updatePost(id: string, post: Partial<Post>): Promise<Post> {
    const { data } = await this.client.put<ApiResponse<Post>>(`/posts/${id}`, post);
    return data.data;
  }

  /** DELETE /api/posts/:id — Eliminar post */
  async deletePost(id: string): Promise<void> {
    await this.client.delete(`/posts/${id}`);
  }

  // ──────────────────────────────────────────────
  // CONTACTO
  // ──────────────────────────────────────────────

  /** POST /api/contact — Enviar formulario de contacto por email */
  async sendContact(payload: ContactPayload): Promise<ApiResponse<null>> {
    const { data } = await this.client.post<ApiResponse<null>>('/contact', payload);
    return data;
  }

  // ──────────────────────────────────────────────
  // SUBIDA DE ARCHIVOS
  // ──────────────────────────────────────────────

  /** POST /api/upload — Subir archivo de imagen (multipart/form-data) */
  async uploadImage(file: File): Promise<UploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await this.client.post<ApiResponse<UploadResult>>('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.data;
  }

  // ──────────────────────────────────────────────
  // IMÁGENES DE PROYECTOS
  // ──────────────────────────────────────────────

  /** POST /api/projects/:id/images — Agregar imagen a proyecto */
  async addProjectImage(projectId: string, imageUrl: string): Promise<ProjectImage> {
    const { data } = await this.client.post<ApiResponse<ProjectImage>>(`/projects/${projectId}/images`, { imageUrl });
    return data.data;
  }

  /** DELETE /api/projects/images/:imageId — Eliminar imagen de proyecto */
  async deleteProjectImage(imageId: string): Promise<void> {
    await this.client.delete(`/projects/images/${imageId}`);
  }

  // ──────────────────────────────────────────────
  // IMÁGENES DE POSTS
  // ──────────────────────────────────────────────

  /** POST /api/posts/:id/images — Agregar imagen a post */
  async addPostImage(postId: string, imageUrl: string): Promise<PostImage> {
    const { data } = await this.client.post<ApiResponse<PostImage>>(`/posts/${postId}/images`, { imageUrl });
    return data.data;
  }

  /** DELETE /api/posts/images/:imageId — Eliminar imagen de post */
  async deletePostImage(imageId: string): Promise<void> {
    await this.client.delete(`/posts/images/${imageId}`);
  }

  // ──────────────────────────────────────────────
  // MIEMBROS IEEE (READ-ONLY)
  // ──────────────────────────────────────────────

  /** GET /api/members — Obtener todos los miembros IEEE */
  async getMembers(): Promise<Member[]> {
    const { data } = await this.client.get<ApiListResponse<Member>>('/members');
    return data.data;
  }

  /** GET /api/members/:id — Obtener miembro por UUID */
  async getMemberById(id: string): Promise<Member> {
    const { data } = await this.client.get<ApiResponse<Member>>(`/members/${id}`);
    return data.data;
  }
}

/** Instancia única exportable del cliente API */
export const api = new ApiClient();
