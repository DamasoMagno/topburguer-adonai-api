import fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import jwt from "@fastify/jwt";
import scalar from "@scalar/fastify-api-reference";
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { env } from "./env";

import { productRoutes } from "./routes/product";
import { categoryRoutes } from "./routes/category";
import { userRoutes } from "./routes/user";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: "*",
});

app.register(jwt, {
  secret: env.SECRET_KEY,
});

app.register(swagger, {
  openapi: {
    info: {
      title: "API TopBurguer",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(scalar, {
  routePrefix: "/docs",
});

app.register(productRoutes, {
  prefix: "/product",
});

app.register(userRoutes, {
  prefix: "/user",
});

app.register(categoryRoutes, {
  prefix: "/category",
});

app.listen({ port: env.PORT, host: env.HOST }, (error) => {
  if (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }

  console.log(`Server listening at http://localhost:${env.PORT}`);
  console.log(`Docs available at http://localhost:${env.PORT}/docs`);
});
