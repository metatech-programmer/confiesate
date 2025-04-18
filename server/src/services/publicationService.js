import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt } from '../utils/encryption.js';
import * as userService from './userService.js';

const prisma = new PrismaClient();

/**
 * Crea una nueva publicación
 * @param {Object} data - Datos de la publicación
 * @param {string} data.content - Contenido de la publicación
 * @param {string|null} data.userUuid - UUID del usuario si existe
 * @returns {Promise<Object>} - Publicación creada
 */
export const createPublication = async ({ content, userUuid = null }) => {
  // Primero encriptamos el contenido
  const encryptedContent = encrypt(content);
  
  // Creamos la publicación
  const publication = await prisma.publication.create({
    data: {
      content: encryptedContent,
      user_uuid: userUuid,
      status: 'active'
    }
  });

  // Desencriptamos el contenido para devolverlo
  return {
    uuid: publication.uuid,
    content: decrypt(publication.content),
    status: publication.status,
    userUuid: publication.user_uuid,
    created_at: publication.created_at,
    updated_at: publication.updated_at
  };
};

/**
 * Obtiene una publicación por su UUID
 * @param {string} uuid - UUID de la publicación
 * @returns {Promise<Object|null>} - Publicación encontrada o null
 */
export const getPublicationByUuid = async (uuid) => {
  const publication = await prisma.publication.findUnique({
    where: { uuid },
    include: {
      user: {
        select: {
          uuid: true,
          name: true
        }
      },
      reports: true
    }
  });

  if (!publication) return null;

  return {
    uuid: publication.uuid,
    content: decrypt(publication.content),
    status: publication.status,
    created_at: publication.created_at,
    updated_at: publication.updated_at,
    user: {
      uuid: publication.user.uuid,
      name: publication.user.name
    },
    reportCount: publication.reports.length
  };
};

/**
 * Obtiene todas las publicaciones con paginación
 * @param {Object} options - Opciones de paginación
 * @param {number} options.page - Número de página
 * @param {number} options.limit - Límite de elementos por página
 * @param {string} options.status - Filtro por estado
 * @returns {Promise<Object>} - Publicaciones paginadas
 */
export const getAllPublications = async ({ page = 1, limit = 10, status = 'active' }) => {
  const skip = (page - 1) * limit;
  
  const whereClause = {};
  if (status) {
    whereClause.status = status;
  }

  const [publications, total] = await Promise.all([
    prisma.publication.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        user: {
          select: {
            uuid: true,
            name: true
          }
        },
        reports: true
      }
    }),
    prisma.publication.count({ where: whereClause })
  ]);

  // Desencriptamos el contenido de todas las publicaciones
  const decryptedPublications = publications.map(pub => ({
    uuid: pub.uuid,
    content: decrypt(pub.content),
    status: pub.status,
    created_at: pub.created_at,
    updated_at: pub.updated_at,
    user: {
      uuid: pub.user.uuid,
      name: pub.user.name
    },
    reportCount: pub.reports.length
  }));

  return {
    data: decryptedPublications,
    total
  };
};

/**
 * Actualiza una publicación
 * @param {string} uuid - UUID de la publicación
 * @param {Object} data - Datos a actualizar
 * @param {string} data.content - Nuevo contenido
 * @returns {Promise<Object>} - Publicación actualizada
 */
export const updatePublication = async (uuid, { content }) => {
  const encryptedContent = encrypt(content);
  
  const publication = await prisma.publication.update({
    where: { uuid },
    data: { 
      content: encryptedContent
    },
    include: {
      user: {
        select: {
          uuid: true,
          name: true
        }
      }
    }
  });

  return {
    uuid: publication.uuid,
    content: decrypt(publication.content),
    status: publication.status,
    created_at: publication.created_at,
    updated_at: publication.updated_at,
    user: {
      uuid: publication.user.uuid,
      name: publication.user.name
    }
  };
};

/**
 * Actualiza el estado de una publicación
 * @param {string} uuid - UUID de la publicación
 * @param {string} status - Nuevo estado ('active', 'flagged', 'deleted')
 * @returns {Promise<Object>} - Publicación actualizada
 */
export const updatePublicationStatus = async (uuid, status) => {
  const publication = await prisma.publication.update({
    where: { uuid },
    data: { status }
  });

  return {
    uuid: publication.uuid,
    status: publication.status,
    updated_at: publication.updated_at
  };
};

/**
 * Elimina una publicación (soft delete)
 * @param {string} uuid - UUID de la publicación
 * @returns {Promise<Object>} - Resultado de la operación
 */
export const deletePublication = async (uuid) => {
  return prisma.publication.update({
    where: { uuid },
    data: { status: 'deleted' }
  });
};

/**
 * Obtiene todas las publicaciones de un usuario
 * @param {Object} options - Opciones de filtrado y paginación
 * @param {string} options.userUuid - UUID del usuario
 * @param {number} options.page - Número de página
 * @param {number} options.limit - Límite de elementos por página
 * @param {string} options.status - Filtro por estado
 * @returns {Promise<Object>} - Publicaciones del usuario paginadas
 */
export const getPublicationsByUser = async ({ userUuid, page = 1, limit = 10, status = 'active' }) => {
  const skip = (page - 1) * limit;
  
  const whereClause = {
    user_uuid: userUuid
  };
  
  if (status) {
    whereClause.status = status;
  }

  const [publications, total] = await Promise.all([
    prisma.publication.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      },
      include: {
        reports: true
      }
    }),
    prisma.publication.count({ where: whereClause })
  ]);

  // Desencriptamos el contenido
  const decryptedPublications = publications.map(pub => ({
    uuid: pub.uuid,
    content: decrypt(pub.content),
    status: pub.status,
    created_at: pub.created_at,
    updated_at: pub.updated_at,
    reportCount: pub.reports.length
  }));

  return {
    data: decryptedPublications,
    total
  };
};

/**
 * Obtiene todas las publicaciones para exportación (sin paginación)
 * @returns {Promise<Array>} - Todas las publicaciones
 */
export const getAllPublicationsForExport = async () => {
  const publications = await prisma.publication.findMany({
    include: {
      user: {
        select: {
          uuid: true,
          name: true,
          status: true
        }
      },
      reports: {
        select: {
          uuid: true,
          reporter_uuid: true,
          created_at: true
        }
      }
    }
  });

  // No desencriptamos aquí, lo haremos en el servicio de exportación
  return publications;
};