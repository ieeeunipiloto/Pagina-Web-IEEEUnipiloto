import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

/**
 * Middleware de validación usando Zod
 * Valida request body, query params y params de ruta
 */

type ValidateSource = 'body' | 'query' | 'params';

export const validate =
  (schema: AnyZodObject, source: ValidateSource = 'body') =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validar la fuente especificada
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
