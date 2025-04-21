interface AppConfig {
  port: number;
  env: string;
  apiVersion: string;
  baseUrl: string;
}

const appConfig: AppConfig = {
  port: Number(process.env.PORT) || 3000,
  env: process.env.NODE_ENV || 'development',
  apiVersion: 'v1',
  baseUrl: process.env.BASE_URL || 'http://localhost:3000'
};

export default appConfig;