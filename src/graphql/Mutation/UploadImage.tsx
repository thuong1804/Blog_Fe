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
  mutation UpdatePostImage($postId: Int!, $image: String!, $publicId: String!) {
    updatePostImage(postId: $postId, image: $image, publicId: $publicId) {
      id
      image
      imagePublicId
    }
  }
`;

export const UPDATE_AVATAR_IMAGE = gql`
  mutation UpdateAvatarUser($userId: Int!, $image: String!, $publicId: String!) {
    updateAvatarUser(userId: $userId, image: $image, publicId: $publicId) {
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
  mutation DeleteAvatar($publicId: String!, $userId: Int!) {
    deleteAvatar(publicId: $publicId, userId: $userId) {
    result
    message
  }
}
`