import { gql } from "@apollo/client";

export const CREATE_POST = gql`
    mutation CreatePost(
        $title: String!
        $description: String!
        $excerpt: String
        $image: String!
        $categoryId: Int!
        $content: String!
        $authorId: Int!
        $tagIds: [Int!]!
    ) {
        createPost(
            title: $title
            description: $description
            excerpt: $excerpt
            image: $image
            content: $content
            categoryId: $categoryId
            authorId: $authorId
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
