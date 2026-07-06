/**
 * config/environment.ts — Validación y configuración de variables de entorno.
 *
 * Utiliza Zod para definir un schema de validación estricto que garantiza
 * que todas las variables de entorno requeridas estén presentes y tengan
 * el formato correcto antes de que la aplicación arranque.
 *
 * Principio: Fail-Fast — si la configuración es inválida, el proceso
 * termina inmediatamente con mensajes claros de los errores encontrados.
 *
 * Variables validadas:
 * - Generales: NODE_ENV, PORT
 * - Base de datos: DATABASE_URL
 * - CORS: CORS_ORIGIN
 * - Rate Limiting: RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS
 * - Logging: LOG_LEVEL, LOG_FORMAT
 * - Archivos: MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES
 * - Observabilidad: CORRELATION_ID_HEADER, ENABLE_METRICS
 * - Mantenimiento: MAINTENANCE_MODE
 * - Email/SMTP: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL
 */

import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '.env' });

/**
 * Schema Zod para validar todas las variables de entorno.
 * Cada campo define tipo, validación y valor por defecto.
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).pipe(z.number().min(1).max(65535)).default('3000'),
  
  DATABASE_URL: z.string().url('DATABASE_URL debe ser una URL válida'),
  
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('100'),
  
  ADMIN_API_KEY: z.string().min(1, 'ADMIN_API_KEY es requerida para proteger rutas de escritura'),

  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['json', 'simple']).default('json'),
  
  MAX_FILE_SIZE_MB: z.string().transform(Number).default('5'),
  ALLOWED_FILE_TYPES: z.string().default('image/jpeg,image/png,image/webp,image/avif'),
  
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  
  ENABLE_METRICS: z.string().transform((v) => v === 'true').default('true'),
  CORRELATION_ID_HEADER: z.string().default('x-correlation-id'),
  
  MAINTENANCE_MODE: z.string().transform((v) => v === 'true').default('false'),

  SMTP_HOST: z.string().default('smtp.gmail.com'),
  SMTP_PORT: z.string().transform(Number).default('587'),
  SMTP_USER: z.string().default(''),
  SMTP_PASS: z.string().default(''),
  CONTACT_EMAIL: z.string().email().default('ramaieee@unipiloto.edu.co'),
});

/**
 * Parsea y valida las variables de entorno.
 * En caso de error, imprime los detalles y termina el proceso.
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
 * Objeto de configuración tipado y de solo lectura.
 * Provee acceso centralizado a todas las variables de entorno
 * con valores ya transformados (números, booleanos, etc.).
 */
export const envConfig = {
  // Generales
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  isProduction: env.NODE_ENV === 'production',
  isDevelopment: env.NODE_ENV === 'development',
  isTest: env.NODE_ENV === 'test',
  
  // Base de datos
  databaseUrl: env.DATABASE_URL,
  
  // CORS
  corsOrigin: env.CORS_ORIGIN,
  
  // Rate Limiting
  rateLimitWindowMs: env.RATE_LIMIT_WINDOW_MS,
  rateLimitMaxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  
  // Admin API Key
  adminApiKey: env.ADMIN_API_KEY,

  // Logging
  logLevel: env.LOG_LEVEL,
  logFormat: env.LOG_FORMAT,
  
  // Archivos
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

  // SMTP / Email
  smtpHost: env.SMTP_HOST,
  smtpPort: env.SMTP_PORT,
  smtpUser: env.SMTP_USER,
  smtpPass: env.SMTP_PASS,
  contactEmail: env.CONTACT_EMAIL,
} as const;

/** Tipo inferido para uso en otros módulos */
export type EnvConfig = typeof envConfig;
