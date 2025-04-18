import ExcelJS from 'exceljs';
import { decrypt } from './encryption';

/**
 * Crea un archivo Excel con los datos de publicaciones
 * @param {Array} publications - Lista de publicaciones
 * @returns {Promise<Buffer>} - Buffer con el archivo Excel
 */
const createExcelFile = async (publications) => {
  // Creamos un nuevo libro de Excel
  const workbook = new ExcelJS.Workbook();
  
  // Agregamos una hoja para publicaciones
  const sheet = workbook.addWorksheet('Publicaciones');
  
  // Definimos las columnas
  sheet.columns = [
    { header: 'UUID', key: 'uuid', width: 36 },
    { header: 'Contenido', key: 'content', width: 50 },
    { header: 'Estado', key: 'status', width: 10 },
    { header: 'Usuario', key: 'userName', width: 20 },
    { header: 'Usuario UUID', key: 'userUuid', width: 36 },
    { header: 'Reportes', key: 'reportCount', width: 10 },
    { header: 'Creado', key: 'createdAt', width: 20 },
    { header: 'Actualizado', key: 'updatedAt', width: 20 }
  ];

  // Agregamos los datos
  for (const pub of publications) {
    sheet.addRow({
      uuid: pub.uuid,
      // Si el contenido está encriptado, lo desencriptamos
      content: pub.content.startsWith('enc:') ? decrypt(pub.content.substring(4)) : pub.content,
      status: pub.status,
      userName: pub.user?.name || 'Desconocido',
      userUuid: pub.user_uuid,
      reportCount: pub.reports?.length || 0,
      createdAt: pub.created_at.toISOString(),
      updatedAt: pub.updated_at.toISOString()
    });
  }

  // Estilo para la cabecera
  sheet.getRow(1).font = { bold: true };
  
  // Guardamos el libro como buffer
  return await workbook.xlsx.writeBuffer();
};

module.exports = {
  createExcelFile
};