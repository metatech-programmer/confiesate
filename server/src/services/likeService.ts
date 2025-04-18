import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/errorHandler';

interface Like {
  uuid: string;
  user_uuid: string;
  publication_uuid: string;
  created_at: Date;
  user?: {
    uuid: string;
    name: string;
  };
}

export class LikeService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Toggle like en una publicación
   */
  async toggle(publicationUuid: string, userUuid: string): Promise<{ liked: boolean }> {
    try {
      const existingLike = await this.prisma.like.findFirst({
        where: {
          publication_uuid: publicationUuid,
          user_uuid: userUuid
        }
      });

      if (existingLike) {
        await this.prisma.like.delete({
          where: {
            uuid: existingLike.uuid
          }
        });
        return { liked: false };
      }

      await this.prisma.like.create({
        data: {
          publication_uuid: publicationUuid,
          user_uuid: userUuid
        }
      });
      return { liked: true };
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2003') {
          throw new ApiError('Publicación o usuario no encontrado', 404);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }

  /**
   * Obtener likes de una publicación
   */
  async getByPublication(
    publicationUuid: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ likes: Like[]; total: number }> {
    const skip = (page - 1) * limit;

    const [likes, total] = await Promise.all([
      this.prisma.like.findMany({
        where: {
          publication_uuid: publicationUuid
        },
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
        },
        skip,
        take: limit
      }),
      this.prisma.like.count({
        where: {
          publication_uuid: publicationUuid
        }
      })
    ]);

    return { likes, total };
  }

  /**
   * Verificar si un usuario dio like a una publicación
   */
  async checkUserLike(publicationUuid: string, userUuid: string): Promise<boolean> {
    const like = await this.prisma.like.findFirst({
      where: {
        publication_uuid: publicationUuid,
        user_uuid: userUuid
      }
    });

    return !!like;
  }
}
