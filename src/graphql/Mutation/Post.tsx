import { gql } from "@apollo/client";

export const CREATE_POST = gql`
    mutation CreatePost(
        $title: String!
        $description: String!
        $excerpt: String
        $image: String!
        $categoryId: Int!
        $content: String!
        $tagIds: [Int!]!
    ) {
        createPost(
            title: $title
            description: $description
            excerpt: $excerpt
            image: $image
            content: $content
            categoryId: $categoryId
            tagIds: $tagIds
        ) {
            id
            title
            slug
            description
            excerpt
            image
            tags {
                id
                name
            }
            category {
                id
                name
            }
            author {
                id
                name
            }
        }
    }
`;

export const DELETE_POST = gql`
    mutation DeletePost($postId: Int!) {
        deletePost(postId: $postId) {
            success
            message
        }
    }
`;

export const INCREMENT_POST_VIEWS = gql`
    mutation IncrementPostViews($postId: Int!) {
        incrementPostViews(postId: $postId)
    }
`;

export const UPDATE_POST = gql`
    mutation UpdatePost(
        $id: Int!
        $title: String
        $content: String
        $description: String
        $excerpt: String
        $image: String
        $imagePublicId: String
        $categoryId: Int
        $tagIds: [Int!]
        $isPopular: Boolean
        $isFeatured: Boolean
        $readingTime: Int
        $slug: String
    ) {
        updatePost(
            id: $id
            title: $title
            content: $content
            description: $description
            excerpt: $excerpt
            image: $image
            imagePublicId: $imagePublicId
            categoryId: $categoryId
            tagIds: $tagIds
            isPopular: $isPopular
            isFeatured: $isFeatured
            readingTime: $readingTime
            slug: $slug
        ) {
            id
            title
            slug
            description
            excerpt
            content
            image
            readingTime
            isPopular
            isFeatured
            tags {
                id
                name
            }
            category {
                id
                name
                parent {
                    id
                    name
                }
            }
            author {
                id
                name
                handle
                avatar
            }
        }
    }
`;
