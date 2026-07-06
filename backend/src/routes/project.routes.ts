import { Router } from 'express';
import { projectController } from '../controllers/project.controller';
import { validate } from '../middlewares/validation';
import { requireAdmin } from '../middlewares/requireAdmin';
import { 
  createProjectSchema, 
  updateProjectSchema, 
  projectIdSchema 
} from '../types/project.schema';

const router = Router();

/**
 * Rutas de Proyectos
 */

// GET /api/projects - Obtener todos los proyectos
router.get(
  '/',
  projectController.getAllProjects.bind(projectController)
);

// GET /api/projects/:id - Obtener proyecto por ID
router.get(
  '/:id',
  validate(projectIdSchema, 'params'),
  projectController.getProjectById.bind(projectController)
);

// POST /api/projects - Crear nuevo proyecto
router.post(
  '/',
  requireAdmin,
  validate(createProjectSchema, 'body'),
  projectController.createProject.bind(projectController)
);

// PUT /api/projects/:id - Actualizar proyecto
router.put(
  '/:id',
  requireAdmin,
  validate(projectIdSchema, 'params'),
  validate(updateProjectSchema, 'body'),
  projectController.updateProject.bind(projectController)
);

// DELETE /api/projects/:id - Eliminar proyecto
router.delete(
  '/:id',
  requireAdmin,
  validate(projectIdSchema, 'params'),
  projectController.deleteProject.bind(projectController)
);

// POST /api/projects/:id/images - Agregar imagen a proyecto
router.post(
  '/:id/images',
  requireAdmin,
  validate(projectIdSchema, 'params'),
  projectController.addProjectImage.bind(projectController)
);

// DELETE /api/projects/images/:imageId - Eliminar imagen de proyecto
router.delete(
  '/images/:imageId',
  requireAdmin,
  projectController.deleteProjectImage.bind(projectController)
);

export default router;
