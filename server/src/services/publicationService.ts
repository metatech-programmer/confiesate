import { PrismaClient, PublicationStatus, Prisma } from '@prisma/client';
import { ApiError } from '../utils/errorHandler';
import { encrypt, decrypt } from '../utils/encryption';

interface Publication {
  uuid: string;
  content: string;
  status: PublicationStatus;
  user_uuid: string | null;
  created_at: Date;
  user?: {
    uuid: string;
    name: string;
  };
  comments?: Array<any>;
  likes?: Array<any>;
  reports?: Array<any>;
}

interface CreatePublicationDTO {
  content: string;
  userUuid?: string;
}

export class PublicationService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Crear una nueva publicación
   */
  async create(data: CreatePublicationDTO): Promise<Publication> {
    const encryptedContent = encrypt(data.content);
    if (!encryptedContent) {
      throw new ApiError('Error al encriptar el contenido', 500);
    }

    try {
      return await this.prisma.publication.create({
        data: {
          content: encryptedContent,
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
          Comment: true,
          Like: true,
          reports: true
        }
      }) as unknown as Publication;
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

  /**
   * Obtener todas las publicaciones con paginación y filtros
   */
  async getAll(
    page: number = 1,
    limit: number = 10,
    status?: PublicationStatus
  ): Promise<{ publications: Publication[]; total: number }> {
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
          Comment: true,
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

    // Desencriptar contenido de las publicaciones
    const decryptedPublications = publications.map((pub: Publication) => ({
      ...pub,
      content: decrypt(pub.content) || pub.content
    }));

    return {
      publications: decryptedPublications,
      total
    };
  }

  /**
   * Obtener una publicación por UUID
   */
  async getByUuid(uuid: string): Promise<Publication | null> {
    const publication = await this.prisma.publication.findUnique({
      where: { uuid },
      include: {
        user: {
          select: {
            uuid: true,
            name: true
          }
        },
        Comment: true,
        Like: true,
        reports: true
      }
    });

    if (!publication) {
      return null;
    }

    // Desencriptar contenido
    return {
      ...publication,
      content: decrypt(publication.content) || publication.content
    };
  }

  /**
   * Actualizar el estado de una publicación
   */
  async updateStatus(uuid: string, status: PublicationStatus): Promise<Publication> {
    try {
      return await this.prisma.publication.update({
        where: { uuid },
        data: { status },
        include: {
          user: {
            select: {
              uuid: true,
              name: true
            }
          },
          Comment: true,
          Like: true,
          reports: true
        }
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

  /**
   * Eliminar una publicación
   */
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

  // En PublicationService
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