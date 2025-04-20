import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../features/auth/authSlice';
import { toast } from 'react-hot-toast';

const registerSchema = Yup.object().shape({
  name: Yup.string().required('Nombre requerido'),
  email: Yup.string().email('Email inválido').required('Email requerido'),
  password: Yup.string().min(6, 'Mínimo 6 caracteres').required('Contraseña requerida'),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        const response = await api.post('/auth/register', values);
        dispatch(loginSuccess(response.data));
        toast.success('Registro exitoso');
        navigate('/');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Error al registrarse');
      }
    },
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-app-purple">Registro</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Nombre"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className="w-full px-3 py-2 border rounded-md focus:ring-app-purple focus:border-app-purple"
            />
            {formik.touched.name && formik.errors.name && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.name}</p>
            )}
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className="w-full px-3 py-2 border rounded-md focus:ring-app-purple focus:border-app-purple"
            />
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
            )}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className="w-full px-3 py-2 border rounded-md focus:ring-app-purple focus:border-app-purple"
            />
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-sm text-red-500">{formik.errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-app-purple text-white rounded-md hover:bg-app-purple/90"
          >
            Registrarse
          </button>
        </form>
        <p className="text-center text-gray-600">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/auth/login" className="text-app-purple hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;