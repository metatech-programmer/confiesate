import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { ApiError } from '../utils/errorHandler';

interface AuthenticatedRequest extends Request {
  user?: {
    uuid: string;
    role?: string;
  };
}

interface UpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
  currentPassword?: string;
}

export class UserController {
  constructor(private userService: UserService) {}

  /**
   * Obtener perfil del usuario actual
   */
  getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userUuid = req.user?.uuid;
      
      if (!userUuid) {
        throw new ApiError('Usuario no autenticado', 401);
      }

      const user = await this.userService.findByUuid(userUuid);
      
      if (!user) {
        throw new ApiError('Usuario no encontrado', 404);
      }

      res.status(200).json({
        status: 'success',
        data: {
          uuid: user.uuid,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Actualizar perfil del usuario actual
   */
  updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const userUuid = req.user?.uuid;
      const updateData: UpdateUserBody = req.body;
      
      if (!userUuid) {
        throw new ApiError('Usuario no autenticado', 401);
      }

      // Si se intenta cambiar la contraseña, verificar la contraseña actual
      if (updateData.password) {
        if (!updateData.currentPassword) {
          throw new ApiError('Se requiere la contraseña actual', 400);
        }

        const isValid = await this.userService.validatePassword(
          userUuid,
          updateData.currentPassword
        );

        if (!isValid) {
          throw new ApiError('Contraseña actual incorrecta', 400);
        }
      }

      const updatedUser = await this.userService.update(userUuid, {
        name: updateData.name,
        email: updateData.email,
        password: updateData.password
      });

      res.status(200).json({
        status: 'success',
        data: {
          uuid: updatedUser.uuid,
          email: updatedUser.email,
          name: updatedUser.name,
          role: updatedUser.role,
          created_at: updatedUser.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener todos los usuarios (solo admin)
   */
  getAllUsers = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== 'admin') {
        throw new ApiError('No autorizado', 403);
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { users, total } = await this.userService.getAll(page, limit);

      res.status(200).json({
        status: 'success',
        data: users,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener un usuario por UUID (solo admin)
   */
  getUserByUuid = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== 'admin') {
        throw new ApiError('No autorizado', 403);
      }

      const { uuid } = req.params;
      const user = await this.userService.findByUuid(uuid);

      if (!user) {
        throw new ApiError('Usuario no encontrado', 404);
      }

      res.status(200).json({
        status: 'success',
        data: {
          uuid: user.uuid,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Cambiar rol de usuario (solo admin)
   */
  updateUserRole = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== 'admin') {
        throw new ApiError('No autorizado', 403);
      }

      const { uuid } = req.params;
      const { role } = req.body;

      const user = await this.userService.updateRole(uuid, role);

      res.status(200).json({
        status: 'success',
        data: {
          uuid: user.uuid,
          email: user.email,
          name: user.name,
          role: user.role,
          created_at: user.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  };
}