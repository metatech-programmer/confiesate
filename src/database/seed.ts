import { PrismaClient, UserRole } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  try {
    // Check if admin exists
    const existingAdmin = await prisma.user.findUnique({
      where: {
        email: 'admin@example.com'
      }
    });

    if (!existingAdmin) {
      // Crear usuario administrador
      const hashedPassword = await hash('admin123', 10);
      await prisma.user.create({
        data: {
          email: 'admin@example.com',
          password: hashedPassword,
          name: 'Administrator',
          role: UserRole.admin  // Explicitly use UserRole enum
        }
      });
      console.log('✅ Usuario administrador creado exitosamente');
    } else {
      console.log('ℹ️ El usuario administrador ya existe');
    }

    console.log('✅ Seed completado exitosamente');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });