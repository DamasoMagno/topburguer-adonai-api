import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

const productSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().nullable(),
  price: z.number(),
  categoryId: z.number(),
  imageUrl: z.url().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

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
            // CORREÇÃO 1: z.object envolvendo a resposta
            products: z.array(productSchema),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;

      const take = limit;
      const skip = (page - 1) * limit;

      const products = await prisma.product.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          categoryId: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
        },
        take,
        skip,
      });

      return reply.status(200).send({ products });
    }
  );

  app.get(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.coerce.number(), // Dica: use z.coerce.number() ao invés de transform manual
        }),
        response: {
          200: z.object({
            // CORREÇÃO 2: z.object envolvendo a resposta
            product: productSchema, // Usa o schema diretamente
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return reply.status(404).send({ message: "Product not found" });
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
          imageUrl: z.string().url(), // CORREÇÃO 3: z.string().url()
        }),
        response: {
          201: z.object({}), // Retorno vazio mas válido
        },
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

      return reply.status(201).send({});
    }
  );

  app.put(
    "/:id",
    {
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

      return reply.status(204).send({});
    }
  );

  app.delete(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          204: z.object({}),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await prisma.product.delete({
        where: { id },
      });

      return reply.status(204).send({});
    }
  );
};
