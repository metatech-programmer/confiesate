// src/controllers/userController.js
const userService = require('../services/userService');
const publicationService = require('../services/publicationService');
const { ApiError } = require('../utils/errorHandler');

/**
 * Obtiene un usuario por su UUID
 */
exports.getUserByUuid = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const user = await userService.getUserByUuid(uuid);
    
    if (!user) {
      throw new ApiError('Usuario no encontrado', 404);
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todos los usuarios con paginación
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status = 'active' } = req.query;
    
    const users = await userService.getAllUsers({
      page: parseInt(page),
      limit: parseInt(limit),
      status
    });
    
    res.status(200).json({
      success: true,
      data: users.data,
      pagination: {
        total: users.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(users.total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualiza el estado de un usuario (banear o activar)
 */
exports.updateUserStatus = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const { status } = req.body;
    
    // Verificamos que el estado sea válido
    if (!['active', 'banned', 'deleted'].includes(status)) {
      throw new ApiError('Estado inválido', 400);
    }
    
    // Verificamos que el usuario exista
    const user = await userService.getUserByUuid(uuid);
    if (!user) {
      throw new ApiError('Usuario no encontrado', 404);
    }
    
    // Actualizamos el estado del usuario
    const updatedUser = await userService.updateUserStatus(uuid, status);
    
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina un usuario lógicamente (cambia status a deleted)
 */
exports.deleteUser = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    
    // Verificamos que el usuario exista
    const user = await userService.getUserByUuid(uuid);
    if (!user) {
      throw new ApiError('Usuario no encontrado', 404);
    }
    
    // Eliminamos el usuario (soft delete)
    await userService.deleteUser(uuid);
    
    res.status(200).json({
      success: true,
      message: 'Usuario eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene todas las publicaciones de un usuario
 */
exports.getUserPublications = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const { page = 1, limit = 10, status = 'active' } = req.query;
    
    // Verificamos que el usuario exista
    const user = await userService.getUserByUuid(uuid);
    if (!user) {
      throw new ApiError('Usuario no encontrado', 404);
    }
    
    // Obtenemos las publicaciones del usuario
    const publications = await publicationService.getPublicationsByUser({
      userUuid: uuid,
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