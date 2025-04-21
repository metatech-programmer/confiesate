import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/userService';
import { ApiError } from '../utils/errorHandler';

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

interface RegisterRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
  };
}

export class AuthController {
  constructor(private userService: UserService) {}

  /**
   * Login de usuario
   */
  login = async (req: LoginRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      const user = await this.userService.validateCredentials(email, password);
      if (!user) {
        throw new ApiError('Credenciales inválidas', 401);
      }

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está configurado');
      }

      const token = jwt.sign(
        { 
          uuid: user.uuid,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(200).json({
        status: 'success',
        data: {
          token,
          user: {
            uuid: user.uuid,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Registro de usuario
   */
  register = async (req: RegisterRequest, res: Response, next: NextFunction) => {
    try {
      const { email, password, name } = req.body;

      const existingUser = await this.userService.findByEmail(email);
      if (existingUser) {
        throw new ApiError('El email ya está registrado', 400);
      }

      const user = await this.userService.create({
        email,
        password,
        name
      });

      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está configurado');
      }

      const token = jwt.sign(
        { 
          uuid: user.uuid,
          role: user.role 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        status: 'success',
        data: {
          token,
          user: {
            uuid: user.uuid,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Verificar token JWT
   */
  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError('Token no proporcionado', 401);
      }

      const token = authHeader.split(' ')[1];
      
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET no está configurado');
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET) as { uuid: string };
      const user = await this.userService.findByUuid(decoded.uuid);

      if (!user) {
        throw new ApiError('Usuario no encontrado', 404);
      }

      res.status(200).json({
        status: 'success',
        data: {
          user: {
            uuid: user.uuid,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }
      });
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        next(new ApiError('Token inválido', 401));
      } else {
        next(error);
      }
    }
  };
}