/**
 * services/project.service.ts — Lógica de negocio para Proyectos.
 *
 * Esta capa encapsula todas las operaciones CRUD de proyectos,
 * incluyendo la gestión de imágenes asociadas.
 *
 * Responsabilidades:
 * - CRUD de proyectos (crear, leer, actualizar, eliminar).
 * - Gestión de imágenes (agregar, eliminar con limpieza de archivos).
 * - Verificación de existencia antes de operaciones.
 * - Limpieza de archivos del sistema de archivos al eliminar.
 *
 * Principio: Servicio → Controlador → HTTP. El servicio nunca sabe
 * que está siendo llamado desde HTTP; podría ser desde un worker, CLI, etc.
 */

import fs from 'fs';
import path from 'path';
import { prisma } from '../config/database';
import { NotFoundError } from '../middlewares/errorHandler';
import { CreateProjectInput, UpdateProjectInput } from '../types/project.schema';
import { logger } from '../config/logger';

export class ProjectService {
  /** Obtener todos los proyectos ordenados por fecha de inicio descendente */
  async getAllProjects() {
    logger.info('Obteniendo todos los proyectos');
    
    return prisma.project.findMany({
      include: {
        images: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });
  }

  /** Obtener un proyecto por UUID. Lanza NotFoundError si no existe. */
  async getProjectById(id: string) {
    logger.info('Obteniendo proyecto por ID', { projectId: id });
    
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!project) {
      throw new NotFoundError('Proyecto');
    }

    return project;
  }

  /** Crear un nuevo proyecto con los datos validados */
  async createProject(data: CreateProjectInput) {
    logger.info('Creando nuevo proyecto', { name: data.name });
    
    return prisma.project.create({
      data: {
        name: data.name,
        shortDesc: data.shortDesc,
        documentation: data.documentation,
        mainImage: data.mainImage,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        repoUrl: data.repoUrl,
      },
      include: {
        images: true,
      },
    });
  }

  /**
   * Actualizar un proyecto existente.
   * Solo actualiza los campos proporcionados (merge parcial).
   */
  async updateProject(id: string, data: UpdateProjectInput) {
    logger.info('Actualizando proyecto', { projectId: id });
    
    await this.getProjectById(id);

    return prisma.project.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.shortDesc && { shortDesc: data.shortDesc }),
        ...(data.documentation && { documentation: data.documentation }),
        ...(data.mainImage !== undefined && { mainImage: data.mainImage }),
        ...(data.startDate && { startDate: new Date(data.startDate) }),
        ...(data.repoUrl !== undefined && { repoUrl: data.repoUrl }),
      },
      include: {
        images: true,
      },
    });
  }

  /**
   * Eliminar un proyecto y sus archivos de imagen asociados.
   * Primero elimina los archivos locales (fotos), luego el registro en BD.
   */
  async deleteProject(id: string) {
    logger.info('Eliminando proyecto', { projectId: id });
    
    const project = await this.getProjectById(id);

    for (const img of project.images) {
      this.deleteLocalFile(img.imageUrl);
    }
    if (project.mainImage) {
      this.deleteLocalFile(project.mainImage);
    }

    await prisma.project.delete({
      where: { id },
    });

    return { message: 'Proyecto eliminado exitosamente' };
  }

  /** Agregar una imagen a un proyecto (por URL) */
  async addProjectImage(projectId: string, imageUrl: string) {
    logger.info('Agregando imagen a proyecto', { projectId, imageUrl });
    
    await this.getProjectById(projectId);

    return prisma.projectImage.create({
      data: {
        projectId,
        imageUrl,
      },
    });
  }

  /**
   * Eliminar una imagen de un proyecto.
   * También borra el archivo físico del disco si es local.
   */
  async deleteProjectImage(imageId: string) {
    logger.info('Eliminando imagen de proyecto', { imageId });
    
    const image = await prisma.projectImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundError('Imagen');
    }

    this.deleteLocalFile(image.imageUrl);

    await prisma.projectImage.delete({
      where: { id: imageId },
    });

    return { message: 'Imagen eliminada exitosamente' };
  }

  /**
   * deleteLocalFile — Elimina un archivo del sistema de archivos local.
   * Solo actúa si la URL empieza con /uploads/ (archivos locales).
   * Si el archivo no existe, lo ignora silenciosamente.
   */
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

export const projectService = new ProjectService();
