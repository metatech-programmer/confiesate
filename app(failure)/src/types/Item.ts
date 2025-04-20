export type PostCategory = 'general' | 'academic' | 'social' | 'love' | 'other';
export type PostStatus = 'active' | 'flagged' | 'removed';

export interface Item {
  id: string;
  content: string;
  createdAt: string;
  userId?: string;
  author?: string;
  anonymous: boolean;
  likes: number;
  hasLiked?: boolean;
  comments: Comment[];
  tags?: string[];
  status: PostStatus;
  reports: number;
  category: PostCategory;
  imageUrls?: string[];
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  userName?: string;
  isAnonymous?: boolean;
}

export const transformToItem = (publication: any): Item => {
  return {
    id: publication.id,
    content: publication.content,
    createdAt: publication.created_at.toISOString(),
    userId: publication.user?.id,
    author: publication.user?.name,
    anonymous: !publication.user,
    likes: publication.Like?.length || 0,
    hasLiked: publication.hasLiked || false,
    comments: publication.Comment?.map((comment: any) => ({
      id: comment.id,
      content: comment.comment_content,
      createdAt: comment.created_at.toISOString(),
      userId: comment.user?.id,
      userName: comment.user?.name,
      isAnonymous: comment.user?.isAnonymous || false
    })) || [],
    tags: publication.tags || [],
    status: publication.status || 'active',
    reports: publication.reports?.length || 0,
    category: publication.category || 'general',
    imageUrls: publication.image_urls || []
  };
};