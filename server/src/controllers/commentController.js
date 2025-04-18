import * as commentService from '../services/commentService.js';
import * as publicationService from '../services/publicationService.js';
import { ApiError } from '../utils/errorHandler.js';

export const createComment = async (req, res, next) => {
  try {
    const { publicationUuid } = req.params;
    const { content, userUuid } = req.body;

    const publication = await publicationService.getPublicationByUuid(publicationUuid);
    if (!publication) {
      throw new ApiError('Publicación no encontrada', 404);
    }

    const comment = await commentService.createComment({
      publicationUuid,
      userUuid,
      content
    });

    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

export const getCommentsByPublication = async (req, res, next) => {
  try {
    const { publicationUuid } = req.params;
    const { page, limit } = req.query;

    const comments = await commentService.getCommentsByPublication({
      publicationUuid,
      page: parseInt(page),
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: comments.data,
      pagination: {
        total: comments.total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(comments.total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const { uuid } = req.params;
    const { userUuid } = req.body;

    await commentService.deleteComment(uuid, userUuid);

    res.status(200).json({
      success: true,
      message: 'Comentario eliminado correctamente'
    });
  } catch (error) {
    next(error);
  }
};
