/**
 * middlewares/rateLimiter.ts — Limitador de tasa de peticiones (Rate Limiting).
 *
 * Protege la API contra abuso y ataques de fuerza bruta limitando
 * el número de peticiones por dirección IP en una ventana de tiempo.
 *
 * Configuración:
 * - windowMs: ventana de tiempo (ms) desde variable de entorno.
 * - max: máximo de peticiones por ventana.
 * - Excluye rutas /health y /ready del rate limiting.
 * - Headers estándar RateLimit-* incluidos en respuestas.
 * - Log de advertencia cuando se supera el límite.
 */

import rateLimit from 'express-rate-limit';
import { envConfig } from '../config/environment';
import { logger } from '../config/logger';

export const rateLimiter = rateLimit({
  windowMs: envConfig.rateLimitWindowMs,
  max: envConfig.rateLimitMaxRequests,
  message: {
    error: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
    retryAfter: Math.ceil(envConfig.rateLimitWindowMs / 1000 / 60),
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      correlationId: req.correlationId,
    });

    res.status(429).json({
      error: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
      retryAfter: Math.ceil(envConfig.rateLimitWindowMs / 1000 / 60),
    });
  },
  skip: (req) => {
    return req.path === '/health' || req.path === '/ready';
  },
});

