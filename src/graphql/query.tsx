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
        }
      }
      children {
        id
        name
        description
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
        }
      }
    }
  }
`
