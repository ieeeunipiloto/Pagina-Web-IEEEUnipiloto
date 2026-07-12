/**
 * middlewares/errorHandler.ts — Manejo global de errores HTTP.
 *
 * Centraliza el logging y la respuesta de errores en toda la aplicación.
 * Clasifica errores por tipo y devuelve respuestas HTTP apropiadas:
 *
 * Tipos de error manejados:
 * 1. ZodError        → 400 (errores de validación de schema)
 * 2. AppError        → statusCode personalizado (400, 404, etc.)
 * 3. MulterError     → 400 (subida de archivos)
 * 4. File type error → 400 (tipo de archivo no permitido)
 * 5. PrismaError     → 400 (errores de base de datos)
 * 6. Error genérico  → 500 (no expone detalles en producción)
 *
 * Clases de error exportadas:
 * - AppError: clase base con statusCode y isOperational
 * - ValidationError: 400 Bad Request
 * - NotFoundError: 404 Not Found (con nombre del recurso)
 */

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';
import { envConfig } from '../config/environment';

// ──────────────────────────────────────────────
// CLASES DE ERROR PERSONALIZADAS
// ──────────────────────────────────────────────

/** Error base de la aplicación con código HTTP */
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

/** Error de validación (400 Bad Request) */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/** Error de recurso no encontrado (404) */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} no encontrado`);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// ──────────────────────────────────────────────
// MIDDLEWARE DE ERRORES
// ──────────────────────────────────────────────

/**
 * errorHandler — Middleware global de Express (4 parámetros).
 * Captura cualquier error lanzado en la cadena de middlewares/rutas
 * y devuelve una respuesta JSON estructurada.
 *
 * Incluye logging detallado con correlationId para trazabilidad.
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  logger.error('Error capturado:', {
    name: err.name,
    message: err.message,
    stack: envConfig.isDevelopment ? err.stack : undefined,
    path: req.path,
    method: req.method,
    correlationId: req.correlationId,
    ip: req.ip,
  });

  /* Zod: errores de validación con detalles campo por campo */
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

  /* AppError: errores personalizados con código específico */
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      correlationId: req.correlationId,
    });
    return;
  }

  /* Multer: errores de subida de archivos */
  if (err.name === 'MulterError') {
    const multerErr = err as unknown as { code: string; field?: string; message: string };
    res.status(400).json({
      error: multerErr.message,
      correlationId: req.correlationId,
    });
    return;
  }

  /* Tipo de archivo no permitido */
  if (err.message?.includes('Tipo de archivo no permitido')) {
    res.status(400).json({
      error: err.message,
      correlationId: req.correlationId,
    });
    return;
  }

  /* Prisma: errores de base de datos */
  if (err.name === 'PrismaClientKnownRequestError') {
    res.status(400).json({
      error: 'Error en la operación de base de datos',
      correlationId: req.correlationId,
    });
    return;
  }

  /* Error genérico: no exponer stack en producción */
  res.status(500).json({
    error: envConfig.isProduction
      ? 'Error interno del servidor'
      : err.message,
    correlationId: req.correlationId,
    ...(envConfig.isDevelopment && { stack: err.stack }),
  });
};
