const queries = {}
const mutations = {
  createUser: async(_:any, {  }:{})=>{
    return 'randomId'
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
