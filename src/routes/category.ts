import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { authenticate } from "../middleware/authenticate";

import { paginationSchema } from "../schema/pagination";
import { categoryIdParamSchema, categorySchema } from "../schema/category";

import { CategoryController } from "../controller/Category";
const categoryController = new CategoryController();

export const categoryRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      schema: {
        querystring: paginationSchema,
        response: {
          200: {
            categories: z.array(categorySchema),
          },
        },
      },
    },
    categoryController.getCategories
  );

  app.get(
    "/:id",
    {
      schema: {
        params: categoryIdParamSchema,
        response: {
          200: {
            category: categorySchema,
          },
          404: z.object({ message: z.string() }),
        },
      },
    },
    categoryController.getCategory
  );

  app.post(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        body: z.object({
          name: z.string(),
        }),
        response: {
          201: z.object({}),
        },
      },
    },
    categoryController.createCategory
  );

  app.put(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          id: z.string().transform((val) => parseInt(val, 10)),
        }),
        body: z.object({
          name: z.string().optional(),
        }),
        response: {
          204: z.object({}),
        },
      },
    },
    categoryController.updateCategory
  );

  app.delete(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          id: z.string().transform((val) => parseInt(val, 10)),
        }),
        response: {
          204: z.object({}),
        },
      },
    },
    categoryController.deleteCategory
  );
};
