export default {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    corsOptions: {
      // Opciones de CORS
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100 // límite de solicitudes por ventana
    }
  };