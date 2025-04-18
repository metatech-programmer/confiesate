// src/routes/userRoutes.js
import express from 'express';
import * as userController from '../controllers/userController.js';
import { validateUuidParam, validatePagination } from '../middlewares/validationMiddleware.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas públicas
router.get('/:uuid', validateUuidParam, userController.getUserByUuid);

// Rutas protegidas (requieren autenticación)
router.use(protectRoute);
router.get('/', validatePagination, userController.getAllUsers);
router.put('/:uuid/status', validateUuidParam, userController.updateUserStatus);
router.delete('/:uuid', validateUuidParam, userController.deleteUser);
router.get('/:uuid/publications', validateUuidParam, validatePagination, userController.getUserPublications);

export default router;