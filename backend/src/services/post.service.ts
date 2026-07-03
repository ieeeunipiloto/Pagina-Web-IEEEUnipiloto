import fs from 'fs';
import path from 'path';
import { prisma } from '../config/database';
import { NotFoundError } from '../middlewares/errorHandler';
import { CreatePostInput, UpdatePostInput } from '../types/post.schema';
import { logger } from '../config/logger';

/**
 * Servicio de Posts (Eventos/Blog)
 * Encapsula toda la lógica de negocio relacionada con posts
 */

export class PostService {
  /**
   * Obtener todos los posts con sus imágenes
   */
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

  /**
   * Obtener un post por ID
   */
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

  /**
   * Crear un nuevo post
   */
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

  /**
   * Actualizar un post existente
   */
  async updatePost(id: string, data: UpdatePostInput) {
    logger.info('Actualizando post', { postId: id });
    
    // Verificar que el post existe
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

  /**
   * Eliminar un post
   */
  async deletePost(id: string) {
    logger.info('Eliminando post', { postId: id });
    
    // Verificar que el post existe
    const post = await this.getPostById(id);

    // Eliminar archivos locales de las imágenes
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

  /**
   * Agregar imagen a un post
   */
  async addPostImage(postId: string, imageUrl: string) {
    logger.info('Agregando imagen a post', { postId, imageUrl });
    
    // Verificar que el post existe
    await this.getPostById(postId);

    return prisma.postImage.create({
      data: {
        postId,
        imageUrl,
      },
    });
  }

  /**
   * Eliminar imagen de un post
   */
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
