import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import z from "zod";
import { paginationSchema } from "../schema/order";
import {
  categoryIdParamSchema,
  createCategorySchema,
} from "../schema/category";

export class CategoryController {
  async createCategory(request: FastifyRequest, reply: FastifyReply) {
    const { name } = request.body as { name: string };

    await prisma.category.create({
      data: {
        name,
      },
      select: { id: true },
    });

    return reply.status(201).send({});
  }

  async getCategory(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };

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
    const { page, limit } = request.query as { page: number; limit: number };

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
    const { id } = request.params as { id: number };

    await prisma.category.delete({
      where: { id },
    });

    return reply.status(204).send();
  }

  async updateCategory(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: number };
    const { name } = request.body as { name: string };

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
