import { PrismaClient } from '@prisma/client';
import ExcelJS from 'exceljs';
import { decrypt } from '../utils/encryption.js';

const prisma = new PrismaClient();

/**
 * Exporta todas las publicaciones a un archivo Excel
 * @returns {Promise<Buffer>} - Buffer con el archivo Excel
 */
export const exportPublicationsToExcel = async () => {
  // Obtenemos todas las publicaciones con sus usuarios y reportes
  const publications = await prisma.publication.findMany({
    include: {
      user: {
        select: {
          uuid: true,
          name: true,
          status: true
        }
      },
      reports: {
        select: {
          uuid: true,
          reporter_uuid: true,
          created_at: true
        }
      }
    }
  });

  // Creamos un nuevo libro de Excel
  const workbook = new ExcelJS.Workbook();

  // Agregamos una hoja para publicaciones
  const publicationsSheet = workbook.addWorksheet('Publicaciones');

  // Definimos las columnas
  publicationsSheet.columns = [
    { header: 'UUID', key: 'uuid', width: 36 },
    { header: 'Contenido', key: 'content', width: 50 },
    { header: 'Estado', key: 'status', width: 10 },
    { header: 'Usuario', key: 'userName', width: 20 },
    { header: 'Usuario UUID', key: 'userUuid', width: 36 },
    { header: 'Reportes', key: 'reportCount', width: 10 },
    { header: 'Creado', key: 'createdAt', width: 20 },
    { header: 'Actualizado', key: 'updatedAt', width: 20 }
  ];

  // Agregamos datos a la hoja de publicaciones
  for (const pub of publications) {
    publicationsSheet.addRow({
      uuid: pub.uuid,
      content: decrypt(pub.content), // Desencriptamos para el export
      status: pub.status,
      userName: pub.user.name,
      userUuid: pub.user.uuid,
      reportCount: pub.reports.length,
      createdAt: pub.created_at.toISOString(),
      updatedAt: pub.updated_at.toISOString()
    });
  }

  // Agregamos una hoja para usuarios
  const usersSheet = workbook.addWorksheet('Usuarios');

  // Definimos las columnas de usuarios
  usersSheet.columns = [
    { header: 'UUID', key: 'uuid', width: 36 },
    { header: 'Nombre', key: 'name', width: 20 },
    { header: 'Estado', key: 'status', width: 10 },
    { header: 'Creado', key: 'createdAt', width: 20 },
    { header: 'Actualizado', key: 'updatedAt', width: 20 }
  ];

  // Obtenemos todos los usuarios
  const users = await prisma.user.findMany();

  // Agregamos datos a la hoja de usuarios
  for (const user of users) {
    usersSheet.addRow({
      uuid: user.uuid,
      name: user.name,
      status: user.status,
      createdAt: user.created_at.toISOString(),
      updatedAt: user.updated_at.toISOString()
    });
  }

  // Guardamos el libro de Excel en un buffer
  return await workbook.xlsx.writeBuffer();
};

/**
 * Exporta todos los datos en formato JSON
 * @returns {Promise<Object>} - Objeto con todos los datos
 */
export const exportDataToJson = async () => {
  const [users, publications, reports] = await Promise.all([
    prisma.user.findMany(),
    prisma.publication.findMany(),
    prisma.report.findMany()
  ]);

  // Desencriptamos el contenido de las publicaciones
  const decryptedPublications = publications.map(pub => ({
    ...pub,
    content: decrypt(pub.content)
  }));

  return {
    users,
    publications: decryptedPublications,
    reports
  };
};