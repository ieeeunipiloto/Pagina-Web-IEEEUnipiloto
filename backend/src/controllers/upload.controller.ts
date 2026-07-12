/**
 * controllers/upload.controller.ts — Controlador HTTP para subida de archivos.
 *
 * Recibe archivos via POST /api/upload (multipart/form-data).
 * El archivo es procesado por el middleware Multer antes de llegar aquí.
 * El controlador solo verifica que el archivo existe y devuelve la URL.
 *
 * Formato de respuesta:
 * - url: ruta relativa del archivo (/uploads/uuid.ext)
 * - filename: nombre único generado por Multer
 * - originalName: nombre original del archivo
 * - size: tamaño en bytes
 * - mimetype: tipo MIME del archivo
 */

import { Request, Response } from 'express';

export class UploadController {
  /** POST /api/upload — Subir archivo (imagen) */
  uploadFile(req: Request, res: Response): void {
    const file = req.file;

    if (!file) {
      res.status(400).json({
        success: false,
        error: 'No se envió ningún archivo',
        correlationId: req.correlationId,
      });
      return;
    }

    const url = `/uploads/${file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        url,
        filename: file.filename,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype,
      },
      message: 'Archivo subido exitosamente',
      correlationId: req.correlationId,
    });
  }
}

export const uploadController = new UploadController();
