
import { expressMiddleware } from '@apollo/server/express4'
import cors from 'cors';
import express from 'express';
import createApolloGraphqlServer from './graphql';
import UserService from './services/user';







async function startServer(){
  const app = express();
  const PORT = Number(process.env.PORT) || 8000
  app.use(express.json())

  const gqlServer = await createApolloGraphqlServer()

  // Specify the path where we'd like to mount our server
  app.use('/graphql', cors<cors.CorsRequest>(), expressMiddleware(gqlServer, {
    context: async ({req})=>{
      try{
        //@ts-ignore
        const token :any = req.headers["token"];
       const user = UserService.decodeJWTToken(token)
       return { user}
      }catch(err){
        return {}
      }

  }
})
  )
  app.listen(PORT, ()=> console.log(`Server is running on PORT: ${PORT}`))
}

startServer();
