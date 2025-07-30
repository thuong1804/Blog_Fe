import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

export function createApolloClient({ isServer = false } = {}) {
  return new ApolloClient({
    ssrMode: isServer,
    link: new HttpLink({
      uri: `${process.env.NEXT_PUBLIC_URL_API}/graphql`,
      fetchOptions: { cache: 'no-store' },
      // headers: { authorization: `Bearer ${token}` },
    }),
    cache: new InMemoryCache(),
  });
}