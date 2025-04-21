import { Router } from 'express';
import { ExportService } from '../services/exportService';
import { prisma } from '../config/database';
import { protectRoute, isAdmin } from '../middlewares/authMiddleware';

const router = Router();
const exportService = new ExportService(prisma);

// Ruta para exportar a Excel (solo admin)
router.get('/excel', protectRoute, isAdmin, async (_req, res, next) => {
  try {
    const buffer = await exportService.exportToExcel();
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=publicaciones.xlsx');
    res.send(buffer);
  } catch (error) {
    next(error);
  }
});

export default router;