/**
 * controllers/post.controller.ts — Controlador HTTP para Posts (Eventos/Blog).
 *
 * Capa de presentación de la API REST para el recurso "posts".
 * Sigue el mismo patrón que ProjectController: delega al servicio
 * correspondiente y formatea respuestas con correlationId.
 *
 * Endpoints manejados:
 * - GET    /api/posts              → getAllPosts
 * - GET    /api/posts/:id          → getPostById
 * - POST   /api/posts              → createPost
 * - PUT    /api/posts/:id          → updatePost
 * - DELETE /api/posts/:id          → deletePost
 * - POST   /api/posts/:id/images   → addPostImage
 * - DELETE /api/posts/images/:id   → deletePostImage
 */

import { Request, Response } from 'express';
import { postService } from '../services/post.service';
import { CreatePostInput, UpdatePostInput } from '../types/post.schema';
import { auditLog } from '../config/logger';

export class PostController {
  /** GET /api/posts — Listar todos los posts */
  async getAllPosts(req: Request, res: Response): Promise<void> {
    const posts = await postService.getAllPosts();
    
    res.status(200).json({
      success: true,
      data: posts,
      count: posts.length,
      correlationId: req.correlationId,
    });
  }

  /** GET /api/posts/:id — Obtener post por UUID */
  async getPostById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const post = await postService.getPostById(id);
    
    res.status(200).json({
      success: true,
      data: post,
      correlationId: req.correlationId,
    });
  }

  /** POST /api/posts — Crear nuevo post (auditado) */
  async createPost(req: Request, res: Response): Promise<void> {
    const data: CreatePostInput = req.body;
    const post = await postService.createPost(data);
    
    auditLog('POST_CREATED', {
      postId: post.id,
      postTitle: post.title,
      correlationId: req.correlationId,
    });
    
    res.status(201).json({
      success: true,
      data: post,
      message: 'Post creado exitosamente',
      correlationId: req.correlationId,
    });
  }

  /** PUT /api/posts/:id — Actualizar post existente (auditado) */
  async updatePost(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UpdatePostInput = req.body;
    const post = await postService.updatePost(id, data);
    
    auditLog('POST_UPDATED', {
      postId: id,
      correlationId: req.correlationId,
    });
    
    res.status(200).json({
      success: true,
      data: post,
      message: 'Post actualizado exitosamente',
      correlationId: req.correlationId,
    });
  }

  /** DELETE /api/posts/:id — Eliminar post (auditado) */
  async deletePost(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await postService.deletePost(id);
    
    auditLog('POST_DELETED', {
      postId: id,
      correlationId: req.correlationId,
    });
    
    res.status(200).json({
      success: true,
      message: 'Post eliminado exitosamente',
      correlationId: req.correlationId,
    });
  }

  /** POST /api/posts/:id/images — Agregar imagen a post */
  async addPostImage(req: Request, res: Response): Promise<void> {
    const { id: postId } = req.params;
    const { imageUrl } = req.body;
    
    const image = await postService.addPostImage(postId, imageUrl);
    
    res.status(201).json({
      success: true,
      data: image,
      message: 'Imagen agregada exitosamente',
      correlationId: req.correlationId,
    });
  }

  /** DELETE /api/posts/images/:imageId — Eliminar imagen de post */
  async deletePostImage(req: Request, res: Response): Promise<void> {
    const { imageId } = req.params;
    await postService.deletePostImage(imageId);
    
    res.status(200).json({
      success: true,
      message: 'Imagen eliminada exitosamente',
      correlationId: req.correlationId,
    });
  }
}

export const postController = new PostController();
