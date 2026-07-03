/**
 * app.ts — Configuración y montaje de la aplicación Express.
 *
 * Este archivo es el núcleo de configuración del servidor HTTP.
 * Orquesta middlewares de seguridad, parsing, logging, rutas y manejo
 * de errores en el orden correcto.
 *
 * Pipeline de middlewares (en orden de ejecución):
 * 1. Helmet (seguridad HTTP)
 * 2. CORS (control de acceso cruzado)
 * 3. Compression (gzip/brotli)
 * 4. Archivos estáticos (/uploads)
 * 5. JSON/URL-encoded parsing
 * 6. Correlation ID (trazabilidad)
 * 7. Morgan + Winston (logging HTTP)
 * 8. Rate Limiter (protección /api/)
 * 9. Rutas de la API
 * 10. Not Found Handler (404)
 * 11. Error Handler global
 */

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import 'express-async-errors';

import { envConfig } from './config/environment';
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { correlationIdMiddleware } from './middlewares/correlationId';
import { rateLimiter } from './middlewares/rateLimiter';
import { logger } from './config/logger';

import projectRoutes from './routes/project.routes';
import postRoutes from './routes/post.routes';
import healthRoutes from './routes/health.routes';
import contactRoutes from './routes/contact.routes';
import uploadRoutes from './routes/upload.routes';

const app: Application = express();

// ──────────────────────────────────────────────
// SEGURIDAD Y CONFIGURACIÓN GENERAL
// ──────────────────────────────────────────────

/**
 * Helmet: configura headers de seguridad HTTP.
 * - CSP activo solo en producción (orígenes específicos).
 * - HSTS con preload en producción.
 * - Políticas cross-origin flexibles en desarrollo.
 */
app.use(helmet({
  contentSecurityPolicy: envConfig.nodeEnv === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  } : false,
  hsts: envConfig.nodeEnv === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));

/**
 * CORS: control de acceso HTTP.
 * - Desarrollo: permite todos los orígenes (true).
 * - Producción: solo orígenes especificados en CORS_ORIGIN.
 */
app.use(cors({
  origin: envConfig.nodeEnv === 'development' 
    ? true
    : envConfig.corsOrigin.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'x-correlation-id'],
}));

/** Compresión gzip de respuestas */
app.use(compression());

/** Archivos estáticos: subidas (imágenes, documentos) */
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

/** Parsing de JSON y formularios con límite de 10MB */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ──────────────────────────────────────────────
// OBSERVABILIDAD Y TRAZABILIDAD
// ──────────────────────────────────────────────

/** Correlation ID: UUID único por petición para trazabilidad */
app.use(correlationIdMiddleware);

/** Morgan: logging HTTP en formato combined, integrado con Winston */
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
}));

// ──────────────────────────────────────────────
// RATE LIMITING
// ──────────────────────────────────────────────

/** Protección contra abuso: límite de peticiones por IP en rutas /api/ */
app.use('/api/', rateLimiter);

// ──────────────────────────────────────────────
// RUTAS
// ──────────────────────────────────────────────

/** Endpoint de prueba simple */
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint works!' });
});

/** Health checks (sin rate limiting para monitoreo) */
app.use('/health', healthRoutes);
app.use('/ready', healthRoutes);

/** Rutas de recursos CRUD */
app.use('/api/projects', projectRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', contactRoutes);
app.use('/api', uploadRoutes);

// ──────────────────────────────────────────────
// MANEJO DE ERRORES
// ──────────────────────────────────────────────

/** 404: rutas no encontradas */
app.use(notFoundHandler);

/** Error handler global (Zod, AppError, Prisma, Multer, genérico) */
app.use(errorHandler);

export default app;
