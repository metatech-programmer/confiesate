import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errorHandler.js';

/**
 * Genera un token JWT para autenticación
 * @param {Object} payload - Datos a incluir en el token
 * @returns {string} - Token JWT
 */
export const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  });
};

/**
 * Controlador para generar token de acceso para administradores
 */
export const generateAdminToken = async (req, res, next) => {
  try {
    const { adminKey } = req.body;
    
    // Esta es una implementación básica - en producción se debería
    // validar contra una base de datos o un servicio de autenticación
    if (!adminKey || adminKey !== process.env.ADMIN_KEY) {
      throw new ApiError('Credenciales inválidas', 401);
    }
    
    // Generar token para administrador
    const token = generateToken({
      role: 'admin',
      type: 'access_token'
    });
    
    res.status(200).json({
      success: true,
      data: {
        token,
        expiresIn: process.env.JWT_EXPIRES_IN || '24h'
      }
    });
  } catch (error) {
    next(error);
  }
};