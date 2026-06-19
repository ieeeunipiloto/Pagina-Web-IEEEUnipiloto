/**
 * Tipos para los modelos de datos
 */

export interface Project {
  id: string;
  name: string;
  shortDesc: string;
  documentation: string;
  mainImage?: string | null;
  startDate: string;
  repoUrl?: string | null;
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  startDate: string;
  endDate?: string | null;
  mainImage?: string | null;
  eventLink?: string | null;
  images: PostImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PostImage {
  id: string;
  postId: string;
  imageUrl: string;
  createdAt: string;
}

/**
 * Tipos para respuestas de API
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  correlationId?: string;
}

export interface ApiListResponse<T> extends ApiResponse<T[]> {
  count: number;
}

export interface ApiError {
  error: string;
  details?: Array<{ field: string; message: string }>;
  correlationId?: string;
}
