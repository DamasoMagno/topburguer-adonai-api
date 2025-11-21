import fastify from "fastify";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import jwt from "@fastify/jwt";
import scalar from "@scalar/fastify-api-reference";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

import { productRoutes } from "./routes/product";
import { categoryRoutes } from "./routes/category";

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(cors, {
  origin: "*",
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

app.register(jwt, {
  secret: "your-secret-key",
});

app.register(productRoutes, {
  prefix: "/products",
});

app.register(categoryRoutes, {
  prefix: "/categories",
});

app.listen({ port: 3000 }, () => {
  console.log(`Server listening at http://localhost:3000`);
  console.log(`Docs available at http://localhost:3000/docs`);
});
