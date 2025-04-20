import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbsProps {
  items?: Array<{
    label: string;
    path?: string;
  }>;
}

export const Breadcrumbs = ({ items = [] }: BreadcrumbsProps) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = items.length > 0 ? items : pathSegments.map((segment, index) => ({
    label: segment.charAt(0).toUpperCase() + segment.slice(1),
    path: `/${pathSegments.slice(0, index + 1).join('/')}`
  }));

  return (
    <nav aria-label="breadcrumb" className="py-2">
      <ol className="flex space-x-2 text-sm">
        <li>
          <Link to="/" className="text-app-purple hover:text-app-purple/80">
            Inicio
          </Link>
        </li>
        {breadcrumbs.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span className="text-gray-500">/</span>
            {item.path && index < breadcrumbs.length - 1 ? (
              <Link to={item.path} className="text-app-purple hover:text-app-purple/80">
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
