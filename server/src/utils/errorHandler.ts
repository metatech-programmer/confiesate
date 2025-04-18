import { Request, Response, NextFunction } from 'express';

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
export const errorMiddleware = (
  error: Error | ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  console.error('Error:', error);

  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message
    });
  }

  return res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor'
  });
};