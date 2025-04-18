import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Verifica si existe un reporte de un usuario para una publicación
 * @param {string} publicationUuid - UUID de la publicación
 * @param {string} reporterUuid - UUID del usuario que reporta
 * @returns {Promise<Object|null>} - Reporte existente o null
 */
export const checkExistingReport = async (publicationUuid, reporterUuid) => {
  return prisma.report.findFirst({
    where: {
      publication_uuid: publicationUuid,
      reporter_uuid: reporterUuid
    }
  });
};

/**
 * Crea un nuevo reporte para una publicación
 * @param {Object} data - Datos del reporte
 * @param {string} data.publicationUuid - UUID de la publicación reportada
 * @param {string} data.reporterUuid - UUID del usuario que reporta
 * @returns {Promise<Object>} - Reporte creado
 */
export const createReport = async ({ publicationUuid, reporterUuid }) => {
  try {
    const report = await prisma.report.create({
      data: {
        publication_uuid: publicationUuid,
        reporter_uuid: reporterUuid
      }
    });

    return {
      uuid: report.uuid,
      publication_uuid: report.publication_uuid,
      reporter_uuid: report.reporter_uuid,
      created_at: report.created_at
    };
  } catch (error) {
    // Si es un error de unique constraint, significa que el usuario ya reportó esta publicación
    if (error.code === 'P2002') {
      throw new Error('Ya has reportado esta publicación anteriormente');
    }
    throw error;
  }
};

/**
 * Obtiene el conteo de reportes para una publicación
 * @param {string} publicationUuid - UUID de la publicación
 * @returns {Promise<number>} - Número de reportes
 */
export const getReportCountByPublication = async (publicationUuid) => {
  return prisma.report.count({
    where: {
      publication_uuid: publicationUuid
    }
  });
};

/**
 * Obtiene todos los reportes con paginación
 * @param {Object} options - Opciones de paginación
 * @param {number} options.page - Número de página
 * @param {number} options.limit - Límite de elementos por página
 * @returns {Promise<Object>} - Reportes paginados
 */
export const getAllReports = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        publication: {
          select: {
            uuid: true,
            status: true
          }
        },
        reporter: {
          select: {
            uuid: true,
            name: true
          }
        }
      }
    }),
    prisma.report.count()
  ]);

  return {
    data: reports,
    total
  };
};

/**
 * Obtiene todos los reportes de una publicación específica
 * @param {Object} options - Opciones de filtrado y paginación
 * @param {string} options.publicationUuid - UUID de la publicación
 * @param {number} options.page - Número de página
 * @param {number} options.limit - Límite de elementos por página
 * @returns {Promise<Object>} - Reportes de la publicación paginados
 */
export const getReportsByPublication = async ({ publicationUuid, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [reports, total] = await Promise.all([
    prisma.report.findMany({
      where: {
        publication_uuid: publicationUuid
      },
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        reporter: {
          select: {
            uuid: true,
            name: true
          }
        }
      }
    }),
    prisma.report.count({
      where: {
        publication_uuid: publicationUuid
      }
    })
  ]);

  return {
    data: reports,
    total
  };
};

/**
 * Elimina todos los reportes de una publicación
 * @param {string} publicationUuid - UUID de la publicación
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const deleteReportsByPublication = async (publicationUuid) => {
  return prisma.report.deleteMany({
    where: {
      publication_uuid: publicationUuid
    }
  });
};