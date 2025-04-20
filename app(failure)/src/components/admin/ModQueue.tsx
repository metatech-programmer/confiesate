import { useState, useEffect } from 'react';
import { useWebSocket } from '../../hooks/useWebSocket';
import { api } from '../../services/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import Loading from '../Loading';
import { Item } from '../../types/Item';

const ModQueue = () => {
  const [flaggedPosts, setFlaggedPosts] = useState<Item[]>([]);
  
  const { data: initialPosts, isLoading } = useQuery({
    queryKey: ['moderation-queue'],
    queryFn: async () => {
      const response = await api.get('/v1/publications', {
        params: { status: 'flagged' }
      });
      return response.data;
    },
  });

  useWebSocket({
    onNewReport: (event) => {
      // If this post is already in our queue, update its report count
      setFlaggedPosts(prev => {
        const existingPost = prev.find(p => p.id === event.publicationId);
        if (existingPost) {
          return prev.map(p => 
            p.id === event.publicationId 
              ? { ...p, reports: p.reports + 1 }
              : p
          );
        }
        return prev;
      });
    },
    onStatusChanged: (event) => {
      if (event.data.status === 'flagged') {
        // Add the newly flagged post to our queue
        const newPost = event.data;
        setFlaggedPosts(prev => [newPost, ...prev]);
        toast.warning('Nueva publicación marcada para revisión', {
          icon: '⚠️',
        });
      }
    },
  });

  useEffect(() => {
    if (initialPosts?.data) {
      setFlaggedPosts(initialPosts.data);
    }
  }, [initialPosts]);

  const handleModeration = async (postId: string, action: 'approve' | 'remove') => {
    try {
      const status = action === 'approve' ? 'active' : 'removed';
      await api.patch(`/v1/publications/${postId}/status`, { status });
      
      setFlaggedPosts(prev => prev.filter(post => post.id !== postId));
      
      toast.success(action === 'approve' 
        ? 'Publicación aprobada y restaurada' 
        : 'Publicación removida permanentemente'
      );
    } catch (error) {
      toast.error('Error al moderar la publicación');
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Cola de Moderación</h2>
      <p className="text-sm text-gray-600">
        Las publicaciones con 20 o más reportes son automáticamente marcadas para revisión
      </p>
      
      {flaggedPosts.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No hay publicaciones marcadas para revisión
        </p>
      ) : (
        <div className="grid gap-4">
          {flaggedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow p-4 space-y-4 border-l-4 border-yellow-400"
            >
              <div className="flex justify-between items-start">
                <div className="text-gray-800">{post.content}</div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  {post.reports} reportes
                </span>
              </div>
              
              <div className="text-sm text-gray-500">
                Creado: {new Date(post.createdAt).toLocaleString()}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleModeration(post.id, 'remove')}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Remover
                </button>
                <button
                  onClick={() => handleModeration(post.id, 'approve')}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Aprobar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ModQueue;