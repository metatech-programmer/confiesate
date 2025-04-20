import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../features/auth/authSlice';
import { Fragment } from 'react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { isAnonymousUser } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/auth/login');
  };

  return (
    <nav className="bg-white shadow-lg" aria-label="Navegación principal">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <img
                className="h-8 w-auto"
                src="/icon.svg"
                alt="Confesiones USTA"
              />
              <span className="ml-2 text-xl font-bold text-app-purple">
                Confesiones USTA
              </span>
            </Link>
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="ml-4 flex items-center md:ml-6">
                {isAnonymousUser() && (
                  <Link
                    to="/auth/register"
                    className="mr-4 text-sm text-app-purple hover:text-app-purple/80 transition-colors"
                  >
                    ¡Crea una cuenta permanente!
                  </Link>
                )}
                <HeadlessMenu as="div" className="ml-3 relative">
                  <div>
                    <HeadlessMenu.Button className="max-w-xs bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-app-purple">
                      <span className="sr-only">Abrir menú de usuario</span>
                      <div className={`h-8 w-8 rounded-full ${isAnonymousUser() ? 'bg-gray-400' : 'bg-app-purple'} text-white flex items-center justify-center relative`}>
                        {user?.name?.charAt(0).toUpperCase()}
                        {isAnonymousUser() && (
                          <span className="absolute -top-1 -right-1 h-3 w-3 bg-gray-500 border-2 border-white rounded-full" title="Usuario anónimo"></span>
                        )}
                      </div>
                    </HeadlessMenu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <HeadlessMenu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {isAnonymousUser() ? (
                        <>
                          <div className="px-4 py-2 text-xs text-gray-500 border-b">
                            Usuario Anónimo
                          </div>
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <Link
                                to="/auth/register"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-app-purple font-medium`}
                              >
                                Crear cuenta permanente
                              </Link>
                            )}
                          </HeadlessMenu.Item>
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <Link
                                to="/auth/login"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Iniciar sesión con otra cuenta
                              </Link>
                            )}
                          </HeadlessMenu.Item>
                        </>
                      ) : (
                        <>
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Mi Perfil
                              </Link>
                            )}
                          </HeadlessMenu.Item>
                          {user?.role === 'moderator' && (
                            <HeadlessMenu.Item>
                              {({ active }) => (
                                <Link
                                  to="/admin/dashboard"
                                  className={`${
                                    active ? 'bg-gray-100' : ''
                                  } block px-4 py-2 text-sm text-gray-700`}
                                >
                                  Panel de Moderación
                                </Link>
                              )}
                            </HeadlessMenu.Item>
                          )}
                        </>
                      )}
                      <HeadlessMenu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? 'bg-gray-100' : ''
                            } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                          >
                            Cerrar sesión
                          </button>
                        )}
                      </HeadlessMenu.Item>
                    </HeadlessMenu.Items>
                  </Transition>
                </HeadlessMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/auth/login"
                  className={`text-gray-700 hover:text-app-purple px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/auth/login' ? 'text-app-purple' : ''
                  }`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/auth/register"
                  className="bg-app-purple text-white hover:bg-app-purple/90 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
