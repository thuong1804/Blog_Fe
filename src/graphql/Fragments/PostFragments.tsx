import { gql } from "@apollo/client";

export const POST_AUTHOR_FIELDS = gql`
    fragment PostAuthorFields on User {
        id
        name
        email
        avatar
        handle
    }
`;

export const POST_CATEGORY_FIELDS = gql`
    fragment PostCategoryFields on Category {
        id
        name
        slug
        parent {
            id
            name
            slug
        }
    }
`;

export const POST_TAG_FIELDS = gql`
    fragment PostTagFields on Tag {
        id
        name
    }
`;

// Card/listing payload (blog list, tag list, author list, popular, latest).
export const POST_LIST_ITEM_FIELDS = gql`
    fragment PostListItemFields on Post {
        id
        title
        slug
        excerpt
        image
        createdAt
        description
        likesCount
        author {
            ...PostAuthorFields
        }
        category {
            name
            parent {
                name
            }
        }
    }
    ${POST_AUTHOR_FIELDS}
`;

// Full detail payload (slug page, edit form, user detail).
export const POST_DETAIL_FIELDS = gql`
    fragment PostDetailFields on Post {
        id
        title
        slug
        content
        description
        excerpt
        image
        imagePublicId
        views
        readingTime
        likesCount
        isFeatured
        isPopular
        createdAt
        updatedAt
        author {
            ...PostAuthorFields
        }
        authorId
        tags {
            ...PostTagFields
        }
        comments {
            id
            content
            createdAt
        }
        category {
            ...PostCategoryFields
        }
    }
    ${POST_AUTHOR_FIELDS}
    ${POST_TAG_FIELDS}
    ${POST_CATEGORY_FIELDS}
`;

// Post payload embedded in category queries.
export const CATEGORY_POST_FIELDS = gql`
    fragment CategoryPostFields on Post {
        id
        title
        excerpt
        image
        description
        slug
        createdAt
        category {
            ...PostCategoryFields
        }
        author {
            id
            name
            avatar
            handle
        }
    }
    ${POST_CATEGORY_FIELDS}
`;
