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

