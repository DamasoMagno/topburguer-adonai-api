import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

import {
  orderIdParamSchema,
  orderSchema,
  paginationSchema,
} from "../schema/order";

export class OrderController {
  async createOrder(request: FastifyRequest, reply: FastifyReply) {
    const {
      status,
      isCancelled,
      totalPrice,
      observations,
      orderItems,
      userId,
    } = orderSchema.parse(request.body);

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

  async getOrder(request: FastifyRequest, reply: FastifyReply) {
    const { id } = orderIdParamSchema.parse(request.params);

    const order = await prisma.order.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!order) {
      return reply.status(404).send({ message: "Order not found" });
    }

    return reply.status(200).send({ order });
  }

  async getOrders(request: FastifyRequest, reply: FastifyReply) {
    const { page, limit } = paginationSchema.parse(request.query);

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

  async deleteOrder(request: FastifyRequest, reply: FastifyReply) {
    const { id } = orderIdParamSchema.parse(request.params);

    await prisma.order.delete({
      where: { id },
    });

    return reply.status(204).send();
  }
}
