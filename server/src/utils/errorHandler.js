// src/utils/errorHandler.js

/**
 * Clase para manejar errores de la API
 */
class ApiError extends Error {
    /**
     * Constructor para crear un nuevo error de API
     * @param {string} message - Mensaje de error
     * @param {number} statusCode - Código HTTP de error (default: 500)
     */
    constructor(message, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
      this.name = 'ApiError';
    }
  }
  
  /**
   * Middleware para manejar errores globalmente
   */
  const errorMiddleware = (err, req, res, next) => {
    console.error('Error:', err);
    
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';
    
    res.status(statusCode).json({
      status: 'error',
      message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  };
  
  module.exports = {
    ApiError,
    errorMiddleware
  };