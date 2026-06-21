import { Request, Response } from 'express';

export class UploadController {
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
