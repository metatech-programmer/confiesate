import { Request, Response, NextFunction } from 'express';
import { PublicationService } from '../services/publicationService';
import { ApiError } from '../utils/errorHandler';
import { encrypt } from '../utils/encryption';

interface AuthenticatedRequest extends Request {
  user?: {
    uuid: string;
    role?: string;
  };
}

export class PublicationController {
  constructor(private publicationService: PublicationService) {}

  /**
   * Crear una nueva publicación
   */
  createPublication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { content } = req.body;
      const userUuid = req.user?.uuid;

      // Encriptar el contenido
      const encryptedContent = encrypt(content);
      if (!encryptedContent) {
        throw new ApiError('Error al encriptar el contenido', 500);
      }

      const publication = await this.publicationService.create({
        content: encryptedContent,
        userUuid
      });

      res.status(201).json({
        status: 'success',
        data: publication
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener todas las publicaciones
   */
  getAllPublications = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const status = req.query.status as string;

      const { publications, total } = await this.publicationService.getAll(page, limit, status);

      res.status(200).json({
        status: 'success',
        data: publications,
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
   * Obtener una publicación por UUID
   */
  getPublicationByUuid = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.params;
      const publication = await this.publicationService.getByUuid(uuid);

      if (!publication) {
        throw new ApiError('Publicación no encontrada', 404);
      }

      res.status(200).json({
        status: 'success',
        data: publication
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Actualizar el estado de una publicación
   */
  updatePublicationStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.params;
      const { status } = req.body;

      // Verificar que el usuario sea administrador
      if (req.user?.role !== 'admin') {
        throw new ApiError('No autorizado', 403);
      }

      const publication = await this.publicationService.updateStatus(uuid, status);

      res.status(200).json({
        status: 'success',
        data: publication
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Eliminar una publicación
   */
  deletePublication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { uuid } = req.params;

      // Verificar que el usuario sea administrador
      if (req.user?.role !== 'admin') {
        throw new ApiError('No autorizado', 403);
      }

      await this.publicationService.delete(uuid);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}