/**
 * middlewares/validation.ts — Middleware de validación con Zod.
 *
 * Middleware genérico que valida cualquier fuente de datos
 * (body, query params, route params) contra un schema de Zod.
 *
 * Uso típico:
 *   router.post('/', validate(createProjectSchema), controller.create)
 *   router.get('/:id', validate(projectIdSchema, 'params'), controller.get)
 *
 * Si la validación falla, devuelve 400 con detalles campo por campo
 * y el correlationId para trazabilidad.
 */

import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

type ValidateSource = 'body' | 'query' | 'params';

export const validate =
  (schema: AnyZodObject, source: ValidateSource = 'body') =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = req[source];
      await schema.parseAsync(data);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Error de validación',
          details: error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
          correlationId: req.correlationId,
        });
        return;
      }
      next(error);
    }
  };
