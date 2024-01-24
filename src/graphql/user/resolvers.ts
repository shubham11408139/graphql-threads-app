import UserService, { CreateUserPayload } from '../../services/user'

const queries = {
  getUserToken: async (_: any, payload: { email: string, password: string }) => {
    const token = await UserService.getUserToken({
      email: payload.email,
      password: payload.password
    })
    return token;
  },
  getCurrentLoggedInUser: async (_:any, parametes:any, context:any) => {
     if(context && context.user){
      const id = context.user.id;
      const user = await UserService.getUserById(id);
      return user;
     }
     throw new Error("I don't know who  are you")
  }
}
const mutations = {
  createUser: async(_:any, payload :CreateUserPayload)=>{
    const res = await UserService.createUser(payload);
    return res.id;
  }



}

export const resolvers = { queries, mutations }

/**
// createUser: async (_, { firstName, lastName, email, password }:
//   { firstName: string, lastName: string, email: string, password: string }) => {
//   await prismaClient.user.create({
//     data: {
//       email,
//       firstName,
//       lastName,
//       password,
//       salt: "random_salt"
//     }
//   })
//   return true;
// }

 */
