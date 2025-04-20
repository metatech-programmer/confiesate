import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../services/api';
import { performanceMonitor } from '../../utils/performanceMonitoring';
import { getErrorLog } from '../../utils/errorTracking';
import { Line, Bar } from 'react-chartjs-2';
import Loading from '../../components/Loading';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState('24h');
  const [activeTab, setActiveTab] = useState('overview');

  const { data: analyticsData, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['analytics', timeRange],
    queryFn: () => api.get(`/v1/analytics?timeRange=${timeRange}`),
  });

  const { data: performanceData } = useQuery({
    queryKey: ['performance'],
    queryFn: () => ({
      data: performanceMonitor.getMetrics(),
    }),
  });

  const { data: errorData } = useQuery({
    queryKey: ['errors'],
    queryFn: () => ({
      data: getErrorLog(),
    }),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitoreo y análisis de la plataforma
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-app-purple text-app-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Vista General
          </button>
          <button
            onClick={() => setActiveTab('performance')}
            className={`${
              activeTab === 'performance'
                ? 'border-app-purple text-app-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Performance
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`${
              activeTab === 'errors'
                ? 'border-app-purple text-app-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
          >
            Errores
          </button>
        </nav>
      </div>

      {/* Time range selector */}
      <div className="mb-8">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-app-purple focus:border-app-purple sm:text-sm rounded-md"
        >
          <option value="24h">Últimas 24 horas</option>
          <option value="7d">Últimos 7 días</option>
          <option value="30d">Últimos 30 días</option>
        </select>
      </div>

      {isLoadingAnalytics ? (
        <Loading />
      ) : (
        <div className="space-y-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Stats cards */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Usuarios Activos</h3>
                <p className="mt-2 text-3xl font-semibold text-app-purple">
                  {analyticsData?.data.activeUsers || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Nuevas Publicaciones</h3>
                <p className="mt-2 text-3xl font-semibold text-app-purple">
                  {analyticsData?.data.newPosts || 0}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900">Interacciones</h3>
                <p className="mt-2 text-3xl font-semibold text-app-purple">
                  {analyticsData?.data.interactions || 0}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'performance' && performanceData?.data && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Métricas de Performance</h3>
              {/* Add performance charts here */}
            </div>
          )}

          {activeTab === 'errors' && errorData?.data && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Log de Errores</h3>
              <div className="space-y-4">
                {errorData.data.map((error: any, index: number) => (
                  <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error.message}</h3>
                        {error.stack && (
                          <div className="mt-2 text-sm text-red-700">
                            <pre className="whitespace-pre-wrap">{error.stack}</pre>
                          </div>
                        )}
                        <div className="mt-1 text-xs text-red-500">
                          {new Date(error.metadata?.timestamp).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;