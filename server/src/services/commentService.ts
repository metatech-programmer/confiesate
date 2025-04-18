import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/errorHandler';

interface Comment {
  uuid: string;
  content: string;
  user_uuid: string;
  publication_uuid: string;
  created_at: Date;
  user?: {
    uuid: string;
    name: string;
  };
}

interface CreateCommentDTO {
  content: string;
  userUuid: string;
  publicationUuid: string;
}

export class CommentService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Crear un nuevo comentario
   */
  async create(data: CreateCommentDTO): Promise<Comment> {
    try {
      return await this.prisma.comment.create({
        data: {
          content: data.content,
          user_uuid: data.userUuid,
          publication_uuid: data.publicationUuid
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
   * Obtener comentarios por publicación
   */
  async getByPublication(
    publicationUuid: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ comments: Comment[]; total: number }> {
    const skip = (page - 1) * limit;

    const [comments, total] = await Promise.all([
      this.prisma.comment.findMany({
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
      this.prisma.comment.count({
        where: {
          publication_uuid: publicationUuid
        }
      })
    ]);

    return { comments, total };
  }

  /**
   * Obtener un comentario por UUID
   */
  async getByUuid(uuid: string): Promise<Comment | null> {
    const comment = await this.prisma.comment.findUnique({
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

    return comment;
  }

  /**
   * Eliminar un comentario
   */
  async delete(uuid: string): Promise<void> {
    try {
      await this.prisma.comment.delete({
        where: { uuid }
      });
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2025') {
          throw new ApiError('Comentario no encontrado', 404);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }
}
