import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";

const orderSchema = z.object({
  id: z.number(),
  status: z.string(),
  isCancelled: z.boolean(),
  totalPrice: z.number(),
  observations: z.string().nullable(),
  orderItems: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const orderRoutes: FastifyPluginAsyncZod = async (app) => {
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
            orders: z.array(orderSchema),
          }),
        },
      },
    },
    async (request, reply) => {
      const { page, limit } = request.query;

      const take = limit;
      const skip = (page - 1) * limit;

      const orders = await prisma.order.findMany({
        select: {
          id: true,
          status: true,
          isCancelled: true,
          totalPrice: true,
          observations: true,
          orderItems: true,
          createdAt: true,
          updatedAt: true,
        },
        take,
        skip,
      });

      return reply.status(200).send({ orders });
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
            order: orderSchema,
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const order = await prisma.order.findUnique({
        where: { id },
        include: { orderItems: true },
      });

      if (!order) {
        return reply.status(404).send({ message: "Order not found" });
      }

      return reply.status(200).send({ order });
    }
  );

  app.post(
    "/",
    {
      schema: {
        body: z.object({
          status: z.string(),
          isCancelled: z.boolean(),
          totalPrice: z.number(),
          userId: z.number(),
          observations: z.string().optional(),
          orderItems: z.array(
            z.object({
              productId: z.number(),
              quantity: z.number(),
              price: z.number(),
            })
          ),
        }),
        response: {
          201: z.object({}), // Retorno vazio mas válido
        },
      },
    },
    async (request, reply) => {
      const {
        status,
        isCancelled,
        totalPrice,
        observations,
        orderItems,
        userId,
      } = request.body;

      await prisma.order.create({
        data: {
          totalPrice,
          status,
          isCancelled,
          userId,
          observations,
          orderItems: {
            create: orderItems,
          },
        },
        select: { id: true },
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
