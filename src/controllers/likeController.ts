import { Request, Response, NextFunction } from 'express';
import { LikeService } from '../services/likeService';
import { ApiError } from '../utils/errorHandler';

interface AuthenticatedRequest extends Request {
  user?: {
    uuid: string;
    role?: string;
  };
}

export class LikeController {
  constructor(private likeService: LikeService) {}

  /**
   * Dar like a una publicación
   */
  toggleLike = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { publication_uuid } = req.body;
      const userUuid = req.user?.uuid;

      if (!userUuid) {
        throw new ApiError('Usuario no autenticado', 401);
      }

      const result = await this.likeService.toggle(publication_uuid, userUuid);

      res.status(200).json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener likes de una publicación
   */
  getLikesByPublication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { publication_uuid } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { likes, total } = await this.likeService.getByPublication(
        publication_uuid,
        page,
        limit
      );

      res.status(200).json({
        status: 'success',
        data: likes,
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
   * Verificar si un usuario dio like a una publicación
   */
  checkUserLike = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { publication_uuid } = req.params;
      const userUuid = req.user?.uuid;

      if (!userUuid) {
        throw new ApiError('Usuario no autenticado', 401);
      }

      const hasLiked = await this.likeService.checkUserLike(publication_uuid, userUuid);

      res.status(200).json({
        status: 'success',
        data: {
          hasLiked
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
