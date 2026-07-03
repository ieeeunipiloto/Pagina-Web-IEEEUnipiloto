/**
 * index.ts — Punto de entrada del servidor backend.
 *
 * Responsabilidades:
 * 1. Sincronizar el schema de Prisma con la base de datos (prisma db push).
 * 2. Conectar a la base de datos PostgreSQL.
 * 3. Iniciar el servidor HTTP en el puerto configurado.
 * 4. Configurar graceful shutdown (SIGTERM, SIGINT).
 * 5. Capturar errores no manejados (unhandledRejection, uncaughtException).
 *
 * El servidor escucha en 0.0.0.0 para ser accesible desde la red
 * (Docker, red local, etc.).
 */

import { execSync } from 'child_process';
import app from './app';
import { envConfig } from './config/environment';
import { logger } from './config/logger';
import { prisma } from './config/database';

/**
 * syncDatabase — Sincroniza el schema de Prisma con la base de datos.
 *
 * Ejecuta "prisma db push --skip-generate" que crea/actualiza tablas
 * sin eliminar datos existentes. Es seguro para usar en inicio del servidor
 * porque no ejecuta migraciones destructivas.
 *
 * El --skip-generate evita regenerar el cliente Prisma si ya existe.
 */
const syncDatabase = (): void => {
  try {
    logger.info('Sincronizando schema de base de datos...');
    execSync('npx prisma db push --skip-generate', { stdio: 'pipe' });
    logger.info('Schema de base de datos sincronizado');
  } catch (error) {
    logger.warn('No se pudo sincronizar el schema, puede que ya esté actualizado');
  }
};

/**
 * startServer — Inicializa el servidor con manejo de señales y errores.
 *
 * Flujo:
 * 1. Sincroniza la base de datos.
 * 2. Conecta Prisma Client.
 * 3. Escucha en el puerto configurado.
 * 4. Registra handlers para SIGTERM, SIGINT, unhandledRejection, uncaughtException.
 */
const startServer = async (): Promise<void> => {
  try {
    syncDatabase();

    await prisma.$connect();
    logger.info('Conexión a base de datos establecida');

    const server = app.listen(envConfig.port, () => {
      logger.info(`Servidor ejecutándose en modo ${envConfig.nodeEnv}`);
      logger.info(`URL Local: http://localhost:${envConfig.port}`);
      logger.info(`Escuchando en todas las interfaces (0.0.0.0:${envConfig.port})`);
    });

    /**
     * gracefulShutdown — Cierre ordenado del servidor.
     * 1. Cierra el servidor HTTP (deja de aceptar peticiones).
     * 2. Desconecta Prisma (cierra conexiones a la BD).
     * 3. Termina el proceso con código 0.
     *
     * Si el cierre no se completa en 10 segundos, fuerza exit(1).
     */
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`Señal ${signal} recibida. Cerrando servidor...`);
      
      server.close(async () => {
        logger.info('Servidor HTTP cerrado');
        await prisma.$disconnect();
        logger.info('Conexión a base de datos cerrada');
        process.exit(0);
      });

      setTimeout(() => {
        logger.error('Forzando cierre del servidor');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

  } catch (error) {
    logger.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();
