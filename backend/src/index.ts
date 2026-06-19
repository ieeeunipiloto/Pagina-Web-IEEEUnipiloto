import app from './app';
import { envConfig } from './config/environment';
import { logger } from './config/logger';
import { prisma } from './config/database';

/**
 * Inicialización del servidor con manejo de errores y señales
 */
const startServer = async (): Promise<void> => {
  try {
    // Verificar conexión a base de datos
    await prisma.$connect();
    logger.info('✅ Conexión a base de datos establecida');

    // Iniciar servidor en todas las interfaces de red
    const server = app.listen(envConfig.port, () => {
      logger.info(`🚀 Servidor ejecutándose en modo ${envConfig.nodeEnv}`);
      logger.info(`🌐 URL Local: http://localhost:${envConfig.port}`);
      logger.info(`🌐 URL Red: http://192.168.1.2:${envConfig.port}`);
      logger.info(`📊 Health check: http://localhost:${envConfig.port}/health/health`);
      logger.info(`📡 Escuchando en todas las interfaces (0.0.0.0:${envConfig.port})`);
    });

    // Graceful shutdown
    const gracefulShutdown = async (signal: string): Promise<void> => {
      logger.info(`⚠️  Señal ${signal} recibida. Cerrando servidor...`);
      
      server.close(async () => {
        logger.info('🔌 Servidor HTTP cerrado');
        
        // Cerrar conexión a base de datos
        await prisma.$disconnect();
        logger.info('🔌 Conexión a base de datos cerrada');
        
        process.exit(0);
      });

      // Forzar cierre después de 10 segundos
      setTimeout(() => {
        logger.error('❌ Forzando cierre del servidor');
        process.exit(1);
      }, 10000);
    };

    // Capturar señales de terminación
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Capturar errores no manejados
    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('❌ Unhandled Rejection:', reason);
      gracefulShutdown('unhandledRejection');
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('❌ Uncaught Exception:', error);
      gracefulShutdown('uncaughtException');
    });

  } catch (error) {
    logger.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar servidor
startServer();
