import { z } from 'zod';

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

export const createMemberSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  role: z.string()
    .min(3, 'El cargo debe tener al menos 3 caracteres')
    .max(200, 'El cargo no puede exceder 200 caracteres'),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres'),
  photo: imageUrlOrLocal.optional(),
  isLeader: z.boolean().optional().default(false),
});

export const updateMemberSchema = z.object({
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres')
    .optional(),
  role: z.string()
    .min(3, 'El cargo debe tener al menos 3 caracteres')
    .max(200, 'El cargo no puede exceder 200 caracteres')
    .optional(),
  description: z.string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .optional(),
  photo: imageUrlOrLocal.optional().nullable(),
  isLeader: z.boolean().optional(),
});

export const memberIdSchema = z.object({
  id: z.string().uuid('ID de miembro inválido'),
});

export type CreateMemberInput = z.infer<typeof createMemberSchema>;
export type UpdateMemberInput = z.infer<typeof updateMemberSchema>;
export type MemberIdParam = z.infer<typeof memberIdSchema>;
