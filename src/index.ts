
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors';
import express from 'express';
import createApolloGraphqlServer from './graphql';







async function startServer(){
  const app = express();
  const PORT = Number(process.env.PORT) || 8000
  app.use(express.json())

  const gqlServer = await createApolloGraphqlServer()

  // Specify the path where we'd like to mount our server
  app.use('/graphql', cors<cors.CorsRequest>(), expressMiddleware(gqlServer));
  app.listen(PORT, ()=> console.log(`Server is running on PORT: ${PORT}`))
}

startServer();
