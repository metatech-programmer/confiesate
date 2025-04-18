import { Router } from 'express';
import { ReportController } from '../controllers/reportController';
import { ReportService } from '../services/reportService';
import { prisma } from '../config/database';
import { protectRoute, isAdmin } from '../middlewares/authMiddleware';
import { validateReport, validatePagination, validateUuidParam } from '../middlewares/validationMiddleware';

const router = Router();
const reportService = new ReportService(prisma);
const reportController = new ReportController(reportService);

// Rutas protegidas (requieren autenticación)
router.post('/', protectRoute, validateReport, reportController.createReport);
router.get('/check/:publication_uuid', protectRoute, validateUuidParam, reportController.checkUserReport);

// Rutas de administrador
router.get('/', protectRoute, isAdmin, validatePagination, reportController.getAllReports);
router.get('/publication/:publication_uuid', protectRoute, isAdmin, validateUuidParam, validatePagination, reportController.getReportsByPublication);

export default router;