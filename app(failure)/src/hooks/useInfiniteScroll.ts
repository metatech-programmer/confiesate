import { useCallback, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollOptions {
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  threshold?: number;
}

export const useInfiniteScroll = ({
  loading,
  hasMore,
  onLoadMore,
  threshold = 0.5,
}: UseInfiniteScrollOptions) => {
  const loadingRef = useRef(loading);

  const { ref, inView } = useInView({
    threshold,
    onChange: (inView) => {
      if (inView && !loadingRef.current && hasMore) {
        onLoadMore();
      }
    },
  });

  const containerRef = useCallback(
    (node: Element | null) => {
      if (node) {
        ref(node);
        loadingRef.current = loading;
      }
    },
    [ref, loading]
  );

  return { containerRef };
};