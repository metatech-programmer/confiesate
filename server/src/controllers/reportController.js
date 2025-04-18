import reportService from '../services/reportService'
import publicationService from '../services/publicationService'
import { ApiError } from '../utils/errorHandler'

/**
 * Obtiene todos los reportes con paginación
 */
exports.getAllReports = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const reports = await reportService.getAllReports({
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.status(200).json({
      success: true,
      data: reports.data,
      pagination: {
        total: reports.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(reports.total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todos los reportes de una publicación específica
 */
exports.getReportsByPublication = async (req, res, next) => {
  try {
    const { publicationUuid } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    // Verificamos que la publicación exista
    const publication = await publicationService.getPublicationByUuid(publicationUuid);
    if (!publication) {
      throw new ApiError('Publicación no encontrada', 404);
    }
    
    // Obtenemos los reportes de la publicación
    const reports = await reportService.getReportsByPublication({
      publicationUuid,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.status(200).json({
      success: true,
      data: reports.data,
      totalReports: reports.total,
      pagination: {
        total: reports.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(reports.total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Rechaza reportes y restaura la publicación a estado activo
 */
exports.dismissReports = async (req, res, next) => {
  try {
    const { publicationUuid } = req.params;
    
    // Verificamos que la publicación exista
    const publication = await publicationService.getPublicationByUuid(publicationUuid);
    if (!publication) {
      throw new ApiError('Publicación no encontrada', 404);
    }
    
    // Verificamos que la publicación esté en estado flagged
    if (publication.status !== 'flagged') {
      throw new ApiError('La publicación no está en estado flagged', 400);
    }
    
    // Actualizamos el estado de la publicación a active
    await publicationService.updatePublicationStatus(publicationUuid, 'active');
    
    // También podríamos eliminar los reportes asociados si es necesario
    // await reportService.deleteReportsByPublication(publicationUuid);
    
    res.status(200).json({
      success: true,
      message: 'Reportes rechazados y publicación restaurada correctamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Confirma reportes y elimina la publicación (cambia estado a deleted)
 */
exports.confirmReports = async (req, res, next) => {
  try {
    const { publicationUuid } = req.params;
    
    // Verificamos que la publicación exista
    const publication = await publicationService.getPublicationByUuid(publicationUuid);
    if (!publication) {
      throw new ApiError('Publicación no encontrada', 404);
    }
    
    // Verificamos que la publicación esté en estado flagged
    if (publication.status !== 'flagged') {
      throw new ApiError('La publicación no está en estado flagged', 400);
    }
    
    // Actualizamos el estado de la publicación a deleted
    await publicationService.deletePublication(publicationUuid);
    
    res.status(200).json({
      success: true,
      message: 'Reportes confirmados y publicación eliminada correctamente'
    });
  } catch (error) {
    next(error);
  }
};