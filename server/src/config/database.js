export default {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'anonymous_forum',
    // Otras configuraciones relacionadas con la base de datos
  };