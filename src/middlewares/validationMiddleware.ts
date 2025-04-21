import { Request, Response, NextFunction, RequestHandler } from 'express';
import { body, param, query, validationResult } from 'express-validator';

const validateResults: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};

export const validatePublication: RequestHandler[] = [
  body('content')
    .notEmpty()
    .withMessage('El contenido es requerido')
    .isLength({ min: 1, max: 1000 })
    .withMessage('El contenido debe tener entre 1 y 1000 caracteres'),
  validateResults
];

export const validateReport: RequestHandler[] = [
  body('publication_uuid')
    .notEmpty()
    .withMessage('El UUID de la publicación es requerido')
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    .withMessage('UUID de publicación inválido'),
  validateResults
];

export const validatePagination: RequestHandler[] = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entre 1 y 100'),
  validateResults
];

export const validateUuidParam: RequestHandler[] = [
  param('uuid')
    .notEmpty()
    .withMessage('El UUID es requerido')
    .matches(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    .withMessage('UUID inválido'),
  validateResults
];