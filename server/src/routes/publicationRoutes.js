import express from 'express'
import publicationController from '../controllers/publicationController'
import { validatePublication, validateUuidParam, validatePagination } from '../middlewares/validationMiddleware'
const router = express.Router();

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