import express from 'express';
import * as authController from '../controllers/authController.js';

const router = express.Router();

// Ruta para generar token de acceso para administradores
router.post('/admin', authController.generateAdminToken);

export default router;