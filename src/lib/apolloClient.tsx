import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function createApolloClient({ isServer = false } = {}) {
    return new ApolloClient({
        ssrMode: isServer,
        link: new HttpLink({
            uri: `${process.env.NEXT_PUBLIC_URL_API}`,
            // Send httpOnly auth cookies to the API on both server & client.
            // Without this, authenticated mutations go out unauthenticated.
            credentials: "include",
        }),
        cache: new InMemoryCache(),
    });
}
