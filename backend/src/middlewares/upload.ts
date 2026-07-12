/**
 * middlewares/upload.ts — Configuración de Multer para subida de archivos.
 *
 * Middleware de Express para manejar peticiones multipart/form-data.
 * Configura:
 * - Almacenamiento en disco en la carpeta uploads/.
 * - Nombres de archivo únicos (UUID + extensión original).
 * - Filtro de tipos MIME permitidos (imágenes: JPEG, PNG, WebP, AVIF).
 * - Límite de tamaño configurable (MAX_FILE_SIZE_MB).
 *
 * Si el tipo de archivo no está permitido, lanza un error que es
 * capturado por el errorHandler global.
 */

import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { envConfig } from '../config/environment';
import { v4 as uuidv4 } from 'uuid';

const UPLOADS_DIR = path.resolve(__dirname, '../../uploads');

/** Configuración de almacenamiento en disco */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${uuidv4()}${ext}`;
    cb(null, uniqueName);
  },
});

/** Filtro de tipos de archivo permitidos */
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (envConfig.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Tipo de archivo no permitido. Tipos aceptados: ${envConfig.allowedFileTypes.join(', ')}`));
  }
};

/** Middleware de Multer exportado para usar en rutas */
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: envConfig.maxFileSizeBytes,
  },
});
