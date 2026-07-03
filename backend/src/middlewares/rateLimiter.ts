import rateLimit from 'express-rate-limit';
import { envConfig } from '../config/environment';
import { logger } from '../config/logger';

/**
 * Rate Limiter para protección contra abuso de API
 * Implementa límites por IP para prevenir ataques DoS y abuso de recursos
 */

export const rateLimiter = rateLimit({
  windowMs: envConfig.rateLimitWindowMs,
  max: envConfig.rateLimitMaxRequests,
  message: {
    error: 'Demasiadas peticiones desde esta IP, por favor intenta más tarde.',
    retryAfter: Math.ceil(envConfig.rateLimitWindowMs / 1000 / 60),
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
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
    // Excluir health checks del rate limiting
    return req.path === '/health' || req.path === '/ready';
  },
});

