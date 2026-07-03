/**
 * types/index.ts — Definiciones de tipos TypeScript para toda la aplicación.
 *
 * Este archivo centraliza todas las interfaces y tipos utilizados tanto
 * en los componentes como en los servicios de API. Sirve como contrato
 * entre el frontend y el backend, asegurando consistencia tipada.
 *
 * Secciones:
 * 1. Modelos de datos (Project, Post, imágenes relacionadas)
 * 2. Respuestas de API (genéricas, listas, errores)
 * 3. Payloads de entrada (ContactPayload, UploadResult)
 */

// ──────────────────────────────────────────────────
// 1. MODELOS DE DATOS
// ──────────────────────────────────────────────────

/**
 * Representa un proyecto de laboratorio del semillero.
 * - id: UUID generado por el backend
 * - name: Nombre del proyecto
 * - shortDesc: Descripción breve (máx 300 chars)
 * - documentation: Documentación técnica completa
 * - mainImage: URL de la imagen principal (puede ser local /uploads/ o externa)
 * - startDate: Fecha de inicio en formato ISO string
 * - repoUrl: Enlace opcional al repositorio del proyecto
 * - images: Array de imágenes adicionales del proyecto
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

/**
 * Imagen individual asociada a un proyecto.
 * - projectId: UUID del proyecto padre
 * - imageUrl: Ruta de la imagen (local o URL absoluta)
 */
export interface ProjectImage {
  id: string;
  projectId: string;
  imageUrl: string;
  createdAt: string;
}

/**
 * Representa un post del blog o un evento del semillero.
 * - title: Título del post/evento
 * - content: Contenido principal en texto plano o HTML
 * - startDate: Fecha de inicio del evento o publicación
 * - endDate: Fecha opcional de finalización (solo para eventos con rango)
 * - mainImage: URL de la imagen destacada
 * - eventLink: Enlace externo opcional (ej. formulario de inscripción)
 * - images: Array de imágenes adicionales
 */
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

/**
 * Imagen individual asociada a un post.
 * - postId: UUID del post padre
 * - imageUrl: Ruta de la imagen
 */
export interface PostImage {
  id: string;
  postId: string;
  imageUrl: string;
  createdAt: string;
}

// ──────────────────────────────────────────────────
// 2. RESPUESTAS DE API
// ──────────────────────────────────────────────────

/**
 * Respuesta genérica envuelta del backend.
 * Todas las respuestas siguen este formato estándar:
 * - success: indica si la operación fue exitosa
 * - data: payload tipado con <T>
 * - message: mensaje opcional (ej. "Creado exitosamente")
 * - correlationId: UUID de trazabilidad para debugging
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  correlationId?: string;
}

/**
 * Variante de ApiResponse para listas.
 * Extiende ApiResponse<T[]> agregando un campo count
 * que indica el número total de elementos.
 */
export interface ApiListResponse<T> extends ApiResponse<T[]> {
  count: number;
}

/**
 * Estructura estandarizada de error devuelta por el backend.
 * - error: mensaje principal del error
 * - details: array opcional con errores de validación campo por campo
 * - correlationId: UUID para rastrear el error en logs del servidor
 */
export interface ApiError {
  error: string;
  details?: Array<{ field: string; message: string }>;
  correlationId?: string;
}

// ──────────────────────────────────────────────────
// 3. PAYLOADS DE ENTRADA
// ──────────────────────────────────────────────────

/**
 * Payload para el formulario de contacto.
 * Enviado al endpoint POST /api/contact.
 */
export interface ContactPayload {
  email: string;
  message: string;
}

/**
 * Resultado de una subida de archivo exitosa.
 * Devuelto por el endpoint POST /api/upload.
 */
export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
}
