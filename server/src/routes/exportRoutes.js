import express from 'express'
import publicationController from '../controllers/publicationController'
import { protectRoute } from '../middlewares/authMiddleware'
const router = express.Router();

// Todas las rutas de exportación requieren autenticación
router.use(protectRoute);

// Exportar publicaciones (Excel o JSON)
router.get('/publications', publicationController.exportPublications);

module.exports = router;