import { Request, Response, NextFunction } from 'express';
import { CommentService } from '../services/commentService';
import { ApiError } from '../utils/errorHandler';
import { encrypt } from '../utils/encryption';

interface AuthenticatedRequest extends Request {
  user?: {
    uuid: string;
    role?: string;
  };
}

export class CommentController {
  constructor(private commentService: CommentService) {}

  /**
   * Crear un nuevo comentario
   */
  createComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { content, publication_uuid } = req.body;
      const userUuid = req.user?.uuid;

      if (!userUuid) {
        throw new ApiError('Usuario no autenticado', 401);
      }

      // Encriptar el contenido del comentario
      const encryptedContent = encrypt(content);
      if (!encryptedContent) {
        throw new ApiError('Error al encriptar el contenido', 500);
      }

      const comment = await this.commentService.create({
        content: encryptedContent,
        publicationUuid: publication_uuid,
        userUuid
      });

      res.status(201).json({
        status: 'success',
        data: comment
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener comentarios de una publicación
   */
  getCommentsByPublication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { publication_uuid } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { comments, total } = await this.commentService.getByPublication(
        publication_uuid,
        page,
        limit
      );

      res.status(200).json({
        status: 'success',
        data: comments,
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
   * Eliminar un comentario
   */
  deleteComment = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.params;
      const userUuid = req.user?.uuid;
      const userRole = req.user?.role;

      if (!userUuid) {
        throw new ApiError('Usuario no autenticado', 401);
      }

      const comment = await this.commentService.getByUuid(uuid);
      if (!comment) {
        throw new ApiError('Comentario no encontrado', 404);
      }

      // Solo el autor del comentario o un admin pueden eliminarlo
      if (comment.user_uuid !== userUuid && userRole !== 'admin') {
        throw new ApiError('No autorizado para eliminar este comentario', 403);
      }

      await this.commentService.delete(uuid);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
