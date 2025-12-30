import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { UserController } from "../controller/User";
import { z } from "zod";

export const authSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export const registerSchema = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string().optional(),
});

export const addressSchema = z.object({
  street: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  country: z.string(),
});

const userController = new UserController();

export const userRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post(
    "/auth",
    {
      schema: {
        body: authSchema,
      },
    },
    userController.authenticateUser.bind(userController)
  );

  app.post(
    "/register",
    {
      schema: {
        body: registerSchema,
      },
    },
    userController.createUser.bind(userController)
  );

  app.post(
    "/register-address",
    {
      schema: {
        body: addressSchema,
      },
    },
    userController.registerAddress.bind(userController)
  );
};
