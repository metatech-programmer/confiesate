import { Request, Response, NextFunction } from 'express';
import { ReportService } from '../services/reportService';
import { ApiError } from '../utils/errorHandler';

interface AuthenticatedRequest extends Request {
  user?: {
    uuid: string;
    role?: string;
  };
}

export class ReportController {
  constructor(private reportService: ReportService) {}

  /**
   * Crear un nuevo reporte
   */
  createReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { publication_uuid } = req.body;
      const reporterUuid = req.user?.uuid;

      if (!reporterUuid) {
        throw new ApiError('Usuario no autenticado', 401);
      }

      const report = await this.reportService.create({
        publicationUuid: publication_uuid,
        reporterUuid
      });

      res.status(201).json({
        status: 'success',
        data: report
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Obtener todos los reportes (solo admin)
   */
  getAllReports = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== 'admin') {
        throw new ApiError('No autorizado', 403);
      }

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { reports, total } = await this.reportService.getAll(page, limit);

      res.status(200).json({
        status: 'success',
        data: reports,
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
   * Obtener reportes por publicación (solo admin)
   */
  getReportsByPublication = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== 'admin') {
        throw new ApiError('No autorizado', 403);
      }

      const { publication_uuid } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;

      const { reports, total } = await this.reportService.getByPublication(
        publication_uuid,
        page,
        limit
      );

      res.status(200).json({
        status: 'success',
        data: reports,
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
   * Verificar si un usuario ya reportó una publicación
   */
  checkUserReport = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { publication_uuid } = req.params;
      const userUuid = req.user?.uuid;

      if (!userUuid) {
        throw new ApiError('Usuario no autenticado', 401);
      }

      const hasReported = await this.reportService.checkUserReport(publication_uuid, userUuid);

      res.status(200).json({
        status: 'success',
        data: {
          hasReported
        }
      });
    } catch (error) {
      next(error);
    }
  };
}