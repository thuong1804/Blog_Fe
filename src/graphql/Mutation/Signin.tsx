import { gql } from "@apollo/client";

export const SIGNIN_WITH_GOOGLE = gql`
  mutation SigninWithGoogle($idToken: String!) {
    signinWithGoogle(idToken: $idToken) {
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

export const SIGNIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
        handle
        avatar
      }
    }
  }
`

