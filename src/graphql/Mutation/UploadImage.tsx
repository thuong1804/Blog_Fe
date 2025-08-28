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
  mutation UpdatePostImage($postId: Int!, $image: String!) {
    updatePostImage(postId: $postId, image: $image) {
      id
      image
    }
  }
`;

export const UPDATE_AVATAR_IMAGE = gql`
  mutation UpdateAvatarUser($userId: Int!, $image: String!) {
    updateAvatarUser(userId: $userId, image: $image) {
      id
      image
    }
  }
`;