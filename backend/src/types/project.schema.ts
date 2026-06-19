import { z } from 'zod';

/**
 * Schemas de validación para Proyectos
 */

export const createProjectSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  shortDesc: z.string()
    .min(10, 'La descripción corta debe tener al menos 10 caracteres')
    .max(300, 'La descripción corta no puede exceder 300 caracteres'),
  
  documentation: z.string()
    .min(50, 'La documentación debe tener al menos 50 caracteres'),
  
  mainImage: z.string()
    .url('La imagen principal debe ser una URL válida')
    .optional(),
  
  startDate: z.string()
    .datetime('Fecha de inicio inválida')
    .or(z.date())
    .optional(),
  
  repoUrl: z.string()
    .url('La URL del repositorio debe ser válida')
    .optional(),
});

export const updateProjectSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .optional(),
  
  shortDesc: z.string()
    .min(10, 'La descripción corta debe tener al menos 10 caracteres')
    .max(300, 'La descripción corta no puede exceder 300 caracteres')
    .optional(),
  
  documentation: z.string()
    .min(50, 'La documentación debe tener al menos 50 caracteres')
    .optional(),
  
  mainImage: z.string()
    .url('La imagen principal debe ser una URL válida')
    .optional()
    .nullable(),
  
  startDate: z.string()
    .datetime('Fecha de inicio inválida')
    .or(z.date())
    .optional(),
  
  repoUrl: z.string()
    .url('La URL del repositorio debe ser válida')
    .optional()
    .nullable(),
});

export const projectIdSchema = z.object({
  id: z.string()
    .uuid('ID de proyecto inválido'),
});

/**
 * Tipos inferidos de los schemas
 */
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectIdParam = z.infer<typeof projectIdSchema>;
