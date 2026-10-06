import { gql } from "@apollo/client";
import {
    POST_DETAIL_FIELDS,
    POST_LIST_ITEM_FIELDS,
} from "@/graphql/Fragments/PostFragments";

export const GET_POST_BY_SLUG = gql`
    query GetPostBySlug($slug: String!) {
        post(slug: $slug) {
            ...PostDetailFields
        }
    }
    ${POST_DETAIL_FIELDS}
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
        ...PostListItemFields
      }
      meta {
        total
        totalPages
        currentPage
      }
    }
  }
  ${POST_LIST_ITEM_FIELDS}
`;


export const GET_POSTS_BY_TAG = gql`
  query GetPostsByTag(
    $page: Int!
    $pageSize: Int!
    $tag: String!
  ) {
    posts(
      page: $page
      pageSize: $pageSize
      tag: $tag
    ) {
      items {
        ...PostListItemFields
      }
      meta {
        total
        totalPages
        currentPage
      }
    }
  }
  ${POST_LIST_ITEM_FIELDS}
`;

export const GET_SITE_STATS = gql`
    query GetSiteStats {
        siteStats {
            totalViews
            totalPosts
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

export const GET_ALL_POST_SLUGS = gql`
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
`;

export const GET_POST_BY_ID = gql`
    query GetPostById($id: Int!) {
        post(id: $id) {
            ...PostDetailFields
        }
    }
    ${POST_DETAIL_FIELDS}
`;
