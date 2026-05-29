import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

export function createApolloClient({ isServer = false } = {}) {
    return new ApolloClient({
        ssrMode: isServer,
        link: new HttpLink({
            uri: `${process.env.NEXT_PUBLIC_URL_API}`,
            // fetchOptions: { cache: isServer ? "force-cache" : "no-store" },
            // headers: { authorization: `Bearer ${token}` },
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            }
        }),
        cache: new InMemoryCache(),
    });
}
