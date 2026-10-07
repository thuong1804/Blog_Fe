import { gql } from "@apollo/client";

export const CREATE_COMMENT = gql`
    mutation CreateComment(
        $postId: Int!
        $content: String!
        $parentId: Int
    ) {
        createComment(
            postId: $postId
            content: $content
            parentId: $parentId
        ) {
            id
            content
            postId
            authorId
            parentId
            score
            myVote
            repliesCount
            createdAt
            author {
                id
                name
                handle
                avatar
            }
        }
    }
`;

export const UPDATE_COMMENT = gql`
    mutation UpdateComment($id: Int!, $content: String!) {
        updateComment(id: $id, content: $content) {
            id
            content
        }
    }
`;

export const DELETE_COMMENT = gql`
    mutation DeleteComment($id: Int!) {
        deleteComment(id: $id)
    }
`;

export const VOTE_COMMENT = gql`
    mutation VoteComment($commentId: Int!, $value: Int!) {
        voteComment(commentId: $commentId, value: $value) {
            score
            myVote
        }
    }
`;
