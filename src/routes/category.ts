import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/authenticate";

export const categoryRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/", async (request, reply) => {
    const categories = await prisma.category.findMany();
    return { categories };
  });

  app.get(
    "/:id",

    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          id: z.string().transform((val) => parseInt(val, 10)),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        reply.status(404).send({ message: "Category not found" });
        return;
      }

      return { category };
    }
  );

  app.post(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        body: z.object({
          name: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { name } = request.body;

      await prisma.category.create({
        data: {
          name,
        },
      });

      return { message: "Category created" };
    }
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
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;

      await prisma.category.update({
        where: { id },
        data: {
          name,
        },
      });

      return { message: "Category updated" };
    }
  );

  app.delete(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          id: z.string().transform((val) => parseInt(val, 10)),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await prisma.category.delete({
        where: { id },
      });

      return { message: "Category deleted" };
    }
  );
};
