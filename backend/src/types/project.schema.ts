/**
 * types/project.schema.ts — Schemas Zod de validación para Proyectos.
 *
 * Define reglas de validación para crear y actualizar proyectos.
 * Utiliza el validador personalizado imageUrlOrLocal que acepta
 * URLs absolutas o rutas locales /uploads/...
 *
 * Schemas:
 * - createProjectSchema: todos los campos requeridos (excepto opcionales).
 * - updateProjectSchema: todos los campos opcionales (merge parcial).
 * - projectIdSchema: valida UUID en parámetros de ruta.
 */

import { z } from 'zod';

/**
 * Validador personalizado para URLs de imagen.
 * Acepta:
 * - URLs absolutas (https://ejemplo.com/img.jpg)
 * - Rutas locales (/uploads/uuid.ext)
 */
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

/** Schema para crear un proyecto (todos los campos obligatorios) */
export const createProjectSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  
  shortDesc: z.string()
    .min(10, 'La descripción corta debe tener al menos 10 caracteres')
    .max(300, 'La descripción corta no puede exceder 300 caracteres'),
  
  documentation: z.string()
    .min(50, 'La documentación debe tener al menos 50 caracteres'),
  
  mainImage: imageUrlOrLocal.optional(),
  
  startDate: z.string()
    .datetime('Fecha de inicio inválida')
    .or(z.date())
    .optional(),
  
  repoUrl: z.string()
    .url('La URL del repositorio debe ser válida')
    .optional(),
});

/** Schema para actualizar un proyecto (todos los campos opcionales) */
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
  
  mainImage: imageUrlOrLocal.optional().nullable(),
  
  startDate: z.string()
    .datetime('Fecha de inicio inválida')
    .or(z.date())
    .optional(),
  
  repoUrl: z.string()
    .url('La URL del repositorio debe ser válida')
    .optional()
    .nullable(),
});

/** Schema para validar el ID del proyecto en parámetros de ruta */
export const projectIdSchema = z.object({
  id: z.string()
    .uuid('ID de proyecto inválido'),
});

/** Tipos inferidos automáticamente por Zod */
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectIdParam = z.infer<typeof projectIdSchema>;
