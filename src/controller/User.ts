import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";
import { compare } from "bcryptjs";
import z from "zod";
import { addressSchema, authSchema, registerSchema } from "../schema/user";

export class UserController {
  async createUser(
    request: FastifyRequest<{ Body: z.infer<typeof registerSchema> }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (!userExists) {
      reply.status(404).send({ message: "User not found" });
      return;
    }

    const isPasswordValid = await compare(password, userExists.password);

    if (!isPasswordValid) {
      reply.status(401).send({ message: "Invalid password" });
      return;
    }

    const token = await reply.jwtSign({
      sub: userExists.id,
      name: userExists.name,
      email: userExists.email,
    });
    return reply.status(201).send({ token });
  }

  async authenticateUser(
    request: FastifyRequest<{ Body: z.infer<typeof authSchema> }>,
    reply: FastifyReply
  ) {
    const { email, password } = request.body;

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (!userExists) {
      reply.status(404).send({ message: "User not found" });
      return;
    }

    const isPasswordValid = await compare(password, userExists.password);

    if (!isPasswordValid) {
      reply.status(401).send({ message: "Invalid password" });
      return;
    }

    const token = await reply.jwtSign({
      sub: userExists.id,
      name: userExists.name,
      email: userExists.email,
    });

    return reply.status(200).send({ token });
  }

  async registerAddress(
    request: FastifyRequest<{ Body: z.infer<typeof addressSchema> }>,
    reply: FastifyReply
  ) {
    const user = request.user;
    const { street, city, state, zipCode, country } = request.body;

    await prisma.userAddress.create({
      data: {
        userId: user.sub,
        street,
        city,
        state,
        zipCode,
        country,
      },
    });

    return reply.status(201).send({ message: "Address registered" });
  }
}
