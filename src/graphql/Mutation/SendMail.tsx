import { gql } from "@apollo/client";

export const CONTACT_MUTATION = gql`
  mutation Contact(
    $name: String!
    $email: String!
    $phone: String
    $subject: String!
    $message: String!
  ) {
    contact(
      name: $name
      email: $email
      phone: $phone
      subject: $subject
      message: $message
    )
  }
`;

export const SUBSCRIBE_SUBMIT = gql`
  mutation subscribeSubmit(
    $email: String!
  ) {
    subscribeSubmit(
      email: $email
    )
  }
`;