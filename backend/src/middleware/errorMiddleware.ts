import { Request, Response, NextFunction } from 'express';
import { IErrorResponse } from '@/utils/responseHandler';

/**
 * @summary
 * Global error handling middleware. Catches errors from controllers and other middleware.
 */
export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Unhandled Error:', err.stack);

  const errorResponse: IErrorResponse = {
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      details: process.env.NODE_ENV !== 'production' ? err.message : undefined,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(500).json(errorResponse);
}
