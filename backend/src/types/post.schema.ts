import { z } from 'zod';

/**
 * Schemas de validación para Posts (Eventos/Blog)
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
  
  mainImage: z.string()
    .url('La imagen principal debe ser una URL válida')
    .optional(),
  
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
  
  mainImage: z.string()
    .url('La imagen principal debe ser una URL válida')
    .optional()
    .nullable(),
  
  eventLink: z.string()
    .url('El enlace del evento debe ser válido')
    .optional()
    .nullable(),
});

export const postIdSchema = z.object({
  id: z.string()
    .uuid('ID de post inválido'),
});

/**
 * Tipos inferidos de los schemas
 */
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostIdParam = z.infer<typeof postIdSchema>;
