import { Router } from 'express';
import { checkDatabaseHealth } from '../config/database';
import { envConfig } from '../config/environment';

const router = Router();

/**
 * Health check endpoint
 * Verifica que el servicio esté activo y responda
 */
router.get('/health', async (req, res) => {
  const healthCheck = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    correlationId: req.correlationId,
  };

  res.status(200).json(healthCheck);
});

/**
 * Readiness check endpoint
 * Verifica que el servicio esté listo para recibir tráfico (DB conectada, etc.)
 */
router.get('/ready', async (req, res) => {
  const dbHealthy = await checkDatabaseHealth();

  if (!dbHealthy) {
    return res.status(503).json({
      status: 'not_ready',
      reason: 'Database connection failed',
      correlationId: req.correlationId,
    });
  }

  if (envConfig.maintenanceMode) {
    return res.status(503).json({
      status: 'maintenance',
      reason: 'Service is under maintenance',
      correlationId: req.correlationId,
    });
  }

  res.status(200).json({
    status: 'ready',
    timestamp: new Date().toISOString(),
    correlationId: req.correlationId,
  });
});

export default router;
