import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errorHandler.js';

/**
 * Middleware para proteger rutas que requieren autenticación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al siguiente middleware
 */
export const protectRoute = (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('No autorizado, token no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar la información del usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new ApiError('Token inválido', 401);
    }
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token expirado', 401);
    }
    next(error);
  }
};

/**
 * Middleware para verificar rol de administrador
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    throw new ApiError('Acceso no autorizado, se requieren privilegios de administrador', 403);
  }
};