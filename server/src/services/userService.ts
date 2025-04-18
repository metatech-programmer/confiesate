import { PrismaClient } from '@prisma/client';
import { ApiError } from '../utils/errorHandler';
import bcrypt from 'bcrypt';

interface User {
  uuid: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  created_at: Date;
  last_login?: Date;
}

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: string;
}

interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: string;
  status?: string;
}

export class UserService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Validar credenciales de usuario
   */
  async validateCredentials(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    
    if (!user) {
      throw new ApiError('Credenciales inválidas', 401);
    }

    if (user.status !== 'active') {
      throw new ApiError('Usuario inactivo', 403);
    }

    const isValid = await this.validatePassword(password, user.password);
    if (!isValid) {
      throw new ApiError('Credenciales inválidas', 401);
    }

    return user;
  }

  /**
   * Validar contraseña
   */
  async validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Crear un nuevo usuario
   */
  async create(data: CreateUserDTO): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(data.password, 10);

      return await this.prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: hashedPassword,
          role: data.role || 'user',
          status: 'active'
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2002') {
          throw new ApiError('El correo electrónico ya está registrado', 400);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }

  /**
   * Obtener todos los usuarios con paginación y filtros
   */
  async getAll(
    page: number = 1,
    limit: number = 10,
    role?: string,
    status?: string
  ): Promise<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const where = {
      ...(role && { role }),
      ...(status && { status })
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take: limit,
        select: {
          uuid: true,
          name: true,
          email: true,
          role: true,
          status: true,
          created_at: true,
          last_login: true,
          password: false
        }
      }),
      this.prisma.user.count({ where })
    ]);

    return { users, total };
  }

  /**
   * Buscar un usuario por UUID
   */
  async findByUuid(uuid: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { uuid },
      select: {
        uuid: true,
        name: true,
        email: true,
        role: true,
        status: true,
        created_at: true,
        last_login: true,
        password: true
      }
    });

    return user;
  }

  /**
   * Buscar un usuario por email
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    return user;
  }

  /**
   * Actualizar un usuario
   */
  async update(uuid: string, data: UpdateUserDTO): Promise<User> {
    try {
      const updateData: any = { ...data };
      
      if (data.password) {
        updateData.password = await bcrypt.hash(data.password, 10);
      }

      return await this.prisma.user.update({
        where: { uuid },
        data: updateData,
        select: {
          uuid: true,
          name: true,
          email: true,
          role: true,
          status: true,
          created_at: true,
          last_login: true,
          password: false
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2002') {
          throw new ApiError('El correo electrónico ya está registrado', 400);
        }
        if ('code' in error && error.code === 'P2025') {
          throw new ApiError('Usuario no encontrado', 404);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }

  /**
   * Actualizar el rol de un usuario
   */
  async updateRole(uuid: string, role: string): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { uuid },
        data: { role },
        select: {
          uuid: true,
          name: true,
          email: true,
          role: true,
          status: true,
          created_at: true,
          last_login: true,
          password: false
        }
      });
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2025') {
          throw new ApiError('Usuario no encontrado', 404);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }

  /**
   * Eliminar un usuario
   */
  async delete(uuid: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { uuid }
      });
    } catch (error) {
      if (error instanceof Error) {
        if ('code' in error && error.code === 'P2025') {
          throw new ApiError('Usuario no encontrado', 404);
        }
        throw new ApiError(error.message, 500);
      }
      throw new ApiError('Error interno del servidor', 500);
    }
  }

  /**
   * Actualizar la fecha del último inicio de sesión
   */
  async updateLastLogin(uuid: string): Promise<void> {
    await this.prisma.user.update({
      where: { uuid },
      data: {
        last_login: new Date()
      }
    });
  }
}