import { gql } from "@apollo/client";

export const UPDATE_USER_DETAIL = gql`
    mutation UpdateUserDetail(
        $name: String
        $avatar: String
        $description: String
        $handle: String
    ) {
        updateUserDetail(
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
