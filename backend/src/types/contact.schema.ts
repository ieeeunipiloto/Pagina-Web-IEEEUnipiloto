import { z } from 'zod';

export const contactSchema = z.object({
  email: z.string()
    .email('El correo electrónico no es válido'),

  message: z.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(2000, 'El mensaje no puede exceder 2000 caracteres'),
});

export type ContactInput = z.infer<typeof contactSchema>;
