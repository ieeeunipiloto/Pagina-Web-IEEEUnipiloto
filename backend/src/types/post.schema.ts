/**
 * types/post.schema.ts — Schemas Zod de validación para Posts (Eventos/Blog).
 *
 * Define reglas de validación para crear y actualizar posts.
 * Incluye validación cross-field: la fecha de fin debe ser posterior
 * a la fecha de inicio.
 *
 * Schemas:
 * - createPostSchema: validación completa con regla de fechas.
 * - updatePostSchema: todos los campos opcionales.
 * - postIdSchema: valida UUID en parámetros de ruta.
 */

import { z } from 'zod';

/** Validador de URLs de imagen (absoluta o local /uploads/) */
const imageUrlOrLocal = z.string().refine(
  (val) => {
    try {
      new URL(val);
      return true;
    } catch {
      return val.startsWith('/uploads/');
    }
  },
  { message: 'Debe ser una URL válida o una ruta local /uploads/...' },
);

/**
 * Schema para crear un post.
 * Incluye validación cross-field con .refine():
 * Si endDate está presente, debe ser >= startDate.
 */
export const createPostSchema = z.object({
  title: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres'),
  
  content: z.string()
    .min(20, 'El contenido debe tener al menos 20 caracteres'),
  
  startDate: z.string()
    .datetime('Fecha de inicio inválida')
    .or(z.date())
    .optional(),
  
  endDate: z.string()
    .datetime('Fecha de fin inválida')
    .or(z.date())
    .optional()
    .nullable(),
  
  mainImage: imageUrlOrLocal.optional(),
  
  eventLink: z.string()
    .url('El enlace del evento debe ser válido')
    .optional(),
}).refine(
  (data) => {
    if (data.endDate && data.startDate) {
      return new Date(data.endDate) >= new Date(data.startDate);
    }
    return true;
  },
  {
    message: 'La fecha de fin debe ser posterior a la fecha de inicio',
    path: ['endDate'],
  }
);

/** Schema para actualizar un post (todos los campos opcionales) */
export const updatePostSchema = z.object({
  title: z.string()
    .min(5, 'El título debe tener al menos 5 caracteres')
    .max(200, 'El título no puede exceder 200 caracteres')
    .optional(),
  
  content: z.string()
    .min(20, 'El contenido debe tener al menos 20 caracteres')
    .optional(),
  
  startDate: z.string()
    .datetime('Fecha de inicio inválida')
    .or(z.date())
    .optional()
    .nullable(),
  
  endDate: z.string()
    .datetime('Fecha de fin inválida')
    .or(z.date())
    .optional()
    .nullable(),
  
  mainImage: imageUrlOrLocal.optional().nullable(),
  
  eventLink: z.string()
    .url('El enlace del evento debe ser válido')
    .optional()
    .nullable(),
});

/** Schema para validar UUID en params de ruta */
export const postIdSchema = z.object({
  id: z.string()
    .uuid('ID de post inválido'),
});

/** Tipos inferidos */
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostIdParam = z.infer<typeof postIdSchema>;
