import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

import { paginationSchema } from "../schema/order";
import {
  categoryIdParamSchema,
  createCategorySchema,
} from "../schema/category";

export class CategoryController {
  async createCategory(request: FastifyRequest, reply: FastifyReply) {
    const { name } = createCategorySchema.parse(request.body);

    await prisma.category.create({
      data: {
        name,
      },
      select: { id: true },
    });

    return reply.status(201).send({});
  }

  async getCategory(request: FastifyRequest, reply: FastifyReply) {
    const { id } = categoryIdParamSchema.parse(request.params);

    const category = await prisma.category.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!category) {
      return reply.status(404).send({ message: "Category not found" });
    }

    return reply.status(200).send({ category });
  }

  async getCategories(request: FastifyRequest, reply: FastifyReply) {
    const { page, limit } = paginationSchema.parse(request.query);

    const take = limit;
    const skip = (page - 1) * limit;

    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      take,
      skip,
    });

    return reply.status(200).send({ categories });
  }

  async deleteCategory(request: FastifyRequest, reply: FastifyReply) {
    const { id } = categoryIdParamSchema.parse(request.params);

    await prisma.category.delete({
      where: { id },
    });

    return reply.status(204).send();
  }

  async updateCategory(request: FastifyRequest, reply: FastifyReply) {
    const { id } = categoryIdParamSchema.parse(request.params);
    const { name } = createCategorySchema.parse(request.body);

    await prisma.category.update({
      where: { id },
      data: {
        name,
      },
    });

    return reply.status(204).send();
  }

  async deleteSelectCategories(request: FastifyRequest, reply: FastifyReply) {
    const { ids } = request.body as { ids: number[] };

    await prisma.category.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return reply.status(204).send();
  }
}
