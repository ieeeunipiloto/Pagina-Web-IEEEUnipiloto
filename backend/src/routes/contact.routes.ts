/**
 * routes/contact.routes.ts — Ruta para el formulario de contacto.
 *
 * POST /api/contact — Envía un correo con los datos del formulario.
 * Validación Zod: email válido + mensaje entre 10 y 2000 caracteres.
 */

import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { validate } from '../middlewares/validation';
import { contactSchema } from '../types/contact.schema';

const router = Router();

router.post(
  '/contact',
  validate(contactSchema),
  contactController.sendContact.bind(contactController),
);

export default router;
