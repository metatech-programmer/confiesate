import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { analytics } from '../../utils/analytics';
import { toast } from 'react-hot-toast';

const feedbackSchema = Yup.object().shape({
  type: Yup.string()
    .oneOf(['bug', 'feature', 'feedback'])
    .required('El tipo es requerido'),
  content: Yup.string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .required('El mensaje es requerido'),
  rating: Yup.number()
    .min(1)
    .max(5)
    .nullable(),
});

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      type: 'feedback',
      content: '',
      rating: null,
    },
    validationSchema: feedbackSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        analytics.trackFeedback({
          type: values.type as 'bug' | 'feature' | 'feedback',
          content: values.content,
          rating: values.rating || undefined,
          metadata: {
            url: window.location.pathname,
            userAgent: navigator.userAgent,
          },
        });

        toast.success('¡Gracias por tu feedback!');
        resetForm();
        setIsOpen(false);
      } catch (error) {
        toast.error('Error al enviar el feedback');
      }
    },
  });

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 bg-app-purple text-white rounded-full p-3 shadow-lg hover:bg-app-purple/90 transition-colors"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setIsOpen(false)} />
            <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Enviar Feedback
              </h3>
              <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo
                  </label>
                  <select
                    name="type"
                    value={formik.values.type}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-purple focus:ring-app-purple"
                  >
                    <option value="feedback">Feedback general</option>
                    <option value="bug">Reportar bug</option>
                    <option value="feature">Sugerir funcionalidad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mensaje
                  </label>
                  <textarea
                    name="content"
                    rows={4}
                    value={formik.values.content}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-purple focus:ring-app-purple"
                  />
                  {formik.touched.content && formik.errors.content && (
                    <p className="mt-1 text-sm text-red-600">
                      {formik.errors.content}
                    </p>
                  )}
                </div>

                {formik.values.type === 'feedback' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Valoración
                    </label>
                    <div className="flex space-x-2 mt-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          type="button"
                          onClick={() => formik.setFieldValue('rating', rating)}
                          className={`p-2 rounded-full ${
                            formik.values.rating === rating
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        >
                          <svg
                            className="h-6 w-6"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 15.585l-6.327 3.332 1.209-7.047L.172 7.177l7.06-1.026L10 0l2.768 6.151 7.06 1.026-4.71 4.693 1.209 7.047L10 15.585z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-2 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-purple"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-app-purple rounded-md hover:bg-app-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-purple"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackWidget;