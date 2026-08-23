import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: error.errors.map(e => e.message).join(', '),
          data: null,
          meta: null,
        });
      }
      return res.status(400).json({ error: 'Validation error', data: null, meta: null });
    }
  };
};
