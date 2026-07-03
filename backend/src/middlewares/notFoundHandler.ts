import { Request, Response } from 'express';

/**
 * Middleware para rutas no encontradas (404)
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Recurso no encontrado',
    path: req.path,
    method: req.method,
    correlationId: req.correlationId,
  });
};
