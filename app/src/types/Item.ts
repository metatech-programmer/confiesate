export interface Item {
  id: number;
  author?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  likes?: number;
  createdAt?: string;
  comments?: {
    author?: string;
    text?: string;
  }[];
  reports?: number;
}

export const transformToItem = (publication: any): Item => {
  return {
    id: publication.id,
    author: publication.user?.name || 'Anónimo',
    title: publication.title || '',
    description: publication.content, // El contenido desencriptado
    imageUrl: publication.image_url || '',
    likes: publication.Like?.length || 0,
    createdAt: publication.created_at.toISOString(),
    comments: publication.Comment?.map((comment: any) => ({
      author: comment.user?.name || 'Anónimo',
      text: comment.comment_content // El contenido desencriptado
    })) || [],
    reports: publication.reports?.length || 0
  };
};