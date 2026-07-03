/**
 * routes/upload.routes.ts — Ruta para subida de archivos.
 *
 * POST /api/upload — Sube un archivo (imagen) al servidor.
 * Usa el middleware Multer configurado para almacenamiento en disco,
 * filtro de tipos MIME y límite de tamaño.
 *
 * El campo del formulario debe llamarse "file".
 */

import { Router } from 'express';
import { uploadController } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload';

const router = Router();

router.post(
  '/upload',
  upload.single('file'),
  uploadController.uploadFile.bind(uploadController),
);

export default router;
