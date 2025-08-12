import { gql } from "@apollo/client";

export const GET_POST_BY_AUTHOR = gql`
  query userBy($handle: String!) {
   userByPosts(handle: $handle) {
    id,
    name,
    handle,
    email,
    avatar
    posts {
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
        handle
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
        slug
        name,
        parent {
          id
          name
          slug
        }
      }
    }
  }
}
`