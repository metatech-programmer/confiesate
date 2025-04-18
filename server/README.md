# Backend para Sistema de Confesiones USTA

API RESTful para el sistema de confesiones anónimas de la Universidad Santo Tomás, desarrollado con Node.js, Express y PostgreSQL.

## Tabla de Contenidos

- [Backend para Sistema de Confesiones USTA](#backend-para-sistema-de-confesiones-usta)
  - [Tabla de Contenidos](#tabla-de-contenidos)
  - [Características](#características)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Configuración](#configuración)
  - [Uso](#uso)
  - [API Endpoints](#api-endpoints)
    - [Autenticación](#autenticación)
    - [Publicaciones](#publicaciones)
    - [Interacciones](#interacciones)
    - [Administración](#administración)
  - [Seguridad](#seguridad)
  - [Solución de Problemas](#solución-de-problemas)
    - [Problemas Comunes](#problemas-comunes)
    - [Logs y Depuración](#logs-y-depuración)
  - [Desarrollo](#desarrollo)
    - [Scripts Disponibles](#scripts-disponibles)
    - [Base de Datos](#base-de-datos)
      - [Triggers de PostgreSQL](#triggers-de-postgresql)
      - [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
      - [Migraciones](#migraciones)
  - [Contribución](#contribución)

## Características

- Sistema de confesiones anónimas
- Autenticación de usuarios con JWT
- Moderación de contenido por administradores
- Sistema de likes y comentarios
- Reportes de contenido inapropiado
- Exportación de datos a Excel
- Encriptación de contenido sensible

## Requisitos Previos

- Node.js 16 o superior
- PostgreSQL 12 o superior
- npm

## Instalación

1. **Clonar el Repositorio**
```bash
git clone https://github.com/tu-usuario/confiesate.git
cd confiesate/server
```

2. **Instalar Dependencias**
```bash
npm install
```

## Configuración

1. **Base de Datos**
- Crear una base de datos PostgreSQL:
```sql
CREATE DATABASE anonymous_posts;
```

2. **Variables de Entorno**
- Copiar el archivo de ejemplo:
```bash
cp .env.example .env
```

- Configurar las variables en `.env`:
```bash
# Database
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/anonymous_posts?schema=public"

# Security
JWT_SECRET="tu_clave_secreta_jwt_min_32_chars"
ENCRYPTION_KEY="clave_de_32_caracteres_para_encriptar"
ENCRYPTION_IV="vector_de_16_chars"

# Server
PORT=3000
NODE_ENV=development
```

3. **Inicializar Base de Datos**
```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run prisma:seed
```

## Uso

1. **Desarrollo**
```bash
npm run dev
```

2. **Producción**
```bash
npm run build
npm start
```

## API Endpoints

### Autenticación

1. **Registro** - `POST /api/v1/auth/register`
```json
// Request
{
  "name": "Usuario Ejemplo",
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

2. **Login** - `POST /api/v1/auth/login`
```json
// Request
{
  "email": "usuario@example.com",
  "password": "contraseña123"
}
```

### Publicaciones

1. **Listar** - `GET /api/v1/publications?page=1&limit=10`
2. **Crear** - `POST /api/v1/publications`
3. **Ver** - `GET /api/v1/publications/:uuid`
4. **Eliminar** - `DELETE /api/v1/publications/:uuid` (admin)

### Interacciones

1. **Likes**
   - Toggle: `POST /api/v1/likes/toggle`
   - Verificar: `GET /api/v1/likes/check/:publication_uuid`

2. **Comentarios**
   - Crear: `POST /api/v1/comments`
   - Listar: `GET /api/v1/comments/publication/:publication_uuid`

3. **Reportes**
   - Crear: `POST /api/v1/reports`
   - Verificar: `GET /api/v1/reports/check/:publication_uuid`

### Administración

- `GET /api/v1/users` - Listar usuarios (admin)
- `GET /api/v1/reports` - Ver reportes (admin)
- `GET /api/v1/export/excel` - Exportar datos (admin)

## Seguridad

- Contenido encriptado usando AES-256-CBC
- Autenticación mediante JWT
- Contraseñas hasheadas con bcrypt
- Rate limiting y protección CORS
- Validación de datos en endpoints

## Solución de Problemas

### Problemas Comunes

1. **Error: Cannot connect to database**
   - Verificar PostgreSQL está corriendo
   - Comprobar credenciales en `.env`
   - Validar existencia de base de datos

2. **Error: JWT token invalid**
   - Verificar JWT_SECRET en `.env`
   - Comprobar token no expirado
   - Validar formato del token

3. **Error: Encryption failed**
   - Verificar longitud de ENCRYPTION_KEY (32 chars)
   - Verificar longitud de ENCRYPTION_IV (16 chars)

### Logs y Depuración

```bash
# Ver logs en desarrollo
npm run dev

# Ver logs en producción
npm start | tee app.log
```

## Desarrollo

### Scripts Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Desarrollo con hot-reload |
| `npm run build` | Compilar para producción |
| `npm start` | Iniciar en producción |
| `npm test` | Ejecutar pruebas |
| `npm run lint` | Verificar código |

### Base de Datos

| Comando | Descripción |
|---------|-------------|
| `npm run prisma:generate` | Generar cliente de Prisma |
| `npm run prisma:migrate:dev` | Ejecutar migraciones y triggers en desarrollo |
| `npm run prisma:migrate:deploy` | Ejecutar migraciones y triggers en producción |
| `npm run prisma:studio` | Abrir UI de administración de Prisma |
| `npm run prisma:reset` | Resetear base de datos (¡Cuidado!) |
| `npm run prisma:seed` | Poblar datos iniciales |

#### Triggers de PostgreSQL

El sistema incluye triggers automáticos que:

1. **Reportes Automáticos** (`publication_report_trigger`)
   - Se activa cuando una publicación recibe 20 reportes
   - Cambia automáticamente el estado a 'flagged'
   - Ayuda a moderar contenido inapropiado

2. **Nombres Anónimos** (`new_anonymous_user_trigger`)
   - Se activa al crear usuarios sin nombre
   - Genera nombres secuenciales (ej: "Anónimo 1", "Anónimo 2")
   - Mantiene el anonimato de forma ordenada

#### Estructura de la Base de Datos

```prisma
model User {
  // Campos principales
  uuid       String     @unique @default(uuid())
  name       String
  email      String     @unique
  // ...otros campos
}

model Publication {
  // Campos principales
  uuid        String    @unique @default(uuid())
  content     String
  status      PublicationStatus
  // ...otros campos
}
```

#### Migraciones

Las migraciones incluyen:
- Esquema base de datos
- Triggers PostgreSQL
- Índices para optimización
- Restricciones de integridad

Para aplicar todo:
```bash
npm run prisma:migrate:dev
```

## Contribución

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request