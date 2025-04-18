import ExcelJS from 'exceljs';
import { decrypt } from './encryption';

/**
 * Crea un archivo Excel con los datos de publicaciones, likes y comentarios
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
    { header: 'Likes', key: 'likeCount', width: 10 },
    { header: 'Creado', key: 'createdAt', width: 20 },
    { header: 'Actualizado', key: 'updatedAt', width: 20 }
  ];

  // Agregamos los datos
  for (const pub of publications) {
    sheet.addRow({
      uuid: pub.uuid,
      content: pub.content.startsWith('enc:') ? decrypt(pub.content.substring(4)) : decrypt(pub.content),
      status: pub.status,
      userName: pub.user?.name || 'Desconocido',
      userUuid: pub.user_uuid,
      reportCount: pub.reports?.length || 0,
      likeCount: pub.likes?.length || 0,
      createdAt: pub.created_at.toISOString(),
      updatedAt: pub.updated_at.toISOString()
    });
  }

  // Estilo para la cabecera
  sheet.getRow(1).font = { bold: true };

  // Likes
  const likesSheet = workbook.addWorksheet('Likes');
  likesSheet.columns = [
    { header: 'UUID', key: 'uuid', width: 36 },
    { header: 'Publication UUID', key: 'publication_uuid', width: 36 },
    { header: 'User UUID', key: 'user_uuid', width: 36 },
    { header: 'Creado', key: 'createdAt', width: 20 }
  ];
  for (const pub of publications) {
    if (pub.likes) {
      for (const like of pub.likes) {
        likesSheet.addRow({
          uuid: like.uuid,
          publication_uuid: pub.uuid,
          user_uuid: like.user_uuid,
          createdAt: like.created_at.toISOString()
        });
      }
    }
  }

  // Comments
  const commentsSheet = workbook.addWorksheet('Comentarios');
  commentsSheet.columns = [
    { header: 'UUID', key: 'uuid', width: 36 },
    { header: 'Publication UUID', key: 'publication_uuid', width: 36 },
    { header: 'User UUID', key: 'user_uuid', width: 36 },
    { header: 'Comentario', key: 'comment_content', width: 50 },
    { header: 'Creado', key: 'createdAt', width: 20 }
  ];
  for (const pub of publications) {
    if (pub.comments) {
      for (const comment of pub.comments) {
        commentsSheet.addRow({
          uuid: comment.uuid,
          publication_uuid: pub.uuid,
          user_uuid: comment.user_uuid,
          comment_content: decrypt(comment.comment_content),
          createdAt: comment.created_at.toISOString()
        });
      }
    }
  }

  // Guardamos el libro como buffer
  return await workbook.xlsx.writeBuffer();
};

module.exports = {
  createExcelFile
};