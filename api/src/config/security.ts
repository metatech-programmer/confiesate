import { CorsOptions } from 'cors';

interface SecurityConfig {
  cors: CorsOptions;
  rateLimit: {
    windowMs: number;
    max: number;
  };
  helmet: {
    contentSecurityPolicy: boolean;
    xssFilter: boolean;
    noSniff: boolean;
    hidePoweredBy: boolean;
  };
}

const securityConfig: SecurityConfig = {
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100 // límite de solicitudes por ventana
  },
  helmet: {
    contentSecurityPolicy: true,
    xssFilter: true,
    noSniff: true,
    hidePoweredBy: true
  }
};

export default securityConfig;