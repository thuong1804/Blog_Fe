export type ItemCardBlogProps = {
  id?: number;
  title: string;
  slug: string;
  content: string;
  description?: string;
  excerpt?: string;
  image: string;
  category?: {
    id?: number
    name: string,
    description: string,
    children: {
      id?: number
      name: string,
      description: string
    }
  };
  tags?: { id: number; name: string }[];
  views?: number;
  readingTime?: number;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt?: string;
  author: {
    id?: number;
    name: string;
    email?: string;
  };
  authorId?: number;
  comments?: {
    id: number;
    content: string;
    createdAt: string;
    author: {
      id: number;
      name: string;
      email: string;
    };
  }[];
};
