type CategoryProps = {
  id?: number
  name: string,
  description: string,
  parent: {
    id: string,
    name: string,
    description: string,
  },
  children: {
    id?: number
    name: string,
    description: string
  }
}

export type ItemCardBlogProps = {
  id?: number;
  title: string;
  slug: string;
  content?: string;
  description?: string;
  excerpt?: string;
  image: string;
  category?: CategoryProps,
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
    avatar?: string;
    handle?: string,
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


export type BlogCategoryProps = {
  title: string,
  category?: CategoryProps,
  author: {
    id: string,
    name: string,
    email: string,
    avatar: string,
  },
  createdAt: string,
  updatedAt: string,
  views: number,
  content: string,
  image: string,
  tags: {
    id: string,
    name: string,
  }[],
  data: ItemCardBlogProps[],
}

export type CategorySlug = {
  parent?: string
  children?: string
  slug: string
}

export type PageProps = {
  params: {
    parent: string;
    children: string;
    slug: string;
  };
};

