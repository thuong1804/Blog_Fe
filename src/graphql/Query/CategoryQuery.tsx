import { gql } from "@apollo/client";

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
          handle
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

