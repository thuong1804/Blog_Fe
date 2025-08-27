import { gql } from "@apollo/client";

export const SIGNUP = gql`
  mutation Signup($email: String!, $password: String!, $name: String, $handle: String) {
    signup(email: $email, password: $password, name: $name, handle: $handle) {
      user {
        id
        email
        name
        handle
      }
      token
    }
  }
`;

