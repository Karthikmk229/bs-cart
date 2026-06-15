// src/middleware/error.ts
import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('[Error Handler] Caught error:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || (err.stack && process.env.NODE_ENV === 'development' ? [err.stack] : null);

  return sendError(res, message, errors, statusCode);
}
