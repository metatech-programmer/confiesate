import { Outlet } from 'react-router-dom';
import { Menu } from '../Menu';
import { Suspense } from 'react';
import { LoadingSpinner } from '../common';
import Footer from '../Footer';

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Menu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};