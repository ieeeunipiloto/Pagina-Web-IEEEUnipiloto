import dotenv from 'dotenv';
import { z } from 'zod';

// Cargar variables de entorno desde .env.example
dotenv.config({ path: '.env' });

/**
 * Schema de validación para variables de entorno
 * Aplica principio de fail-fast: si la configuración es inválida, no arrancar
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3000'),
  
  DATABASE_URL: z.string().url('DATABASE_URL debe ser una URL válida'),
  
  
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['json', 'simple']).default('json'),
  
  MAX_FILE_SIZE_MB: z.string().transform(Number).default('5'),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,image/avif'),
  
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  
  ENABLE_METRICS: z.string().transform((v) => v === 'true').default('true'),
  CORRELATION_ID_HEADER: z.string().default('x-correlation-id'),
  
  MAINTENANCE_MODE: z.string().transform((v) => v === 'true').default('false'),
});

/**
 * Validar y exportar configuración
 */
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Error en configuración de entorno:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      console.error('\n⚠️  Revisa el archivo .env y asegúrate de que todas las variables estén configuradas correctamente.');
    }
    process.exit(1);
  }
};

const env = parseEnv();

/**
 * Configuración centralizada de la aplicación
 */
export const envConfig = {
  // General
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  
  // Database
  databaseUrl: env.DATABASE_URL,
  
  
  // CORS
  corsOrigin: env.CORS_ORIGIN,
  
  // Rate Limiting
  rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  
  // Logging
  logLevel: env.LOG_LEVEL,
  logFormat: env.LOG_FORMAT,
  
  // Files
  maxFileSizeMB: env.MAX_FILE_SIZE_MB,
  maxFileSizeBytes: env.MAX_FILE_SIZE_MB * 1024 * 1024,
  allowedFileTypes: env.ALLOWED_FILE_TYPES.split(','),
  
  // Frontend
  frontendUrl: env.FRONTEND_URL,
  
  // Observabilidad
  enableMetrics: env.ENABLE_METRICS,
  correlationIdHeader: env.CORRELATION_ID_HEADER,
  
  // Mantenimiento
  maintenanceMode: env.MAINTENANCE_MODE,
} as const;

// Tipo inferido de la configuración
export type EnvConfig = typeof envConfig;
