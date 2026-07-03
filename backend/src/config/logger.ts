import winston from 'winston';
import { envConfig } from './environment';

/**
 * Logger centralizado con Winston
 * Implementa logging estructurado para observabilidad y auditoría
 */

const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  debug: 'blue',
};

winston.addColors(logColors);

/**
 * Formato para desarrollo (legible)
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
 * Formato para producción (JSON estructurado)
 */
const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

/**
 * Transports según el entorno
 */
const transports: winston.transport[] = [
  new winston.transports.Console({
    format: envConfig.isDevelopment ? developmentFormat : productionFormat,
  }),
];

// En producción, agregar transports adicionales (archivos, servicios externos)
if (envConfig.isProduction) {
  transports.push(
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
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
 * Instancia del logger
 */
export const logger = winston.createLogger({
  level: envConfig.logLevel,
  levels: logLevels,
  format: productionFormat,
  transports,
  exitOnError: false,
  silent: envConfig.isTest, // Silenciar en tests
});

/**
 * Helper para logging de auditoría
 * Incluye información adicional requerida para cumplimiento
 */
export const auditLog = (action: string, details: Record<string, unknown>): void => {
  logger.info('AUDIT', {
    action,
    timestamp: new Date().toISOString(),
    ...details,
  });
};
