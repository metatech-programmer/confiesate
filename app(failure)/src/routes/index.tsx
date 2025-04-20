import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '../components/layout/Layout';
import { lazy, Suspense } from 'react';
import { AuthGuard } from '../components/guards/AuthGuard';
import { LoadingSpinner } from '../components/common';
import ErrorPage from '../pages/ErrorPage';
import Profile from '../pages/Profile';

const Home = lazy(() => import('../pages/Home'));
const Login = lazy(() => import('../pages/auth/Login'));
const Register = lazy(() => import('../pages/auth/Register'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AuthGuard>
              <Home />
            </AuthGuard>
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: 'profile',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AuthGuard>
              <Profile />
            </AuthGuard>
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },

      {
        path: 'admin',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <AuthGuard>
              <Home />
            </AuthGuard>
          </Suspense>

        ),
        errorElement: <ErrorPage />,
      },

      {
        path: 'auth',
        children: [
          {
            path: 'login',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AuthGuard requireAuth={false}>
                  <Login />
                </AuthGuard>
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
          {
            path: 'register',
            element: (
              <Suspense fallback={<LoadingSpinner />}>
                <AuthGuard requireAuth={false}>
                  <Register />
                </AuthGuard>
              </Suspense>
            ),
            errorElement: <ErrorPage />,
          },
        ],
      },
    ],
  },
]);