import { Skeleton } from './Skeleton';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen p-4 space-y-4">
      <div className="max-w-4xl mx-auto">
        <Skeleton height={200} className="mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={300} />
          ))}
        </div>
      </div>
    </div>
  );
};
