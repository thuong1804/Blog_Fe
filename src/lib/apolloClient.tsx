import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";

type CreateClientOptions = {
    isServer?: boolean;
    /** Forwarded headers for server-side queries (e.g. cookies from
     *  next/headers). `credentials: "include"` alone does nothing on
     *  the server. */
    headers?: Record<string, string>;
};

function getApiUri(): string {
    const uri = process.env.NEXT_PUBLIC_URL_API;
    if (!uri) {
        throw new Error(
            "Missing NEXT_PUBLIC_URL_API — GraphQL endpoint is not configured.",
        );
    }
    return uri;
}

export function createApolloClient({
    isServer = false,
    headers,
}: CreateClientOptions = {}) {
    // Browser goes through the same-origin /api/graphql proxy so httpOnly
    // auth cookies reach the backend (cross-origin cookies are never sent).
    // Server components call the backend directly (public queries need no
    // auth, and relative URLs don't work server-side).
    const uri = isServer ? getApiUri() : "/api/graphql";
    return new ApolloClient({
        ssrMode: isServer,
        link: new HttpLink({
            uri,
            // Send httpOnly auth cookies to the API on both server & client.
            // Without this, authenticated mutations go out unauthenticated.
            credentials: "include",
            headers,
        }),
        cache: new InMemoryCache({
            typePolicies: {
                Query: {
                    fields: {
                        // Paginated lists: keep each arg-combination separate
                        // instead of last-write-wins on one field.
                        posts: {
                            keyArgs: [
                                "categorySlug",
                                "search",
                                "tag",
                                "page",
                                "pageSize",
                            ],
                            merge: (_existing, incoming) => incoming,
                        },
                        postsLatest: {
                            keyArgs: ["skip", "take"],
                            merge: (_existing, incoming) => incoming,
                        },
                        popularPosts: {
                            keyArgs: false,
                            merge: (_existing, incoming) => incoming,
                        },
                    },
                },
                // NOTE: no explicit keyFields here on purpose. Some queries
                // intentionally select id-less objects (e.g. postAllSlugs
                // selects category { slug }, list items select
                // category { name }) — explicit keyFields: ["id"] would
                // throw "Missing field 'id' while computing key fields".
                // The default policy already normalizes objects that DO
                // have an id and embeds the rest, which is what we want.
            },
        }),
        defaultOptions: {
            watchQuery: {
                fetchPolicy: "cache-first",
                errorPolicy: "all",
            },
            query: {
                errorPolicy: "all",
            },
        },
    });
}
