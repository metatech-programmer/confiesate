// src/routes/exportRoutes.js
const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');
const { protectRoute } = require('../middlewares/authMiddleware');

// Todas las rutas de exportación requieren autenticación
router.use(protectRoute);

// Exportar publicaciones (Excel o JSON)
router.get('/publications', publicationController.exportPublications);

module.exports = router;