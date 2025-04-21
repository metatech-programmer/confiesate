import { PrismaClient } from '@prisma/client';
import { createExcelFile } from '../utils/excelExporter';
import { ApiError } from '../utils/errorHandler';

export class ExportService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Exportar publicaciones a Excel
   */
  async exportToExcel(): Promise<Buffer> {
    try {
      const publications = await this.prisma.publication.findMany({
        include: {
          user: {
            select: {
              uuid: true,
              name: true
            }
          },
          Comment: {
            include: {
              user: {
                select: {
                  uuid: true,
                  name: true
                }
              }
            }
          },
          Like: {
            include: {
              user: {
                select: {
                  uuid: true,
                  name: true
                }
              }
            }
          },
          reports: {
            include: {
              reporter: {
                select: {
                  uuid: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      if (publications.length === 0) {
        throw new ApiError('No hay publicaciones para exportar', 404);
      }

      return await createExcelFile(publications);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Error al exportar las publicaciones', 500);
    }
  }
}