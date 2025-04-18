import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Verifica si existe un like de un usuario para una publicación
 */
export const checkExistingLike = async (publicationUuid, userUuid) => {
  return prisma.like.findFirst({
    where: {
      publication_uuid: publicationUuid,
      user_uuid: userUuid
    }
  });
};

/**
 * Crea un nuevo like
 */
export const createLike = async ({ publicationUuid, userUuid }) => {
  try {
    const like = await prisma.like.create({
      data: {
        publication_uuid: publicationUuid,
        user_uuid: userUuid
      }
    });

    return like;
  } catch (error) {
    if (error.code === 'P2002') {
      throw new Error('Ya has dado like a esta publicación');
    }
    throw error;
  }
};

/**
 * Elimina un like
 */
export const deleteLike = async (publicationUuid, userUuid) => {
  return prisma.like.deleteMany({
    where: {
      publication_uuid: publicationUuid,
      user_uuid: userUuid
    }
  });
};

/**
 * Obtiene likes por publicación con paginación
 */
export const getLikesByPublication = async ({ publicationUuid, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [likes, total] = await Promise.all([
    prisma.like.findMany({
      where: {
        publication_uuid: publicationUuid
      },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            uuid: true,
            name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.like.count({
      where: {
        publication_uuid: publicationUuid
      }
    })
  ]);

  return {
    data: likes,
    total
  };
};
