const jwt = require('jsonwebtoken');

/**
 * Middleware para proteger rutas que requieren autenticación
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Función para continuar al siguiente middleware
 */
const protectRoute = (req, res, next) => {
  try {
    // Obtener el token del header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'No autorizado, token no proporcionado'
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Agregar la información del usuario al request
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'No autorizado, token inválido'
    });
  }
};

module.exports = {
  protectRoute
};