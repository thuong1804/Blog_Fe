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
`;

export const GET_ALL_POST_POPULAR = gql`
    query GetPostPopular {
        popularPosts {
            id
            title
            slug
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
            createdAt
            updatedAt
            author {
                id
                name
                email
                handle
                avatar
            }
        }
    }
`;

export const GET_ALL_POSTS = gql`
  query GetAllPosts(
    $page: Int!
    $pageSize: Int!
    $categorySlug: String
    $search: String
  ) {
    posts(
      page: $page
      pageSize: $pageSize
      categorySlug: $categorySlug
      search: $search
    ) {
      items {
        id
        title
        slug
        excerpt
        image
        createdAt
        author {
            id
            name
            email
            avatar
            handle
        }
        category {
          name
          parent {
            name
          }
        }
      }
      meta {
        total
        totalPages
        currentPage
      }
    }
  }
`;


export const GET_LATEST_POSTS = gql`
    query GetLatestPosts($skip: Int, $take: Int) {
        postsLatest(skip: $skip, take: $take) {
            id
            title
            slug
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
            views
            readingTime
            createdAt
            updatedAt
            author {
                id
                name
                email
                avatar
                handle
            }
        }
    }
`;

export const GET_ALL_POST_SLUGS = gql `
    query PostAllSlugs {
        postAllSlugs {
            slug
            category {
            slug
            parent {
                slug
            }
        }
    }
}
`
