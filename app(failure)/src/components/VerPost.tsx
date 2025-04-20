import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Item, Comment } from '../types/Item';
import { RootState } from '../store';
import { api, isAnonymousUser, handleApiError } from '../services/api';
import { toast } from 'react-hot-toast';
import Modal from './Modal';
import { Link } from 'react-router-dom';

interface VerPostProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const commentSchema = Yup.object().shape({
  content: Yup.string()
    .min(2, 'El comentario debe tener al menos 2 caracteres')
    .max(200, 'El comentario no puede exceder los 200 caracteres')
    .required('El comentario es requerido'),
});

const VerPost = ({ item, isOpen, onClose, onUpdate }: VerPostProps) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  const formik = useFormik({
    initialValues: {
      content: '',
    },
    validationSchema: commentSchema,
    onSubmit: async (values, { resetForm }) => {
      if (!isAuthenticated) {
        setShowAuthPrompt(true);
        return;
      }

      if (isAnonymousUser()) {
        toast.error('Las cuentas anónimas no pueden comentar. Crea una cuenta regular para participar.');
        return;
      }

      setIsSubmitting(true);
      try {
        await api.post(`/v1/publications/${item.id}/comments`, {
          content: values.content,
        });

        toast.success('Comentario agregado');
        resetForm();
        onUpdate();
      } catch (error: any) {
        toast.error(handleApiError(error));
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleLike = async () => {
    if (!isAuthenticated) {
      setShowAuthPrompt(true);
      return;
    }

    if (isAnonymousUser()) {
      toast.error('Las cuentas anónimas no pueden dar like. Crea una cuenta regular para participar.');
      return;
    }

    try {
      await api.post(`/v1/publications/${item.id}/like`);
      onUpdate();
    } catch (error: any) {
      toast.error(handleApiError(error));
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500">{item.author || 'Anónimo'}</span>
            <span className="text-sm text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="text-gray-800">{item.content}</p>
          {item.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {item.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-app-purple/10 text-app-purple px-2 py-1 rounded-full text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
            <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">
              {item.category || 'General'}
            </span>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLike}
                className="flex items-center space-x-1 text-app-purple hover:text-app-purple/80 transition-colors"
              >
                <svg
                  className={`h-5 w-5 ${item.hasLiked ? 'fill-app-purple' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                <span>{item.likes}</span>
              </button>
              <div className="flex items-center space-x-1">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                  />
                </svg>
                <span>{item.comments.length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Auth prompt for non-authenticated users */}
        {showAuthPrompt && !isAuthenticated && (
          <div className="bg-gray-50 p-4 rounded-lg text-center mb-4">
            <p className="text-gray-600 mb-4">
              Para interactuar con las confesiones, necesitas iniciar sesión o crear una cuenta.
            </p>
            <div className="space-x-4">
              <Link
                to="/auth/register"
                className="inline-block bg-app-purple text-white px-4 py-2 rounded-md hover:bg-app-purple/90"
              >
                Crear Cuenta
              </Link>
              <Link
                to="/auth/login"
                className="inline-block border border-app-purple text-app-purple px-4 py-2 rounded-md hover:bg-app-purple/10"
              >
                Iniciar Sesión
              </Link>
            </div>
          </div>
        )}

        {/* Sección de comentarios */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium">Comentarios</h4>
          
          {isAuthenticated && !isAnonymousUser() && (
            <form onSubmit={formik.handleSubmit} className="space-y-2">
              <textarea
                name="content"
                placeholder="Escribe un comentario..."
                className="w-full p-2 border rounded-md focus:ring-app-purple focus:border-app-purple"
                value={formik.values.content}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.content && formik.errors.content && (
                <div className="text-red-500 text-xs">{formik.errors.content}</div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !formik.isValid}
                  className="px-4 py-2 text-sm font-medium text-white bg-app-purple hover:bg-app-purple/90 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-purple disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Comentar'}
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {item.comments.map((comment: Comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded-lg">
                <p className="text-gray-800 text-sm">{comment.content}</p>
                <div className="mt-1 flex justify-between items-center text-xs text-gray-500">
                  <span>{comment.userName || 'Anónimo'}</span>
                  <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default VerPost;
