/**
 * config/logger.ts — Logger centralizado con Winston.
 *
 * Implementa logging estructurado para toda la aplicación con:
 * - Diferentes formatos según entorno (legible en desarrollo, JSON en producción).
 * - Archivos de log rotativos en producción (error.log + combined.log).
 * - Soporte para niveles de log (error, warn, info, debug).
 * - Helper de auditoría (auditLog) para registrar acciones críticas.
 * - Silenciado automático en entorno de test.
 *
 * Principio: Los logs son la primera línea de defensa para debugging
 * y observabilidad en producción.
 */

import winston from 'winston';
import { envConfig } from './environment';

/** Niveles de log personalizados */
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

/** Colores para cada nivel en consola */
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(logColors);

/**
 * Formato de desarrollo: timestamp coloreado + mensaje legible.
 * Incluye metadatos como JSON si existen.
 */
const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta, null, 2) : '';
    return `${timestamp} [${level}]: ${message} ${metaStr}`;
  })
);

/**
 * Formato de producción: JSON estructurado con stack traces.
 * Ideal para ingestión por sistemas de logging centralizado (ELK, Datadog, etc.).
 */
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/** Transports: al menos consola, archivos en producción */
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: envConfig.isDevelopment ? developmentFormat : productionFormat,
  }),
];

if (envConfig.isProduction) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

/**
 * Instancia global del logger.
 * - level: configurable por variable de entorno LOG_LEVEL.
 * - silent: true en test para evitar ruido en las pruebas.
 * - exitOnError: false para no terminar el proceso en errores de log.
 */
export const logger = winston.createLogger({
  level: envConfig.logLevel,
  levels: logLevels,
  format: productionFormat,
  transports,
  exitOnError: false,
  silent: envConfig.isTest,
});

/**
 * auditLog — Registra acciones de auditoría.
 * Útil para trackear operaciones CRUD importantes (crear, actualizar, eliminar).
 * Cada entrada incluye: acción, timestamp, y detalles contextuales.
 *
 * @param action - Nombre de la acción (ej. "PROJECT_CREATED")
 * @param details - Metadatos adicionales (IDs, correos, etc.)
 */
export const auditLog = (action: string, details: Record<string, unknown>): void => {
  logger.info('AUDIT', {
    action,
    timestamp: new Date().toISOString(),
    ...details,
  });
};
