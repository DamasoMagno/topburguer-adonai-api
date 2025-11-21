import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

export const productRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/", async (request, reply) => {
    const products = await prisma.product.findMany();
    return { products };
  });

  app.get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().transform((val) => parseInt(val, 10)),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        reply.status(404).send({ message: "Product not found" });
        return;
      }

      return reply.status(200).send({ product });
    }
  );

  app.post(
    "/",
    {
      schema: {
        body: z.object({
          name: z.string(),
          description: z.string().optional(),
          price: z.number(),
          category_id: z.number(),
          imageUrl: z.url(),
        }),
      },
    },
    async (request, reply) => {
      const { name, description, price, category_id, imageUrl } = request.body;

      await prisma.product.create({
        data: {
          name,
          description,
          price,
          categoryId: category_id,
          imageUrl,
        },
      });

      return reply.status(201).send();
    }
  );

  app.put(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().transform((val) => parseInt(val, 10)),
        }),
        body: z.object({
          name: z.string().optional(),
          description: z.string().optional(),
          price: z.number().optional(),
          category_id: z.number().optional(),
          imageUrl: z.url().optional(),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, description, price, category_id, imageUrl } = request.body;

      await prisma.product.update({
        where: { id },
        data: {
          name,
          description,
          price,
          categoryId: category_id,
          imageUrl,
        },
      });

      return reply.status(204).send();
    }
  );

  app.delete(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.string().transform((val) => parseInt(val, 10)),
        }),
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await prisma.product.delete({
        where: { id },
      });

      return reply.status(204).send();
    }
  );
};
