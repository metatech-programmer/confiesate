import { Router } from 'express';
import { CommentController } from '../controllers/commentController';
import { CommentService } from '../services/commentService';
import { prisma } from '../config/database';
import { protectRoute } from '../middlewares/authMiddleware';
import { validatePagination, validateUuidParam } from '../middlewares/validationMiddleware';

const router = Router();
const commentService = new CommentService(prisma);
const commentController = new CommentController(commentService);

// Rutas públicas
router.get('/publication/:publication_uuid', validateUuidParam, validatePagination, commentController.getCommentsByPublication);

// Rutas protegidas
router.post('/', protectRoute, commentController.createComment);
router.delete('/:uuid', protectRoute, validateUuidParam, commentController.deleteComment);

export default router;
