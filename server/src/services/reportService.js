const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Crea un nuevo reporte para una publicación
 * @param {string} publicationUuid - UUID de la publicación reportada
 * @param {string} reporterUuid - UUID del usuario que reporta
 * @returns {Promise<Object>} - Reporte creado
 */
const createReport = async (publicationUuid, reporterUuid) => {
  try {
    // Primero verificamos si este usuario ya reportó esta publicación
    const existingReport = await prisma.report.findFirst({
      where: {
        publication_uuid: publicationUuid,
        reporter_uuid: reporterUuid
      }
    });

    if (existingReport) {
      throw new Error('Ya has reportado esta publicación anteriormente');
    }

    // Creamos el reporte
    const report = await prisma.report.create({
      data: {
        publication_uuid: publicationUuid,
        reporter_uuid: reporterUuid
      }
    });

    // Contamos cuántos reportes tiene la publicación
    const reportCount = await prisma.report.count({
      where: {
        publication_uuid: publicationUuid
      }
    });

    // Si supera el umbral de 20 reportes, marcamos la publicación como flagged
    if (reportCount >= 20) {
      await prisma.publication.update({
        where: { uuid: publicationUuid },
        data: { status: 'flagged' }
      });
    }

    return {
      uuid: report.uuid,
      publication_uuid: report.publication_uuid,
      created_at: report.created_at,
      report_count: reportCount
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
const getReportCountForPublication = async (publicationUuid) => {
  return prisma.report.count({
    where: {
      publication_uuid: publicationUuid
    }
  });
};

module.exports = {
  createReport,
  getReportCountForPublication
};