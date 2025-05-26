import { ApolloClient, InMemoryCache } from '@apollo/client'
import possibleTypesResult from './possibleTypes'

const url = process.env.NEXT_PUBLIC_API_BASE_URL || ''

const client = new ApolloClient({
  uri: `${url}/graphql`,
  cache: new InMemoryCache({ 
    possibleTypes: possibleTypesResult.possibleTypes,
    typePolicies: {
      Query: {
        fields: {
          users: {
            // Don't cache different results based on offset/limit arguments
            keyArgs: ["term", "onlyBasicInformation"],
            merge(existing, incoming, { args }) {
              const offset = (args?.offset as number) || 0;
              // Create a copy of existing array or empty array
              const merged = existing ? existing.list.slice(0) : [];
              
              // Insert incoming items at the correct offset
              for (let i = 0; i < incoming.list.length; ++i) {
                merged[offset + i] = incoming.list[i];
              }
              
              return {
                total: incoming.total,
                list: merged,
              };
            },
          },
          companies: {
            // Don't cache different results based on offset/limit arguments
            keyArgs: ["term"],
            merge(existing, incoming, { args }) {
              const offset = (args?.offset as number) || 0;
              // Create a copy of existing array or empty array
              const merged = existing ? existing.list.slice(0) : [];
              
              // Insert incoming items at the correct offset
              for (let i = 0; i < incoming.list.length; ++i) {
                merged[offset + i] = incoming.list[i];
              }
              
              return {
                total: incoming.total,
                list: merged,
              };
            },
          },
        },
      },
    },
  }),
  credentials: 'include',
})

export default client
