/**
 * routes/project.routes.ts — Definición de rutas para el recurso Proyectos.
 *
 * Configura el enrutador Express con validación Zod en cada endpoint
 * que requiere entrada del usuario (body, params).
 *
 * La validación se aplica como middleware antes del controlador,
 * asegurando que solo datos válidos lleguen a la capa de servicio.
 */

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

/* GET / — Listar todos los proyectos (sin validación) */
router.get(
  '/',
  projectController.getAllProjects.bind(projectController)
);

/* GET /:id — Obtener proyecto por UUID (valida params) */
router.get(
  '/:id',
  validate(projectIdSchema, 'params'),
  projectController.getProjectById.bind(projectController)
);

/* POST / — Crear proyecto (valida body con createProjectSchema) */
router.post(
  '/',
  requireAdmin,
  validate(createProjectSchema, 'body'),
  projectController.createProject.bind(projectController)
);

/* PUT /:id — Actualizar proyecto (valida params + body) */
router.put(
  '/:id',
  requireAdmin,
  validate(projectIdSchema, 'params'),
  validate(updateProjectSchema, 'body'),
  projectController.updateProject.bind(projectController)
);

/* DELETE /:id — Eliminar proyecto (valida params) */
router.delete(
  '/:id',
  requireAdmin,
  validate(projectIdSchema, 'params'),
  projectController.deleteProject.bind(projectController)
);

/* POST /:id/images — Agregar imagen a proyecto */
router.post(
  '/:id/images',
  requireAdmin,
  validate(projectIdSchema, 'params'),
  projectController.addProjectImage.bind(projectController)
);

/* DELETE /images/:imageId — Eliminar imagen de proyecto */
router.delete(
  '/images/:imageId',
  requireAdmin,
  projectController.deleteProjectImage.bind(projectController)
);

export default router;
