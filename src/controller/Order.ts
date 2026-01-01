import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import z from "zod";
import {
  orderIdParamSchema,
  orderSchema,
  paginationSchema,
} from "../schema/order";

export class OrderController {
  async createOrder(
    request: FastifyRequest<{
      Body: z.infer<typeof orderSchema>;
    }>,
    reply: FastifyReply
  ) {
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

  async getOrder(
    request: FastifyRequest<{ Params: z.infer<typeof orderIdParamSchema> }>,
    reply: FastifyReply
  ) {
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

  async getOrders(
    request: FastifyRequest<{ Querystring: z.infer<typeof paginationSchema> }>,
    reply: FastifyReply
  ) {
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

  async deleteOrder(
    request: FastifyRequest<{ Params: z.infer<typeof orderIdParamSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    await prisma.order.delete({
      where: { id },
    });

    return reply.status(204).send();
  }
}
