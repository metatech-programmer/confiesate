import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errorHandler';

interface JwtPayload {
  role?: string;
  [key: string]: any;
}

interface AuthRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware para proteger rutas que requieren autenticación
 */
export const protectRoute = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      throw new ApiError('No autorizado, token no proporcionado', 401);
    }

    const token = authHeader.split(' ')[1];
    
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET no está configurado');
    }

    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    
    // Agregar la información del usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError('Token inválido', 401));
      return;
    }
    if (error instanceof jwt.TokenExpiredError) {
      next(new ApiError('Token expirado', 401));
      return;
    }
    next(error);
  }
};

/**
 * Middleware para verificar rol de administrador
 */
export const isAdmin = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== 'admin') {
    next(new ApiError('Acceso no autorizado, se requieren privilegios de administrador', 403));
    return;
  }
  next();
};