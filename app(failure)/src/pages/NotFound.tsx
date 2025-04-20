import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-app-purple/5">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-app-purple">404</h1>
        <h2 className="text-2xl font-semibold text-app-bluePurple mt-4">
          Página no encontrada
        </h2>
        <p className="text-gray-600 mt-4">
          La página que buscas no existe o ha sido movida.
        </p>
        <Link
          to="/"
          className="inline-block mt-8 px-6 py-3 text-white bg-app-purple rounded-lg hover:bg-app-purple/90 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFound;