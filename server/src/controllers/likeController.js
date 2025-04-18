import * as likeService from '../services/likeService.js';
import * as publicationService from '../services/publicationService.js';
import { ApiError } from '../utils/errorHandler.js';

export const toggleLike = async (req, res, next) => {
  try {
    const { publicationUuid } = req.params;
    const { userUuid } = req.body;

    const publication = await publicationService.getPublicationByUuid(publicationUuid);
    if (!publication) {
      throw new ApiError('Publicación no encontrada', 404);
    }

    const existingLike = await likeService.checkExistingLike(publicationUuid, userUuid);
    
    if (existingLike) {
      await likeService.deleteLike(publicationUuid, userUuid);
      res.status(200).json({
        success: true,
        message: 'Like removido correctamente'
      });
    } else {
      const like = await likeService.createLike({ publicationUuid, userUuid });
      res.status(201).json({
        success: true,
        data: like
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getLikesByPublication = async (req, res, next) => {
  try {
    const { publicationUuid } = req.params;
    const { page, limit } = req.query;

    const likes = await likeService.getLikesByPublication({
      publicationUuid,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: likes.data,
      pagination: {
        total: likes.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(likes.total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};
