import { gql } from "@apollo/client";

const COMMENT_FIELDS = `
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
`;

export const GET_COMMENTS = gql`
    query GetComments($postId: Int!, $sort: CommentSort) {
        comments(postId: $postId, sort: $sort) {
            ${COMMENT_FIELDS}
            replies {
                ${COMMENT_FIELDS}
                replies {
                    ${COMMENT_FIELDS}
                }
            }
        }
    }
`;
