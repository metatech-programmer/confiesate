import { useSelector, useDispatch } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNotifications } from '../context/NotificationsContext';
import { updateNotificationPreferences, updateUser } from '../features/auth/authSlice';
import { api, isAnonymousUser, handleApiError } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

interface ProfileFormValues {
  name: string;
  email: string;
}

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido'),
  email: Yup.string().email('Email inválido').required('Email requerido'),
});

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);
  const { isPushSupported, isEnabled, enableNotifications, disableNotifications } = useNotifications();

  const handleNotificationToggle = async (setting: string, enabled: boolean) => {
    if (isAnonymousUser()) {
      toast.error('Las cuentas anónimas no pueden modificar sus preferencias de notificación');
      return;
    }

    try {
      const newPreferences = {
        ...user.notificationPreferences,
        [setting]: enabled,
      };

      await api.put('/users/notification-preferences', newPreferences);
      dispatch(updateNotificationPreferences(newPreferences));
      toast.success('Preferencias actualizadas');
    } catch (error) {
      toast.error(handleApiError(error));
    }
  };

  const handlePushNotifications = async () => {
    if (isAnonymousUser()) {
      toast.error('Las cuentas anónimas no pueden activar notificaciones push');
      return;
    }

    try {
      if (isEnabled) {
        await disableNotifications();
        toast.success('Notificaciones push desactivadas');
      } else {
        await enableNotifications();
        toast.success('Notificaciones push activadas');
      }
    } catch (error) {
      toast.error('Error al cambiar notificaciones push');
    }
  };

  if (!user) return null;

  // Show message for anonymous users
  if (isAnonymousUser()) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Cuenta Anónima</h1>
          <p className="text-gray-600 mb-6">
            Estás usando una cuenta anónima. Para acceder a todas las funcionalidades,
            necesitas crear una cuenta regular.
          </p>
          <div className="space-x-4">
            <Link
              to="/auth/register"
              className="inline-block bg-app-purple text-white px-6 py-2 rounded-md hover:bg-app-purple/90"
            >
              Crear Cuenta
            </Link>
            <Link
              to="/auth/login"
              className="inline-block border border-app-purple text-app-purple px-6 py-2 rounded-md hover:bg-app-purple/10"
            >
              Iniciar Sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Perfil</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
        <Formik<ProfileFormValues>
          initialValues={{
            name: user.name,
            email: user.email,
          }}
          validationSchema={profileSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await api.put('/users/profile', values);
              dispatch(updateUser(response.data));
              toast.success('Perfil actualizado');
            } catch (error) {
              toast.error(handleApiError(error));
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <Field
                  name="name"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-purple focus:ring-app-purple"
                />
                {errors.name && touched.name && (
                  <div className="text-red-600 text-sm mt-1">{errors.name as string}</div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <Field
                  name="email"
                  type="email"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-app-purple focus:ring-app-purple"
                />
                {errors.email && touched.email && (
                  <div className="text-red-600 text-sm mt-1">{errors.email as string}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-app-purple text-white px-4 py-2 rounded-md hover:bg-app-purple/90 disabled:opacity-50"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </Form>
          )}
        </Formik>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Notificaciones</h2>
        
        {isPushSupported && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Notificaciones Push</h3>
                <p className="text-sm text-gray-500">
                  Recibe notificaciones incluso cuando no estés en el sitio
                </p>
              </div>
              <button
                onClick={handlePushNotifications}
                className={`px-4 py-2 rounded-md ${
                  isEnabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-app-purple hover:bg-app-purple/90 text-white'
                }`}
              >
                {isEnabled ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Comentarios</h3>
              <p className="text-sm text-gray-500">
                Notificaciones cuando alguien comenta en tus confesiones
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={user.notificationPreferences.comments}
                onChange={(e) => handleNotificationToggle('comments', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-app-purple/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-app-purple"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Me gusta</h3>
              <p className="text-sm text-gray-500">
                Notificaciones cuando alguien le da me gusta a tus confesiones
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={user.notificationPreferences.likes}
                onChange={(e) => handleNotificationToggle('likes', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-app-purple/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-app-purple"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Menciones</h3>
              <p className="text-sm text-gray-500">
                Notificaciones cuando alguien te menciona en una confesión
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={user.notificationPreferences.mentions}
                onChange={(e) => handleNotificationToggle('mentions', e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-app-purple/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-app-purple"></div>
            </label>
          </div>

          {user.role === 'moderator' && (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Moderación</h3>
                <p className="text-sm text-gray-500">
                  Notificaciones sobre confesiones que requieren moderación
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={user.notificationPreferences.moderation}
                  onChange={(e) => handleNotificationToggle('moderation', e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-app-purple/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-app-purple"></div>
              </label>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;