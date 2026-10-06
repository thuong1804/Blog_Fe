import { gql } from "@apollo/client";

export const GET_UPLOAD_SIGNATURE = gql`
    mutation GetUploadSignature($folder: String) {
        getUploadSignature(folder: $folder) {
            apiKey
            cloudName
            timestamp
            signature
            folder
        }
    }
`;

export const UPDATE_POST_IMAGE = gql`
    mutation UpdatePostImage(
        $postId: Int!
        $image: String!
        $publicId: String!
    ) {
        updatePostImage(postId: $postId, image: $image, publicId: $publicId) {
            id
            image
            imagePublicId
        }
    }
`;

export const UPDATE_AVATAR_IMAGE = gql`
    mutation UpdateAvatarUser(
        $image: String!
        $publicId: String!
    ) {
        updateAvatarUser(image: $image, publicId: $publicId) {
            result
            user {
                id
                avatar
                avatarPublicId
            }
        }
    }
`;

export const DELETE_AVATAR_IMAGE = gql`
    mutation DeleteAvatar($publicId: String!) {
        deleteAvatar(publicId: $publicId) {
            result
            message
        }
    }
`;
