const { body, param, query, validationResult } = require('express-validator');

/**
 * Middleware para validar una nueva publicación
 */
const validatePublication = [
  body('content')
    .notEmpty()
    .withMessage('El contenido de la publicación es obligatorio')
    .isLength({ min: 3, max: 5000 })
    .withMessage('El contenido debe tener entre 3 y 5000 caracteres'),
  body('user_uuid')
    .optional()
    .isUUID()
    .withMessage('El UUID del usuario debe ser un UUID válido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware para validar un nuevo reporte
 */
const validateReport = [
  body('publication_uuid')
    .notEmpty()
    .withMessage('El UUID de la publicación es obligatorio')
    .isUUID()
    .withMessage('El UUID de la publicación debe ser un UUID válido'),
  body('reporter_uuid')
    .notEmpty()
    .withMessage('El UUID del reportante es obligatorio')
    .isUUID()
    .withMessage('El UUID del reportante debe ser un UUID válido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware para validar parámetros de paginación
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero mayor a 0')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100')
    .toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    next();
  }
];

/**
 * Middleware para validar UUID en parámetros
 */
const validateUuidParam = [
  param('uuid')
    .notEmpty()
    .withMessage('El UUID es obligatorio')
    .isUUID()
    .withMessage('El UUID debe ser un UUID válido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validatePublication,
  validateReport,
  validatePagination,
  validateUuidParam
};