import { gql } from "@apollo/client";

export const GET_TAGS = gql`
  query getTags {
    getTags{
      id
      name
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