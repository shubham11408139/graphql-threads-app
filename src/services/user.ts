import { createHmac, randomBytes } from "node:crypto" // will generate a salt
import { prismaClient } from '../lib/db';
import  JWT from 'jsonwebtoken';

const JWT_SECRET = 'dsjfdshfds'
export interface CreateUserPayload {
   firstName : string;
   lastName?: string;
   email: string
   password: string;
}

export interface GetUserTokenPayload {
  email: string
  password: string;
}

class UserService {

 private static generateHash(salt:string, password:string){
   const hashedPassowrd = createHmac('sha256', salt).update(password).digest('hex');
   return hashedPassowrd;
  }

  public static getUserById(id:string){
    return prismaClient.user.findUnique({where : {id}})
  }

  public static  createUser(payload: CreateUserPayload){
    const { firstName, lastName, email, password } = payload;
    //Can create a validation layer here
    const salt = randomBytes(32).toString('hex');
    const hashedPassowrd = UserService.generateHash(salt, password);


    return  prismaClient.user.create({
        data: {
          firstName,
          lastName,
          email,
          salt,
          password: hashedPassowrd
        }
      })

  }

  private static getUserByEmail(email:string){
    return prismaClient.user.findUnique({ where : {email}});

  }
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email)
    if(!user){
      throw new Error('user not found')
    }
    const userSalt = user.salt;
    const userHashPassword = UserService.generateHash(userSalt, password);
    if (userHashPassword != user.password){
      throw new Error("Incorrect password");
    }
    //Generate token
    const token = JWT.sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }

  public static decodeJWTToken(token:string){
    return JWT.verify(token, JWT_SECRET);
  }
}

export default UserService;
