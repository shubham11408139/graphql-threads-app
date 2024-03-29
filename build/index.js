"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./lib/db");
//Create GraphQL server
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const PORT = Number(process.env.PORT) || 8000;
        app.use(express_1.default.json());
        const gqlServer = new server_1.ApolloServer({
            typeDefs: `
      type Query {
        hello : String
        say(name:String): String
      }
      type Mutation {
        createUser(firstName:String!, lastName:String!, email:String!, password: String!) : Boolean
      }

      `, //Schema
            resolvers: {
                Query: {
                    hello: () => `Hey there I am graphQL server`,
                    say: (_, { name }) => `Hey !! My name is ${name}`
                },
                Mutation: {
                    createUser: (_, { firstName, lastName, email, password }) => __awaiter(this, void 0, void 0, function* () {
                        yield db_1.prismaClient.user.create({
                            data: {
                                email,
                                firstName,
                                lastName,
                                password,
                                salt: "random_salt"
                            }
                        });
                        return true;
                    })
                }
            }
        });
        // Note you must call `start()` on the `ApolloServer`
        // instance before passing the instance to `expressMiddleware`
        yield gqlServer.start();
        // Specify the path where we'd like to mount our server
        app.use('/graphql', (0, cors_1.default)(), (0, express4_1.expressMiddleware)(gqlServer));
        app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`));
    });
}
startServer();
