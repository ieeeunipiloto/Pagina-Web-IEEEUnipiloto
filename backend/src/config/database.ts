/**
 * config/database.ts — Configuración y singleton de Prisma Client.
 *
 * Implementa el patrón Singleton para Prisma Client, asegurando que
 * solo exista una instancia de conexión a la base de datos durante
 * todo el ciclo de vida de la aplicación.
 *
 * Características:
 * - Logging de queries en desarrollo para depuración.
 * - Eventos de error y warning con logging estructurado.
 * - Función de health check (SELECT 1) para readiness probes.
 * - Reutilización en desarrollo gracias a globalThis (evita
 *   múltiples instancias con hot-reload de tsx/ts-node-dev).
 */

import { PrismaClient } from '@prisma/client';
import { logger } from './logger';

/**
 * Función factory para crear una nueva instancia de PrismaClient
 * con configuración de logging basada en eventos.
 */
const prismaClientSingleton = (): PrismaClient => {
  return new PrismaClient({
    log: [
      { emit: 'event', level: 'query' },
      { emit: 'event', level: 'error' },
      { emit: 'event', level: 'warn' },
    ],
  });
};

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

/**
 * Instancia única de Prisma.
 * En desarrollo se almacena en globalThis para sobrevivir a recargas.
 */
export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

/** En desarrollo, loguea todas las queries SQL ejecutadas */
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Query:', {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });
}

/** Loguea errores de base de datos */
prisma.$on('error', (e) => {
  logger.error('Database error:', {
    message: e.message,
    target: e.target,
  });
});

/** Loguea advertencias de base de datos */
prisma.$on('warn', (e) => {
  logger.warn('Database warning:', {
    message: e.message,
    target: e.target,
  });
});

/**
 * checkDatabaseHealth — Verifica que la base de datos responda.
 * Ejecuta "SELECT 1" y retorna true si la conexión es exitosa.
 * Útil para readiness probes en orquestadores (Kubernetes, Docker).
 */
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
};
