/**
 * types/contact.schema.ts — Schema Zod de validación para Contacto.
 *
 * Valida los datos del formulario de contacto:
 * - email: debe ser una dirección de correo electrónico válida.
 * - message: entre 10 y 2000 caracteres.
 */

import { z } from 'zod';

export const contactSchema = z.object({
  email: z.string()
    .email('El correo electrónico no es válido'),

  message: z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres'),
});

export type ContactInput = z.infer<typeof contactSchema>;
