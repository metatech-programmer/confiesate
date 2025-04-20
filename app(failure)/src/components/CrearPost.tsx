import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { api } from '../services/api';
import { analytics } from '../utils/analytics';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-hot-toast';
import { loginSuccess } from '../features/auth/authSlice';
import { PostCategory } from '../types/Item';
import type { RootState } from '../store';

interface CrearPostProps {
  isOpen: boolean;
  onClose: () => void;
}

const createPostSchema = Yup.object().shape({
  content: Yup.string()
    .required('El contenido es requerido')
    .min(10, 'La confesión debe tener al menos 10 caracteres')
    .max(1000, 'La confesión no puede exceder los 1000 caracteres'),
  isAnonymous: Yup.boolean(),
  category: Yup.string().oneOf(Object.values(PostCategory)).required('La categoría es requerida'),
  tags: Yup.array().of(Yup.string()),
});

const CrearPost = ({ isOpen, onClose }: CrearPostProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 3,
    maxSize: 5242880, // 5MB
    onDrop: (acceptedFiles) => {
      setImages(prev => [...prev, ...acceptedFiles].slice(0, 3));
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(file => {
        if (file.size > 5242880) {
          toast.error('Las imágenes no deben exceder 5MB');
        } else {
          toast.error('Formato de imagen no soportado');
        }
      });
    },
  });

  const formik = useFormik({
    initialValues: {
      content: '',
      isAnonymous: !user || (user.isAnonymous ?? true),
      category: 'general' as PostCategory,
      tags: [] as string[],
    },
    validationSchema: createPostSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('content', values.content);
        formData.append('isAnonymous', String(values.isAnonymous));
        formData.append('category', values.category);
        values.tags.forEach(tag => formData.append('tags[]', tag));
        images.forEach(image => formData.append('images[]', image));

        const response = await api.post(/publications', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.data.anonymousUser) {
          dispatch(loginSuccess({
            user: response.data.anonymousUser,
            token: response.data.token
          }));
          toast.success('Se ha creado una cuenta anónima para ti', {
            duration: 5000,
            icon: '🎭'
          });
        }

        analytics.trackEvent({
          category: 'Post',
          action: 'Create',
          metadata: {
            hasImages: images.length > 0,
            isAnonymous: values.isAnonymous,
            tagCount: values.tags.length,
            category: values.category
          },
        });

        toast.success('Confesión publicada correctamente');
        onClose();
        navigate(`/confession/${response.data.post.id}`);
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al publicar la confesión');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const tag = input.value.trim().toLowerCase();

      if (tag && !formik.values.tags.includes(tag)) {
        formik.setFieldValue('tags', [...formik.values.tags, tag]);
      }
      input.value = '';
    }
  };

  const removeTag = (tagToRemove: string) => {
    formik.setFieldValue(
      'tags',
      formik.values.tags.filter(tag => tag !== tagToRemove)
    );
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Tu confesión
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows={5}
              value={formik.values.content}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="shadow-sm focus:ring-app-purple focus:border-app-purple block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Escribe tu confesión aquí..."
            />
            {formik.touched.content && formik.errors.content && (
              <p className="mt-1 text-sm text-red-600">
                {formik.errors.content}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            name="category"
            value={formik.values.category}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-app-purple focus:border-app-purple sm:text-sm rounded-md"
          >
            <option value="general">General</option>
            <option value="academic">Académico</option>
            <option value="social">Social</option>
            <option value="love">Amor</option>
            <option value="other">Otros</option>
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.category}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Etiquetas
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formik.values.tags.map((tag) => (
              <motion.span
                key={tag}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-app-purple/10 text-app-purple px-2 py-1 rounded-full text-sm flex items-center"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-app-purple hover:text-app-purple/70"
                >
                  ×
                </button>
              </motion.span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Agrega etiquetas (presiona Enter)"
            onKeyDown={handleTagInput}
            className="mt-1 block w-full shadow-sm focus:ring-app-purple focus:border-app-purple sm:text-sm border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imágenes (opcional)
          </label>
          <div
            {...getRootProps()}
            className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-app-purple transition-colors cursor-pointer"
          >
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input {...getInputProps()} />
              <p className="text-sm text-gray-600">
                Arrastra imágenes aquí o haz clic para seleccionar
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF hasta 5MB (máx. 3 imágenes)
              </p>
            </div>
          </div>

          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-4 grid grid-cols-3 gap-4"
              >
                {images.map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center">
          <input
            id="isAnonymous"
            name="isAnonymous"
            type="checkbox"
            checked={formik.values.isAnonymous}
            onChange={formik.handleChange}
            className="h-4 w-4 text-app-purple focus:ring-app-purple border-gray-300 rounded"
          />
          <label
            htmlFor="isAnonymous"
            className="ml-2 block text-sm text-gray-700"
          >
            Publicar de forma anónima
          </label>
          {formik.values.isAnonymous && !user?.isAnonymous && (
            <span className="ml-2 text-xs text-gray-500">
              (Se creará automáticamente una cuenta anónima para ti)
            </span>
          )}
          {user?.isAnonymous && (
            <span className="ml-2 text-xs text-gray-500">
              (Estás usando una cuenta anónima)
            </span>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-purple"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !formik.isValid}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-app-purple hover:bg-app-purple/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-purple disabled:opacity-50"
          >
            {isSubmitting ? 'Publicando...' : 'Publicar confesión'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CrearPost;
