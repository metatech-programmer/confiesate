# Backend para Sistema de Publicaciones Anónimas

Esta es una API RESTful para un sistema de publicaciones anónimas utilizando Node.js, Express y PostgreSQL con Prisma ORM.

## Características

- Manejo de usuarios anónimos con nombres secuenciales
- Publicaciones con contenido encriptado
- Sistema de reportes con marcado automático
- Exportación de datos en formato Excel o JSON
- Paginación en todos los endpoints
- Arquitectura modular y profesional
- Encriptación de datos sensibles

## Requisitos previos

- Node.js 16+
- PostgreSQL 12+
- npm o yarn

## Instalación

1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd anonymous-posts-backend
```

2. Instalar dependencias

```bash
npm install
```

3. Configurar variables de entorno

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus propias configuraciones.

4. Configurar la base de datos

```bash
# Genera las migraciones de Prisma
npm run migrate

# Opcional: Poblar la base de datos con datos iniciales
npm run seed
```

## Ejecución

### Desarrollo

```bash
npm run dev
```

### Producción

```bash
npm start
```

## Estructura del proyecto

```
server/
├── src/
│   ├── controllers/     # Controladores de la aplicación
│   ├── database/        # Configuración de la base de datos y migraciones
│   ├── middlewares/     # Middlewares de Express
│   ├── routes/          # Definición de rutas
│   ├── services/        # Servicios para la lógica de negocio
│   ├── utils/           # Utilidades comunes
│   └── server.js        # Punto de entrada de la aplicación
├── .env                 # Variables de entorno
├── .env.example         # Ejemplo de configuración de variables de entorno
└── package.json         # Dependencias y scripts
```

## API Endpoints

### Publicaciones

- `GET /api/publications` - Obtener todas las publicaciones
- `GET /api/publications/:uuid` - Obtener una publicación por UUID
- `POST /api/publications` - Crear una nueva publicación
- `PUT /api/publications/:uuid` - Actualizar una publicación
- `DELETE /api/publications/:uuid` - Eliminar una publicación
- `POST /api/publications/:publicationUuid/report` - Reportar una publicación

### Usuarios

- `GET /api/users` - Obtener todos los usuarios
- `GET /api/users/:uuid` - Obtener un usuario por UUID
- `PUT /api/users/:uuid/status` - Actualizar el estado de un usuario
- `DELETE /api/users/:uuid` - Eliminar un usuario
- `GET /api/users/:uuid/publications` - Obtener publicaciones de un usuario

### Reportes

- `GET /api/reports` - Obtener todos los reportes
- `GET /api/reports/publication/:publicationUuid` - Obtener reportes de una publicación
- `PUT /api/reports/publication/:publicationUuid/dismiss` - Rechazar reportes
- `PUT /api/reports/publication/:publicationUuid/confirm` - Confirmar reportes

### Exportación

- `GET /api/export/publications` - Exportar publicaciones (Excel o JSON)

## Seguridad

- El contenido de las publicaciones se almacena encriptado
- Se utiliza JWT para autenticación
- Las operaciones administrativas requieren autenticación