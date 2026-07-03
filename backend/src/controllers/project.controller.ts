import { Request, Response } from 'express';
import { projectService } from '../services/project.service';
import { CreateProjectInput, UpdateProjectInput } from '../types/project.schema';
import { auditLog } from '../config/logger';

/**
 * Controlador de Proyectos
 * Maneja las peticiones HTTP y delega la lógica al servicio
 */

export class ProjectController {
  /**
   * GET /api/projects
   */
  async getAllProjects(req: Request, res: Response): Promise<void> {
    const projects = await projectService.getAllProjects();
    
    res.status(200).json({
      success: true,
      data: projects,
      count: projects.length,
      correlationId: req.correlationId,
    });
  }

  /**
   * GET /api/projects/:id
   */
  async getProjectById(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const project = await projectService.getProjectById(id);
    
    res.status(200).json({
      success: true,
      data: project,
      correlationId: req.correlationId,
    });
  }

  /**
   * POST /api/projects
   */
  async createProject(req: Request, res: Response): Promise<void> {
    const data: CreateProjectInput = req.body;
    const project = await projectService.createProject(data);
    
    auditLog('PROJECT_CREATED', {
      projectId: project.id,
      projectName: project.name,
      correlationId: req.correlationId,
    });
    
    res.status(201).json({
      success: true,
      data: project,
      message: 'Proyecto creado exitosamente',
      correlationId: req.correlationId,
    });
  }

  /**
   * PUT /api/projects/:id
   */
  async updateProject(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const data: UpdateProjectInput = req.body;
    const project = await projectService.updateProject(id, data);
    
    auditLog('PROJECT_UPDATED', {
      projectId: id,
      correlationId: req.correlationId,
    });
    
    res.status(200).json({
      success: true,
      data: project,
      message: 'Proyecto actualizado exitosamente',
      correlationId: req.correlationId,
    });
  }

  /**
   * DELETE /api/projects/:id
   */
  async deleteProject(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    await projectService.deleteProject(id);
    
    auditLog('PROJECT_DELETED', {
      projectId: id,
      correlationId: req.correlationId,
    });
    
    res.status(200).json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
      correlationId: req.correlationId,
    });
  }

  /**
   * POST /api/projects/:id/images
   */
  async addProjectImage(req: Request, res: Response): Promise<void> {
    const { id: projectId } = req.params;
    const { imageUrl } = req.body;
    
    const image = await projectService.addProjectImage(projectId, imageUrl);
    
    res.status(201).json({
      success: true,
      data: image,
      message: 'Imagen agregada exitosamente',
      correlationId: req.correlationId,
    });
  }

  /**
   * DELETE /api/projects/images/:imageId
   */
  async deleteProjectImage(req: Request, res: Response): Promise<void> {
    const { imageId } = req.params;
    await projectService.deleteProjectImage(imageId);
    
    res.status(200).json({
      success: true,
      message: 'Imagen eliminada exitosamente',
      correlationId: req.correlationId,
    });
  }
}

export const projectController = new ProjectController();
