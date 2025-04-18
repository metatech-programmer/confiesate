import express from 'express';
import * as commentController from '../controllers/commentController.js';
import { validatePagination } from '../middlewares/validationMiddleware.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/publication/:publicationUuid', protectRoute, commentController.createComment);
router.get('/publication/:publicationUuid', validatePagination, commentController.getCommentsByPublication);
router.delete('/:uuid', protectRoute, commentController.deleteComment);

export default router;
