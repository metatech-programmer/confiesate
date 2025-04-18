// src/routes/reportRoutes.js
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const { validatePagination } = require('../middlewares/validationMiddleware');
const { protectRoute } = require('../middlewares/authMiddleware');

// Todas las rutas de reportes requieren autenticación
router.use(protectRoute);

// Obtener todos los reportes (solo admin)
router.get('/', validatePagination, reportController.getAllReports);

// Obtener reportes por publicación
router.get('/publication/:publicationUuid', validatePagination, reportController.getReportsByPublication);

// Rechazar reportes (restaurar publicación)
router.put('/publication/:publicationUuid/dismiss', reportController.dismissReports);

// Confirmar reportes (eliminar publicación)
router.put('/publication/:publicationUuid/confirm', reportController.confirmReports);

module.exports = router;