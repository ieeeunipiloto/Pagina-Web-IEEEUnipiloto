import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { auditLog } from '../config/logger';
import { envConfig } from '../config/environment';

function safeCompare(provided: string, stored: string): boolean {
  const bufProvided = Buffer.from(provided);
  const bufStored = Buffer.from(stored);

  if (bufProvided.length !== bufStored.length) {
    crypto.timingSafeEqual(bufProvided, bufProvided);
    return false;
  }

  return crypto.timingSafeEqual(bufProvided, bufStored);
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-admin-key'] as string | undefined;

  if (!apiKey) {
    auditLog('UNAUTHORIZED_WRITE_ATTEMPT', {
      method: req.method,
      path: req.originalUrl,
      correlationId: req.correlationId,
      reason: 'missing_api_key',
    });
    res.status(403).json({ error: 'forbidden' });
    return;
  }

  if (!safeCompare(apiKey, envConfig.adminApiKey)) {
    auditLog('UNAUTHORIZED_WRITE_ATTEMPT', {
      method: req.method,
      path: req.originalUrl,
      correlationId: req.correlationId,
      reason: 'invalid_api_key',
    });
    res.status(403).json({ error: 'forbidden' });
    return;
  }

  auditLog('ADMIN_WRITE_OPERATION', {
    method: req.method,
    path: req.originalUrl,
    correlationId: req.correlationId,
  });

  next();
};
