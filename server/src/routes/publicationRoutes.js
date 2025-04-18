// src/routes/publicationRoutes.js
const express = require('express');
const router = express.Router();
const publicationController = require('../controllers/publicationController');
const { validatePublication, validateUuidParam, validatePagination } = require('../middlewares/validationMiddleware');
const { protectRoute } = require('../middlewares/authMiddleware');

// Rutas públicas
router.get('/', validatePagination, publicationController.getAllPublications);
router.get('/:uuid', validateUuidParam, publicationController.getPublicationByUuid);
router.post('/', validatePublication, publicationController.createPublication);

// Rutas que requieren autenticación de usuario
router.put('/:uuid', validateUuidParam, publicationController.updatePublication);
router.delete('/:uuid', validateUuidParam, publicationController.deletePublication);

// Ruta para reportar publicación
router.post('/:publicationUuid/report', publicationController.reportPublication);

module.exports = router;