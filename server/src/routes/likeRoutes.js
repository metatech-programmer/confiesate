import express from 'express';
import * as likeController from '../controllers/likeController.js';
import { validatePagination } from '../middlewares/validationMiddleware.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/publication/:publicationUuid', protectRoute, likeController.toggleLike);
router.get('/publication/:publicationUuid', validatePagination, likeController.getLikesByPublication);

export default router;
