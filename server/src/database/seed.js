// src/database/seed.js
import { PrismaClient } from '@prisma/client';
import { encrypt } from '../utils/encryption.js';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando la siembra de datos...');

  // Crear usuarios iniciales
  const admin = await prisma.user.create({
    data: {
      name: 'Administrador',
      status: 'active'
    }
  });

  const anonimo1 = await prisma.user.create({
    data: {
      name: 'Anónimo 1',
      status: 'active'
    }
  });

  const anonimo2 = await prisma.user.create({
    data: {
      name: 'Anónimo 2',
      status: 'active'
    }
  });

  console.log(`Creados ${3} usuarios`);

  // Crear algunas publicaciones
  const publicaciones = await Promise.all([
    prisma.publication.create({
      data: {
        content: encrypt('Esta es la primera publicación de prueba'),
        user_uuid: anonimo1.uuid,
        status: 'active'
      }
    }),
    prisma.publication.create({
      data: {
        content: encrypt('Segunda publicación para probar el sistema'),
        user_uuid: anonimo1.uuid,
        status: 'active'
      }
    }),
    prisma.publication.create({
      data: {
        content: encrypt('Otra publicación de otro usuario anónimo'),
        user_uuid: anonimo2.uuid, 
        status: 'active'
      }
    }),
    prisma.publication.create({
      data: {
        content: encrypt('Esta publicación tiene contenido que podría ser reportado'),
        user_uuid: anonimo2.uuid,
        status: 'active'
      }
    })
  ]);

  console.log(`Creadas ${publicaciones.length} publicaciones`);

  // Crear algunos reportes
  await prisma.report.create({
    data: {
      publication_uuid: publicaciones[3].uuid,
      reporter_uuid: anonimo1.uuid
    }
  });

  console.log('Creado 1 reporte');
  
  console.log('¡Siembra de datos completada!');
}

main()
  .catch((e) => {
    console.error('Error en la siembra de datos:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });