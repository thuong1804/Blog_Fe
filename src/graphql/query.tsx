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
        name,
        description,
        children {
          id
          name
          description
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