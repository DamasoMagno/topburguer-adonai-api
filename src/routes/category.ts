import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";

import { prisma } from "../lib/prisma";
import { authenticate } from "../middleware/authenticate";

const paginationSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

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
    async (request, reply) => {
      const { page, limit } = request.query;

      const take = limit;
      const skip = (page - 1) * limit;

      const categories = await prisma.category.findMany({
        take,
        skip,
      });

      return reply.status(200).send({ categories });
    }
  );

  app.get(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          id: z.string().transform((val) => parseInt(val, 10)),
        }),
        response: {
          200: {
            category: z.object({
              id: z.number(),
              name: z.string(),
              createdAt: z.date(),
              updatedAt: z.date(),
            }),
          },
          404: z.object({ message: z.string() }),
        },
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

      return reply.status(200).send({ category });
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
        response: {
          201: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body;

      await prisma.category.create({
        data: {
          name,
        },
      });

      return reply.status(201).send();
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
        response: {
          204: z.object({}),
        },
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

      return reply.status(204).send();
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
        response: {
          204: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await prisma.category.delete({
        where: { id },
      });

      return reply.status(204).send();
    }
  );
};
