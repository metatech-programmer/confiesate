import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/errorHandler';

interface Report {
  uuid: string;
  publication_uuid: string;
  reporter_uuid: string;
  created_at: Date;
  reporter?: {
    uuid: string;
    name: string;
  };
}

interface CreateReportDTO {
  publicationUuid: string;
  reporterUuid: string;
}

export class ReportService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Crear un nuevo reporte
   */
  async create(data: CreateReportDTO): Promise<Report> {
    try {
      // Verificar si ya existe un reporte del mismo usuario
      const existingReport = await this.prisma.report.findFirst({
        where: {
          publication_uuid: data.publicationUuid,
          reporter_uuid: data.reporterUuid
        }
      });

      if (existingReport) {
        throw new ApiError('Ya has reportado esta publicación', 400);
      }

      return await this.prisma.report.create({
        data: {
          publication_uuid: data.publicationUuid,
          reporter_uuid: data.reporterUuid
        },
        include: {
          reporter: {
            select: {
              uuid: true,
              name: true
            }
          }
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2003') {
          throw new ApiError('Publicación o usuario no encontrado', 404);
        }
        throw error;
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }

  /**
   * Obtener todos los reportes
   */
  async getAll(
    page: number = 1,
    limit: number = 10
  ): Promise<{ reports: Report[]; total: number }> {
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        include: {
          reporter: {
            select: {
              uuid: true,
              name: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.report.count()
    ]);

    return { reports, total };
  }

  /**
   * Obtener reportes por publicación
   */
  async getByPublication(
    publicationUuid: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ reports: Report[]; total: number }> {
    const skip = (page - 1) * limit;

    const [reports, total] = await Promise.all([
      this.prisma.report.findMany({
        where: {
          publication_uuid: publicationUuid
        },
        include: {
          reporter: {
            select: {
              uuid: true,
              name: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.report.count({
        where: {
          publication_uuid: publicationUuid
        }
      })
    ]);

    return { reports, total };
  }

  /**
   * Verificar si un usuario ya reportó una publicación
   */
  async checkUserReport(publicationUuid: string, userUuid: string): Promise<boolean> {
    const report = await this.prisma.report.findFirst({
      where: {
        publication_uuid: publicationUuid,
        reporter_uuid: userUuid
      }
    });

    return !!report;
  }
}