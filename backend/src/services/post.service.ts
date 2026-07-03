/**
 * services/post.service.ts — Lógica de negocio para Posts (Eventos/Blog).
 *
 * Implementa CRUD completo para posts con gestión de imágenes.
 * Sigue el mismo patrón que ProjectService.
 *
 * Responsabilidades:
 * - CRUD de posts (eventos y bitácoras).
 * - Gestión de imágenes (agregar, eliminar con limpieza de archivos).
 * - Validación de existencia antes de operaciones.
 * - Limpieza de archivos físicos al eliminar.
 */

import fs from 'fs';
import path from 'path';
import { prisma } from '../config/database';
import { NotFoundError } from '../middlewares/errorHandler';
import { CreatePostInput, UpdatePostInput } from '../types/post.schema';
import { logger } from '../config/logger';

export class PostService {
  /** Obtener todos los posts ordenados por fecha de inicio descendente */
  async getAllPosts() {
    logger.info('Obteniendo todos los posts');
    
    return prisma.post.findMany({
      include: {
        images: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  /** Obtener un post por UUID. Lanza NotFoundError si no existe. */
  async getPostById(id: string) {
    logger.info('Obteniendo post por ID', { postId: id });
    
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!post) {
      throw new NotFoundError('Post');
    }

    return post;
  }

  /** Crear un nuevo post con datos validados */
  async createPost(data: CreatePostInput) {
    logger.info('Creando nuevo post', { title: data.title });
    
    return prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : null,
        mainImage: data.mainImage,
        eventLink: data.eventLink,
      },
      include: {
        images: true,
      },
    });
  }

  /** Actualizar un post (merge parcial de campos) */
  async updatePost(id: string, data: UpdatePostInput) {
    logger.info('Actualizando post', { postId: id });
    
    await this.getPostById(id);

    return prisma.post.update({
      where: { id },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.content && { content: data.content }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.endDate !== undefined && { 
          endDate: data.endDate ? new Date(data.endDate) : null 
        }),
        ...(data.mainImage !== undefined && { mainImage: data.mainImage }),
        ...(data.eventLink !== undefined && { eventLink: data.eventLink }),
      },
      include: {
        images: true,
      },
    });
  }

  /** Eliminar post y sus archivos de imagen asociados */
  async deletePost(id: string) {
    logger.info('Eliminando post', { postId: id });
    
    const post = await this.getPostById(id);

    for (const img of post.images) {
      this.deleteLocalFile(img.imageUrl);
    }
    if (post.mainImage) {
      this.deleteLocalFile(post.mainImage);
    }

    await prisma.post.delete({
      where: { id },
    });

    return { message: 'Post eliminado exitosamente' };
  }

  /** Agregar imagen a un post */
  async addPostImage(postId: string, imageUrl: string) {
    logger.info('Agregando imagen a post', { postId, imageUrl });
    
    await this.getPostById(postId);

    return prisma.postImage.create({
      data: {
        postId,
        imageUrl,
      },
    });
  }

  /** Eliminar imagen de un post (incluye archivo físico) */
  async deletePostImage(imageId: string) {
    logger.info('Eliminando imagen de post', { imageId });
    
    const image = await prisma.postImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundError('Imagen');
    }

    this.deleteLocalFile(image.imageUrl);

    await prisma.postImage.delete({
      where: { id: imageId },
    });

    return { message: 'Imagen eliminada exitosamente' };
  }

  /** Elimina archivo local si la ruta empieza con /uploads/ */
  private deleteLocalFile(imageUrl: string): void {
    try {
      if (imageUrl.startsWith('/uploads/')) {
        const filePath = path.resolve(__dirname, '../../uploads', path.basename(imageUrl));
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
          logger.info('Archivo local eliminado', { path: filePath });
        }
      }
    } catch (err) {
      logger.warn('No se pudo eliminar el archivo local', { imageUrl, error: err });
    }
  }
}

export const postService = new PostService();
