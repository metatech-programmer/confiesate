// src/services/userService.js
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Obtiene el siguiente número para un usuario anónimo 
 * @returns {Promise<number>} - Siguiente número secuencial
 */
export const getNextAnonymousNumber = async () => {
  const lastUser = await prisma.user.findFirst({
    where: {
      name: {
        startsWith: 'Anónimo'
      }
    },
    orderBy: {
      name: 'desc'
    }
  });

  if (!lastUser) {
    return 1;
  }

  // Extraer el número del nombre (por ejemplo, "Anónimo 42" => 42)
  const match = lastUser.name.match(/Anónimo (\d+)/);
  if (match && match[1]) {
    return parseInt(match[1]) + 1;
  }
  
  return 1;
};

/**
 * Crea un nuevo usuario anónimo
 * @returns {Promise<Object>} - Nuevo usuario creado
 */
export const createAnonymousUser = async () => {
  const nextNumber = await getNextAnonymousNumber();
  const name = `Anónimo ${nextNumber}`;
  
  const user = await prisma.user.create({
    data: {
      name,
      status: 'active'
    }
  });

  return {
    uuid: user.uuid,
    name: user.name
  };
};

/**
 * Obtiene un usuario por su UUID
 * @param {string} uuid - UUID del usuario
 * @returns {Promise<Object|null>} - Usuario encontrado o null
 */
export const getUserByUuid = async (uuid) => {
  return prisma.user.findUnique({
    where: { uuid }
  });
};

/**
 * Obtiene todos los usuarios con paginación
 * @param {Object} options - Opciones de paginación
 * @param {number} options.page - Número de página
 * @param {number} options.limit - Límite de elementos por página
 * @param {string} options.status - Filtro por estado (opcional)
 * @returns {Promise<Object>} - Usuarios paginados
 */
export const getAllUsers = async ({ page = 1, limit = 10, status = null }) => {
  const skip = (page - 1) * limit;
  
  const whereClause = {};
  if (status) {
    whereClause.status = status;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    }),
    prisma.user.count({ where: whereClause })
  ]);

  return {
    data: users,
    total
  };
};

/**
 * Actualiza el estado de un usuario
 * @param {string} uuid - UUID del usuario
 * @param {string} status - Nuevo estado ('active', 'banned', 'deleted')
 * @returns {Promise<Object>} - Usuario actualizado
 */
export const updateUserStatus = async (uuid, status) => {
  return prisma.user.update({
    where: { uuid },
    data: { status }
  });
};

/**
 * Elimina un usuario lógicamente (soft delete)
 * @param {string} uuid - UUID del usuario
 * @returns {Promise<Object>} - Usuario eliminado
 */
export const deleteUser = async (uuid) => {
  return prisma.user.update({
    where: { uuid },
    data: { status: 'deleted' }
  });
};