import { PrismaClient, PublicationStatus, Prisma } from '@prisma/client';
import { ApiError } from '../utils/errorHandler';
import { encrypt, decrypt } from '../utils/encryption';

// Interfaz que espera el frontend
export interface Post {
  id: number;
  author?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  likes?: number;
  createdAt?: string;
  comments?: {
    author?: string;
    text?: string;
  }[];
  reports?: number;
}

// Interfaz para la base de datos
interface Publication {
  id: number;
  uuid: string;
  title: string | null; // Changed from optional to nullable
  content: string;
  image_url: string | null; // Changed from optional to nullable
  status: PublicationStatus;
  user_uuid: string;
  created_at: Date;
  user?: {
    uuid: string;
    name: string;
  };
  Comment?: Array<any>;
  Like?: Array<any>;
  reports?: Array<any>;
}

interface CreatePublicationDTO {
  content: string;
  userUuid?: string;
  title?: string;
  imageUrl?: string;
}

export class PublicationService {
  constructor(private prisma: PrismaClient) {}

  private transformToPost(publication: Publication): Post {
    return {
      id: publication.id,
      author: publication.user?.name || 'Anónimo',
      title: publication.title || undefined, 
      description: decrypt(publication.content) || publication.content,
      imageUrl: publication.image_url || undefined, 
      likes: publication.Like?.length || 0,
      createdAt: publication.created_at.toISOString(),
      comments: publication.Comment?.map(comment => ({
        author: comment.user?.name || 'Anónimo',
        text: decrypt(comment.comment_content) || comment.comment_content
      })) || [],
      reports: publication.reports?.length || 0
    };
  }

  async create(data: CreatePublicationDTO): Promise<Post> {
    const encryptedContent = encrypt(data.content);
    if (!encryptedContent) {
      throw new ApiError('Error al encriptar el contenido', 500);
    }

    try {
      const publication = await this.prisma.publication.create({
        data: {
          content: encryptedContent,
          title: data.title,
          image_url: data.imageUrl,
          user_uuid: data.userUuid || '',
          status: PublicationStatus.active
        },
        include: {
          user: {
            select: {
              uuid: true,
              name: true
            }
          },
          Comment: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          },
          Like: true,
          reports: true
        }
      });

      return this.transformToPost(publication);
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2003') {
          throw new ApiError('Usuario no encontrado', 404);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
    status?: PublicationStatus
  ): Promise<{ posts: Post[]; total: number }> {
    const skip = (page - 1) * limit;
    const where: Prisma.PublicationWhereInput = status ? { status } : {};

    const [publications, total] = await Promise.all([
      this.prisma.publication.findMany({
        where,
        include: {
          user: {
            select: {
              uuid: true,
              name: true
            }
          },
          Comment: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          },
          Like: true,
          reports: true
        },
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit
      }),
      this.prisma.publication.count({ where })
    ]);

    return {
      posts: publications.map(pub => this.transformToPost(pub as Publication)),
      total
    };
  }

  async getByUuid(uuid: string): Promise<Post | null> {
    const publication = await this.prisma.publication.findUnique({
      where: { uuid },
      include: {
        user: {
          select: {
            uuid: true,
            name: true
          }
        },
        Comment: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        Like: true,
        reports: true
      }
    });

    if (!publication) {
      return null;
    }

    return this.transformToPost(publication);
  }

  async updateStatus(uuid: string, status: PublicationStatus): Promise<Post> {
    try {
      const publication = await this.prisma.publication.update({
        where: { uuid },
        data: { status },
        include: {
          user: {
            select: {
              uuid: true,
              name: true
            }
          },
          Comment: {
            include: {
              user: {
                select: {
                  name: true
                }
              }
            }
          },
          Like: true,
          reports: true
        }
      });

      return this.transformToPost(publication);
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2025') {
          throw new ApiError('Publicación no encontrada', 404);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }

  async delete(uuid: string): Promise<void> {
    try {
      await this.prisma.publication.delete({
        where: { uuid }
      });
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2025') {
          throw new ApiError('Publicación no encontrada', 404);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }

  async getNextAnonymousName(): Promise<string> {
    const lastAnonymous = await this.prisma.user.findFirst({
      where: {
        name: {
          startsWith: 'Anónimo'
        }
      },
      orderBy: {
        name: 'desc'
      }
    });

    const nextNumber = lastAnonymous 
      ? parseInt(lastAnonymous.name.split(' ')[1]) + 1 
      : 1;

    return `Anónimo ${nextNumber}`;
  }
}