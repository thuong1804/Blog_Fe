import { gql } from "@apollo/client";

export const CHANGE_PASSWORD = gql`
    mutation ChangePassword($email: String!, $password: String!) {
        changePassword(id: $id, password: $password) {
            success
            message
        }
    }
`;

export const VALIDATE_PASSWORD = gql`
    mutation ValidatePassword($email: String!, $password: String!) {
        validatePassword(id: $id, password: $password) {
            success
            message
        }
    }
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken($refreshToken: String!) {
        refreshToken(refreshToken: $refreshToken) {
            token
            refreshToken
            user {
                id
                email
                name
            }
        }
    }
`;

export const SEND_OTP = gql`
    mutation SendOTP($email: String!) {
        sendOTP(email: $email) {
            success
            message
            expiresAt
        }
    }
`;

export const VERIFY_OTP = gql`
    mutation verifyOTP($email: String!, $code: String!) {
        verifyOTP(email: $email, code: $code) {
            success
            message
            resetToken
        }
    }
`;

export const RESET_PASSWORD = gql`
    mutation ResetPassword($token: String!, $newPassword: String!) {
        resetPassword(token: $token, newPassword: $newPassword) {
            success
            message
        }
    }
`;
