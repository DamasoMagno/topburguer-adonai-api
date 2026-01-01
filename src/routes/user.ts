import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserController } from "../controller/User";
import { authSchema, registerSchema, addressSchema } from "../schema/user";

const userController = new UserController();

export const userRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/auth",
    {
      schema: {
        body: authSchema,
      },
    },
    userController.authenticateUser
  );

  app.post(
    "/register",
    {
      schema: {
        body: registerSchema,
      },
    },
    userController.createUser
  );

  app.post(
    "/register-address",
    {
      schema: {
        body: addressSchema,
      },
    },
    userController.registerAddress
  );
};
