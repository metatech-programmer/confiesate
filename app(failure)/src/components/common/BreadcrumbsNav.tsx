import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HomeIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { RootState } from '../../store';

const routeLabels: Record<string, string> = {
  profile: 'Mi Perfil',
  auth: 'Autenticación',
  login: 'Iniciar Sesión',
  register: 'Registro',
  upgrade: 'Actualizar Cuenta',
  publication: 'Confesión',
  admin: 'Administración',
};

const BreadcrumbsNav = () => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const pathnames = location.pathname.split('/').filter(Boolean);

  // Handle special cases for auth routes
  const processedPathnames = pathnames.map((path, index) => {
    // Skip 'auth' in the breadcrumb display for cleaner navigation
    if (path === 'auth') return null;
    
    // Customize label based on user state and path
    if (path === 'register' && location.pathname.includes('auth/upgrade')) {
      return 'upgrade';
    }
    return path;
  }).filter(Boolean) as string[];

  return (
    <nav className="flex items-center text-sm px-4 py-2">
      <Link
        to="/"
        className="text-gray-600 hover:text-app-purple flex items-center"
      >
        <HomeIcon className="h-4 w-4 mr-1" />
        Inicio
      </Link>
      {processedPathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === processedPathnames.length - 1;
        const label = routeLabels[value] || value;

        // Handle special cases for user context
        let displayLabel = label;
        if (value === 'profile' && user?.isAnonymous) {
          displayLabel = 'Perfil Anónimo';
        }

        return (
          <div key={to} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 mx-2 text-gray-400" />
            {isLast ? (
              <span className="text-app-purple font-medium">{displayLabel}</span>
            ) : (
              <Link
                to={to}
                className="text-gray-600 hover:text-app-purple"
              >
                {displayLabel}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default BreadcrumbsNav;