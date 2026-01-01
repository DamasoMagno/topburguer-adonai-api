import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import z from "zod";
import { paginationSchema } from "../schema/order";
import { createProductSchema, productIdParamSchema } from "../schema/product";

export class ProductController {
  async createProduct(
    request: FastifyRequest<{
      Body: z.infer<typeof createProductSchema>;
    }>,
    reply: FastifyReply
  ) {
    const { name, description, price, category_id, imageUrl } = request.body;

    await prisma.product.create({
      data: {
        name,
        description,
        price,
        categoryId: category_id,
        imageUrl,
      },
      select: { id: true },
    });

    return reply.status(201).send({});
  }

  async getProduct(
    request: FastifyRequest<{ Params: z.infer<typeof productIdParamSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: { orderItems: true },
    });

    if (!product) {
      return reply.status(404).send({ message: "Product not found" });
    }

    return reply.status(200).send({ product });
  }

  async getProducts(
    request: FastifyRequest<{ Querystring: z.infer<typeof paginationSchema> }>,
    reply: FastifyReply
  ) {
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

  async deleteProduct(
    request: FastifyRequest<{ Params: z.infer<typeof productIdParamSchema> }>,
    reply: FastifyReply
  ) {
    const { id } = request.params;

    await prisma.product.delete({
      where: { id },
    });

    return reply.status(204).send();
  }

  async updateProduct(
    request: FastifyRequest<{
      Params: z.infer<typeof productIdParamSchema>;
      Body: z.infer<typeof createProductSchema>;
    }>,
    reply: FastifyReply
  ) {
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

  async deleteSelectProducts(request: FastifyRequest, reply: FastifyReply) {
    const { ids } = request.body as { ids: number[] };

    await prisma.product.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return reply.status(204).send();
  }
}
