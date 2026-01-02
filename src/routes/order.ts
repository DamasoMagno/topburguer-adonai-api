import z from "zod";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

import { orderSchema } from "../schema/order";

import { OrderController } from "../controller/Order";
import { authenticate } from "../middleware/authenticate";
const orderController = new OrderController();

export const orderRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get(
    "/",
    {
      preHandler: [authenticate],
      schema: {
        querystring: z.object({
          page: z.coerce.number().min(1).default(1),
          limit: z.coerce.number().min(1).max(100).default(10),
        }),
        response: {
          200: z.object({
            orders: z.array(orderSchema),
          }),
        },
      },
    },
    orderController.getOrders
  );

  app.get(
    "/:id",
    {
      preHandler: [authenticate],
      schema: {
        params: z.object({
          id: z.coerce.number(),
        }),
        response: {
          200: z.object({
            order: orderSchema,
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    orderController.getOrder
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
          201: z.object({}),
        },
      },
    },
    orderController.createOrder
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
    orderController.deleteOrder
  );
};
