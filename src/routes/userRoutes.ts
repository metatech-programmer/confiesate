import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { UserService } from '../services/userService';
import { prisma } from '../config/database';
import { protectRoute, isAdmin } from '../middlewares/authMiddleware';
import { validatePagination, validateUuidParam } from '../middlewares/validationMiddleware';
import { body } from 'express-validator';

const router = Router();
const userService = new UserService(prisma);
const userController = new UserController(userService);

// Validación para actualización de perfil
const validateProfileUpdate = [
  body('email')
    .optional()
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('name')
    .optional()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('currentPassword')
    .if(body('password').exists())
    .notEmpty()
    .withMessage('Se requiere la contraseña actual para cambiar la contraseña')
];

// Rutas protegidas (requieren autenticación)
router.get('/profile', protectRoute, userController.getProfile);
router.put('/profile', protectRoute, validateProfileUpdate, userController.updateProfile);

// Rutas de administrador
router.get('/', protectRoute, isAdmin, validatePagination, userController.getAllUsers);
router.get('/:uuid', protectRoute, isAdmin, validateUuidParam, userController.getUserByUuid);
router.put('/:uuid/role', protectRoute, isAdmin, validateUuidParam, userController.updateUserRole);

export default router;