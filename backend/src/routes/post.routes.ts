/**
 * routes/post.routes.ts — Definición de rutas para el recurso Posts.
 *
 * Sigue el mismo patrón que project.routes.ts con validación Zod.
 * Los endpoints permiten CRUD completo de posts e imágenes asociadas.
 */

import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { validate } from '../middlewares/validation';
import { 
  createPostSchema, 
  updatePostSchema, 
  postIdSchema 
} from '../types/post.schema';

const router = Router();

/* GET / — Listar todos los posts */
router.get(
  '/',
  postController.getAllPosts.bind(postController)
);

/* GET /:id — Obtener post por UUID */
router.get(
  '/:id',
  validate(postIdSchema, 'params'),
  postController.getPostById.bind(postController)
);

/* POST / — Crear post (valida body con createPostSchema) */
router.post(
  '/',
  validate(createPostSchema, 'body'),
  postController.createPost.bind(postController)
);

/* PUT /:id — Actualizar post */
router.put(
  '/:id',
  validate(postIdSchema, 'params'),
  validate(updatePostSchema, 'body'),
  postController.updatePost.bind(postController)
);

/* DELETE /:id — Eliminar post */
router.delete(
  '/:id',
  validate(postIdSchema, 'params'),
  postController.deletePost.bind(postController)
);

/* POST /:id/images — Agregar imagen a post */
router.post(
  '/:id/images',
  validate(postIdSchema, 'params'),
  postController.addPostImage.bind(postController)
);

/* DELETE /images/:imageId — Eliminar imagen de post */
router.delete(
  '/images/:imageId',
  postController.deletePostImage.bind(postController)
);

export default router;
