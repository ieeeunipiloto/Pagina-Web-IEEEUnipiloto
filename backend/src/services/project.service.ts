import { prisma } from '../config/database';
import { NotFoundError } from '../middlewares/errorHandler';
import { CreateProjectInput, UpdateProjectInput } from '../types/project.schema';
import { logger } from '../config/logger';

/**
 * Servicio de Proyectos
 * Encapsula toda la lógica de negocio relacionada con proyectos
 * Principio: Separación de responsabilidades (Controlador -> Servicio -> Base de Datos)
 */

export class ProjectService {
  /**
   * Obtener todos los proyectos con sus imágenes
   */
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

  /**
   * Obtener un proyecto por ID
   */
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

  /**
   * Crear un nuevo proyecto
   */
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
   * Actualizar un proyecto existente
   */
  async updateProject(id: string, data: UpdateProjectInput) {
    logger.info('Actualizando proyecto', { projectId: id });
    
    // Verificar que el proyecto existe
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
   * Eliminar un proyecto
   */
  async deleteProject(id: string) {
    logger.info('Eliminando proyecto', { projectId: id });
    
    // Verificar que el proyecto existe
    await this.getProjectById(id);

    await prisma.project.delete({
      where: { id },
    });

    return { message: 'Proyecto eliminado exitosamente' };
  }

  /**
   * Agregar imagen a un proyecto
   */
  async addProjectImage(projectId: string, imageUrl: string) {
    logger.info('Agregando imagen a proyecto', { projectId, imageUrl });
    
    // Verificar que el proyecto existe
    await this.getProjectById(projectId);

    return prisma.projectImage.create({
      data: {
        projectId,
        imageUrl,
      },
    });
  }

  /**
   * Eliminar imagen de un proyecto
   */
  async deleteProjectImage(imageId: string) {
    logger.info('Eliminando imagen de proyecto', { imageId });
    
    const image = await prisma.projectImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundError('Imagen');
    }

    await prisma.projectImage.delete({
      where: { id: imageId },
    });

    return { message: 'Imagen eliminada exitosamente' };
  }
}

export const projectService = new ProjectService();
