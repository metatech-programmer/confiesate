import { useInfiniteQuery as useRQInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';
import { api } from '../services/api';

interface UseInfiniteQueryOptions {
  endpoint: string;
  queryKey: string[];
  pageSize?: number;
  filters?: Record<string, any>;
  enabled?: boolean;
}

export function useInfiniteQuery<T>({
  endpoint,
  queryKey,
  pageSize = 10,
  filters = {},
  enabled = true
}: UseInfiniteQueryOptions) {
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch
  } = useRQInfiniteQuery({
    queryKey: [...queryKey, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams({
        ...filters,
        page: String(pageParam),
        limit: String(pageSize)
      });
      
      const response = await api.get(`${endpoint}?${params}`);
      return response.data;
    },
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextPage : undefined;
    },
    enabled
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const items = data?.pages.flatMap(page => page.items) ?? [];

  return {
    items,
    error,
    isLoading,
    hasMore: hasNextPage,
    loadMoreRef: ref,
    refetch
  };
}
