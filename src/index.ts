import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors';
import express from 'express';





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
      }`,//Schema
    resolvers:{
      Query:{
        hello : ()=> `Hey there I am graphQL server`,
        say: (_,{name} : {name: String})=>`Hey !! My name is ${name}`
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
