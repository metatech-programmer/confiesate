# Backend para Sistema de Confesiones USTA

API RESTful para el sistema de confesiones anónimas de la, desarrollado con Node.js, Express y PostgreSQL.

## Características

- Sistema de confesiones anónimas
- Autenticación de usuarios con JWT
- Moderación de contenido por administradores
- Sistema de likes y comentarios
- Reportes de contenido inapropiado
- Exportación de datos a Excel
- Encriptación de contenido sensible

## Requisitos previos

- Node.js 16 o superior
- PostgreSQL 12 o superior
- npm

## Instalación y Configuración

1. Clonar el repositorio:

```bash
git clone https://github.com/tu-usuario/confesiones-usta.git
cd confesiones-usta/server
```

2. Instalar dependencias:

```bash
npm install
```

3. Configurar base de datos:

- Crear una base de datos PostgreSQL llamada `anonymous_posts`
- Copiar el archivo de variables de entorno:
  ```bash
  cp .env.example .env
  ```
- Editar `.env` con tus credenciales:
  ```
  DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/anonymous_posts?schema=public"
  JWT_SECRET="tu_clave_secreta_jwt"
  ENCRYPTION_KEY="clave_de_32_caracteres_para_encriptar"
  ENCRYPTION_IV="vector_de_16_chars"
  ```

4. Inicializar la base de datos:

```bash
# Generar el cliente Prisma
npm run prisma:generate

# Crear la migración inicial
npm run prisma:migrate:create

# Aplicar la migración
npm run prisma:migrate:dev

# Si hay problemas, puedes reiniciar la base de datos
npm run prisma:reset

# Crear usuario administrador inicial
npm run prisma:seed


```

5. Estructura de directorios para migraciones:

```
src/
  database/
    migrations/      # Directorio para archivos de migración
    schema.prisma   # Schema de la base de datos
    seed.ts         # Script de datos iniciales
```

## Ejecución

### Modo desarrollo
```bash
npm run dev
```
El servidor estará disponible en `http://localhost:3000`

### Modo producción
```bash
npm run build
npm start
```

## Endpoints principales

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Inicio de sesión
- `GET /api/v1/auth/verify` - Verificar token JWT

### Confesiones
- `GET /api/v1/publications` - Listar confesiones
- `POST /api/v1/publications` - Crear confesión
- `GET /api/v1/publications/:uuid` - Ver confesión específica
- `DELETE /api/v1/publications/:uuid` - Eliminar confesión (admin)

### Interacciones
- `POST /api/v1/likes/toggle` - Dar/quitar like
- `POST /api/v1/comments` - Comentar confesión
- `POST /api/v1/reports` - Reportar confesión

### Administración
- `GET /api/v1/users` - Listar usuarios (admin)
- `GET /api/v1/reports` - Ver reportes (admin)
- `GET /api/v1/export/excel` - Exportar datos (admin)

## Credenciales por defecto

```
Email: admin@example.com
Contraseña: admin123
```

## Seguridad

- Contenido encriptado usando AES-256-CBC
- Autenticación mediante JWT
- Contraseñas hasheadas con bcrypt
- Rate limiting y protección CORS
- Validación de datos en endpoints

## Variables de Entorno Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| DATABASE_URL | URL de PostgreSQL | postgresql://user:pass@localhost:5432/anonymous_posts |
| JWT_SECRET | Clave JWT (min 32 chars) | your_jwt_secret_key_here_min_32_chars |
| ENCRYPTION_KEY | Clave AES (32 chars) | 12345678901234561234567890123456 |
| ENCRYPTION_IV | Vector AES (16 chars) | 1234567890123456 |
| PORT | Puerto del servidor | 3000 |
| NODE_ENV | Entorno de ejecución | development |

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| npm run dev | Inicia servidor en modo desarrollo |
| npm run build | Compila TypeScript a JavaScript |
| npm start | Inicia servidor en producción |
| npm run prisma:generate | Genera cliente Prisma |
| npm run prisma:migrate:create | Crea nueva migración |
| npm run prisma:migrate:dev | Aplica migraciones en desarrollo |
| npm run prisma:migrate:deploy | Aplica migraciones en producción |
| npm run prisma:reset | Reinicia la base de datos |
| npm run prisma:seed | Crea datos iniciales |
| npm run prisma:studio | Abre interfaz de Prisma |