import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { productSchema } from "../schema/product";

import { ProductController } from "../controller/Product";
import { authenticate } from "../middleware/authenticate";
const productController = new ProductController();

export const productRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      schema: {
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          limit: z.coerce.number().min(1).max(100).default(10),
        }),
        response: {
          200: z.object({
            products: z.array(productSchema),
          }),
        },
      },
    },
    productController.getProducts
  );

  app.get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            product: productSchema,
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    productController.getProduct
  );

  app.post(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
          price: z.number(),
          category_id: z.number(),
          imageUrl: z.url(),
        }),
        response: {
          201: z.object({}),
        },
      },
    },
    productController.createProduct
  );

  app.patch(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          id: z.coerce.number(),
        }),
        body: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          category_id: z.number().optional(),
          imageUrl: z.string().url().optional(), // CORREÇÃO 3
        }),
        response: {
          204: z.object({}),
        },
      },
    },
    productController.updateProduct
  );

  app.delete(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          204: z.object({}),
        },
      },
    },
    productController.deleteProduct
  );
};
