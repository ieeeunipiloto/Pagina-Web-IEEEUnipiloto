/**
 * tests/integration/health.test.ts — Pruebas de integración para health checks.
 *
 * Verifica que los endpoints /health y /ready respondan correctamente
 * con los campos esperados en la respuesta JSON.
 *
 * Usa Supertest para hacer peticiones HTTP directamente a la app Express
 * sin necesidad de levantar el servidor real.
 */

import request from 'supertest';
import app from '../../src/app';

describe('Health Routes', () => {
  describe('GET /health', () => {
    it('should return 200 with health status, timestamp, uptime and correlationId', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('correlationId');
    });
  });

  describe('GET /ready', () => {
    it('should return 200 with ready status and correlationId', async () => {
      const response = await request(app)
        .get('/ready')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ready');
      expect(response.body).toHaveProperty('correlationId');
    });
  });
});
