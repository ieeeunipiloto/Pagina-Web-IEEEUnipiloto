import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { envConfig } from '../config/environment';

/**
 * Middleware de Correlation ID
 * Genera o extrae un ID único para rastrear peticiones a través de todo el sistema
 * Esencial para observabilidad y debugging distribuido
 */

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
  // Obtener correlation ID del header o generar uno nuevo
  const correlationId =
    (req.headers[envConfig.correlationIdHeader] as string) || uuidv4();

  // Adjuntar al request para uso en toda la aplicación
  req.correlationId = correlationId;

  // Incluir en la respuesta para trazabilidad
  res.setHeader(envConfig.correlationIdHeader, correlationId);

  next();
};
