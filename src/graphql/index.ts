import { ApolloServer } from '@apollo/server'
import {User} from "./user"

// import { prismaClient } from "../lib/db"


async function createApolloGraphqlServer(){
  const gqlServer = new ApolloServer({
    typeDefs: `
      ${User.typedefs}
      type Query {
        ${User.queries}
       
      }
      type Mutation {
        ${User.mutations}
      }

      `,//Schema

    resolvers: {
      Query: {
        ...User.resolvers.queries,
        // hello: () => `Hey there I am graphQL server`,
        // say: (_, { name }: { name: String }) => `Hey !! My name is ${name}`
      },
      Mutation: {
        ...User.resolvers.mutations
      }
    }
  })
  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await gqlServer.start();
  return gqlServer;
}

export default createApolloGraphqlServer
