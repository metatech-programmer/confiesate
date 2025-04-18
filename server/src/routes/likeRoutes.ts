import { Router } from 'express';
import { LikeController } from '../controllers/likeController';
import { LikeService } from '../services/likeService';
import { prisma } from '../config/database';
import { protectRoute } from '../middlewares/authMiddleware';
import { validatePagination, validateUuidParam } from '../middlewares/validationMiddleware';

const router = Router();
const likeService = new LikeService(prisma);
const likeController = new LikeController(likeService);

// Rutas públicas
router.get('/publication/:publication_uuid', validateUuidParam, validatePagination, likeController.getLikesByPublication);

// Rutas protegidas
router.post('/toggle', protectRoute, likeController.toggleLike);
router.get('/check/:publication_uuid', protectRoute, validateUuidParam, likeController.checkUserLike);

export default router;
