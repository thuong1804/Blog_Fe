import { gql } from "@apollo/client";

export const UPDATE_USER_DETAIL = gql`
  mutation UpdateUserDetail(
    $id: Int!
    $name: String
    $avatar: String
    $description: String
    $handle: String
  ) {
    updateUserDetail(
      id: $id
      name: $name
      avatar: $avatar
      description: $description
      handle: $handle
    ) {
      id
      name
      avatar
      description
      handle
    }
  }
`;


export const CHANGE_PASSWORD = gql`
  mutation ChangePassword($id: Int!, $password: String!) {
    changePassword(id: $id, password: $password) {
      success
      message
    }
  }
`;

export const VALIDATE_PASSWORD = gql`
  mutation ValidatePassword($id: Int!, $password: String!) {
    validatePassword(id: $id, password: $password) {
      success
      message
    }
  }
`;

