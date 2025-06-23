import { gql } from "@apollo/client";

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    posts {
      id
      title
      slug
      content
      description
      excerpt
      image
      category {
        id
        name
        parent {
          id
          name
        }
      }
      tags {
        id
        name
      }
      views
      readingTime
      isFeatured
      createdAt
      updatedAt
      author {
        id
        name
        email
        avatar
      }
      authorId
      comments {
        id
        content
        createdAt
      }
    }
  }
`;

export const GET_ALL_POST_POPULAR = gql`
  query GetPostPopular {
    popularPosts {
      id
      title
      slug
      content
      description
      excerpt
      image
      category {
        id
        name
        parent {
          id
          name
        }
      }
      tags {
        id
        name
      }
      views
      readingTime
      isFeatured
      createdAt
      updatedAt
      author {
        id
        name
        email
        avatar
      }
      authorId
      comments {
        id
        content
        createdAt
      }
    }
  }
`;


export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: String!) {
  post(slug: $slug) {
    id
    title
    slug
    content
    description
    excerpt
    image
    views
    readingTime
    isFeatured
    createdAt
    updatedAt
    author {
      id
      name
      email
      avatar
    }
    authorId
    tags {
      id
      name
    }
    comments {
      id
      content
      createdAt
    }
    category {
      id
      name
      parent {
        id
        name
      }
    }
  }
}
`

export const GET_ALL_CATEGORIES = gql`
  query Categories {
    categories {
      id
      name
      description
      slug
      posts {
        id
        title
        slug
        description
        image
        content
        createdAt
        category {
          id
          name
          description
        }
        author {
          id
          name
          email
          avatar
        }
      }
      children {
        id
        name
        description
        slug
        posts {
          id
          title
          excerpt
          image
          description
          category {
            id
            slug
            name,
            parent {
              id
              name
              slug
            }
          }
          slug
          createdAt
          author {
            name
            avatar
          }
        }
      }
    }
  }
`;

export const GET_ALL_POSTS_BY_CATEGORY = gql`
  query GetCategoryWithPosts($slug: String!) {
    category(slug: $slug) {
      id
      name
      slug
      description
      parent {
        id
        name
        slug
        description
      }
      children {
        id
        name
        description
        posts {
          id
          title
          excerpt
          image
          description
          category {
            id
            slug
            name,
            parent {
              id
              name
              slug
            }
          }
          slug
          createdAt
          author {
            name
            avatar
          }
        }
      }
      posts {
        id
        title
        excerpt
        image
        description
        slug
        createdAt
        category {
            id
            slug
            name,
          parent {
              id
              name
              slug
            }
          }
        author {
          name
          avatar
        }
      }
    }
  }
`

export const GET_POST_BY_TITLE = gql `
  query GetPostByTitle($search: String!) {
    postsByTitle(search: $search) {
      id
      title
      slug
      content
      description
      excerpt
      image
      views
      readingTime
      isFeatured
      createdAt
      updatedAt
      author {
        id
        name
        email
        avatar
      }
      authorId
      tags {
        id
        name
      }
      comments {
        id
        content
        createdAt
      }
      category {
        id
        name
        parent {
          id
          name
        }
      }
    }
}
`
