import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';

const ErrorPage = () => {
  const error = useRouteError();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-app-purple">
          {isRouteErrorResponse(error) ? error.status : '500'}
        </h1>
        <p className="text-xl text-gray-600">
          {isRouteErrorResponse(error)
            ? error.statusText
            : 'Ha ocurrido un error inesperado'}
        </p>
        <div className="space-y-4">
          <p className="text-gray-500">
            {isRouteErrorResponse(error) && error.data?.message}
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-app-purple text-white rounded-md hover:bg-app-purple/90"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
