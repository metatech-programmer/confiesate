import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import { Item } from '../types/Item';
import { ErrorMessage, LoadingSpinner } from '../components/common';
import { Suspense } from 'react';

const Home = () => {
  const { data: confessions, isLoading, error } = useQuery<Item[]>({
    queryKey: ['confessions'],
    queryFn: async () => {
      const response = await api.get('/publications');
      return response.data.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Error loading confessions" />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {confessions?.map((confession) => (
          <div key={confession.id} className="bg-white p-4 rounded-lg shadow">
            <p>{confession.content}</p>
          </div>
        ))}
      </div>
    </Suspense>
  );
};

export default Home;