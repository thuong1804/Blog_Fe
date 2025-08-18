import { gql } from "@apollo/client";

export const GET_POST_BY_TITLE = gql`
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
      name
      parent {
        id
        name
      }
    }
  }
}
`

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
        handle
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
        handle
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