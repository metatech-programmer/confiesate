import { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useSearchParams } from 'react-router-dom';
import { analytics } from '../../utils/analytics';
import { PostCategory, PostStatus } from '../../types/Item';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
}

export interface SearchFilters {
  query: string;
  sortBy: 'recent' | 'popular' | 'controversial';
  timeRange: '24h' | '7d' | '30d' | 'all';
  category: PostCategory | 'all';
  status: PostStatus | 'all';
}

const categoryLabels: Record<PostCategory | 'all', string> = {
  all: 'Todas las categorías',
  general: 'General',
  academic: 'Académico',
  social: 'Social',
  love: 'Amor',
  other: 'Otros'
};

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = user?.role === 'admin';

  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    sortBy: (searchParams.get('sort') as SearchFilters['sortBy']) || 'recent',
    timeRange: (searchParams.get('time') as SearchFilters['timeRange']) || 'all',
    category: (searchParams.get('category') as PostCategory | 'all') || 'all',
    status: (searchParams.get('status') as PostStatus | 'all') || 'active'
  });

  const debouncedSearch = useCallback(
    debounce((newFilters: SearchFilters) => {
      onSearch(newFilters);
      analytics.trackEvent({
        category: 'Search',
        action: 'FilterChange',
        metadata: newFilters,
      });
    }, 300),
    [onSearch]
  );

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.query) params.set('q', filters.query);
    if (filters.sortBy !== 'recent') params.set('sort', filters.sortBy);
    if (filters.timeRange !== 'all') params.set('time', filters.timeRange);
    if (filters.category !== 'all') params.set('category', filters.category);
    if (filters.status !== 'active') params.set('status', filters.status);
    setSearchParams(params, { replace: true });
    debouncedSearch(filters);
  }, [filters, setSearchParams, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({ ...prev, query: e.target.value }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, sortBy: e.target.value as SearchFilters['sortBy'] }));
  };

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, timeRange: e.target.value as SearchFilters['timeRange'] }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, category: e.target.value as PostCategory | 'all' }));
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, status: e.target.value as PostStatus | 'all' }));
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-6">
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={filters.query}
            onChange={handleInputChange}
            placeholder="Buscar confesiones..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filters.sortBy}
            onChange={handleSortChange}
            className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent"
          >
            <option value="recent">Más recientes</option>
            <option value="popular">Más populares</option>
            <option value="controversial">Controversiales</option>
          </select>

          <select
            value={filters.timeRange}
            onChange={handleTimeRangeChange}
            className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent"
          >
            <option value="24h">Últimas 24 horas</option>
            <option value="7d">Última semana</option>
            <option value="30d">Último mes</option>
            <option value="all">Todo el tiempo</option>
          </select>

          <select
            value={filters.category}
            onChange={handleCategoryChange}
            className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent"
          >
            {Object.entries(categoryLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          {isAdmin && (
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-app-purple focus:border-transparent"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="flagged">Marcadas</option>
              <option value="removed">Removidas</option>
            </select>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;