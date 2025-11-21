import "@fastify/jwt";

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: number; // O ID do usuário (no seu schema é Int)
      name: string;
      email: string;
    };
  }
}
