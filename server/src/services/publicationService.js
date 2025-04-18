const { PrismaClient } = require('@prisma/client');
const { encrypt, decrypt } = require('../utils/encryption');
const userService = require('./userService');
const prisma = new PrismaClient();

/**
 * Crea una nueva publicación
 * @param {string} content - Contenido de la publicación
 * @param {string|null} userUuid - UUID del usuario si existe
 * @returns {Promise<Object>} - Publicación creada y datos del usuario
 */
const createPublication = async (content, userUuid = null) => {
  // Primero encriptamos el contenido
  const encryptedContent = encrypt(content);
  
  // Si no hay userUuid, creamos un usuario anónimo
  let user;
  if (!userUuid) {
    user = await userService.createAnonymousUser();
    userUuid = user.uuid;
  } else {
    // Verificamos que el usuario exista
    const existingUser = await userService.getUserByUuid(userUuid);
    if (!existingUser || existingUser.status !== 'active') {
      throw new Error('Usuario no encontrado o no activo');
    }
    user = {
      uuid: existingUser.uuid,
      name: existingUser.name
    };
  }

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
    publication: {
      uuid: publication.uuid,
      content: decrypt(publication.content),
      status: publication.status,
      created_at: publication.created_at
    },
    user
  };
};

/**
 * Obtiene una publicación por su UUID
 * @param {string} uuid - UUID de la publicación
 * @returns {Promise<Object|null>} - Publicación encontrada o null
 */
const getPublicationByUuid = async (uuid) => {
  const publication = await prisma.publication.findUnique({
    where: { uuid },
    include: {
      user: {
        select: {
          uuid: true,
          name: true
        }
      }
    }
  });

  if (!publication) return null;

  return {
    ...publication,
    content: decrypt(publication.content),
    user_uuid: undefined, // No exponemos esta relación
    user: {
      uuid: publication.user.uuid,
      name: publication.user.name
    }
  };
};

/**
 * Obtiene publicaciones con paginación
 * @param {number} page - Número de página
 * @param {number} limit - Límite de elementos por página
 * @param {string} status - Filtro por estado (opcional)
 * @returns {Promise<Object>} - Publicaciones paginadas
 */
const getPublications = async (page = 1, limit = 10, status = null) => {
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
        }
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
    }
  }));

  return {
    data: decryptedPublications,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
};

/**
 * Actualiza el estado de una publicación
 * @param {string} uuid - UUID de la publicación
 * @param {string} status - Nuevo estado ('active', 'flagged', 'deleted')
 * @returns {Promise<Object>} - Publicación actualizada
 */
const updatePublicationStatus = async (uuid, status) => {
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

module.exports = {
  createPublication,
  getPublicationByUuid,
  getPublications,
  updatePublicationStatus
};