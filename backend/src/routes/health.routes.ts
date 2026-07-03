/**
 * routes/health.routes.ts — Endpoints de health check y readiness.
 *
 * Estos endpoints son utilizados por orquestadores (Docker, Kubernetes)
 * para determinar el estado del servicio:
 *
 * - GET /health: verifica que el proceso esté vivo y responda.
 * - GET /ready: verifica que el servicio esté listo (DB conectada,
 *   modo mantenimiento, etc.).
 *
 * Ambos endpoints están excluidos del rate limiting y CORS restrictivo
 * para que los sistemas de monitoreo puedan acceder sin problemas.
 */

import { Router } from 'express';
import { checkDatabaseHealth } from '../config/database';
import { envConfig } from '../config/environment';

const router = Router();

/**
 * GET /health — Liveness probe.
 * Responde siempre 200 si el servidor está corriendo.
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
 * GET /ready — Readiness probe.
 * Responde:
 * - 200 + status "ready" si todo está bien.
 * - 503 + status "not_ready" si la DB no responde.
 * - 503 + status "maintenance" si el modo mantenimiento está activo.
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
