import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { envConfig } from '../config/environment';

/**
 * Clases de error personalizadas
 */

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} no encontrado`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}



/**
 * Middleware global de manejo de errores
 * Centraliza el manejo y logging de errores de toda la aplicación
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  // Log del error con contexto
  logger.error('Error capturado:', {
    name: err.name,
    message: err.message,
    stack: envConfig.isDevelopment ? err.stack : undefined,
    path: req.path,
    method: req.method,
    correlationId: req.correlationId,
    ip: req.ip,
  });

  // Errores de validación Zod
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Error de validación',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
      correlationId: req.correlationId,
    });
    return;
  }

  // Errores de aplicación personalizados
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      correlationId: req.correlationId,
    });
    return;
  }

  // Errores de Multer (subida de archivos)
  if (err.name === 'MulterError') {
    const multerErr = err as unknown as { code: string; field?: string; message: string };
    res.status(400).json({
      error: multerErr.message,
      correlationId: req.correlationId,
    });
    return;
  }

  // Errores de archivo no permitido (lanzados por fileFilter)
  if (err.message?.includes('Tipo de archivo no permitido')) {
    res.status(400).json({
      error: err.message,
      correlationId: req.correlationId,
    });
    return;
  }

  // Errores de Prisma (base de datos)
  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      error: 'Error en la operación de base de datos',
      correlationId: req.correlationId,
    });
    return;
  }

  // Error genérico (no exponer detalles en producción)
  res.status(500).json({
    error: envConfig.isProduction
      ? 'Error interno del servidor'
      : err.message,
    correlationId: req.correlationId,
    ...(envConfig.isDevelopment && { stack: err.stack }),
  });
};
