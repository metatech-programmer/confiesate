import ExcelJS from 'exceljs';
import { decrypt } from './encryption';

interface Publication {
  uuid: string;
  content: string;
  status: string;
  user_uuid: string | null;
  created_at: Date;
  updated_at: Date;
  user?: {
    uuid: string;
    name: string;
  };
  comments?: Array<{
    uuid: string;
    content: string;
    user_uuid: string;
    created_at: Date;
    user?: {
      uuid: string;
      name: string;
    };
  }>;
  likes?: Array<{
    uuid: string;
    user_uuid: string;
    created_at: Date;
    user?: {
      uuid: string;
      name: string;
    };
  }>;
  reports?: Array<{
    uuid: string;
    reporter_uuid: string;
    created_at: Date;
    reporter?: {
      uuid: string;
      name: string;
    };
  }>;
}

/**
 * Crea un archivo Excel con los datos de publicaciones
 */
export const createExcelFile = async (publications: Publication[]): Promise<Buffer> => {
  const workbook = new ExcelJS.Workbook();
  
  // Hoja de publicaciones
  const publicationsSheet = workbook.addWorksheet('Publicaciones');
  publicationsSheet.columns = [
    { header: 'UUID', key: 'uuid', width: 36 },
    { header: 'Contenido', key: 'content', width: 50 },
    { header: 'Estado', key: 'status', width: 10 },
    { header: 'Usuario', key: 'userName', width: 20 },
    { header: 'Fecha de creación', key: 'createdAt', width: 20 },
    { header: 'Fecha de actualización', key: 'updatedAt', width: 20 },
    { header: 'Likes', key: 'likeCount', width: 10 },
    { header: 'Comentarios', key: 'commentCount', width: 10 },
    { header: 'Reportes', key: 'reportCount', width: 10 }
  ];

  for (const pub of publications) {
    publicationsSheet.addRow({
      uuid: pub.uuid,
      content: decrypt(pub.content),
      status: pub.status,
      userName: pub.user?.name || 'Anónimo',
      createdAt: pub.created_at.toISOString(),
      updatedAt: pub.updated_at.toISOString(),
      likeCount: pub.likes?.length || 0,
      commentCount: pub.comments?.length || 0,
      reportCount: pub.reports?.length || 0
    });
  }

  // Hoja de comentarios
  const commentsSheet = workbook.addWorksheet('Comentarios');
  commentsSheet.columns = [
    { header: 'UUID', key: 'uuid', width: 36 },
    { header: 'Contenido', key: 'content', width: 50 },
    { header: 'Publicación UUID', key: 'publicationUuid', width: 36 },
    { header: 'Usuario', key: 'userName', width: 20 },
    { header: 'Fecha de creación', key: 'createdAt', width: 20 }
  ];

  for (const pub of publications) {
    if (pub.comments) {
      for (const comment of pub.comments) {
        commentsSheet.addRow({
          uuid: comment.uuid,
          content: decrypt(comment.content),
          publicationUuid: pub.uuid,
          userName: comment.user?.name || 'Anónimo',
          createdAt: comment.created_at.toISOString()
        });
      }
    }
  }

  // Hoja de reportes
  const reportsSheet = workbook.addWorksheet('Reportes');
  reportsSheet.columns = [
    { header: 'UUID', key: 'uuid', width: 36 },
    { header: 'Publicación UUID', key: 'publicationUuid', width: 36 },
    { header: 'Reportante', key: 'reporterName', width: 20 },
    { header: 'Fecha de reporte', key: 'createdAt', width: 20 }
  ];

  for (const pub of publications) {
    if (pub.reports) {
      for (const report of pub.reports) {
        reportsSheet.addRow({
          uuid: report.uuid,
          publicationUuid: pub.uuid,
          reporterName: report.reporter?.name || 'Anónimo',
          createdAt: report.created_at.toISOString()
        });
      }
    }
  }

  // Aplicar estilos
  [publicationsSheet, commentsSheet, reportsSheet].forEach(sheet => {
    sheet.getRow(1).font = { bold: true };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
  });

  return Buffer.from(await workbook.xlsx.writeBuffer());
};