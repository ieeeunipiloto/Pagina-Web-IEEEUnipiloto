/**
 * middlewares/correlationId.ts — Middleware de trazabilidad con Correlation ID.
 *
 * Asigna un UUID único a cada petición HTTP para rastrear su flujo
 * a través de todo el sistema (frontend, API, base de datos, logs).
 *
 * Comportamiento:
 * 1. Si el cliente envía un header x-correlation-id, lo reutiliza.
 * 2. Si no, genera un nuevo UUID v4.
 * 3. Incluye el correlationId en el header de respuesta.
 * 4. Lo adjunta a req.correlationId para uso en toda la app.
 *
 * Esto permite correlacionar logs del frontend con logs del backend.
 */

import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { envConfig } from '../config/environment';

declare global {
  namespace Express {
    interface Request {
      correlationId?: string;
    }
  }
}

export const correlationIdMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const correlationId =
    (req.headers[envConfig.correlationIdHeader] as string) || uuidv4();

  req.correlationId = correlationId;
  res.setHeader(envConfig.correlationIdHeader, correlationId);

  next();
};
