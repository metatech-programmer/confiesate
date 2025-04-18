import { PrismaClient } from '@prisma/client';

// Instancia global de PrismaClient
const prisma = new PrismaClient();

export default prisma;