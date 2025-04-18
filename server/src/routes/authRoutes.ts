import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { UserService } from '../services/userService';
import { prisma } from '../config/database';
import { body } from 'express-validator';

const router = Router();
const userService = new UserService(prisma);
const authController = new AuthController(userService);

// Validación para registro
const validateRegister = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('name')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres')
];

// Validación para login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Debe proporcionar un email válido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
];

router.post('/register', validateRegister, authController.register);
router.post('/login', validateLogin, authController.login);
router.get('/verify', authController.verifyToken);

export default router;