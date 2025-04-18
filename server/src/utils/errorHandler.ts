import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

/**
 * Clase para manejar errores de la API
 */
export class ApiError extends Error {
  statusCode: number;

  /**
   * Constructor para crear un nuevo error de API
   * @param {string} message - Mensaje de error
   * @param {number} statusCode - Código HTTP de error (default: 500)
   */
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
  }
}

/**
 * Middleware para manejar errores globalmente
 */
export const errorMiddleware: ErrorRequestHandler = (
  error: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', error);

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
    return;
  }

  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
};