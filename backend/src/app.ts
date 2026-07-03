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

// Importar rutas
import projectRoutes from './routes/project.routes';
import postRoutes from './routes/post.routes';
import healthRoutes from './routes/health.routes';
import contactRoutes from './routes/contact.routes';
import uploadRoutes from './routes/upload.routes';

const app: Application = express();

// ============================================
// SEGURIDAD Y CONFIGURACIÓN GENERAL
// ============================================

// Helmet: headers de seguridad HTTP (configuración flexible en desarrollo)
app.use(helmet({
  contentSecurityPolicy: envConfig.nodeEnv === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  } : false, // Desactivar CSP en desarrollo
  hsts: envConfig.nodeEnv === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  } : false,
  crossOriginEmbedderPolicy: false,
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
}));

// CORS: configuración flexible en desarrollo, restrictiva en producción
app.use(cors({
  origin: envConfig.nodeEnv === 'development' 
    ? true // Permitir todos los orígenes en desarrollo
    : envConfig.corsOrigin.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'x-correlation-id'],
}));

// Compresión de respuestas
app.use(compression());

// Servir archivos estáticos (uploads)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Parsing de JSON con límite de tamaño
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// OBSERVABILIDAD Y TRAZABILIDAD
// ============================================

// Correlation ID para todas las peticiones
app.use(correlationIdMiddleware);

// Logging HTTP (Morgan + Winston)
app.use(morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    },
  },
}));

// ============================================
// RATE LIMITING - PROTECCIÓN CONTRA ABUSO
// ============================================
app.use('/api/', rateLimiter);

// ============================================
// RUTAS DE LA API
// ============================================

// Ruta de prueba simple
app.get('/test', (req, res) => {
  res.json({ message: 'Test endpoint works!' });
});

// Health checks (sin rate limiting)
app.use('/health', healthRoutes);
app.use('/ready', healthRoutes);

// Rutas de recursos
app.use('/api/projects', projectRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', contactRoutes);
app.use('/api', uploadRoutes);

// ============================================
// MANEJO DE ERRORES
// ============================================

// Ruta no encontrada
app.use(notFoundHandler);

// Manejador global de errores
app.use(errorHandler);

export default app;
