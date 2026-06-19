import { Router } from 'express';
import { postController } from '../controllers/post.controller';
import { validate } from '../middlewares/validation';
import { 
  createPostSchema, 
  updatePostSchema, 
  postIdSchema 
} from '../types/post.schema';

const router = Router();

/**
 * Rutas de Posts (Eventos/Blog)
 */

// GET /api/posts - Obtener todos los posts
router.get(
  '/',
  postController.getAllPosts.bind(postController)
);

// GET /api/posts/:id - Obtener post por ID
router.get(
  '/:id',
  validate(postIdSchema, 'params'),
  postController.getPostById.bind(postController)
);

// POST /api/posts - Crear nuevo post
router.post(
  '/',
  validate(createPostSchema, 'body'),
  postController.createPost.bind(postController)
);

// PUT /api/posts/:id - Actualizar post
router.put(
  '/:id',
  validate(postIdSchema, 'params'),
  validate(updatePostSchema, 'body'),
  postController.updatePost.bind(postController)
);

// DELETE /api/posts/:id - Eliminar post
router.delete(
  '/:id',
  validate(postIdSchema, 'params'),
  postController.deletePost.bind(postController)
);

// POST /api/posts/:id/images - Agregar imagen a post
router.post(
  '/:id/images',
  validate(postIdSchema, 'params'),
  postController.addPostImage.bind(postController)
);

// DELETE /api/posts/images/:imageId - Eliminar imagen de post
router.delete(
  '/images/:imageId',
  postController.deletePostImage.bind(postController)
);

export default router;
