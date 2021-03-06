import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { /*signOut,*/ checkCookies } from './user';

const httpLink = new HttpLink({
    uri: '/api/graphql',
    credentials: 'include',
    // TODO: Replace this custom fetch cookie logic with a custom link:
    fetch: (input: RequestInfo, init?: RequestInit) =>
        fetch(input, init).then(res => {
            if (checkCookies()) {
                client.cache.reset();
            }
            return res;
        }),
});

const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});

export default client;
