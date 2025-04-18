import { PrismaClient } from '@prisma/client';
import { encrypt, decrypt } from '../utils/encryption.js';

const prisma = new PrismaClient();

/**
 * Crea un nuevo comentario
 */
export const createComment = async ({ publicationUuid, userUuid, content }) => {
  const encryptedContent = encrypt(content);
  
  const comment = await prisma.comment.create({
    data: {
      publication_uuid: publicationUuid,
      user_uuid: userUuid,
      comment_content: encryptedContent
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
    ...comment,
    comment_content: decrypt(comment.comment_content)
  };
};

/**
 * Obtiene comentarios por publicación con paginación
 */
export const getCommentsByPublication = async ({ publicationUuid, page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [comments, total] = await Promise.all([
    prisma.comment.findMany({
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
    prisma.comment.count({
      where: {
        publication_uuid: publicationUuid
      }
    })
  ]);

  // Desencriptar comentarios
  const decryptedComments = comments.map(comment => ({
    ...comment,
    comment_content: decrypt(comment.comment_content)
  }));

  return {
    data: decryptedComments,
    total
  };
};

/**
 * Elimina un comentario
 */
export const deleteComment = async (uuid, userUuid) => {
  const comment = await prisma.comment.findUnique({
    where: { uuid }
  });

  if (!comment) {
    throw new Error('Comentario no encontrado');
  }

  if (comment.user_uuid !== userUuid) {
    throw new Error('No tienes permiso para eliminar este comentario');
  }

  return prisma.comment.delete({
    where: { uuid }
  });
};
