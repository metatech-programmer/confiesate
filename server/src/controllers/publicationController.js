import * as publicationService from '../services/publicationService.js';
import * as userService from '../services/userService.js';
import * as reportService from '../services/reportService.js';
import { createExcelFile } from '../utils/excelExporter.js';
import { ApiError } from '../utils/errorHandler.js';

/**
 * Crea una nueva publicación
 * Si el usuario no existe, se crea automáticamente
 */
export const createPublication = async (req, res, next) => {
  try {
    const { content, userUuid } = req.body;
    
    let user;
    
    // Si no hay userUuid, creamos un usuario anónimo
    if (!userUuid) {
      user = await userService.createAnonymousUser();
    } else {
      // Verificamos si el usuario existe
      user = await userService.getUserByUuid(userUuid);
      if (!user) {
        throw new ApiError('Usuario no encontrado', 404);
      }
      
      // Verificamos que el usuario esté activo
      if (user.status !== 'active') {
        throw new ApiError('El usuario no está activo', 403);
      }
    }
    
    // Creamos la publicación
    const publication = await publicationService.createPublication({
      content,
      userUuid: user.uuid
    });
    
    res.status(201).json({
      success: true,
      data: {
        publication,
        user: {
          uuid: user.uuid,
          name: user.name
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una publicación por su UUID
 */
export const getPublicationByUuid = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const publication = await publicationService.getPublicationByUuid(uuid);
    
    if (!publication) {
      throw new ApiError('Publicación no encontrada', 404);
    }
    
    res.status(200).json({
      success: true,
      data: publication
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todas las publicaciones con paginación
 */
export const getAllPublications = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    
    const publications = await publicationService.getAllPublications({
      page: parseInt(page),
      limit: parseInt(limit),
      status
    });
    
    res.status(200).json({
      success: true,
      data: publications.data,
      pagination: {
        total: publications.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(publications.total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza una publicación
 */
export const updatePublication = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const { content, userUuid } = req.body;
    
    // Verificamos que la publicación exista
    const publication = await publicationService.getPublicationByUuid(uuid);
    if (!publication) {
      throw new ApiError('Publicación no encontrada', 404);
    }
    
    // Verificamos que el usuario sea el dueño de la publicación
    if (publication.user.uuid !== userUuid) {
      throw new ApiError('No tienes permiso para actualizar esta publicación', 403);
    }
    
    // Actualizamos la publicación
    const updatedPublication = await publicationService.updatePublication(uuid, {
      content
    });
    
    res.status(200).json({
      success: true,
      data: updatedPublication
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina una publicación lógicamente (cambia status a deleted)
 */
export const deletePublication = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const { userUuid } = req.body;
    
    // Verificamos que la publicación exista
    const publication = await publicationService.getPublicationByUuid(uuid);
    if (!publication) {
      throw new ApiError('Publicación no encontrada', 404);
    }
    
    // Verificamos que el usuario sea el dueño de la publicación
    if (publication.user.uuid !== userUuid) {
      throw new ApiError('No tienes permiso para eliminar esta publicación', 403);
    }
    
    // Eliminamos la publicación (soft delete)
    await publicationService.deletePublication(uuid);
    
    res.status(200).json({
      success: true,
      message: 'Publicación eliminada correctamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Reporta una publicación
 * Si alcanza 20 reportes, se marca automáticamente como flagged
 */
export const reportPublication = async (req, res, next) => {
  try {
    const { publicationUuid } = req.params;
    const { reporterUuid } = req.body;
    
    // Verificamos que la publicación exista
    const publication = await publicationService.getPublicationByUuid(publicationUuid);
    if (!publication) {
      throw new ApiError('Publicación no encontrada', 404);
    }
    
    // Verificamos que el usuario reportador exista
    const reporter = await userService.getUserByUuid(reporterUuid);
    if (!reporter) {
      throw new ApiError('Usuario reportador no encontrado', 404);
    }
    
    // Verificamos que el usuario no haya reportado ya esta publicación
    const existingReport = await reportService.checkExistingReport(publicationUuid, reporterUuid);
    if (existingReport) {
      throw new ApiError('Ya has reportado esta publicación anteriormente', 400);
    }
    
    // Creamos el reporte
    await reportService.createReport({
      publicationUuid,
      reporterUuid
    });
    
    // Obtenemos el número total de reportes de la publicación
    const totalReports = await reportService.getReportCountByPublication(publicationUuid);
    
    // Si supera el umbral de 20 reportes, marcamos la publicación como flagged
    if (totalReports >= 20) {
      await publicationService.updatePublicationStatus(publicationUuid, 'flagged');
    }
    
    res.status(200).json({
      success: true,
      message: 'Publicación reportada correctamente',
      data: {
        totalReports,
        isFlagged: totalReports >= 20
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Exporta todas las publicaciones en formato Excel o JSON
 * Requiere autenticación (implementada en middleware)
 */
export const exportPublications = async (req, res, next) => {
  try {
    const { format = 'excel' } = req.query;
    
    // Obtenemos todas las publicaciones sin paginar
    const publications = await publicationService.getAllPublicationsForExport();
    
    if (format === 'excel') {
      // Generamos el archivo Excel
      const excelBuffer = await createExcelFile(publications);
      
      // Configuramos los headers para la descarga
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=publications.xlsx');
      
      // Enviamos el buffer
      return res.send(excelBuffer);
    } else {
      // Formato JSON
      return res.status(200).json({
        success: true,
        data: publications
      });
    }
  } catch (error) {
    next(error);
  }
};