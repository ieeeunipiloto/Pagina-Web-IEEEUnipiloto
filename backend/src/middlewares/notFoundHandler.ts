/**
 * middlewares/notFoundHandler.ts — Manejador de rutas no encontradas (404).
 *
 * Middleware catch-all que se ejecuta cuando ninguna ruta coincide.
 * Devuelve una respuesta JSON 404 con la ruta y método intentados,
 * más el correlationId para depuración.
 */

import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Recurso no encontrado',
    path: req.path,
    method: req.method,
    correlationId: req.correlationId,
  });
};
