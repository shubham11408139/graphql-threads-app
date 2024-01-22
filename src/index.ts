import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors';
import express from 'express';
import { prismaClient } from "./lib/db"





//Create GraphQL server
async function startServer(){
  const app = express();
  const PORT = Number(process.env.PORT) || 8000
  app.use(express.json())
  const gqlServer = new ApolloServer({
    typeDefs:`
      type Query {
        hello : String
        say(name:String): String
      }
      type Mutation {
        createUser(firstName:String!, lastName:String!, email:String!, password: String!) : Boolean
      }

      `,//Schema

    resolvers:{
      Query:{
        hello : ()=> `Hey there I am graphQL server`,
        say: (_,{name} : {name: String})=>`Hey !! My name is ${name}`
      },
      Mutation: {
        createUser: async (_, {firstName, lastName, email, password}:
          { firstName: string, lastName: string, email: string, password:string}) =>{
            await prismaClient.user.create({
              data: {
                email,
                firstName,
                lastName,
                password,
                salt:"random_salt"
              }
            })
            return true;
          }
      }
    }
  })
  // Note you must call `start()` on the `ApolloServer`
  // instance before passing the instance to `expressMiddleware`
  await gqlServer.start();
  // Specify the path where we'd like to mount our server
  app.use('/graphql', cors<cors.CorsRequest>(), expressMiddleware(gqlServer));
  app.listen(PORT, ()=> console.log(`Server is running on PORT: ${PORT}`))
}

startServer();
