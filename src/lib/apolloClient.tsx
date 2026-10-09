import {
    ApolloClient,
    HttpLink,
    InMemoryCache,
    Observable,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

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

export const SESSION_EXPIRED_MESSAGE =
    "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.";

/** With `errorPolicy: "all"`, mutation promises resolve (not reject) on
 *  GraphQL errors — call this to turn them into thrown errors. */
export function throwIfGraphQLErrors(result: {
    errors?: ReadonlyArray<{ message?: string } | Error> | null;
}): void {
    const first = result?.errors?.[0];
    if (!first) return;
    if (first instanceof Error) throw first;
    throw new Error(
        typeof first?.message === "string" && first.message
            ? first.message
            : "Request failed. Please try again.",
    );
}

// Single-flight session refresh shared by concurrent retried operations.
let refreshing: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
    if (!refreshing) {
        refreshing = fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        })
            .then((res) => res.ok)
            .catch(() => false)
            .finally(() => {
                refreshing = null;
            });
    }
    return refreshing;
}

function isUnauthorizedError(message: string): boolean {
    return /unauthorized|unauthenticated|jwt|expired|invalid.*token|please (log|sign) in/i.test(
        message,
    );
}

/**
 * Client-only link: when the backend rejects an operation with an auth
 * error (typically an expired access token on a page the middleware doesn't
 * cover), silently refresh the session once and retry the operation.
 * The retried request goes through /api/graphql, which reads the FRESH
 * httpOnly cookie — no token handling in JS needed.
 */
function createAuthErrorLink() {
    return onError(({ graphQLErrors, operation, forward }) => {
        const unauthorized = graphQLErrors?.some((error) =>
            isUnauthorizedError(error.message),
        );
        if (!unauthorized) return;
        if (operation.getContext().hasRetriedAuth) return;
        operation.setContext({ hasRetriedAuth: true });

        return new Observable((observer) => {
            refreshSession().then((ok) => {
                if (!ok) {
                    observer.error(new Error(SESSION_EXPIRED_MESSAGE));
                    return;
                }
                forward(operation).subscribe({
                    next: (value) => observer.next(value),
                    error: (error) => observer.error(error),
                    complete: () => observer.complete(),
                });
            });
        });
    });
}

export function createApolloClient({
    isServer = false,
    headers,
}: CreateClientOptions = {}) {
    // Browser goes through the same-origin /api/graphql proxy so httpOnly
    // auth cookies reach the backend (cross-origin cookies are never sent).
    // Server components call the backend directly (public queries need no
    // auth, and relative URLs don't work server-side).
    // NOTE: during SSR prerender there is no `window`, so fall back to the
    // absolute backend URL — a relative URL makes fetch() throw
    // "Failed to parse URL from /api/graphql" on the server.
    const uri =
        isServer || typeof window === "undefined"
            ? getApiUri()
            : `${window.location.origin}/api/graphql`;
    const httpLink = new HttpLink({
        uri,
        // Send httpOnly auth cookies to the API on both server & client.
        // Without this, authenticated mutations go out unauthenticated.
        credentials: "include",
        headers,
    });
    return new ApolloClient({
        ssrMode: isServer,
        // The retry link only exists in the browser (it calls a relative
        // URL that doesn't resolve server-side).
        link: isServer ? httpLink : createAuthErrorLink().concat(httpLink),
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
