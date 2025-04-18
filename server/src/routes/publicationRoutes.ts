import { Router } from 'express';
import { PublicationController } from '../controllers/publicationController';
import { PublicationService } from '../services/publicationService';
import { prisma } from '../config/database';
import { protectRoute, isAdmin } from '../middlewares/authMiddleware';
import { validatePublication, validatePagination, validateUuidParam } from '../middlewares/validationMiddleware';

const router = Router();
const publicationService = new PublicationService(prisma);
const publicationController = new PublicationController(publicationService);

// Rutas públicas
router.get('/', validatePagination, publicationController.getAllPublications);
router.get('/:uuid', validateUuidParam, publicationController.getPublicationByUuid);

// Rutas protegidas
router.post('/', protectRoute, validatePublication, publicationController.createPublication);
router.put('/:uuid/status', protectRoute, isAdmin, validateUuidParam, publicationController.updatePublicationStatus);
router.delete('/:uuid', protectRoute, isAdmin, validateUuidParam, publicationController.deletePublication);

export default router;