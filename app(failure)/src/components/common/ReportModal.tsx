import { useFormik } from 'formik';
import * as Yup from 'yup';
import { api } from '../../services/api';
import { toast } from 'react-hot-toast';
import Modal from '../Modal';
import { analytics } from '../../utils/analytics';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: string;
}

const reportSchema = Yup.object().shape({
  reason: Yup.string()
    .required('La razón es requerida')
    .min(10, 'La razón debe tener al menos 10 caracteres')
    .max(500, 'La razón no puede exceder los 500 caracteres'),
  type: Yup.string()
    .required('El tipo es requerido')
    .oneOf(['inappropriate', 'spam', 'offensive', 'other']),
});

const ReportModal = ({ isOpen, onClose, postId }: ReportModalProps) => {
  const formik = useFormik({
    initialValues: {
      reason: '',
      type: 'inappropriate',
    },
    validationSchema: reportSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await api.post(`/v1/publications/${postId}/report`, values);
        
        analytics.trackEvent({
          category: 'Moderation',
          action: 'Report',
          label: values.type,
          metadata: {
            postId,
          },
        });

        toast.success('Reporte enviado correctamente');
        resetForm();
        onClose();
      } catch (error) {
        toast.error('Error al enviar el reporte');
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Reportar Contenido">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo de Reporte
          </label>
          <select
            name="type"
            value={formik.values.type}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-purple focus:ring-app-purple"
          >
            <option value="inappropriate">Contenido inapropiado</option>
            <option value="spam">Spam</option>
            <option value="offensive">Contenido ofensivo</option>
            <option value="other">Otro</option>
          </select>
          {formik.touched.type && formik.errors.type && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.type}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Razón del Reporte
          </label>
          <textarea
            name="reason"
            rows={4}
            value={formik.values.reason}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-purple focus:ring-app-purple"
            placeholder="Describe por qué estás reportando este contenido..."
          />
          {formik.touched.reason && formik.errors.reason && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.reason}</p>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-purple"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={formik.isSubmitting || !formik.isValid}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {formik.isSubmitting ? 'Enviando...' : 'Enviar Reporte'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ReportModal;